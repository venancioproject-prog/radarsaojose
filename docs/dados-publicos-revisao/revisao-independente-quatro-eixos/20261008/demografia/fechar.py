import pathlib,re,json
P=pathlib.Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/demografia')
p=P/'coletar2.py';s=p.read_text(encoding='utf-8-sig');p.write_text('import re\n'+s,encoding='utf-8')
p=P/'relatorio.md';s=p.read_text(encoding='utf-8-sig');s=re.sub(r'(?<=[A-Za-zÀ-ÿ])(?=[0-9])|(?<=[0-9])(?=[A-Za-zÀ-ÿ])',' ',s);p.write_text(s,encoding='utf-8')
print('files',len(list(P.rglob('*'))),'raw bytes',sum(p.stat().st_size for p in (P/'brutos').iterdir()))
