from pathlib import Path
import json,csv,zipfile,io,re,hashlib
O=Path('docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/saude');manifest=json.loads((O/'manifest.json').read_text(encoding='utf-8'));out=[]
for p in sorted((O/'raw').glob('cve-dengue*')):
 content=p.read_bytes();member=None
 if zipfile.is_zipfile(p):
  with zipfile.ZipFile(p) as z:member=next(x for x in z.namelist() if '_mes' in x);content=z.read(member)
 rows=list(csv.reader(io.StringIO(content.decode('latin1')),delimiter=';'))
 mun_columns={j for r in rows[:8] for j,x in enumerate(r) if len(x)<30 and ('MUNIC' in x.upper() or 'MUN-RES' in x.upper())}
 candidates=[(i,r,j) for i,r in enumerate(rows) for j,x in enumerate(r) if j in mun_columns and re.fullmatch(r'(354990\s+)?S[ãa]o Jos[ée] dos Campos',x.strip(),re.I)]
 assert len(candidates)==1,(p.name,candidates)
 i,r,j=candidates[0];nums=r[j+1:j+40];assert len(nums)==39
 nums=[int(x.strip().replace('.','')) if x.strip() else None for x in nums];months=[dict(month=k+1,notified=nums[k*3],confirmed_autochthonous=nums[k*3+1],confirmed_imported=nums[k*3+2]) for k in range(12)]
 for col in range(3):assert all(nums[k*3+col] is not None for k in range(12)) and sum(nums[k*3+col] for k in range(12))==nums[36+col],(p.name,col)
 year=int(re.search(r'20\d{2}',p.name)[0]) if '202' in p.name or '2019' in p.name else 2023 if '23_' in p.name else 2024
 record=dict(year=year,territory='Município residência São José dos Campos; 354990 (IBGE sem dígito)',raw=str(p).replace('\\','/'),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),source_url=next(x['url'] for x in manifest if x['raw']==str(p).replace('\\','/')),zip_member=member,member_sha256=hashlib.sha256(content).hexdigest() if member else None,csv_row=i+1,municipality_column=j+1,header=rows[:7],footer=rows[-8:],source_notes=[';'.join(r) for r in rows if any('Dados informados' in c or 'Fonte:' in c for c in r)],months=months,total_notified=nums[36],total_confirmed_autochthonous=nums[37],total_confirmed_imported=nums[38],total_confirmed=nums[37]+nums[38],definition='Confirmados autóctones + importados por residência e mês de início de sintomas; total não inclui notificados sem confirmação.',coverage='Tabela janeiro–dezembro; edição histórica revisável, conferir data no rodapé.')
 out.append(record);print(year,record['total_notified'],record['total_confirmed_autochthonous'],record['total_confirmed_imported'],record['total_confirmed'],r[:j+1],flush=True)
(O/'dengue-cve-extracao.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
