# Guia passo a passo: colocar o FAEL / DEV no ar

Este guia foi preparado para **Linux Mint** e a conta **claudiorafael1**.

## 1. Baixe e extraia

Após baixar `fael-portfolio-github-pages.zip` para a pasta `Downloads`, abra o Terminal e cole:

```bash
cd ~/Downloads
unzip -o fael-portfolio-github-pages.zip
cd fael-portfolio-github-pages
```

Se a pasta Downloads do seu Linux tiver outro nome, entre pelo gerenciador de arquivos e abra o terminal dentro da pasta extraída.

## 2. Teste a aparência antes de publicar

```bash
bash ver-local.sh
```

Abre uma prévia em `http://127.0.0.1:8765/`. Use `Ctrl+C` para encerrar o servidor.

## 3. Publique praticamente em um comando

```bash
bash publicar.sh
```

O script faz o que é possível automatizar:

1. Instala `git` e `gh` via APT, se estiverem ausentes (pode pedir sua senha de administrador).
2. Inicia login seguro com o **GitHub CLI**, redirecionando para o navegador. Confirme a autenticação na sua própria conta.
3. Verifica que a conta conectada é `claudiorafael1`.
4. Cria um repositório **público** com nome **exato** `claudiorafael1.github.io` e envia os arquivos.
5. Tenta configurar **GitHub Pages com GitHub Actions**, e acionar uma implantação.

**IMPORTANTE:** nada é publicado diretamente pela conversa com o ChatGPT. Você autoriza o login e executa o script no seu computador. O script não usa tokens colados no código.

## 4. Confirme o resultado

Abra:

- **Código do site:** https://github.com/claudiorafael1/claudiorafael1.github.io
- **Acompanhar deploy:** https://github.com/claudiorafael1/claudiorafael1.github.io/actions
- **Site público:** https://claudiorafael1.github.io/

Na aba **Actions**, o fluxo **Publicar portfólio no GitHub Pages** deve terminar com um sinal verde. Depois, abra o endereço público.

Caso apareça **404** ou a ativação automática falhe, acesse o repositório do site e faça:

**Settings → Pages → Build and deployment → Source → GitHub Actions**.

Em seguida, na aba **Actions**, entre em **Publicar portfólio no GitHub Pages → Run workflow**. Se houver erro de permissões, confira **Settings → Actions → General → Workflow permissions** e habilite o necessário, sem conceder permissões extras desnecessárias.

Se o repositório `claudiorafael1.github.io` **já existir**, o instalador não sobrescreverá conteúdo desconhecido: atualize-o com Git manualmente ou faça backup e mesclagem com os arquivos novos.

## 5. Colocar outros projetos com um único link

Dentro da pasta do portfólio:

```bash
bash adicionar-projeto.sh https://github.com/claudiorafael1/NOME-DO-PROJETO
```

Você informará nome de exibição, descrição, categoria e tecnologias. O script atualizará `projects.json` sem tocar no HTML. Para mandar o novo cartão ao site:

```bash
bash atualizar.sh
```

Também é possível abrir `projects.json` em um editor de texto, mas mantenha o formato JSON válido.

### O que acontece com novos repositórios?

A seção **Outros projetos no GitHub** carrega automaticamente repositórios públicos da conta via API. Assim, para projetos não vazios, não arquivados e que não sejam forks, normalmente basta publicá-los no seu GitHub. O visitante precisa ter acesso à API; caso a API esteja indisponível, os quatro destaques cadastrados continuam aparecendo.

## 6. Atualizar texto, cores e apresentação

- `projects.json`: escolha projetos, descrições, tecnologias e categorias.
- `index.html`: textos da abertura, sobre você e contatos.
- `styles.css`: cores, espaçamento e layout.
- `assets/social-preview.png`: imagem mostrada ao compartilhar o link em plataformas compatíveis.

Após qualquer edição:

```bash
bash atualizar.sh
```

A aba **Actions** inicia uma nova publicação com as alterações enviadas.

## 7. Antes de compartilhar com empresas

- Confira cada repositório destacado: documentação clara, código funcionando e README atualizado.
- Inclua capturas de tela ou GIFs, além de instruções e limitações reais.
- Dê prioridade a dois ou três projetos com boa documentação, em vez de listar todos indiscriminadamente.
- Se quiser, adicione formas de contato profissionais ao `index.html`, como LinkedIn ou e-mail de trabalho. Não há e-mail inventado no site.
- Evite afirmar criptografia ponta a ponta ou uso de modelos de linguagem onde os projetos não implementam isso.

## 8. Perguntas frequentes

**Precisa pagar?** Não, o GitHub Pages pode hospedar esse site estático gratuitamente em um repositório público elegível.

**Precisa manter o computador ligado?** Não. Depois da publicação, o site é servido pelo GitHub Pages.

**O servidor do Núcleo Link vai rodar no Pages?** Não. O Pages publica a vitrine estática e links para o código; ele não executa serviços Python persistentes nem firmwares.

**Funciona no celular?** Sim, o layout se adapta a telas menores.

**Abri `index.html` e só apareceu 'Carregando projetos'?** Use `bash ver-local.sh`. O navegador pode bloquear `fetch` local via `file://`.

**O script diz que `gh` não foi instalado?** Execute `sudo apt update && sudo apt install gh git` e tente novamente. Em sistemas sem pacote, consulte a documentação do GitHub CLI em https://cli.github.com/manual/installation.
