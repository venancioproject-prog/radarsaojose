from pathlib import Path
import json,hashlib,datetime,re
OUT=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
manifest=json.loads((OUT/'manifest.json').read_text(encoding='utf8'))
urls={'sinopse2024.zip':'http://download.inep.gov.br/dados_abertos/sinopses_estatisticas/sinopse_estatistica_censo_escolar_2024.zip','sinopse2025.zip':'http://download.inep.gov.br/dados_abertos/sinopses_estatisticas/sinopse_estatistica_censo_escolar_2025.zip','TDI2025.zip':'http://download.inep.gov.br/informacoes_estatisticas/indicadores_educacionais/2025/TDI_2025_MUNICIPIOS.zip','rendimento2025.zip':'http://download.inep.gov.br/informacoes_estatisticas/indicadores_educacionais/2025/tx_rend_municipios_2025.zip','distorcao2025.html':'https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/indicadores-educacionais/taxas-de-distorcao-idade-serie/2025','rendimento2025.html':'https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/indicadores-educacionais/taxas-de-rendimento-escolar/2025','ibge60045.json':'https://servicodados.ibge.gov.br/api/v1/pesquisas/10058/indicadores/60045?localidade=354990','censo-catalogo.html':'https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/sinopses-estatisticas/educacao-basica'}
manifest['raw_files']=[{'file':p.name,'sha256':sha(p),'bytes':p.stat().st_size,'url_retrieval':urls[p.name],'url_original':urls[p.name].replace('http:','https:'),'accessed_date':'2026-10-08','http_status':None,'curl_exit_code':0,'transport_note':'DownloadHTTP no hostINÉP oficial; HTTPS2025falhou(reset),semTLSdesativado. Statusnão capturado; não inventado.' if urls[p.name].startswith('http:') else 'HTTPS comvalidação normal do sistema'} for p in sorted((OUT/'raw').iterdir()) if p.name in urls]
manifest['errors']=[{'file':'sinopse2025.zip','attempt_url':urls['sinopse2025.zip'].replace('http:','https:'),'curl_exit_code':35,'message':'Recv failure: Connection was reset','outcome':'Recuperado pelo hostoficialHTTP; zipíntegro'}]
for s in manifest['new_sources']:
 if s['year']==2024:s['retrieval']='HTTPoficial direto; não houve tentativaHTTPS individual2024; motivação falhaTLSdo mesmohostno2025.'
manifest['generated_at']=datetime.datetime.now(datetime.timezone.utc).isoformat()
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
# Espaçamento editorial, sem tocar código/URLs.
p=OUT/'relatorio.md';s=p.read_text(encoding='utf8');lines=[]
for line in s.splitlines():
 if 'http' not in line and '`' not in line:
  line=re.sub(r'(?<=[A-Za-zÀ-ÿ])(?=\d)', ' ',line)
  line=re.sub(r'(?<=\d)(?=[A-Za-zÀ-ÿ])',' ',line)
 lines.append(line)
p.write_text('\n'.join(lines)+'\n',encoding='utf8')
print('Manifest8arquivos atualizado; resultados preservados.')
