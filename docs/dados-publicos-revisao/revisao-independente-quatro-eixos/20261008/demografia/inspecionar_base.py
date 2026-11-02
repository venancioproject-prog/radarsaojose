import pathlib,json,re
p=pathlib.Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/demografia')
d=json.loads((p.parent/'demografia-canonicoinicial.json').read_text(encoding='utf-8-sig'));print(json.dumps(d['ground_truth'],ensure_ascii=False)[:17000])
for f in pathlib.Path('data/radar_hub').glob('*geo*'):
 g=json.loads(f.read_text());print(f,g.keys());print(g.get('metadata'));print([(x['properties'].get('codigo'),x['properties'].get('nome'),x['properties'].get('CD_BAIRRO')) for x in g.get('features',[])][:40]);print(g.get('features',[{}])[0].get('properties'))
