from mobilidade_evidence_core import *
from pypdf import PdfReader
import re,csv,collections

st=Store()
for file in ['cicloviario-2024-alternativo.pdf','cicloviario-atual.pdf']:
 pages=PdfReader(RAW/file).pages
 for pi,page in enumerate(pages,1):
  layout=page.extract_text(extraction_mode='layout');plain=page.extract_text()
  if '2024-alternativo' in file:
   for match in re.finditer(r'Extensão Total\s+(atual|202[123]):\s*([\d.,]+)\s*Km',plain,re.I):
    period='2024' if match[1].lower()=='atual' else match[1]
    st.add(file,'cicloviario_edicao_2024',period,num(match[2]),'km de infraestrutura cicloviária executada','Extensão total publicada',{'page':pi,'text_match':match[0],'raw_cell':match[2]},'Sistema cicloviário executado; inclui tipos distintos de infraestrutura',frequency='annual_snapshot',status='DISPONIVEL_COM_LIMITACAO',break_segment='mapa2024',limitations=['Edição sem data exata de fechamento identificada. Não equivale a ciclovias segregadas.','Valores históricos revisados na edição posterior; séries separadas, sem crescimento comparável presumido.'])
  else:
   for li,line in enumerate(layout.splitlines(),1):
    m=re.search(r'^\s*(Anterior a 2017|2017-2020|202[1-6])\s+([\d.,]+)\s*Km',line)
    if m:
     st.add(file,'cicloviario_edicao_atual',m[1],num(m[2]),'km de infraestrutura cicloviária executada','Extensão total publicada',{'page':pi,'line':li,'layout_line':line,'raw_cell':m[2]},'Sistema cicloviário executado da edição atual; inclui rota ciclística',frequency='published_snapshot',partial=m[1]=='2026',status='DISPONIVEL_COM_LIMITACAO',break_segment='mapa_atual_29dez2025',source_document_date='2025-12-29',limitations=['Documento diz atualizado em29/12/2025 mas inclui linha2026: competência dessa linha ambígua, não ano completo.','Inclusão de rota ciclística e revisão retrospectiva impedem concatenação automática com mapa2024.'])
    m=re.search(r'(Ciclofaixa no Passeio|Passeio Compartilhado|Rota Sinalizada|Rota Ciclística|Ciclofaixa|Ciclovia)\s+((?:[\d.,]+\s*Km\s*){8})',line)
    if m:
     vals=re.findall(r'([\d.,]+)\s*Km',m[2]);st.add(file,'cicloviario_categorias_atual','2025-12-29',num(vals[-1]),'km','Extensão por tipo: '+m[1],{'page':pi,'line':li,'layout_line':line,'raw_cell':vals[-1]},'Tipos de infraestrutura executada da edição atual, totais publicados arredondados',category=m[1],frequency='snapshot',status='DISPONIVEL_COM_LIMITACAO',limitations=['Arredondamento a uma casa; soma difere do total preciso. Medição de lados/sentidos não esclarecida.','Rota ciclística e passeio compartilhado não são ciclovia.'])
   for match in re.finditer(r'Extensão total\s+(atual|em execução|projetada|de ligações propostas|prevista):\s*([\d.,]+)\s*Km',plain,re.I):
    stage=match[1].lower();st.add(file,'cicloviario_estagios_atual','2025-12-29',num(match[2]),'km',stage,{'page':pi,'text_match':match[0],'raw_cell':match[2]},'Etapas distintas publicadas no mapa; não somar como executado',category=stage,frequency='snapshot',status='DISPONIVEL_COM_LIMITACAO',infrastructure_stage=stage,limitations=['Prevista inclui etapas distintas; planejada/projetada/em execução não equivalem a executada.','Data da edição e linha2026 ambíguas.'])

file='documento-ntp_6_linhaverdevlp_maio2024.pdf'
for pi,page in enumerate(PdfReader(RAW/file).pages,1):
 text=page.extract_text(extraction_mode='layout')
 match=re.search(r'Linha Verde é operada por\s+12\s*\(doze\)\s*Veículos Leves sobre Pneus',text)
 if match:st.add(file,'transporte_linha_verde','2024-05',12,'VLPs','VLPs operando a Linha Verde',{'page':pi,'text_match':match[0],'raw_cell':'12'},'Somente Linha Verde; nota técnica municipal de maio2024',frequency='snapshot',status='DISPONIVEL_COM_LIMITACAO',limitations=['Não representa toda frota municipal elétrica nem operação atual2026. Não somar a SISTRAN sem comprovar inclusão.'])

