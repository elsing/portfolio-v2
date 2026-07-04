#!/usr/bin/env bash
#
# One-shot scaffolding for a per-environment base directory. Run this ON THE
# DOCKER HOST, once per environment:
#
#   ./scripts/setup-env.sh staging
#   ./scripts/setup-env.sh prod
#
# Creates (default root /opt/portfolio, override with PORTFOLIO_ROOT):
#   <root>/<env>/.env                 → runtime env for the main app (appended if it exists)
#   <root>/<env>/.env.admin     → admin panel env (password, session secret)
#   <root>/<env>/data/            → shared SQLite data dir
#
# The resulting <root>/<env> path is what goes in the PORTFOLIO_BASE_PROD /
# PORTFOLIO_BASE_STAGING GitHub repository Variable. If your runner is
# containerized, mount this directory into it at the same path.
#
# Never overwrites an existing file — rerunning is safe and just fills gaps.
# You still need to place system-prompt.txt yourself (it's private).
#
# Umami is a separately-run shared instance (see docs/umami-standalone.md);
# its NEXT_PUBLIC_* values are set as GitHub repository Variables and baked in
# by the image-build workflow — the .env entries here only matter for local dev.

set -euo pipefail

ENV="${1:-}"
if [[ "$ENV" != "prod" && "$ENV" != "staging" ]]; then
  echo "Usage: $0 <prod|staging>" >&2
  exit 1
fi

BASE="${PORTFOLIO_ROOT:-/opt/portfolio}/$ENV"
ENV_DIR="$BASE"
DATA_DIR="$BASE/data"

gen_secret() { openssl rand -hex 32; }

# write_if_absent <path> <content> — never clobbers an existing file
write_if_absent() {
  local path="$1" content="$2"
  if [[ -f "$path" ]]; then
    echo "  skip  $path (already exists)"
  else
    printf '%s\n' "$content" > "$path"
    chmod 600 "$path"
    echo "  wrote $path"
  fi
}

echo "== Setting up '$ENV' environment at $BASE =="

mkdir -p "$ENV_DIR" "$DATA_DIR"
echo "  ensured $ENV_DIR and $DATA_DIR"

echo "-- .env (main app runtime) --"
if [[ -f "$ENV_DIR/.env" ]]; then
  # Append only the keys that are missing, leave the rest of the file untouched.
  grep -q '^DB_PATH=' "$ENV_DIR/.env" || echo "DB_PATH=/app/data/portfolio.sqlite" >> "$ENV_DIR/.env"
  grep -q '^IP_HASH_SALT=' "$ENV_DIR/.env" || echo "IP_HASH_SALT=$(gen_secret)" >> "$ENV_DIR/.env"
  grep -q '^PORTFOLIO_BASE=' "$ENV_DIR/.env" || echo "PORTFOLIO_BASE=$BASE" >> "$ENV_DIR/.env"
  echo "  updated $ENV_DIR/.env (added any missing keys, left the rest alone)"
else
  write_if_absent "$ENV_DIR/.env" "$(cat <<EOF
# Runtime env for the main app — add your OLLAMA_URL / OLLAMA_MODEL /
# FOLIO_PROMPT_FILE / KUMA_URL / KUMA_SLUG values here (see .env.example).
DB_PATH=/app/data/portfolio.sqlite
IP_HASH_SALT=$(gen_secret)
# Lets 'docker compose' run from this dir with no env setup (compose auto-reads
# the .env beside its compose file for \${} interpolation).
PORTFOLIO_BASE=$BASE
EOF
)"
fi

echo "-- .env.admin --"
# Always 9000: this is the port INSIDE the container. The staging/prod
# difference (9001 vs 9000 on the host) lives in the compose port mapping.
read -r -p "  Admin panel password [leave blank to auto-generate]: " ADMIN_PW
[[ -z "$ADMIN_PW" ]] && ADMIN_PW="$(gen_secret)"
write_if_absent "$ENV_DIR/.env.admin" "$(cat <<EOF
ADMIN_PASSWORD=$ADMIN_PW
SESSION_SECRET=$(gen_secret)
ADMIN_PORT=9000
DB_PATH=/app/data/portfolio.sqlite
EOF
)"

echo
echo "== Done =="
echo "Still manual:"
echo "  1. Copy your system prompt to $ENV_DIR/system-prompt.txt"
echo "     and set FOLIO_PROMPT_FILE=/app/system-prompt.txt (plus OLLAMA/Kuma"
echo "     vars) in $ENV_DIR/.env"
echo "  2. Set the GitHub repository Variable PORTFOLIO_BASE_$(echo "$ENV" | tr '[:lower:]' '[:upper:]')=$BASE"
echo "  3. If the runner is containerized, mount $BASE into it at the same path"
echo "  4. Push — the build workflow publishes images, the deploy workflow"
echo "     pulls them and restarts (analytics vars: see docs/analytics-setup.md)"
