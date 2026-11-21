# FAEL / DEV — Portfólio GitHub Pages

Portfólio de **Fael Gomes** com foco em projetos verificáveis: APIs, mensageria e software embarcado. Desenvolvido em HTML, CSS e JavaScript puro, sem backend, sem dependências npm e com hospedagem gratuita pelo GitHub Pages.

**Endereço planejado:** https://claudiorafael1.github.io/  
**Conta:** https://github.com/claudiorafael1

## O que há no site

- Layout responsivo, acessível e otimizado para apresentação a recrutadores.
- Quatro projetos selecionados: Núcleo Link, Eliza Neural OS, Organizador Pessoal e API Java + MySQL. As descrições deixam claro o escopo e as limitações conhecidas.
- Filtros por área, pesquisa por palavras e tecnologias e links diretos para o código.
- Outros repositórios públicos obtidos pela API pública do GitHub, sem token no front-end.
- Projetos vazios, forks e arquivos arquivados não aparecem na lista automática.
- SEO básico, Open Graph, sitemap, favicon e publicação automática com GitHub Actions.
- Scripts para publicar, atualizar, visualizar localmente e adicionar novos projetos.

## PUBLICAR — Linux Mint

**1.** Descompacte o arquivo ZIP, abra um terminal dentro da pasta e execute:

```bash
bash publicar.sh
```

O script confere as ferramentas `git` e `gh`, solicita login do GitHub via navegador, valida que a conta é **claudiorafael1**, cria o repositório público `claudiorafael1.github.io`, envia o site e tenta ativar o GitHub Pages pelo modo **GitHub Actions**.

**2.** Confira `https://github.com/claudiorafael1/claudiorafael1.github.io/actions` e a publicação em `https://claudiorafael1.github.io/`.

**3.** Se a ativação automática não concluir, vá ao repositório do site → **Settings → Pages → Build and deployment → Source: GitHub Actions**. Em **Actions**, abra **Publicar portfólio no GitHub Pages** e escolha **Run workflow**.

> Por segurança, o script não sobrescreve outro repositório já existente se ele não estiver corretamente vinculado à pasta local. Nunca utiliza `git push --force` e não grava senhas/tokens em arquivo.

## TESTAR NO COMPUTADOR

```bash
bash ver-local.sh
```

Acesse `http://127.0.0.1:8765/`. Para parar o servidor, `Ctrl+C`. Abrir `index.html` diretamente com `file://` pode impedir o carregamento do JSON pela política de segurança do navegador.

## ADICIONAR PROJETO AOS DESTAQUES

```bash
bash adicionar-projeto.sh https://github.com/claudiorafael1/NOME-DO-PROJETO
bash atualizar.sh
```

O programa pedirá título, descrição, categoria e tecnologias. Ele acrescentará automaticamente o cartão em `projects.json`.

**Sem qualquer alteração:** se você criar um novo repositório público, não vazio e não derivado de fork, ele deverá aparecer automaticamente na seção de outros repositórios quando o navegador conseguir consultar a API pública. Esta consulta está sujeita a limites e disponibilidade do GitHub.

Para personalizar um destaque, edite `projects.json`. Para alterar a aparência, edite `styles.css`. Após alterações:

```bash
bash atualizar.sh
```

## Estrutura

- `index.html`: conteúdo estrutural da página.
- `styles.css`: aparência, animações e adaptação a telas pequenas.
- `app.js`: cartões, filtros, busca, sincronização de repositórios.
- `projects.json`: projetos em destaque, títulos e descrições.
- `.github/workflows/pages.yml`: implantação automática no GitHub Pages em cada push para `main`.
- `assets/`: favicon e imagem de compartilhamento social.
- `publicar.sh`: publicação inicial e configuração do Pages.
- `atualizar.sh`: envio seguro de alterações.
- `adicionar-projeto.sh`: cadastramento guiado de um repositório.
- `ver-local.sh`: visualização local, sem expor a porta à rede.

## Segurança e precisão

O **Núcleo Link** documenta que mensagens transmitidas pelo servidor não têm criptografia ponta a ponta, mesmo contando com autenticação por dispositivo. O **Eliza Neural OS** é um assistente inspirado em ELIZA e baseado em regras; não é apresentado como LLM. As descrições se limitam ao escopo que constava das informações disponíveis para a primeira versão do portfólio. Antes de publicar, confira se o texto corresponde ao código e ao estado atual de cada repositório.

A API GitHub é usada somente para consultar repositórios públicos. Nenhuma credencial de conta é inserida no HTML ou no JavaScript. O código do repositório que hospeda o site é público.

## Dica para tornar o portfólio ainda mais convincente

Adicione em cada repositório um README com capturas de tela, demonstração (vídeo ou GIF), arquitetura, instruções de execução, testes e limitações técnicas. Essa evidência vale mais que uma lista longa de linguagens.

Documento detalhado: **GUIA_PUBLICACAO.md**.

## Como manter o texto natural e convincente

A ordem usada nos cartões é **o que o projeto faz → decisão técnica importante → convite para examinar o código**. Ela deixa o leitor concluir sobre a qualidade do trabalho por conta própria.

- Troque frases genéricas como “soluções inovadoras e de alto impacto” por informações concretas.
- Não invente métricas, usuários, clientes, certificados, segurança ou desempenho.
- Descreva limitações relevantes, especialmente de segurança e IA, sem escondê-las.
- Dê destaque a projetos que podem ser avaliados por código, documentação e demonstração.
- Ajuste as descrições de `projects.json` quando as funcionalidades mudarem.

Veja também `REVISAO_DOS_TEXTOS.md`, que documenta a mudança editorial e as referências estudadas.
