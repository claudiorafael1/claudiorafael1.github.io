#!/usr/bin/env bash
# Adiciona projeto em projects.json com um link de repositório do próprio GitHub.
set -Eeuo pipefail
cd "$(dirname "$(readlink -f "$0")")"
[[ $# -eq 1 ]] || { echo "Uso: bash adicionar-projeto.sh https://github.com/claudiorafael1/NOME"; exit 2; }
python3 tools/adicionar_projeto.py "$1"
