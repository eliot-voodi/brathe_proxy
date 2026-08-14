#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo bash install.sh"
  exit 1
fi

prompt_secret() {
  local message="$1"
  local answer
  read -r -s -p "${message}: " answer
  # Keep newline for terminal UX, but print to stderr so it is not captured
  # by command substitution when assigning password variables.
  printf '\n' >&2
  echo "${answer}"
}

prompt_text() {
  local message="$1"
  local default_value="$2"
  local answer
  read -r -p "${message} [${default_value}]: " answer
  if [[ -z "${answer}" ]]; then
    echo "${default_value}"
  else
    echo "${answer}"
  fi
}

prompt_port() {
  local message="$1"
  local default_value="$2"
  local answer
  while true; do
    read -r -p "${message} [${default_value}]: " answer
    if [[ -z "${answer}" ]]; then
      answer="${default_value}"
    fi
    if is_valid_port "${answer}"; then
      echo "${answer}"
      return 0
    fi
    echo "Invalid port. Must be 1..65535"
  done
}

is_valid_port() {
  local value="$1"
  [[ "${value}" =~ ^[0-9]+$ ]] && (( value >= 1 && value <= 65535 ))
}

random_string() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 24
  else
    tr -dc 'A-Za-z0-9' </dev/urandom | head -c 48
  fi
}

contains_newline() {
  local value="$1"
  [[ "${value}" == *$'\n'* || "${value}" == *$'\r'* ]]
}

quote_env_value() {
  local value="$1"
  value="${value//$'\r'/}"
  value="${value//$'\n'/}"
  value="${value//\'/\'\"\'\"\'}"
  printf "'%s'" "${value}"
}

sanitize_domain() {
  local raw="$1"
  raw="${raw#http://}"
  raw="${raw#https://}"
  raw="${raw%%/*}"
  raw="${raw,,}"
  echo "${raw}"
}

detect_public_ip() {
  local ip
  ip="$(curl -fsS --max-time 3 https://api.ipify.org 2>/dev/null || true)"
  if [[ -z "${ip}" ]]; then
    ip="$(curl -fsS --max-time 3 https://ifconfig.me/ip 2>/dev/null || true)"
  fi
  echo "${ip}" | tr -d '\r\n'
}

domain_resolves_to_ip() {
  local domain="$1"
  local ip="$2"
  local resolved
  [[ -z "${domain}" || -z "${ip}" ]] && return 1
  while read -r resolved _rest; do
    [[ "${resolved}" == "${ip}" ]] && return 0
  done < <(getent ahostsv4 "${domain}" 2>/dev/null || true)
  return 1
}

open_port_best_effort() {
  local port="$1"
  if command -v ufw >/dev/null 2>&1; then
    ufw allow "${port}/tcp" >/dev/null 2>&1 || true
  fi
  if command -v iptables >/dev/null 2>&1; then
    iptables -C INPUT -p tcp --dport "${port}" -j ACCEPT >/dev/null 2>&1 || \
      iptables -I INPUT -p tcp --dport "${port}" -j ACCEPT >/dev/null 2>&1 || true
  fi
}

port_in_use() {
  local port="$1"
  ss -ltn "( sport = :${port} )" | awk 'NR>1 {exit 0} END {exit 1}'
}

assert_port_free() {
  local port="$1"
  local title="$2"
  if port_in_use "${port}"; then
    echo "ERROR: ${title} port ${port} is already in use on host."
    echo "Free this port or choose another one, then rerun installer."
    exit 1
  fi
}

echo "== Proxy Admin Panel installer =="

REPO_URL_VALUE="${REPO_URL:-https://github.com/eliot-voodi/brathe_proxy.git}"
BRANCH_VALUE="${BRANCH:-main}"
INSTALL_DIR="${INSTALL_DIR:-/opt/proxy-admin-panel}"
ADMIN_USERNAME="admin"

git_with_auth() {
  GIT_TERMINAL_PROMPT=0 git "$@"
}

