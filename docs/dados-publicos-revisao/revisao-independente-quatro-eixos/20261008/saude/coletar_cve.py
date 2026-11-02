from pathlib import Path
import subprocess,json,hashlib,datetime,zipfile
O=Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/saude');m=json.loads((O/'manifest.json').read_text(encoding='utf-8'));base='https://www.saude.sp.gov.br/resources/cve-centro-de-vigilancia-epidemiologica/areas-de-vigilancia/doencas-de-transmissao-por-vetores-e-zoonoses/dados/dengue/'
for year,filename in [(2019,'dengue2019_import_res.csv'),(2024,'dengue24_mes.csv'),(2025,'dengue_csv_2025.zip'),(2020,'dengue2020_import_res.csv'),(2021,'dengue2021_mes.csv'),(2022,'dengue2022_mes.csv'),(2023,'dengue23_mes.csv')]:
 u=base+str(year)+'/'+filename;p=O/'raw'/('cve-'+filename)
 if p.exists():continue
 c=subprocess.run(['curl.exe','-L','--max-time','35','-sS','-w','%{http_code}','-o',str(p),u],capture_output=True,text=True);r=dict(url=u,raw=str(p).replace('\\','/'),accessed_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),http_status=c.stdout,exit_code=c.returncode,error=c.stderr)
 if p.exists():r.update(bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
 m.append(r);(O/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2),encoding='utf-8');print(year,c.stdout,flush=True)
 if zipfile.is_zipfile(p):
  with zipfile.ZipFile(p) as z:print(z.namelist(),z.read(z.namelist()[0])[:800])
