"""Relatório A–K gerado dos registros de auditoria P1, sem homologação."""
import json,hashlib,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=ROOT/'docs/dados-publicos-revisao/p1-economia'
def read(p):return json.loads(p.read_text(encoding='utf8'))
store=read(BASE/'economia_evidence_2026-10-04.json');final=read(OUT/'matriz-economia-final.json');emap={e['evidence_id']:e for e in store['evidences']};snap=read(OUT/'snapshot-inicial.json');pkg=read(BASE/'radar_hub_package.json')
def cell(v):return ('indisponível (null)' if v is None else str(v)).replace('|','\\|').replace('\n',' ')
def table(headers,rows):return '| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(cell(v) for v in row)+' |' for row in rows)+'\n'
texts={}
for name,args in [('git-final-status.txt',['status','--short']),('git-final-stat.txt',['diff','--stat']),('git-final-app-js.diff',['diff','--','app.js'])]:
    r=subprocess.run(['git',*args],cwd=ROOT,capture_output=True);texts[name]=r.stdout.decode('utf8',errors='replace');(OUT/name).write_text(texts[name],encoding='utf8')
assert hashlib.sha256((ROOT/'app.js').read_bytes()).hexdigest()==snap['app_js_sha256']
prior=[]
for a in store['indicators']:
    i=a['previous'];p0=next(r for r in snap['p0_rows'] if r['id']==a['id']);prior.append([a['id'],i['name'],i['base_year'],i['value'],p0.get('valor_ground_truth'),i['audit_status'],i['official_url'],'SIM; trecho antigo sem prova atual',p0.get('divergencia')])
newtable=[]
for a in final:
    e=emap[a['evidence_id']];newtable.append([a['id'],a['previous']['value'] if a['previous'] else 'novo',a['value'],a['period'],a['unit'],e['source'],f"[Arquivo aberto]({e['url']})",a['evidence_id'],a['decision']+' / '+a['status']])
sources=[]
for name in ['ibge-5938-metadata.json','ibge-5938-periodos.json','ibge-pib-sjc.json','ibge-base2002-2009.zip','ibge-base2010-2023.zip','ibge-cempre-9510-metadata.json','ibge-cempre-sjc.json','ibge-salary.json','mte-dez2024-current.html','mte-dez2024.xlsx','mte-ago2026.html','mte-ago2026.xlsx','rfb-layout.pdf','mdic-dados.html','mte-methodology.pdf','ibge-cempre-methodology.pdf','ibge-pib-methodology.pdf','mte-rais-current.html']:
    a=next(x for x in reversed(store['source_accesses']) if x['name']==name and x.get('status_code')==200);sources.append([name,f"[URL efetivamente aberta]({a['url']})",a['accessed_at'],a['sha256']])
