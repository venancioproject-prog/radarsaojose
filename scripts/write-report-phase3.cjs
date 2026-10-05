const fs = require('node:fs');
const M = require('../report-metrics.js');
const B = require('../report-bindings.js');
const ui = JSON.parse(fs.readFileSync('tmp/report-metrics-phase3-tests/ui.json', 'utf8'));
const lots = JSON.parse(fs.readFileSync('tmp/report-metrics-phase3-tests/lots.json', 'utf8'));
const csv = JSON.parse(fs.readFileSync('tmp/report-metrics-phase3-tests/csv-comparison.json', 'utf8'));
const audit = ui.audits[0];
const escape = value => String(value ?? '—').replaceAll('|', '\\|').replaceAll('\n', ' ');
const table = (headers, rows) => '\n| ' + headers.join(' | ') + ' |\n| ' + headers.map(() => '---').join(' | ') + ' |\n' + rows.map(row => '| ' + row.map(escape).join(' | ') + ' |').join('\n') + '\n';
const labels = { pride: 'Orgulho de morar em SJC', external: 'Saída para outras cidades', spend: 'Intenção declarada de gastar mais', events_no: 'Não identificação com festas/eventos', regular: 'Lazer local ao menos mensalmente', culture_yes: 'Avaliação positiva das opções culturais', price: 'Preço como barreira noturna', no_place: 'Falta de lugar legal como barreira noturna' };
let text = `# Radar São José — relatório técnico da fase 3

Data da conferência: ${lots.source.queriedAt}. Fonte: Supabase, tabela respostas_pesquisa. Consulta somente leitura, paginada e com contagem exata. Total visível à credencial configurada: ${lots.source.received} registros. Nenhuma regra de exclusão foi aplicada. Este relatório e os JSONs de teste são evidências técnicas; a aplicação não os lê como fonte de dados.

## A. Arquivos e ponto de reversão

Alterados: app.html (somente quatro inclusões de scripts) e app.js (somente renderizador e adaptadores de gráficos da apresentação). Criados: report-source.js, report-metrics.js, report-bindings.js, report-metrics-ui.js; scripts/test-report-metrics.cjs, scripts/test-report-phase3.cjs, scripts/test-report-ui.cjs, scripts/test-report-live-browser.cjs, scripts/audit-report-csv.cjs e este gerador scripts/write-report-phase3.cjs. O script scripts/integrate-report-metrics.cjs registra a integração cirúrgica executada uma vez. Entrega: docs/apresentacao/fase3-metricas.md.

Backups anteriores à integração: tmp/report-metrics-phase3-backup/app.js e app.resume.html. O arquivo app.html desse diretório é um backup anterior, conservado separadamente. Entre os backups houve alterações em outras partes do HTML; elas foram preservadas. Para uma reversão futura, retirar apenas as inclusões e restaurar apenas o trecho do renderizador da apresentação, preservando mudanças posteriores. Não restaurar arquivos inteiros indiscriminadamente.

## B. Arquitetura

Supabase → normalização → elegibilidade → filtro único → métricas → interface.

- report-source.js: GET em respostas_pesquisa, ordem id.asc, paginação, count=exact, verificação de IDs e contagem. Cache apenas em memória por 60 segundos; pedidos simultâneos compartilham a leitura. Falha limpa o resultado; nunca usa CSV ou dados demonstrativos. A contagem confirma os registros visíveis à credencial pública, sem certificar acesso administrativo além das políticas vigentes.
- report-metrics.js: mapa explícito de perguntas/campos; espaços e vazios normalizados; alternativas originais preservadas; múltipla escolha com deduplicação por pessoa e reconhecimento de parênteses. Elegibilidade extensível com motivo, regra, IDs e impacto sobre N. Nenhuma exclusão atual. Bases válidas calculadas por pergunta; valores de escala fora de 1–5 são diagnosticados separadamente. “Não sei” e “Prefiro não responder” não são excluídos automaticamente.
- report-bindings.js: regras de indicadores e segmentos, mais pendências editoriais. Os números antigos são localizadores do HTML, nunca resultados calculados. Uma regra de cálculo é expressa por campo, alternativa e filtros.
- report-metrics-ui.js: substitui apenas tokens numéricos e acrescenta metadados técnicos. Cada atualização cria uma coleção oficial filtrada; todos os números migrados e gráficos recebem resultados dessa coleção. Cruzamentos intersectam esse filtro com o segmento do card. Requisições antigas não sobrescrevem filtros mais recentes.
- app.js: adaptadores recebem distribuições prontas; gráfico, rótulo e tooltip compartilham resultado e formatação. Sankey mantém o desenho e usa contagens para a espessura e percentuais prontos no tooltip. Nenhum número de respondentes é acrescentado como resultado principal; contagens pré-existentes ficam em notas técnicas.

Consulta técnica no console da apresentação: RadarReportUI.audit(). Retorna estado, origem, filtros, N global, n filtrado, elegibilidade, resultados por campo, n válido, missing, numerador, valor bruto, valor formatado, vínculos de interface e pendências. Os arquivos de teste não contêm os registros brutos completos nem credenciais.

As referências IBGE/benchmarking e afirmações metodológicas são marcadas com origem distinta e preservadas; não são introduzidas na camada de respostas primárias. Esta fase não revalida fontes externas.

## C. Métricas migradas

São ${audit.bindings.length} vínculos numéricos: ${audit.bindings.filter(b => b.spec).length} calculáveis e ${audit.unresolved.length} pendentes, apresentados como “—” com status NÃO_REPRODUZÍVEL. Percentuais fixos explicativos, como o limite de 100% em múltipla escolha, permanecem como constantes metodológicas. Anexo abaixo lista cada definição calculada e suas posições.

Famílias: orgulho; saída para outras cidades; intenção de gasto; identificação com eventos; frequência; opções culturais; barreiras noturnas; destinos e fluxos entre regiões; identidade da cidade; carências; notícias; redes; indicação de influenciador; critérios de escolha; importância de fotografias; modais; micromobilidade e qualidade de vida; ocupação e renda; música e streaming; média de gêneros selecionados; moradia; estado civil; consumo local; pets; política; responsabilidade pelo crescimento; rumo da cidade; estabilidade financeira e relacionamentos; redes e vida social. Os segmentos originais de gênero, idade, renda, trabalho e região são preservados.

## D. Oito indicadores
`;
text += table(['Métrica', 'N', 'n válido', 'Numerador', 'Supabase', 'Exibido', 'Status'], lots.initial.map(m => [labels[m.metric_id], m.N, m.valid, m.numerator, m.formatted, audit.bindings.find(b => b.spec?.name === m.metric_id)?.displayed || audit.charts.repChartBarreirasNoite.categories.find(c => c.category === m.rule.options[0])?.formatted, 'PASSOU']));
text += `
Os percentuais resultam das respostas, sem ajuste de ticket, arredondamento direcionado ou exclusão para atingir números previamente divulgados.

## E. Correções e definições

- Comparação regional: a pergunta compara as opções daqui com as cidades vizinhas. “São melhores” significa avaliação favorável a SJC; “São piores” é a categoria compatível com o texto antigo sobre opções vizinhas melhores. Base válida 473; 214 respostas “São melhores” = 45,2%; 87 “São piores” = 18,4%; quatro ausentes. Os cards e textos vinculados passam a 18,4%. As frases e interpretações ficam PENDENTE_REESCRITA_EDITORIAL.
- Moradia: base válida total 470. Mulher Cis: 262 respostas válidas; casa própria 113/262 = 43,1%; “Moro de aluguel mas quero uma casa própria” 118/262 = 45,0%. Homem Cis: 202 válidas; casa própria 110/202 = 54,5%. A alternativa de aluguel com desejo de casa não é transformada em intenção genérica de compra.
- Micromobilidade: união de Bicicleta própria, Apps de Bike, Patinete Alugado e Patinete próprio; cada pessoa contada uma vez. 102/477 = 21,4%. Ônibus no grupo: 58/102 = 56,9%. Seleção simultânea não comprova dependência, integração ou mesmo trajeto.
- Qualidade de vida: média das notas válidas de 1 a 5. Micromobilidade = 3,51; usuários de carro próprio = 3,92. Não demonstra efeito causal do modal.
- Aposentados: seleção de Ônibus = 30,4%. O cruzamento usa a categoria ocupacional original, sem fallback.
- Rumo da cidade: distribuição Melhorando / Do mesmo jeito / Piorando por seis regiões; cards Centro, Oeste, Sul e união Leste/Sudeste ligados ao mesmo cálculo. Centro: 39,7% / 35,9% / 24,4%. Leste/Sudeste: 35,1% / 45,8% / 19,1%. A nota de rodapé antiga com outras categorias permanece marcada para revisão.
- Bases válidas adicionais: consumo local 474; posse de pet 475; avaliação pet 469. Soma de alternativas de resposta única ocorre antes de arredondar. Preço + ambiente = 55,3%; centro + não resposta política = 37,5%; reconhecimento das empresas incluindo “Os dois juntos” = 83,2%.
- Carências: há uma combinação “Não falta nada” com outra alternativa. O registro continua elegível e a incompatibilidade é diagnosticada. Ter alguma carência é definido pela seleção de ao menos uma alternativa diferente de “Não falta nada”: 93,9%; não se calcula como complemento arredondado de “Não falta nada”.
- Formatação: percentual com uma casa decimal e vírgula; notas com precisão declarada; funções comuns para moeda e números. Sem resposta válida: “—”, nunca zero automático.

## F. Pendências e memória de R$ 19 milhões

STATUS = NÃO VALIDADO. O componente visual de R$19M permanece. As premissas históricas não alimentam nenhuma métrica validada e não são recalculadas com filtros. Não foi criada nova estimativa nem ajustado gasto para atingir R$19 milhões.
`;
text += table(['Parâmetro', 'Valor histórico', 'Fonte alegada no original', 'Universo', 'Ano', 'Status'], [
 ['Base produtiva', '200 mil', 'CAGED; referência específica ausente', 'Trabalhadores formais', '2024', 'NÃO VALIDADO'],
 ['Evasão', '16%', 'Radar São José', 'Respondentes × trabalhadores: extrapolação não demonstrada', '2026', '“Sim, sempre” é calculável; frequência semanal não medida'],
 ['Renda média', 'R$ 5.732', 'IBGE/Monitor do Mercado; documento/tabela ausente', 'Universo e definição de renda não demonstrados', '2024 alegado', 'NÃO VALIDADO'],
 ['Gasto fora', '10%', 'Premissa denominada conservadora', 'Renda usada como aproximação de gasto', 'Não informado', 'NÃO VALIDADO'],
 ['Periodicidade', 'Mensal', 'Narrativa original', 'Frequência semanal e renda mensal misturadas', 'Não informado', 'NÃO VALIDADO'],
 ['Resultado divulgado', 'R$ 19 milhões/mês', 'Cenário editorial histórico', 'Extrapolação', '2026', 'NÃO VALIDADO']
]);
text += `
Checagem aritmética da fórmula histórica, sem validar as premissas: 200.000 × 0,16 × 5.732 × 0,10 = R$ 18.342.400. Isso não transforma o cenário em uma estimativa aceita. A pesquisa não mede valor gasto fora nem informa destino específico das saídas.

Semáforo preservado: as cores são classificações editoriais estáticas; os controles animam as luzes, sem calcular demanda ou saturação. Não há pesos nem limiares reproduzíveis. A matriz por território também permanece hipótese estratégica.
`;
const sectors = [['Verde', ['Mercado Pet Premium', 'Gastronomia Conceitual', 'Eventos Culturais', 'Conteúdo Digital Local']], ['Amarelo', ['Mercado Imobiliário', 'Educação Executiva', 'Varejo com Curadoria', 'Serviços de Saúde']], ['Vermelho', ['Bares e Restaurantes Genéricos', 'Influenciadores sem Contexto', 'Transporte por App', 'Varejo Saturado']]];
text += table(['Setor', 'Variáveis alegadas', 'Regra', 'Pesos', 'Resultado preservado', 'Fonte', 'Status'], sectors.flatMap(([color, names]) => names.map(name => [name, 'Demanda reprimida e saturação por microrregião', 'Não documentada', 'Não definidos', color, 'Classificação estática do relatório original', 'HIPÓTESE_ESTRATÉGICA / NÃO_REPRODUZÍVEL'])));
text += `
Não reproduzíveis: coortes geracionais sem cortes aprovados; “Local/fiel” por região; “Outros (Média)” no streaming; Disney/Globo agregado sem regra; 18% de influenciadores pagos; redução de lazer de 43,6%; relação 10X de transporte noturno. Não existem indicadores validados de receita, destino São Paulo, causalidade, representatividade, saturação ou decisão de compra familiar. Margem e confiança permanecem afirmações metodológicas não validadas nesta fase.

## G. Narrativas marcadas para reescrita
`;
text += table(['Bloco', 'Texto/tema', 'Métrica', 'Motivo'], B.pending.map(p => [p.block, p.theme, p.metric, `${p.status}: ${p.reason}`]));
text += table(['Bloco', 'Token original', 'Contexto preservado', 'Status'], audit.unresolved.map(p => [p.block, p.original, p.context, p.status]));
text += `
## H. CSV × Supabase

O CSV possui ${csv.csvN} registros; Supabase possui ${csv.supabaseN}. Comparação atual em ${csv.comparedAt}. SHA-256 do CSV: ${csv.csvSHA256}. Apenas auditoria; nenhum arquivo ou registro foi sincronizado.
`;
text += table(['Coluna', 'Status atual', 'Mínimo de respostas diferentes, bruto', 'Após normalizar espaços', 'Válidas CSV / Supabase'], csv.differences.map(c => [c.csvColumn, c.status, c.minimumRawDifferentResponses, c.minimumDifferentResponses, `${c.csvValid} / ${c.supabaseValid}`]));
text += `
Os números são diferenças mínimas entre distribuições marginais, não correspondências por ID. Na reconferência, bairros continuam diferentes após normalização; duas perguntas abertas diferem em espaços/quebras de linha. As divergências anteriormente apontadas em redes e nomes de influenciadores não reaparecem nas distribuições atuais. Igualdade marginal não certifica identidade linha a linha nem explica transformações históricas. Os textos livres não foram corrigidos ou substituídos.

## I. Testes e limites da verificação

Comandos: node scripts/test-report-ui.cjs (executa também lotes A–D); node scripts/test-report-live-browser.cjs; node scripts/audit-report-csv.cjs; node --check app.js; node --check report-metrics-ui.js.

Todos os lotes passaram. O teste de consistência utiliza o HTML real da apresentação e os adaptadores reais de gráficos, com instância Chart capturada para verificar configurações, valores, legendas e tooltips. Um segundo teste de navegador faz a leitura real do Supabase e renderiza com as versões de Chart.js, DataLabels e Sankey já usadas pela aplicação: cinco gráficos, dimensões positivas e nenhum erro de JavaScript. Isso confirma a integração dos plugins; não equivale a uma revisão visual de todos os slides ou a testar os outros módulos da aplicação. As respostas oficiais são usadas apenas em memória pelos testes de interface.
`;
text += table(['Filtro', 'n filtrado', 'Orgulho', 'Saída', 'Gastariam mais', 'Eventos não', 'Lazer regular', 'Cultura sim', 'Preço', 'Falta de lugar'], ui.audits.map(a => [JSON.stringify(a.filters), a.n, ...Object.keys(labels).map(id => a.bindings.find(b => b.spec?.name === id)?.result?.formatted || lots.samples.find(s => JSON.stringify(s.filters) === JSON.stringify(a.filters))?.metrics.find(m => m.metric_id === id)?.formatted || a.charts.repChartBarreirasNoite.categories.find(c => c.category === M.definitions[id].options[0])?.formatted || '—')]));
text += `
Resultados adicionais: leitura paginada e cache; falha da fonte sem fallback; ausência de respostas; base pequena; atualização concorrente com último filtro prevalecendo; integração do seletor de região; mesmos resultados nos textos, tabelas, gráficos, rótulos e tooltips migrados. Recorte ocupacional com n=18, combinação com n=1 e filtro sem casos com n=0 permaneceram seus próprios recortes.

Preservação: HTML idêntico ao backup da retomada após retirar quatro inclusões; JavaScript fora do trecho da apresentação idêntico ao backup; ${ui.preservation.articles} capítulos e ${ui.preservation.media} elementos de mídia preservados. O texto completo do relatório, reconstruído com os tokens numéricos originais, é idêntico ao anterior. Citações e classes dos capítulos também são idênticas. Nenhum redesign, alteração de mídia, Humanizer ou reescrita editorial foi executado.

As evidências detalhadas estão em tmp/report-metrics-phase3-tests/reproduction.json, lots.json, ui.json, live-browser.json e csv-comparison.json. O número de casos aparece neste relatório técnico para auditoria; os resultados principais da apresentação usam percentuais.

## Anexo: todas as definições ligadas à interface
`;
const grouped = new Map();
for (const b of audit.bindings.filter(b => b.result?.field)) {
 const id = b.result.metric_id; if (!grouped.has(id)) grouped.set(id, { result: b.result, blocks: new Set() }); grouped.get(id).blocks.add(b.block);
}
text += table(['ID', 'Pergunta', 'Alternativas / estatística', 'Segmento', 'Blocos', 'n válido', 'Numerador', 'Valor bruto', 'Formatado'], [...grouped].map(([id, v]) => [id, v.result.question, JSON.stringify(v.result.rule.options || v.result.rule.exclude || v.result.rule.type), JSON.stringify(v.result.segment), [...v.blocks].join(', '), v.result.valid, v.result.numerator, v.result.value, v.result.formatted]));
text += '\nFase 3 encerrada na camada técnica. A próxima etapa editorial não foi iniciada.\n';
fs.mkdirSync('docs/apresentacao', { recursive: true });
fs.writeFileSync('docs/apresentacao/fase3-metricas.md', text);
console.log('docs/apresentacao/fase3-metricas.md written.');
