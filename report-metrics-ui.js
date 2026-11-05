/* Presentation adapter. It changes numerical text only; the report remains the original. */
(function (root) {
  'use strict';
  const M = root.RadarReportMetrics, B = root.RadarReportBindings;
  let source, engine, revision = 0, initialized = false, state = 'IDLE';
  let genders = ['Homem Cis', 'Mulher Cis', 'Outros', 'Homem Trans'];
  const bindings = [], unresolved = [], charts = {};
  const ids = { gender: 'gender', income: 'income', age: 'age', region: 'region', marital: 'marital', work: 'work', home: 'house', politics: 'politics', quality: 'quality', pride: 'pride' };
  const percentPattern = /(?:(?<!%)-)?\d+(?:[.,]\d+)?\s*%/g;
  function filtersFromUI() {
    const filters = {};
    Object.entries(ids).forEach(([field, id]) => {
      const value = document.getElementById('filter-' + id)?.value;
      if (!value || value === 'TODOS') return;
      if (field === 'gender') {
        const categories = genders;
        filters.gender = value === 'Homem' ? ['Homem Cis', 'Homem', 'Masculino', 'Cisgênero masculino'] : value === 'Mulher' ? ['Mulher Cis', 'Mulher', 'Feminino', 'Cisgênero feminino'] : value === 'Outros' ? categories.filter(c => !['Homem Cis', 'Homem', 'Masculino', 'Cisgênero masculino', 'Mulher Cis', 'Mulher', 'Feminino', 'Cisgênero feminino'].includes(c)) : value;
      } else filters[field] = field === 'quality' ? (value.match(/[1-5]/)?.[0] || value) : value;
    });
    return filters;
  }
  function protectedText(node) {
    const el = node.parentElement;
    if (!el || el.closest('blockquote, script, style, [data-report-metric], [data-report-spec], [data-report-external]')) return true;
    return /^[\s]*["“]/.test((el.closest('p') || el).textContent);
  }
  function wrap(node, pattern, resolve, block) {
    if (protectedText(node)) return;
    const text = node.nodeValue, matches = [...text.matchAll(pattern)];
    if (!matches.length) return;
    const fragment = document.createDocumentFragment();
    let last = 0;
    matches.forEach((match, index) => {
      fragment.append(text.slice(last, match.index));
      const spec = resolve(match[0], node.parentElement, index);
      if (!spec) {
        fragment.append(match[0]);
        last = match.index + match[0].length;
        return;
      }
      const element = document.createElement('span');
      element.textContent = match[0]; element.dataset.reportOriginal = match[0]; element.dataset.reportMetric = spec?.name || JSON.stringify(spec || { pending: true });
      bindings.push({ element, spec, block, original: match[0] }); fragment.append(element);
      last = match.index + match[0].length;
    });
    fragment.append(text.slice(last));
    node.replaceWith(fragment);
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
    if (context.includes('Nota: A soma ultrapassa 100%') || context.includes('não somam 100%')) return false;
    const region = regionCard(el);
    if ((block === 24 || block === 39) && region) {
      const paragraph = el.closest('p');
      const category = paragraph?.textContent.includes('Mesmo jeito') ? 'Do mesmo jeito' : paragraph?.textContent.includes('Melhorando') ? 'Melhorando' : paragraph?.textContent.includes('Piorando') ? 'Piorando' : region.container.textContent.includes('Zona Leste / Sudeste') ? 'Do mesmo jeito' : 'Melhorando';
      return B.pct('future', category, { region: region.region });
    }
    if ((block === 25 || block === 40 || block === 41) && region) {
      const f = { region: region.region };
      if (context.includes('INSTAGRAM') || context.includes('TIKTOK')) return B.pct('network', context.includes('TIKTOK') && token === context.match(percentPattern)?.at(-1) ? 'TikTok' : 'Instagram', f);
      if (context.includes('Renda:') && occurrence < context.indexOf('Idade:')) return B.pct('income', region.region === 'Oeste' ? M.income[3] : region.region === 'Sul' ? M.income[2] : M.income[1], f);
      if (context.includes('Idade:')) return B.pct('age', region.region === 'Oeste' ? '+65 anos' : region.region === 'Sudeste' ? '35 a 44 anos' : '25 a 34 anos', f);
      if (context.includes('Política:') && occurrence > context.indexOf('Política:')) return B.pct('politics', 'Direita', f);
      if (context.includes('Toda semana')) return B.pct('frequency', 'Toda semana', f);
      if (context.includes('Centro-Oeste') || context.includes('Centro/Oeste')) return B.pct('destination', B.destination, f);
      if (context.includes('Zona Sul')) return B.pct('destination', 'Zona Sul', f);
      if (context.includes('Preço')) return B.pct('barrier', 'É tudo muito caro', f);
      if (context.includes('Não tem lugar legal')) return { name: undefined, ...B.pct('barrier', 'Não tem lugar legal para ir', f) };
      if (context.includes('Insegurança')) return B.pct('barrier', 'Falta de segurança', f);
      return null;
    }
    if ((block === 22 || block === 29) && el.closest('tbody') && el.closest('table')?.textContent.includes('1º LUGAR')) {
      const row = el.closest('tr'), label = row.cells[0].textContent;
      if (label.includes('Outros')) return null;
      const filters = { gender: label.includes('Mulher') ? 'Mulher Cis' : 'Homem Cis', income: label.includes('Até') ? M.income[0] : M.income[4] };
      const option = context.includes('Netflix') ? 'Netflix' : context.includes('Spotify') ? 'Spotify' : context.includes('YT Music') ? 'YouTube Music' : context.includes('Globoplay') ? 'Globoplay' : 'Amazon Prime Video';
      return B.pct('streaming', option, filters);
    }
    if ((block === 22 || block === 29) && number === 100) return B.pct('streaming', 'Netflix', { income: M.income[4] });
    if (block === 25 || block === 40 || block === 41) {
      if (number === 41.7) return B.pct('destination', B.destination);
      if (number === 28.3) return B.pct('destination', 'Zona Sul');
      if (number === 11.5) return B.pct('destination', 'Zona Leste');
      if (number === 6.5) return B.pct('destination', 'Zona Norte');
      if (number === 70) return B.pct('destination', [B.destination, 'Zona Sul']);
    }
    if ((block === 28 || block === 43) && (context.includes('renda média') || context.includes('Base de cálculo:'))) return false;
    if ((block === 21 || block === 26) && number === 20) return false;
    const entry = Object.entries(B.rules[block] || {}).find(([key]) => Number(key) === number)?.[1]
      || Object.entries(B.global || {}).find(([key]) => Number(key) === number)?.[1];
    if (Array.isArray(entry)) {
      if (block === 30 || block === 45) return context.includes('influenciadores') ? entry[1] : entry[0];
      return context.includes('56,8') ? entry[1] : entry[0];
    }
    return entry || null;
  }
  function initialize() {
    if (initialized) return; initialized = true;
    const articles = [...document.querySelectorAll('#executive-report-view > article')];
    articles.forEach((article, i) => {
      const block = Number(article.dataset.reportBlock) || i + 1; article.dataset.reportBlock = block;
      article.querySelectorAll('[data-report-spec]').forEach(element => {
        try {
          const spec = JSON.parse(element.dataset.reportSpec);
          bindings.push({ element, spec, block, original: element.textContent.trim() || '—' });
        } catch (err) {
          console.warn('Invalid data-report-spec JSON:', element.dataset.reportSpec, err);
        }
      });
      if (article.dataset.editorialVersion === '4') return;
      if ([9, 10, 31, 46, 47, 48].includes(block)) article.dataset.reportSource = 'external_reference';
      else if ([4, 5, 6, 7, 8, 11].includes(block)) article.dataset.reportSource = 'methodological_claim';
      else if (block >= 13 && block <= 114) article.dataset.reportSource = 'radar_primary';
      if (B.pending.some(p => p.block === block)) article.dataset.editorialStatus = 'PENDENTE_REESCRITA_EDITORIAL';
      if (block >= 13 && block <= 114) textNodes(article).forEach(node => wrap(node, percentPattern, (token, el, index) => resolve(block, token, el, index), block));
      const means = (block === 16 || block === 17) ? { '3.7': { ...B.mean('quality'), decimals: 1 } } : (block === 21 || block === 27) ? { '3.51': { name: 'micro_quality' }, '3.96': { name: 'car_quality' }, '3.92': { name: 'car_quality' } } : null;
      if (means) textNodes(article).forEach(node => wrap(node, /\b3[.,](?:51|96|92|7)\b/g, token => means[token.replace(',', '.')] || false, block));
      if (block === 22 || block === 28) textNodes(article).forEach(node => wrap(node, /\b2[.,]8(?= gêneros)/g, () => ({ field: 'music', type: 'meanSelections', decimals: 1 }), block));
      if (block === 23 || block === 33 || block === 66) textNodes(article).forEach(node => wrap(node, /\b3[.,](?:74|73|72|62)\b/g, (token, el) => {
        const context = (el.closest('p') || el.parentElement).textContent;
        const quality = context.includes('vs') || context.includes('QUALIDADE DE VIDA');
        const noPet = token.endsWith('62') || token.endsWith('72');
        return B.mean(quality ? 'quality' : 'petScore', { pet: noPet ? 'Não' : 'Sim' });
      }, block));
      if (block === 25 || block === 40 || block === 41) textNodes(article).forEach(node => wrap(node, /\b[34][.,]\d{2}\b/g, (token, el) => { const card = regionCard(el); return card ? B.mean('quality', { region: card.region }) : false; }, block));
      textNodes(article).forEach(node => wrap(node, /\b477\b/g, () => ({ type: 'sample' }), block));
      if (block === 21 || block === 27) textNodes(article).forEach(node => wrap(node, /\b102\b/g, () => ({ type: 'numerator', name: 'micro' }), block));
      if (block === 21 || block === 27) textNodes(article).forEach(node => wrap(node, /\b10(?=[xX])/g, () => null, block));
      if (block === 43) { article.dataset.reportSource = 'mixed_unvalidated_scenario'; article.dataset.validationStatus = 'NÃO_VALIDADO'; article.title = 'Cenário monetário histórico: NÃO VALIDADO.'; }
      if (block === 97) { article.dataset.reportSource = 'strategic_hypothesis'; article.dataset.validationStatus = 'HIPÓTESE_ESTRATÉGICA'; article.title = 'Classificações preservadas; regra e pesos não reproduzíveis.'; }
    });
    [['rep-val-orgulho', 'pride'], ['rep-val-evasao', 'external']].forEach(([id, name]) => {
      const element = document.getElementById(id);
      if (element && !element.querySelector('[data-report-metric]')) bindings.push({ element, spec: { name }, block: 14, original: element.textContent.trim() || (name === 'pride' ? '74,2%' : '66,2%') });
    });
    document.querySelectorAll('[data-report-live-metric]').forEach(element => bindings.push({ element, spec: { name: element.dataset.reportLiveMetric }, block: Number(element.closest('article')?.dataset.reportBlock) || 14, original: element.textContent.trim() || '—' }));
  }
  function result(spec) {
    if (!spec || !engine) return null;
    if (spec.type === 'sample' || spec.type === 'total' || (spec.type === 'valid' && !spec.field)) {
      return { formatted: M.formatNumberBR(engine.n, 0) };
    }
    if (!spec.name && !spec.field) return null;
    try {
      const r = spec.name ? engine.metric(spec.name) : engine.calculate(spec.type === 'valid'
        ? { ...spec, type: 'percent', options: [] } : spec);
      if (spec.type === 'valid') return { ...r, formatted: M.formatNumberBR(r.valid, 0) };
      return spec.type === 'numerator' ? { ...r, formatted: M.formatNumberBR(r.numerator, 0) } : r;
    } catch (_) {
      return null;
    }
  }
  function paint() {
    const report = document.getElementById('executive-report-view');
    if (report) { report.dataset.metricsState = state; report.dataset.filteredN = engine ? String(engine.n) : ''; report.dataset.smallBase = engine ? String(engine.n > 0 && engine.n < 20) : ''; }
    bindings.forEach(binding => {
      const r = engine && result(binding.spec);
      if (r?.formatted && r.formatted !== '—') {
        binding.element.textContent = r.formatted;
      } else if (binding.original && binding.original !== '—') {
        binding.element.textContent = binding.original;
      }
      binding.element.dataset.validationStatus = r?.status || (r ? 'CALCULATED' : binding.spec ? state : 'NÃO_REPRODUZÍVEL');
      binding.element.title = r ? r.formatted : binding.spec ? 'Valor indisponível.' : 'Número pendente de validação.';
    });
    document.querySelectorAll('[data-report-distribution]').forEach(container => {
      const tbody = container.querySelector('tbody');
      if (!tbody) return;
      tbody.replaceChildren();
      if (!engine) return;
      const d = engine.distribution(container.dataset.reportDistribution);
      container.dataset.validN = String(d.valid);
      container.dataset.filteredN = String(engine.n);
      d.categories.forEach(category => {
        const row = document.createElement('tr');
        const label = document.createElement('td'), value = document.createElement('td');
        label.className = 'py-2 border-t border-slate-100'; value.className = 'py-2 text-right border-t border-slate-100';
        label.textContent = category.category; value.textContent = M.formatPercentBR(category.value);
        row.append(label, value); tbody.append(row);
      });
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
        el.title = r ? `Base válida: ${r.valid}; recorte: ${engine.n}.` : 'Resultado indisponível.';
      });
    }
    const sample = document.getElementById('rep-stat-sample');
    if (sample) sample.textContent = engine ? M.formatNumberBR(engine.n, 0) : (sample.textContent || '477');
    const margin = document.getElementById('rep-stat-margin');
    if (margin) { margin.dataset.validationStatus = 'REFERENCIA_TEORICA_ALEATORIA'; margin.textContent = '±4,5 p.p.'; margin.title = 'Cálculo ilustrativo para amostra aleatória simples de 477 pessoas, a 95% e p=50%. Não é margem de erro probabilística validada para o recrutamento digital por cotas.'; }
    [['rep-bar-orgulho', 'pride'], ['rep-bar-evasao', 'external']].forEach(([id, metric]) => {
      const el = document.getElementById(id); if (el) el.style.width = (engine?.metric(metric).value ?? 0) + '%';
    });
  }
  function paintAllCharts(bar, sankey) {
    if (!engine) return;
    const definitions = [
      ['repChartAmostraRegiao', 'region', '#0066FF'],
      ['repChartAmostraIdade', 'age', '#1E293B'],
      ['repChartAmostraRenda', 'income', '#0066FF'],
      ['repChartEvasaoFrequencia', 'external', '#1E293B'],
      ['repChartFrequenciaLazer', 'frequency', '#0066FF'],
      ['repChartIdentificacaoEventos', 'events', '#1E293B'],
      ['repChartLazerRegiao', 'destination', '#0066FF'],
      ['repChartIdentidadeCidade', 'identity', '#0066FF'],
      ['repChartQualidadeVida', 'quality', '#0066FF'],
      ['repChartOQueFalta', 'lacks', '#1E293B'],
      ['repChartOrgulho', 'pride', '#0066FF'],
      ['repChartComparativoCidades', 'comparison', '#1E293B'],
      ['repChartNoticias', 'news', '#0066FF'],
      ['repChartRedeDescoberta', 'network', '#1E293B'],
      ['repChartInfluencia', 'influencer', '#0066FF'],
      ['repChartEscolhaRestaurante', 'choice', '#0066FF'],
      ['repChartBonitoFotos', 'photos', '#1E293B'],
      ['repChartMobilidade', 'transport', '#0066FF'],
      ['repChartMusica', 'music', '#1E293B'],
      ['repChartStreaming', 'streaming', '#0066FF'],
      ['repChartCasaPropria', 'home', '#0066FF'],
      ['repChartTrabalho', 'work', '#1E293B'],
      ['repChartBarreirasNoite', 'barrier', '#1E293B'],
      ['repChartGastariaMais', 'spend', '#0066FF'],
      ['repChartConsumoLocal', 'local', '#1E293B'],
      ['repChartPossePet', 'pet', '#0066FF'],
      ['repChartNotaPet', 'petScore', '#1E293B'],
      ['repChartEspectroPolitico', 'politics', '#1E293B'],
      ['repChartAtencaoPolitica', 'politicsAttention', '#0066FF'],
      ['repChartCrescimentoCidade', 'growth', '#0066FF'],
      ['repChartFuturoCidade', 'future', '#1E293B'],
      ['repChartEstadoCivil', 'marital', '#0066FF'],
      ['repChartEstabilidadeRelacionamento', 'stable', '#0066FF'],
      ['repChartRedesSociaisVida', 'social', '#1E293B']
    ];
    const ageOrder = ['16 a 17 anos', '18 a 24 anos', '25 a 34 anos', '35 a 44 anos', '45 a 54 anos', '55 a 64 anos', '+65 anos'];
    const qualityOrder = ['5', '4', '3', '2', '1'];
    definitions.forEach(([id, field, color]) => {
      try {
        const d = engine.distribution(field);
        charts[id] = d;
        let cats = d.categories;
        if (field === 'age') {
          cats = [...d.categories].sort((a, b) => {
            const ia = ageOrder.indexOf(a.category), ib = ageOrder.indexOf(b.category);
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
          });
        } else if (field === 'income') {
          cats = [...d.categories].sort((a, b) => {
            const ia = M.income.indexOf(a.category), ib = M.income.indexOf(b.category);
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
          });
        } else if (field === 'quality' || field === 'petScore' || field === 'politicsAttention') {
          cats = [...d.categories].sort((a, b) => qualityOrder.indexOf(a.category) - qualityOrder.indexOf(b.category))
            .map(c => ({ ...c, category: `Nota ${c.category} ★` }));
        }
        if (bar) bar(id, cats, color);
      } catch (err) {
        console.warn('Error rendering bar chart ' + id + ':', err);
      }
    });
    try {
      charts.repChartSankeyLazer = engine.flows();
      if (sankey) sankey('repChartSankeyLazer', charts.repChartSankeyLazer);
    } catch (err) {
      console.warn('Error rendering sankey chart:', err);
    }
  }
  async function render({ url, key, records, filters, bar, sankey, clear } = {}) {
    initialize();
    const current = ++revision;
    if (!url || !key) {
      engine = null;
      state = 'PREVIEW';
      clear?.();
      paint();
      return audit();
    }
    try {
      if (!source) source = root.RadarReportSource.create({ url, key });
      const snapshot = records?.length ? { records, metadata: { provider: 'Supabase' } } : await source.load();
      if (current !== revision) return;
      genders = M.create(snapshot.records, snapshot.metadata).distribution('gender').categories.map(c => c.category);
      engine = M.create(snapshot.records, snapshot.metadata, filters ?? filtersFromUI());
      state = 'READY';
      clear?.();
      paint();
      paintAllCharts(bar, sankey);
      return audit();
    } catch (_) {
      if (current !== revision) return;
      engine = null;
      state = 'SOURCE_ERROR';
      clear?.();
      paint();
      return audit();
    }
  }
  function audit() { return { state, ...(engine?.audit() || {}), bindings: bindings.map(b => ({ block: b.block, original: b.original, displayed: b.element.textContent, spec: b.spec, result: engine ? result(b.spec) : null })), charts: state === 'READY' ? charts : {}, unresolved, editorial: B.pending }; }
  root.RadarReportUI = { render, audit };
})(globalThis);
