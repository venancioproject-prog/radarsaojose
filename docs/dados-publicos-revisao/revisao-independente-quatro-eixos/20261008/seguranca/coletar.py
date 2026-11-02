from pathlib import Path
import subprocess,json,hashlib,datetime,urllib.parse
O=Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/seguranca'); sources={
'municipios':'https://www.ssp.sp.gov.br/v1/Municipios/RecuperaMunicipios',
'ocorrencias':'https://www.ssp.sp.gov.br/v1/OcorrenciasAnuais/recuperaDadosMunicipio?idMunicipio=560',
'taxas':'https://www.ssp.sp.gov.br/v1/TaxaDelito/RecuperaDadosMunicipio?idMunicipio=560',
'pda':'https://www.ssp.sp.gov.br/assets/download/Dados_Abertos.pdf'}
for y in (2023,2024,2025,2026):sources[f'mensal-{y}']='https://www.ssp.sp.gov.br/v1/OcorrenciasMensais/RecuperaDadosMensaisAgrupados?'+urllib.parse.urlencode(dict(ano=y,grupoDelito=6,tipoGrupo='MUNICÍPIO',idGrupo=560))
manifest=[]
for name,url in sources.items():
 p=O/(name+('.pdf' if name=='pda' else '.json')); q=subprocess.run(['curl.exe','-L','--fail','--max-time','60','-sS',url,'-o',str(p)],capture_output=True)
 rec=dict(name=name,url=url,retrieved_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),exit_code=q.returncode,error=q.stderr.decode(errors='replace'))
 if p.exists():rec.update(path=str(p),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),bytes=p.stat().st_size)
 manifest.append(rec)
(O/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
for y in (2023,2024,2025,2026):
 p=O/f'mensal-{y}.json';print(y,p.read_text(encoding='utf-8')[:2000] if p.exists() else 'failed')
