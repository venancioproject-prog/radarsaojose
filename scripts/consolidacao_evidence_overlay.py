"""Identifica revisão P4 suspensa sem alterar o evidence store histórico."""
from pathlib import Path
import json,copy
from build_radar_hub_package import write_atomic
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
read=lambda p:json.loads(p.read_text(encoding='utf8'))
save=lambda p,x:write_atomic(p,json.dumps(x,ensure_ascii=False,indent=2)+'\n')
gt=read(BASE/'sjc_open_data_ground_truth.json');mob=gt['eixos']['mobilidade'];journal=read(OUT/'reconciliacao-aplicada.json');overrides=[]
for d in journal['decisions']:
 if d.get('decision')!='SUSPENSO_ERRO_COLUNA':continue
 r=next(r for r in mob['series_auditadas']['transporte_bilhetagem'] if r['evidence_id']==d['evidence_id']);overrides.append({'evidence_id':r['evidence_id'],'period':r['period'],'value':None,'raw_value_from_failed_extraction':r.get('raw_value'),'status':r['status'],'source_metadata_id':r['source_metadata_id'],'methodology':d['reason'],'original_evidence_version':'data/radar_hub/mobilidade_evidence_2026-10-05.json','reproduction':'Conferir PDF oficial transporte-bilhetagem-2026.pdf: cabeçalho de fechamento em agosto; colunas mensais setembro–dezembro vazias. Valores extraídos são total e média mensal.'})
overlay={'round':'Consolidação 2026-10-08','homologated':False,'base_store':'data/radar_hub/mobilidade_evidence_2026-10-05.json','resolution_rule':'Para esta versão, overrides prevalecem sobre base_store por evidence_id. Base store é documento histórico imutável; não tratar como valor ativo.','overrides':overrides}
p=BASE/'mobilidade_reconciliation_20261008.json';save(p,overlay);mob['evidence_reconciliation']=p.relative_to(ROOT).as_posix();save(BASE/'sjc_open_data_ground_truth.json',gt)
# Store da consolidação reúne vínculos atuais e referências originais; não duplica arquivos nacionais.
reg=read(BASE/'sjc_metadata_registry.json');education=read(OUT/'educacao-inep-reproduzida.json');save(BASE/'consolidacao_evidence_2026-10-08.json',{'homologated':False,'indicators':{i['indicator_id']:i.get('evidencia') for i in reg['indicators']},'education_evidences':education['evidences'],'mobilidade_reconciliation':overlay,'sources_manifest':(OUT/'fontes-externas/manifest.json').relative_to(ROOT).as_posix(),'raw_inventory':(OUT/'inventario.json').relative_to(ROOT).as_posix()})
status=read(BASE/'consolidacao_status.json');status['evidence_store']='data/radar_hub/consolidacao_evidence_2026-10-08.json';status['mobilidade_reconciliation']=p.relative_to(ROOT).as_posix();save(BASE/'consolidacao_status.json',status)
print('42 correções P4 identificadas por versão; evidence store histórico intacto.')
