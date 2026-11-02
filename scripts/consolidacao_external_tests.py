"""Reprodução externa, separada dos antigos contratos de escopo de cada fase."""
from pathlib import Path
import json,hashlib,zipfile,io,sys,traceback
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1];sys.path.insert(0,str(ROOT/'scripts'))
results=[]
def run(name,filename,start,end,extra=''):
 source=(ROOT/'scripts'/filename).read_text(encoding='utf8');imports=source.split('ROOT=',1)[0] if filename!='test_meio_ambiente_p3.py' else '\n'.join(source.splitlines()[1:4])
 # Só imports: excluir docstring e declarações de escopo; o bloco externo não escreve artefatos.
 imports='\n'.join(line for line in imports.splitlines() if line.startswith(('import ','from ')))
 body=source.split(start,1)[1].split(end,1)[0]
 ns={'ROOT':ROOT,'BASE':BASE,'read':lambda p:json.loads(p.read_text(encoding='utf-8-sig')),'__file__':str(ROOT/'scripts'/filename)}
 ns.update(reg=ns['read'](BASE/'sjc_metadata_registry.json'),code=(ROOT/'radar_hub_controller.js').read_text(encoding='utf8'))
 store=ns['read'](BASE/({'economia':'economia_evidence_2026-10-04.json','financas':'financas_evidence_2026-10-05.json','meio_ambiente':'meio_ambiente_evidence_2026-10-05.json'}[name]));ns.update(store=store,emap={e['evidence_id']:e for e in store['evidences']},cache={},checks=[],check=lambda n,c: c or (_ for _ in ()).throw(AssertionError(n)))
 try:
  exec(compile(imports+'\n'+extra+'\n'+body,filename+' [bloco externo]','exec'),ns)
  result={'test':name,'status':'PASS','kind':'Releitura de bruto e fórmulas; contratos históricos de outros eixos não executados','evidences':len(store['evidences'])}
 except Exception as e:result={'test':name,'status':'FAIL','error':str(e),'trace':traceback.format_exc()}
 results.append(result);print(name,result['status'],result.get('error',''),flush=True)
if '--only-p3' not in sys.argv:
 run('economia','test_economia_audit.py','# Reparse the exact fixed-width records; no GT-to-GT equality as external proof.','controller=(ROOT/',extra='from decimal import Decimal\nimport openpyxl')
 run('financas','test_financas_audit.py','zero=0;derived_zero=0;conflict=0',"fin=pkg['groundTruth']",extra='zero=0;derived_zero=0;conflict=0')
else:results=[r for r in json.loads((OUT/'testes-reproducao-externa.json').read_text(encoding='utf8')) if r['test']!='meio_ambiente']
run('meio_ambiente','test_meio_ambiente_p3.py','cache={};sheet_cache={};numeric=0','results={',extra='cache={};sheet_cache={};numeric=0')
(OUT/'testes-reproducao-externa.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
sys.exit(1 if any(r['status']=='FAIL' for r in results) else 0)
