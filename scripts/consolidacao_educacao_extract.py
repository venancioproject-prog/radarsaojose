"""Extrai células nativas de IDEB, aprovação e SAEB; não estima lacunas."""
from pathlib import Path
import json,zipfile,io,re,hashlib
from python_calamine import CalamineWorkbook
ROOT=Path(__file__).resolve().parent.parent
OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
files={'iniciais':ROOT/'data/radar_hub/educacao_raw_2026-10-08/ideb-iniciais2025.zip','finais':OUT/'fontes-externas/ideb-finais2025.zip'}
evidences=[];series={};headers={}
for stage,p in files.items():
 z=zipfile.ZipFile(p);member=next(n for n in z.namelist() if n.endswith('.xlsx'));b=z.read(member);raw_sha=hashlib.sha256(p.read_bytes()).hexdigest();member_sha=hashlib.sha256(b).hexdigest();w=CalamineWorkbook.from_filelike(io.BytesIO(b));sheet=w.get_sheet_by_index(0);rows=sheet.to_python();header_row=next(i for i,r in enumerate(rows) if r[:4]==['SG_UF','CO_MUNICIPIO','NO_MUNICIPIO','REDE']);h=rows[header_row];headers[stage]=h;series[stage]={}
 for i,row in enumerate(rows):
  if len(row)<4 or row[1]!=3549904:continue
  assert row[0]=='SP';network=row[3];series[stage][network]={}
  for j,col in enumerate(h):
   m=re.search(r'_(20\d\d)(?:_|$)',str(col))
   if not m or j<4:continue
   raw=row[j];value=float(raw.replace(',','.')) if isinstance(raw,str) and re.fullmatch(r'\d+(?:,\d+)?',raw) else raw if isinstance(raw,(int,float)) else None
   year=int(m.group(1));key='ideb' if col.startswith('VL_OBSERVADO_') else 'meta' if col.startswith('VL_PROJECAO_') else col.split('_'+str(year))[0]
   eid=f'cons:ideb:{stage}:{network}:{col}'
   e={'evidence_id':eid,'family':'educacao_inep','period':str(year),'stage':stage,'network':network,'native_variable':col,'unit':'nota (0 a 10)' if key in ['ideb','meta','VL_NOTA_MEDIA'] else '%' if col.startswith('VL_APROVACAO') else 'pontos SAEB' if col.startswith('VL_NOTA_') else 'índice de rendimento','territory':'Município das escolas; IBGE 3549904; SP','source_url':f'https://download.inep.gov.br/ideb/resultados/divulgacao_anos_{stage}_municipios_2025.zip','raw_reference':p.relative_to(ROOT).as_posix(),'sha256':raw_sha,'member':member,'member_sha256':member_sha,'sheet':w.sheet_names[0],'row':i+1,'column':j+1,'header_row':header_row+1,'raw_value':raw,'value':value,'status':'CONFIRMADO_FONTE_OFICIAL' if value is not None else 'INDISPONIVEL_NA_FONTE','methodology':'Célula publicada pelo INEP na edição 2025; IDEB não equivale à proficiência SAEB nem ao percentual de alunos proficientes; metas do ciclo 2007–2021; nenhum sinal de ausência convertido em zero.'}
   evidences.append(e);series[stage][network].setdefault(year,{})[key]={'value':value,'evidence_id':eid}
data={'edition':2025,'homologated':False,'sources':headers,'series':series,'evidences':evidences}
(OUT/'educacao-inep-reproduzida.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({s:{n:{y:{k:v['value'] for k,v in r.items() if k in ['ideb','meta']} for y,r in x.items()} for n,x in nets.items()} for s,nets in series.items()},ensure_ascii=False))
