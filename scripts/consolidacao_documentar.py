"""Gera entregáveis a partir do snapshot, decisões e resultados verificáveis."""
from pathlib import Path
import json,hashlib,zipfile,collections,datetime,re,subprocess
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub'
OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
def dump(name,data):
 (OUT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def md(name,text):
 (OUT/name).write_text(text.strip()+'\n',encoding='utf8')
def cell(x):return str(x).replace('|','\\|').replace('\n',' ')
snap=read(OUT/'inventario.json');orig={r['path']:r for r in snap['files']}
reg=read(BASE/'sjc_metadata_registry.json');gt=read(BASE/'sjc_open_data_ground_truth.json');pkg=read(BASE/'radar_hub_package.json')
with zipfile.ZipFile(OUT/'snapshot-canonico.zip') as z:before=readreg=json.loads(z.read('data/radar_hub/sjc_metadata_registry.json'))
old={r['indicator_id']:r for r in before['indicators']}
changes=[]
fields=['value','unit','competencia','base_year','audit_status','official_url','methodology','evidence_id','evidencia','last_checked']
for i in reg['indicators']:
 b=old[i['indicator_id']]
 changes.append({'indicator_id':i['indicator_id'],'category':i['category'],'name':i['name'],'before':{k:b.get(k) for k in fields},'after':{k:i.get(k) for k in fields},'changed_fields':[k for k in fields if b.get(k)!=i.get(k)]})
dump('antes-depois-indicadores.json',changes)
md('antes-depois-indicadores.md','# Antes/depois dos 122 indicadores\n\nValores ausentes são `null`. Mudança de status ou período não significa necessariamente mudança numérica. Fonte, evidência, hash, metodologia e versão completa estão no JSON acompanhante.\n\n| ID | Eixo | Antes: valor / período / status | Depois: valor / período / status |\n|---|---|---|---|\n'+'\n'.join('| '+cell(r['indicator_id'])+' | '+r['category']+' | '+cell(f"{r['before']['value']} / {r['before']['competencia'] or r['before']['base_year']} / {r['before']['audit_status']}")+' | '+cell(f"{r['after']['value']} / {r['after']['competencia'] or r['after']['base_year']} / {r['after']['audit_status']}")+' |' for r in changes))
names={'demografia':'Demografia','saude':'Saúde','seguranca':'Segurança','economia':'Economia','educacao':'Educação','mobilidade':'Mobilidade','financas':'Finanças','meio_ambiente':'Meio Ambiente'}
details={
 'demografia':('10 KPIs Censo/SIDRA; 3 suspensos','Censo 2022: domicílios, sexo, população, área, densidade e transição demográfica','35 polígonos preservados; população por setor sem ligação reproduzível ao IBGE','2022; não homologar séries e estimativas legadas','KPIs vinculados; 8 gráficos e mapa quantitativo em fallback'),
 'saude':('17 indicadores; valores documentais e suspensões discriminados no registry','SMS RAG 2025, prestações quadrimestrais e notícias municipais oficiais','SINASC por mãe residente; SIH por residente; taxas SMS sem inferir denominadores; CNES suspenso','SINASC 2021–2024; dengue 2010–2018 + recortes parciais; mortalidade 2023–2025','6 gráficos renderizados, 2 fallbacks; sem comprovar CNES total'),
 'seguranca':('SSP 25 anos e 9 indicadores','API SSP municipal, identificação 560/3549904 conferida','Ocorrências não são vítimas; CSI/DEIC, rankings e contagens veiculares não comprovados','2001–2025, 25 anos de ocorrências e taxas nativas','1 gráfico renderizado, 3 fallbacks'),
 'economia':('P1 preservada; 15 indicadores','IBGE PIB nativo, MTE e CEMPRE; 766 evidências com hashes','PIB nominal a preços correntes; componentes 2022–2023 indisponíveis; emprego é estoque, salário CEMPRE não é CAGED','PIB 2002–2023; CAGED 2020-01 a 2026-08; CEMPRE edição 2022–2024','10 gráficos; complexidade P1.1 continua como pendência de usabilidade'),
 'financas':('P2 preservada; 30 indicadores','Siconfi/TCE; 14.808 evidências com hashes','Receita realizada menos despesa empenhada; não resultado primário/nominal nem saldo financeiro; 2026 parcial','RREO 2015–2026; séries auxiliares por família no arquivo de cobertura','12 gráficos; complexidade P2.1 não redesenhada'),
 'meio_ambiente':('P3 preservada; 21 indicadores','SNIS/SINISA/IBGE/INPE/estações; 656 evidências com hashes','Quebras SNIS/SINISA; focos não são incêndios; estações não média municipal','SNIS 2004–2022; SINISA 2023–2024; INPE 2003–2024','2 gráficos e 2 fallbacks; qualidade do ar anual permanece suspensa'),
 'educacao':('9 KPIs; sinopse 2023 e IDEB edição 2025','INEP: células nativas, 165 tabelas municipais; IBGE escolarização 2022','Rede/etapa distintas; matrícula não é aluno único; educação especial pode se sobrepor; IDEB não é SAEB','11 ciclos 2005–2025 por rede Pública/Municipal/Estadual; Censo 2023','4 gráficos; IDEB 2025 público 6,9/5,7; metas só até 2021'),
 'mobilidade':('P4 preservada; 16.174 registros históricos, 42 correções documentadas','PDFs municipais, Senatran/IBGE/ANAC; hashes preservados','TOTAL/MÉDIA de bilhetagem não são meses; ANAC não somar recortes; ausência não é zero','Frota 2003–2026-08; bilhetagem 2013–2026-08; ANAC 2000–2026-08','1 gráfico e 3 fallbacks; óbitos/perfil/motorização continuam suspensos')}
browser=read(OUT/'testes-chrome-real.json');integrity=read(OUT/'testes-integridade-final.json');source_tests=read(OUT/'testes-fontes-novas.json')
mat=[]
for a,n in names.items():
 inds=[r for r in reg['indicators'] if r['category']==a];d=details[a]
 actual=f"{sum(i['value'] is not None for i in inds)} com valor / {sum(i['value'] is None for i in inds)} null"
 mat.append({'eixo':n,'dados_existentes':d[0]+'; '+actual,'auditoria_encontrada':'Inventário de trabalhos + P0/P1–P4 e revisões posteriores; ver inventario-trabalhos.md','evidencia_externa':d[1],'implementacao_funcional':'Navegação e exportação verificadas em fixture Chrome real, 3 cenários; login/app.js não executados','veracidade_dados':'Escopo primário reproduzido; demais suspensos. Sem homologação global.','correcao_metodologica':d[2],'cobertura_historica':d[3],'qualidade_visualizacao':d[4],'reprodutibilidade':'Scripts e manifests; brutos nacionais mantidos fora do payload. Exige recuperar arquivos com SHA original.','testes':'Chrome 3 cenários, integridade global e fontes; escopo específico em testes.md','divergencias':d[2],'homologacao':'Pendente de revisão humana; P4 aceita apenas para continuidade'})
dump('matriz-consolidacao.json',mat)
md('matriz-consolidacao.md','# Matriz dos oito eixos\n\nA coluna funcional não certifica dados nem metodologia. Os sete critérios são separados no JSON acompanhante. Nenhum eixo recebe status único “PRONTO”.\n\n| Eixo | Dados existentes | Evidência externa | UI e visualização | Histórico | Divergências / estado real |\n|---|---|---|---|---|---|\n'+'\n'.join('| '+' | '.join(cell(x) for x in [r['eixo'],r['dados_existentes'],r['evidencia_externa'],r['qualidade_visualizacao'],r['cobertura_historica'],r['divergencias']+'; revisão humana pendente'])+' |' for r in mat)+'\n\nFuncionalidade: oito eixos navegáveis no módulo isolado. Veracidade: somente o subconjunto comprovado. Metodologia: limitações por família acima. Visualização: gráficos existentes preservados, com fallbacks quando necessário. Reprodutibilidade: scripts + manifests e brutos com hashes. Homologação: não realizada.')
# Cobertura observada, nunca capacidade nominal do catálogo.
coverage=[]
for a,d in gt['eixos'].items():
 for f,rows in d.get('series_auditadas',{}).items():
  periods=sorted({str(r.get('period') or r.get('competence') or r.get('ano') or r.get('exercicio') or r.get('exercise') or r.get('year') or '') for r in rows}- {''})
  coverage.append({'axis':a,'family':f,'records':len(rows),'periods':periods,'non_null':sum(r.get('value') is not None for r in rows),'null':sum(r.get('value') is None for r in rows),'warning':'Registros distinguem recortes/variáveis; não somar só pelo ano. Campos fiscais podem usar exercício/período nos locators.'})
extra=[('economia','PIB',2002,2023,22,'Nominal; componentes indisponíveis em 2022–2023'),('economia','Novo CAGED','2020-01','2026-08',80,'2026 parcial; estoque não soma de saldo'),('economia','CEMPRE',2022,2024,3,'Descontinuidade metodológica; 12 registros por variável'),('educacao','IDEB por rede',2005,2025,11,'11 ciclos para cada uma das 3 redes, etapas AI/AF; metas 2007–2021'),('educacao','Censo Escolar',2023,2023,165,'Tabelas, não anos; rede/etapa/unidade/duplicações nas notas nativas'),('demografia','KPIs Censo',2022,2022,10,'Alegadas composições/históricos sem rastreio ficam suspensos'),('saude','SINASC',2021,2024,4,'Residência da mãe'),('saude','SIH',2021,2025,5,'Documento comprova 2025; série ativa mantém 2021–2024, sem nova expansão de interface'),('saude','Mortalidade infantil SMS',2023,2025,3,'2025 preliminar; numeradores e denominadores não discriminados'),('saude','Dengue anual',2010,2018,9,'2019–2023 lacunas; 2024/2025 só SE1–50'),('seguranca','Homicídios SSP',2001,2025,25,'Ocorrências e taxa publicada; vítimas null')]
for a,f,start,end,n,note in extra:coverage.append({'axis':a,'family':f,'start':start,'end':end,'records':n,'warning':note})
dump('matriz-cobertura-historica.json',coverage)
md('matriz-cobertura-historica.md','# Cobertura histórica comprovada\n\n| Eixo | Família | Recorte temporal | Registros | Limite |\n|---|---|---|---|---|\n'+'\n'.join('| '+' | '.join(cell(x) for x in [r['axis'],r['family'],((r.get('periods') or [''])[0]+' → '+(r.get('periods') or [''])[-1]) if 'periods' in r else str(r['start'])+' → '+str(r['end']),r['records'],r['warning']])+' |' for r in coverage)+'\n\nAs famílias fiscais detalhadas usam exercício e período nativos; veja o evidence store e não deduza cobertura pelo campo vazio. Disponibilidade de um catálogo não significa extração comprovada. Nunca preencher lacunas nem concatenar redes, transportes ou produtos ANAC diferentes.')
opps=[
 ('Alta','Educação','Censo 2024/2025 e séries 1995–2025; matrículas, docentes, estabelecimentos, turmas e infraestrutura','INEP sinopses; arquivos municipais e notas de cada edição','Extrair por rede/etapa, guardar denominadores e quebras. 2023 já extraído em 165 tabelas.'),
 ('Alta','Educação','Rendimento, abandono, reprovação, distorção idade-série, infantil e ensino médio','INEP indicadores educacionais, SAEB e resultados por etapa','Catálogos localizados; séries não homologadas nesta consolidação. Não usar proficiência como percentual.'),
 ('Alta','Demografia','Relacionar polígonos municipais e setores censitários','IBGE malha + camada oficial municipal e chave de agregação','Comprovar origem, recobrimento, população de referência e regra de interseção antes de ativar mapa.'),
 ('Alta','Saúde','CNES completo e séries SINASC/SIM/SIH com versões de extração','DATASUS/CNES e TabNet, SMS','Separar SUS/não-SUS, residência/ocorrência, AIH/internação e taxas SMS; preservar versão.'),
 ('Alta','Segurança','Vítimas, furtos/roubos de veículos e séries mensais','SSP tabelas mensais primárias','Endpoint agregado mostra zeros incompatíveis com FRV; conferir definição antes de usar.'),
 ('Alta','Mobilidade','Reprodução do parser tabular com meses vazios','PDF de bilhetagem municipal','42 overrides ativos. Refazer parser preservando coluna, testar agosto/setembro e não alterar arquivo histórico.'),
 ('Alta','Mobilidade','ANAC: recortes e ausências','ANAC arquivos e dicionários de dados','Somente comparar mesmo universo; ausência não significa aeroporto sem movimento.'),
 ('Alta','Desempenho','Carregamento de dados por eixo e cache validado','Package/loader atual','Proposta exige autorização de arquitetura; não implementada. Exportação deve manter todos os eixos e evidências.'),
 ('Média','Economia/Finanças','Simplificação de P1.1/P2.1 e leitura de períodos','Dados já comprovados','Avaliar usabilidade numa etapa visual autorizada; sem redesenho nesta operação.'),
 ('Média','Meio Ambiente','Mais histórico de estações e séries comparáveis','CETESB/SNIS/SINISA/INPE','Qualidade do ar anual não nasce de um snapshot. Não unir indicadores de conceitos distintos.')]
dump('matriz-oportunidades.json',[dict(zip(['priority','axis','opportunity','primary_source','condition'],r)) for r in opps])
md('matriz-oportunidades.md','# Oportunidades para a próxima revisão\n\nSim, há melhorias úteis além de cortes de 2023/2024. Priorizar séries e denominadores comprováveis antes de acrescentar cartões. As oportunidades abaixo são trabalho futuro, não dados já incorporados.\n\n| Prioridade | Eixo | Oportunidade | Fonte primária | Condição |\n|---|---|---|---|---|\n'+'\n'.join('| '+' | '.join(cell(x) for x in r)+' |' for r in opps)+'\n\nCatálogos: [INEP sinopses](https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/sinopses-estatisticas), [indicadores educacionais](https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/indicadores-educacionais), [IDEB](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb/resultados). Metas: [ciclos 2007–2021](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb/metas).')
# Completa o manifest da nova rodada sem tocar nos manifests de auditorias anteriores.
raw=OUT/'fontes-externas';manifest=read(raw/'manifest.json');known={r.get('raw_file') for r in manifest}
urls={'sinopse2023.zip':'https://download.inep.gov.br/dados_abertos/sinopses_estatisticas/sinopse_estatistica_censo_escolar_2023.zip','ssp-municipios-todos.json':'https://www.ssp.sp.gov.br/v1/Municipios/RecuperaMunicipios','sidra9514-total-idade.json':'https://apisidra.ibge.gov.br/values/t/9514/n6/3549904/v/93/p/2022/c2/all/c287/100362','9514-metadados.json':'https://servicodados.ibge.gov.br/api/v3/agregados/9514/metadados'}
for r in manifest:
 if not r.get('url') and r.get('name') in urls:r['url']=urls[r['name']]
for p in raw.iterdir():
 if not p.is_file() or p.name=='manifest.json' or p.relative_to(ROOT).as_posix() in known:continue
 u=urls.get(p.name,next((r.get('url') for r in manifest if r.get('name')==p.name),None))
 manifest.append({'name':p.name,'url':u,'raw_file':p.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size,'accessed_date':'2026-10-08','manifest_added_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'note':'Complemento de arquivo desta rodada. Hora exata/headers só comprovados quando registrados pelo coletor; mtime não prova consulta. Não inferir URL desconhecida.'})
(raw/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
stores=[]
for p in BASE.glob('*evidence*.json'):
 d=read(p);stores.append({'path':p.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size,'role':'Vínculos atuais da consolidação' if p.name.startswith('consolidacao_') else 'Auditoria anterior imutável; consultar reconciliação antes de usar como dado ativo','sources':d.get('sources',d.get('source_accesses',d.get('source_metadata',{})))})
dump('manifest-evidence-stores.json',stores)
existing=[r for r in snap['files'] if any(x in r['path'] for x in ['docs/dados-publicos-revisao/','.agents/','backups/','tmp/saude-audit/'])]
dump('inventario-trabalhos.json',existing)
roots=collections.Counter('/'.join(r['path'].split('/')[:3]) for r in existing)
md('inventario-trabalhos.md','# Trabalhos encontrados\n\nO inventário completo anterior às correções contém 4.278 arquivos e 5.337.958.691 bytes, excluindo dependências declaradas e .git. Não foi usada a data de alteração como critério de verdade. Arquivos temporários e relatórios de outras IAs são vestígios, não fontes primárias.\n\n- Estado de Git/branches/40 commits: `status.txt`, `branches.txt`, `commits.txt`, `diff.txt`, `remotes.txt`, `ignored.txt`.\n- P0, P1/P1.1, P2/P2.1, P3 e P4: docs, coletores, evidence stores e bindings foram preservados. P4 continua sem homologação definitiva.\n- Revisões posteriores de Demografia, Saúde, Segurança e Educação e documentos globais têm divergências; as declarações de integração/homologação não foram aceitas como evidência.\n- `.agents/` contém vestígios de coordenação e estados diferentes de execução. Não autoriza homologação.\n- P5 Educação anterior à operação: scaffolds, catálogos e fontes conservados. A consolidação extraiu Censo 2023 e IDEB edição 2025, mas não concluiu todas as famílias históricas pretendidas na P5.\n- Mapas: geometrias preservadas; atributos demográficos sem crosswalk comprovado foram suspensos.\n- Backups, app.updated.html, evidências locais e temporários permanecem no inventário e no disco; não foram descartados.\n\n| Grupo encontrado | Arquivos inventariados |\n|---|---|\n'+'\n'.join('| '+cell(k)+' | '+str(v)+' |' for k,v in sorted(roots.items()))+'\n\n`inventario-trabalhos.json` fornece cada caminho, SHA, tamanho, estado tracked/ignored e mtime. O snapshot ZIP é uma cópia selecionada de artefatos canônicos/scripts; os brutos gigantes permanecem no disco com hashes no inventário, não estão todos dentro do ZIP.')
md('divergencias.md','''# Divergências e decisões

1. Package, fallback inline e ground truth estavam diferentes; o loader recusava o online e preservava versão antiga. O builder agora gera um único payload e fingerprint, conferido integralmente contra inline/registry/GT.
2. Auditorias globais posteriores promoviam status de P1–P4, inclusive valores suspensos. Bindings anteriores foram restaurados sem ressuscitar valores e sem substituir os outros eixos por snapshots antigos.
3. Bilhetagem 2026: 42 valores eram TOTAL/MÉDIA, atribuídos a setembro/novembro pela perda de células vazias. Corte documental em agosto; os 144 registros posteriores ao corte permanecem null. Store antigo imutável + override por evidence ID evita apagar evidência do erro.
4. Educação: 142.850 matrículas legadas foram substituídas por 163.965 na sinopse municipal de 2023. Federal 714, estadual 45.808, municipal 68.550 e privada 48.893. Matrículas não são pessoas únicas. Ensino superior não pertence ao Censo Escolar; ficou null. IDEB público 2023 é 6,8/5,6, municipal 6,8/5,8. KPIs atuais usam edição 2025: público 6,9/5,7; municipal 6,9/6,0; estadual 6,9/5,4. Metas 2023/2025 não foram inventadas.
5. Saúde: nascidos vivos de mães residentes em 2024 = 7.463; SIH por residência 2024 = 38.738. Taxa SMS 2024 = 8,2 e 2025 = 7,65 preliminar; contagens reversamente inferidas não são prova e foram retiradas. Cobertura APS 61,63/57,95 não é cobertura ESF 83,5. CNES total/SUS/UTI continua suspenso. Dengue 98.163 é SE1–50 de 2024, não fechamento anual; média 2010–2023 não foi calculada com lacunas.
6. Segurança: homicídio do endpoint SSP é ocorrência, não vítima. Em 2024, 23 ocorrências e taxa nativa 3,28; 2025, 29 e 4,12. CSI/DEIC/rankings não comprovados foram suspensos. Zeros de furto/roubo de veículo incompatíveis com FRV não foram adotados como ausência real.
7. Demografia: 35 setores socioeconômicos não são automaticamente setores censitários. Soma legada 661.463 não fecha população municipal 697.054 e falta uma chave de agregação comprovada. Geometrias foram preservadas; números/setores/composições sem prova ficaram null. SIDRA 9514 exige idade TOTAL 100362; consulta anterior com classificação 0 produzia duplicação e foi rejeitada, mantendo o bruto para auditoria.
8. Economia: preservada P1, PIB 2023 nominal a preços correntes, em milhares de reais na fonte; R$61,39 bilhões é arredondamento. Nenhuma participação setorial 2022–2023 foi deduzida. CEMPRE e CAGED medem universos distintos.
9. Finanças: preservada P2. Resultado de 2024 é receita realizada menos despesa empenhada, déficit de aproximadamente R$77,91 milhões; receita ~R$4,8095 bilhões e despesa empenhada ~R$4,8874 bilhões. Despesa liquidada ~R$4,7685 bilhões não pode substituir empenhada para produzir superávit. Em 2023, receita R$4.232,54 milhões e resultado orçamentário -R$263,14 milhões no mesmo conceito. A afirmação global +R$28,01 milhões não prevalece sobre fontes reconciliadas.
10. Meio Ambiente: P3 preservada, inclusive suspensão de séries anuais do ar e distinções SNIS/SINISA/IBGE/estação. Foco de satélite não equivale a incêndio confirmado.

O journal `reconciliacao-aplicada.json` contém 164 decisões (42 registros de bilhetagem + 122 indicadores, incluindo mudanças de metadados). `quarentena-campos-auxiliares.json` registra também atributos fora do registry e atualização do IDEB para 2025. Antes/depois completo: `antes-depois-indicadores.json`. A tentativa inicial com falha de escrita OneDrive foi preservada em `reconciliacao-tentativa1.json`; não confundir proposta com aplicação concluída.
''')
md('arquitetura-canonica.md','''# Fonte canônica e resolução de versões

Bruto oficial (URL, edição, hash) → evidence ID/célula/recorte → ground truth e registry reconciliados → `build_radar_hub_package.py` → package e fallback inline com o mesmo fingerprint.

O registry declara unidade, competência, fonte, status e aviso; o ground truth mantém séries e recortes. Não são fontes externas independentes. O package transporta as duas representações já conferidas, não escolhe a mais recente pelo mtime. `consolidacao_status.json` declara `homologated:false` e aponta para relatório/journal/store vigente.

`consolidacao_evidence_2026-10-08.json` vincula indicadores atuais às fontes. P1–P4 conservam seus stores históricos. Para os 42 evidence IDs de bilhetagem, `mobilidade_reconciliation_20261008.json` prevalece explicitamente sobre o store P4 imutável; os valores ativos são null. `raw_value_from_failed_extraction` é registro forense do erro, não valor realizado. Auditorias posteriores em conflito são acervo histórico, não uma segunda fonte ativa.

Nacionais de Censo/IDEB não são carregados pela interface. O novo package não duplica resumos internos de evidências demográficas/educacionais pouco documentados; os originais continuam no snapshot e acervo. Brutos, SHA e locators permanecem acessíveis em manifests/store. A ausência do relatório global de auditoria não autoriza status global confirmado.

Mapa: camada municipal e geometria continuam preservadas. Não há crosswalk validado para população/setor; mapa quantitativo permanece em fallback. Benchmarks multicidades são acervo e têm renderização suspensa até comprovação compatível por cidade; não foram usados para homologação.
''')
perf=integrity['performance'];initial=read(OUT/'performance-local.json')
dump('performance-final.json',{'local':perf,'chrome':browser['scenarios'],'note':'Gzip simulado local; Chrome servidor local sem compressão. Produção não medida.'})
md('desempenho.md','# Desempenho: medido e estimado\n\n| Artefato | Antes (bytes disco) | Depois (bytes disco) | Gzip6 depois (simulação) |\n|---|---|---|---|\n'+'\n'.join('| '+r['file']+' | '+str(orig[r['file']]['bytes'] if 'bytes' in orig[r['file']] else orig[r['file']].get('size'))+' | '+str(r['bytes'])+' | '+str(r['gzip6_simulated_bytes'])+' |' for r in perf)+f"\n\nPackage antes: 35.842.381 bytes. Depois: {perf[0]['bytes']:,} bytes. Compactação JSON reduz cerca de {(1-perf[0]['bytes']/35842381)*100:.1f}% em disco; não é alegação de igual redução na rede. Controller ainda inclui fallback grande; no servidor local sem compressão, controller e package transferidos juntos continuam somando cerca de 45 MB. Gzip é estimativa local, não configuração comprovada de produção.\n\n"+'\n'.join(f"- Chrome {s['mode']}: {s['seconds']:.2f}s; heap após init {s['initialization'].get('heap')} bytes; rede limitada a 1 MiB/s e 100 ms no cenário móvel." for s in browser['scenarios'])+'\n\nJSON parse medido em Python (3 repetições), não benchmark do parse JavaScript isolado: '+str(perf[0]['python_parse_seconds'])+'. Chrome mede tempo do cenário e ResourceTiming, sem separar parse/GC de renderização.\n\nOtimizações implementadas: JSON compacto, remoção de duplicação de resumos internos mantendo acervo, comparação profunda sem duas serializações gigantes e hash de planilha calculado uma vez por fonte. Gráficos continuam criados por eixo. Mapas quantitativos sem evidência não são renderizados. Lazy loading de payload por eixo, cache persistente e alteração da estratégia inline são propostas futuras que mudam arquitetura e exigem autorização. Desempenho móvel continua ressalva; emulação não dispositivo físico.')
vm=read(OUT/'testes-final/resultados.json');external=read(OUT/'testes-reproducao-externa.json')
md('testes.md',f'''# Testes e limites

- Integridade: PASS, {integrity['checks_count']} invariantes, {integrity['protected_files']} arquivos brutos/auditorias anteriores com SHA preservado. `app.js` preservado byte a byte. Package = fallback = GT/registry e fingerprint do payload. Geometrias preservadas; isso não homologa origem/classificação.
- Fontes novas: PASS, {source_tests['checks_count']} verificações, {source_tests['ideb_cells']} células IDEB e {source_tests['censo_tables']} tabelas Censo relidas nas planilhas oficiais. SIDRA, identificação municipal SSP, períodos, contagens e cálculo documental Saúde conferidos. Não extrapolar para famílias ainda pendentes.
- Reprodução P1–P3: {', '.join(r['test']+' '+r['status'] for r in external)}. Executados blocos de releitura externa/células/fórmulas dos testes históricos; asserts antigos de igualdade com outros eixos deliberadamente não são reprodução externa. Todos os hashes dos stores foram conferidos no diagnóstico inicial.
- Node VM/DOM simulado: {sum(r['exit_code']==0 for r in vm)} de {len(vm)} suites passaram. Ver logs em `testes-final/`. P0 legado falha porque exige Chart.data para gráficos sem comprovação que estão em fallback; o stub também não reproduzia parentNode antes do guard. Não reativar ar/fatalidades para tornar teste verde. Dois helpers cjs invocados sem fixture no baseline eram chamadas inválidas, não regressões válidas do produto.
- Chrome real headless: {browser['status']}, desktop online, fallback offline e viewport móvel 375×812 em rede limitada. Navegação dos oito eixos, Chart.js real, cartões vinculados e exportação JSON/CSV. 122 indicadores, 34 valores null, competência completa (incluindo período parcial) e URL preservadas; zero meses de bilhetagem após corte com valor. Sem screenshots.

Chrome executou uma fixture do DOM Radar Hub com controller e módulos visuais reais. `app.js`, login, Supabase e outros módulos da aplicação não foram executados; não se trata de E2E completo. Offline foi ativado depois de carregar bibliotecas/assets: prova fallback do package, não primeira visita totalmente offline nem disponibilidade offline de CDN. Viewport e throughput são emulados; falta aparelho físico/rede móvel real. Recursos remotos de mídia foram retirados somente da fixture de teste, não da aplicação.

Links: URLs oficiais nos exports/registry, HTTP/content-type e SHA registrados nas coletas executadas. Não foi clicada individualmente toda URL antiga nem validado cada destino de ficha técnica no login completo. Fichas e exportações verificadas no contrato do módulo; overlays e map fallback analisados, mapa quantitativo suspenso. Logs de rede incluem falhas esperadas no offline e recursos de fixture (como favicon); ausência de Runtime.exceptionThrown não equivale a zero logs de console.

Resultados reproduzíveis: `testes-integridade-final.json`, `testes-fontes-novas.json`, `testes-reproducao-externa.json`, `testes-chrome-real.json`, `testes-final/resultados.json`. Não há homologação derivada de PASS.
''')
md('funcionalidades-preservadas-corrigidas.md','''# Funcionalidades preservadas e corrigidas

Preservados: navegação dos oito eixos; canvases/funções existentes; séries comprovadas P1/P2/P3; exportação JSON/CSV com BOM, escaping, competência, unidade, fonte e status; filtros e módulos visuais de Economia/Finanças; stores e relatórios anteriores; geometrias; dados de frota/ANAC e séries históricas válidas; suspensões P3/P4.

Corrigidos: cartões hardcoded passam a usar registry; rede/etapa e metas do IDEB; matriz real de matrículas por rede; escolarização não mistura com fluxos estimados; taxa de homicídio aceita chave nativa e não produz NaN; gráfico rotulado por ocorrências; suspensões de gráficos demográficos/segurança/benchmark sem prova; erro de parentNode em fallback; exportação prioriza a competência completa em todos os eixos, sem perder recortes parciais; status indevidamente promovidos; bilhetagem com colunas perdidas; igualdade package/inline; write atômico com alternativa nativa para OneDrive; nulidade nas composições sem prova.

Não foi feito redesenho. Exibir fallback onde faltam dados é correção de integridade, não remoção da função. Qualidade de usabilidade de P1.1/P2.1 ainda precisa de revisão específica. Funções não executadas, embora preservadas, não recebem certificado funcional. `dependencias.json` relaciona scripts, fetches, funções e canvases do estado inicial.
''')
md('pendencias-metodologicas.md','''# Pendências para revisão humana

1. P4 segue aceita para continuidade, não homologada. Validar parser de bilhetagem em todos os layouts e recortes ANAC; conservar overrides/ausências; dispositivos físicos e primeira carga offline/CDN ainda não testados.
2. Demografia: procedência/escala dos 35 polígonos, crosswalk IBGE, cobertura territorial e classificação; estimativas 2024/2026 e urbanização sem versão primária compatível permanecem suspensas. Não transferir população municipal para cada setor.
3. Saúde: obter CNES completo por competência/universo, numeradores e denominadores compatíveis da mortalidade infantil, vias de parto, vacinação ausente, lacunas dengue 2019–2023 e distinguir semana epidemiológica/ano. Documentos SMS comprovam o que está impresso, não uma extração independente atual do DATASUS.
4. Segurança: vítimas distintas de ocorrências, rubricas veiculares e zeros-placeholder, CSI/DEIC/prisões/ranking sem prova. Não produzir cálculo de taxa com denominador reconstruído a partir de arredondamento.
5. Educação: históricos municipais de matrículas/rendimento/distorção/infraestrutura por rede e etapa ainda não concluídos para todos os anos; Censo 2023 não prova infraestrutura atual. Docentes por etapa podem duplicar pessoas. Escola/estabelecimento/funcionamento e matrícula/aluno são conceitos distintos. IDEB ensino médio/SAEB e residência de alunos precisam fontes próprias.
6. Finanças: resultado orçamentário não é saldo de caixa, superávit financeiro, resultado primário ou nominal. Preservar fases da despesa, total com intra e 2026 parcial. Economia: não estimar componentes PIB ausentes nem juntar universos CEMPRE/CAGED.
7. Meio Ambiente: quebras SNIS/SINISA, população/território/estação e edição do satélite. Snapshots de ar não preenchem médias anuais.
8. Performance: duas cópias volumosas no carregamento, primeira visita offline e custo real em dispositivo móvel/produção. Proposta de dados por eixo ainda exige autorização por alterar arquitetura.
9. P0 legado precisa contrato atualizado para fallbacks suspensos; suites antigas não constituem aceite desta consolidação. Login completo, fichas técnicas clicadas individualmente e endpoints históricos mudando no servidor continuam fora da verificação integral.
10. Arquivos brutos nacionais/ZIP/evidence stores antigos pesados permanecem locais e em manifests; para reprodução em outro clone, recuperá-los com SHA igual. Quando o órgão substituir edição sem arquivo histórico, registrar indisponibilidade; nunca aceitar automaticamente hash novo.

Nenhuma pendência autoriza preencher lacunas. Esta entrega não inicia P5.1, Saúde nova, redesenho ou deploy. Revisão humana é a próxima etapa.
''')
md('reproducao.md','''# Reprodução e verificação

Executar no diretório do repositório. Python 3.12; requests, python-calamine, openpyxl, xlrd e pypdf; websocket-client para Chrome CDP. Node para suites VM; Chrome instalado para navegador. Versões desta execução: requests 2.34.2, python-calamine 0.8.2, openpyxl 3.1.5, xlrd 2.0.2, pypdf 6.18.0, websocket-client 1.9.0. Coletas usam curl/TLS padrão; nenhum certificado foi desativado. Algumas fontes INEP foram recuperadas por HTTP oficial após falha HTTPS; hash e URL de catálogo HTTPS permanecem registrados.

Verificar entrega, sem reconciliar de novo:

```powershell
python -X utf8 scripts/consolidacao_integridade.py
python -X utf8 scripts/consolidacao_fontes_tests.py
python -X utf8 scripts/consolidacao_external_tests.py
$env:RADAR_TEST_PHASE='nova-verificacao'
python -X utf8 scripts/consolidacao_runtime_tests.py
python -X utf8 scripts/consolidacao_browser_test.py
```

Arquivos fonte necessários estão em `fontes-externas/manifest.json`, `manifest-evidence-stores.json` e `inventario.json`. O ZIP AI 2025 fica em `data/radar_hub/educacao_raw_2026-10-08/ideb-iniciais2025.zip`; demais novos nacionais na rodada. Não mudar nome/coluna/edição sem nova auditoria. Verificar SHA antes de extrair. O recorte municipal contém raw_value, célula, sheet, rede, etapa e unidade. SIDRA sexo exige `/c287/100362`, não `/c287/0`.

Pipeline de migração usado nesta operação, para estudo a partir do snapshot inicial numa cópia isolada:

1. `consolidacao_snapshot.py` antes de qualquer mutação; `consolidacao_diagnostico.py`.
2. Coletores `consolidacao_fontes.py`, `consolidacao_sidra.py`, catálogos Educação e downloads oficiais registrados. Alguns downloads/complementos foram feitos via curl diretamente e têm manifest; não alegar que um único coletor baixa tudo.
3. `consolidacao_educacao_extract.py`, `consolidacao_censo_extract.py`.
4. `consolidacao_reconciliar.py`, `consolidacao_quarentena.py`, `consolidacao_runtime_patch.py`, `consolidacao_evidence_overlay.py`.
5. `generate_geo_bundle.py`, `build_radar_hub_package.py` e verificações acima.

Não aplicar automaticamente snapshots antigos sobre o workspace atual. Scripts de migração registram antes/depois; para uma nova auditoria, criar uma nova rodada isolada e conferir dependências. Todos selecionam o diretório `20*` mais recente: não executar auditorias concorrentes. A reexecução de coletores pode atualizar respostas na nova rodada; igualdade de hash é requisito da reprodução histórica, não pressuposto.

`saude_documental_20261002.py` é cálculo em memória com modelo preservado e layout derivado do PDF oficial, sem escrita do GT. Os arquivos `.before` são modelos legados, não evidências primárias. `consolidacao_preservar_saude.py` é migração histórica que depende do temporário inventariado; não é necessário para verificar a entrega pois cálculo/modelos já estão preservados. Layout pode ser reextraído do PDF com pdftotext -layout; comparar conteúdo/totais/versão.

Aplicadores antigos de P1–P4 foram mantidos por rastreabilidade; alguns repõem snapshots de outros eixos. Não executá-los cegamente no estado consolidado. Os testes externos recortam somente os blocos de reprodução primária. O browser cria fixture e perfil temporário próprios, sem screenshots, login ou deploy.
''')
# Lista apenas diferenças em arquivos de aplicação e scripts, separando acervo de coleta.
altered=[]
paths={ROOT/r for r in orig if r in ['.gitignore','app.html','app.js','radar_hub_controller.js'] or r.startswith('data/radar_hub/') and '/' not in r[len('data/radar_hub/'):] or r.startswith('scripts/')}
paths.update(ROOT.glob('scripts/consolidacao*'));paths.update([ROOT/'scripts/saude_documental_20261002.py']);paths.update(BASE.glob('consolidacao*'));paths.update(BASE.glob('*20261008*'));paths.update((BASE/'saude_documental_modelo_20261008').glob('*'))
for p in sorted(paths):
 if not p.is_file():continue
 rel=p.relative_to(ROOT).as_posix();sha=hashlib.sha256(p.read_bytes()).hexdigest();b=orig.get(rel)
 if b and b['sha256']==sha:continue
 altered.append({'path':rel,'before_sha256':b.get('sha256') if b else None,'after_sha256':sha,'bytes':p.stat().st_size,'kind':'alterado nesta operação' if b else 'novo','note':'Mudanças prévias ao snapshot permanecem fora desta lista; status inicial preservado.'})
dump('arquivos-alterados.json',altered)
md('arquivos-alterados.md','# Arquivos alterados após o snapshot\n\nLista de fontes/artefatos da aplicação comparada por SHA ao estado inicial desta operação. Modificações preexistentes do usuário estão no status/diff inicial e não são atribuídas a esta consolidação. Documentação e novos brutos da rodada são acervo adicional em inventário/manifest. `.tmp`/perfis são artefatos de execução, não entradas de runtime.\n\n| Caminho | Tipo | Bytes finais |\n|---|---|---|\n'+'\n'.join('| '+r['path']+' | '+r['kind']+' | '+str(r['bytes'])+' |' for r in altered)+'\n\n`app.js` não consta como alterado após o snapshot: SHA inicial/final 3063186d953be5055dae85f6b3371342922bed66249bd5387215bc8d5b0f9934. Não houve commit, push ou deploy nesta operação. Inclusões no índice Git estão em `versionamento.json`.')
md('relatorio-final.md',f'''# Radar São José — consolidação técnica para revisão humana

Data: 08/10/2026. Município IBGE 3549904. Versão ativa: `{pkg['dataset_version']}`. **Integração técnica entregue; homologação dos dados não realizada.** Os oito eixos navegam no módulo isolado testado. Nenhum PASS transforma ausência em zero ou indicador suspenso em confirmado.

A revisão encontrou melhorias concretas além dos cortes de 2023/2024: IDEB até 2025 em 11 ciclos, 165 tabelas do Censo Escolar 2023, série SSP 2001–2025 e preservação das séries longas P1–P4. Persistem lacunas por família que estão na matriz de oportunidades; não foram completadas por interpolação.

## Resultado principal

- Package, ground truth, registry e fallback agora têm payload coerente e fingerprint verificável. Foram restaurados os bindings/status de P1–P4 contra promoções indevidas posteriores.
- Bilhetagem: 42 valores de total/média haviam virado meses futuros; foram suspensos, com store histórico intacto e override explícito. Óbitos/perfil/motorização seguem suspensos. P4 não recebeu homologação.
- Educação: total 2023 corrigido para 163.965 matrículas, redes e etapas separadas. IDEB público 2025 6,9/5,7; escolarização 99,09% é residentes 6–14 anos, Censo 2022, não matrícula. Metas somente nos ciclos publicados até 2021.
- Saúde: restaurados totais documentais SINASC/SIH, taxas SMS e dengue com período parcial; CNES sem extração municipal compatível permanece suspenso. Segurança: ocorrências e vítimas separadas. Demografia: 10 KPIs SIDRA conferidos; composição/setores sem crosswalk ficam sem valor quantitativo.
- Economia, Finanças e Meio Ambiente: valores/GT comprovados anteriores preservados. PIB nominal, fases da despesa e quebras metodológicas explicitados. Resultados orçamentários 2023 e 2024 continuam déficits no conceito reconciliado, não superávit alegado em auditoria global posterior.
- Package caiu de 35.842.381 para {perf[0]['bytes']} bytes em disco (cerca de {(1-perf[0]['bytes']/35842381)*100:.1f}%). Carregamento duplicado package+inline ainda pesa; compressão de produção não foi medida.

## Entregáveis

1. Diagnóstico inicial: [consistência](consistencia-inicial.json), [matriz inicial](matriz-inicial.json), status/diff/branches/commits.
2. Inventário: [trabalhos](inventario-trabalhos.md), [4.278 arquivos com hashes](inventario.json), snapshot selecionado e seu manifest.
3. [Matriz dos oito eixos](matriz-consolidacao.md) e JSON com sete critérios separados.
4. [Divergências e decisões](divergencias.md).
5. [Antes/depois dos 122 indicadores](antes-depois-indicadores.md), JSON, journal de reconciliação e quarentena auxiliar.
6. [Arquitetura canônica e regras de resolução](arquitetura-canonica.md).
7. Package e fallback coerentes: resultado de integridade e versão acima.
8. [Reprodução](reproducao.md), scripts selecionados no Git e `versionamento.json`.
9. [Testes](testes.md), resultados/logs externos, VM e Chrome.
10. [Desempenho](desempenho.md), bytes de disco, gzip estimado e ResourceTiming real local.
11. [Funcionalidades preservadas](funcionalidades-preservadas-corrigidas.md).
12. Correções funcionais no mesmo documento, sem redesenho.
13. [Pendências metodológicas](pendencias-metodologicas.md).
14. [Arquivos alterados](arquivos-alterados.md), com hashes antes/depois.
15. Este relatório e [cobertura histórica](matriz-cobertura-historica.md), [oportunidades](matriz-oportunidades.md), evidence stores e manifests de brutos.

## Validação e limites do aceite

Integridade PASS: {integrity['checks_count']} verificações e {integrity['protected_files']} arquivos anteriores preservados. Fontes novas PASS: {source_tests['checks_count']} verificações; P1–P3 reprodução externa PASS. Node VM: {sum(r['exit_code']==0 for r in vm)}/{len(vm)} suites, com falha legada P0 explicitada. Chrome real: três cenários PASS. Offline significa fallback após bibliotecas carregadas, não instalação offline inicial. Móvel é viewport emulado, não telefone físico. O teste não executou `app.js`/login completo. Mapas sem agregação comprovada ficaram em fallback; sua geometria preservada não é homologação cartográfica.

`app.js` preservado byte a byte; auditorias/brutos anteriores não sobrescritos; sem exclusão de funcionalidades, screenshots ou deploy. Arquivos Git preexistentes modificados foram conservados. Stores pesados/nacionais permanecem fora do carregamento inicial e são recuperáveis por arquivos locais/manifests e SHA; disponibilidade futura de uma URL não é garantida.

O aceite solicitado agora é revisão humana desta versão, inclusive indicadores suspensos, limitações de teste, cobertura e performance. A operação termina aqui. Não iniciar P5.1, novas funcionalidades, redesenho ou deploy sem autorização.
''')
md('prompt-proxima-ia.md','''# Prompt para a IA revisora

Revise a consolidação do Radar São José de 08/10/2026, IBGE 3549904. Comece lendo relatorio-final.md, matriz-consolidacao.json, divergencias.md, antes-depois-indicadores.json, pendencias-metodologicas.md e testes.md desta rodada. Confirme o fingerprint em consolidacao_status/registry/package e examine a evidência externa, não apenas a UI nem alegações de outras IAs.

Preserve app.js, fontes e auditorias anteriores. Não deploy, screenshots, redesenho, interpolação, null→zero ou promoção de suspensos. Para bilhetagem, o override por evidence ID prevalece sobre o store P4 histórico; não usar TOTAL/MÉDIA como mês. P4 não está homologada. Diferencie ocorrência/vítima, APS/ESF, residência/local de atendimento, matrículas/alunos, rede/etapa, IDEB/SAEB, escolarização/matrícula e despesa empenhada/liquidada.

Refaça os testes de reprodução indicados, informe o que é VM e Chrome real e não apresente fixture do módulo como E2E do login. Revise as sete dimensões de cada eixo sem um status único PRONTO. Proponha primeiro as expansões históricas da matriz-oportunidades, com URL, edição, competência, unidade, definição, município, metodologia, bruto/hash e procedimento por indicador. Catálogo disponível não é série já comprovada. Não iniciar expansão nem mudança substancial da arquitetura antes da autorização humana correspondente. Entregue divergências sustentadas por fontes e um parecer de aceite com ressalvas explícitas.
''')
print('Documentos da consolidação gerados:',OUT)
