"""Rastreia somente scripts/entregáveis selecionados; não faz commit nem push."""
from pathlib import Path
import ast,subprocess,json,hashlib
ROOT=Path(__file__).resolve().parent.parent
OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
selected=set(ROOT.glob('scripts/consolidacao_*.py'))
for p in (ROOT/'scripts').glob('*.py'):
 if any(word in p.name for word in ['economia','financas','meio_ambiente','mobilidade','educacao_p5']) and p.name.startswith(('collect_','build_','apply_','test_','report_','finalize_','enrich_','document_')) and 'browser' not in p.name and 'visual' not in p.name:selected.add(p)
for name in ['economia_sources.py','meio_ambiente_workbooks.py','mobilidade_evidence_core.py','educacao_p5_core.py','build_radar_hub_package.py','generate_geo_bundle.py','registrar_p4_pendencias_20261008.py','saude_documental_20261002.py']:selected.add(ROOT/'scripts'/name)
# Fechamento de imports locais, sem executar aplicadores de auditorias antigas.
deps={};changed=True
while changed:
 changed=False
 for p in list(selected):
  local=[]
  for n in ast.walk(ast.parse(p.read_text(encoding='utf-8-sig'))):
   mods=[n.module] if isinstance(n,ast.ImportFrom) and n.module else [a.name for a in n.names] if isinstance(n,ast.Import) else []
   for mod in mods:
    q=ROOT/'scripts'/(mod.split('.')[0]+'.py')
    if q.is_file():
     local.append(q.relative_to(ROOT).as_posix())
     if q not in selected:selected.add(q);changed=True
  deps[p.relative_to(ROOT).as_posix()]=sorted(set(local))
rel=OUT.relative_to(ROOT).as_posix()
policy=['','# Consolidação 2026-10-08: whitelist de reprodução; nenhum bruto nacional entra no runtime.',*[f'!{p.relative_to(ROOT).as_posix()}' for p in sorted(selected)],'!data/radar_hub/consolidacao_evidence_2026-10-08.json','!docs/','docs/*','!docs/dados-publicos-revisao/','docs/dados-publicos-revisao/*','!docs/dados-publicos-revisao/consolidacao-geral/','docs/dados-publicos-revisao/consolidacao-geral/*',f'!{rel}/',f'{rel}/chrome-test-profile*/',f'{rel}/browser-fixture.html',f'{rel}/diff.txt',f'{rel}/evidencias-integridade.json',f'{rel}/testes-*/saidas-legadas/',f'{rel}/testes-p0-final/', '*.generated.tmp','*.consolidacao.tmp']
ignore=ROOT/'.gitignore';s=ignore.read_text(encoding='utf8');marker='# Consolidação 2026-10-08:'
if marker in s:s=s[:s.index(marker)].rstrip()+'\n'
ignore.write_text(s+'\n'.join(policy)+'\n',encoding='utf8')
requirements=ROOT/'scripts/consolidacao_requirements.txt'
requirements.write_text('requests==2.34.2\npython-calamine==0.8.2\nopenpyxl==3.1.5\nxlrd==2.0.2\npypdf==6.18.0\nwebsocket-client==1.9.0\n',encoding='utf8')
model=ROOT/'data/radar_hub/saude_documental_modelo_20261008'
paths=sorted(selected)+[ROOT/'scripts/consolidacao_test_guard.cjs',requirements,ignore,ROOT/'data/radar_hub/consolidacao_evidence_2026-10-08.json',ROOT/'data/radar_hub/consolidacao_status.json',ROOT/'data/radar_hub/mobilidade_reconciliation_20261008.json',ROOT/'data/radar_hub/saude_documental_rag2025_layout_20261008.txt',*model.glob('*')]
# Somente documentação não ignorada da rodada. Nacional, export pesado, perfil e ZIP continuam fora.
for p in OUT.rglob('*'):
 if not p.is_file():continue
 name=p.relative_to(OUT).as_posix()
 if 'chrome-test-profile' in name or '/saidas-legadas/' in name or name.startswith('testes-p0-final/') or name in ['browser-fixture.html','diff.txt','evidencias-integridade.json'] or p.suffix in ['.zip','.pdf','.csv']:continue
 if subprocess.run(['git','check-ignore','-q',str(p)],cwd=ROOT).returncode!=0:paths.append(p)
paths=sorted(set(paths))
names=[p.relative_to(ROOT).as_posix() for p in paths]
for i in range(0,len(names),40):subprocess.run(['git','add','--',*names[i:i+40]],cwd=ROOT,check=True,capture_output=True)
verified=[]
for p in selected:
 name=p.relative_to(ROOT).as_posix();r=subprocess.run(['git','ls-files','--error-unmatch','--',name],cwd=ROOT,capture_output=True)
 assert r.returncode==0,name
 verified.append({'path':name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'local_dependencies':deps.get(name,[])})
result={'date':'2026-10-08','scripts_count':len(verified),'scripts':sorted(verified,key=lambda r:r['path']),'commit_created':False,'push':False,'note':'Novos scripts incluídos no índice Git; mudanças preexistentes de arquivos da aplicação não foram adicionadas ao índice. Brutos/evidences pesados preservados localmente e identificados em manifests; recuperar por SHA em outro clone.'}
(OUT/'versionamento.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
subprocess.run(['git','add','--',str(OUT/'versionamento.json')],cwd=ROOT,check=True,capture_output=True)
print('Rastreio confirmado:',len(verified),'scripts; sem commit/push.')
