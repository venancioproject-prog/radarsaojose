import json,pathlib,hashlib,math
from python_calamine import CalamineWorkbook
P=pathlib.Path(__file__).parent;B=P/'brutos';checks=[]
def check(name,test,detail=None):
 checks.append({'name':name,'pass':bool(test),'detail':detail});assert test,name
manifest=json.loads((P/'manifest.json').read_text())
for f in manifest:
 if 'sha256' in f:check('hash:'+pathlib.Path(f['file']).name,hashlib.sha256(pathlib.Path(f['file']).read_bytes()).hexdigest()==f['sha256'])
def rows(n):return json.loads((B/n).read_text())[1:]
def value(n,var):return float(next(r['V'] for r in rows(n) if r['D2C']==str(var)))
snapshot=json.loads((P.parent/'demografia-canonicoinicial.json').read_text(encoding='utf-8-sig'))
expected={'demo_populacao_censo':value('sidra4714.json',93),'demo_domicilios_total':value('sidra4711.json',617),'demo_domicilios_ocupados':value('sidra4712.json',381),'demo_media_moradores':value('sidra4712.json',5930),'demo_area_territorial':value('sidra4714.json',6318),'demo_densidade_demografica':value('sidra4714.json',614),'demo_razao_sexo':value('sidra9515.json',8845),'demo_indice_envelhecimento_2022':value('sidra9515.json',10612)}
rs=rows('sidra9514-quinquenal-correto.json');tot={r['D4C']:int(r['V']) for r in rs if r['D5C']=='100362'};expected.update({'demo_populacao_homens':tot['4'],'demo_populacao_mulheres':tot['5']})
for i in snapshot['indicators']:
 if i['indicator_id'] in expected:check('baseline:'+i['indicator_id'],i['value']==expected[i['indicator_id']])
byage={}
for r in rs:
 if r['D5C']!='100362':byage.setdefault(r['D5C'],{'faixa':r['D5N'],'classe_id':r['D5C']})[{'4':'homens','5':'mulheres','6794':'total'}[r['D4C']]]=int(r['V'])
for a in byage.values():check('sexo:'+a['faixa'],a['homens']+a['mulheres']==a['total'])
for k,sex in [('homens','4'),('mulheres','5'),('total','6794')]:check('piramide-soma:'+k,sum(a[k] for a in byage.values())==tot[sex])
municipal=json.loads((P/'tabelas-municipais.json').read_text())
def num(s):return int(s.replace('.','').strip())
for row,a in zip(municipal[2][1:],byage.values()):
 for j,k in [(1,'homens'),(2,'mulheres'),(3,'total')]:check('municipal-vs-SIDRA:'+row[0]+':'+k,num(row[j])==a[k])
ages=list(byage.values());old=sum(a['total'] for a in ages[13:]);young=sum(a['total'] for a in ages[:3]);check('envelhecimento65+',round(old/young*100,2)==expected['demo_indice_envelhecimento_2022'])
check('razao-sexo',round(tot['4']/tot['5']*100,2)==expected['demo_razao_sexo'])
check('densidade2022',round(tot['6794']/expected['demo_area_territorial'],2)==expected['demo_densidade_demografica'])
est=[{'ano':int(r['D3C']),'populacao':int(r['V']),'tipo':'Estimativa IBGE','source_row':i+2} for i,r in enumerate(rows('sidra6579.json'))]
w=CalamineWorkbook.from_path(str(B/'estimativa2026.xlsx'));xr=[(i+1,r) for i,r in enumerate(w.get_sheet_by_name('municípios').to_python()) if len(r)>3 and r[3]=='São José dos Campos'];check('xlsx-2026-vsSIDRA',len(xr)==1 and int(xr[0][1][4])==next(r['populacao'] for r in est if r['ano']==2026));check('xlsx-territorio',int(xr[0][1][1])==35 and int(xr[0][1][2])==49904)
urb={r['D4C']:int(r['V']) for r in rows('sidra9923.json')};check('urbana-rural-soma',urb['1']+urb['2']==urb['6795']==697054)
hist=[{'ano':int(r['D3C']),'populacao':int(r['V']),'tipo':'Censo IBGE','source_row':i+2} for i,r in enumerate(rows('sidra202-historica.json'))]+[{'ano':2022,'populacao':697054,'tipo':'Censo IBGE','source_row':2}]
dom={r['D4C']:{'nome':r['D4N'],'valor':int(r['V'])} for r in rows('sidra4711-especies-correto.json')};check('dom-particao',dom['59998']['valor']+dom['60001']['valor']+dom['2505']['valor']+dom['103995']['valor']==282214);check('dom-nao-ocupados',dom['60002']['valor']+dom['60003']['valor']==dom['60001']['valor'])
regions=[{'regiao':r[0],'populacao':num(r[1]),'domicilios':num(r[2])} for r in municipal[3][1:-1]];check('regioes-total-pop',sum(r['populacao'] for r in regions)==697054);check('regioes-total-dom',sum(r['domicilios'] for r in regions)==282214)
sectors=[{'nome':r[0],'populacao':num(r[1])} for r in municipal[4][1:] if len(r)==2];check('setores-textuais-total',sum(r['populacao'] for r in sectors)==697054)
geo=json.load(open('data/radar_hub/sjc_setores_socioeconomicos_geo.json',encoding='utf-8-sig'));check('geo35-mantido',len(geo['features'])==35);check('geo-populacoes-suspensas',all(f['properties']['populacao'] is None for f in geo['features']))
proposals={'status':'CANDIDATO_AGUARDANDO_VALIDACAO_INDEPENDENTE','territorio':'São José dos Campos/SP; IBGE3549904','registry_values':{'demo_populacao_estimada_2024':724756,'demo_populacao_estimada_2026':729153,'demo_taxa_urbanizacao':round(urb['1']/urb['6795']*100,2)},'estimativas_2001_2026':est,'censos_1970_2022':hist,'piramide_2022_21faixas':ages,'piramide_2022_totais':tot,'situacao_domicilio_2022':urb,'domicilios_2022_especies':dom,'regioes_textuais_municipais_2022':regions,'setores_textuais_municipais_2022':sectors,'mapa_promovivel':False,'metadata_corrections':['2026 passa de projeção linear a estimativa oficialIBGE ref1jul2026; nota antiga arquivada, não mantida como autoridade','Taxa urbanização SIDRA9923:classificação situação domicílioIBGE; não usar valores municipais divergentes','Domicílios ocupados247894 permanentes; média2.8 usa moradores695312, não697054','Remover autoridade das notas com percentuais/fontes não comprovados mantendo arquivohistórico','crescimento2010–2022 anualgeométrico0.8474748%, não1.65% municipal; períodos censitários datas1ago2010/1ago2022','Não promover corraça/religião/distritos/pirâmides2000/2010 com esta evidência'],'divergencias':{'urbano_rural':{'IBGE':[688155,8899],'municipal':[681842,15212]},'area':{'IBGE_2022':1099.409,'municipal_sem_edicao':1099.61},'crescimento_2010_2022':{'calculado_pct':((697054/629921)**(1/12)-1)*100,'municipal_pct':1.65},'cor_raca':{'total':697054,'soma_cinco_categorias':697023,'residuo_nao_classificado':31}}}
(P/'propostas.json').write_text(json.dumps(proposals,ensure_ascii=False,indent=2),encoding='utf-8');(P/'testes.json').write_text(json.dumps({'pass':True,'checks':checks,'count':len(checks)},ensure_ascii=False,indent=2),encoding='utf-8');print('PASS',len(checks),'checks; propostas aguardam validador')
