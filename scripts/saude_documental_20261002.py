"""Cálculo documental preservado; executar somente em memória pela consolidação. Não homologa fontes."""
import copy
import hashlib
import json
import re
from pathlib import Path

ROOT = Path.cwd()
DATA = ROOT / 'data/radar_hub'
TMP = ROOT / 'data/radar_hub/saude_documental_modelo_20261008'
DATE = '2026-10-02'
BASE = 'https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/'
Q25 = BASE + 'Quadri_3_2025_1_20260227124829.pdf'
Q24 = BASE + 'Quadri_3_2024_1_20250228153444.pdf'
R25 = BASE + 'RelatAnualGest_2025_1_20260630122107.pdf'
R24 = BASE + 'RelatAnualGest_2024_1_20260630122038.pdf'
NEWS = 'https://www.sjc.sp.gov.br/noticias/2025/dezembro/23/retrospectiva-2025-joseense-ganha-mais-cuidados-com-a-saude/'
DENGUE = 'https://www.sjc.sp.gov.br/noticias/2019/janeiro/9/com-acoes-de-prevencao-casos-de-dengue-caem-quase-pela-metade-em-sao-jose/'
def read(name): return json.loads((TMP / (name + '.before')).read_text(encoding='utf-8'))
def write(path, obj): path.write_text(json.dumps(obj, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
gt = read('sjc_open_data_ground_truth.json')
reg = read('sjc_metadata_registry.json')
old = copy.deepcopy(gt['eixos']['saude'])
s = gt['eixos']['saude']
def source(url, page=None, note=''):
    return dict(fonte_url=url, pagina=page, data_consulta=DATE, nota_metodologica=note, audit_status='CONFIRMADO')
def pending(url, note):
    return dict(fonte_url=url, data_consulta=DATE, audit_status='PENDENTE_VERIFICACAO', nota_metodologica=note)

# Only rates actually printed by SMS; numerators cannot be reverse-engineered.
s['mortalidade_infantil'] = dict(taxa_oficial_sms_2024=8.2, taxa_oficial_sms_2025_preliminar=7.65,
    unidade='óbitos de menores de 1 ano por mil nascidos vivos', meta_municipal_referencia_2022=9.0,
    definicao_metrica='Óbitos de menores de 1 ano residentes / nascidos vivos de mães residentes × 1.000.',
    fonte_nome='SMS-SJC / Prestação de Contas 3º quadrimestre de 2025',
    **source(Q25,26,'Taxas publicadas pela SMS. O relatório não informa os numeradores e denominadores desta tabela. Não recalcular com uma extração SINASC de outra data. A meta 9,00 é a referência municipal de 2022 impressa no relatório, não meta ODS neonatal.'))
s['mortalidade_infantil_serie'] = [dict(ano=y,taxa=v,taxa_por_mil_nascidos=v,status='Taxa publicada SMS; contagens não discriminadas',**source(u,p)) for y,v,u,p in [(2023,10.0,Q24,24),(2024,8.2,Q25,26),(2025,7.65,Q25,26)]]
s['leitos_hospitalares_cnes'] = pending('https://tabnet.datasus.gov.br/cgi/tabcgi.exe?cnes/cnv/leiintsp.def','Totais e divisão SUS/não-SUS/UTI sem extração municipal comprovada para 12/2024. A tabela SMS de leitos SUS de atenção terciária tem outro escopo; não substitui o total CNES de todo o município. Consulta TabNet sofreu timeout nesta rodada.')
s['leitos_serie_historica'] = []

for year, rows in s['cobertura_vacinal_por_ano'].items():
    vals = {'2024': {'Tríplice':98.5,'BCG':60.93,'Pneumocócica':89.05,'Pentavalente':85.9,'Poliomielite':85.7},
            '2025': {'Tríplice':91.44,'BCG':91.67,'Pneumocócica':88.74,'Pentavalente':82.64,'Poliomielite':85.45}}[year]
    for row in rows:
        key = next((k for k in vals if row['vacina'].startswith(k)),None)
        row['cobertura_pct'] = vals.get(key)
        row['status'] = ('Meta atingida' if row['cobertura_pct'] >= row['meta_pni'] else 'Abaixo da meta') if key else 'Sem comprovação nesta auditoria'
        row.update(source(NEWS if key=='BCG' else Q25, None if key=='BCG' else 27) if key else pending(Q25,'Vacina não discriminada na tabela consultada; ausência de comprovação não significa cobertura zero.'))
        if key=='BCG': row['nota_metodologica']='Balanço oficial publicado em 23/12/2025; 2025 é parcial na data da publicação, sem fechamento anual declarado.'
        if row['vacina']=='Hepatite B': row['faixa_etaria']='Até 30 dias de vida'

# Read the numeric CID-10 table from the saved primary document, not old app values.
layout=(ROOT/'data/radar_hub/saude_documental_rag2025_layout_20261008.txt').read_text(encoding='utf-8')
def table(start,end,years):
    text=layout.split(start)[-1].split(end)[0]
    result={}
    for line in text.splitlines():
        m=re.match(r'^\s*([IVX]+)\.\s*(.*?)\s{2,}([\d.\-\s]+)$',line)
        if not m: continue
        values=m[3].split()
        assert len(values)==len(years),(m[1],values)
        result[m[1]]=dict(nome=m[2].strip(),valores={str(y):None if v=='-' else int(v.replace('.','')) for y,v in zip(years,values)})
    assert len(result)>=20,len(result)
    return result
sih=table('3.3. Principais causas de internação por local de residência','3.4. Mortalidade por grupos de causas',[2021,2022,2023,2024,2025])
sim=table('3.4. Mortalidade por grupos de causas','Análises e Considerações sobre Dados Demográficos',[2021,2022,2023,2024])
# Somente parcelas publicadas. As ausências permanecem None; os totais abaixo
# são conferidos contra a linha TOTAL do documento, não estimativas de lacunas.
total_sih={y:sum(r['valores'][str(y)] for r in sih.values() if r['valores'][str(y)] is not None) for y in range(2021,2026)}
total_sim={y:sum(r['valores'][str(y)] for r in sim.values() if r['valores'][str(y)] is not None) for y in range(2021,2025)}
assert total_sih=={2021:32995,2022:35282,2023:37008,2024:38738,2025:41846},total_sih
assert total_sim=={2021:5699,2022:4805,2023:4677,2024:5028},total_sim
chapters=['IX','II','X','XX','IV','XI','I']
for year in ['2023','2024']:
    cats=copy.deepcopy(old['causas_mortalidade_geral_por_ano'][year]['categorias'])
    total=total_sim[int(year)]
    for cat,ch in zip(cats,chapters):
        cat['obitos']=sim[ch]['valores'][year]
        cat['pct']=round(cat['obitos']/total*100,2)
        cat['detalhes']='Agregado do capítulo; diagnósticos individuais não discriminados nesta tabela.'
    cats[-1].update(obitos=total-sum(c['obitos'] for c in cats[:-1]),cid10='Demais capítulos, inclusive XVIII (causas mal definidas)',detalhes='Total SIM menos os sete capítulos apresentados separadamente.')
    cats[-1]['pct']=round(cats[-1]['obitos']/total*100,2)
    s['causas_mortalidade_geral_por_ano'][year]=dict(ano=int(year),status='SIM / RAG 2025, extração 13/05/2026',total_obitos=total,categorias=cats,**source(R25,7,'Óbitos por residência; sete capítulos destacados e demais capítulos agrupados. Percentuais podem apresentar diferença de arredondamento.'))
s['internacoes_sih']=dict(total_internacoes_2024=38738,total_internacoes_2023=37008,
    serie_historica=[dict(ano=y,internacoes=total_sih[y],**source(R25,'6–7')) for y in range(2021,2025)],
    fonte_nome='SIH/SUS - RAG 2025',**source(R25,'6–7','Internações SUS por município de residência, segundo capítulo CID-10; não confundir com internações ocorridas nos hospitais de SJC nem com todas as AIHs. Extração 13/05/2026.'))
for year in [2023,2024]:
    top=sorted(((ch,r) for ch,r in sih.items() if r['valores'][str(year)] is not None),key=lambda kv:kv[1]['valores'][str(year)],reverse=True)[:8]
    s['internacoes_sih']['top_causas_'+str(year)]=[dict(causa=r['nome'],capitulo='Cap. '+ch,internacoes=r['valores'][str(year)],pct=round(r['valores'][str(year)]/total_sih[year]*100,2)) for ch,r in top]

# Confirmed birth totals; delivery breakdown cannot be inferred from a total.
s['nascidos_vivos_sinasc']=dict(total_2024=7463,total_2023=8090,serie_historica_parto=[],
    serie_nascidos_vivos=[dict(ano=y,nascidos_vivos=n,**source(R25,6)) for y,n in [(2021,8545),(2022,8072),(2023,8090),(2024,7463)]],
    parto_cesareo_2024=None,parto_vaginal_2024=None,parto_ignorado_2024=None,pct_cesareo_2024=None,pct_vaginal_2024=None,faixa_etaria_mae_2024=[],
    desagregacao_status='PENDENTE_VERIFICACAO',fonte_nome='SINASC / RAG 2025',**source(R25,6,'Totais por residência da mãe confirmados. Vias de parto e idade materna não discriminadas nesta tabela; gráfico por via suspenso até obter extração SINASC.'))
s['natalidade_sinasc_2023']=dict(nascidos_vivos=8090,**source(R25,6))

# Annual counts and partial epidemiological-week counts must remain distinct.
annual=[688,2380,154,839,832,14509,1731,438,198]
s['dengue_sinan']=dict(casos_2024=None,casos_2023=None,media_historica_2010_2023=None,pico_historico_anterior_2015=14509,
    casos_2024_se_1_50=98163,casos_2025_se_1_50=5529,
    serie_historica=[dict(ano=y,casos=n,periodo='Ano completo',status_metodologico='Balanço municipal anual',**source(DENGUE)) for y,n in zip(range(2010,2019),annual)] +
      [dict(ano=y,casos=None,periodo='Ano completo',status_metodologico='Pendente de comprovação') for y in range(2019,2024)] +
      [dict(ano=2024,casos=98163,periodo='SE 1–50 (parcial)',status_metodologico='Casos confirmados; semanas epidemiológicas 1 a 50',**source(NEWS))],
    fonte_nome='Vigilância Epidemiológica / Prefeitura de SJC',**source(DENGUE,None,'2010–2018: balanços anuais. 2019–2023: lacunas sem comprovação, não são zeros. 2024: somente SE 1–50, fonte retrospectiva de 23/12/2025. Não calcular média 2010–2023 nem comparar o recorte parcial como ano completo.'))
ab=dict(unidades_basicas_saude_ubs=40,unidades_basicas_saude_cnes=40,unidades_basicas_saude_rede_municipal=None,
    competencia_ubs='12/2025',equipes_saude_familia_esf=None,cobertura_atencao_primaria_pct_2024=61.63,atendimentos_consultas_2024=978233,
    serie_cobertura=[dict(ano=2024,cobertura_pct=61.63,consultas_atendimentos=978233,referencia_cobertura='Último dado MS: abril/2024',fonte_cobertura=Q25,fonte_atendimentos=R24),dict(ano=2025,cobertura_pct=57.95,consultas_atendimentos=1285049,referencia_cobertura='Resultado 2025 publicado pela SMS',fonte_cobertura=Q25,fonte_atendimentos=R25)],
    fonte_nome='SMS-SJC / e-Gestor; SISAB; CNES',**source(Q25,24,'Cobertura APS, não cobertura ESF isolada. 2024 corresponde ao último dado MS de abril/2024. Atendimento individual SISAB: RAG 2024 e 2025, p. 8; não equivale só a consultas médicas. 40 centros de saúde/UBS na rede SUS em 12/2025 (39 gestão municipal e 1 estadual), RAG 2025 p. 10; não significa 40 UBS municipais ativas. Número de equipes não comprovado.'))
s['atencao_basica_cnes_sia']=ab
s['cobertura_atencao_basica_serie']=[dict(ano=r['ano'],cobertura_pct=r['cobertura_pct']) for r in ab['serie_cobertura']]
s['estabelecimentos_saude_cnes']=pending(R25,'Antigo total 528 sem extração de todo o CNES. RAG 2025 p. 10 informa 155 estabelecimentos públicos/prestadores SUS em 12/2025, escopo diferente.')
s['procedimentos_sia_sih']=pending(R25,'Séries antigas de produção sem comprovação. SIA quantidade aprovada, SIH AIHs e internações são medidas distintas; não somar como procedimentos únicos. RAG 2025 pp. 8–9 permite futura reconstrução por grupo e sistema.')
s['procedimentos_sia_sih']['audit_status']='SUSPENSO_PARA_REVISAO'
s['data_consulta']=DATE
s['fonte_nome']='SMS-SJC; SIM, SINASC, SIH, SISAB e CNES citados nos relatórios oficiais'
s['fonte_url']=R25

def meta(ind, value, year, url, note, page=None, confirmed=True):
    ind.update(value=value,base_year=year,official_url=url,audit_status='CONFIRMADO' if confirmed else 'PENDENTE_VERIFICACAO',audit_date=DATE,valid_until=None,verificacao='primaria' if confirmed else 'nao_verificado',context_warning=note,methodology=note,status_badge='OFICIAL' if confirmed else 'EM_REVISAO')
    ind['evidencia']=dict(url=url,data_consulta=DATE,ferramenta='Leitura documental da fonte primária; tabelas conferidas',pagina=page)
    if confirmed: ind['evidencia']['trecho_bruto']=f'Valor conferido: {value}; referência: {year}; página/seção: {page or "balanço municipal"}.'
    else: ind['evidencia']['motivo_nao_verificado']=note
    # Remove legacy evidence fields that could still claim a previous value.
    for k in ['evidence','source_excerpt']: ind.pop(k,None)

for ind in reg['indicators']:
    if ind.get('category')!='saude': continue
    key=ind['indicator_id']
    if 'leitos' in key or key=='saude_estabelecimentos_total':
        meta(ind,None,'12/2024 (pendente)',s['leitos_hospitalares_cnes']['fonte_url'],s['leitos_hospitalares_cnes']['nota_metodologica'],confirmed=False)
    elif key=='saude_mortalidade_infantil': meta(ind,8.2,'2024; 2025: 7,65',Q25,s['mortalidade_infantil']['nota_metodologica'],26)
    elif key=='saude_cobertura_vacinal_bcg': meta(ind,60.93,'2024; parcial 2025: 91,67%',NEWS,'Balanço municipal de 23/12/2025; 2025 parcial, não fechamento anual.')
    elif key=='saude_nascidos_vivos_sinasc': meta(ind,7463,'2024',R25,s['nascidos_vivos_sinasc']['nota_metodologica'],6)
    elif key=='saude_dengue_sinan': meta(ind,98163,'2024, SE 1–50 (parcial)',NEWS,s['dengue_sinan']['nota_metodologica'])
    elif key=='saude_internacoes_sih': meta(ind,38738,'2024',R25,s['internacoes_sih']['nota_metodologica'],'6–7')
    elif key in ['saude_cobertura_atencao_basica','saude_atencao_basica_cnes_sia']: meta(ind,61.63,'2024 (último dado MS: abril)',Q25,ab['nota_metodologica'],24)
    else: meta(ind,None,'2024',R25,s['procedimentos_sia_sih']['nota_metodologica'],'8–9',False)
    ind['source_agency']='Secretaria Municipal de Saúde de São José dos Campos / Ministério da Saúde'
    ind['source_system']='Relatórios e balanços oficiais; ver fonte, página e recorte na evidência'
    if key=='saude_dengue_sinan':ind['name']='Casos confirmados de dengue (SE 1–50 de 2024)'
    if key=='saude_estabelecimentos_total':ind['context_warning']=s['estabelecimentos_saude_cnes']['nota_metodologica'];ind['methodology']=ind['context_warning']

template=next(i for i in reg['indicators'] if i['indicator_id']=='saude_internacoes_sih')
for id_,name,val,yr,url,note,page in [
 ('saude_causas_mortalidade','Óbitos de residentes por capítulos CID-10',4677,'2023; 2024: 5.028',R25,'SIM por residência, RAG 2025. 2023: 4.677; 2024: 5.028. Sete capítulos e demais causas, sem sobreposição.',7),
 ('saude_cobertura_vacinal','Cobertura vacinal por imunobiológico',None,'2024 / 2025',Q25,'SCR, pneumocócica, penta e pólio: p. 27. BCG: retrospectiva municipal de 23/12/2025 (2025 parcial). Hepatite B e rotavírus: sem comprovação nesta rodada.',27)]:
    ind=copy.deepcopy(template);ind.update(indicator_id=id_,name=name,unit='óbitos' if val else '% por vacina')
    meta(ind,val,yr,url,note,page)
    if val is None:ind['value']='Consultar valores por vacina e ano no gráfico'
    reg['indicators'].append(ind)

