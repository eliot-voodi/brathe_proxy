#!/usr/bin/env bash
# Configure Telegram change notifications + in-panel backup schedule (via VLESS/SOCKS).
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${PROJECT_DIR}/.env"

BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
CHAT_ID="${TELEGRAM_CHAT_ID:-}"
TOPIC_ID="${TELEGRAM_TOPIC_ID:-}"
SCHEDULE="${TELEGRAM_BACKUP_SCHEDULE:-09:00,20:00}"
RETENTION_DAYS="${TELEGRAM_BACKUP_RETENTION_DAYS:-7}"
SEND_TEST="${SEND_TEST:-1}"
ENABLE_PANEL_SCHEDULE="${ENABLE_PANEL_SCHEDULE:-1}"
REMOVE_HOST_CRON="${REMOVE_HOST_CRON:-1}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bot-token) BOT_TOKEN="${2:-}"; shift 2 ;;
    --chat-id) CHAT_ID="${2:-}"; shift 2 ;;
    --topic-id) TOPIC_ID="${2:-}"; shift 2 ;;
    --schedule) SCHEDULE="${2:-}"; shift 2 ;;
    --retention-days) RETENTION_DAYS="${2:-}"; shift 2 ;;
    --no-test) SEND_TEST=0; shift ;;
    --keep-cron) REMOVE_HOST_CRON=0; shift ;;
    --help|-h)
      cat <<'EOF'
Usage:
  bash deploy/setup_telegram_notify.sh --bot-token TOKEN --chat-id ID --topic-id ID

Writes TELEGRAM_* into .env, rebuilds backend, enables in-panel backup schedule
(Europe/Moscow, default 09:00,20:00), keeps local backups 7 days, sends via VLESS/SOCKS.
Removes host cron telegram-backup entries (panel worker is the source of truth).
EOF
      exit 0
      ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "${BOT_TOKEN}" || -z "${CHAT_ID}" ]]; then
  echo "ERROR: --bot-token and --chat-id are required" >&2
  exit 1
fi

cd "${PROJECT_DIR}"

python3 - "${ENV_FILE}" "${BOT_TOKEN}" "${CHAT_ID}" "${TOPIC_ID}" "${RETENTION_DAYS}" <<'PY'
from pathlib import Path
import sys
path, token, chat, topic, retention = Path(sys.argv[1]), sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]
vals = {
    "TELEGRAM_BOT_TOKEN": token,
    "TELEGRAM_CHAT_ID": chat,
    "TELEGRAM_VIA_SOCKS": "true",
    "TELEGRAM_BACKUP_TZ": "Europe/Moscow",
    "TELEGRAM_BACKUP_RETENTION_DAYS": retention,
}
if topic:
    vals["TELEGRAM_TOPIC_ID"] = topic
text = path.read_text(encoding="utf-8") if path.exists() else ""
lines = text.splitlines()
seen = set()
out = []
for line in lines:
    if not line.strip() or line.lstrip().startswith("#") or "=" not in line:
        out.append(line)
        continue
    key = line.split("=", 1)[0].strip()
    if key in vals:
        out.append(f"{key}='{vals[key]}'")
        seen.add(key)
    else:
        out.append(line)
for key, value in vals.items():
    if key not in seen:
        out.append(f"{key}='{value}'")
path.write_text("\n".join(out) + "\n", encoding="utf-8")
print(f"updated {path}")
PY

docker compose build backend
docker compose up -d backend --force-recreate
echo "waiting for backend health..."
status="unknown"
for _ in $(seq 1 60); do
  status="$(docker inspect -f '{{.State.Health.Status}}' proxy_admin_backend 2>/dev/null || echo starting)"
  if [[ "${status}" == "healthy" ]]; then
    break
  fi
  sleep 2
done
echo "backend=${status}"

if [[ "${REMOVE_HOST_CRON}" == "1" ]]; then
  bash "${PROJECT_DIR}/deploy/telegram_backup.sh" --env-file "${ENV_FILE}" --remove-cron || true
fi

if [[ "${ENABLE_PANEL_SCHEDULE}" == "1" ]]; then
  docker exec proxy_admin_backend python - <<PY
from app.main import SessionLocal, get_panel_settings, normalize_backup_schedule, prune_telegram_backups

schedule = normalize_backup_schedule("${SCHEDULE}")
retention = int("${RETENTION_DAYS}")
with SessionLocal() as session:
    s = get_panel_settings(session)
    s.telegram_backup_enabled = True
    s.telegram_backup_schedule = schedule
    s.telegram_backup_retention_days = retention
    session.commit()
    print(f"panel schedule enabled: {schedule}, retention={retention}d")
prune_telegram_backups(retention)
PY
fi

if [[ "${SEND_TEST}" == "1" ]]; then
  docker exec proxy_admin_backend python - <<'PY'
from app.main import _telegram_send_message, create_and_send_telegram_backup, get_panel_settings, SessionLocal

_telegram_send_message(
    "✅ Proxy Admin: Telegram через VLESS/SOCKS.\n"
    "Уведомления об изменениях и бэкапы по расписанию панели (МСК).\n"
    "Локально бэкапы хранятся не дольше retention_days."
)
print("test notify ok")
with SessionLocal() as session:
    s = get_panel_settings(session)
    retention = int(s.telegram_backup_retention_days or 7)
path = create_and_send_telegram_backup(retention_days=retention)
print(f"test backup ok: {path.name}")
PY
fi

echo "done"
