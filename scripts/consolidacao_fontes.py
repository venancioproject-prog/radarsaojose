"""Coleta independente: respostas originais, sem desativar validação TLS."""
from pathlib import Path
import subprocess,json,hashlib,datetime
ROOT=Path(__file__).resolve().parent.parent
OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
RAW=OUT/'fontes-externas';RAW.mkdir(exist_ok=True)
sources={
 'ideb-finais2025.zip':'https://download.inep.gov.br/ideb/resultados/divulgacao_anos_finais_municipios_2025.zip',
 'ssp-municipios.json':'https://www.ssp.sp.gov.br/v1/Municipios/RecuperaMunicipiosPorRegiao?idRegiao=3',
 'ssp-taxas.json':'https://www.ssp.sp.gov.br/v1/TaxaDelito/RecuperaDadosMunicipio?idMunicipio=560',
 'ssp-ocorrencias.json':'https://www.ssp.sp.gov.br/v1/OcorrenciasAnuais/recuperaDadosMunicipio?idMunicipio=560',
 'ibge-10058.json':'https://servicodados.ibge.gov.br/api/v1/pesquisas/10058/indicadores?localidade=354990',
 'ibge-escolarizacao.json':'https://servicodados.ibge.gov.br/api/v1/pesquisas/10045/indicadores/60045/resultados/354990',
}
manifest=[]
for name,url in sources.items():
 target=RAW/name
 r=subprocess.run(['curl.exe','--location','--fail','--max-time','150','--silent','--show-error','--output',str(target),'--write-out','%{http_code}\n%{url_effective}\n%{content_type}',url],capture_output=True,text=True)
 row={'name':name,'url':url,'accessed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'transport':'curl HTTPS com validação TLS padrão','exit_code':r.returncode,'response':r.stdout,'error':r.stderr}
 if target.exists():row.update(raw_file=target.relative_to(ROOT).as_posix(),bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest())
 manifest.append(row);(RAW/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8');print(name,r.returncode,row.get('bytes'),flush=True)
