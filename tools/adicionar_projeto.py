#!/usr/bin/env python3
"""Adiciona repositórios próprios ao catálogo de projetos em destaque."""
import json
import sys
import re
from pathlib import Path
from urllib.parse import urlsplit, unquote

OWNER = 'claudiorafael1'
if len(sys.argv) != 2:
    sys.exit('Uso: bash adicionar-projeto.sh https://github.com/claudiorafael1/NOME')
url = sys.argv[1]
parsed = urlsplit(url)
parts = [unquote(p) for p in parsed.path.strip('/').split('/')]
if (parsed.scheme != 'https' or parsed.hostname not in ('github.com','www.github.com')
        or len(parts) != 2 or parts[0].lower() != OWNER.lower()
        or not re.fullmatch(r'[A-Za-z0-9_.-]+', parts[1])):
    sys.exit('ERRO: informe um link HTTPS de repositório pertencente a github.com/claudiorafael1/NOME')
repo = parts[1]
path = Path(__file__).resolve().parents[1] / 'projects.json'
try:
    data = json.loads(path.read_text(encoding='utf-8'))
except (OSError, json.JSONDecodeError) as error:
    sys.exit(f'ERRO ao ler projects.json: {error}')
if any(p.get('repo','').lower() == repo.lower() for p in data):
    sys.exit(f'O repositório {repo} já está cadastrado.')
print(f'\nNOVO PROJETO: https://github.com/{OWNER}/{repo}')
title = input(f'Nome de exibição [{repo}]: ').strip() or repo.replace('-', ' ').replace('_',' ')
description = input('Descrição curta do projeto [exibida no site]: ').strip()
if not description:
    sys.exit('Descrição obrigatória: nada foi alterado.')
print('Categorias: 1=IA & Edge | 2=Comunicação | 3=Backend | 4=Web')
number = input('Escolha categoria [4]: ').strip() or '4'
categories = {'1':'ia','2':'comunicacao','3':'backend','4':'web'}
if number not in categories:
    sys.exit('Categoria inválida: nada foi alterado.')
category = categories[number]
tags = [x.strip() for x in input('Tecnologias separadas por vírgula [opcional]: ').split(',') if x.strip()][:7]
visual = {'ia':'ai','comunicacao':'network','backend':'stack','web':'data'}[category]
entry = {
    'repo':repo,
    'title':title,
    'eyebrow':'NOVO / PROJETO',
    'category':category,
    'description':description,
    'tags':tags,
    'visual':visual,
    'featured':True,
    'links':[{'label':'Código-fonte','url':f'https://github.com/{OWNER}/{repo}'}],
    'note':''
}
data.append(entry)
path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('\nProjeto adicionado aos destaques com sucesso!')
print('Para publicar as mudanças, execute: bash atualizar.sh')
