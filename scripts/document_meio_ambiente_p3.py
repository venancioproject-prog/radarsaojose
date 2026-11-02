"""Referências metodológicas, matrizes e relatório P3, sem imagens."""
from collect_meio_ambiente_p3 import ROOT,BASE,RAW,OUT,read
from pypdf import PdfReader
import json,csv,re,hashlib
def save(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
store=read(BASE/'meio_ambiente_evidence_2026-10-05.json');s=store['series'];proof=read(OUT/'referencias-metodologicas-extraidas.json') if (OUT/'referencias-metodologicas-extraidas.json').exists() else []
for p in ([] if proof else RAW.glob('*.pdf')):
    if p.stat().st_size<10000:continue
    try:
        for i,page in enumerate(PdfReader(p).pages,1):
            text=page.extract_text() or ''
            terms=[t for t in ['IN015','IN016','IN049','IN055','IAG0001','IAG2013','IES2004','IRS1004','IRS3010','770','São José dos Campos'] if t.lower() in text.lower()]
            if terms:proof.append({'raw_file':str(p.relative_to(ROOT)).replace('\\','/'),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'page':i,'terms':terms,'text':text})
    except Exception as e:proof.append({'raw_file':p.name,'error':str(e)})
save(OUT/'referencias-metodologicas-extraidas.json',proof)
cover=[]
for family,rows in sorted(s.items()):
    rows=sorted(rows,key=lambda e:e['period']);numeric=[e for e in rows if e['value'] is not None]
    gaps=','.join(str(y) for y in range(int(rows[0]['period']),int(rows[-1]['period'])+1) if str(y) not in {e['period'] for e in rows}) if rows[0]['period'].isdigit() and rows[-1]['period'].isdigit() and rows[0]['frequency']=='annual' else 'não aplicável'
    cover.append({'family':family,'indicator':rows[0]['variable'],'source':rows[0].get('system',rows[0]['url']),'spatial_scope':rows[0]['spatial_scope'],'start':rows[0]['period'],'end':rows[-1]['period'],'frequency':rows[0]['frequency'],'points':len(rows),'numeric_points':len(numeric),'missing_points':len(rows)-len(numeric),'comparable':'NÃO automaticamente; observar códigos, denominadores e versões','status':'DISPONIVEL_VALIDADO' if all(e['status']=='CONFIRMADO' for e in rows) else 'DISPONIVEL_COM_LIMITACAO','breaks':'SNIS/SINISA separados; Ixxx2004–2006 / INxxx2007–2022 separados; Censos 2010/2022 não interpolados; inventário 2020 com imagens 2017–2019','gaps':gaps or 'nenhum ano ausente neste segmento','limitation':' | '.join(rows[0]['limitations'])})
pending=[('meteorologia','Chuva, temperatura e eventos extremos','INMET','station','Catálogo atual não identifica estação em SJC; A728 é Taubaté. API de teste devolveu 204 sem observações.'),('recursos_hidricos','Vazão, chuva e nível por estação/bacia','ANA Hidroweb','station','SPA sem observações; catálogo 2009 preservado. Nova API exige cadastro; séries numéricas não obtidas.'),('qualidade_agua','Qualidade de rios e reservatórios','CETESB','station','Relatório oficial com 403 nesta coleta; não usar água tratada como qualidade de rio.'),('uso_solo_historico','Classes de uso do solo em série longa','IPA / DataGEO; MapBiomas como oportunidade','municipality','Inventário oficial de vegetação 2020 validado; nenhuma série longa de classes validada nesta rodada.'),('territorio_protegido_total','Área e percentual municipal sob proteção','Cadastros oficiais / DataGEO','municipality','Áreas cadastrais individuais não substituem união espacial; sobreposições e denominador municipal pendentes.'),('emissoes','Inventário municipal de GEE','Prefeitura','municipality','Página institucional localizada, mas inventário com valores, ano-base e método reproduzível não localizado.'),('energia_municipal','Geração/consumo renovável municipal','Fontes oficiais a localizar','municipality','Energia SNIS/SINISA refere-se ao serviço de saneamento; não ao município inteiro.')]
for family,indicator,source,scope,limit in pending:cover.append({'family':family,'indicator':indicator,'source':source,'spatial_scope':scope,'start':None,'end':None,'frequency':None,'points':0,'numeric_points':0,'missing_points':None,'comparable':'não avaliado','status':'NAO_ENCONTRADO' if family in ['emissoes','energia_municipal'] else 'SUSPENSO','breaks':'não avaliável','limitation':limit})
save(OUT/'matriz-cobertura.json',cover)
def csvfile(name,rows):
    keys=list(rows[0]);
    with (OUT/name).open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=keys);w.writeheader();w.writerows(rows)
