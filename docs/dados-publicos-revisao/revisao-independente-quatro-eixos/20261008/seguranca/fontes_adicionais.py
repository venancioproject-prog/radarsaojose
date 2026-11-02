from pathlib import Path
import json,hashlib,subprocess,datetime,urllib.parse
O=Path(__file__).parent; manifest=json.loads((O/'manifest.json').read_text(encoding='utf-8'))
sources={
'produtividade-2024.json':'https://www.ssp.sp.gov.br/v1/OcorrenciasMensais/RecuperaDadosMensaisAgrupados?'+urllib.parse.urlencode(dict(ano=2024,grupoDelito=9,tipoGrupo='MUNICÍPIO',idGrupo=560)),
'csi-2025-noticia.html':'https://www.sjc.sp.gov.br/noticias/2025/janeiro/03/sao-jose-tem-o-menor-numero-de-homicidio-da-historia/',
'csi-ata-2025.pdf':'https://www.sjc.sp.gov.br/media/zmtcrcma/ata-reuni%C3%A3o-ordin%C3%A1ria-conselho-municipal-seguran%C3%A7a-11-de-dezembro-de-2025.pdf',
'portal-main.js':'https://www.ssp.sp.gov.br/main.1f62405c7a447c0a.js',
'portal-mensal.html':'https://www.ssp.sp.gov.br/estatistica/dados-mensais'}
for name,url in sources.items():
 p=O/name
 if not p.exists():subprocess.run(['curl.exe','-L','--fail','--max-time','60','-sS',url,'-o',str(p)],check=True)
 manifest.append(dict(name=name,url=url,retrieved_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),path=str(p),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),bytes=p.stat().st_size,exit_code=0))
(O/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
