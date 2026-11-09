'use strict';

const store = require('./billing-store');
const { getEffectiveEntitlement } = require('./entitlements');

const questions = Object.freeze([
  "Como você se identifica?",
  "Qual a sua idade?",
  "Em qual bairro você mora?",
  "Qual a renda total da sua casa por mês?",
  "O seu trabalho hoje é:",
  "De 1 a 5, que nota você dá para a qualidade de vida em São José?",
  "Quais meios de transporte você usa? (marque todos que utilizar)",
  "Você acha que a cidade tem boas opções de cultura e eventos?",
  "Para você, São José é:",
  "Você sente que as festas e eventos da cidade combinam com o seu jeito?",
  "O que você acha que mais falta em São José?",
  "Com que frequência você sai para passear ou se divertir na cidade?",
  "Você costuma ir para outras cidades para passear ou comer fora?",
  "Qual região da cidade você mais frequenta quando sai de casa?",
  "Qual a maior dificuldade para sair à noite em São José?",
  "O que faz você escolher um restaurante ou bar?",
  "Você escolhe um lugar só porque ele é bonito para tirar fotos e postar?",
  "Quais tipos de música você mais gosta de ouvir?",
  "Quais desses serviços de filmes ou música você usa?",
  "Qual rede social você mais usa pra encontrar lugares e referências na cidade",
  "Você já foi em algum lugar só porque viu um influenciador da cidade indicando?",
  "Por onde você fica sabendo das notícias de São José?",
  "De 1 a 5, o quanto você acompanha o que acontece na política da cidade?",
  "Na política, você se sente mais próximo de qual lado?",
  "Quem você acha que mais ajuda a cidade a crescer?",
  "Para você, a cidade de São José está:",
  "Se tivesse mais opções de lazer que você gosta, você gastaria mais com isso?",
  "Você tem orgulho de morar em São José dos Campos?",
  "Qual o seu estado civil?",
  "Você Já tem casa própria?",
  "Você acha que precisa estar bem financeiramente antes de começar um relacionamento sério?",
  "As redes sociais ou aplicativos de namoro mexem com a sua vida social?",
  "Em poucas palavras, como você definiria São José hoje?",
  "Comparando com as cidades vizinhas, o que você acha das opções de lazer daqui?",
  "Você costuma comprar de produtores locais ou ir em feiras de artesanato da cidade?",
  "Você tem animal de estimação?(gato, cachorro e etc)",
  "Você acha que São José é uma cidade boa para quem tem animais de estimação (cachorro, gato e etc)?",
  "Tem algo que queira falar e não abordamos na pesquisa?",
  "Região"
]);
const filters = Object.freeze({
  gender: questions[0],
  age: questions[1],
  region: 'Região',
  income: questions[3],
  work: questions[4],
  quality: questions[5],
  politics: questions.find(q => q.startsWith('Na política,')),
  pride: questions.find(q => q.startsWith('Você tem orgulho')),
  marital: questions.find(q => q.includes('estado civil')),
  house: questions.find(q => q.includes('casa própria'))
});
const previewQuestions = new Set([
  filters.gender, filters.age, filters.income, filters.work, filters.marital, filters.house,
  filters.quality, 'Para você, São José é:', 'Para você, a cidade de São José está:'
]);
const minimumCount = 10;
const destination = questions.find(q => q.startsWith('Qual região da cidade'));
const neighborhood = questions[2];
const politicalOptions = new Set(['Centro', 'Direita', 'Esquerda', 'Prefiro não responder']);
const themes = /\b(?:saúde|segurança|trânsito|transporte|mobilidade|moradia|emprego|trabalho|educação|escolas|lazer|cultura|esporte|parques|natureza|tecnologia|indústria|desigualdade|crescimento|infraestrutura|saneamento|acessibilidade|tranquilidade)\b/giu;

async function surveyPlan(req) {
  if (!req.headers?.authorization) return 'gratis';
  const user = await store.authenticate(req);
  if (user.app_metadata?.role === 'admin' || user.app_metadata?.is_admin === true) return 'admin';
  return (await getEffectiveEntitlement(user.id)).planType;
}

