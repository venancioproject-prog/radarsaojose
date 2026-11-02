from mobilidade_evidence_core import *
from pypdf import PdfReader
import re
months=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
def cells(line):return re.split(r'\s{2,}',line.strip())
if __name__=='__main__':
 st=Store();audit=[];texts={}
 for p in sorted(RAW.glob('transporte-*.pdf')):
  match=re.match(r'transporte-(bilhetagem|km|ipk|linhas)-(20\d{2})\.pdf',p.name)
  if not match:continue
  kind,edition=match[1],int(match[2]);pages=PdfReader(p).pages;headers=[];table_index=0;year=edition;ipk_monthly=False
  for pi,page in enumerate(pages,1):
   lines=page.extract_text(extraction_mode='layout').splitlines();texts.setdefault(p.name,[]).append({'page':pi,'lines':lines})
   for li,line in enumerate(lines,1):
    parts=cells(line);label=norm(parts[0]) if parts else '';loc={'page':pi,'line':li,'layout_line':line,'edition':edition}
    # A edição mais recente de KM incorpora histórico; edições antigas permanecem como fontes/revisões.
    if kind=='km':
     if re.fullmatch(r'20\d{2}',line.strip()):year=int(line.strip())
     if 'KM REALIZADA (TOTAL)' not in label:continue
     values=[num(v) for v in parts[1:]]
     if len(values)<12: audit.append({'file':p.name,'line':li,'reason':'menos de12colunas'});continue
     if edition!=2026 and year>=2017:continue
     if edition<2017 and year not in [edition,edition-1]:continue
     for m,value in enumerate(values[:12],1):st.add(p.name,'transporte_km_realizada',f'{year}-{m:02}',value,'km realizados','Quilometragem realizada total',dict(loc,column=m+1,raw_cell=parts[m]),'Quilometragem executada pelas concessionárias municipais; fonte Encerrantes',partial=year==2026,limitations=['Executada, não programada. Não total da malha viária.','A edição2026 é usada para histórico2017–2026; edições2013–2016 para anos anteriores.'])
    elif kind=='bilhetagem':
     if parts and norm(parts[0]) in ['MES','MÊS']:
      headers=parts
      if any(norm(v)=='JANEIRO' for v in parts):table_index+=1
      else:table_index+=1
      continue
     if not headers:continue
     horizontal=any(norm(v)=='JANEIRO' for v in headers)
     if horizontal:
      allowed=['V. TRANSPORTE','V.TRANSPORTE','V. COMUM','PAGANTES','ESTUDANTES','IDOSOS','DEMAIS ISENTOS','ISENTOS','INTEGRACOES','TOTAL','EQUIVALENTES','OUTROS SIST.','G.S.L.']
      if label not in allowed or len(parts)<13:continue
      category=label;values=[num(v) for v in parts[1:13]]
      for m,value in enumerate(values,1):st.add(p.name,'transporte_bilhetagem',f'{edition}-{m:02}',value,'passageiros equivalentes tarifários' if category=='EQUIVALENTES' else 'passagens registradas',parts[0],dict(loc,column=m+1,raw_cell=parts[m],table_index=table_index),'Bilhetagem das concessionárias municipais — '+('total do sistema' if table_index==4 else 'lote/tabela '+str(table_index)),category=category,operator_group='sistema' if table_index==4 else 'lote_'+str(table_index),partial=edition==2026,limitations=['Contagem de passagens, não pessoas únicas. Integrações e gratuidades mantêm categoria própria.','Equivalentes são ponderação tarifária, não passageiros físicos.','Cabeçalhos e categorias mudam entre edições; sem fusão silenciosa.'])
     else:
      m=next((i+1 for i,v in enumerate(months) if norm(v)==label),None)
      if m is None:continue
      values=parts[1:];names=headers[1:]
      # 2013–2014: quantidade e valor em pares; Equivalentes tem só quantidade.
      paired=len(values)>=2*len(names)-1
      for j,name in enumerate(names):
       if 'RECEITA' in norm(name):continue
       idx=j*2 if paired else j
       if idx>=len(values):continue
       raw=values[idx]
       if 'R$' in raw:continue
       category=norm(name);value=num(raw)
       st.add(p.name,'transporte_bilhetagem',f'{edition}-{m:02}',value,'passageiros equivalentes tarifários' if category=='EQUIVALENTES' else 'passagens registradas',name,dict(loc,column=idx+2,raw_cell=raw,table_index=table_index,header=headers,paired_quantity_value=paired),'Bilhetagem das concessionárias municipais — '+('total do sistema' if table_index==4 else 'lote/tabela '+str(table_index)),category=category,operator_group='sistema' if table_index==4 else 'lote_'+str(table_index),partial=False,limitations=['Contagens de passagens, não usuários únicos; categorias do relatório preservadas.','Mudança de layout/categorias documentada, sem interpolação ou equivalência automática.'])
    elif kind=='ipk':
     if any(norm(v)=='JAN' for v in parts):ipk_monthly=True
     if 'HISTORICO' in label or label=='ANO':ipk_monthly=False
     if edition==2026:
      annual=re.search(r'(20\d{2})\s+(\d+,\d+)\s+(\d+,\d+)\s*$',line)
      if annual:
       for j,category in [(2,'IPK TOTAL'),(3,'IPK EQUIVALENTE')]:
        st.add(p.name,'transporte_ipk_anual',annual[1],num(annual[j]),'passagens/km' if j==2 else 'equivalentes tarifários/km',category,dict(loc,raw_cell=annual[j]),'Média anual de IPK publicada; 2026 acumulado até agosto',category=category,frequency='annual',partial=annual[1]=='2026',limitations=['Histórico republicado na edição 2026. Não calcular média simples dos índices mensais.','2026 parcial; definição do numerador depende da categoria tarifária.'])
     if label not in ['IPK TOTAL','IPK REAL','IPK EQUIVALENTE'] or len(parts)<13 or not ipk_monthly:continue
     for m,raw in enumerate(parts[1:13],1):st.add(p.name,'transporte_ipk',f'{edition}-{m:02}',num(raw),'passagens/km' if label=='IPK TOTAL' else 'equivalentes tarifários/km',parts[0],dict(loc,column=m+1,raw_cell=raw),'Indicador publicado para transporte coletivo municipal',category=label,partial=edition==2026,limitations=['IPK total e equivalente não são intercambiáveis. Indicador publicado, não recálculo usando períodos distintos.'])
    elif kind=='linhas':
     # Somente totais explicitamente publicados, sem contar nomes duplicados da rede.
     for tag,family,unit in [('TOTAL DE LINHAS','transporte_linhas','linhas'),('FROTA TOTAL','transporte_frota_cadastrada','ônibus')]:
      m=re.search(tag+r'\s+(\d+)',norm(line))
      if not m and tag=='TOTAL DE LINHAS':m=re.search(r'(\d+)\s+TOTAL DE LINHAS EM OPERACAO',norm(line))
      if not m:continue
      competence=f'{edition}-08' if edition==2026 else str(edition)
      st.add(p.name,family,competence,int(m[1]),unit,tag,loc,'Linhas em operação declaradas no relatório' if family=='transporte_linhas' else 'Frota cadastrada e em operação conforme título do cadastro SISTRAN; reserva não segregada',frequency='snapshot',status='DISPONIVEL_COM_LIMITACAO',limitations=['Data exata de fechamento consta no documento; ano isolado não prova série mensal.','Frota cadastrada/em operação não comprova veículos simultaneamente circulando nem exclui reserva.'])
  print('Transporte extraído',p.name,flush=True)
 # Repetições do histórico KM em PDFs adjacentes: última edição compatível selecionada, sem somar versões.
 selected={};dups=[]
 for e in st.series.get('transporte_km_realizada',[]):
  key=e['period'];old=selected.get(key)
  if old:
   dups.append({'period':key,'old':old['value'],'new':e['value'],'old_source':old['raw_file'],'new_source':e['raw_file']})
   if e['locator']['edition']<old['locator']['edition']:continue
  selected[key]=e
 st.series['transporte_km_realizada']=sorted(selected.values(),key=lambda e:e['period'])
 save(OUT/'textos-transporte-extraidos.json',texts);save(OUT/'extracao-transporte-pendencias.json',audit);save(OUT/'revisoes-km.json',dups);st.save('mobilidade_transporte_extraido_2026-10-05.json');print('Transporte',len(st.evidences),'observações')
