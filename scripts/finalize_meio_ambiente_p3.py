from collect_meio_ambiente_p3 import ROOT,BASE,RAW,OUT,read
import subprocess,json,hashlib
commands=[['python','-X','utf8','scripts/test_meio_ambiente_p3.py'],['node','--check','radar_hub_controller.js'],['node','scripts/test_meio_ambiente_runtime.cjs']]+[['node','scripts/test_meio_ambiente_regressions.cjs',name] for name in ['test_economia_visual.cjs','test_financas_visual.cjs','test_saude_runtime.cjs','test_radar_hub_p0.cjs']]
outputs=[];failed=False
for cmd in commands:
 r=subprocess.run(cmd,cwd=ROOT,capture_output=True,encoding='utf8',errors='replace',timeout=100)
 outputs.append('COMMAND: '+' '.join(cmd)+'\nEXIT: '+str(r.returncode)+'\n'+r.stdout+r.stderr);print(' '.join(cmd),r.returncode,flush=True);failed|=r.returncode!=0
(OUT/'testes.txt').write_text('\n\n'.join(outputs),encoding='utf8')
for name,args in [('status',['status','--short']),('stat',['diff','--stat']),('appjs',['diff','--','app.js'])]:(OUT/f'git-after-{name}.txt').write_bytes(subprocess.check_output(['git',*args],cwd=ROOT))
snapshot=read(OUT/'snapshot-inicial.json');files=[]
for f in ['app.html','radar_hub_controller.js','scripts/build_radar_hub_package.py','data/radar_hub/sjc_open_data_ground_truth.json','data/radar_hub/sjc_metadata_registry.json','data/radar_hub/radar_hub_consistency.json','data/radar_hub/radar_hub_package.json','data/radar_hub/meio_ambiente_audit_bindings.json','data/radar_hub/meio_ambiente_evidence_2026-10-05.json']:
 p=ROOT/f;files.append({'path':f,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'before_sha256':snapshot['hashes'].get(f),'scope_note':'P3 — apenas Meio Ambiente; arquivos compartilhados contêm demais eixos preservados.'})
for p in sorted((ROOT/'scripts').glob('*meio_ambiente*')):
 if p.is_file():files.append({'path':str(p.relative_to(ROOT)).replace('\\','/'),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
files.append({'path':'scripts/inspect_snis_old_layout.py','scope_note':'Inspeção de layout legado; não publica dados.'})
files.extend([{'path':str(OUT.relative_to(ROOT)).replace('\\','/')+'/','files':len(list(OUT.rglob('*'))),'scope_note':'Relatório, snapshot inicial, matrizes, métodos, testes e Git.'},{'path':str(RAW.relative_to(ROOT)).replace('\\','/')+'/','files':len(list(RAW.rglob('*'))),'scope_note':'Fontes primárias brutas e consultas desta rodada.'}])
(OUT/'arquivos-alterados-p3.json').write_text(json.dumps(files,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
assert (OUT/'git-before-appjs.txt').read_bytes()==(OUT/'git-after-appjs.txt').read_bytes(),'app.js mudou por edição concorrente; investigar antes de declarar preservado.'
if failed:raise SystemExit('Há testes com falha: ler testes.txt')
print('P3 validada e Git registrado; aguarda revisão humana.')
