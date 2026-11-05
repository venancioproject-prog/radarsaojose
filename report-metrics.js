/* Quantitative definitions for the presentation only. No persisted results. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RadarReportMetrics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const field = (question, key = question, options = {}) => ({ question, keys: [question, key], ...options });
  const fields = {
    gender: field('Como você se identifica?'),
    age: field('Qual a sua idade?'),
    neighborhood: field('Em qual bairro você mora?'),
    income: field('Qual a renda total da sua casa por mês?'),
    work: field('O seu trabalho hoje é:'),
    quality: field('De 1 a 5, que nota você dá para a qualidade de vida em São José?', 'De 1 a 5, que nota você dá para a qualidade de vida em São J', { scale: true }),
    transport: field('Quais meios de transporte você usa? (marque todos que utilizar)', 'Quais meios de transporte você usa? (marque todos que utilizar', { multiple: true }),
    culture: field('Você acha que a cidade tem boas opções de cultura e eventos?'),
    identity: field('Para você, São José é:'),
    events: field('Você sente que as festas e eventos da cidade combinam com o seu jeito?', 'Você sente que as festas e eventos da cidade combinam com o se'),
    lacks: field('O que você acha que mais falta em São José?', undefined, { multiple: true, exclusive: ['Não falta nada'] }),
    frequency: field('Com que frequência você sai para passear ou se divertir na cidade?', 'Com que frequência você sai para passear ou se divertir na ci'),
    external: field('Você costuma ir para outras cidades para passear ou comer fora?', 'Você costuma ir para outras cidades para passear ou comer fora'),
    destination: field('Qual região da cidade você mais frequenta quando sai de casa?'),
    barrier: field('Qual a maior dificuldade para sair à noite em São José?'),
    choice: field('O que faz você escolher um restaurante ou bar?'),
    photos: field('Você escolhe um lugar só porque ele é bonito para tirar fotos e postar?', 'Você escolhe um lugar só porque ele é bonito para tirar foto'),
    music: field('Quais tipos de música você mais gosta de ouvir?', undefined, { multiple: true }),
    streaming: field('Quais desses serviços de filmes ou música você usa?', undefined, { multiple: true, exclusive: ['Não uso nenhum'] }),
    network: field('Qual rede social você mais usa pra encontrar lugares e referências na cidade', 'Qual rede social você mais usa pra encontrar lugares e referê'),
    influencer: field('Você já foi em algum lugar só porque viu um influenciador da cidade indicando?', 'Você já foi em algum lugar só porque viu um influenciador da'),
    news: field('Por onde você fica sabendo das notícias de São José?', undefined, { multiple: true, exclusive: ['Não acompanho as notícias da cidade'] }),
    politicsAttention: field('De 1 a 5, o quanto você acompanha o que acontece na política da cidade?', 'De 1 a 5, o quanto você acompanha o que acontece na política ', { scale: true }),
    politics: field('Na política, você se sente mais próximo de qual lado?'),
    growth: field('Quem você acha que mais ajuda a cidade a crescer?'),
    future: field('Para você, a cidade de São José está:'),
    spend: field('Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?', 'Se tivesse mais opções de lazer que você gosta, você gastar'),
    pride: field('Você tem orgulho de morar em São José dos Campos?'),
    marital: field('Qual o seu estado civil?'),
    home: field('Você Já tem casa própria?'),
    stable: field('Você acha que precisa estar bem financeiramente antes de começar um relacionamento sério?', 'Você acha que precisa estar bem financeiramente antes de come'),
    social: field('As redes sociais ou aplicativos de namoro mexem com a sua vida social?', 'As redes sociais ou aplicativos de namoro mexem com a sua vida '),
    comparison: field('Comparando com as cidades vizinhas, o que você acha das opções de lazer daqui?', 'Comparando com as cidades vizinhas, o que você acha das opçõ'),
    local: field('Você costuma comprar de produtores locais ou ir em feiras de artesanato da cidade?', 'Você costuma comprar de produtores locais ou ir em feiras de a'),
    pet: field('Você tem animal de estimação?(gato, cachorro e etc)'),
    petScore: field('Você acha que São José é uma cidade boa para quem tem animais de estimação (cachorro, gato e etc)?', 'Você acha que São José é uma cidade boa para quem tem anima', { scale: true }),
    openDefinition: field('Em poucas palavras, como você definiria São José hoje?'),
    influencersOpen: field('Escreva o nome de até 3 influenciadores de São José que você acompanha ou lembra:', 'Escreva o nome de até 3 influenciadores de São José que voc'),
    openExtra: field('Tem algo que queira falar e não abordamos na pesquisa?'),
    region: field('Região')
  };
  const clean = value => value == null ? '' : String(value).trim().replace(/\s+/g, ' ');
  const formatNumberBR = (value, decimals = 1) => Number.isFinite(value) ? value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '—';
  const formatPercentBR = value => Number.isFinite(value) ? formatNumberBR(value) + '%' : '—';
  const formatCurrencyBR = value => Number.isFinite(value) ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) : '—';
  function splitMultiple(value) {
    if (Array.isArray(value)) return [...new Set(value.map(clean).filter(Boolean))];
    const values = []; let depth = 0, buffer = '';
    for (const character of clean(value)) {
      if (character === '(') depth++;
      if (character === ')') depth = Math.max(0, depth - 1);
      if ((character === ',' || character === ';') && depth === 0) { values.push(clean(buffer)); buffer = ''; }
      else buffer += character;
    }
    values.push(clean(buffer));
    return [...new Set(values.filter(Boolean))];
  }
  function normalize(records) {
    return records.map((raw, index) => {
      const values = {}, sourceFields = {};
      for (const [id, definition] of Object.entries(fields)) {
        const key = definition.keys.find(k => Object.hasOwn(raw, k));
        sourceFields[id] = key || null;
        values[id] = definition.multiple ? splitMultiple(raw[key]) : clean(raw[key]);
      }
      return { id: raw.id ?? null, index, values, sourceFields, timestamp: clean(raw['Carimbo de data/hora']) };
    });
  }
  function eligibility(records, rules = []) {
    const excluded = [];
    const eligible = records.filter(row => {
      const failures = rules.filter(rule => {
        if (!rule.id || !rule.reason || typeof rule.accept !== 'function') throw new Error('Eligibility rules require id, reason and accept.');
        return !rule.accept(row);
      });
      if (failures.length) excluded.push({ id: row.id, index: row.index, rules: failures.map(r => ({ id: r.id, reason: r.reason })) });
      return !failures.length;
    });
    const ids = new Map();
    records.forEach(row => ids.set(row.id, (ids.get(row.id) || 0) + 1));
    return { records: eligible, inputN: records.length, N: eligible.length, excluded, rules: rules.map(r => ({ id: r.id, reason: r.reason })), duplicateIds: [...ids].filter(([id, n]) => id != null && n > 1).map(([id, count]) => ({ id, count })), missingIds: records.filter(r => r.id == null).map(r => r.index) };
  }
  function matches(row, filters) {
    return Object.entries(filters).every(([key, expected]) => {
      if (!fields[key]) throw new Error('Unknown filter: ' + key);
      const allowed = Array.isArray(expected) ? expected : [expected];
      const actual = row.values[key];
      return Array.isArray(actual) ? actual.some(value => allowed.includes(value)) : allowed.includes(actual);
    });
  }
  function validBase(records, fieldId, missingCategories = []) {
    const definition = fields[fieldId];
    if (!definition) throw new Error('Unknown question: ' + fieldId);
    const valid = [], missing = [], invalid = [];
    records.forEach(row => {
      const value = row.values[fieldId];
      if ((Array.isArray(value) ? !value.length : value === '') || missingCategories.includes(value)) missing.push(row.id);
      else if (definition.scale && !/^[1-5]$/.test(value)) invalid.push({ id: row.id, value });
      else valid.push(row);
    });
    return { records: valid, n: valid.length, missing: missing.length, missingIds: missing, invalid };
  }
  const regular = ['Toda semana', '2 ou 3 vezes por mês', '1 vez por mês'];
  const external = ['Sim, sempre', 'Às vezes'];
  const micro = ['Bicicleta própria', 'Apps de Bike', 'Patinete Alugado', 'Patinete próprio'];
  const income = ['Até R$ 2.800', 'Entre R$ 2.801 e R$ 5.600', 'Entre R$ 5.601 e R$ 12.000', 'Entre R$ 12.001 e R$ 26.000', 'Mais de R$ 26.000'];
  const definitions = {
    pride: { field: 'pride', options: ['Sim'] },
    external: { field: 'external', options: external },
    spend: { field: 'spend', options: ['Sim'] },
    events_no: { field: 'events', options: ['Não'] },
    regular: { field: 'frequency', options: regular },
    culture_yes: { field: 'culture', options: ['Sim'] },
    price: { field: 'barrier', options: ['É tudo muito caro'] },
    no_place: { field: 'barrier', options: ['Não tem lugar legal para ir'] },
    comparison_better: { field: 'comparison', options: ['São melhores'] },
    comparison_worse: { field: 'comparison', options: ['São piores'] },
    micro: { field: 'transport', options: micro },
    micro_bus: { field: 'transport', options: ['Ônibus'], filters: { transport: micro } },
    micro_quality: { field: 'quality', type: 'mean', filters: { transport: micro } },
    car_quality: { field: 'quality', type: 'mean', filters: { transport: ['Carro próprio'] } },
    retired_bus: { field: 'transport', options: ['Ônibus'], filters: { work: 'Aposentado' } },
    choice_price_ambience: { field: 'choice', options: ['O preço', 'Se o lugar é bonito e agradável'] },
    local_active: { field: 'local', options: ['Sim, sempre', 'Às vezes'] },
    politics_center_noanswer: { field: 'politics', options: ['Centro', 'Prefiro não responder'] },
    growth_company: { field: 'growth', options: ['As empresas e o comércio', 'Os dois juntos'] },
    social_any: { field: 'social', options: ['Um pouco', 'Muito'] },
    lacks_any: { field: 'lacks', exclude: ['Não falta nada'] },
    quality: { field: 'quality', type: 'mean' },
    health_mentions: { field: 'openExtra', type: 'regex', pattern: '\\b(sa[úu]de|atendimento|upa|sus|conv[êe]nio|m[ée]dico|m[ée]dicos|especialista|especialistas|espera|hospital|hospitais|consulta|consultas|exame|exames|posto de sa[úu]de|ubs|plano de sa[úu]de|pronto socorro)\\b' }
  };
  function create(records, metadata = {}, filters = {}, rules = []) {
    const eligible = eligibility(normalize(records), rules);
    const filtered = eligible.records.filter(row => matches(row, filters));
    const cache = new Map(), audit = {};
    const provenance = { source: 'radar_primary', provider: 'Supabase', table: 'respostas_pesquisa', ...metadata };
    function select(segment) { return filtered.filter(row => matches(row, segment || {})); }
    function base(fieldId, segment = {}) {
      const selected = select(segment), valid = validBase(selected, fieldId);
      return { ...provenance, field: fieldId, question: fields[fieldId].question, sourceFields: [...new Set(selected.map(r => r.sourceFields[fieldId]).filter(Boolean))], filters, segment, N: eligible.N, n: selected.length, valid: valid.n, denominator: valid.n, missing: valid.missing, invalid: valid.invalid, smallBase: valid.n > 0 && valid.n < 20, rows: valid.records };
    }
    function distribution(fieldId, segment = {}) {
      const cacheId = JSON.stringify(['distribution', fieldId, segment]);
      if (cache.has(cacheId)) return cache.get(cacheId);
      const { rows, ...meta } = base(fieldId, segment), counts = new Map(), incompatible = [];
      rows.forEach(row => {
        const value = row.values[fieldId], options = Array.isArray(value) ? value : [value];
        options.forEach(option => counts.set(option, (counts.get(option) || 0) + 1));
        if (options.length > 1 && fields[fieldId].exclusive?.some(option => options.includes(option))) incompatible.push({ id: row.id, options });
      });
      const categories = [...counts].map(([category, numerator]) => {
        const value = meta.valid ? numerator / meta.valid * 100 : null;
        return { ...meta, category, numerator, value, formatted: formatPercentBR(value), status: meta.valid ? 'CALCULATED' : 'NO_VALID_RESPONSES' };
      }).sort((a, b) => b.numerator - a.numerator || a.category.localeCompare(b.category, 'pt-BR'));
      const result = { ...meta, multiple: !!fields[fieldId].multiple, categories, incompatible };
      cache.set(cacheId, result); return result;
    }
    function calculate(spec, id = JSON.stringify(spec)) {
      if (audit[id]) return audit[id];
      const fieldId = spec.field, segment = spec.filters || {};
      const { rows, ...meta } = base(fieldId, segment);
      let numerator = null, value = null;
      if (spec.type === 'mean' || spec.type === 'median' || spec.type === 'meanSelections') {
        const scores = rows.map(r => spec.type === 'meanSelections' ? r.values[fieldId].length : Number(r.values[fieldId])).sort((a, b) => a - b);
        if (scores.length) value = spec.type === 'mean' ? scores.reduce((sum, x) => sum + x, 0) / scores.length : (scores[Math.floor((scores.length - 1) / 2)] + scores[Math.floor(scores.length / 2)]) / 2;
      } else if (spec.type === 'regex') {
        const re = new RegExp(spec.pattern, 'i');
        numerator = rows.filter(row => re.test(String(row.values[fieldId] || ''))).length;
        value = meta.valid ? numerator / meta.valid * 100 : null;
      } else {
        if (!fields[fieldId].multiple) {
          numerator = distribution(fieldId, segment).categories.filter(c => spec.exclude ? !spec.exclude.includes(c.category) : spec.options.includes(c.category)).reduce((sum, c) => sum + c.numerator, 0);
        } else numerator = rows.filter(row => row.values[fieldId].some(v => spec.exclude ? !spec.exclude.includes(v) : spec.options.includes(v))).length;
        value = meta.valid ? numerator / meta.valid * 100 : null;
      }
      const isScaleMetric = spec.type === 'mean' || spec.type === 'median' || spec.type === 'meanSelections';
      const metric = { ...meta, metric_id: id, rule: spec, numerator, value, formatted: isScaleMetric ? formatNumberBR(value, spec.decimals ?? 2) : formatPercentBR(value), status: meta.valid ? 'CALCULATED' : 'NO_VALID_RESPONSES' };
      audit[id] = metric; return metric;
    }
    function metric(id) {
      if (!definitions[id]) throw new Error('Unknown metric: ' + id);
      return calculate(definitions[id], id);
    }
    function cross(segmentField, targetField) {
      return distribution(segmentField).categories.map(({ category }) => ({ ...distribution(targetField, { [segmentField]: category }), segment: category, segmentFilters: { [segmentField]: category } }));
    }
    function flows() {
      const usable = filtered.filter(row => row.values.region && row.values.destination), count = new Map();
      usable.forEach(row => { const key = JSON.stringify([row.values.region, row.values.destination]); count.set(key, (count.get(key) || 0) + 1); });
      return [...count].map(([key, numerator]) => { const [from, to] = JSON.parse(key); const value = numerator / usable.length * 100; return { from: 'Origem: ' + from, to: 'Destino: ' + to, flow: numerator, numerator, denominator: usable.length, value, formatted: formatPercentBR(value), N: eligible.N, n: filtered.length, filters, ...provenance }; });
    }
    return { provenance, eligibility: eligible, N: eligible.N, n: filtered.length, filters, distribution, calculate, metric, cross, flows, audit: () => ({ provenance, filters, N: eligible.N, n: filtered.length, eligibility: { inputN: eligible.inputN, N: eligible.N, excludedCount: eligible.excluded.length, rules: eligible.rules, duplicateIds: eligible.duplicateIds, missingIds: eligible.missingIds }, exclusions: eligible.excluded, metrics: { ...audit } }) };
  }
  return { fields, definitions, regular, external, micro, income, clean, splitMultiple, normalize, eligibility, validBase, create, formatPercentBR, formatNumberBR, formatCurrencyBR };
});