def table(rows,keys):
    def cell(x):return str(x if x is not None else '—').replace('|',' / ').replace('\n',' ')
    return '| '+' | '.join(keys)+' |\n|'+'|'.join(['---']*len(keys))+'|\n'+'\n'.join('| '+' | '.join(cell(r.get(k)) for k in keys)+' |' for r in rows)+'\n'
for r in cover:r.setdefault('gaps','não avaliado')
csvfile('matriz-cobertura.csv',cover)
(OUT/'matriz-cobertura.md').write_text('# Cobertura de Meio Ambiente — P3\n\nContagem inclui null explicitamente publicado. Não indica continuidade metodológica homologada. As fontes, hashes e células estão no evidence store.\n\n'+table(cover,['family','indicator','spatial_scope','start','end','frequency','points','numeric_points','missing_points','status','limitation']),encoding='utf8')
opps=[]
questions=[('Como evoluiu o atendimento total de água?',['snis_IN055','sinisa_IAG0001'],'Séries separadas; denominador e sistema explícitos.'),('Como variam coleta e tratamento volumétricos?',['snis_IN015','snis_IN016','sinisa_IES2002','sinisa_IES2004'],'Não equivalem à população ou domicílios atendidos.'),('Como evoluíram as perdas de distribuição?',['snis_IN049','sinisa_IAG2013'],'Perdas totais incluem aspectos reais/aparentes; não atribuir tudo a vazamentos.'),('Quanto resíduo é coletado e recuperado?',['sinisa_IRS0001','sinisa_IRS1004','sinisa_IRS3010'],'Apenas referência 2024. Massa per capita 12,43 kg/hab.dia publicada é atípica e exige reconciliação; recuperação não é cobertura seletiva.'),('Quantas detecções de calor houve?',['focos_anuais','focos_mensais'],'Produto de referência; não incêndios. Arquivos integrais permitem contagem mensal zero.'),('Quanto há de cobertura nativa?',['vegetacao_nativa'],'Fotografia do inventário 2020, imagens 2017–2019; não arborização urbana.'),('Qual arborização é informada pelo Censo?',['arborizacao_censo'],'Dois Censos; verificar instrumentos e denominadores antes de comparar.'),('Qual o IQAr nas estações disponíveis?',['ar_iqar_snapshot'],'Snapshot de duas estações; não permite tendência anual ou média municipal.'),('Qual a área cadastrada das unidades localizadas?',['unidades_conservacao'],'243,49 ha Ruschi e 11.559 ha APA estadual SFX; nenhuma soma ou percentual municipal.'),('Quais indicadores de energia do saneamento existem?',['snis_IN058','snis_IN059'],'Consumo por volume do serviço; não emissões ou consumo energético municipal.')]
for question,families,limit in questions:
    rows=[e for f in families for e in s.get(f,[])];opps.append({'question':question,'families':', '.join(families),'period':', '.join(f'{f}: {min(e["period"] for e in s[f])}–{max(e["period"] for e in s[f])}' for f in families if f in s),'spatial_scope':', '.join(sorted({e['spatial_scope'] for e in rows})),'source':', '.join(sorted({e.get('system',e['url']) for e in rows})),'status':'DISPONIVEL_COM_LIMITACAO' if any(e['status']!='CONFIRMADO' for e in rows) or any('IRS1004' in f for f in families) else 'DISPONIVEL_VALIDADO','limitation':limit})
