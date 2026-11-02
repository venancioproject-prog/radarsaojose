from pathlib import Path
import subprocess,json,hashlib,datetime
ROOT=Path(__file__).resolve().parent.parent;OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1];RAW=OUT/'fontes-externas'
urls={
 'sidra4711.json':'https://apisidra.ibge.gov.br/values/t/4711/n6/3549904/v/all/p/2022',
 'sidra4712.json':'https://apisidra.ibge.gov.br/values/t/4712/n6/3549904/v/all/p/2022',
 'sidra4714.json':'https://apisidra.ibge.gov.br/values/t/4714/n6/3549904/v/all/p/2022',
 'sidra9514.json':'https://apisidra.ibge.gov.br/values/t/9514/n6/3549904/v/93/p/2022/c2/all/c287/0',
 'sidra9514-total-idade.json':'https://apisidra.ibge.gov.br/values/t/9514/n6/3549904/v/93/p/2022/c2/all/c287/100362',
 '9514-metadados.json':'https://servicodados.ibge.gov.br/api/v3/agregados/9514/metadados',
 'sidra9515.json':'https://apisidra.ibge.gov.br/values/t/9515/n6/3549904/v/all/p/2022',
 'saude-q2025.pdf':'https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/Quadri_3_2025_1_20260227124829.pdf',
 'saude-rag2025.pdf':'https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/RelatAnualGest_2025_1_20260630122107.pdf',
}
m=RAW/'manifest.json';data=json.loads(m.read_text(encoding='utf8'))
for n,u in urls.items():
 p=RAW/n;r=subprocess.run(['curl.exe','--location','--fail','--max-time','70','--silent','--show-error','--output',str(p),'--write-out','%{http_code}\n%{url_effective}\n%{content_type}',u],capture_output=True,text=True)
 x={'url':u,'name':n,'exit_code':r.returncode,'response':r.stdout,'error':r.stderr,'accessed_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 if p.exists():x.update(raw_file=p.relative_to(ROOT).as_posix(),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),bytes=p.stat().st_size)
 data.append(x);m.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print(n,r.returncode,x.get('bytes'),flush=True)
