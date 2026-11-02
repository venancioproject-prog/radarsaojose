"""Regeneração adversarial isolada e regressões; preserva relatórios da consolidação."""
from pathlib import Path
import json,hashlib,shutil,subprocess,os,importlib.util
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'docs/dados-publicos-revisao/consolidacao-geral/20261008T060731Z/fechamento-tecnico';OUT.mkdir(exist_ok=True)
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
spec=importlib.util.spec_from_file_location('builder',ROOT/'scripts/build_radar_hub_package.py');builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)
BASE=ROOT/'data/radar_hub';clone=OUT/'reproducao-isolada';base=clone/'data/radar_hub';base.mkdir(parents=True,exist_ok=True)
names=['sjc_open_data_ground_truth.json','sjc_metadata_registry.json','sjc_benchmark_multicidades.json','audit_report.json','radar_hub_consistency.json','economia_audit_bindings.json','financas_audit_bindings.json','meio_ambiente_audit_bindings.json','mobilidade_audit_bindings.json','consolidacao_status.json','mobilidade_reconciliation_20261008.json']
for name in names:shutil.copyfile(BASE/name,base/name)
shutil.copyfile(ROOT/'radar_hub_controller.js',clone/'radar_hub_controller.js')
expected=read(BASE/'radar_hub_package.json');gt=read(base/'sjc_open_data_ground_truth.json');overlay=read(base/'mobilidade_reconciliation_20261008.json')
ids={r['evidence_id'] for r in overlay['overrides']};assert len(ids)==42
for r in gt['eixos']['mobilidade']['series_auditadas']['transporte_bilhetagem']:
 if r['evidence_id'] in ids:
  r['value']=r['normalized_value']=r['display_value']=float(r['raw_value'].replace('.','').replace(',','.'));r['status']='CONFIRMADO'
(base/'sjc_open_data_ground_truth.json').write_text(json.dumps(gt,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
builder.ROOT=clone;builder.BASE=base
regenerated=builder.build();again=builder.build()
assert regenerated==again==expected,'Regeneração precisa corrigir os 42 sem modificar qualquer outro dado/versão'
assert read(base/'sjc_open_data_ground_truth.json')==expected['groundTruth']
assert read(BASE/'sjc_metadata_registry.json')==regenerated['metadataRegistry']
payload={k:v for k,v in regenerated.items() if k not in ['schema_version','dataset_version','source_registry_version','audit_status','auditReport','audit_note']}
fingerprint='sha256:'+hashlib.sha256(builder.canonical(payload).encode()).hexdigest();assert fingerprint==regenerated['dataset_version']
before=read(OUT/'estado-inicial.json');original={r['path']:r['sha256'] for r in before['files']}
assert sha(ROOT/'app.js')==original['app.js']
assert sha(BASE/'sjc_metadata_registry.json')==original['data/radar_hub/sjc_metadata_registry.json']
assert sha(BASE/'sjc_open_data_ground_truth.json')==original['data/radar_hub/sjc_open_data_ground_truth.json']
result={'status':'PASS','revived_in_isolated_clone':42,'regenerations':2,'ids':sorted(ids),'dataset_version':fingerprint,'package_registry_ground_truth_equal':True,'active_data_unchanged':True,'app_js_unchanged':True,'component_sha256':{k:hashlib.sha256(builder.canonical(regenerated[k]).encode()).hexdigest() for k in ['groundTruth','metadataRegistry']},'note':'IDs TOTAL/MÉDIA artificialmente reativados só na cópia isolada; builder restaurou null e suspensões. Registro bruto forense preservado.'}
(OUT/'regeneracao-fingerprint.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
node=Path(os.environ['USERPROFILE'])/'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
env=dict(os.environ,RADAR_CONSOLIDACAO_TEST_OUT=str(OUT/'regressoes'));(OUT/'regressoes').mkdir(exist_ok=True)
tests=['test_radar_hub_p0.cjs','test_economia_runtime.cjs','test_economia_visual.cjs','test_financas_runtime.cjs','test_financas_visual.cjs','test_meio_ambiente_runtime.cjs','test_mobilidade_runtime.cjs','test_saude_runtime.cjs','test_fechamento_tecnico.cjs']
results=[]
for name in tests:
 r=subprocess.run([str(node),'-r',str(ROOT/'scripts/consolidacao_test_guard.cjs'),str(ROOT/'scripts'/name)],cwd=ROOT,env=env,capture_output=True,timeout=300 if name=='test_fechamento_tecnico.cjs' else 120)
 (OUT/'regressoes'/(name+'.log')).write_text((r.stdout+r.stderr).decode('utf8',errors='replace'),encoding='utf8')
 results.append({'test':name,'exit_code':r.returncode,'kind':'Node VM / DOM simulado'});print(name,r.returncode,flush=True)
(OUT/'regressoes.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
assert all(r['exit_code']==0 for r in results),results
