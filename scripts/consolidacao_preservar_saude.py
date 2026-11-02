"""Remove a dependência de um aplicador temporário: preserva somente cálculo/modelo."""
from pathlib import Path
import json,hashlib
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub'
tmp=ROOT/'tmp/saude-audit';source=(tmp/'apply_data.py').read_text(encoding='utf8').split('legacy=dict(',1)[0]
source=source.replace("TMP = ROOT / 'tmp/saude-audit'","TMP = ROOT / 'data/radar_hub/saude_documental_modelo_20261008'")
source=source.replace("layout=(TMP/'rag2025-layout.txt').read_text(encoding='utf-8')","layout=(ROOT/'data/radar_hub/saude_documental_rag2025_layout_20261008.txt').read_text(encoding='utf-8')")
source=source.replace("0 if v=='-'", "None if v=='-'").replace("sum(r['valores'][str(y)] for r in sih.values())", "sum(r['valores'][str(y)] for r in sih.values() if r['valores'][str(y)] is not None)").replace("sum(r['valores'][str(y)] for r in sim.values())", "sum(r['valores'][str(y)] for r in sim.values() if r['valores'][str(y)] is not None)").replace("sorted(sih.items(),key=", "sorted(((ch,r) for ch,r in sih.items() if r['valores'][str(year)] is not None),key=")
(ROOT/'scripts/saude_documental_20261002.py').write_text('"""Cálculo documental preservado; executar somente em memória pela consolidação. Não homologa fontes."""\n'+source,encoding='utf8')
model=BASE/'saude_documental_modelo_20261008';model.mkdir(exist_ok=True)
old=json.loads((tmp/'sjc_open_data_ground_truth.json.before').read_text(encoding='utf8'));reg=json.loads((tmp/'sjc_metadata_registry.json.before').read_text(encoding='utf8'))
for name,data in [('sjc_open_data_ground_truth.json',{'role':'Modelo de estrutura legado, não dado ativo','eixos':{'saude':old['eixos']['saude']}}),('sjc_metadata_registry.json',{'role':'Modelo de metadados legado, não dado ativo','indicators':[i for i in reg['indicators'] if i['category']=='saude']})]:
 (model/(name+'.before')).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
p=BASE/'saude_documental_rag2025_layout_20261008.txt';p.write_bytes((tmp/'rag2025-layout.txt').read_bytes())
(model/'manifest.json').write_text(json.dumps({'role':'Modelos não são evidência externa. Layout é extrato derivado, PDF oficial continua sendo fonte.','layout_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'pdf_sha256':'8d14b06619c9f1080409fcd9eb219cd72e1049a790c759942f9bded36be2db20','pdf_url':'https://servicos.sjc.sp.gov.br/portal_da_transparencia/adm/relatorio_gestao/arquivos/RelatAnualGest_2025_1_20260630122107.pdf'},ensure_ascii=False,indent=2),encoding='utf8')
print('Cálculo documental preservado em scripts; modelos e manifesto separados do dado ativo.')
