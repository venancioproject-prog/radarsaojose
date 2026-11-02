"""Relatórios P2 A–L, inventários, oportunidades e cobertura factual."""
import csv, hashlib, json, re, subprocess, unicodedata
from collections import defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=ROOT/'docs/dados-publicos-revisao/p2-financas'
def read(p):return json.loads(p.read_text(encoding='utf8'))
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def norm(s):return ''.join(c for c in unicodedata.normalize('NFD',s) if not unicodedata.combining(c)).lower()
def table(rows):
    if not rows:return 'Nenhum registro.\n'
    keys=list(rows[0]);cell=lambda v:str(v if v is not None else 'null').replace('|','\\|').replace('\n',' ')
    return '| '+' | '.join(keys)+' |\n|'+ '|'.join('---' for k in keys)+'|\n'+'\n'.join('| '+' | '.join(cell(r.get(k)) for k in keys)+' |' for r in rows)+'\n'
def csvsave(name,rows):
    with (OUT/name).open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
store=read(BASE/'financas_evidence_2026-10-05.json');pkg=read(BASE/'radar_hub_package.json');snap=read(OUT/'snapshot-inicial.json');audit=read(OUT/'matriz-indicadores-final.json');emap={e['evidence_id']:e for e in store['evidences']};logs=store['source_accesses'];access={a['name']:a for a in logs if a.get('status_code')==200}
beforecode=(OUT/'radar_hub_controller.js.before').read_text(encoding='utf8');beforehtml=(OUT/'app.html.before').read_text(encoding='utf8');fa=beforehtml.index('<div id="hub-axis-container-financas"');fb=beforehtml.index('<!-- EIXO: BENCHMARK',fa);financehtml=beforehtml[fa:fb]
inventory=[]
for i in snap['indicators']:
    inventory.append({'ID':i['indicator_id'],'Indicador':i['name'],'Valor':i['value'],'Período':i['base_year'],'Unidade':i['unit'],'Fonte cadastrada':i['source_system']+'; '+i['official_url'],'Status':i['audit_status'],'Evidência antiga':json.dumps(i.get('evidencia'),ensure_ascii=False),'Consumido pela UI?':'Ficha técnica por ID' if i['indicator_id'] in financehtml else 'Campo legado correspondente; não por ID direto'})
save(OUT/'inventario-inicial.json',inventory);csvsave('inventario-inicial.csv',inventory);(OUT/'inventario-inicial.md').write_text(table(inventory),encoding='utf8')

# Cobertura por série nativa (não conta cada linha como um período diferente).
groups=defaultdict(list)
for family,rows in store['series'].items():
    for r in rows:groups[(family,r['statement'],r['classification'],r['label'],r['stage'],r['unit'],r['break_segment'] if family=='receita_dca_natureza' else 'estágio/taxonomia nativos')].append(r)
