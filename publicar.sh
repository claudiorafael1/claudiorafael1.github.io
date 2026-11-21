#!/usr/bin/env bash
# Publica o portfólio de Fael Gomes como https://claudiorafael1.github.io/
# Segurança: autenticação pelo GitHub CLI, sem senha/token em scripts.
set -Eeuo pipefail
cd "$(dirname "$(readlink -f "$0")")"
OWNER='claudiorafael1'
REPO="${OWNER}.github.io"
FULL="${OWNER}/${REPO}"
URL="https://${REPO}/"

error() { printf '\n[ERRO] %s\n' "$*" >&2; exit 1; }
info() { printf '\n\033[1;36m[PORTFÓLIO]\033[0m %s\n' "$*"; }
ensure_command() {
  local c="$1" package="$2"
  if ! command -v "$c" >/dev/null 2>&1; then
    info "O comando '$c' não foi encontrado. Instalando pacote '$package' (pode pedir senha de sudo)..."
    command -v apt-get >/dev/null || error "Instale $c e execute novamente."
    sudo apt-get update && sudo apt-get install -y "$package" || error "Falha ao instalar $package. Instale-o manualmente."
  fi
}

printf '\n==========================================================\n'
printf ' FAEL / DEV - PUBLICAÇÃO AUTOMÁTICA NO GITHUB PAGES\n'
printf '==========================================================\n'
printf ' Conta esperada: %s\n Destino: %s\n' "$OWNER" "$URL"
printf ' Repositório público: %s\n' "$FULL"
printf '\nO código deste site será PÚBLICO. Nenhum token será salvo no projeto.\n'
read -r -p 'Deseja prosseguir? [s/N]: ' confirm
[[ "$confirm" =~ ^[sS]$ ]] || { echo 'Cancelado pelo usuário.'; exit 0; }

ensure_command git git
ensure_command gh gh

if ! gh auth status --hostname github.com >/dev/null 2>&1; then
  info 'Faça login pelo navegador (GitHub CLI):'
  gh auth login --hostname github.com --git-protocol https --web || error 'Login não concluído.'
fi
gh auth setup-git || error 'Não consegui configurar as credenciais do Git.'
LOGIN="$(gh api user --jq .login)" || error 'Não consegui descobrir a conta autenticada.'
[[ "${LOGIN,,}" == "${OWNER,,}" ]] || error "Você está autenticado como '$LOGIN'. Entre na conta '$OWNER' antes de publicar."
info "Autenticação confirmada como ${LOGIN}."

if [[ -d .git ]]; then
  BRANCH="$(git branch --show-current 2>/dev/null || true)"
  [[ "$BRANCH" == 'main' || -z "$BRANCH" ]] || error "Esta pasta já usa a branch '$BRANCH'. Para evitar alterações acidentais, publique manualmente."
else
  git init -b main || error 'Não foi possível iniciar o repositório Git.'
fi

git config --local user.name "$(gh api user --jq '.name // .login')"
ACCOUNT_ID="$(gh api user --jq .id)"
git config --local user.email "${ACCOUNT_ID}+${OWNER}@users.noreply.github.com"

# Para não sobrescrever projetos existentes: só atualizamos repo existente se o remote for exatamente o esperado.
EXISTS=false
if gh repo view "$FULL" --json name --jq .name >/dev/null 2>&1; then EXISTS=true; fi
if [[ "$EXISTS" == true ]]; then
  ORIGIN="$(git remote get-url origin 2>/dev/null || true)"
  case "$ORIGIN" in
    "https://github.com/${FULL}"|"https://github.com/${FULL}.git"|"git@github.com:${FULL}.git"|"git@github.com:${FULL}") ;;
    *) error "O repositório $FULL já existe, mas esta pasta não está vinculada a ele. Para evitar sobrescrever dados, faça clone do repositório existente e mescle os arquivos manualmente." ;;
  esac
  info 'Repositório existente com remote correto: preparando atualização segura.'
else
  if git remote get-url origin >/dev/null 2>&1; then
    error 'Esta pasta já tem um remote, mas o repositório de destino não foi encontrado. Revise antes de publicar.'
  fi
fi

[[ -f index.html && -f projects.json && -f .github/workflows/pages.yml ]] || error 'Faltam arquivos do site. Extraia o ZIP completo.'
python3 -m json.tool projects.json >/dev/null || error 'O arquivo projects.json contém JSON inválido.'
git add -A
if ! git diff --cached --quiet; then git commit -m 'Publicar portfólio Fael Dev' || error 'Não consegui registrar as alterações.'; fi

if [[ "$EXISTS" == true ]]; then
  git fetch origin main || error 'Falha ao consultar histórico remoto.'
  if git show-ref --verify --quiet refs/remotes/origin/main; then
    # Proteção extra: fast-forward obrigatório, sem push forçado ou sobreposição de histórico.
    git merge-base --is-ancestor origin/main HEAD || error 'Históricos divergentes. Faça git pull --rebase e resolva conflitos antes de publicar.'
  fi
  git push -u origin main || error 'Não consegui enviar a atualização.'
else
  info 'Criando repositório público do site e enviando arquivos...'
  gh repo create "$FULL" --public --description 'Portfólio de Fael Gomes | Java, Python, Edge AI e Sistemas Embarcados' --source=. --remote=origin --push || error 'Falha ao criar/enviar repositório. Nenhum push forçado foi feito.'
fi

info 'Ativando o GitHub Pages com publicação via GitHub Actions...'
PAGES_OK=true
if gh api "repos/${FULL}/pages" >/dev/null 2>&1; then
  gh api -X PUT "repos/${FULL}/pages" -f build_type=workflow >/dev/null || PAGES_OK=false
else
  gh api -X POST "repos/${FULL}/pages" -f build_type=workflow >/dev/null || PAGES_OK=false
fi
if [[ "$PAGES_OK" == true ]]; then
  info 'GitHub Pages configurado.'
  gh workflow run pages.yml --repo "$FULL" --ref main >/dev/null 2>&1 || true
else
  printf '\n[ATENÇÃO] O código foi enviado, mas a configuração automática do Pages não foi confirmada.\n'
  printf 'No GitHub: Settings > Pages > Build and deployment > Source: GitHub Actions.\n'
  printf 'Depois: Actions > Publicar portfólio no GitHub Pages > Run workflow.\n'
fi
printf '\n==========================================================\n'
printf ' REPOSITÓRIO: https://github.com/%s\n' "$FULL"
printf ' SITE (após a publicação): %s\n' "$URL"
printf ' ACOMPANHAR: https://github.com/%s/actions\n' "$FULL"
printf '==========================================================\n'
printf 'NOTA: o site só estará no ar quando o workflow terminar com sucesso.\n'
