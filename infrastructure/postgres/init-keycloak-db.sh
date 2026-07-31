#!/usr/bin/env bash
set -Eeuo pipefail

trap 'printf "[equiply-init] ERROR: database initialization failed on line %s\n" "$LINENO" >&2' ERR

: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${POSTGRES_DB:?POSTGRES_DB is required}"

readonly target_database="keycloak"
database_exists=$(psql \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --tuples-only \
  --no-align \
  --command "SELECT 1 FROM pg_database WHERE datname = '${target_database}'")

if [[ "$database_exists" == "1" ]]; then
  printf '[equiply-init] Database %s already exists; skipping creation.\n' "$target_database"
else
  createdb --username "$POSTGRES_USER" --owner "$POSTGRES_USER" "$target_database"
  printf '[equiply-init] Created database %s.\n' "$target_database"
fi
