"""Reproduz IDEB=N*P dentro dos intervalos de arredondamento publicados."""
from pathlib import Path
import json
OUT=Path(__file__).resolve().parent;ROOT=next(p for p in OUT.parents if (p/'app.js').exists())
d=json.loads((ROOT/'docs/dados-publicos-revisao/consolidacao-geral/20261008T060731Z/educacao-inep-reproduzida.json').read_text(encoding='utf8'))
tests=[]
for stage,nets in d['series'].items():
 for network,years in nets.items():
  for year,r in years.items():
   if 'ideb' not in r:continue
   obs=r['ideb']['value'];n=r.get('VL_NOTA_MEDIA',{}).get('value');p=r.get('VL_INDICADOR_REND',{}).get('value')
   if any(v is None for v in [obs,n,p]):continue
   lo=(n-.005)*(p-.005);hi=(n+.005)*(p+.005)
   passed=lo<=obs+.05 and hi>=obs-.05
   tests.append({'stage':stage,'network':network,'year':year,'ideb':obs,'N':n,'P':p,'product':n*p,'published_rounding_interval_product':[lo,hi],'ideb_rounding_interval':[obs-.05,obs+.05],'pass':passed,'evidence_ids':[r[k]['evidence_id'] for k in ['ideb','VL_NOTA_MEDIA','VL_INDICADOR_REND']]})
assert len(tests)==66 and all(t['pass'] for t in tests)
(OUT/'testes-calculo-ideb.json').write_text(json.dumps({'status':'PASS','count':len(tests),'methodology':'Nota média padronizada N e índice de rendimento P publicados com2decimais; IDEBcom1. Verifica interseção dos intervalos de arredondamento. Não recalcula pesos de escolas a partir de dados ausentes; não usa média aritmética por rede.','tests':tests},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('PASS66 produtos IDEB com precisão publicada')
