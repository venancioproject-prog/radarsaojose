"""Inventário de alterações desta fase; não mistura alterações preexistentes do usuário."""
from pathlib import Path
import json,hashlib,subprocess,zipfile
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def canonical(v):return json.dumps(v,sort_keys=True,ensure_ascii=False,separators=(',',':'))
initial=json.loads((OUT/'estado-inicial.json').read_text(encoding='utf8'));old={r['path']:r for r in initial['files']}
z=zipfile.ZipFile(OUT/'snapshot-inicial.zip');oldpkg=json.loads(z.read('data/radar_hub/radar_hub_package.json').decode('utf-8-sig'))
changed=[]
for n in ['app.html','radar_hub_controller.js','data/radar_hub/sjc_open_data_ground_truth.json','data/radar_hub/sjc_metadata_registry.json','data/radar_hub/radar_hub_package.json']:
    f=ROOT/n;changed.append({'path':n,'kind':'alterado nesta fase','before_sha256':old[n]['sha256'],'sha256':sha(f),'bytes':f.stat().st_size,'git_ignored':n.endswith('/radar_hub_package.json')})
for n,k in [('data/radar_hub/radar_hub_consistency.json','consistency'),('data/radar_hub/consolidacao_status.json','consolidacaoStatus')]:
    f=ROOT/n;changed.append({'path':n,'kind':'derivado/metadata atualizados; histórico preservado','before_object_sha256':hashlib.sha256(canonical(oldpkg[k]).encode()).hexdigest(),'sha256':sha(f),'bytes':f.stat().st_size})
changed.append({'path':'.gitignore','kind':'exceções restritas para documentos/scripts desta revisão; raws grandes e clones continuam ignorados','sha256':sha(ROOT/'.gitignore'),'bytes':(ROOT/'.gitignore').stat().st_size})
changed.append({'path':'.gitattributes','kind':'preserva bytes/hashes da pasta de evidências e scripts novos; não altera regras dos demais arquivos','sha256':sha(ROOT/'.gitattributes'),'bytes':(ROOT/'.gitattributes').stat().st_size})
new=sorted(ROOT.glob('scripts/revisao_quatro_eixos_*.py'))+[ROOT/'scripts/test_revisao_quatro_eixos.cjs']
for f in new:changed.append({'path':str(f.relative_to(ROOT)).replace('\\','/'),'kind':'script novo desta fase','sha256':sha(f),'bytes':f.stat().st_size})
# git lista somente documentos publicáveis: não atravessa os raws/perfis/clones ignorados.
r=subprocess.run(['git','ls-files','--cached','--others','--exclude-standard','--',str(OUT.relative_to(ROOT)).replace('\\','/')],cwd=ROOT,capture_output=True,check=True)
for n in sorted(set(r.stdout.decode('utf8').splitlines())):
    if n.endswith(('arquivos-alterados.json','arquivos-alterados.md')):continue
    f=ROOT/n
    if f.is_file():changed.append({'path':n,'kind':'evidência/manifest/relatório/script novo','sha256':sha(f),'bytes':f.stat().st_size})
obj={'scope':'Somente esta revisão; estado inicial tinha alterações anteriores que não são atribuídas a esta fase. Sem commit/push/deploy.','files':changed,
     'protected':'app.js, GT/registry P1–P4, geometrias e bindings protegidos em integridade-final.json.',
     'excluded_large_files':'Raws nacionais, raw/ e brutos/ dos pesquisadores, perfis Chrome, cópia adversarial e propostas GT duplicadas. Preservados localmente; fontes/hash em manifests.',
     'self_reference':'Este inventário e sua versão Markdown não têm hash de si mesmos.'}
(OUT/'arquivos-alterados.json').write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
text='# Arquivos desta revisão\n\n'+obj['scope']+'\n\n'+obj['protected']+'\n\n'+obj['excluded_large_files']+'\n\n|Arquivo|Tipo|Bytes|SHA256|\n|---|---|---:|---|\n'
for f in changed:text+=f"|`{f['path']}`|{f['kind']}|{f['bytes']}|`{f['sha256']}`|\n"
(OUT/'arquivos-alterados.md').write_text(text,encoding='utf8')
print(json.dumps({'files':len(changed),'new_scripts':len(new),'largest_document_bytes':max(f['bytes'] for f in changed if f['path'].startswith('docs/'))},ensure_ascii=False))