clean_repo_url() {
  local url="${1}"
  url="${url#https://}"
  if [[ "${url}" == *"@"* ]]; then
    url="${url#*@}"
  fi
  echo "https://${url}"
}

authenticated_repo_url() {
  local url
  url="$(clean_repo_url "${REPO_URL_VALUE}")"
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    echo "https://x-access-token:${GITHUB_TOKEN}@${url#https://}"
  else
    echo "${url}"
  fi
}

PANEL_PORT="$(prompt_port "Panel port" "8003")"
HTTP_PROXY_PORT="$(prompt_port "HTTP proxy port" "13128")"

ADMIN_PASSWORD="$(prompt_secret "Admin password (leave empty for random)")"
if [[ -z "${ADMIN_PASSWORD}" ]]; then
  ADMIN_PASSWORD="$(random_string)"
fi
while contains_newline "${ADMIN_PASSWORD}"; do
  ADMIN_PASSWORD="$(prompt_secret "Password has newline chars, enter again")"
  if [[ -z "${ADMIN_PASSWORD}" ]]; then
    ADMIN_PASSWORD="$(random_string)"
  fi
done

PANEL_DOMAIN_RAW="$(prompt_text "Panel domain for public links (required for MTProto faketls)" "")"
PANEL_DOMAIN="$(sanitize_domain "${PANEL_DOMAIN_RAW}")"

PROXY_PUBLIC_HOST="auto"
if [[ -n "${PANEL_DOMAIN}" ]]; then
  PROXY_PUBLIC_HOST="${PANEL_DOMAIN}"
fi

if [[ -n "${PANEL_DOMAIN}" ]]; then
  # Keep MTProto host and FakeTLS domain exactly equal to panel DNS.
  # This avoids SNI/DNS mismatch that causes "proxy unavailable" in Telegram.
  MTPROTO_PUBLIC_HOST="${PANEL_DOMAIN}"
  MTPROTO_FAKE_TLS_DOMAIN="${PANEL_DOMAIN}"
else
  MTPROTO_PUBLIC_HOST="$(detect_public_ip)"
  if [[ -z "${MTPROTO_PUBLIC_HOST}" ]]; then
    MTPROTO_PUBLIC_HOST="auto"
  fi
  MTPROTO_FAKE_TLS_DOMAIN="${MTPROTO_FAKE_TLS_DOMAIN:-yandex.ru}"
fi
PROXY_LOGDUMP_BYTES="${PROXY_LOGDUMP_BYTES:-65536}"
TRAFFIC_POLL_INTERVAL_SECONDS="${TRAFFIC_POLL_INTERVAL_SECONDS:-8.0}"
TRAFFIC_SAMPLING_INTERVAL_SECONDS="${TRAFFIC_SAMPLING_INTERVAL_SECONDS:-180}"
TRAFFIC_SAMPLES_PER_USER="${TRAFFIC_SAMPLES_PER_USER:-false}"
TRAFFIC_EVENTS_ENABLED="${TRAFFIC_EVENTS_ENABLED:-false}"
TRAFFIC_SAMPLES_RETENTION_HOURS="${TRAFFIC_SAMPLES_RETENTION_HOURS:-24}"
MTPROTO_PUBLIC_PORT="${MTPROTO_PUBLIC_PORT:-2053}"
MTPROTO_SECRET_MODE="${MTPROTO_SECRET_MODE:-faketls}"
# Должно совпадать с docker-compose (статический IP sing-box в proxy_internal),
# чтобы 3proxy parent гарантированно работал без DNS-резолва имени.
SINGBOX_SOCKS_HOST="${SINGBOX_SOCKS_HOST:-10.210.99.10}"
SINGBOX_SOCKS_PORT="${SINGBOX_SOCKS_PORT:-1080}"

if [[ "${MTPROTO_SECRET_MODE}" == "faketls" && -z "${PANEL_DOMAIN}" ]]; then
  echo "ERROR: For MTProto faketls you must specify panel domain."
  echo "Reason: without domain, SNI/DNS mismatch often makes Telegram show 'proxy unavailable'."
  exit 1
fi

