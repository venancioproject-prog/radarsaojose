from mobilidade_evidence_core import *
from meio_ambiente_workbooks import spreadsheetml
import zipfile,io,re,xlrd,openpyxl,subprocess
from python_calamine import CalamineWorkbook
def members(data,path=''):
 if zipfile.is_zipfile(io.BytesIO(data)):
  z=zipfile.ZipFile(io.BytesIO(data))
  # XLSX também é ZIP; chamar walker apenas para arquivos .zip.
  for n in z.namelist():
   if n.lower().endswith('.zip'):yield from members(z.read(n),path+n+'!')
   elif n.lower().endswith(('.xls','.xlsx')):yield path+n,z.read(n)
months=['JANEIRO','FEVEREIRO','MARCO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO']
aliases=['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']
def read_sheets(data,name):
 if name.lower().endswith('.xlsx'):
  w=openpyxl.load_workbook(io.BytesIO(data),read_only=True,data_only=True);rows=[(s.title,list(s.values)) for s in w];w.close();return rows
 if data.lstrip().startswith(b'<?xml'):return spreadsheetml(data)
 try:
  w=xlrd.open_workbook(file_contents=data);return [(s.name,[s.row_values(r) for r in range(s.nrows)]) for s in w.sheets()]
 except UnicodeDecodeError:
  w=CalamineWorkbook.from_object(io.BytesIO(data));return [(n,w.get_sheet_by_name(n).to_python()) for n in w.sheet_names]
