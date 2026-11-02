import re
exec(open('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/demografia/coletar.py',encoding='utf-8-sig').read().split('with concurrent.futures')[0])
urls={'sidra9514-quinquenal-correto.json':urls['sidra9514-quinquenal.json'].replace('/c12311/','/c286/'),'9514-metadados.json':'https://servicodados.ibge.gov.br/api/v3/agregados/9514/metadados','6579-metadados.json':'https://servicodados.ibge.gov.br/api/v3/agregados/6579/metadados','sidra9922.json':'https://apisidra.ibge.gov.br/values/t/9922/n6/3549904/v/all/p/2022','estimativa2026.xls':'https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2026/estimativa_dou_2026.xls'}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex: results=list(ex.map(get,urls.items()))
manifest=json.loads((out/'manifest.json').read_text());manifest.extend(results);(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8');print(results)
print(re.findall('href="([^"]+)"',(out/'brutos/estimativas-diretorio.html').read_text(encoding='latin1')))
