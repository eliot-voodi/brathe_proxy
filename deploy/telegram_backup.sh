#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${PROJECT_DIR}/.env"

CRON_TAG="# proxy-admin-panel-telegram-backup"
CRON_SCHEDULE_DEFAULT="10 3 * * *"
KEEP_LAST=8

usage() {
  cat <<'EOF'
Usage:
  bash deploy/telegram_backup.sh [options]

Options:
  --env-file PATH          Path to .env (default: /opt/proxy-admin-panel/.env)
  --chat-id ID             Telegram chat_id (optional, can be from .env)
  --bot-token TOKEN        Telegram bot token (optional, can be from .env)
  --topic-id ID            Telegram forum topic id (message_thread_id), optional
  --install-cron           Install/update daily cron entry
  --cron-schedule EXPR     Cron expression for --install-cron (default: 10 3 * * *)
  --help                   Show this help

Required configuration (in .env or args):
  TELEGRAM_CHAT_ID
  TELEGRAM_BOT_TOKEN
Optional:
  TELEGRAM_TOPIC_ID

What script does on backup run:
  1) Cleans DB from stale rows (cleanup_db.py)
  2) Creates SQLite backup file
  3) Compresses backup to .gz and sends it to Telegram
  4) Removes old local files, keeping only last 8 backups
EOF
}

CHAT_ID="${TELEGRAM_CHAT_ID:-}"
BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TOPIC_ID="${TELEGRAM_TOPIC_ID:-}"
INSTALL_CRON=0
CRON_SCHEDULE="${CRON_SCHEDULE_DEFAULT}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file)
      ENV_FILE="${2:-}"
      shift 2
      ;;
    --chat-id)
      CHAT_ID="${2:-}"
      shift 2
      ;;
    --bot-token)
      BOT_TOKEN="${2:-}"
      shift 2
      ;;
    --topic-id)
      TOPIC_ID="${2:-}"
      shift 2
      ;;
    --install-cron)
      INSTALL_CRON=1
      shift
      ;;
    --cron-schedule)
      CRON_SCHEDULE="${2:-}"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

load_env_file() {
  if [[ -f "${ENV_FILE}" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "${ENV_FILE}"
    set +a
  fi
}

validate_config() {
  if [[ -z "${CHAT_ID}" ]]; then
    CHAT_ID="${TELEGRAM_CHAT_ID:-}"
  fi
  if [[ -z "${BOT_TOKEN}" ]]; then
    BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
  fi
  if [[ -z "${TOPIC_ID}" ]]; then
    TOPIC_ID="${TELEGRAM_TOPIC_ID:-}"
  fi
  if [[ -z "${CHAT_ID}" ]]; then
    echo "ERROR: TELEGRAM_CHAT_ID is not set (.env or --chat-id)." >&2
    exit 1
  fi
  if [[ -z "${BOT_TOKEN}" ]]; then
    echo "ERROR: TELEGRAM_BOT_TOKEN is not set (.env or --bot-token)." >&2
    exit 1
  fi
}

install_cron_job() {
  local script_path cron_line tmp_file
  script_path="${PROJECT_DIR}/deploy/telegram_backup.sh"
  cron_line="${CRON_SCHEDULE} bash ${script_path} --env-file ${ENV_FILE} ${CRON_TAG}"

  tmp_file="$(mktemp)"
  {
    crontab -l 2>/dev/null || true
  } | awk -v tag="${CRON_TAG}" 'index($0, tag)==0' > "${tmp_file}"
  echo "${cron_line}" >> "${tmp_file}"
  crontab "${tmp_file}"
  rm -f "${tmp_file}"
  echo "Cron job installed/updated:"
  echo "${cron_line}"
}

create_sqlite_backup() {
  local db_path="$1"
  local backup_path="$2"
  python3 - "$db_path" "$backup_path" <<'PY'
import sqlite3
import sys

src, dst = sys.argv[1], sys.argv[2]
src_conn = sqlite3.connect(src)
try:
    dst_conn = sqlite3.connect(dst)
    try:
        src_conn.backup(dst_conn)
    finally:
        dst_conn.close()
finally:
    src_conn.close()
PY
}

send_to_telegram() {
  local file_path="$1"
  local caption="$2"
  local response_file
  local -a curl_args
  response_file="$(mktemp)"
  curl_args=(
    -fsS
    -o "${response_file}"
    -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendDocument"
    -F "chat_id=${CHAT_ID}"
    -F "caption=${caption}"
    -F "document=@${file_path}"
  )
  if [[ -n "${TOPIC_ID}" ]]; then
    curl_args+=(-F "message_thread_id=${TOPIC_ID}")
  fi
  if ! curl "${curl_args[@]}" >/dev/null; then
    rm -f "${response_file}"
    return 1
  fi

  if ! python3 - "${response_file}" <<'PY'
import json
import sys

path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)
if not data.get("ok"):
    raise SystemExit(1)
PY
  then
    rm -f "${response_file}"
    return 1
  fi
  rm -f "${response_file}"
}

rotate_backups() {
  local backup_dir="$1"
  local -a files
  shopt -s nullglob
  files=("${backup_dir}"/panel-telegram-backup-*.db "${backup_dir}"/panel-telegram-backup-*.db.gz)
  shopt -u nullglob
  if (( ${#files[@]} <= KEEP_LAST )); then
    return
  fi

  mapfile -t files < <(printf '%s\n' "${files[@]}" | sort -r)
  local i
  for (( i=KEEP_LAST; i<${#files[@]}; i++ )); do
    rm -f -- "${files[$i]}"
  done
}

run_cleanup_before_backup() {
  local db_path="$1"
  local cleanup_script db_url
  cleanup_script="${PROJECT_DIR}/backend/app/cleanup_db.py"
  db_url="sqlite:////${db_path#/}"

  if [[ ! -f "${cleanup_script}" ]]; then
    echo "ERROR: Cleanup script not found: ${cleanup_script}" >&2
    exit 1
  fi

  echo "Running DB cleanup before Telegram backup..."
  # Backup is created by this script, so cleanup step skips its own backup file.
  python3 "${cleanup_script}" --database-url "${db_url}" --skip-backup
}

run_backup() {
  local panel_data_dir db_path backup_dir ts backup_file archive_file caption
  panel_data_dir="${PANEL_DATA_HOST_PATH:-${PROJECT_DIR}/data}"
  db_path="${panel_data_dir}/panel.db"
  backup_dir="${panel_data_dir}/backups/telegram"
  ts="$(date -u +%Y%m%d-%H%M%S)"
  backup_file="${backup_dir}/panel-telegram-backup-${ts}.db"
  archive_file="${backup_file}.gz"

  if [[ ! -f "${db_path}" ]]; then
    echo "ERROR: DB not found: ${db_path}" >&2
    exit 1
  fi

  run_cleanup_before_backup "${db_path}"
  mkdir -p "${backup_dir}"
  create_sqlite_backup "${db_path}" "${backup_file}"
  gzip -c "${backup_file}" > "${archive_file}"
  rm -f "${backup_file}"

  caption="Proxy Admin backup ${ts} UTC"
  if ! send_to_telegram "${archive_file}" "${caption}"; then
    echo "ERROR: Failed to send backup to Telegram." >&2
    exit 1
  fi

  rotate_backups "${backup_dir}"
  echo "Backup sent to Telegram: ${archive_file}"
}

load_env_file
validate_config

if (( INSTALL_CRON == 1 )); then
  install_cron_job
  exit 0
fi

run_backup
