"""Executa suites VM preservando relatórios anteriores; não chama navegador."""
from pathlib import Path
import subprocess,os,json,datetime
ROOT=Path(__file__).resolve().parent.parent
OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
PHASE=os.environ.get('RADAR_TEST_PHASE','baseline');TARGET=OUT/('testes-'+PHASE);TARGET.mkdir(exist_ok=True)
env=dict(os.environ,RADAR_CONSOLIDACAO_TEST_OUT=str(TARGET))
node=Path(os.environ['USERPROFILE'])/'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
names=['test_radar_hub_p0.cjs','test_economia_runtime.cjs','test_economia_visual.cjs','test_financas_runtime.cjs','test_financas_visual.cjs','test_meio_ambiente_runtime.cjs','test_mobilidade_runtime.cjs','test_saude_runtime.cjs']
rows=[]
for name in names:
 try:
  r=subprocess.run([str(node),'-r',str(ROOT/'scripts/consolidacao_test_guard.cjs'),str(ROOT/'scripts'/name)],cwd=ROOT,env=env,capture_output=True,timeout=90)
  output=(r.stdout+r.stderr).decode('utf8',errors='replace');code=r.returncode
 except subprocess.TimeoutExpired as e:output=str(e);code='TIMEOUT'
 (TARGET/(name+'.log')).write_text(output,encoding='utf8');rows.append({'test':name,'exit_code':code,'kind':'Node VM / DOM simulado','output':str((TARGET/(name+'.log')).relative_to(ROOT))});print(name,code,flush=True)
 (TARGET/'resultados.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
