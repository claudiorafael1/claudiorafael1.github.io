#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(dirname "$(readlink -f "$0")")"
port="${1:-8765}"
[[ "$port" =~ ^[0-9]+$ ]] || { echo 'Porta inválida'; exit 1; }
echo "Abrindo site local em: http://127.0.0.1:${port}/"
echo 'Para encerrar, pressione Ctrl+C.'
( sleep 1; xdg-open "http://127.0.0.1:${port}/" >/dev/null 2>&1 || true ) &
python3 -m http.server "$port" --bind 127.0.0.1
