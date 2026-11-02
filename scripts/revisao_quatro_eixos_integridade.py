"""Verifica integração contra snapshot, fontes, fingerprint e limites aprovados."""
from pathlib import Path
import json,hashlib,zipfile,re,functools
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008';BASE=ROOT/'data/radar_hub'
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
@functools.lru_cache(maxsize=None)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def canonical(v):return json.dumps(v,sort_keys=True,ensure_ascii=False,separators=(',',':'))
checks=[]
def check(name,ok):checks.append({'check':name,'pass':bool(ok)});assert ok,name
p=read(BASE/'radar_hub_package.json');gt=read(BASE/'sjc_open_data_ground_truth.json');reg=read(BASE/'sjc_metadata_registry.json');code=(ROOT/'radar_hub_controller.js').read_text(encoding='utf8')
inline=json.loads(re.search(r'const RADAR_HUB_PACKAGE = (.*);\n/\* RADAR_HUB_PACKAGE_END',code).group(1))
check('inline_equals_package',inline==p);check('package_equals_registry',p['metadataRegistry']==reg);check('package_equals_GT',p['groundTruth']==gt)
payload={k:v for k,v in p.items() if k not in ['schema_version','dataset_version','source_registry_version','audit_status','auditReport','audit_note']}
check('fingerprint',p['dataset_version']=='sha256:'+hashlib.sha256(canonical(payload).encode()).hexdigest())
check('no_general_homologation',p['auditReport'] is None and p['audit_status']=='AUDITORIA_NAO_CARREGADA' and p['consolidacaoStatus']['homologated'] is False)
protect=read(OUT/'protecao-antes-integracao.json')
for row in protect['files']:check('protected:'+row['file'],sha(ROOT/row['file'])==row['sha256'])
z=zipfile.ZipFile(OUT/'snapshot-inicial.zip')
oldgt=json.loads(z.read('data/radar_hub/sjc_open_data_ground_truth.json').decode('utf-8-sig'));oldreg=json.loads(z.read('data/radar_hub/sjc_metadata_registry.json').decode('utf-8-sig'))
oldhtml=z.read('app.html').decode('utf-8-sig').replace('\r\n','\n');html=(ROOT/'app.html').read_text(encoding='utf8')
for axis in ['economia','financas','meio_ambiente','mobilidade']:
    check('GT_P1_P4:'+axis,gt['eixos'][axis]==oldgt['eixos'][axis])
    check('registry_P1_P4:'+axis,[i for i in reg['indicators'] if i['category']==axis]==[i for i in oldreg['indicators'] if i['category']==axis])
    def section(s):
        start=s.index('id="hub-axis-container-'+axis+'"');m=re.search(r'id="hub-axis-container-[^"]+"',s[start+1:]);return s[start:start+1+m.start()] if m else s[start:]
    check('HTML_P1_P4:'+axis,section(html)==section(oldhtml))
check('registry_122_unique',len(reg['indicators'])==len({i['indicator_id'] for i in reg['indicators']})==122)
check('registry_28_null',len([i for i in reg['indicators'] if i['value'] is None])==28)
approved=read(OUT/'decisoes-integracao.json')
byid={i['indicator_id']:i for i in reg['indicators']}
for id,value in approved['promotions'].items():check('promotion:'+id,byid[id]['value']==value and byid[id]['verificacao']=='primaria')
for id,item in approved['active_updates'].items():check('active_refresh:'+id,byid[id]['value']==item['value'] and byid[id]['base_year']==item['year'])
check('saude_9_suspensions',len([i for i in reg['indicators'] if i['category']=='saude' and i['value'] is None])==9)
check('education_meta_2023_null',all(byid[id]['value'] is None for id in ['educ_ideb_meta_iniciais','educ_ideb_meta_finais']))
geo=read(BASE/'sjc_setores_socioeconomicos_geo.json');check('geometry_35_suspended',len(geo['features'])==35 and all(f['properties']['populacao'] is None for f in geo['features']))
names=['educacao','saude','seguranca','demografia'];ids=set();rows=0;sources=set()
for axis in names:
    data=gt['eixos'][axis]
    for family,items in data['series_auditadas'].items():
        for r in items:
            check('unique:'+r['evidence_id'],r['evidence_id'] not in ids);ids.add(r['evidence_id']);rows+=1
            source=data['series_metadata'][r['source_metadata_id']];sources.add((source['raw_file'],source['sha256']))
            check('record_contract:'+r['evidence_id'],isinstance(r['period'],str) and bool(r['unit']) and bool(r['locator']))
            if r['status'].startswith('SUSPENSO') or r['status']=='SEM_COMPETENCIA_PUBLICADA':check('suspended_null:'+r['evidence_id'],r['value'] is None)
for path,h in sources:check('source:'+path,sha(ROOT/path)==h)
overlay=read(BASE/'mobilidade_reconciliation_20261008.json');bill={r['evidence_id']:r for r in gt['eixos']['mobilidade']['series_auditadas']['transporte_bilhetagem']}
check('42_P4_null',len(overlay['overrides'])==42 and all(bill[r['evidence_id']]['value'] is None and bill[r['evidence_id']]['status']=='SUSPENSO_ERRO_COLUNA' for r in overlay['overrides']))
runtime=re.sub(r'/\* RADAR_HUB_PACKAGE_START \*/.*?/\* RADAR_HUB_PACKAGE_END \*/','',code,flags=re.S)
check('denominator_removed',re.search(r'/\s*142850\b',runtime) is None)
check('no_fake_static_claims',all(s not in html for s in ['557.069 alfabetizados','1º lugar em menor taxa de homicídios','Atuações operacionais homologadas']))
check('current_consistency',all(c['pass'] for c in p['consistency']['revisao_quatro_eixos']['current_checks']))
result={'status':'PASS','checks_count':len(checks),'records':rows,'source_files':len(sources),'dataset_version':p['dataset_version'],
    'package_bytes':(BASE/'radar_hub_package.json').stat().st_size,'controller_bytes':(ROOT/'radar_hub_controller.js').stat().st_size,'checks':checks}
(OUT/'integridade-final.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({k:v for k,v in result.items() if k!='checks'},ensure_ascii=False))
