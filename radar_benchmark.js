/* Territorial comparisons rebuilt from preserved IBGE observations. */
(function (global) {
  'use strict';
  const URL = 'public-data/benchmark/territorial.v1.json';
  const metrics = {
    pop2022: {title:'População recenseada', year:'2022', unit:'habitantes', source:'censo', icon:'fa-people-group', note:'Pessoas recenseadas no Censo 2022. Não é uma estimativa.'},
    pop2026: {title:'População estimada', year:'2026', unit:'habitantes', source:'estimativa', icon:'fa-city', note:'Estimativa oficial do IBGE para 1º de julho de 2026.'},
    density: {title:'Densidade demográfica', year:'2022', unit:'hab/km²', digits:2, source:'censo', icon:'fa-map-location-dot', note:'População por área territorial, conforme o Censo 2022.'},
    gdp: {title:'PIB municipal', year:'2023', unit:'R$ bilhões', digits:2, scale:1000000, source:'economia', icon:'fa-chart-column', note:'PIB total a preços correntes. Mede a dimensão da economia; não é renda por habitante.'},
    industry: {title:'Indústria na economia', year:'2021', unit:'% do VAB', digits:1, source:'economia', icon:'fa-industry', note:'VAB da indústria ÷ VAB total × 100. Participação calculada com valores do mesmo ano.'},
    services: {title:'Serviços na economia', year:'2021', unit:'% do VAB', digits:1, source:'economia', icon:'fa-briefcase', note:'VAB dos serviços, excluindo administração, defesa, educação e saúde públicas e seguridade social, ÷ VAB total × 100.'}
  };
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = (v, d=0) => Number(v).toLocaleString('pt-BR', {minimumFractionDigits:d, maximumFractionDigits:d});
  const format = (v, key) => v == null ? 'Não disponível' : number(v / (metrics[key].scale || 1), metrics[key].digits || 0);
  let data, pending;

  function validate(value) {
    if (value?.schema_version !== 1 || value.reference !== '3549904' || !Array.isArray(value.territories) || !value.sources) throw Error('Base incompatível');
    const ids = new Set();
    for (const t of value.territories) {
      if (ids.has(t.codigo_ibge) || typeof t.nome !== 'string' || !t.values) throw Error('Território inválido');
      ids.add(t.codigo_ibge);
      for (const key of Object.keys(metrics)) if (t.values[key] !== null && (!Number.isFinite(t.values[key]) || t.values[key] < 0)) throw Error('Indicador inválido');
    }
    if (!ids.has(value.reference)) throw Error('Município de referência ausente');
    for (const name of ['censo','estimativa','economia']) if (!/^https:\/\/apisidra\.ibge\.gov\.br\//.test(value.sources[name]?.url || '')) throw Error('Fonte inválida');
    return value;
  }

  async function load() {
    if (data) return data;
    if (!pending) pending = fetch(URL).then(r => {if (!r.ok) throw Error('Base indisponível'); return r.json();}).then(validate).then(d => data = d).finally(() => pending = null);
    return pending;
  }

  function source(key) {
    const m = metrics[key], s = data.sources[m.source];
    return `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">IBGE · SIDRA ${esc(s.table)} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a><span>${m.year}</span>`;
  }

  function difference(a, b, key) {
    if (a == null || b == null || (b === 0 && !['industry','services'].includes(key))) return 'Diferença indisponível';
    const pp = ['industry','services'].includes(key), diff = pp ? a-b : (a-b)/b*100;
    return `${diff > 0 ? '+' : diff < 0 ? '−' : ''}${number(Math.abs(diff),1)}${pp ? ' p.p.' : '%'} de SJC em relação à referência`;
  }

  function renderCards(root) {
    const selected = root.querySelector('#hub-benchmark-city-select').value;
    const base = data.territories.find(t => t.codigo_ibge === data.reference);
    const target = data.territories.find(t => t.codigo_ibge === selected);
    if (!target) return;
    root.querySelector('[data-benchmark-context]').textContent = `São José dos Campos / SP × ${target.nome}${target.uf ? ' / '+target.uf : ''}`;
    root.querySelector('[data-benchmark-area]').textContent = `Área no Censo 2022: SJC ${number(base.values.area,2)} km² · ${target.nome} ${number(target.values.area,2)} km²`;
    root.querySelector('#hub-benchmark-cards-grid').innerHTML = Object.entries(metrics).map(([key,m]) => {
      const a = base.values[key], b = target.values[key], max = ['industry','services'].includes(key) ? 100 : Math.max(a || 0,b || 0,1);
      const rows = [[base,a,'base'],[target,b,'target']].map(([t,v,kind]) => `<div class="benchmark-measure"><div><span><i class="benchmark-dot benchmark-${kind}" aria-hidden="true"></i>${esc(t.nome)}</span><strong>${format(v,key)}<small>${esc(m.unit)}</small></strong></div><div class="benchmark-track"><span class="benchmark-${kind}" style="width:${v == null ? 0 : v/max*100}%"></span></div></div>`).join('');
      return `<article class="benchmark-card"><header><span class="benchmark-icon"><i class="fa-solid ${m.icon}" aria-hidden="true"></i></span><h4>${m.title}</h4><span class="benchmark-year">${m.year}</span></header>${rows}<p class="benchmark-difference">${difference(a,b,key)}</p><p class="benchmark-note">${m.note}</p><footer>${source(key)}</footer></article>`;
    }).join('');
    renderRanking(root);
  }

  function renderRanking(root) {
    const key = root.querySelector('[data-benchmark-metric]').value, m = metrics[key];
    const selected = root.querySelector('#hub-benchmark-city-select').value;
    // Aggregates are references, never entries in the municipality ranking.
    const rows = data.territories.filter(t => t.codigo_ibge.length === 7 && t.values[key] != null).sort((a,b) => b.values[key]-a.values[key] || a.nome.localeCompare(b.nome,'pt-BR'));
    let position = 0, previous;
    root.querySelector('[data-benchmark-ranking]').innerHTML = rows.map((t,i) => {
      if (t.values[key] !== previous) position = i+1;
      previous = t.values[key];
      const isBase = t.codigo_ibge === data.reference, isTarget = t.codigo_ibge === selected;
      return `<tr class="${isBase ? 'benchmark-row-base' : isTarget ? 'benchmark-row-target' : ''}"><td>${position}</td><th scope="row">${esc(t.nome)}${isBase ? '<span class="benchmark-row-label">SJC</span>' : isTarget ? '<span class="benchmark-row-label">Comparação</span>' : ''}</th><td>${esc(t.uf)}</td><td>${format(t.values[key],key)}</td></tr>`;
    }).join('');
    root.querySelector('[data-benchmark-unit]').textContent = `${m.unit} · ${m.year}`;
    root.querySelector('[data-benchmark-ranking-source]').innerHTML = source(key);
  }

  function shell(root) {
    const groups = [...new Set(data.territories.filter(t => t.codigo_ibge !== data.reference).map(t => t.grupo))];
    root.innerHTML = `<section class="benchmark-intro"><div><p class="benchmark-eyebrow">Comparação entre territórios</p><h3>Benchmark territorial</h3><p>Compare São José dos Campos com outras cidades e conheça as diferenças de população e estrutura econômica.</p></div><span class="benchmark-origin"><i class="fa-solid fa-database" aria-hidden="true"></i> Dados do IBGE</span></section>
    <section class="benchmark-comparison" aria-label="Comparação territorial"><div class="benchmark-toolbar"><div><p class="benchmark-eyebrow">São José dos Campos ×</p><label for="hub-benchmark-city-select">Escolha a referência de comparação</label><select id="hub-benchmark-city-select">${groups.map(g => `<optgroup label="${esc(g)}">${data.territories.filter(t => t.grupo === g && t.codigo_ibge !== data.reference).map(t => `<option value="${esc(t.codigo_ibge)}" ${t.codigo_ibge==='3554102'?'selected':''}>${esc(t.nome)}${t.uf ? ' / '+esc(t.uf) : ''}</option>`).join('')}</optgroup>`).join('')}</select></div><div class="benchmark-legend"><span><i class="benchmark-dot benchmark-base" aria-hidden="true"></i>São José dos Campos</span><span><i class="benchmark-dot benchmark-target" aria-hidden="true"></i>Referência selecionada</span></div></div><div class="benchmark-context"><h4 data-benchmark-context></h4><p data-benchmark-area></p></div><div id="hub-benchmark-cards-grid" class="benchmark-cards" aria-live="polite"></div></section>
    <section class="benchmark-ranking"><div class="benchmark-ranking-heading"><div><p class="benchmark-eyebrow">Municípios em perspectiva</p><h3>Posição no grupo de cidades</h3><p>Ordem decrescente entre os 31 municípios selecionados. A posição não representa um ranking nacional de qualidade de vida.</p></div><label>Indicador<select data-benchmark-metric>${Object.entries(metrics).map(([key,m]) => `<option value="${key}" ${key==='gdp'?'selected':''}>${m.title} · ${m.year}</option>`).join('')}</select></label></div><div class="benchmark-table-scroll" tabindex="0" role="region" aria-label="Classificação dos municípios; role para consultar todos"><table><caption class="benchmark-sr-only">Comparação dos municípios selecionados</caption><thead><tr><th scope="col">Posição</th><th scope="col">Município</th><th scope="col">UF</th><th scope="col" data-benchmark-unit></th></tr></thead><tbody data-benchmark-ranking></tbody></table></div><footer data-benchmark-ranking-source></footer></section>
    <details class="benchmark-method"><summary>Fontes e critérios de comparação</summary><div><p>Cada indicador usa a mesma tabela, conceito e ano para todos os territórios. O Censo 2022 e a estimativa de 2026 são medidas distintas. Os anos disponíveis variam entre indicadores e estão identificados em cada card.</p><p>PIB total é apresentado em bilhões de reais, convertido da unidade original de mil reais. As participações da indústria e dos serviços são calculadas sobre o valor adicionado bruto (VAB) de 2021. O ano de composição não é o ano do PIB total de 2023.</p><p>Estado de São Paulo e Brasil são agregados territoriais, não médias de municípios. Participam da comparação direta, mas ficam fora da classificação das cidades. Os grupos de municípios são uma seleção editorial, sem equivalência automática de porte ou perfil.</p><p>Diferenças positivas ou negativas indicam apenas magnitude. Não expressam vantagem ou qualidade. Salários, IDHM, escolarização, frota e segurança da versão anterior aguardam validação de fonte, conceito e período.</p><p>Consulta ao IBGE: ${new Date(data.retrieved_at).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'})}. <a href="${URL}" target="_blank" rel="noopener noreferrer">Consultar a base e as referências das fontes</a>.</p></div></details>`;
    root.onchange = e => {
      if (e.target.id === 'hub-benchmark-city-select') renderCards(root);
      else if (e.target.matches('[data-benchmark-metric]')) renderRanking(root);
    };
    renderCards(root);
    root.dataset.benchmarkReady = 'true';
  }

  async function mount(root) {
    if (!root || root.dataset.benchmarkReady === 'true') return;
    if (root.dataset.benchmarkLoading === 'true') return;
    root.dataset.benchmarkLoading = 'true';
    root.innerHTML = '<p class="benchmark-loading" role="status">Carregando as comparações territoriais…</p>';
    try {await load(); shell(root);}
    catch (error) {
      root.innerHTML = '<div class="benchmark-error" role="status"><h3>Não foi possível carregar as comparações</h3><p>Tente carregar novamente a base de indicadores do IBGE.</p><button type="button" data-benchmark-retry>Tentar novamente</button></div>';
      root.querySelector('[data-benchmark-retry]').onclick = () => mount(root);
      console.warn('Benchmark: '+error.message);
    } finally {delete root.dataset.benchmarkLoading;}
  }
  global.RadarBenchmark = {mount,validate,metrics};
})(window);