if [[ -n "${PANEL_DOMAIN}" ]]; then
  SERVER_PUBLIC_IP="$(detect_public_ip)"
  if [[ -n "${SERVER_PUBLIC_IP}" ]]; then
    if ! domain_resolves_to_ip "${PANEL_DOMAIN}" "${SERVER_PUBLIC_IP}"; then
      echo "ERROR: Domain ${PANEL_DOMAIN} does not resolve to server IP ${SERVER_PUBLIC_IP}."
      echo "Fix DNS A record (DNS only, no proxy) and rerun installer."
      exit 1
    fi
  fi
fi

assert_port_free "${PANEL_PORT}" "Panel"
assert_port_free "${HTTP_PROXY_PORT}" "HTTP proxy"
assert_port_free "${MTPROTO_PUBLIC_PORT}" "MTProto"

echo "Installing system dependencies..."
apt-get update -y
apt-get install -y ca-certificates curl git openssl

if ! command -v docker >/dev/null 2>&1; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
fi

systemctl enable --now docker

if ! docker compose version >/dev/null 2>&1; then
  echo "Installing docker compose plugin..."
  apt-get install -y docker-compose-plugin
fi

if [[ -d "${INSTALL_DIR}/.git" ]]; then
  echo "Updating existing repository in ${INSTALL_DIR}..."
  git_with_auth -C "${INSTALL_DIR}" remote set-url origin "$(authenticated_repo_url)"
  git_with_auth -C "${INSTALL_DIR}" fetch origin "${BRANCH_VALUE}" --prune
  git_with_auth -C "${INSTALL_DIR}" checkout -B "${BRANCH_VALUE}" "origin/${BRANCH_VALUE}"
  git_with_auth -C "${INSTALL_DIR}" reset --hard "origin/${BRANCH_VALUE}"
  git_with_auth -C "${INSTALL_DIR}" clean -fd
  git_with_auth -C "${INSTALL_DIR}" remote set-url origin "$(clean_repo_url "${REPO_URL_VALUE}")"
else
  echo "Cloning repository to ${INSTALL_DIR}..."
  if [[ -z "${GITHUB_TOKEN:-}" ]]; then
    echo "If clone fails on a private repo, rerun with GITHUB_TOKEN set (PAT with repo scope)."
  fi
  rm -rf "${INSTALL_DIR}"
  git_with_auth clone --depth 1 --branch "${BRANCH_VALUE}" "$(authenticated_repo_url)" "${INSTALL_DIR}"
  git_with_auth -C "${INSTALL_DIR}" remote set-url origin "$(clean_repo_url "${REPO_URL_VALUE}")"
fi

if [[ ! -d "${INSTALL_DIR}/backend" || ! -d "${INSTALL_DIR}/mtproto" || ! -f "${INSTALL_DIR}/docker-compose.yml" ]]; then
  echo "ERROR: git checkout is incomplete (backend/mtproto missing) in ${INSTALL_DIR}."
  echo "Fix: cd ${INSTALL_DIR} && git fetch origin && git reset --hard origin/${BRANCH_VALUE}"
  exit 1
fi

PANEL_GIT_REVISION="$(git -C "${INSTALL_DIR}" rev-parse HEAD)"
PANEL_IMAGE_TAG="$(git -C "${INSTALL_DIR}" rev-parse --short HEAD)"
echo "Deploying git revision ${PANEL_IMAGE_TAG} (${PANEL_GIT_REVISION})"
export PANEL_GIT_REVISION
export PANEL_IMAGE_TAG

PANEL_SECRET_KEY="$(random_string)"

PANEL_DATA_DIR="${INSTALL_DIR}/data"
mkdir -p "${PANEL_DATA_DIR}"
chmod 755 "${PANEL_DATA_DIR}"

