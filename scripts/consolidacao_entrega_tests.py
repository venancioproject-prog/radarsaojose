"""Valida artefatos da entrega e evidência do navegador já executado."""
from pathlib import Path
import json,re,hashlib,subprocess
ROOT=Path(__file__).resolve().parent.parent
OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'));checks=[]
def check(name,ok):
 assert ok,name
 checks.append(name)
pkg=read(ROOT/'data/radar_hub/radar_hub_package.json');browser=read(OUT/'testes-chrome-real.json')
for s in browser['scenarios']:
 e=s['export'];check(s['mode']+' versão canônica',e['version']==pkg['dataset_version'])
 check(s['mode']+' exportação completa/null/fontes',e['count']==122 and e['nullCount']==34 and e['csvBOM'] and e['periods'] and e['sourceLinks'] and e['mobFuture']==0 and e['completeCompetencePreserved'])
 check(s['mode']+' todos os gráficos com dado ou fallback',all(c['rendered'] or c['fallback'] for a in s['axes'] for c in a['charts']))
check('Sem exceção JavaScript no Chrome',not any(e['method']=='Runtime.exceptionThrown' for e in browser['events']))
deps=read(OUT/'dependencias.json');code=(ROOT/'radar_hub_controller.js').read_text(encoding='utf8');html=(ROOT/'app.html').read_text(encoding='utf8')
card=re.search(r'data-radar-indicator="educ_matriculas_total_censo".*?</span>\s*<span[^>]*>(.*?)</span>',html,re.S)
check('Unidade matrícula não aluno único',card is not None and card[1]=='matrículas')
for f in deps['controller_functions']:check('Função preservada '+str(f),str(f) in code)
for c in deps['canvas_ids']:check('Canvas preservado '+str(c),str(c) in html)
for r in read(OUT/'fontes-externas/manifest.json'):
 if r.get('raw_file'):
  p=ROOT/r['raw_file'];check('Manifest SHA '+p.name,p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==r['sha256'])
for f in ['relatorio-final.md','matriz-consolidacao.md','antes-depois-indicadores.json','matriz-cobertura-historica.json','matriz-oportunidades.json','manifest-evidence-stores.json','reproducao.md','testes.md','desempenho.md','pendencias-metodologicas.md','arquivos-alterados.json','versionamento.json']:
 check('Entregável '+f,(OUT/f).is_file())
for label,url in re.findall(r'\[([^\]]+)\]\(([^)]+)\)',(OUT/'relatorio-final.md').read_text(encoding='utf8')):
 if not url.startswith(('https:','http:')):check('Link de relatório '+label,(OUT/url).is_file())
for r in read(OUT/'versionamento.json')['scripts']:
 p=ROOT/r['path'];check('Script no Git '+r['path'],subprocess.run(['git','ls-files','--error-unmatch','--',r['path']],cwd=ROOT,capture_output=True).returncode==0)
 check('Hash do script versionado '+r['path'],hashlib.sha256(p.read_bytes()).hexdigest()==r['sha256'])
result={'status':'PASS','checks_count':len(checks),'checks':checks,'dataset_version':pkg['dataset_version']}
(OUT/'testes-entrega.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print('PASS',len(checks),'verificações de entrega')
