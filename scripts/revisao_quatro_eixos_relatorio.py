"""Relatórios finais a partir da integração e QA, sem alterar dados canônicos."""
from pathlib import Path
import json,hashlib,zipfile,collections
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008';BASE=ROOT/'data/radar_hub'
def read(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def write(p,t):Path(p).write_text(t,encoding='utf8')
def dump(p,v):write(p,json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def clean_markdown(text):
    import re
    # Nunca inserir espaços em fingerprints, IDs ou comandos delimitados por backticks.
    parts=re.split(r'(```[\s\S]*?```|`[^`]*`)',text)
    for index,part in enumerate(parts):
        if part.startswith('`'):continue
        part=re.sub(r'(?<=\d)(?=[A-Za-zÀ-ÿ])',' ',part)
        part=re.sub(r'(?<=[a-zà-ÿ])(?=\d)',' ',part)
        part=re.sub(r'(?<=[A-Z]{2})(?=\d)',' ',part)
        part=re.sub(r'(?<=[,;:])(?=[A-Za-zÀ-ÿ0-9])',' ',part)
        part=re.sub(r'^##(?=[0-9A-ZÀ-ÿ])','## ',part,flags=re.M)
        for before,after in {'comvalor':'com valor','deP1':'de P1','CVEresidência':'CVE por residência',
            'SSP/SEADE':'SSP/SEADE','Desktoponline':'Desktop online','desktoponline':'desktop online',
            'remotaoffline':'remota offline','apósassets':'após assets','viewportmóvel':'viewport móvel',
            'Viewportemulado':'Viewport emulado','semapp.js':'sem app.js','nãoéE2E':'não é E2E',
            'doharness':'do harness','nadados':'nos dados','dafigura':'da figura','comumaúnicacópia':'com uma única cópia',
            'éopcional':'é opcional','semcompressão':'sem compressão','deprodução':'de produção','foifixture':'foi fixture',
            'séries sãoadicionais':'séries são adicionais','atévingulo':'até vínculo','sobquarentena':'sob quarentena',
            'atéví­nculo':'até vínculo','até­vínculo':'até vínculo','até­vinculo':'até vínculo','atévínculo':'até vínculo',
            'quandoparte':'quando parte','estácomprovada':'está comprovada','convínculo':'com vínculo',
            'semvínculopopulacional':'sem vínculo populacional','semvínculo':'sem vínculo','dedados':'de dados',
            'deseleção':'de seleção','reextraídos porparserXML':'reextraídos por parser XML',
            'índiceGit':'índice Git','redownload':'nova transferência','julho2001':'julho 2001',
            'debilhetagem':'de bilhetagem','contagens anuais2001emconflito':'contagens anuais 2001 em conflito',
            'SUSnão':'SUS não','distinguemregistro/ocorrência':'distinguem registro/ocorrência',
            'fonteoriginal':'fonte original','Dezembro2024':'Dezembro 2024','Resultadopublicado':'Resultado publicado',
            'aPNAD':'à PNAD','doisIDs':'dois IDs','iníciosintomas':'início dos sintomas','comSMSSE':'com SMS SE',
            'noveKPIsSaúde':'nove KPIs de Saúde','NoveKPIsSaúde':'Nove KPIs de Saúde','continuamnull':'continuam null',
            'territorialjulho':'territorial em julho','conflitantesnull':'conflitantes null','nativaSSP':'nativa SSP',
            'roubosveículos':'roubos de veículos','furtosveículos':'furtos de veículos','oficialIBGE':'oficial IBGE',
            'ClassificaçãoIBGE':'Classificação IBGE','classificaçãoIBGE':'classificação IBGE','eXLSX':'e XLSX',
            'auxiliaresnull':'auxiliares null','ºranking':'º ranking','revisõesSIH':'revisões SIH',
            'Doisregistros':'Dois registros','semcompetência':'sem competência','comIBGEatual':'com IBGE atual',
            'Seiscensos':'Seis censos','Fontes/hash':'Fontes/hash','Númerosantigos':'Números antigos',
            'debilhetagem':'de bilhetagem','ofertaSUS':'oferta SUS','nacionalDATASUS':'nacional DATASUS',
            'deEvidências':'de Evidências','deSSL':'de SSL','comedição':'com edição','comperiodo':'com período',
            'apósassets':'após assets','comfallback':'com fallback','Chromeoffline':'Chrome offline',
            'modulefixture':'fixture do módulo','semassociação':'sem associação','dedados':'de dados',
            'particularesocupados':'particulares ocupados','primeiroacesso':'primeiro acesso',
            'éE2E':'é E2E','semapp.js/login':'sem app.js/login','sesomas':'sem somas',
            'debenchmark':'de benchmark','emgráficos':'em gráficos'}.items():part=part.replace(before,after)
        parts[index]=part
    return ''.join(parts)
p=read(BASE/'radar_hub_package.json');gt=p['groundTruth'];reg=p['metadataRegistry'];z=zipfile.ZipFile(OUT/'snapshot-inicial.zip')
oldreg=json.loads(z.read('data/radar_hub/sjc_metadata_registry.json').decode('utf-8-sig'));oldby={i['indicator_id']:i for i in oldreg['indicators']}
integrity=read(OUT/'integridade-final.json');vm=read(OUT/'qa/regressoes.json');chrome=read(OUT/'qa/testes-chrome-real.json');counts=read(OUT/'integracao-resumo.json')['counts']
assert integrity['status']==chrome['status']=='PASS' and len(vm)==10 and all(r['exit_code']==0 for r in vm)
titles={'educacao':'Educação','saude':'Saúde','seguranca':'Segurança Pública','demografia':'Demografia'}
coverage=[
 {'axis':'educacao','family':'IDEB, rendimento e SAEB','before':'2005–2025, três redes','after':'11 ciclos2005–2025, Pública/Municipal/Estadual, AI/AF;741 células','limits':'Metas primeiro ciclo2007–2021; metas2023/2025 ausentes. IDEB, nota SAEB e percentuais não equivalentes.'},
 {'axis':'educacao','family':'Censo Escolar: matrículas/redes/docentes/estabelecimentos/turmas','before':'Corte2023','after':'2023–2025; totais163965/161959/156378, quatro redes','limits':'2025V2 alterou colunas; profissional/especial sobrepõem etapas. Docentes por etapa não são somáveis; estabelecimentos seguem definição da sinopse.'},
 {'axis':'educacao','family':'Distorção idade-série e rendimento','before':'Sem série integrada','after':'2025,32recortes,1136células, redes/localização/etapas explícitas','limits':'Não preencher anos anteriores nem combinar Total/Pública/componentes.'},
 {'axis':'saude','family':'SINASC, SIH e SIM por residência','before':'SINASC/SIH2021–2024;SIM2023–2024','after':'SINASC2015–2024,SIH2015–2025,SIM2015–2024;31observações selecionadas','limits':'RAG SMS reproduz DATASUS; extração nacional direta não concluída.85observações de edições preservadas; três revisõesSIH documentadas.'},
 {'axis':'saude','family':'Dengue CVE por residência/início dos sintomas','before':'Ausente; boletinsSMS de outro universo','after':'2019–2025, sete totais e84meses','limits':'CVE98256/5554 não substitui SMS98163/5529SE1–50. Não atribuir diferença somente às semanas finais.'},
 {'axis':'saude','family':'CNES por código nativo','before':'KPIs suspensos','after':'52linhas, competência12/2024, somente série discreta limitada/export','limits':'HABILITADOS ≠ SUS. Hospital-dia/complementares/subtipos têm universos distintos. NoveKPIsSaúde continuamnull.'},
 {'axis':'seguranca','family':'Ocorrências e vítimas SSP','before':'Anual2001–2025; recortes mensais suspensos','after':'545recortes anuais/parciais e6540células mensais2001–2026;25anos completos por categorias disponíveis','limits':'Quatro contagens2001 conflitantes suspensas; mudança registro→ocorrência julho2001. Doisregistros2015semcompetência rejeitados;2026jan–ago somente.'},
 {'axis':'seguranca','family':'Taxas SSP e produtividade','before':'Taxa homicídios e produtividade sem vínculo suficiente','after':'189taxas1999–2025 de sete famílias e13categorias produtividade2024','limits':'Taxas nativas SEADE/veículos, não recalculadas comIBGEatual. Prisões2170 não pessoas únicas. CSI/DEIC/ranking continuam suspensos.'},
 {'axis':'demografia','family':'Censos e estimativas','before':'Censo2022;estimativas suspensas','after':'Seiscensos1970–2022 e22estimativas2001–2026, famílias separadas','limits':'Estimativas ausentes2007/2010/2022/2023 não preenchidas. Comparabilidade territorial e revisões precisam de contexto.'},
 {'axis':'demografia','family':'Idade, sexo, situação e domicílios','before':'Pirâmide suspensa; totais municipais','after':'21faixas com homens, mulheres e total2022; situação urbana/rural e13categorias domiciliares','limits':'Cor/raça residual31 pendente; não completar categorias. Classificação IBGE diverge municipal; não associar tabelas aos35polígonos.'}
]
opportunities=[
 {'axis':'educacao','opportunity':'Sinopses anteriores a2023 e indicadores de fluxo de outras edições','official_source':'INEP / Sinopses Estatísticas e Indicadores Educacionais','next_check':'Baixar cada edição, conferir mudanças de colunas, rede/etapa, notas, territorialidade e sinais de ausência antes de integrar.'},
 {'axis':'educacao','opportunity':'Infraestrutura, estabelecimentos, docentes e modalidades por escola','official_source':'INEP / Censo Escolar e microdados oficiais','next_check':'Validar situação da escola, município da escola versus residência e deduplicação de docentes; não inferir aluno único de matrícula.'},
 {'axis':'saude','opportunity':'Dados nacionais SIM/SINASC/SIH e anos anteriores dos RAG','official_source':'DATASUS / TabNet / arquivos DBC; RAG2016–2018 já capturados','next_check':'Reproduzir residência e versão; extrair PDFs antigos/OCR auditado; não anunciar extração nacional que sofreu timeout.'},
 {'axis':'saude','opportunity':'CNES mensal por estabelecimento/status e vacinação com denominadores','official_source':'MS / CNES / PNI / e-Gestor','next_check':'Definir hospital-dia/complementares/UTI/SUS e situação cadastral; preservar estimativas APS e versões PNI.'},
 {'axis':'seguranca','opportunity':'Produtividade de outros anos, SPVida e BOs','official_source':'SSP-SP / APIs e plano de dados abertos','next_check':'Reproduzir dicionário histórico, retificações, vítima/ocorrência, deduplicação de BOs; não agregar instituições.'},
 {'axis':'seguranca','opportunity':'Resolver2001, ranking e esclarecimento','official_source':'SSP-SP / FundaçãoSEADE / DEIC','next_check':'Obter edição oficial reconciliada, população/frota, universo completo de municípios e coorte/denominador DEIC.'},
 {'axis':'demografia','opportunity':'Correspondência dos35polígonos e39áreas textuais municipais','official_source':'Prefeitura / GeoSanja / legislação / IBGE malhas','next_check':'Obter camada original/versionada e crosswalk explícito; validar chaves, geometria e agregação de setores censitários. Não usar semelhança de nomes.'},
 {'axis':'demografia','opportunity':'Cor/raça, alfabetização, indígenas, favelas, quilombolas e censos antigos','official_source':'IBGE / SIDRA / produtos temáticos do Censo','next_check':'Reproduzir classificações e universos próprios, residual31, denominadores e séries por edição; nenhum preenchimento artificial.'}
]
opinions={'educacao':'Confiabilidade alta nos resultados publicados reproduzidos, com limites de edição, rede e etapa. Metas sem fonte permanecem suspensas; escolarização não tem contagens absolutas inferidas.',
 'saude':'Confiabilidade documental boa no núcleo SMS/RAG e CVE reproduzido; limitada para microdados nacionais, denominadores de taxas e equivalência dos KPIs CNES. Mortalidade2025 permanece preliminar.',
 'seguranca':'Confiabilidade boa nos recortes SSP de2002–2025 que conciliam; limitada para2001, categorias sem competência e universos CSI/DEIC/ranking. Taxas publicadas preservam denominador nativo.',
 'demografia':'Confiabilidade alta nos recortes municipais IBGE reproduzidos. Vínculos dos35polígonos, distribuições temáticas e comparabilidade histórica incompleta permanecem limitados/suspensos.'}
changes=[]
def val(v):return 'null' if v is None else str(v)
sources=[]
for axis,title in titles.items():
    items=[i for i in reg['indicators'] if i['category']==axis]
    table='|Indicador|Antes: valor/competência|Depois: valor/competência|Status atual|\n|---|---|---|---|\n'
    for i in items:
        old=oldby[i['indicator_id']]
        row={'indicator_id':i['indicator_id'],'axis':axis,'before':old,'after':i,'value_changed':old['value']!=i['value'],'competence_changed':str(old.get('competencia',old['base_year']))!=str(i.get('competencia',i['base_year']))}
        changes.append(row)
        table+=f"|`{i['indicator_id']}`|{val(old['value'])} / {old.get('competencia',old['base_year'])}|{val(i['value'])} / {i.get('competencia',i['base_year'])}|{i['audit_status']}|\n"
    rows=sum(len(v) for v in gt['eixos'][axis]['series_auditadas'].values());nulls=sum(i['value'] is None for i in items)
    axiscoverage=[e for e in coverage if e['axis']==axis];axisopps=[e for e in opportunities if e['axis']==axis]
    ctable='|Família|Antes|Cobertura integrada|Lacunas/quebras|\n|---|---|---|---|\n'+''.join(f"|{e['family']}|{e['before']}|{e['after']}|{e['limits']}|\n" for e in axiscoverage)
    otable='|Oportunidade real|Fonte primária|Procedimento necessário|\n|---|---|---|\n'+''.join(f"|{e['opportunity']}|{e['official_source']}|{e['next_check']}|\n" for e in axisopps)
    text=f'''# {title} — resultado integrado de08/10/2026

{opinions[axis]} Revisão humana final pendente; não é homologação geral.

##1. Inventário

{len(items)}indicadores no registry, {len(items)-nulls}comvalor e {nulls}null. {rows}observações/células na exportação histórica, inclusive ausências e recortes sobrepostos: não são indicadores independentes nem valores somáveis. O inventário inicial completo e as definições estão no[relatório do pesquisador](relatorio.md).

##2. Evidências reproduzidas

Consulte[manifest das fontes](manifest.json),[matriz metodológica](../metodologia/matriz-decisoes.json),[QA primário independente](../qa/validacao-evidencias.json) e[QA de todos os locators integrados](../qa/validacao-integracao-proposta.json). Fonte/URL/hash/arquivo/competência/unidade/locator e recortes acompanham cada registro em `series_auditadas` + `series_metadata`. Saúde tem adendos específicos[CNES](../qa/validacao-cnes.json) e[competências atualizadas](../qa/validacao-refresh-saude.json).

##3. Antes/depois aplicado

{table}
Metadados legados anteriores foram[arquivados](../metadados-legados-preservados.json), preservando provas e divergências. O arquivo[antes-depois-indicadores.json](../antes-depois-indicadores.json) mantém os registros completos.

##4. Cobertura, lacunas e quebras

{ctable}

##5. Oportunidades de ampliação

{otable}

##6. Testes e regressão

10/10suítes VM e4/4cenários Chrome aprovados. Os oito eixos, exportações JSON/CSV online/offline, filtros, fontes, hashes, unidades, competências e null/zero foram exercidos. P1–P4 e app.js preservados;42valores incorretos da bilhetagem não reapareceram em duas regenerações adversariais. [Relatório QA](../qa/relatorio-qa.md) e[integridade final](../integridade-final.json).

##7. Pendências e limites

As limitações da tabela acima permanecem. Novas séries comprovadas estão na exportação; gates de gráficos sem vínculo completo não foram levantados. Chrome usou fixture do módulo, sem app.js/login; offline após assets não comprova primeiro acesso offline; viewport móvel não equivale a aparelho físico. Nenhum screenshot, deploy ou redesenho. Brutos grandes permanecem locais e descritos por manifests/hash; não são carregados no payload.

##8. Parecer

{opinions[axis]} Versão integrada `{p['dataset_version']}`. A próxima etapa depende de revisão humana; nenhum redesenho ou novo eixo iniciado.
'''
    write(OUT/axis/'resultado-integrado.md',clean_markdown(text))
    for sid,s in gt['eixos'][axis]['series_metadata'].items():sources.append({'axis':axis,'source_metadata_id':sid,**s})
dump(OUT/'antes-depois-indicadores.json',changes);dump(OUT/'cobertura-historica-consolidada.json',coverage);dump(OUT/'matriz-oportunidades.json',opportunities);dump(OUT/'manifest-fontes-integradas.json',sources)
summarytable='|Eixo|Indicadores atuais|Séries/células exportadas|Parecer e entrega|\n|---|---|---|---|\n'
for axis,title in titles.items():
    items=[i for i in reg['indicators'] if i['category']==axis];n=sum(i['value'] is None for i in items)
    summarytable+=f'|{title}|{len(items)-n}comvalor /{n}null|{counts[axis]}|[Resultado integrado]({axis}/resultado-integrado.md)|\n'
ctable='|Eixo/família|Cobertura integrada|Lacunas/quebras|\n|---|---|---|\n'+''.join(f"|{titles[e['axis']]}: {e['family']}|{e['after']}|{e['limits']}|\n" for e in coverage)
otable='|Eixo|Oportunidade|Fonte e validação necessária|\n|---|---|---|\n'+''.join(f"|{titles[e['axis']]}|{e['opportunity']}|{e['official_source']}: {e['next_check']}|\n" for e in opportunities)
text=f'''# Radar São José — revisão independente dos quatro eixos

Fechamento de08/10/2026. **Integração técnica concluída e aprovada com limites; revisão humana final pendente.** Não constitui homologação geral dos oito eixos. Não houve deploy, screenshot ou redesenho; app.js e dados deP1–P4 permaneceram iguais à base desta fase.

Base recebida: `sha256:9f20f59a93862a89eb7b96c0969fce22cccb435e8a7e657a822edf7253f55969`.

Versão final: `{p['dataset_version']}`. Package, inline do controller, registry, ground truth, derivação do hash e versão carregada no Chrome concordam. O pacote mantém auditoria histórica sem autoridade e homologação geral falsa.

##Resultado por eixo

{summarytable}
São9.516observações/células com recortes distintos, inclusive nulls; não9.516indicadores independentes. O registry continua com122IDs únicos; valores null passaram de34para28 devido a seis promoções externamente reproduzidas e validadas por agentes distintos.

##Problemas, causas e correções

|Problema|Causa reproduzida|Correção aplicada|
|---|---|---|
|Educação: percentuais por rede114,779%|Divisor fixo142.850, contra total2023de163.965|Total do mesmo recorte e guarda para ausência/denominador inválido; soma100%|
|Matrículas confundidas com pessoas/recortes|Tooltips “estudantes”, especial “inclusiva”, médio “regular”, profissional genérico|Matrículas2023, comuns+exclusivas, médio inclui integrado; técnica7316 distinta profissional total7322|
|Escolarização atribuída aPNAD/INEP|Metadata e tooltip legados|IBGE/Censo2022, residentes6–14;99,09%; sem inferir contagens|
|Saúde com competências antigas|Valores escalares não acompanhavam resultados anuais já publicados|Mortalidade7,65prelim2025; APS57,95/2025 doisIDs; SIH41.846/2025; SIM5.028/2024. Anos anteriores preservados|
|Metadados de fonte contraditórios|raw_file/trecho_bruto ainda citavam valores antigos sem prova|Autoridade ativa sincronizada com evidência/hash/competência; registros antigos arquivados|
|Dengue com universos incompatíveis|CVEresidência/iníciosintomas confundido comSMSSE1–50|Séries separadas, edição e revisão identificadas; nenhum total substituído silenciosamente|
|CNES com total/SUS/UTI incompatível|Hospital-dia, complementares e HABILITADOS tratados como mesmo universo|52códigos discretos limitados/export; noveKPIsSaúde continuamnull; nenhum agregado novo|
|Segurança2001|Anual e mensal divergem em quatro contagens; mudança territorialjulho2001|Contagens anuais conflitantesnull, ambas edições arquivadas, taxa nativaSSP/SEADE separada; meses distinguemregistro/ocorrência|
|Ocorrências, vítimas e prisões|Naturezas distintas eram tratadas como intercambiáveis|2025:29ocorrências/33vítimas. Promovidos2024:143roubosveículos,724furtosveículos,2170prisões nativas; sem pessoas únicas|
|Demografia2026 rotulada projeção|Narrativa anterior sem prova da estimativa|Estimativa oficialIBGE729.153;2024=724.756. SIDRA eXLSX2026 reproduzidos|
|Urbanização divergente|ClassificaçãoIBGE688.155 urbanos versus municipal681.842|98,72% calculada na classificaçãoIBGE/mesmo denominador697.054; divergência municipal preservada|
|35polígonos versus tabelas locais|Ausência de crosswalk/geometria versionada;39áreas textuais não equivalem automaticamente|Geometrias e hashes preservados; população/ranking/densidade continuam suspensos|
|Afirmações estáticas em tela|Cartões não dependiam dos auxiliaresnull|Alfabetização/indígenas/comunidades/quilombolas em verificação; retirada afirmação1ºranking/homologação sem prova|
|Diagnóstico local ainda anunciava números antigos|Consistency era diagnóstico da versão anterior|Divergências históricas arquivadas;48comparações registry/evidência da mesma competência aprovadas|

##Cobertura histórica e lacunas

{ctable}

##Oportunidades reais

{otable}

##Evidências e reprodução

Quatro pesquisadores trabalharam em pastas separadas; um metodólogo independente e um QA distinto reproduziram as propostas. O integrador foi o único escritor do GT/registry/controller/package. Com três slots além do integrador, os pesquisadores e validadores trabalharam em rodadas; não houve escrita concorrente nos arquivos compartilhados.

Fontes originais, arquivos, hashes, datas, competências e locators: manifests de[Educação](educacao/manifest.json),[Saúde](saude/manifest.json),[Segurança](seguranca/manifest.json),[Demografia](demografia/manifest.json) e[fontes integradas](manifest-fontes-integradas.json). Os brutos nacionais grandes permanecem locais, fora do carregamento e do índiceGit; alguns brutos pequenos e o snapshot inicial são preservados no índice. Manifests permitem verificar os bytes e refazer captura, mas URLs mutáveis podem mudar: nova coleta deve usar outra pasta/edição, sem sobrescrever esta rodada. Não houve redownload de todos os arquivos nacionais peloQA; os ZIPs primários preservados foram reextraídos porparserXML próprio e hashes conferidos.

Reprodução não destrutiva a partir da raiz:

```powershell
python -X utf8 scripts/revisao_quatro_eixos_integridade.py
python -X utf8 scripts/revisao_quatro_eixos_qa_evidencias.py
python -X utf8 scripts/revisao_quatro_eixos_qa_cnes.py
python -X utf8 scripts/revisao_quatro_eixos_qa_refresh.py
python -X utf8 scripts/revisao_quatro_eixos_qa_integracao.py
python -X utf8 scripts/revisao_quatro_eixos_qa_regressoes.py
python -X utf8 scripts/revisao_quatro_eixos_qa_chrome.py
```

Os validadores escrevem relatórios somente nesta pasta. A integração é operação única vinculada ao snapshot e aos hashes aprovados; não executar integrar/controller novamente sobre a versão final. Para reconstruí-la, usar workspace isolado com o snapshot inicial, propostas/manifests e validações, depois executar aprovar→integrar→controller→builder. Nenhum extrator deve restaurar valores sem reaplicar a reconciliação dos42IDs deP4.

##Testes e limites práticos

QA:3.229checks primários independentes,213CNES,4refresh e27.515transcrição/locators. São conjuntos sobrepostos, não indicadores distintos. Metodologia:30decisões,14fontes recapturadas,40checks e adendos. Integridade:19.256checks;9.516registros e57arquivos-fonte usados na integração.

**10/10suítes VM e4/4cenários Chrome aprovados**, cobrindo os oito eixos, exportJSON/CSV online/offline, fontes/hash/unidade/competência/status/null/zero, filtros, fallback e duas regenerações adversariais dos42valores de bilhetagem. [Relatório QA](qa/relatorio-qa.md),[VM](qa/regressoes.json),[Chrome](qa/testes-chrome-real.json),[fingerprint/reprodução](qa/regeneracao-fingerprint.json),[integridade](integridade-final.json).

Chrome: desktoponline6,04s, offline apósassets4,92s, viewportmóvel1MiB/s+100ms40,02s, verificação remotaoffline4,89s. A primeira falha foi doharness: proxy `chart.options` avaliavaformatter como scriptable; leitura corrigida para `chart.config.options`, sem mudança do produto. [Falha inicial preservada](qa/testes-chrome-primeiro-harness.json).

PackageJSON:26.282.088bytes (base22.440.492; aumento3.841.596). Controller cominline:26.520.931bytes. O carregamento padrão continua comumaúnicacópia inline; verificação remota éopcional e fallback idêntico. Esses tempos usamHTTP local semcompressão, não benchmark deprodução. O pacote continua pesado para rede/dispositivo modestos; fracionamento ou compactação é oportunidade posterior, sem deploy nesta fase.

Chrome foi fixture real do módulo, semapp.js/login; não éE2E da aplicação completa. Offline apósassets não comprova primeiro acesso offline/PWA. Viewportemulado não substitui aparelho físico. Não houve screenshots. Novos históricos estão nos dados/exportações; gráficos sobquarentena permanecemfallback atévínculo completo, mesmo quandoparte da família já estácomprovada.

##Pendências e decisão final

Manter: duasmetasEducação, noveKPIsSaúde, CSI/DEIC/ranking, quatrocontagens anuais2001emconflito e35polígonossemvínculopopulacional. No total do registry dos oito eixos permanecem28null; ausências emséries sãoadicionais e não equivalem a zero. Cor/raça, alfabetização, universos indígenas/comunidades/quilombolas e pirâmides antigas precisam dedados específicos. Fonte primária municipal não substitui extração nacionalDATASUS; a correspondência territorial ainda precisa decamada/crosswalk comprovados.

[Antes/depois completo](antes-depois-indicadores.json),[cobertura histórica](cobertura-historica-consolidada.json),[oportunidades](matriz-oportunidades.json),[decisões técnicas](decisoes-integracao.json),[arquivos alterados](arquivos-alterados.md).

**Parado para revisão humana.** Não iniciado redesenho definitivo, novo eixo, deploy ou promoção adicional.
'''
# Mantém IDs/códigos exatos; normaliza apenas os títulos e prosa com palavras coladas.
import re
text=re.sub(r'^##(?=[A-ZÀ-ÿ])','## ',text,flags=re.M)
for before,after in [('de08','de 08'),('deP1','de P1'),('São9.516observações','São 9.516 observações'),('não9.516indicadores','não 9.516 indicadores'),('com122IDs','com 122 IDs'),('de34para28','de 34 para 28'),('**10/10suítes VM e4/4cenários','**10/10 suítes VM e 4/4 cenários')]:text=text.replace(before,after)
write(OUT/'relatorio-consolidado.md',clean_markdown(text))
print('Relatórios consolidados e por eixo gerados com testes finais PASS.')
