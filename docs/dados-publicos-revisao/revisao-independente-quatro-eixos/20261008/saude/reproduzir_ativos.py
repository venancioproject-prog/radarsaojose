from pathlib import Path
from pypdf import PdfReader
import json,re,hashlib
O=Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/saude');R=Path.cwd();reg=json.loads((R/'data/radar_hub/sjc_metadata_registry.json').read_text(encoding='utf-8-sig'));g=json.loads((R/'data/radar_hub/sjc_open_data_ground_truth.json').read_text(encoding='utf-8-sig'))['eixos']['saude'];items=[x for x in reg['indicators'] if x['category']=='saude'];checks=[]
def ck(name,ok,detail=None):checks.append(dict(test=name,pass_=bool(ok),detail=detail));assert ok,name
h=json.loads((O/'historicos-rag-todas-edicoes.json').read_text(encoding='utf-8'));native={(r['family'],r['year']):r for r in h['observations']}
for x in g['nascidos_vivos_sinasc']['serie_nascidos_vivos']:ck('SINASC '+str(x['ano']),x['nascidos_vivos']==native['sinasc',x['ano']]['value'])
for x in g['internacoes_sih']['serie_historica']:ck('SIH '+str(x['ano']),x['internacoes']==native['sih',x['ano']]['value'])
sim=next(x for x in h['tables'] if x['edition']==2025 and x['family']=='sim');sih=next(x for x in h['tables'] if x['edition']==2025 and x['family']=='sih');chapters=['IX','II','X','XX','IV','XI','I']
for year,obj in g['causas_mortalidade_geral_por_ano'].items():
 ck('SIM total '+year,obj['total_obitos']==sim['totals'][year]);ck('SIM fechamento '+year,sum(x['obitos'] for x in obj['categorias'])==obj['total_obitos'])
 for cat,ch in zip(obj['categorias'],chapters):ck('SIM capitulo '+year+' '+ch,cat['obitos']==sim['rows'][ch]['values'][year] and cat['pct']==round(cat['obitos']/obj['total_obitos']*100,2))
 for cat in g['internacoes_sih']['top_causas_'+year]:
  ch=cat['capitulo'].replace('Cap. ','');v=sih['rows'][ch]['values'][year];ck('SIH top '+year+' '+ch,cat['internacoes']==v and cat['pct']==round(v/sih['totals'][year]*100,2))
q=PdfReader(O/'raw/q2025.pdf');q26=q.pages[25].extract_text();q24=q.pages[23].extract_text();q27=q.pages[26].extract_text()
for rate in ['8,2','7,65']:ck('Taxa infantil impressa '+rate,rate in q26)
for key in ['obitos_2024','nascidos_vivos_2024','obitos_2025','nascidos_vivos_2025']:ck('Denominador não inferido '+key,g['mortalidade_infantil'][key] is None)
for v in ['61,63','57,95']:ck('APS publicada '+v,v in q24)
for v in ['85,90','89,05','98,5','85,7','82,64','88,74','91,44','85,45']:ck('PNI publicada '+v,v in q27)
for x in items:
 if x['value'] is None:ck('Suspensão '+x['indicator_id'],x['audit_status']=='SUSPENSO')
 elif isinstance(x.get('evidencia'),dict):
  e=x['evidencia'];ck('Hash primário '+x['indicator_id'],hashlib.sha256(Path(e['raw_file']).read_bytes()).hexdigest()==e['sha256'])
manifest=json.loads((O/'manifest.json').read_text(encoding='utf-8'))
for m in manifest:
 if 'sha256' not in m:continue
 ck('Hash novo '+Path(m['raw']).name,hashlib.sha256(Path(m['raw']).read_bytes()).hexdigest()==m['sha256'])
(O/'testes-produtor.json').write_text(json.dumps(dict(status='PASS',checks=checks,independent_validation_required=True),ensure_ascii=False,indent=2),encoding='utf-8')
(O/('inventario.json' if not (O/'inventario.json').exists() else 'inventario-reexecucao.json')).write_text(json.dumps(dict(registry=items,ground_truth=g,series_keys=[k for k,v in g.items() if isinstance(v,(list,dict))]),ensure_ascii=False,indent=2),encoding='utf-8')
mat=[];props=[]
for x in items:
 e=x.get('evidencia',{});mat.append(dict(indicator_id=x['indicator_id'],value=x['value'],period=x['base_year'],status='REPRODUZIDO_LIMITADO' if x['value'] is not None else 'SEM_EVIDENCIA_SUFICIENTE',primary=e.get('raw_file'),sha256=e.get('sha256'),source_url=x['official_url'],locator=e.get('locator'),definition=x.get('methodology'),missing='Denominadores individuais/extração nacional não reproduzidos; publicação municipal conferida.' if x['value'] is not None else x.get('context_warning')))
 if 'raw_file' in x or 'trecho_bruto' in x:props.append(dict(indicator_id=x['indicator_id'],action='ARCHIVE_LEGACY_METADATA_AND_REBIND',before={k:x.get(k) for k in ['raw_file','trecho_bruto']},after=dict(raw_file=e.get('raw_file'),trecho_bruto=e.get('locator',{}).get('excerpt'),source_system='CNES histórico municipal; escopo suspenso' if 'leitos' in x['indicator_id'] or 'estabelecimentos' in x['indicator_id'] else 'SMS-SJC; fonte primária citada na evidência',audit_date='2026-10-08'),promotion=False))
props += [dict(indicator_id='saude_internacoes_sih',action='METADATA',before=dict(unit='internacoes (AIHs)'),after=dict(unit='internações SUS de residentes',frequency='Anual (ano de competência do SIH)',source_system='SIH/SUS; Morbidade Hospitalar por residência, reproduzida no RAG 2025'),reason='AIHs totais incluem prorrogações e não equivalem à medida internações.'),dict(indicator_id='saude_atencao_basica_cnes_sia',action='METADATA',before=dict(name='Atenção Primária à Saúde e Cobertura ESF'),after=dict(name='Cobertura populacional estimada da Atenção Primária à Saúde (APS)'),reason='61,63 é APS; não cobertura ESF isolada.'),dict(action='EXPAND_GT_SERIES_AFTER_INDEPENDENT_QA',fields={'nascidos_vivos_sinasc.serie_nascidos_vivos':'SINASC2015–2024','internacoes_sih.serie_historica':'SIH2015–2025','sim_residentes_serie':'SIM2015–2024'},evidence='historicos-rag-proposta.json',all_original_versions='historicos-rag-todas-edicoes.json',revisions='quebras-revisoes-rag.json'),dict(action='ADD_DISTINCT_CVE_SERIES_AFTER_INDEPENDENT_QA',field='dengue_sinan.serie_cve_residencia',evidence='dengue-cve-extracao.json',reason='CVE2019–2025 por residência. Não substituir comparativos SMS SE1–50 nem atribuir diferenças exclusivamente às semanas finais.')]
(O/'matriz-evidencias.json').write_text(json.dumps(mat,ensure_ascii=False,indent=2),encoding='utf-8');(O/'propostas.json').write_text(json.dumps(props,ensure_ascii=False,indent=2),encoding='utf-8')
print('PASS',len(checks),'checks;',len(items),'indicadores',sum(x['value'] is not None for x in items),'ativos')
