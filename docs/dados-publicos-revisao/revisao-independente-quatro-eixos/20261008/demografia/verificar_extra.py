import json,pathlib
p=pathlib.Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/demografia/brutos')
for n in ['sidra202-historica.json','sidra9605.json','sidra9923.json']:print(n,json.loads((p/n).read_text())[1:])
g=json.load(open('data/radar_hub/sjc_setores_socioeconomicos_geo.json',encoding='utf-8-sig'));print('GEO',len(g['features']));print(g['features'][0]['properties']);print(g['metadata'])
