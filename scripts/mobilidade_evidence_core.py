from collect_mobilidade_p4 import *
import unicodedata,math
def norm(v):return ''.join(c for c in unicodedata.normalize('NFD',str(v).upper()) if unicodedata.category(c)!='Mn').strip()
def num(v):
 if v is None or isinstance(v,bool):return None
 if isinstance(v,(float,int)):return v if math.isfinite(v) else None
 t=str(v).strip().replace('R$','').replace(' ','')
 if not t or t in ['-','...','..']:return None
 try:return float(t.replace('.','').replace(',','.')) if '.' in t or ',' in t else int(t)
 except ValueError:return None
class Store:
 def __init__(self):self.evidences=[];self.series={};self.logs=read(RAW/'consultas.json');self.notes=[]
 def add(self,file,family,period,value,unit,variable,locator,universe,**kw):
  source=next(l for l in reversed(self.logs) if l.get('name')==file and l.get('status')=='OK');eid='mob:'+hashlib.sha256(json.dumps([file,family,period,variable,locator],sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:20]
  e=dict(evidence_id=eid,indicator_id=family,family=family,institution='Prefeitura de São José dos Campos / Secretaria de Mobilidade Urbana',dataset=file,source_url=source['url'],url=source['url'],accessed_at=source['accessed_at'],territory='São José dos Campos — SP',ibge_code='3549904',source_specific_code=None,period=str(period),competence=str(period),frequency='monthly',universe=universe,variable=variable,category=variable,unit=unit,raw_value=value,normalized_value=value,value=value,display_value=value,transformation=None,partial=False,methodology='Valor diretamente publicado; não interpolado.',status='CONFIRMADO' if value is not None else 'NAO_DISPONIVEL',raw_reference=source['raw_file'],raw_file=source['raw_file'],hash=source['sha256'],sha256=source['sha256'],locator=locator,spatial_scope='municipality',measurement_type='administrative',limitations=[],break_segment=family)
  e.update(kw);self.evidences.append(e);self.series.setdefault(family,[]).append(e);return e
 def save(self,name):save(BASE/name,{'round':'P4 2026-10-05','scope':'mobilidade','homologated':False,'evidences':self.evidences,'series':self.series,'sources':self.logs,'notes':self.notes})
