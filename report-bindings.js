/* Bindings use legacy tokens ONLY as DOM locators, never as calculated results. */
(function (root, factory) {
  const api = factory(root.RadarReportMetrics || (typeof require === 'function' ? require('./report-metrics.js') : null));
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RadarReportBindings = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (M) {
  'use strict';
  const pct = (field, options, filters = {}) => ({ field, options: Array.isArray(options) ? options : [options], filters });
  const mean = (field, filters = {}) => ({ field, type: 'mean', filters });
  const destination = 'Centro / Oeste (ex: Aquarius, Vila Adyana)';
  const woman = { gender: 'Mulher Cis' }, man = { gender: 'Homem Cis' };
  const clt = { work: 'Carteira assinada (CLT)' }, owners = { work: 'Dono de empresa' }, retired = { work: 'Aposentado' }, publicWork = { work: 'Funcionário público' };
  const income = M.income, external = M.external;
  const named = name => ({ name });
  const global = { '74.2': named('pride'), '66.2': named('external'), '69.6': named('spend'), '60.0': named('events_no'), '84.7': named('regular'), '50.7': named('culture_yes'), '33.1': named('price'), '23.5': named('no_place') };
  const rules = {
    13: { ...global },
    14: { ...global, '41.7': pct('destination', destination), '28.3': pct('destination', 'Zona Sul'), '70': pct('destination', [destination, 'Zona Sul']), '44.9': named('comparison_worse') },
    15: { ...global, '71.2': pct('external', external, { income: income[0] }), '13.7': pct('external', 'Sim, sempre', { income: income[0] }), '57.5': pct('external', 'Às vezes', { income: income[0] }), '62.1': pct('external', external, { income: income[1] }), '63.9': pct('external', external, { income: income[2] }), '73.1': pct('external', external, { income: income[3] }), '76.2': pct('external', external, { income: income[4] }), '25.4': pct('external', 'Sim, sempre', { income: income[3] }) },
    16: { '56.6': pct('identity', 'Um pouco das duas coisas'), '20.1': pct('identity', 'Uma cidade moderna e cheia de tecnologia'), '14.3': pct('identity', 'Uma cidade tranquila com jeito de interior') },
    17: { '48.4': pct('lacks', 'Melhorar o ônibus e o trânsito'), '44.9': pct('lacks', 'Mais segurança'), '43.4': pct('lacks', 'Mais festas e eventos culturais'), '36.1': pct('lacks', 'Mais opções para sair à noite'), '34.0': pct('lacks', 'Parques e praças mais bem cuidados'), '28.1': pct('lacks', 'Restaurantes e lanchonetes diferentes'), '6.3': pct('lacks', 'Não falta nada'), '93.7': named('lacks_any') },
    19: { '60.4': pct('news', 'Páginas de Instagram (Notícias SJC, Explore SJC, Fica Dica SJC, Prefeitura SJC)'), '57.7': pct('news', 'Portais de Notícias (Meon, Life Informa, Diário de SJC, G1 Vale, 012 News)'), '41.7': pct('news', 'Canais de TV (Vanguarda, Thathi, Canção Nova, etc.)'), '31.7': pct('news', 'Conversando com amigos e família'), '28.7': pct('news', 'Rádios (Band Vale, CBN, Jovem Pan, Nativa, Stereo Vale, etc.)'), '21.2': pct('news', 'Grupos de WhatsApp ou Telegram'), '61.8': pct('network', 'Instagram'), '30.4': pct('influencer', 'Sim') },
    20: { '27.9': pct('choice', 'O preço'), '20.5': pct('choice', 'Indicação de amigos ou família'), '27.5': pct('choice', 'Se o lugar é bonito e agradável'), '5.9': pct('choice', 'Se é perto de casa'), '64.6': pct('photos', 'Não, não ligo para isso'), '8.0': pct('photos', 'Sim, muito'), '8': pct('photos', 'Sim, muito'), '55.4': named('choice_price_ambience'), '37.9': pct('choice', 'Indicação de amigos ou família') },
    21: { '64.6': pct('transport', 'Carro próprio'), '56.8': [pct('transport', 'Apps de transporte (Uber, 99)'), named('micro_bus')], '46.3': pct('transport', 'Ônibus'), '12.8': pct('transport', 'Linha Verde'), '8': pct('transport', ['Bicicleta própria', 'Apps de Bike']), '9': pct('transport', ['Patinete Alugado', 'Patinete próprio']), '66.2': pct('transport', 'Ônibus', { income: income[0] }), '20.8': named('micro'), '41.3': pct('work', 'Carteira assinada (CLT)'), '69.0': pct('spend', 'Sim', clt), '64.0': pct('transport', 'Carro próprio', clt), '60.4': pct('transport', 'Apps de transporte (Uber, 99)', clt), '50.8': pct('transport', 'Ônibus', clt), '3.8': pct('work', 'Dono de empresa'), '83.3': pct('spend', 'Sim', owners), '88.9': pct('transport', 'Carro próprio', owners), '61.1': pct('transport', 'Apps de transporte (Uber, 99)', owners), '0.0': pct('transport', 'Ônibus', owners), '11.7': pct('work', 'Aposentado'), '82.1': pct('spend', 'Sim', retired), '67.9': pct('transport', 'Carro próprio', retired), '44.6': named('retired_bus'), '87.5': pct('home', 'Tenho Casa Própria', retired), '7.5': pct('work', 'Funcionário público'), '38.9': pct('spend', 'Sim', publicWork), '75.0': pct('transport', 'Carro próprio', publicWork) },
    22: { '49.7': pct('music', 'Rock'), '47.4': pct('music', 'Sertanejo'), '44.7': pct('music', 'Pop'), '40.7': pct('music', 'MPB'), '48.6': pct('streaming', 'Spotify'), '22.6': pct('streaming', 'YouTube Music'), '9.6': pct('streaming', 'Deezer'), '71': pct('music', 'Pop', { income: income[4] }), '72': pct('home', 'Tenho Casa Própria', { income: income.slice(3) }), '93.1': pct('home', 'Tenho Casa Própria', { age: '+65 anos' }), '93': pct('home', 'Tenho Casa Própria', { age: '+65 anos' }), '63.9': pct('home', 'Moro de aluguel mas quero uma casa própria', { age: '25 a 34 anos' }), '43.6': pct('home', 'Moro de aluguel mas quero uma casa própria', { income: income.slice(0, 2) }) },
    23: { ...global, '13.2': pct('marital', 'Namorando'), '90.5': pct('frequency', M.regular, { marital: 'Namorando' }), '34.9': pct('barrier', 'Não tem lugar legal para ir', { marital: 'Namorando' }), '19.7': pct('barrier', 'Não tem lugar legal para ir', { marital: 'Solteiro(a)' }), '24.5': pct('marital', 'Solteiro(a)'), '82.9': pct('frequency', M.regular, { marital: 'Solteiro(a)' }), '35.0': pct('barrier', 'É tudo muito caro', { marital: 'Solteiro(a)' }), '50.9': pct('marital', 'Casado(a) ou morando junto'), '85.6': pct('frequency', M.regular, { marital: 'Casado(a) ou morando junto' }), '34.2': pct('barrier', 'É tudo muito caro', { marital: 'Casado(a) ou morando junto' }), '25.1': pct('barrier', 'Não tem lugar legal para ir', { marital: 'Casado(a) ou morando junto' }), '44.9': pct('local', 'Às vezes'), '24.9': pct('local', 'Tenho vontade, mas não vou'), '15.3': pct('local', 'Não tenho interesse'), '14.3': pct('local', 'Sim, sempre'), '59.2': named('local_active'), '22.8': pct('local', 'Sim, sempre', { age: '+65 anos' }), '6': pct('local', 'Sim, sempre', { age: '18 a 24 anos' }), '52.6': pct('pet', 'Sim') },
    24: { '38.6': pct('politics', 'Direita'), '23.9': pct('politics', 'Esquerda'), '21.6': pct('politics', 'Prefiro não responder'), '15.9': pct('politics', 'Centro'), '37.4': named('politics_center_noanswer'), '51.6': pct('growth', 'Os dois juntos'), '31.7': pct('growth', 'As empresas e o comércio'), '6.9': pct('growth', 'A Prefeitura e o Governo'), '9.9': pct('growth', 'Não sei'), '83.3': named('growth_company') },
    26: { '56.2': pct('gender', 'Mulher Cis'), '42.2': pct('home', 'Tenho Casa Própria', woman), '54.6': pct('home', 'Tenho Casa Própria', man), '55.6': pct('home', 'Moro de aluguel mas quero uma casa própria', woman), '53.4': pct('stable', 'Sim', woman), '60.0': pct('stable', 'Sim', man), '67.9': pct('spend', 'Sim', woman), '32.5': pct('politics', 'Direita', woman), '27.2': pct('politics', 'Esquerda', woman), '25.7': pct('politics', 'Prefiro não responder', woman), '14.6': pct('politics', 'Centro', woman), '56.6': pct('stable', 'Sim'), '61.3': pct('stable', 'Sim', { age: ['18 a 24 anos', '25 a 34 anos'] }), '35.8': named('social_any') },
    28: { '16': pct('external', 'Sim, sempre'), '45': named('comparison_worse'), '69': named('spend'), '84': named('regular') },
    29: { '56.6': pct('identity', 'Um pouco das duas coisas'), '61.8': pct('network', 'Instagram') },
    30: { ...global, '44.9': named('comparison_worse'), '61.8': pct('network', 'Instagram'), '69.6': [named('spend'), pct('influencer', 'Não')] },
    45: { ...global, '64.6': pct('photos', 'Não, não ligo para isso'), '34.9': pct('barrier', 'Não tem lugar legal para ir', { marital: 'Namorando' }), '35.0': pct('barrier', 'É tudo muito caro', { marital: 'Solteiro(a)' }) },
    51: { '73': pct('external', external, { income: income[3] }), '76': pct('external', external, { income: income[4] }) },
    52: { '73.1': pct('external', external, { income: income[3] }), '76.2': pct('external', external, { income: income[4] }) }
  };
  // Researcher prose remains unchanged. Tags are technical, not new interpretations.
  const pending = [
    [4, 'Metodologia: margem, confiança, universo e dimensionamento', 'methodology', 'Desenho probabilístico e estimativa financeira aguardam documentação.'],
    [5, 'Amostragem e validação de identidade', 'methodology', 'Recrutamento, IP, cotas e elegibilidade não comprovados nesta camada.'],
    [11, 'Representatividade e perfil socioeconômico', 'methodology', 'Tamanho da base não prova representatividade.'],
    [13, 'Orgulho, motivações e destinos externos', 'external', 'Pergunta não mede motivo, destino específico nem receita.'],
    [14, 'Comparativo e interpretação dos pilares', 'comparison_worse', 'Direção do comparativo corrigida; motivos, seletividade e custo-benefício não medidos.'],
    [15, 'Evasão por renda e dreno financeiro', 'external', 'Percentual de pessoas não equivale a receita; causas e destinos não medidos.'],
    [16, 'Identidade e qualidade de vida', 'quality', 'Percepção não demonstra motivação de consumo ou efeito em vendas.'],
    [17, 'Carências e intenção de consumo', 'lacks_any', 'Múltipla escolha contém combinação incompatível; recomendação não é receita comprovada.'],
    [19, 'Autoridade de creators', 'influencer', 'Visita por indicação não mede credibilidade ou qualidade de conteúdo.'],
    [20, 'Mortalidade empresarial e comportamento de decisão', 'choice_price_ambience', 'Taxa de falência, pagamento a influenciador e recorrência não medidos.'],
    [21, 'Dependência, last mile e desigualdade de mobilidade', 'micro', 'Uso não mede dependência nem mesmo trajeto; 10X e redução de saídas não têm regra definida.'],
    [22, 'Gêneros musicais, streaming e patrimônio', 'streaming', 'Consumo não identifica motivo; interesse em imóvel não comprova demanda financiável.'],
    [23, 'Vida noturna, barreiras e bem-estar pet', 'pet', 'Motivos e efeitos causais não medidos.'],
    [24, 'Política e causas do rumo da cidade', 'future', 'Centro/não resposta não mede aversão a conflito; percepção não identifica causa.'],
    [25, 'Vocação e leitura dos territórios', 'region', 'Local/fiel carece de definição; demais diferenças não comprovam vocação causal.'],
    [26, 'Decisão feminina e efeitos sociais', 'social_any', 'Decisão familiar e efeito negativo de apps não foram perguntados.'],
    [27, 'Gerações', 'generations', 'Faixas atravessam coortes; agrupamento precisa de definição aprovada.'],
    [28, 'Estimativa monetária e saída semanal', 'economic_scenario', 'NÃO VALIDADO: premissas externas e gasto não medidos.'],
    [30, 'Rejeição de influenciadores', 'influencer', 'Não ter ido por indicação não equivale a rejeitar indicação genérica.'],
    [45, 'Gênese dos movimentos', 'cultural_movements', 'Trilha qualitativa e de campo a documentar; nomes preservados.'],
    [51, 'Destino São Paulo', 'external', 'Pergunta mede outras cidades, sem identificar São Paulo.'],
    [52, 'Perfis e consumo da Tribo Global', 'external', 'Destino, motivos e profissões não derivados do cruzamento de renda.'],
    [58, '10% early adopters', 'early_adopters', 'Grupo não dimensionado.'],
    [63, 'Semáforo', 'investment', 'HIPÓTESE_ESTRATÉGICA; sem fórmula de demanda/saturação/pesos.']
  ].map(([block, theme, metric, reason]) => ({ block, theme, metric, reason, status: 'PENDENTE_REESCRITA_EDITORIAL' }));
  return { rules, pending, pct, mean, destination };
});