file='anac-estatistica-completa.csv'
if (RAW/file).exists() and any(l.get('name')==file and l.get('status')=='OK' for l in st.logs):
 with (RAW/file).open(encoding='utf-8-sig') as f:
  first=f.readline();headers=next(csv.reader([f.readline() if first.startswith('Atualizado') else first],delimiter=';'))
  records=csv.DictReader(f,fieldnames=headers,delimiter=';');selected=[]
  for line,r in enumerate(records,3 if first.startswith('Atualizado') else 2):
   if r.get('AEROPORTO_DE_ORIGEM_SIGLA')=='SBSJ' or r.get('AEROPORTO_DE_DESTINO_SIGLA')=='SBSJ':selected.append({'line':line,'row':r})
 save(OUT/'anac-sbsj-linhas-selecionadas.json',selected)
 assert all(k in headers for k in ['ANO','MES','GRUPO_DE_VOO','NATUREZA','DECOLAGENS','PASSAGEIROS_PAGOS','PASSAGEIROS_GRATIS','CARGA_PAGA_KG'])
 grouped=collections.defaultdict(list)
 for r in selected:
  row=r['row'];assert (row['AEROPORTO_DE_ORIGEM_SIGLA']!='SBSJ' or row['AEROPORTO_DE_ORIGEM_UF']=='SP') and (row['AEROPORTO_DE_DESTINO_SIGLA']!='SBSJ' or row['AEROPORTO_DE_DESTINO_UF']=='SP')
  for direction,key in [('partida','AEROPORTO_DE_ORIGEM_SIGLA'),('chegada','AEROPORTO_DE_DESTINO_SIGLA')]:
   if row[key]=='SBSJ':grouped[(f"{row['ANO']}-{int(row['MES']):02}",direction,row['NATUREZA'],row['GRUPO_DE_VOO'])].append(r)
 for (period,direction,nature,group),records in sorted(grouped.items()):
  for var,unit in [('PASSAGEIROS_PAGOS','passageiros pagos em etapas básicas'),('PASSAGEIROS_GRATIS','passageiros grátis em etapas básicas'),('CARGA_PAGA_KG','kg de carga paga em etapas básicas'),('DECOLAGENS','etapas básicas registradas')]:
   values=[num(r['row'][var]) for r in records];value=sum(values) if all(v is not None for v in values) else None
   st.add(file,'aeroporto_sbsj',period,value,unit,var,{'rows':[r['line'] for r in records],'variable_column':headers.index(var)+1,'filters':{'airport':'SBSJ','direction':direction,'nature':nature,'flight_group':group},'raw_cell':None},'Etapas básicas informadas à ANAC com origem ou destino SBSJ; direção/natureza/grupo mantidos separados',institution='ANAC — Dados Estatísticos do Transporte Aéreo',source_specific_code='SBSJ',spatial_scope='airport',direction=direction,nature=nature,flight_group=group,category=' / '.join([var,direction,nature,group]),partial=period.startswith('2026'),status='CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS' if value is not None else 'NAO_DISPONIVEL',transformation={'formula':'SUM(coluna nativa) sobre as linhas oficiais com os mesmos filtros','source_row_count':len(records),'source_rows':[r['line'] for r in records]},methodology='Agregação de etapas básicas realizadas, separada por direção, natureza e grupo; não itinerários combinados.',limitations=['Não usuários únicos nem mobilidade urbana. Não representa toda aviação geral do aeroporto.','DECOLAGENS em linhas de chegada mede etapas recebidas; não chamar de decolagens efetuadas em SBSJ.','Sem preencher meses ou categorias ausentes com zero; 2026 disponível até agosto.'])
 st.notes.append({'source':file,'airport':'SBSJ','selected_records':len(selected),'headers':headers,'decision':'Agregações mensais com filtro aeroportuário, direção, natureza e grupo separados.'})

# Estoque publicado de vagas, com data de referência desconhecida: não inferir ocupação.
from html.parser import HTMLParser
class Text(HTMLParser):
 def __init__(self):super().__init__();self.parts=[]
 def handle_data(self,d):self.parts.append(d)
file='estacionamento.html'
if (RAW/file).exists():
 parser=Text();parser.feed((RAW/file).read_text(encoding='utf8'));text=' '.join(parser.parts);m=re.search(r'conta com\s+(5\.852)\s+vagas',text)
 if m:st.add(file,'estacionamento_rotativo','data de referência não informada',num(m[1]),'vagas de estacionamento rotativo','Vagas de Zona Azul',{'text_match':m[0],'raw_cell':m[1]},'Vagas de estacionamento rotativo publicadas pela Prefeitura, não todas as vagas da cidade',frequency='undated_snapshot',status='DISPONIVEL_COM_LIMITACAO',limitations=['Página consultada em2026-10-05, sem competência explícita. Não ocupação, rotatividade ou demanda.'])
st.save('mobilidade_adicional_extraido_2026-10-05.json')
print('Adicionais',len(st.evidences),st.notes)