async function readSurveyRows(full = true) {
  if (process.env.VERCEL_ENV === 'preview') return demoSurveyRows();
  const rows = [];
  const pageSize = 500;
  const selectedQuestions = full ? questions : [...previewQuestions];
  const columns = ['id', ...selectedQuestions.map((q, i) => 'q' + i + ':"' + q + '"')].join(',');
  const path = 'respostas_pesquisa?select=' + encodeURIComponent(columns) + '&order=id.asc';
  for (let offset = 0; ; offset += pageSize) {
    const page = await store.db(path + '&limit=' + pageSize + '&offset=' + offset);
    if (!Array.isArray(page)) throw new Error('Invalid survey response');
    rows.push(...page.map(row => ({
      id: row.id,
      ...Object.fromEntries(selectedQuestions.map((q, i) => [q, row['q' + i]]))
    })));
    if (page.length < pageSize) return rows;
  }
}

function answer(row, field) {
  const value = String(row[field] ?? '').trim();
  return value.length <= 350 && !/[<>]/.test(value) ? value : '';
}

function filterValue(row, field) {
  const value = answer(row, filters[field]);
  if (field === 'politics') return politicalOptions.has(value) ? value : '';
  if (field === 'gender') {
    if (/^(homem|masculino|cisgênero masculino|homem cis)$/i.test(value)) return 'Homem';
    if (/^(mulher|feminino|cisgênero feminino|mulher cis)$/i.test(value)) return 'Mulher';
    return 'Outros';
  }
  if (field === 'quality') {
    const score = value.match(/\b[1-5]\b/)?.[0];
    return score ? 'Nota ' + score : '';
  }
  return field === 'region' ? value || answer(row, neighborhood) : value;
}

const multipleChoiceQuestion = /transporte|música|musica|serviços|servicos|streaming|mais falta|o que falta|notícias|noticias|sabendo das/i;

function isSafeCount(count, total) {
  return count >= minimumCount && (count === total || total - count >= minimumCount);
}

function isSafeFilterSubset(rows, selected, matchField) {
  const entries = Object.entries(selected || {});
  if (entries.length === 0) {
    return rows.length >= minimumCount ? rows : [];
  }
  if (entries.length > 4) {
    return [];
  }
  const matchesFor = subsetEntries => rows.filter(row =>
    subsetEntries.every(([field, value]) => matchField(row, field, value))
  );
  const matches = matchesFor(entries);
  const n = matches.length;
  if (n < minimumCount || rows.length - n < minimumCount) {
    return [];
  }
  const subsetCount = 1 << entries.length;
  for (let mask = 0; mask < subsetCount - 1; mask++) {
    const subset = entries.filter((_, idx) => (mask & (1 << idx)) !== 0);
    const parentMatches = subset.length === 0 ? rows : matchesFor(subset);
    if (parentMatches.length - n < minimumCount) {
      return [];
    }
  }
  return matches;
}

function buckets(rows, key) {
  const counts = new Map();
  for (const row of rows) {
    const raw = key(row);
    const labels = Array.isArray(raw) ? raw : [raw];
    for (const label of new Set(labels)) {
      if (label) counts.set(label, (counts.get(label) || 0) + 1);
    }
  }
  return Array.from(counts, ([label, count]) => ({ label, count }))
    .filter(bucket => isSafeCount(bucket.count, rows.length));
}

function wordCloud(rows, question) {
  const counts = new Map();
  for (const row of rows) {
    for (const word of new Set(answer(row, question).toLowerCase().match(themes) || [])) {
      counts.set(word, (counts.get(word) || 0) + 1);
    }
  }
  return Array.from(counts, ([label, count]) => ({ label, count }))
    .filter(item => isSafeCount(item.count, rows.length));
}

