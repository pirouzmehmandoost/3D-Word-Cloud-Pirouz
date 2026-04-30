#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but was not found."
  exit 1
fi

if ! command -v uv >/dev/null 2>&1; then
  echo "uv is required but was not found."
  echo "Install uv first, then rerun this script."
  exit 1
fi

echo "Installing frontend dependencies..."
cd "$ROOT_DIR"
npm install

echo "Installing backend dependencies..."
cd "$BACKEND_DIR"
uv sync

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi

  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo "Starting backend at http://127.0.0.1:8000"
cd "$BACKEND_DIR"
uv run fastapi dev main.py --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

echo "Starting frontend at http://localhost:3000"
cd "$ROOT_DIR"
npm run dev &
FRONTEND_PID=$!

wait "$BACKEND_PID" "$FRONTEND_PID"
