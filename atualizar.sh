#!/usr/bin/env bash
# Envia novas alterações. Não faz push forçado ou sobrescreve histórico remoto.
set -Eeuo pipefail
cd "$(dirname "$(readlink -f "$0")")"
OWNER='claudiorafael1'
REPO="${OWNER}.github.io"
[[ -d .git ]] || { echo 'Esta pasta ainda não foi publicada. Primeiro execute: bash publicar.sh'; exit 1; }
[[ "$(git branch --show-current)" == 'main' ]] || { echo 'Branch não é main. Confira manualmente.'; exit 1; }
python3 -m json.tool projects.json >/dev/null || { echo 'JSON inválido. Nada foi enviado.'; exit 1; }
ORIGIN="$(git remote get-url origin 2>/dev/null || true)"
case "$ORIGIN" in "https://github.com/${OWNER}/${REPO}"|"https://github.com/${OWNER}/${REPO}.git"|"git@github.com:${OWNER}/${REPO}.git"|"git@github.com:${OWNER}/${REPO}") ;; *) echo 'Remote inesperado; nada foi enviado.'; exit 1;; esac
if command -v gh >/dev/null 2>&1; then gh auth setup-git >/dev/null 2>&1 || true; fi
git fetch origin main
git add -A
if git diff --cached --quiet; then echo 'Nenhuma alteração local para publicar.'; exit 0; fi
git commit -m 'Atualizar portfólio'
git merge-base --is-ancestor origin/main HEAD || { echo 'Histórico remoto mudou. Resolva com git pull --rebase antes de enviar.'; exit 1; }
git push -u origin main
echo 'Atualização enviada. Acompanhe: https://github.com/claudiorafael1/claudiorafael1.github.io/actions'