{
  echo "PANEL_PORT=${PANEL_PORT}"
  echo "HTTP_PROXY_PORT=${HTTP_PROXY_PORT}"
  echo "PANEL_SECRET_KEY=$(quote_env_value "${PANEL_SECRET_KEY}")"
  echo "ADMIN_USERNAME=$(quote_env_value "${ADMIN_USERNAME}")"
  echo "ADMIN_PASSWORD=$(quote_env_value "${ADMIN_PASSWORD}")"
  echo "PROXY_PUBLIC_HOST=$(quote_env_value "${PROXY_PUBLIC_HOST}")"
  echo "MTPROTO_PUBLIC_HOST=$(quote_env_value "${MTPROTO_PUBLIC_HOST}")"
  echo "MTPROTO_PUBLIC_PORT=${MTPROTO_PUBLIC_PORT}"
  echo "MTPROTO_SECRET_MODE=$(quote_env_value "${MTPROTO_SECRET_MODE}")"
  echo "MTPROTO_FAKE_TLS_DOMAIN=$(quote_env_value "${MTPROTO_FAKE_TLS_DOMAIN}")"
  echo "PROXY_LOGDUMP_BYTES=${PROXY_LOGDUMP_BYTES}"
  echo "TRAFFIC_POLL_INTERVAL_SECONDS=${TRAFFIC_POLL_INTERVAL_SECONDS}"
  echo "TRAFFIC_SAMPLING_INTERVAL_SECONDS=${TRAFFIC_SAMPLING_INTERVAL_SECONDS}"
  echo "TRAFFIC_SAMPLES_PER_USER=${TRAFFIC_SAMPLES_PER_USER}"
  echo "TRAFFIC_EVENTS_ENABLED=${TRAFFIC_EVENTS_ENABLED}"
  echo "TRAFFIC_SAMPLES_RETENTION_HOURS=${TRAFFIC_SAMPLES_RETENTION_HOURS}"
  echo "SINGBOX_SOCKS_HOST=$(quote_env_value "${SINGBOX_SOCKS_HOST}")"
  echo "SINGBOX_SOCKS_PORT=${SINGBOX_SOCKS_PORT}"
  echo "PANEL_DATA_HOST_PATH=$(quote_env_value "${PANEL_DATA_DIR}")"
  echo "PANEL_IMAGE_TAG=$(quote_env_value "${PANEL_IMAGE_TAG}")"
  echo "PANEL_GIT_REVISION=$(quote_env_value "${PANEL_GIT_REVISION}")"
} >"${INSTALL_DIR}/.env"

echo "Opening firewall ports (best effort)..."
open_port_best_effort "${PANEL_PORT}"
open_port_best_effort "${HTTP_PROXY_PORT}"
open_port_best_effort "${MTPROTO_PUBLIC_PORT}"

echo "Starting stack..."
docker compose -f "${INSTALL_DIR}/docker-compose.yml" --env-file "${INSTALL_DIR}/.env" up -d --build

sleep 2
LOGIN_HTTP_CODE="$(curl -s -o /tmp/panel-login-check.txt -w "%{http_code}" -X POST "http://127.0.0.1:${PANEL_PORT}/api/auth/login" -H "Content-Type: application/json" -d "{\"username\":\"${ADMIN_USERNAME}\",\"password\":\"${ADMIN_PASSWORD}\"}" || true)"
if [[ "${LOGIN_HTTP_CODE}" != "200" ]]; then
  echo "WARNING: login self-check failed with HTTP ${LOGIN_HTTP_CODE}."
  echo "Response:"
  cat /tmp/panel-login-check.txt || true
else
  echo "Login self-check: OK"
fi

echo
echo "== Installed successfully =="
echo "Panel URL: http://<server-ip>:${PANEL_PORT}"
echo "Admin username: ${ADMIN_USERNAME}"
echo "Admin password: ${ADMIN_PASSWORD}"
echo "HTTP proxy port: ${HTTP_PROXY_PORT}"
echo "Host data directory (SQLite DB, backups): ${PANEL_DATA_DIR}"
echo "MTProto host: ${MTPROTO_PUBLIC_HOST}"
echo "MTProto port: ${MTPROTO_PUBLIC_PORT}"
echo
echo "Saved credentials/env file: ${INSTALL_DIR}/.env"
