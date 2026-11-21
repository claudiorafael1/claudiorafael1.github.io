/* Portfólio estático: edição de projetos em projects.json; repositórios extras via API pública. */
(() => {
  'use strict';
  const USERNAME = 'claudiorafael1';
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };
  const linkToRepo = (name) => `https://github.com/${USERNAME}/${encodeURIComponent(name)}`;
  const approvedGitHubLink = (url) => {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' || parsed.hostname.toLowerCase() !== 'github.com') return null;
      if (!parsed.pathname.toLowerCase().startsWith(`/${USERNAME.toLowerCase()}/`)) return null;
      return parsed.toString();
    } catch { return null; }
  };

  const art = {
    network: `<svg viewBox="0 0 460 190" aria-hidden="true"><defs><linearGradient id="lineNetwork" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a0f8d2"/><stop offset="1" stop-color="#81b3ff"/></linearGradient></defs><g stroke="url(#lineNetwork)" stroke-width="2" opacity=".65" fill="none"><path d="M92 91H175M282 91H363M235 62V38M235 122V156" stroke-dasharray="7 6"/><path d="M175 91c0-32 28-54 59-54s56 22 56 54-28 52-56 52-59-20-59-52z"/></g><g fill="#132939" stroke="#a1ffe0" stroke-width="2"><rect x="32" y="65" width="95" height="53" rx="8"/><rect x="186" y="56" width="98" height="73" rx="9"/><rect x="333" y="65" width="95" height="53" rx="8"/></g><g fill="#bfffe1" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle"><text x="80" y="88">CARDPUTER</text><text x="80" y="103" opacity=".65">CLIENT</text><text x="235" y="88">NÚCLEO</text><text x="235" y="103" opacity=".7">LINK</text><text x="380" y="88">BROWSER</text><text x="380" y="103" opacity=".65">CLIENT</text></g><g fill="#a8ffd0"><circle cx="235" cy="38" r="6"/><circle cx="235" cy="155" r="6"/></g></svg>`,
    ai: `<svg viewBox="0 0 460 190" aria-hidden="true"><defs><linearGradient id="glowAi" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#c8aaff"/><stop offset="1" stop-color="#a2ffde"/></linearGradient></defs><g transform="translate(230 95)"><circle r="78" fill="none" stroke="#8f79ca" stroke-width="1" stroke-dasharray="3 7"/><circle r="57" fill="#241c42" stroke="url(#glowAi)" stroke-width="2"/><circle r="31" fill="#271f4e" stroke="#a1f7d5" stroke-width="1"/><g fill="none" stroke="url(#glowAi)" stroke-width="3" stroke-linecap="round"><path d="M-23 0L-11-17L5-9L19-26M-23 0l14 19 24-6M5-9L15 13"/></g><g fill="#e8d6ff"><circle cx="-23" cy="0" r="4"/><circle cx="-11" cy="-17" r="4"/><circle cx="5" cy="-9" r="4"/><circle cx="19" cy="-26" r="4"/><circle cx="-9" cy="19" r="4"/><circle cx="15" cy="13" r="4"/></g></g><g fill="#cae0f4" font-family="monospace" font-size="11" opacity=".85"><text x="30" y="44">&gt; INPUT</text><text x="310" y="155">OFFLINE_AI</text><text x="28" y="156">microSD: OK</text></g></svg>`,
    stack: `<svg viewBox="0 0 460 190" aria-hidden="true"><g fill="none" stroke="#9af8c6" stroke-width="2" opacity=".4"><path d="M86 94h77M298 94h69" stroke-dasharray="7 7"/></g><g transform="translate(164 36)"><rect width="137" height="117" rx="12" fill="#12372f" stroke="#a4f6d1" stroke-width="2"/><rect x="13" y="14" width="111" height="24" rx="5" fill="#24493d"/><text x="68" y="31" text-anchor="middle" fill="#c3ffe1" font-size="12" font-family="monospace">REST API</text><g fill="#82d8b7"><rect x="18" y="53" width="44" height="7" rx="3"/><rect x="18" y="68" width="91" height="6" rx="3" opacity=".75"/><rect x="18" y="83" width="68" height="6" rx="3" opacity=".55"/></g></g><g fill="#152d2e" stroke="#89cfbe" stroke-width="1.5"><rect x="30" y="65" width="105" height="58" rx="8"/><rect x="324" y="65" width="105" height="58" rx="8"/></g><g fill="#cbffe5" font-family="monospace" font-size="12" text-anchor="middle"><text x="82" y="88">CLIENT</text><text x="82" y="105" opacity=".65">UI</text><text x="376" y="88">DATABASE</text><text x="376" y="105" opacity=".65">DATA</text></g></svg>`,
    data: `<svg viewBox="0 0 460 190" aria-hidden="true"><g transform="translate(155 14)"><ellipse cx="74" cy="29" rx="75" ry="19" fill="#5b4933" stroke="#ffca96" stroke-width="2"/><path d="M-1 29v96c0 23 150 23 150 0V29" fill="#342b27" stroke="#ffca96" stroke-width="2"/><path d="M-1 61c0 24 150 24 150 0M-1 95c0 24 150 24 150 0" fill="none" stroke="#b79d7d" stroke-width="2"/><ellipse cx="74" cy="29" rx="47" ry="9" fill="#edac72" opacity=".35"/></g><g fill="#ffe7be" font-family="monospace" font-size="11"><text x="38" y="62">POST</text><text x="352" y="145">SELECT *</text></g><g fill="none" stroke="#f3c38e" stroke-dasharray="5 5" opacity=".7"><path d="M75 70h72M305 116h78"/></g></svg>`,
  };
  let curated = [];
  let extra = [];
  let expanded = false;
  let selectedFilter = 'todos';
  let queryText = '';
  const icons = { ia: '✧', comunicacao: '⌁', backend: '{ }', web: '◈' };
  const labels = { ia: 'IA & EDGE', comunicacao: 'COMUNICAÇÃO', backend: 'BACKEND', web: 'WEB' };

  function visible(project) {
    const matchCat = selectedFilter === 'todos' || project.category === selectedFilter;
    const haystack = [project.title, project.repo, project.description, ...(project.tags || [])].join(' ').toLocaleLowerCase('pt-BR');
    return matchCat && haystack.includes(queryText);
  }
  function setLink(anchor, url) {
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    return anchor;
  }
  function featuredCard(p, i) {
    const card = el('article','project-card');
    const visual = el('div', `project-image ${['network','ai','stack','data'].includes(p.visual) ? p.visual : 'network'}`);
    const illustration = el('div','project-art');
    illustration.innerHTML = art[p.visual] || art.network; // only static, trusted illustrations
    visual.append(illustration,el('span','project-num',String(i+1).padStart(2,'0')),
      el('span','project-image-tag',labels[p.category] || 'PROJETO'));
    const body = el('div','project-body');
    body.append(el('span','card-eyebrow',p.eyebrow || 'PROJETO OPEN SOURCE'),el('h3','',p.title),el('p','',p.description));
    const tags = el('div','tech-tags');
    for (const tag of (p.tags || []).slice(0,7)) tags.append(el('span','',tag));
    body.append(tags);
    const footer = el('div','card-bottom');
    const repoURL = approvedGitHubLink(p.links?.[0]?.url) || linkToRepo(p.repo);
    footer.append(setLink(el('a','',p.links?.[0]?.label || 'Ver código no GitHub'),repoURL),setLink(el('a','card-link-icon','↗'),repoURL));
    footer.lastChild.setAttribute('aria-label',`Abrir ${p.title} no GitHub`);
    body.append(footer);
    if (p.note) body.append(el('div','project-note',p.note));
    card.append(visual,body);
    return card;
  }
  function renderFeatured() {
    const target = $('#featuredProjects');
    target.replaceChildren();
    const items = curated.filter(visible);
    items.forEach((item, i) => target.append(featuredCard(item,i)));
    $('#featuredEmpty').hidden = items.length !== 0;
  }
  function extraCard(p) {
    const a = setLink(el('a','mini-card'), linkToRepo(p.repo));
    const top = el('div','mini-card-top');
    top.append(el('span','mini-folder',icons[p.category] || '⌁'),el('span','',labels[p.category] || 'PROJETO'));
    const bottom = el('div','mini-card-bottom');
    bottom.append(el('span','',p.language || 'CÓDIGO'),el('span','',`★ ${p.stars ?? 0}`),el('span','','VER ↗'));
    a.append(top,el('h3','',p.title),el('p','',p.description),bottom);
    a.setAttribute('aria-label',`Ver repositório ${p.repo} no GitHub`);
    return a;
  }
  function renderExtra() {
    const target = $('#moreProjects');
    target.replaceChildren();
    const filtered = extra.filter(visible);
    const selected = expanded ? filtered : filtered.slice(0,9);
    selected.forEach(p => target.append(extraCard(p)));
    if (!selected.length) target.append(el('p','empty-state', extra.length ? 'Nenhum outro projeto corresponde ao filtro.' : 'Nenhum outro repositório disponível no momento.'));
    const button = $('#showMore');
    button.hidden = filtered.length <= 9;
    button.textContent = expanded ? 'Mostrar menos ↑' : `Mostrar todos (${filtered.length}) ↓`;
  }
  function inferCategory(repo) {
    const blob = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
    if (/cardputer|esp32|arduino|inteligencia.artificial|\bia\b|\bai\b|\bml\b|eliza|machine.learning|ollama/.test(blob)) return 'ia';
    if (/xmpp|chat|socket|servidor|messag|lora|wifi|network|comunic|mqtt/.test(blob)) return 'comunicacao';
    if (/spring|java|mysql|api|backend|crud|rest|sql|database/.test(blob) || ['Java','Python','PHP','Go'].includes(repo.language)) return 'backend';
    return 'web';
  }
  function normalise(repo) {
    return {repo:repo.name,title:repo.name.replace(/[-_]/g,' '),description:repo.description?.trim() || 'Repositório público. Acesse o código e a documentação para conhecer o projeto.',category:inferCategory(repo),tags:[repo.language].filter(Boolean),language:repo.language || '',stars:repo.stargazers_count || 0};
  }
  async function fetchExtras() {
    const status = $('#apiStatus');
    try {
      const repos = [];
      // até 300 repositórios; uma requisição por página, sem token privado no navegador
      for (let page=1; page<=3; page++) {
        const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&page=${page}&sort=updated&type=owner`,{headers:{'Accept':'application/vnd.github+json'}});
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Resposta inesperada');
        repos.push(...data);
        if (data.length < 100) break;
      }
      const seen = new Set(curated.map(p=>p.repo.toLowerCase()));
      extra = repos.filter(repo=>repo && typeof repo.name==='string' && !seen.has(repo.name.toLowerCase()) && repo.name.toLowerCase()!==`${USERNAME.toLowerCase()}.github.io` && !repo.fork && !repo.archived && !repo.disabled && Number(repo.size)>0)
        .sort((a,b)=>((b.stargazers_count||0)-(a.stargazers_count||0)) || (Date.parse(b.pushed_at||0)-Date.parse(a.pushed_at||0))).map(normalise);
      status.classList.add('ok');
      status.innerHTML = '<span class="api-status-dot"></span> API do GitHub conectada · projetos atualizados';
      renderExtra();
    } catch(error) {
      status.classList.add('offline');
      status.innerHTML = '<span class="api-status-dot"></span> API indisponível · destaques continuam acessíveis';
      $('#moreProjects').replaceChildren(el('p','empty-state','Não foi possível carregar a lista agora. Consulte os repositórios diretamente no GitHub.'));
      $('#showMore').hidden = true;
      console.warn('GitHub API indisponível:',error.message);
    }
  }
  async function loadCurated() {
    try {
      const response = await fetch('projects.json',{cache:'no-store'});
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if(!Array.isArray(data)) throw new Error('projects.json deve ser uma lista');
      curated = data.filter(p=>p && typeof p.repo==='string' && typeof p.title==='string' && typeof p.description==='string' && p.featured!==false);
      renderFeatured();
    } catch(error) {
      $('#featuredProjects').replaceChildren(el('p','empty-state','Não foi possível carregar projects.json. Se estiver testando no computador, inicie um servidor local com ./ver-local.sh.'));
      console.warn(error);
    } finally { fetchExtras(); }
  }
  document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
    selectedFilter=btn.dataset.filter;
    document.querySelectorAll('.filter').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    expanded=false;renderFeatured();renderExtra();
  }));
  $('#projectSearch').addEventListener('input',e=>{queryText=e.target.value.trim().toLocaleLowerCase('pt-BR');expanded=false;renderFeatured();renderExtra();});
  $('#showMore').addEventListener('click',()=>{expanded=!expanded;renderExtra();});
  $('#year').textContent=new Date().getFullYear();
  window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-window.innerHeight;$('#scrollIndicator').style.width=`${max>0?window.scrollY/max*100:0}%`;},{passive:true});
  loadCurated();
})();