if __name__=='__main__':
 st=Store();index=[]
 for p in sorted(RAW.glob('senatran-*.zip'))+sorted(RAW.glob('senatran-municipal-*.rar'))+sorted(RAW.glob('senatran-municipal-*.xls*')):
  if any(s in p.name for s in ['2014-12.zip','2019-12.zip','2020-12.zip']):continue
  primary=next((l for l in reversed(st.logs) if l.get('name')==p.name and l.get('status')=='OK'),None)
  if not primary:continue
  try:
   if p.suffix=='.rar':files=[(n,subprocess.check_output(['tar','-xOf',str(p),n])) for n in subprocess.check_output(['tar','-tf',str(p)],encoding='utf8').splitlines() if n.endswith(('.xls','.xlsx'))]
   else:files=list(members(p.read_bytes())) if p.suffix=='.zip' else [(p.name,p.read_bytes())]
  except Exception as ex:index.append({'file':p.name,'error':str(ex)});continue
  for member,data in files:
   if p.suffix=='.zip' and not any(x in norm(member) for x in ['MUNIC','TIPO-MUNIC','TIPO MUNIC']):continue
   try:
    for sheet,rows in read_sheets(data,member):
     hits=[(r,row) for r,row in enumerate(rows) if any(norm(v)=='SAO JOSE DOS CAMPOS' for v in row[:8])]
     if not hits:continue
     header=next((r for r,row in enumerate(rows[:30]) if any(norm(v)=='AUTOMOVEL' for v in row)),None)
     if header is None:index.append({'file':p.name,'member':member,'sheet':sheet,'reason':'Cabeçalho de tipos não identificado'});continue
     year_match=re.search(r'(?:19|20)\d{2}',p.name);year=int(year_match.group()) if year_match else None
     name=norm(member);m=next((i+1 for i,v in enumerate(months) if v in name),None)
     if m is None:m=next((i+1 for i,v in enumerate(aliases) if re.search(r'(?:^|[^A-Z])'+v+r'(?:[^A-Z]|$)',name)),None)
     numeric_date=re.search(r'(?<!\d)(0[1-9]|1[0-2])(20\d{2})(?!\d)',name)
     if m is None and numeric_date:m=int(numeric_date[1]);year=int(numeric_date[2])
     heading=' '.join(str(v) for row in rows[:header+1] for v in row)
     heading_month=next((i+1 for i,v in enumerate(months) if v in norm(heading)),None)
     if heading_month is not None:
      if m is not None and m!=heading_month:index.append({'file':p.name,'member':member,'sheet':sheet,'reason':'Competência do nome diverge do título; valor não promovido'});continue
      m=heading_month
     modern=re.search(r'municipal-(20\d{2})-(\d{2})',p.name)
     if modern:year,m=int(modern[1]),int(modern[2])
     if year is None or m is None:index.append({'file':p.name,'member':member,'sheet':sheet,'reason':'Competência não identificada; não assumir dezembro'});continue
     for r,row in hits:
      if not any(norm(v)=='SP' for v in row[:4]):index.append({'file':p.name,'member':member,'reason':'UF SP não identificada na linha'});continue
      for c,label in enumerate(rows[header]):
       cat=norm(label)
       if cat in ['','UF','MUNICIPIO','CODIGO','CODIGO MUNICIPIO','UNIDADE DA FEDERACAO'] or c<2:continue
       value=num(row[c]) if c<len(row) else None
       if cat not in ['TOTAL','AUTOMOVEL','BONDE','CAMINHAO','CAMINHAO TRATOR','CAMINHONETE','CAMIONETA','CHASSI PLATAFORMA','CICLOMOTOR','MICRO-ONIBUS','MOTOCICLETA','MOTONETA','ONIBUS','QUADRICICLO','REBOQUE','SEMI-REBOQUE','SIDE-CAR','TRATOR ESTEIRA','TRATOR RODAS','TRICICLO','UTILITARIO','OUTROS']:continue
       st.add(p.name,'frota_senatran',f'{year}-{m:02}',value,'veículos registrados',str(label),{'archive_member':member,'member_sha256':hashlib.sha256(data).hexdigest(),'sheet':sheet,'row':r+1,'column':c+1,'header_row':header+1,'raw_cell':row[c] if c<len(row) else None,'municipal_row':list(row[:4])},'Estoque RENAVAM de veículos registrados no município na competência',institution='SENATRAN / DENATRAN — Ministério dos Transportes',category=cat,frequency='monthly_stock',partial=False,source_specific_code={'UF':'SP','municipio':next(str(v) for v in row[:8] if norm(v)=='SAO JOSE DOS CAMPOS')},limitations=['Estoque registrado, não frota circulante, viagens ou veículos particulares.','Mudança de instituição DENATRAN/SENATRAN e categorias preservadas; sem crosswalk silencioso.'])
   except Exception as ex:index.append({'file':p.name,'member':member,'error':str(ex)})
  print('Frota',p.name,flush=True)
 # IBGE é uma segunda série administrativa, com seus metadados e universo próprios.
 nodes=[{'id':28120,'indicador':'Total'}]+read(RAW/'ibge-frota-metadados.json')[0]['children'][0]['children']
 for node in nodes:
  file='ibge-frota-total.json' if node['id']==28120 else f'ibge-frota-{node["id"]}.json'
  if not (RAW/file).exists():continue
  for record in read(RAW/file)[0]['res']:
   assert record['localidade']=='354990'
   for year,raw in record['res'].items():
    st.add(file,'frota_ibge',year,num(raw),'veículos registrados',node['indicador'],{'indicator_code':node['id'],'localidade':record['localidade'],'year':year,'raw_cell':raw},'Frota administrativa publicada pelo IBGE, fonte DENATRAN/SENATRAN',frequency='annual_stock',institution='IBGE / SENATRAN-DENATRAN',category=norm(node['indicador']),source_specific_code='354990',limitations=['Posição anual; confirmar competência de fechamento no arquivo primário SENATRAN.','Metadados API descrevem fontes até2021, resultados incluem até2025; reconciliação com fonte primária por competência necessária.'])
 save(OUT/'extracao-frota.json',index);st.save('mobilidade_frota_extraida_2026-10-05.json');print('Frota extraída',len(st.evidences))
