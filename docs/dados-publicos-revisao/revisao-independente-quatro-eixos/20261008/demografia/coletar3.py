exec(open('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/demografia/coletar.py',encoding='utf-8-sig').read().split('with concurrent.futures')[0])
urls={'estimativa2026.xlsx':'https://ftp.ibge.gov.br/Estimativas_de_Populacao/Estimativas_2026/estimativa_dou_2026.xlsx','4711-metadados.json':'https://servicodados.ibge.gov.br/api/v3/agregados/4711/metadados','9922-metadados.json':'https://servicodados.ibge.gov.br/api/v3/agregados/9922/metadados'}
results=[get(kv) for kv in urls.items()];manifest=json.loads((out/'manifest.json').read_text());manifest.extend(results);(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8');print(results)
from python_calamine import CalamineWorkbook
w=CalamineWorkbook.from_path(str(out/'brutos/estimativa2026.xlsx'))
for s in w.sheet_names:
 rows=w.get_sheet_by_name(s).to_python();print('SHEET',s,'HEADER',rows[:9]);print([(i,r) for i,r in enumerate(rows) if any('José dos Campos' in str(c) for c in r)])