for family,indicator,source,scope,limit in pending:opps.append({'question':'É possível analisar '+indicator.lower()+'?','families':family,'period':'Não validado','spatial_scope':scope,'source':source,'status':'NAO_ENCONTRADO' if family in ['emissoes','energia_municipal'] else 'SUSPENSO','limitation':limit})
save(OUT/'matriz-oportunidades-meio-ambiente.json',opps);csvfile('matriz-oportunidades-meio-ambiente.csv',opps)
(OUT/'matriz-oportunidades-meio-ambiente.md').write_text('# Perguntas possíveis — P3\n\nSem proposta de gráfico ou redesign. Não encontrado significa não validado nesta rodada, não inexistência do dado.\n\n'+table(opps,list(opps[0])),encoding='utf8')
legacy=read(OUT/'matriz-legados.json');direct=read(OUT/'campos-diretos-legados.json')
(OUT/'antes-depois.md').write_text('# Legados: antes e depois\n\nOs dez IDs e cada folha numérica direta foram inventariados. A série INPE foi substituída integralmente; os campos sem prova ficaram null, e novas séries possuem nomes e evidências próprios. Textos causais legados também foram suspensos.\n\n'+table(legacy,['id','before','after','before_period','period','status','reason','evidence_id'])+'\n## Campos diretos antigos\n\n'+table(direct,['path','before','after','status','reason']),encoding='utf8')
conflicts=[{'issue':'Focos 2024: 94 no registry, 24 em outro trecho; 2023: 46 e 18','decision':'Arquivo INPE satélite de referência: 10 em 2024 e 8 em 2023. Produtos legados não identificados; não são observações comparáveis automaticamente.'},{'issue':'312 dias/82,4%; 324 dias/79,8%; station Vista Verde','decision':'Sem fonte anual reproduzível; null. Serviço atual identifica S.José Campos e Jd.Satelite. Não equiparar nome legado à estação atual.'},{'issue':'Água 99,8%; perdas 22,4%/21,3%','decision':'SINISA ref.2023 IAG0001 98,64% população total e IAG2013 36,49%. Cobertura urbana 99,86% é outro denominador.'},{'issue':'Coleta 98,6%/98,5%/98,4% e tratamento 95,8%/98,2%/100%','decision':'Coleta domiciliar legada suspensa. SNIS 2022 IN015 89,28% volumétrico; IN016 100% do coletado. SINISA populacional armazenado em ID distinto.'},{'issue':'Área protegida 692,5/728,4 km² e 63/66,25%; verde 18,4 m²/hab','decision':'Totais sem união espacial comprovada: null. Ruschi 243,49 ha e APA estadual 11.559 ha apenas individualmente.'},{'issue':'Vegetação versus arborização / área urbanizada','decision':'Cobertura nativa 26,94% inventário 2020; arborização 85,55% Censo2022; área urbanizada 128,94km² 2019 e 129,84 em2022 com limitação da metadata. Não equivalentes.'},{'issue':'Resíduo per capita SINISA 2024 12,43 kg/hab.dia','decision':'Valor publicado atípico; conservar bruto com limitação, não corrigir por palpite nem inferir comportamento dos moradores.'}]
save(OUT/'reconciliacao-divergencias.json',conflicts)
text='''# Relatório P3 — Meio Ambiente — 2026-10-05

Há dados melhores e históricos mais longos, mas vários números antigos não eram defensáveis. A P3 corrige vínculos e limitações, preserva os valores antigos em snapshot e mantém a revisão humana pendente. Não há homologação global, redesign, deploy ou avanço à P3.1.

## A. Estado da base

Dez indicadores legados investigados; cinco corrigidos com evidência e cinco suspensos. Dez novos escalares cadastrados. Todos os demais campos numéricos diretos foram inventariados em `antes-depois.md`; conteúdos sem comprovação não permanecem como afirmações ativas. A interface conserva quatro cartões e quatro espaços de gráficos: ar e território protegido exibem pendência; saneamento usa apenas SNIS 2022 com denominadores explícitos; INPE passa a 2003–2024.

## B. Fontes e reprodução

`meio_ambiente_raw_2026-10-05/consultas.json` registra URL exata, acesso UTC, resposta e hash de corpo preservado, inclusive falhas. HTTP 200 sozinho não valida um dataset: consultas CETESB com erro JSON e resposta INMET 204 não são observações. O evidence store vincula arquivo ZIP, membro, SHA, planilha, célula, código e linha municipal; INPE inclui filtro e linhas CSV. `referencias-metodologicas-extraidas.json` preserva páginas dos glossários e documentos em PDF. Nenhum valor interno repetido foi usado como prova externa.

## C. Indicadores antigos

A tabela completa está em `antes-depois.md`, com JSONs `matriz-legados.json` e `campos-diretos-legados.json`. Coleta domiciliar não foi substituída silenciosamente por coleta volumétrica. Valores corretos de outros conceitos entram com nomes próprios.

## D. Qualidade do ar

O serviço oficial CETESB retornou duas estações: S.José Campos e S.José Campos-Jd.Satelite, ambas IQAr14/BOA na data literal 2026-10-05 1:00. Isso é snapshot por estação, provisório, não contagem anual ou média municipal. Identificadores 49/50 são IDs do serviço, sem assumir código histórico estável. Poluentes CO, MP10, MP2.5, NO2, O3 e SO2 possuem camadas de 48h: corpos brutos preservados; unidades e completude não validadas para série publicada. PDFs anuais tiveram 403; rota alternativa DataGEO foi localizada e retornou timeout. Distribuição anual de O3 exige representatividade em cada quadrimestre, não mero percentual de dias do ano. Números 312/324 e nome Vista Verde não comprovados.

## E. Meteorologia e clima

Catálogos INMET automáticos e convencionais consultados. A728 é Taubaté, fora do município; não vira proxy municipal. O teste anual retornou 204 vazio, não chuva zero. Catálogos atuais não demonstram ausência de estações históricas desativadas. Chuva, temperatura, extremos e normal climatológica municipal continuam pendentes; nenhum agregado incompleto foi calculado.

## F. Cobertura e uso do solo

Índice oficial de cobertura vegetal nativa: 26,94%, Inventário2020, imagens2017–2019. Percentual já publicado para código3549904; nenhuma área calculada, reprojeção ou clip executados. Metadata oficial identifica classificação por sensoriamento remoto. Não é arborização, área verde pública ou proteção legal. IBGE área urbanizada2019:128,94km²; API também informa2022:129,84, com limitação porque metadata ainda cita publicação2019. Série longa por classes continua pendente; MapBiomas pode ser investigado com coleção, resolução, método e natureza institucional explícitos.

## G. Arborização e áreas protegidas

IBGE arborização2010:94,7%;2022:85,55%. São observações censitárias; não série anual de árvores ou m² verdes/hab. O plano municipal2016 foi preservado e sua amostra não é censo municipal completo. Área cadastrada Ruschi:243,49ha; APA estadual São Francisco Xavier:11.559ha. Não somar unidades nem zonas municipais que possam se sobrepor. Parque Mananciais de Campos do Jordão e ARIE Cerâmica/Cerrado120ha legados não foram validados como unidades municipais: removidos das afirmações ativas. Total/percentual protegido exige geometria, união espacial, referência temporal e denominador validado.

## H. Recursos hídricos e água ambiental

Portal ANA Hidroweb e inventário pluviométrico2009 consultados; cadastro de estação não comprova observações nem disponibilidade atual. Rota antiga de telemetria falhou e a nova requer cadastro. Sem série de vazão/nível/chuva validada ou média de bacia. Qualidade de água CETESB em PDF bloqueada403; atendimento de água não substitui qualidade ambiental de rios ou reservatórios.

## I. Água e esgoto

SNIS2022 municipal/Sabesp: IN05596,79% população total atendida por água; IN01589,28% coleta referida a água consumida; IN016100% tratamento referido ao coletado; IN04941,84% perdas de distribuição. Coberturas urbanas em branco continuam null. SINISA ref.2023: água total98,64%, urbana99,86%; coleta populacional97,22%; tratamento/coletado100%; perdas36,49%. Ref.2024: água99,39%, coleta populacional97,77%, tratamento/coletado100%, perdas32,13%. Denominadores não intercambiáveis. Censo2022 esgotamento95,67% refere-se a moradores e tipos específicos de esgotamento; não comprova coleta SNIS ou domicílios conectados.

## J. Resíduos

SINISA2024 disponibiliza cobertura total de coleta100%, cobertura seletiva total98,72%, recuperação de secos+orgânicos sobre total coletado1,65%. Cobertura não é reciclagem. Massa média publicada12,43kg/hab.dia é atípica e pede reconciliação de volumes, período e população; a base não a corrige por hipótese. Campos não calculados são null, zeros publicados são preservados. Série histórica longa de resíduos ainda não foi validada.

## K. Focos de calor

22 arquivos anuais integrais do INPE,2003–2024, permitiram contagens anuais e264mensais pelo município atribuído na própria fonte. 2023:8;2024:10, no produto satélite de referência. Zero mensal significa nenhum registro no arquivo integral, não ausência preenchida. Não são incêndios únicos, área queimada, emissões ou soma de todos os satélites; não há narrativa causal. A FAQ registra limitações de localização e revisão de base; não interpretar mudanças como efeito de políticas sem estudo específico.

## L. Emissões e energia

Página municipal de mudanças climáticas localizada, mas inventário quantitativo com método/ano-base reproduzível não encontrado nesta rodada. Isso não prova inexistência de inventário. Energia no SNIS/SINISA é do serviço de água/esgoto, em unidades nativas, não consumo municipal nem estimativa de GEE. Nenhuma emissão estimada foi apresentada como medida.

## M. Novos indicadores

Cobertura de rede por população/domicílios total, urbano e rural, perdas, volumes relativos, resíduos, energia do saneamento, arborização censitária, vegetação nativa, áreas cadastradas e IQAr por estação. Dataset permite null e zero real com metadados por observação. Indicadores adicionais ficam disponíveis na base/exportação sem criar painéis nesta etapa.

## N. Séries históricas

Tabela exata por família em `matriz-cobertura.md/json/csv`. SNIS e SINISA permanecem em famílias distintas; não há concatenação automática. Dentro de SNIS, variações abruptas declaradas (ex.: IN0152012/2013) exigem conferência de informações e notas antes de inferir tendência. A investigação de1995–2009 encontrou arquivos antigos com layouts diferentes, agregados e algumas falhas de download; não transforma esses arquivos em história municipal automaticamente. O período efetivamente extraído é o da matriz, e a conclusão não é “nunca existiram dados anteriores”. Censos separados, não interpolados. Cobertura vegetal é inventário isolado. IQAr é snapshot.

## O. Divergências

'''+table(conflicts,['issue','decision'])+'''
## P. Oportunidades

`matriz-oportunidades-meio-ambiente.md/json/csv` associa perguntas, períodos, escala, fontes e limitações. Priorizar: reconciliação dos resíduos; acesso ao QUALAR histórico; estações hidrológicas/meteorológicas locais históricas; união geográfica de áreas protegidas; série de uso do solo com versão documentada. Cada etapa deve validar dados antes de desenho. Não atribuir alterações à indústria, urbanização, clima ou políticas sem estudo causal.

## Q. Testes, arquivos e Git

Resultados em `testes.txt` e `testes-escopo.json`; testes reproduzem células/contagens e verificam pacote/fallback, null/zero, exports e preservação dos outros eixos. `arquivos-alterados-p3.json` lista diferenças em relação ao snapshot desta tarefa; `git-before-*` e `git-after-*` preservam estado global. O repositório já tinha alterações antes da P3, incluindo app.js: hash e diff inicial/final devem coincidir para esse arquivo. A etapa aguarda revisão humana; nenhum deploy, screenshot ou P3.1 executado.

## Prompt de continuidade para outra IA

Leia este relatório, matrizes, evidências, dados brutos e testes antes de propor qualquer alteração. Revise apenas Meio Ambiente. Reproduza os filtros INPE e células municipais SNIS/SINISA; investigue as pendências de ar histórico, resíduos, estações locais, solo e áreas protegidas em fontes primárias. Preserve null, códigos, denominadores, âmbito espacial, versão, quebras, datas e hashes; não concatene sistemas nem converta focos em incêndios. Não altere app.js ou demais eixos, não faça deploy ou redesign. Entregue evidências e limites para revisão humana. P3.1 exige nova autorização do usuário.
'''
text=text.replace('Dez novos escalares cadastrados.','Onze novos escalares cadastrados.').replace('O período efetivamente extraído é o da matriz,','Foram extraídos segmentos municipais SNIS Ixxx2004–2006 e INxxx2007–2022, preservados separadamente; SINISA2023–2024. O período efetivamente extraído é o da matriz,')
declarations=[('Todos os indicadores antigos investigados?','SIM — dez IDs e folhas diretas inventariadas; sem prova resulta suspensão.'),('Todo valor confirmado tem evidência externa reproduzível aberta nesta rodada?','SIM — arquivos, hashes, células/filtros e acesso registrados.'),('Valor estimado sem identificação explícita?','NÃO.'),('Valor interpolado?','NÃO.'),('Ausência virou zero?','NÃO. Zero mensal INPE é contagem em arquivo anual integral; zeros publicados preservados.'),('Dado de estação apresentado como média municipal?','NÃO.'),('Cobertura vegetal confundida com arborização?','NÃO.'),('Esgoto coletado confundido com tratado?','NÃO.'),('Denominador de saneamento trocado?','NÃO. Legado domiciliar suspenso; indicadores volumétricos e populacionais mantêm conceitos próprios.'),('Foco de calor apresentado como incêndio confirmado?','NÃO.'),('Estimativa apresentada como medição direta?','NÃO.'),('SNIS e SINISA concatenados sem verificação?','NÃO.'),('Existem quebras metodológicas?','SIM — Ixxx/INxxx, SNIS/SINISA, Censos2010/2022; inventário2020 e snapshots não são séries anuais contínuas.'),('Existem divergências não resolvidas?','SIM — ar histórico legado, território protegido total, coleta domiciliar legada, massas de resíduos atípicas, metadata IBGE área2022; acesso hidrometeorológico pendente.'),('Novos indicadores úteis?','SIM — água/esgoto urbano/rural e denominadores próprios, resíduos, vegetação, arborização, energia do saneamento, cadastro de unidades e IQAr por estação.'),('Novas séries históricas?','SIM — INPE2003–2024 anual/mensal; SNIS2004–2006/Ixxx e2007–2022/INxxx; SINISA2023–2024; Censos2010/2022; área urbanizada2019/2022 com limitação no último ano.'),('Outro eixo teve valores alterados?','NÃO.'),('Economia alterada?','NÃO.'),('Finanças alteradas?','NÃO.'),('app.js alterado nesta tarefa?','NÃO — hash idêntico ao snapshot P3.')]
text+='\n## Declaração final obrigatória\n\n'+'\n'.join(f'{i}. **{q}** {answer}' for i,(q,answer) in enumerate(declarations,1))+'\n'
text+='\n## Limites da verificação técnica\n\nTestes executados em Python e JavaScript/VM; não houve inspeção visual em navegador. Nenhum screenshot foi produzido. Há edições concorrentes fora do módulo de Dados Públicos no app.html; a aplicação P3 preserva esses trechos e testa os blocos dos demais eixos contra o snapshot. O teste anterior P0 foi adaptado apenas para retirar a expectativa de desenho do ar legado, agora suspenso; sua lógica de pacote e demais eixos foi mantida. Não se afirma validação integral de toda a aplicação.\n'
(OUT/'relatorio-final.md').write_text(text,encoding='utf8')
print('Documentos gerados',len(cover),'famílias/coberturas;',len(proof),'páginas metodológicas')
