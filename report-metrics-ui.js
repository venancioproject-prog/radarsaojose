/* Presentation adapter. It changes numerical text only; the report remains the original. */
(function (root) {
  'use strict';
  const M = root.RadarReportMetrics, B = root.RadarReportBindings;
  let source, engine, revision = 0, initialized = false, state = 'IDLE', genders = ['Homem Cis', 'Mulher Cis', 'Outros', 'Homem Trans'];
  const bindings = [], unresolved = [], charts = {};
  const ids = { gender: 'gender', income: 'income', age: 'age', region: 'region', marital: 'marital', work: 'work', home: 'house', politics: 'politics', quality: 'quality', pride: 'pride' };
  const percentPattern = /(?:(?<!%)-)?\d+(?:[.,]\d+)?\s*%/g;
  function filtersFromUI() {
    const filters = {};
    Object.entries(ids).forEach(([field, id]) => {
      const value = document.getElementById('filter-' + id)?.value;
      if (!value || value === 'TODOS') return;
      if (field === 'gender') {
        // Existing filter labels are groups; all cross tabs retain original answers.
        const categories = genders;
        filters.gender = value === 'Homem' ? ['Homem Cis', 'Homem', 'Masculino', 'Cisgênero masculino'] : value === 'Mulher' ? ['Mulher Cis', 'Mulher', 'Feminino', 'Cisgênero feminino'] : value === 'Outros' ? categories.filter(c => !['Homem Cis', 'Homem', 'Masculino', 'Cisgênero masculino', 'Mulher Cis', 'Mulher', 'Feminino', 'Cisgênero feminino'].includes(c)) : value;
      } else filters[field] = field === 'quality' ? (value.match(/[1-5]/)?.[0] || value) : value;
    });
    return filters;
  }
  function protectedText(node) {
    const el = node.parentElement;
    if (el.closest('blockquote, script, style, [data-report-metric]')) return true;
    // Preserve every quotation, including those outside blockquote elements.
    return /^[\s]*["“]/.test((el.closest('p') || el).textContent);
  }
  function wrap(node, pattern, resolve, block) {
    const text = node.nodeValue, matches = [...text.matchAll(pattern)];
    if (!matches.length) return;
    const fragment = document.createDocumentFragment(); let last = 0;
    matches.forEach(match => {
      fragment.append(document.createTextNode(text.slice(last, match.index)));
      const spec = resolve(match[0], node.parentElement, match.index);
      if (spec === false) fragment.append(document.createTextNode(match[0]));
      else {
        const element = document.createElement('span');
        element.textContent = match[0]; element.dataset.reportOriginal = match[0]; element.dataset.reportMetric = spec?.name || JSON.stringify(spec || { pending: true });
        bindings.push({ element, spec, block, original: match[0] }); fragment.append(element);
        if (!spec) unresolved.push({ block, original: match[0], context: text.trim(), status: 'NÃO_REPRODUZÍVEL' });
      }
      last = match.index + match[0].length;
    });
    fragment.append(document.createTextNode(text.slice(last))); node.replaceWith(fragment);
  }
  function textNodes(container) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT); const nodes = [];
    while (walker.nextNode()) if (!protectedText(walker.currentNode)) nodes.push(walker.currentNode);
    return nodes;
  }
  function regionCard(el) {
    let current = el;
    while (current && current.tagName !== 'ARTICLE') {
      const heading = current.querySelector('h5');
      if (heading && current.classList.contains('p-6')) return { container: current, region: heading.textContent.includes('CENTRAL') ? 'Centro' : M.clean(heading.textContent.replace(/ZONA /i, '')).toLowerCase().replace(/^./, x => x.toUpperCase()) };
      if (current.classList.contains('p-4') && current.classList.contains('bg-slate-800')) {
        const label = current.querySelector('span');
        if (label) return { container: current, region: label.textContent.includes('Leste / Sudeste') ? ['Leste', 'Sudeste'] : M.clean(label.textContent.replace(/Zona /i, '')) };
      }
      current = current.parentElement;
    }
    return null;
  }
  function resolve(block, token, el, occurrence) {
    const number = Number(token.replace('%', '').replace(',', '.').trim());
    const context = (el.closest('p, td') || el.parentElement).textContent;
    if (context.includes('Nota: A soma ultrapassa 100%')) return false;
    const region = regionCard(el);
    if (block === 24 && region) {
      const paragraph = el.closest('p');
      const category = paragraph?.textContent.includes('Mesmo jeito') ? 'Do mesmo jeito' : paragraph?.textContent.includes('Melhorando') ? 'Melhorando' : paragraph?.textContent.includes('Piorando') ? 'Piorando' : region.container.textContent.includes('Zona Leste / Sudeste') ? 'Do mesmo jeito' : 'Melhorando';
      return B.pct('future', category, { region: region.region });
    }
    if (block === 25 && region) {
      const f = { region: region.region };
      if (context.includes('INSTAGRAM') || context.includes('TIKTOK')) return B.pct('network', context.includes('TIKTOK') && token === context.match(percentPattern)?.at(-1) ? 'TikTok' : 'Instagram', f);
      if (context.includes('Renda:') && occurrence < context.indexOf('Idade:')) return B.pct('income', region.region === 'Oeste' ? M.income[3] : region.region === 'Sul' ? M.income[2] : M.income[1], f);
      if (context.includes('Idade:')) return B.pct('age', region.region === 'Oeste' ? '+65 anos' : region.region === 'Sudeste' ? '35 a 44 anos' : '25 a 34 anos', f);
      if (context.includes('Política:') && occurrence > context.indexOf('Política:')) return B.pct('politics', 'Direita', f);
      if (context.includes('Toda semana')) return B.pct('frequency', 'Toda semana', f);
      if (context.includes('Centro-Oeste')) return B.pct('destination', B.destination, f);
      if (context.includes('Zona Sul')) return B.pct('destination', 'Zona Sul', f);
      if (context.includes('Preço')) return B.pct('barrier', 'É tudo muito caro', f);
      if (context.includes('Não tem lugar legal')) return { name: undefined, ...B.pct('barrier', 'Não tem lugar legal para ir', f) };
      if (context.includes('Insegurança')) return B.pct('barrier', 'Falta de segurança', f);
      return null; // "Local/fiel" has no approved operational definition.
    }
    if (block === 22 && el.closest('tbody') && el.closest('table')?.textContent.includes('1º LUGAR')) {
      const row = el.closest('tr'), label = row.cells[0].textContent;
      if (label.includes('Outros')) return null; // "Média" and Disney/Globo aggregation undefined.
      const filters = { gender: label.includes('Mulher') ? 'Mulher Cis' : 'Homem Cis', income: label.includes('Até') ? M.income[0] : M.income[4] };
      const option = context.includes('Netflix') ? 'Netflix' : context.includes('Spotify') ? 'Spotify' : context.includes('YT Music') ? 'YouTube Music' : context.includes('Globoplay') ? 'Globoplay' : 'Amazon Prime Video';
      return B.pct('streaming', option, filters);
    }
    if (block === 22 && number === 100) return B.pct('streaming', 'Netflix', { income: M.income[4] });
    if (block === 25) {
      if (number === 41.7) return B.pct('destination', B.destination);
      if (number === 28.3) return B.pct('destination', 'Zona Sul');
      if (number === 11.5) return B.pct('destination', 'Zona Leste');
      if (number === 6.5) return B.pct('destination', 'Zona Norte');
      if (number === 70) return B.pct('destination', [B.destination, 'Zona Sul']);
    }
    if (block === 28 && (context.includes('renda média') || context.includes('Base de cálculo:'))) return false;
    if (block === 21 && number === 20) return false; // Historical interpretive threshold, not an estimate.
    const entry = Object.entries(B.rules[block] || {}).find(([key]) => Number(key) === number)?.[1];
    if (Array.isArray(entry)) {
      if (block === 30) return context.includes('influenciadores') ? entry[1] : entry[0];
      return context.includes('56,8') ? entry[1] : entry[0];
    }
    return entry || null;
  }
  function initialize() {
    if (initialized) return; initialized = true;
    const articles = [...document.querySelectorAll('#executive-report-view > article')];
    articles.forEach((article, i) => {
      const block = Number(article.dataset.reportBlock) || i + 1; article.dataset.reportBlock = block;
      if ([9, 10, 31].includes(block)) article.dataset.reportSource = 'external_reference';
      else if ([4, 5, 6, 7, 8, 11].includes(block)) article.dataset.reportSource = 'methodological_claim';
      else if ((block >= 13 && block <= 30) || [45, 51, 52].includes(block)) article.dataset.reportSource = 'radar_primary';
      if (B.pending.some(p => p.block === block)) article.dataset.editorialStatus = 'PENDENTE_REESCRITA_EDITORIAL';
      if ((block >= 13 && block <= 30) || [45, 51, 52].includes(block)) textNodes(article).forEach(node => wrap(node, percentPattern, (token, el, index) => resolve(block, token, el, index), block));
      const means = block === 16 ? { '3.7': { ...B.mean('quality'), decimals: 1 } } : block === 21 ? { '3.51': { name: 'micro_quality' }, '3.96': { name: 'car_quality' } } : null;
      if (means) textNodes(article).forEach(node => wrap(node, /\b3[.,](?:51|96|7)\b/g, token => means[token.replace(',', '.')] || false, block));
      if (block === 22) textNodes(article).forEach(node => wrap(node, /\b2[.,]8(?= gêneros)/g, () => ({ field: 'music', type: 'meanSelections', decimals: 1 }), block));
      if (block === 23) textNodes(article).forEach(node => wrap(node, /\b3[.,](?:74|72|62)\b/g, (token, el, index) => {
        const context = (el.closest('p') || el.parentElement).textContent;
        const quality = context.includes('vs') || context.includes('QUALIDADE DE VIDA');
        const noPet = token.endsWith('62') || token.endsWith('72');
        return B.mean(quality ? 'quality' : 'petScore', { pet: noPet ? 'Não' : 'Sim' });
      }, block));
      if (block === 25) textNodes(article).forEach(node => wrap(node, /\b[34][.,]\d{2}\b/g, (token, el) => { const card = regionCard(el); return card ? B.mean('quality', { region: card.region }) : false; }, block));
      // Existing absolute sample notes are technical metadata, never converted into a percentage claim.
      textNodes(article).forEach(node => wrap(node, /\b477\b/g, () => ({ type: 'sample' }), block));
      if (block === 21) textNodes(article).forEach(node => wrap(node, /\b102\b/g, () => ({ type: 'numerator', name: 'micro' }), block));
      if (block === 21) textNodes(article).forEach(node => wrap(node, /\b10(?=[xX])/g, () => null, block));
      if (block === 28) { article.dataset.reportSource = 'mixed_unvalidated_scenario'; article.dataset.validationStatus = 'NÃO_VALIDADO'; article.title = 'Cenário monetário histórico: NÃO VALIDADO.'; }
      if (block === 63) { article.dataset.reportSource = 'strategic_hypothesis'; article.dataset.validationStatus = 'HIPÓTESE_ESTRATÉGICA'; article.title = 'Classificações preservadas; regra e pesos não reproduzíveis.'; }
    });
    // Approved paradox uses explicit identifiers, not initial hardcoded percentages.
    [['rep-val-orgulho', 'pride'], ['rep-val-evasao', 'external']].forEach(([id, name]) => {
      const element = document.getElementById(id);
      if (element && !element.querySelector('[data-report-metric]')) bindings.push({ element, spec: { name }, block: 13, original: '—' });
    });
    document.querySelectorAll('[data-report-live-metric]').forEach(element => bindings.push({ element, spec: { name: element.dataset.reportLiveMetric }, block: Number(element.closest('article')?.dataset.reportBlock) || 13, original: '—' }));
  }
  function result(spec) {
    if (!spec) return null;
    if (spec.type === 'sample') return { metric_id: 'filtered_sample', formatted: M.formatNumberBR(engine.n, 0), N: engine.N, n: engine.n, filters: engine.filters, source: 'radar_primary' };
    const r = spec.name ? engine.metric(spec.name) : engine.calculate(spec);
    return spec.type === 'numerator' ? { ...r, formatted: M.formatNumberBR(r.numerator, 0) } : r;
  }
  function paint() {
    const report = document.getElementById('executive-report-view');
    if (report) { report.dataset.metricsState = state; report.dataset.filteredN = engine ? String(engine.n) : ''; report.dataset.smallBase = engine ? String(engine.n > 0 && engine.n < 20) : ''; }
    bindings.forEach(binding => {
      const r = engine && result(binding.spec);
      binding.element.textContent = r?.formatted || '—';
      binding.element.dataset.validationStatus = r?.status || (r ? 'CALCULATED' : binding.spec ? state : 'NÃO_REPRODUZÍVEL');
      // Public tooltip repeats the result. Detailed bases belong to the debug audit.
      binding.element.title = r ? r.formatted : binding.spec ? 'Valor indisponível.' : 'Número pendente de validação.';
    });
    const paradox = document.getElementById('rep-paradoxo');
    if (paradox) {
      const pride = engine?.metric('pride'), external = engine?.metric('external');
      paradox.querySelectorAll('[data-report-majority]').forEach(el => { el.hidden = !(pride?.value > 50); });
      paradox.querySelectorAll('[data-report-live-metric="external"]').forEach(el => { el.closest('p').hidden = !external?.valid; });
      paradox.querySelectorAll('[data-report-coexistence]').forEach(el => { el.hidden = !(pride?.value > 0 && external?.value > 0); });
      paradox.querySelectorAll('[data-report-indicator]').forEach(el => {
        const r = engine?.metric(el.dataset.reportIndicator);
        el.dataset.validN = r ? String(r.valid) : ''; el.dataset.smallBase = r ? String(r.smallBase) : '';
        // Base metadata is technical, rather than another prominent respondent count.
        el.title = r ? `Base válida: ${r.valid}; recorte: ${engine.n}.` : 'Resultado indisponível.';
      });
    }
    const sample = document.getElementById('rep-stat-sample');
    if (sample) sample.textContent = engine ? M.formatNumberBR(engine.n, 0) : '—';
    const margin = document.getElementById('rep-stat-margin');
    if (margin) { margin.dataset.validationStatus = 'NÃO_VALIDADO'; margin.title = 'Margem de erro não validada para o desenho da pesquisa.'; }
    [['rep-bar-orgulho', 'pride'], ['rep-bar-evasao', 'external']].forEach(([id, metric]) => {
      const el = document.getElementById(id); if (el) el.style.width = (engine?.metric(metric).value ?? 0) + '%';
    });
  }
  async function render({ url, key, filters, force = false, bar, sankey, clear } = {}) {
    initialize();
    if (!source) source = root.RadarReportSource.create({ url, key });
    const current = ++revision, selected = filters ?? filtersFromUI();
    state = 'LOADING'; engine = null; paint(); if (clear) clear();
    try {
      const snapshot = await source.load({ force }); if (current !== revision) return;
      engine = M.create(snapshot.records, snapshot.metadata, selected);
      genders = M.create(snapshot.records, snapshot.metadata).distribution('gender').categories.map(c => c.category);
      state = 'READY'; paint();
      const definitions = [['repChartLazerRegiao', 'destination', '#0284C7'], ['repChartBarreirasNoite', 'barrier', '#E11D48'], ['repChartMobilidade', 'transport', '#059669'], ['repChartMusica', 'music', '#7C3AED']];
      definitions.forEach(([id, field, color]) => { const d = engine.distribution(field); charts[id] = d; if (bar) bar(id, d.categories, color); });
      charts.repChartSankeyLazer = engine.flows(); if (sankey) sankey('repChartSankeyLazer', charts.repChartSankeyLazer);
      return audit();
    } catch (error) {
      if (current !== revision) return; engine = null; state = 'SOURCE_ERROR'; paint();
      console.error('Presentation metrics: ' + error.message);
      return { state, error: error.message };
    }
  }
  function audit() { return { state, ...(engine?.audit() || {}), bindings: bindings.map(b => ({ block: b.block, original: b.original, displayed: b.element.textContent, spec: b.spec, result: engine ? result(b.spec) : null })), charts: state === 'READY' ? charts : {}, unresolved, editorial: B.pending }; }
  root.RadarReportUI = { render, audit };
})(globalThis);
