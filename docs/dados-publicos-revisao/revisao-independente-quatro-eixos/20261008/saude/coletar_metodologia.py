from pathlib import Path
import subprocess,json,hashlib,datetime
O=Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/saude');m=json.loads((O/'manifest.json').read_text(encoding='utf-8'))
for name,u in [('pni-portaria2025.html','https://bvsms.saude.gov.br/bvs/saudelegis/gm/2025/prt6878_25_04_2025.html'),('sih-notas.pdf','https://tabnet.datasus.gov.br/cgi/sih/Proced_hosp_loc_int_2008.pdf'),('cve-catalogo.html','https://www.saude.sp.gov.br/cve-centro-de-vigilancia-epidemiologica-prof.-alexandre-vranjac/areas-de-vigilancia/doencas-de-transmissao-por-vetores-e-zoonoses/arboviroses-urbanas/dados-estatisticos/dengue-dados-estatisticos'),('cnes-metodologia.html','https://wiki.datasus.gov.br/cnes/index.php/Pain%C3%A9is_ElastiCNES')]:
 p=O/'raw'/name
 if p.exists():continue
 c=subprocess.run(['curl.exe','-L','--max-time','30','-sS','-w','%{http_code}','-o',str(p),u],capture_output=True,text=True);r=dict(url=u,raw=str(p).replace('\\','/'),accessed_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),http_status=c.stdout,exit_code=c.returncode,error=c.stderr)
 if p.exists():r.update(bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
 m.append(r);(O/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2),encoding='utf-8');print(name,c.stdout,flush=True)