coverage=[]
for (family,statement,code,label,stage,unit,segment),rows in sorted(groups.items()):
    good=[r for r in rows if r['value'] is not None];periods=sorted({(r['exercise'],r['period_number']) for r in good});allperiods=sorted({(r['exercise'],r['period_number']) for r in rows});freq=emap[rows[0]['evidence_id']]['frequency'];step=1 if freq=='Anual' else (6 if freq=='Bimestral' else 3)
    gaps=[]
    if periods:
        indices={y*step+(n-1) for y,n in periods}
        gaps=[str(n//step)+(f'-P{n%step+1}' if step!=1 else '') for n in range(min(indices),max(indices)+1) if n not in indices]
    coverage.append({'Série':label,'Família':family,'Demonstrativo':statement,'Classificação':code,'Estágio':stage,'Unidade':unit,'Início':good[0]['competence'] if good else None,'Fim':good[-1]['competence'] if good else None,'Frequência':freq,'Observações':len(periods),'Lacunas':'; '.join(gaps) or 'Sem lacunas internas nas observações selecionadas; contas omitidas não inferidas como zero','Quebras':segment,'Fonte':emap[rows[0]['evidence_id']]['url'],'Evidência inicial':good[0]['evidence_id'] if good else rows[0]['evidence_id']})
save(OUT/'series-historicas.json',coverage);csvsave('series-historicas.csv',coverage)

# Inventário de oportunidades: definição e filtro transparentes, sem escolher desenho.
specs=[
 ('Receita realizada consolidada','resumo_rreo',r'^receitas realizadas$','Mesma linha do balanço; inclui intraorçamentárias. Separar total e receitas exceto intra.','Quanto é arrecadado?'),
 ('Previsão inicial/atualizada','resumo_rreo',r'^previsao (inicial|atualizada)$','Comparar previsão com realizado do mesmo balanço.','Quanto foi previsto e realizado?'),
 ('Receitas correntes e de capital','receita_dca_natureza',r'- receitas (correntes|de capital)$','Preservar receitas brutas, deduções e intra; classificação muda.','Qual a natureza da receita?'),
 ('Receita tributária','receita_dca_natureza',r'receita tributaria|impostos, taxas e contribuicoes de melhoria','Não usar toda receita corrente como própria; nomenclatura/códigos mudam.','Qual a participação tributária?'),
 ('IPTU','receita_dca_natureza',r'imposto sobre a propriedade predial','Abertura por principal, multas, juros e dívida ativa pode mudar.','Quanto entra de IPTU?'),
 ('ISS','receita_dca_natureza',r'imposto(s)? sobre servicos','Não somar conta agregada e seus filhos.','Quanto entra de ISS?'),
 ('ITBI','receita_dca_natureza',r'transmissao.*inter|transmissao.*bens','Mudanças de natureza: preservar segmentos.','Quanto entra de ITBI?'),
 ('IRRF','receita_dca_natureza',r'imposto sobre a renda.*retido na fonte','Conta pai e filhos não podem ser somados.','Quanto entra de IRRF?'),
 ('Taxas','receita_dca_natureza',r'- taxas','Não somar subtotal e componentes.','Qual a arrecadação de taxas?'),
 ('Transferências correntes','receita_dca_natureza',r'- transferencias correntes$','Brutas e deduções FUNDEB separados.','Quanto vem de transferências?'),
 ('FPM','receita_dca_natureza',r'cota-parte.*participacao dos municipios','Preservar bruto e dedução, sem empilhar pai/filhos.','Qual a receita de FPM?'),
 ('ICMS','receita_dca_natureza',r'cota-parte.*icms','Dedução FUNDEB separada.','Quanto vem de ICMS?'),
 ('IPVA','receita_dca_natureza',r'cota-parte.*ipva','Dedução FUNDEB separada.','Quanto vem de IPVA?'),
 ('SUS','receita_dca_natureza',r'sistema unico de saude','Não agrupar transferências correntes/capital sem definição.','Quais transferências financiam Saúde?'),
 ('FUNDEB','receita_dca_natureza',r'manutencao.*desenvolvimento.*educacao basica','Não confundir receita do fundo com MDE nem com deduções para o fundo.','Quanto entra do FUNDEB?'),
 ('Despesa empenhada/liquidada/paga','resumo_rreo',r'^despesas (empenhadas|liquidadas|pagas)$','Mesma abrangência, três estágios; não somar estágios.','Quanto foi comprometido, liquidado e pago?'),
 ('Dotação inicial/atualizada','resumo_rreo',r'^dotacao (inicial|atualizada)$','Autorização não é gasto.','Quanto foi autorizado?'),
 ('Despesa por função','despesa_dca_funcao',r'^\d{2} - ','Usar funções oficiais, um estágio por comparação; intra separadas.','Para onde vai o dinheiro?'),
 ('Função Saúde','despesa_dca_funcao',r'^10 - saude$','Não equivale a aplicação constitucional ASPS.','Quanto foi gasto na função Saúde?'),
 ('Função Educação','despesa_dca_funcao',r'^12 - educacao$','Não equivale a MDE.','Quanto foi gasto na função Educação?'),
 ('ASPS constitucional','resumo_rreo',r'acoes e servicos publicos de saude','Percentual/base do demonstrativo; não despesa por função.','Qual a aplicação ASPS publicada?'),
 ('MDE constitucional','resumo_rreo',r'manutencao e desenvolvimento do ensino','Mudanças no demonstrativo/FUNDEB: não comparar todas as linhas indiscriminadamente.','Qual a aplicação MDE publicada?'),
 ('Pessoal Executivo / RCL','pessoal_rgf',r'despesa total com pessoal','Valor absoluto de 2025 Q3 suspenso; razão publicada 26,99% coincide nas duas fontes.','Quanto é gasto com pessoal no Executivo?'),
 ('RCL e RCL ajustada','pessoal_rgf',r'receita corrente liquida','Finalidade da RCL ajustada precisa ser preservada (pessoal/endividamento).','Qual a base fiscal para os limites?'),
 ('Limites de pessoal','pessoal_rgf',r'limite (maximo|prudencial|de alerta)','Somente parâmetros publicados, sem declarar irregularidade.','Quais limites foram publicados?'),
    ('Dívida consolidada e líquida','divida_rgf',r'^divida consolidada','Estoque na posição; não somar quadrimestres nem DC com DCL. DC/DCL 2025 Q3 suspensas por diferença API/PDF.','Como evoluiu a dívida?'),
 ('DCL/RCL','divida_rgf',r'% da dcl','Razão publicada com RCL ajustada do demonstrativo.','Qual a relação DCL/RCL publicada?'),
 ('Caixa e restos a pagar','caixa_restos_rgf',r'.*','Comparar totais no mesmo momento e escopo; caixa antes/depois de RP separados.','Qual a disponibilidade de caixa?'),
 ('Restos a pagar processados/não processados','resumo_rreo',r'^restos a pagar','Saldo, inscrição, pagamento e cancelamento separados.','Quanto permanece a pagar?'),
 ('Investimentos GND 4','despesa_dca_natureza',r'- investimentos$','GND 4, três estágios; não qualquer gasto chamado investimento.','Quanto foi aplicado em investimentos?'),
 ('Serviço da dívida','despesa_dca_natureza',r'juros e encargos da divida|amortizacao da divida','Componentes separados; somar apenas se demonstrada mesma abrangência.','Quanto foi pago em juros e amortização?'),
 ('Crédito e garantias','credito_rgf',r'operacoes de credito','Linhas ausentes não são zero; limites disponíveis não provam operação realizada.','Quais operações e limites são publicados?'),
 ('Resultado primário e nominal','resumo_rreo',r'resultado (primario|nominal)','Método acima/abaixo da linha e RPPS preservados; não resultado orçamentário.','Quais resultados fiscais são publicados?')]
opps=[]
for title,family,pattern,note,question in specs:
    rows=[r for r in store['series'][family] if re.search(pattern,norm(r['label']))];valid=[r for r in rows if r['value'] is not None]
    dates=sorted({r['competence'] for r in valid});units=sorted({r['unit'] for r in valid});stages=sorted({r['stage'] for r in valid});status='DISPONIVEL_COM_LIMITACAO' if valid else 'NAO_ENCONTRADO'
    opps.append({'Indicador':title,'Fonte':'Tesouro Nacional — SICONFI / FINBRA','Primeiro período':dates[0] if dates else None,'Último período':dates[-1] if dates else None,'Frequência':emap[rows[0]['evidence_id']]['frequency'] if rows else None,'Estágio':'; '.join(stages),'Unidade':'; '.join(units),'Municipal?':'SIM — 3549904','Comparável?':'Sob o mesmo conceito, estágio e segmento; ver limitação','Evidência':rows[0]['evidence_id'] if rows else None,'Recomendação':note,'Status':status,'Observações extraídas':len(valid),'Períodos distintos':len(dates),'Pergunta P2.1':question})
for title,formula,question in [('Resultado orçamentário','receita realizada − despesa empenhada','Qual o resultado do balanço orçamentário?'),('Realização da receita','realizada / previsão atualizada × 100','Quanto da previsão atualizada foi realizado?'),('Empenho, liquidação e pagamento sobre dotação','cada estágio / dotação atualizada × 100','Quanto foi empenhado, liquidado e pago da dotação?')]:
    opps.append({'Indicador':title,'Fonte':'RREO, mesmos demonstrativo/competência/abrangência','Primeiro período':'2015','Último período':'2026-RREO-B4, parcial','Frequência':'Anual, com 2026 parcial separado','Estágio':formula,'Unidade':'%' if '/' in formula else 'BRL','Municipal?':'SIM — 3549904','Comparável?':'Não comparar período parcial com anos completos sem ressalva','Evidência':store['budget_annual'][0]['evidence_ids']['receita_realizada'],'Recomendação':'Cálculo reproduzível já armazenado; valores correntes; não benchmark','Status':'CALCULAVEL_COM_FONTES_OFICIAIS','Observações extraídas':12,'Períodos distintos':12,'Pergunta P2.1':question})
for title,status,note in [('Receitas/despesas/investimento per capita','NAO_VERIFICADO','Não calculado: depende da população com fonte e período compatíveis; Demografia não homologada.'),('Valores reais/deflacionados','NAO_VERIFICADO','Oportunidade futura, condicionada a metodologia humana e deflator autorizado.'),('FINBRA anterior a 2013','DISPONIVEL_COM_LIMITACAO','Arquivo oficial 2012 MDB preservado. Não normalizado ou concatenado à DCA/PCASP.'),('MSC mensal','DISPONIVEL_COM_LIMITACAO','Extrato mostra matrizes entregues. Extração/mapeamento contábil da MSC não concluídos; não afirmar que existe série mensal de caixa/orçamento já validada.'),('Garantias concedidas','NAO_VERIFICADO','Dados brutos RGF preservados; nenhuma série de garantias foi selecionada/validada no evidence store.'),('IEG-M B+ legado','NAO_VERIFICADO','Indicador de avaliação, não grandeza contábil. Valor apresentado foi suspenso por falta de evidência específica.')]:
    opps.append({'Indicador':title,'Fonte':'Tesouro Nacional / TCESP, conforme item','Primeiro período':None,'Último período':None,'Frequência':None,'Estágio':None,'Unidade':None,'Municipal?':'Ente 3549904; disponibilidade depende do item','Comparável?':'Não demonstrado nesta rodada','Evidência':'finbra-legado-2012.zip / siconfi-entregas-*.json' if title in ['FINBRA anterior a 2013','MSC mensal'] else None,'Recomendação':note,'Status':status,'Observações extraídas':0,'Períodos distintos':0,'Pergunta P2.1':'Decisão metodológica prévia; não visualizar como dado confirmado'})
save(OUT/'matriz-oportunidades-financas.json',opps);csvsave('matriz-oportunidades-financas.csv',opps);(OUT/'matriz-oportunidades-financas.md').write_text(table(opps),encoding='utf8')

decisions=[{'ID':a['id'],'Indicador':a['name'],'Antes':a['before'],'Depois':a['after'],'Exercício':a['exercise'],'Conceito':a['concept'],'Estágio':a['accounting_stage'],'Fonte':emap[a['evidence_id']]['url'],'Evidência':a['evidence_id'],'Decisão':a['decision']} for a in store['indicators']]
csvsave('reconciliacao-indicadores.csv',decisions)
sources=[{'Nome':a['name'],'URL efetiva':a.get('url',a['requested_url']),'Consulta':a['accessed_at'],'HTTP':a.get('status_code',a.get('error')),'Registros':a.get('items'),'Bruto':a.get('raw_file'),'SHA-256':a.get('sha256')} for a in logs]
csvsave('fontes-consultadas.csv',sources)
familyrows=[]
for name,rows in store['series'].items():
    ds=sorted({r['competence'] for r in rows});good=[r for r in rows if r['value'] is not None]
    familyrows.append({'Série/família':name,'Início':ds[0],'Fim':ds[-1],'Frequência':emap[rows[0]['evidence_id']]['frequency'],'Observações válidas':len(good),'Períodos':len(ds),'Lacunas/Quebras':'Ver series-historicas.csv; estágios e taxonomias nativos; 2026 parcial','Fonte':'SICONFI / FINBRA'})

report='''# P2 — Auditoria externa, reconciliação e expansão de Finanças

Rodada: 05/10/2026. Município: São José dos Campos/SP, IBGE 3549904. Auditoria concluída para os oito indicadores antigos; revisão humana pendente. Sem deploy, redesign, gráficos novos, P2.1 ou screenshots.

## A. Estado inicial

O pacote inicial era `DATASET_INITIAL`. Foram encontrados oito indicadores cadastrados, todos marcados CONFIRMADO, mas com evidências textuais e links que não comprovavam os valores. O inventário completo está em `inventario-inicial.md/.csv/.json`; o snapshot também preserva os demais eixos, o cadastro e as séries antigas.

Problemas: valores de 2023 com trecho de 2024; receita 2024 no cadastro de R$ 4,210 bilhões e no campo alternativo de R$ 4,448 bilhões; ISS cadastrado em R$ 842 milhões enquanto o trecho citava R$ 548,05 milhões; série 2018–2024 com números arredondados sem extração reproduzível; “superávit” calculado contra liquidado; função Saúde/Educação confundida com aplicação ASPS/MDE; agrupamentos de funções e receitas sem prova; texto estático declarando equilíbrio e classificação IEG-M B+ sem vínculo documental.

Fallback: pacote inline atômico igual ao JSON, não fonte independente. Consumo inicial: quatro gráficos fiscais (série, funções, receitas e limites), quatro cards e quatro blocos fiscais estáticos. O IEG-M era exibido sem constar entre os oito indicadores: foi investigado como componente extra e suspenso.

## B. Fontes consultadas

Consultados diretamente: API SICONFI (DCA, RREO, RGF e extrato de entregas), documentação Swagger/YAML, tabelas oficiais de fatos DCA/RREO/RGF, TCESP (documentação API, catálogo de municípios, painéis e arquivos CSV anuais), Portal da Transparência municipal (formulário com exercício/assunto e PDFs fiscais de 2023–2025 e 2026 B4), FINBRA histórico 2012 (MDB oficial), PDFs municipais legados 2012.

Todos os endpoints, parâmetros, horários, respostas e hashes estão no `source_accesses` do evidence store e em `fontes-consultadas.csv`. Brutos em `data/radar_hub/financas_raw_2026-10-05/`. A API usa IBGE 3549904; o TCESP usa `sao-jose-dos-campos`, vinculado pelo seu catálogo municipal. O PDF identifica Prefeitura/Poder Executivo, CNPJ municipal e exercício. Legislativo não foi misturado ao RGF Executivo.

Fontes principais efetivamente abertas:

'''.replace('DATASET_INITIAL',snap['dataset_version'])
for key in ['api-layout','dca-2023','dca-2025','rreo-2023-6','rreo-2024-6','rreo-2025-6','rreo-2026-4','rgf-2023-3','rgf-2025-3','rgf-2026-2','tce-painel-2023','tce-painel-2024','prefeitura-rreo-2026-4','finbra-legado-2012']:
    a=access[key];report+=f'- [{key}]({a["url"]}) — consultado em {a["accessed_at"]}.\n'
report+='''
As tentativas HTTP 429 foram registradas e os períodos refeitos com sucesso; o coletor passou a respeitar uma requisição/segundo para o Tesouro. Uma URL inicial do FINBRA retornou 404: foi substituída pelo caminho oficial de publicações, com arquivo obtido e preservado. Consultas vazias de DCA 2011/2012 e RREO/RGF 2013/2014 não foram transformadas em observações zero. Não há prova de inexistência universal: apenas de ausência nessas consultas.

## C. Reconciliação dos indicadores antigos

'''+table(decisions)+'''
Todos os IDs antigos foram mantidos. O ID técnico `fin_superavit_orcamentario_2023` permanece por compatibilidade, mas seu nome mudou para resultado orçamentário, com sinal e fórmula explícitos. Não se preservou o conceito incorreto de receita menos liquidado. Conversões BRL → R$ milhões têm evidências próprias e status de cálculo, sem arredondar a base.

**Abrangência explica parte dos números alternativos:** R$ 4.448.762.563,03 de receita e R$ 4.420.754.600,30 de despesa liquidada de 2024 são reais na fonte, mas EXCLUEM intraorçamentárias. Os totais consolidados incluindo intra são R$ 4.809.505.913,62 e R$ 4.768.538.446,83. Isso não é mera atualização: é mudança de abrangência. O produto agora identifica o total adotado; os componentes estão separados nas séries. A palavra consolidado não autoriza somar fluxos internos novamente nem interpretar esse total como receita livre disponível.

`reconciliacao-fontes.json` registra SICONFI × TCESP × Prefeitura para receita, empenhado, liquidado e pago em 2023/2024. Os totais coincidem após usar o mesmo conceito. TCESP: empenhado líquido = empenhado + reforço − anulação, confirmado pelo valor publicado no painel. DCA receita bruta e receita RREO líquida de deduções FUNDEB também não são o mesmo conceito: deduções foram preservadas, sem escolher o maior valor. PDFs municipais foram conferidos com páginas e tokens exatos em `conferencia-pdfs-municipais.json`.

## D. Receita

Receita realizada consolidada anual: 2015–2025; 2026 separado até o 4º bimestre. Previsão inicial e atualizada identificadas pelo RREO. Dados bimestrais preservam fluxo no bimestre e acumulado até o bimestre, sem somar acumulados.

DCA 2013–2025 contém naturezas de receita, valores brutos e deduções, receitas correntes/capital, tributos e transferências. Foram preservadas as contas nativas de IPTU, ISS, ITBI, IRRF, taxas, FPM, ICMS, IPVA, SUS e FUNDEB conforme disponibilizadas. Contas pai/filho e principal/multas/juros/dívida ativa não foram somadas arbitrariamente. Códigos de 2013–2017, 2018–2021 e 2022 em diante ficam separados; não é uma única série de códigos comparáveis por coincidência textual.

Realização da receita calculada por realizada/previsão atualizada, do mesmo balanço. Nenhum benchmark, deflator, projeção ou per capita introduzido. Percentuais de tributária/corrente ou transferências/corrente permanecem oportunidades condicionadas a denominador e deduções coerentes; não foram adicionados sob o nome genérico “autonomia fiscal”.

## E. Despesa

Preservadas dotação inicial, atualizada e despesas empenhadas, liquidadas e pagas. Série anual RREO 2015–2025; ano 2026 B4 parcial. DCA 2013–2025 contém natureza, empenho/liquidação/pagamento e inscrições de RP. As três razões empenhado/dotação, liquidado/dotação e pago/dotação são distintas, documentadas e armazenadas.

Resultado orçamentário calculado: receita realizada menos despesa empenhada, ambas do mesmo balanço RREO, incluindo intra conforme seu total. Não usa totais “com déficit/superávit” de fechamento como receita/despesa efetiva. Não é resultado primário, nominal ou caixa. O RREO 2023 publica déficit orçamentário de R$ 263.137.439,07; a conta armazenada preserva o resultado assinado −R$ 263.137.439,07, calculado e identificado como tal.

## F. Despesa por função

Extraídas funções oficiais de dois dígitos da DCA I-E, 2013–2025, sem somar novamente subfunções. Preservados empenhado, liquidado, pago e inscrições de RP, quando a resposta traz o estágio. Ausência de uma função em um ano não virou zero. As classificações oficialmente presentes incluem Saúde, Educação, Administração, Urbanismo, Segurança Pública, Assistência Social, Previdência, Saneamento, Habitação, Cultura, Desporto/Lazer, Gestão Ambiental, Ciência/Tecnologia, Transporte e outras funções conforme exercício. A lista por exercício está nas séries; não se presumem funções presentes em todos os anos.

Os agrupamentos antigos “Urbanismo e Obras”, “Transporte e Mobilidade”, “Saneamento e Gestão Ambiental” e “Demais Funções” não eram uma classificação reproduzível. Seu gráfico foi suspenso, conservando a área existente e exibindo indisponibilidade. A abertura correta ficou armazenada para decisão P2.1. ASPS e MDE são aplicações constitucionais específicas, separadas da função Saúde/Educação. Percentuais publicados em 2023: ASPS 27,63%, MDE 25,84%.

## G. Pessoal, RCL e limites

RGF Executivo quadrimestral 2015 Q1–2026 Q2. DTP, RCL e RCL ajustada são identificadas por sua finalidade. O percentual publicado do Executivo em 2023 Q3 é 28,09%, não 41,8%. Limites máximo, prudencial e alerta são os publicados no relatório (54%, 51,3% e 48,6% nessa competência), sem interpretação jurídica. A razão publicada é preservada; não recalculada com outra RCL.

**Divergência aberta:** DTP absoluta 2025 Q3: SICONFI R$ 1.149.579.006,70; PDF municipal R$ 1.149.583.873,74. Diferença de R$ 4.867,04. O PDF foi gerado em 30/01/2026; extrato SICONFI registra retificação em 30/04/2026. A versão distinta está comprovada, mas a alteração contábil exata não foi isolada. Valor absoluto = null/NAO_VERIFICADO, com os dois valores originais preservados como evidência. O percentual publicado de 26,99% coincide nas duas fontes, mas não deve servir para reconstruir o montante suspenso. Ver `divergencias-nao-resolvidas.json`.

## H. Dívida, caixa, restos a pagar e investimentos

DC, DCL, DCL/RCL e limites: posições quadrimestrais RGF, sem somar posições. DC não é DCL. RCL para endividamento não é RCL ajustada para pessoal. Operações de crédito e limites do anexo 04 preservados conforme linhas presentes; ausência de linha de operação realizada não foi convertida em zero. A receita de operações de crédito no balanço é conceito distinto. Garantias não receberam série normalizada validada: oportunidade pendente, apesar de respostas RGF brutas preservadas.

Caixa e RP: anexo 05, totais e posição anual onde publicados; bruto, obrigações, liquidez antes/depois de RP e inscrições processadas/não processadas separados. O RREO preserva saldos/inscrições/pagamentos/cancelamentos de RP. Não se juntou caixa com resultado orçamentário.

Investimentos = GND 4 na DCA, 2013–2025, com estágios separados. Juros/encargos e amortização da dívida preservados quando disponíveis. Participação de investimentos na despesa permanece oportunidade: exige a mesma abrangência de numerador/denominador, sem somar pai/filhos ou intra indiscriminadamente.

## I. Novos indicadores

'''
newrows=[{'ID':a['id'],'Indicador':a['name'],'Valor':a['after'],'Unidade':a['unit'],'Período':a['period'],'Status':a['status'],'Evidência':a['evidence_id']} for a in audit if a['before'] is None]
report+=table(newrows)+f'\nForam adicionadas {len(newrows)} posições ao cadastro: {sum(a["after"] is not None for a in audit if a["before"] is None)} utilizáveis e uma suspensa por divergência. Famílias: orçamento/receita, estágios da despesa, resultado e razões de execução, pessoal/RCL, dívida e investimentos. Além dos escalares, o pacote contém 9.630 observações históricas exportáveis; o evidence store contém {len(store["evidences"]):,} evidências, incluindo extrações nativas, cálculos e reconciliações. Contagem de evidências não equivale a contagem de indicadores independentes.\n'
report+='''
## J. Séries históricas

'''+table(familyrows)+'''
Cobertura detalhada: `series-historicas.csv/.json`, por demonstrativo + classificação + variável + estágio + segmento, com início/fim, quantidade de períodos, lacunas e fonte. Quantidade de linhas de uma família inclui vários conceitos/estágios por competência; não representa tantos anos.

Disponível: 13 exercícios de DCA (2013–2025); 66 RREOs dos anos encerrados (2015–2025), mais quatro bimestres de 2026; 33 RGFs dos anos encerrados mais dois quadrimestres de 2026. Não foram encontrados registros RREO/RGF 2013/2014 na API consultada. A DCA 2026 não foi inventada: o exercício não terminou. FINBRA 2012 está preservado em MDB, mas não normalizado ou concatenado; a metodologia anterior à DCA/PCASP exige tratamento próprio. Não se afirma que o histórico explorado esgota todos os documentos possíveis dos portais.

Quebras/limitações: natureza de receita em 2018/2022; novos critérios de RCL ajustada; alterações de demonstrativos/constitucionais ao longo dos anos; DCA/FINBRA legado; revisões registradas no extrato; 2026 parcial. Os arquivos originais permitem ampliar a granularidade no futuro sem repetir apenas cortes de 2023/2024. Não há valores reais, estimados ou interpolados. Demografia não homologada impede per capita nesta rodada.

## K. Oportunidades para P2.1

A matriz `matriz-oportunidades-financas.md/.csv/.json` classifica cada possibilidade e registra dados, cobertura, estágio, unidade, evidência e limitação. Perguntas úteis: arrecadação; previsão versus realização; dotação versus empenho/liquidação/pagamento; funções oficiais e prioridades; ASPS/MDE separados das funções; pessoal e limites publicados; investimentos; tributos e transferências; dívida; caixa/RP; resultado orçamentário versus primário/nominal.

As métricas preferidas são nomeadas pelo conceito, e nunca apenas “receita”, “despesa executada” ou “autonomia”. Série tributária deve respeitar mudanças de códigos e deduções; ano parcial exige corte separado; indicadores legais mostram publicação e limite, sem diagnóstico jurídico. MSC mensal exige mapeamento próprio. Design, rankings, comparação entre municípios, correção inflacionária e gráficos novos não foram implementados.

## L. Testes, arquivos e Git

'''
testrows=[{'Comando':'python scripts/test_financas_audit.py','Resultado':'PASS — evidências/brutos, cálculos, território, estágios, unidades, cronologia, parcial, null, pacote/fallback e escopo'}, {'Comando':'node scripts/test_financas_runtime.cjs','Resultado':'PASS — online, offline e fixture null/zero; 9.630 observações exportáveis'}, {'Comando':'python scripts/test_financas_browser.py','Resultado':'PASS — Chrome real; cards/semântica, gráficos antigos suspensos, resultado assinado, ficha e exportação; sem imagens'}, {'Comando':'node scripts/test_economia_visual.cjs','Resultado':'PASS — online/offline/null; dez gráficos e 525 registros da Economia intactos'}, {'Comando':'node scripts/test_saude_runtime.cjs','Resultado':'PASS — online e offline'}, {'Comando':'node scripts/test_radar_hub_p0.cjs','Resultado':'PASS — oito cenários'}, {'Comando':'node --check radar_hub_controller.js','Resultado':'PASS'}]
report+=table(testrows)+'''
Resultados P2 em `teste-evidencia-escopo.json`, `teste-browser-sem-imagens.json` e `testes-runtime.txt`. Exportação verificada em `exportacao-verificada.json/.csv`. Os testes numéricos leem o registro bruto por JSON pointer e reproduzem transformações; não perpetuam valores do cadastro como prova. As respostas consultadas não trazem linhas explicitamente zero no recorte selecionado: o zero calculado legítimo de 2021 é preservado, e fixtures testam zero/ausência na UI e CSV.

Mudanças mínimas na interface: cards existentes agora consultam valores auditados, sem números inseguros estáticos; removidos textos de “superávit contínuo”/regularidade; IEG-M e agrupamentos antigos suspensos; série existente recebe dados auditados, fórmula/sinal corretos e período 2015–2025. O ano parcial 2026 fica armazenado com flag, fora do gráfico anual de exercícios encerrados. Nenhum gráfico novo foi criado. Os dados dos demais eixos, seu cadastro e os arquivos de Economia permanecem idênticos ao snapshot inicial P2.

Arquivo completo de mudanças desta rodada em `arquivos-alterados.txt`. Evidence store: `data/radar_hub/financas_evidence_2026-10-05.json`; bindings: `financas_audit_bindings.json`; brutos: `financas_raw_2026-10-05/`. Pacote e fallback foram regenerados juntos. A auditoria global continua indisponível, sem promover outros eixos. O tamanho do pacote cresceu pela inclusão de séries e rastreabilidade; desempenho de carregamento passou nos testes locais, mas não foi medido em conexões lentas.

Git: `git status --short`, `git diff --stat` e `git diff -- app.js` foram registrados antes/depois. O checkout possuía numerosas alterações/exclusões anteriores e elas foram preservadas. `git diff -- app.js` final é idêntico ao inicial; seu SHA-256 não mudou. Sem commit ou deploy. O diff global não deve ser atribuído integralmente à P2.

### Declaração final obrigatória

- **Todos os indicadores antigos de Finanças foram investigados? SIM.** Oito IDs, mais componentes auxiliares da UI.
- **Todo valor marcado como confirmado possui evidência oficial aberta nesta rodada? SIM.** Confirmação é de fonte/observação, não homologação humana nem garantia de comparabilidade entre todas as taxonomias.
- **Algum valor foi estimado? NÃO.**
- **Algum valor foi interpolado? NÃO.**
- **Alguma ausência virou zero? NÃO.**
- **Receita prevista foi confundida com realizada? NÃO na base final.** Conceitos antigos foram investigados e corrigidos.
- **Despesa empenhada foi confundida com liquidada ou paga? NÃO na base final.** Estágios e fórmula de resultado corrigidos.
- **Valores nominais foram chamados de crescimento real? NÃO.**
- **Algum período parcial foi apresentado como exercício completo? NÃO.**
- **Algum cálculo derivado foi apresentado como valor diretamente publicado? NÃO.** Cálculos e conversões têm transformação/evidências componentes.
- **Existem divergências não resolvidas? SIM.** DTP absoluta Executivo 2025 Q3 entre API e PDF municipal; null e evidências preservadas. O IEG-M B+ está não verificado, não arbitrado.
- **Existem quebras metodológicas? SIM.** Natureza de receita/códigos 2018/2022; ajustes de RCL e demonstrativos; legado FINBRA pré-DCA; mudanças de critérios constitucionais/transferências e revisões. Não houve concatenação automática do FINBRA 2012.
- **Foram encontrados novos indicadores oficiais úteis? SIM.** 21 novos escalares utilizáveis, uma posição adicional suspensa; famílias de orçamento, receita/despesa, execução/resultado, pessoal/RCL, dívida e investimentos, além das séries e oportunidades de funções, transferências e caixa/RP.
- **Algum outro eixo teve valores alterados? NÃO.**
- **Economia foi alterada? NÃO.** Dados, cadastro específico, bindings, evidence store e módulo visual preservados.
- **app.js foi alterado nesta tarefa? NÃO.** Diff anterior preexistente e preservado.

P2 encerrada. Aguardando revisão humana. P2.1, Meio Ambiente e novos gráficos não foram iniciados.
'''
count=sum(len(rows) for rows in pkg['groundTruth']['eixos']['financas']['series_auditadas'].values())
report=report.replace('9.630',f'{count:,}'.replace(',','.'))
report=report.replace('21 novos escalares utilizáveis, uma posição adicional suspensa','18 novos escalares utilizáveis, quatro posições adicionais suspensas')
report=report.replace('utilizáveis e uma suspensa por divergência','utilizáveis e quatro suspensas por divergência')
report=report.replace('DTP absoluta Executivo 2025 Q3 entre API e PDF municipal; null e evidências preservadas.','DTP absoluta, DC, DCL e DCL/RCL do Executivo 2025 Q3 entre API e PDF municipal; null e evidências preservadas.')
extra=[{'Indicador':c['indicator'],'SICONFI':c['siconfi'],'PDF municipal':c['municipal'],'Diferença (API − PDF)':c['difference'],'Estado final':'null / NAO_VERIFICADO'} for c in store['unresolved_conflicts']]
report=report.replace('## H. Dívida, caixa, restos a pagar e investimentos','### Divergências explicitamente suspensas\n\n'+table(extra)+'\nA retificação posterior do RGF está registrada, mas não comprova isoladamente cada alteração. Os demais componentes nativos desse demonstrativo são preservados como observações da fonte e exigem cuidado na comparação entre versões.\n\n## H. Dívida, caixa, restos a pagar e investimentos')
(OUT/'relatorio-final.md').write_text(report,encoding='utf8')
for label,args in [('status',['status','--short']),('stat',['diff','--stat']),('app-js',['diff','--','app.js'])]:
    p=subprocess.run(['git',*args],capture_output=True);(OUT/f'git-final-{label}.txt').write_bytes(p.stdout)
assert (OUT/'git-inicial-app-js.txt').read_bytes()==(OUT/'git-final-app-js.txt').read_bytes()
files=['app.html','radar_hub_controller.js','scripts/build_radar_hub_package.py','scripts/test_radar_hub_p0.cjs','data/radar_hub/sjc_open_data_ground_truth.json','data/radar_hub/sjc_metadata_registry.json','data/radar_hub/radar_hub_consistency.json','data/radar_hub/radar_hub_package.json','data/radar_hub/financas_audit_bindings.json','data/radar_hub/financas_evidence_2026-10-05.json']
files += [p.relative_to(ROOT).as_posix() for p in sorted((ROOT/'scripts').glob('*financas*')) if p.is_file()]
files += [p.relative_to(ROOT).as_posix() for directory in [BASE/'financas_raw_2026-10-05',OUT] for p in sorted(directory.rglob('*')) if p.is_file() and p.name!='arquivos-alterados.txt']
files+=['docs/dados-publicos-revisao/p2-financas/arquivos-alterados.txt'];(OUT/'arquivos-alterados.txt').write_text('\n'.join(files)+'\n',encoding='utf8')
print('Relatório A–L, inventário, cobertura e',len(opps),'oportunidades; Git final e arquivos completos registrados.')