function surveyPreview(rows, selected, full) {
  const visible = isSafeFilterSubset(rows, selected, (row, field, value) => filterValue(row, field) === value);
  const safe = visible.length >= minimumCount;
  const n = visible.length;
  const chartQuestions = questions.filter(q => q !== 'Região');
  const enabled = full ? chartQuestions : [...previewQuestions];
  const isOpenQuestion = q => /poucas palavras|tem algo que queira falar/i.test(q);
  const chartAnswer = (row, q) => {
    if (q === filters.gender) return filterValue(row, 'gender');
    if (q === filters.politics) return filterValue(row, 'politics');
    const raw = answer(row, q);
    if (!raw) return '';
    if (multipleChoiceQuestion.test(q)) {
      return raw
        .replace(/\s*\([^)]*\)/g, '')
        .replace(/[()]/g, '')
        .split(',')
        .map(part => part.trim())
        .filter(part => part && !/^(R\$|\d+,\d+)$/.test(part));
    }
    return raw.replace(/\s*\([^)]*\)/g, '').replace(/[()]/g, '').trim();
  };
  const charts = Object.fromEntries(enabled.map(q => [q, isOpenQuestion(q)
    ? wordCloud(visible, q)
    : buckets(visible, row => chartAnswer(row, q))]));
  const reference = Object.fromEntries(enabled.filter(q => !isOpenQuestion(q)).map(q => [q, buckets(rows, row => chartAnswer(row, q))]));
  const options = Object.fromEntries(Object.keys(filters).map(field => [field, buckets(rows, row => filterValue(row, field)).map(bucket => bucket.label)]));
  if (!full) {
    return {
      full, total: rows.length, count: safe ? n : 0, questions: enabled, charts,
      options: { age: options.age }
    };
  }
  const flowPairs = buckets(visible, row => {
    const from = filterValue(row, 'region');
    const to = answer(row, destination);
    return from && to ? JSON.stringify([from, to]) : '';
  });
  const scores = visible.map(row => Number(answer(row, filters.quality))).filter(score => score >= 1 && score <= 5);
  const prideCount = visible.filter(row => /sim|muito/i.test(answer(row, filters.pride))).length;
  const safeQuality = isSafeCount(scores.length, visible.length);
  const safePride = visible.length >= minimumCount && isSafeCount(prideCount, visible.length);
  const kpis = {
    quality: safeQuality ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1) : '0.0',
    pride: safePride ? Math.round(100 * prideCount / visible.length) : 0,
    neighborhoods: buckets(visible, row => answer(row, neighborhood)).length
  };
  return { full, total: rows.length, count: safe ? n : 0, questions: chartQuestions, charts, reference, options, flowPairs, kpis };
}

function demoSurveyRows() {
  const options = [
    ['Homem', 'Mulher'], ['18 a 24 anos', '25 a 34 anos', '35 a 44 anos', '45 a 54 anos'],
    ['Centro', 'Santana', 'Jardim Satélite', 'Urbanova'], ['Até R$ 3.000', 'R$ 3.001 a R$ 6.000', 'Acima de R$ 6.000'],
    ['Presencial', 'Híbrido', 'Remoto'], ['2', '3', '4', '5'],
    ['Carro', 'Ônibus', 'A pé', 'Bicicleta'], ['Sim', 'Não', 'Em parte'],
    ['Boa para morar', 'Boa para trabalhar', 'Boa para estudar'], ['Sim', 'Não', 'Às vezes'],
    ['Parques', 'Cultura', 'Transporte'], ['Toda semana', 'Uma vez por mês', 'Raramente'],
    ['Sim, sempre', 'Às vezes', 'Não'], ['Centro', 'Sul', 'Norte', 'Oeste'],
    ['Transporte', 'Preço', 'Horário'], ['Preço', 'Qualidade', 'Localização'],
    ['Sim', 'Não', 'Às vezes'], ['MPB', 'Rock', 'Sertanejo', 'Pop'],
    ['Netflix', 'Spotify', 'YouTube'], ['Instagram', 'TikTok', 'YouTube'],
    ['Sim', 'Não'], ['Redes sociais', 'Jornais locais', 'Rádio'],
    ['1', '2', '3', '4', '5'], ['Centro', 'Direita', 'Esquerda', 'Prefiro não responder'],
    ['Empresas', 'Universidades', 'Moradores'], ['Crescendo', 'Estável', 'Perdendo oportunidades'],
    ['Sim', 'Não', 'Talvez'], ['Sim', 'Não', 'Em parte'], ['Solteiro(a)', 'Casado(a)'],
    ['Sim', 'Não'], ['Sim', 'Não', 'Depende'], ['Sim', 'Não', 'Às vezes'],
    ['Cidade em crescimento', 'Cidade tranquila', 'Cidade tecnológica'],
    ['Melhores', 'Parecidas', 'Piores'], ['Sim', 'Não', 'Às vezes'],
    ['Sim', 'Não'], ['Sim', 'Não', 'Em parte'],
    ['Mais parques e cultura', 'Melhor mobilidade'], ['Centro', 'Sul', 'Norte', 'Oeste']
  ];
  return Array.from({ length: 96 }, (_, index) => Object.fromEntries(questions.map((question, column) => {
    const values = options[column];
    return [question, values[(index + Math.floor(index / (column % 5 + 2)) + column) % values.length]];
  })));
}

module.exports = { filters, minimumCount, isSafeCount, isSafeFilterSubset, readSurveyRows, surveyPlan, surveyPreview, demoSurveyRows };