availability=read(OUT/'disponibilidade-investigada.json')
report='''# P1 — Economia: auditoria externa e reconciliação

Entrega para revisão humana. **Economia não está homologada.** A auditoria global continua não carregada; esta rodada possui evidência restrita a Economia. Consultas iniciadas em 04/10/2026, com horários reais preservados no manifesto. Sem deploy e sem continuação para outros eixos.

## A. Inventário anterior

Os 11 IDs anteriores foram preservados e investigados individualmente. `snapshot-inicial.json` registra valores, eixos protegidos e hash de `app.js`; `inventario-anterior.json` preserva as linhas da matriz P0. Confirmações anteriores não foram usadas como prova.

'''+table(['ID','Indicador','Período','Registry','Ground truth vinculado','Status anterior','Fonte cadastrada','Evidência antiga','Divergência P0'],prior)+'''
## B. Evidências externas

O evidence store contém '''+str(len(store['evidences']))+''' registros numéricos/ausências, ligados a município, período, unidade, variável, fonte, consulta, registro bruto, transformação e valor exibido. Hashes SHA-256 ligam cada evidência aos arquivos preservados. Abertura de página, snippet e concordância local não foram usados para validar valores.

'''+table(['Arquivo','URL aberta','Consulta (fuso explícito)','SHA-256'],sources)+'''
Reprodução da extração: `python scripts/build_economia_audit.py`. Não exige rede: lê os arquivos oficiais preservados. O coletor `scripts/economia_sources.py` registra novas consultas e erros; uma coleta futura pode retornar dados revisados, exigindo nova rodada. `scripts/apply_economia_audit.py` aplica exclusivamente Economia e gera matriz, consistência e bindings; `python scripts/build_radar_hub_package.py` gera pacote e fallback atômicos.

PIB: leiaute oficial dos ZIPs usa município na posição 47–53; filtro **exato 3549904**, não busca textual do nome/código regional. PIB na posição 935 (18 caracteres), per capita na 954; componentes na 821/840/859/878/897/916. Unidade PIB/componentes: R$ mil, três casas publicadas; per capita: reais, duas casas. SIDRA 5938 variável 37 representa PIB total; **513 é agropecuária, não per capita**. Os metadados territoriais, variáveis e períodos foram conferidos. API fornece PIB em mil reais inteiros; TXT preserva a precisão publicada. Per capita foi extraído diretamente da coluna oficial, sem dividir pelo Censo local para inventar valor.

CEMPRE: agregado 9510; território N6[3549904]; CNAE classificação 12762, categoria 117897 Total. Variáveis 1606 (salários mínimos), 10143 (reais), 706 (unidades locais) e 367 (empresas e outras organizações atuantes). Tabela não foi confundida com Receita/CNPJ ou salário de admissão do CAGED.

CAGED: cadeia de publicação começa nas páginas oficiais do MTE; elas remetem às pastas públicas do Drive, cujo conteúdo bruto foi preservado. Tabela 8.1, município **354990, SP, Sp-Sao Jose dos Campos**, linha 3831. É o código MTE de seis dígitos, conferido por nome/UF com o código IBGE 3549904. Cada célula de estoque/admissões/desligamentos/saldo e seu cabeçalho são guardados. Nenhum estoque foi reconstruído acumulando saldo.

## C. RESOLUÇÃO DAS DIVERGÊNCIAS CRÍTICAS

- **PIB 2021 — 45.210,4 × 45.208,8:** TXT oficial retorna **45.208.807,937 R$ mil**, equivalente a **45.208,807937 R$ milhões**. Portanto, 45.208,8 é compatível com apresentação a uma casa; 45.210,4 não é. A API retorna 45.208.808 R$ mil por sua precisão inteira. A pequena diferença API/TXT é arredondamento, não outra escolha de PIB.
- **PIB 2022 — 47.820,8 × 56.653,3:** TXT retorna **56.653.326,722 R$ mil**, ou **56.653,326722 R$ milhões**. API: 56.653.327 R$ mil. 56.653,3 é compatível com arredondamento a uma casa. Não foi encontrada publicação que justificasse 47.820,8; não o atribuimos a outro ano/revisão por suposição.
- **Per capita 2022 — 68.580 × 81.200:** ambos diferem da coluna publicada, **R$ 81.231,79**. O registro antigo de 68.580 mencionava divisão de um PIB total errado; a origem documental exata desse cálculo não foi demonstrada. 81.200 também não foi localizado como valor publicado. Não se fabricou explicação de arredondamento ou revisão.
- **Per capita 2023:** **R$ 88.077,14** confirmado diretamente na coluna oficial. A evidência antiga consultava variável de PIB total e fazia uma divisão; ela foi substituída por evidência da variável/coluna correta.
- **Participações 54%/38%:** corrigidas para **43,0402761495% serviços (exceto administração pública) / PIB** e **36,4070003680% indústria / PIB**, 2021. São indicadores **CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS**, não percentuais diretamente publicados. Fórmula `100 × VAB da atividade / PIB`; numerador e denominador documentados. Não são percentuais do VAB. Administração, impostos líquidos e agropecuária permanecem separados; não foi criada a categoria híbrida “administração e impostos”.
- **Salário 3,4 em 2022:** a API antiga de Cidades efetivamente retorna 3,4 **para 2021**, sem observação 2022 nesse endpoint. SIDRA 9510 retorna **3,3 em 2022**. Período e origem foram corrigidos; 2021 não foi usado para preencher 2022.

### Emprego: o que representam os quatro números antigos?

'''+table(['Valor antigo','Significado alegado no cadastro','Resultado documental'],[[x['value'],x['previous_meaning'],'ORIGEM_NAO_COMPROVADA; não localizado nos estoques extraídos das duas edições'] for x in store['unresolved_legacy_stocks']])+'''
**Não foi possível comprovar o que cada um realmente representa.** Não foi atribuído saldo, estoque, competência, universo RAIS ou revisão a nenhum deles sem documento. Seus significados acima são alegações dos arquivos anteriores, não conclusões oficiais. Essa pendência permanece explícita.

As duas edições oficiais permitem demonstrar uma revisão efetiva, sem inferir que ela explica os quatro números:

| Competência / grandeza | Edição dezembro/2024 | Edição agosto/2026 | Decisão |
|---|---:|---:|---|
| Estoque dezembro/2023 (IE3831) | 197.694 | 196.405 | Usar edição agosto/2026; antiga preservada |
| Estoque dezembro/2024 (KM3831) | 206.345 | 205.024 | Usar edição agosto/2026; antiga preservada |
| Saldo anual 2024 | 8.651 publicado em KT3831 | 8.619, soma dos 12 saldos revisados | Identificar cálculo derivado na edição atual |
| Estoque agosto/2026 (OI3831) | Não existia nessa edição | 215.122 | Competência atual comprovada; 2026 parcial |
| Saldo janeiro–agosto/2026 (OP3831) | Não existia nessa edição | 3.792, publicado | Parcial, não ano completo |

As notas da Tabela 8.1 distinguem resultados com ajustes e estoques de referência; dezembro/2023 aparece como estoque de referência de 2024. A nota técnica do Novo CAGED documenta declarações fora do prazo e revisões retrospectivas. A diferença observada entre edições está comprovada; **não foi demonstrada a decomposição causal específica da revisão de São José dos Campos**. O retrato agosto/2026 substitui integralmente a edição anterior na série ativa; não se misturaram edições para formar a curva.

## D. Valores corrigidos — ANTES → DEPOIS → POR QUÊ

Tabela completa, incluindo os quatro novos IDs. Cada decisão aponta para a extração externa correspondente; `matriz-economia.csv` contém os 11 anteriores e `matriz-economia-final.json` inclui os novos.

'''+table(['ID','Antes','Depois','Período','Unidade','Fonte oficial','URL aberta','Evidência','Decisão'],newtable)+'''
Além dos escalares, todas as observações das antigas séries de PIB/per capita e CAGED foram substituídas por extração bruta, não por ajustes pontuais de concordância. Salários anteriormente colocados sob Novo CAGED foram retirados desse objeto (null); remuneração CEMPRE mantém identificação própria. Rankings estadual/nacional, comparações nacionais, distribuições empresariais e empregos por setor sem prova foram suspensos. Histórico anterior completo está no snapshot.

## E. Séries históricas e comparabilidade

| Série | Início–fim | Observações | Lacunas / limites |
|---|---|---:|---|
| PIB nominal e per capita | 2002–2023 | 22 anos, cada métrica | Sem lacunas nessas métricas; 2022/2023 sujeitos a revisão |
| Componentes PIB/VAB e impostos | 2002–2021 | 20 anos × 6 campos | 2022/2023 ausentes, explicitamente null |
| Novo CAGED, estoque/admissões/desligamentos/saldo | 2020-01–2026-08 | 80 meses × 4 campos | Sem lacunas até agosto; setembro–dezembro/2026 não preenchidos |
| Saldo anual Novo CAGED | 2020–2026 | 6 anos completos + 1 parcial | 2020–2025 calculados dos 12 meses; 2026 publicado parcial |
| Novo CAGED, edição antiga preservada | 2020-01–2024-12 | 60 meses × 4 campos | Evidência comparativa, não série ativa |
| CEMPRE salário em SM/reais, unidades locais/organizações | 2022–2024 | 3 anos × 4 variáveis | Separada da antiga API 2006–2021 |

**PIB nominal não é crescimento real.** Não foi aplicado deflator, projetado PIB ou calculado crescimento real. No per capita, o leiaute informa estimativas municipais até 2021, primeira apuração do Censo em 2022 e população enviada ao TCU/ajustes territoriais em 2023. A mudança do denominador pode afetar a comparação; não significa que todo salto seja crescimento econômico real.

**RAIS × CAGED:** RAIS é anual e abrange tipos de vínculos além dos celetistas; CAGED acompanha movimentações celetistas mensais. Novo CAGED, desde janeiro/2020, integra eSocial/CAGED/Empregador Web, com revisão da captação em 2021. A série ativa começa em 2020 e não foi concatenada à RAIS ou ao CAGED antigo. O CEMPRE tem quebra metodológica em 2022, documentada na nota técnica 01/2024. Essas diferenças aparecem nas limitações do pacote e nas notas da interface.

## F. Novos indicadores

'''+table(['ID novo','Valor','Período','Definição'],[[a['id'],a['value'],a['period'],emap[a['evidence_id']]['variable']] for a in final if a['decision']=='ADICIONADO'])+'''
As séries também acrescentam estoque mensal, admissões, desligamentos, componentes oficiais de PIB, remuneração CEMPRE em reais e seus históricos. CEMPRE não foi usado para “confirmar” o número de CNPJs ativos da Receita.

## G. DADOS ECONÔMICOS PESQUISADOS MAS NÃO COMPROVADOS

'''+table(['Item investigado','Disponibilidade','Fonte','Limitação / decisão'],[[r['indicador'],r['disponibilidade'],r['fonte'],r['limitação']] for r in availability])+'''
Foram preservados erros HTTP 403/404 e falhas TLS no manifesto. O leiaute da Receita foi aberto: ME/EPP/DEMAIS são portes; MEI exige opção SIMEI; estabelecimentos e empresa básica exigem cruzamento. Sem processamento completo da competência 2024, nenhuma contagem voltou ao painel. “DEMAIS” não fundamenta a categoria médias/grandes. Disponibilidade de arquivo oficial de comércio exterior não equivale a validação de seu conteúdo; nenhum valor de comércio exterior foi adicionado.

## H. Interface

- Cards econômicos ligados aos registros e bindings; CNPJs mostram “Dado não disponível”. Último estoque comprovado mostra **2026-08**, edição, ajustes e parcialidade.
- PIB/per capita 2002–2023; removidos fallbacks numéricos e consultas independentes em tempo de exibição nos gráficos econômicos da visão geral.
- CAGED com ano gerado dos meses reais (2020–2026 parcial), seleção de saldo/estoque/admissões/desligamentos; anual 2020–2025 e 2026 parcial. Métrica/ano desativados quando o modo anual determina o recorte.
- Cinco componentes do PIB separados; participações derivadas identificadas. Sem abertura setorial 2022/2023 e sem ligar ausência a zero.
- Fichas com fonte, unidade, competência, status desta rodada e limitação. Resumo P1 separado da auditoria global ausente; não declara homologação.
- Comparações econômicas entre municípios suspensas, pois os municípios comparadores não foram auditados nesta rodada. Outros cards do benchmark preservados.
- Exportação do registry tem 89 IDs, dos quais 15 econômicos, com competência, status, fonte e evidência. Séries completas e suas evidências ficam no pacote/evidence store.

Sem redesign. Captura `economia-desktop.png` e resultados `teste-navegador.json` documentam o teste local. A visualização do dashboard no teste foi feita por harness DOM local, sem login externo nem alteração do mecanismo de autenticação.

## I. Testes

| Comando | Resultado / escopo |
|---|---|
| `node --check radar_hub_controller.js` | PASS, sintaxe |
| `python scripts/test_economia_audit.py` | PASS, fontes brutas/células/fórmulas/unidades/IDs/hashes; 22 anos/80 meses; null; pacote igual fallback; app.js e 39 renderizadores protegidos |
| `node scripts/test_economia_runtime.cjs` | PASS online, offline e falha null/zero; cards, filtros reais, anual/parcial, estoque, ficha e exportação |
| `node scripts/test_radar_hub_p0.cjs` | PASS, oito cenários: concorrência, offline, 404, JSON inválido, pacote misturado/antigo, ausência/zero e rejeição de estoque alegado sem binding atual |
| `node scripts/test_saude_runtime.cjs` | PASS, regressão de preservação online/offline; não foi auditoria externa de Saúde |
| `python scripts/test_radar_hub_p0_auditor.py` | PASS, sem rede/escrita; auditor histórico não promove consistência local a confirmação |
| `python scripts/test_economia_browser.py` | PASS, Chrome real, 375/390/414/1366px sem overflow; dados, filtros e indisponibilidade |

Testes verificam implementação e reprodução; **não são a prova oficial dos números**. Essa prova está nos arquivos consultados. Verificação de escopo compara dados e funções aos snapshots anteriores, não ao HEAD com alterações preexistentes.

## J. Git e preservação

Resultados completos: `git-final-status.txt`, `git-final-stat.txt`, `git-final-app-js.diff`. O workspace já tinha numerosas alterações e exclusões antes desta tarefa; elas não foram revertidas nem atribuídas a P1. `git diff -- app.js` continua contendo alterações anteriores, mas **o SHA-256 de app.js permaneceu exatamente igual ao snapshot inicial**.

Arquivos de implementação alterados por P1: `app.html`, `radar_hub_controller.js`, `data/radar_hub/sjc_metadata_registry.json`, `data/radar_hub/sjc_open_data_ground_truth.json`, `data/radar_hub/radar_hub_consistency.json`, `data/radar_hub/radar_hub_package.json`, `scripts/build_radar_hub_package.py`, `scripts/test_radar_hub_p0.cjs`, `scripts/test_radar_hub_p0_auditor.py`.

Arquivos novos de código: `scripts/economia_sources.py`, `scripts/build_economia_audit.py`, `scripts/apply_economia_audit.py`, `scripts/update_economia_ui.py` (migração inicial, protegida contra reaplicação), `scripts/report_economia_audit.py`, `scripts/test_economia_audit.py`, `scripts/test_economia_runtime.cjs`, `scripts/test_economia_browser.py`.

Artefatos novos: `data/radar_hub/economia_evidence_2026-10-04.json`, `economia_audit_bindings.json`, arquivos brutos e manifesto em `economia_raw_2026-10-04/`; snapshots, matrizes, disponibilidade, exportações, captura, testes e relatório em `docs/dados-publicos-revisao/p1-economia/`. A listagem exaustiva está em `arquivos-p1.txt`.

**Demografia, Segurança, Saúde, Meio Ambiente, Educação, Mobilidade e Finanças: valores preservados integralmente. app.js: não alterado por P1.** Não houve deploy ou commit nesta rodada.

## K. Declaração final

| Pergunta | Resposta |
|---|---|
| Todos os indicadores econômicos existentes foram auditados individualmente? | **SIM**, todos os 11 investigados; isso não significa que os 11 tenham sido validados |
| Todos os valores marcados como validados possuem evidência externa aberta nesta rodada? | **SIM**, inclusive os componentes dos derivados |
| Algum valor foi estimado ou interpolado? | **NÃO** |
| Alguma ausência foi transformada em zero? | **NÃO** |
| Algum valor do ground truth foi usado como prova de si mesmo? | **NÃO** |
| Alguma divergência permanece? | **SIM**, origem dos quatro estoques legados não comprovada; empresas/MEI/portes não comprovados. Valores ativos validados não divergem de suas evidências |
| Existem séries com quebra metodológica? | **SIM**: RAIS/CAGED antigo/Novo CAGED; CEMPRE em 2022; mudança do denominador per capita em 2022/2023 e ausência de abertura setorial. Não foi feita concatenação artificial |
| Existem indicadores novos? | **SIM**, PIB 2023, unidades locais CEMPRE 2024, organizações CEMPRE 2024, estoque agosto/2026; históricos/variáveis documentados acima |
| Algum outro eixo teve seus valores alterados? | **NÃO** |
| app.js foi alterado nesta tarefa? | **NÃO**, hash preservado |

**Parada: Economia entregue para revisão humana; não homologada. Nenhuma continuação automática para outro eixo.**
'''
(OUT/'relatorio-final.md').write_text(report,encoding='utf8')
(OUT/'prompt-revisao-outra-ia.md').write_text('''# Revisão humana assistida — P1 Economia

Revise somente Economia do Radar Hub. Comece pelo relatório A–K em docs/dados-publicos-revisao/p1-economia/relatorio-final.md, depois examine data/radar_hub/economia_evidence_2026-10-04.json, seu manifesto e os arquivos brutos. Não trate testes ou concordância registry/GT como confirmação oficial.

Reproduza as células da Tabela 8.1 do MTE nas duas edições (dezembro/2024 e agosto/2026), conferindo município 354990, SP-São José dos Campos, competências, revisões e parcialidade de 2026. Confira PIB/per capita nas posições do leiaute IBGE, filtro municipal exato 3549904, unidades, precisão e mudança do denominador populacional. Confira SIDRA 9510, CNAE Total e quebra CEMPRE em 2022. Verifique componentes e fórmulas de cada percentual e saldo anual derivado.

Os quatro estoques antigos têm ORIGEM_NAO_COMPROVADA. Não atribua competências/revisões/universos sem documento. CNPJ/MEI/ME/EPP estão suspensos; comércio exterior teve falha TLS e não tem valor incorporado. Identifique falhas de evidência e oportunidades concretas, classificando confirmado nesta revisão, calculado com prova, não verificado ou rejeitado. Não transforme ausência em zero nem estime períodos.

Execute os testes indicados, inspecione exportação e interface, confira pacote/fallback e a preservação pelo snapshot inicial. app.js e demais eixos não podem ser alterados. Não faça redesign, deploy ou homologação automática. Entregue achados com ID, fonte/arquivo/célula, gravidade, correção proposta e limitações. Pare para decisão humana após Economia.
''',encoding='utf8')
print('Relatório A–K e prompt de revisão gerados.')
