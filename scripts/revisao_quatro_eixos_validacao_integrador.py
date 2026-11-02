"""Validação independente de amostras SSP; preserva edição capturada pelo integrador."""
from pathlib import Path
import hashlib,json,datetime,requests
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/integrador'
OUT.mkdir(parents=True,exist_ok=True)
checks=[];manifest=[]
def capture(name,url):
    r=requests.get(url,timeout=90);r.raise_for_status()
    p=OUT/name;p.write_bytes(r.content)
    manifest.append({'file':str(p.relative_to(ROOT)).replace('\\','/'),'url':url,'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sha256':hashlib.sha256(r.content).hexdigest(),'bytes':len(r.content)})
    return r.json()
def check(name,actual,expected):
    checks.append({'check':name,'actual':actual,'expected':expected,'pass':actual==expected})
    assert actual==expected,name
months=['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
def rows(year,group=6):
    j=capture(f'ssp-{year}-grupo{group}.json',f'https://www.ssp.sp.gov.br/v1/OcorrenciasMensais/RecuperaDadosMensaisAgrupados?ano={year}&grupoDelito={group}&tipoGrupo=MUNIC%C3%8DPIO&idGrupo=560')
    return {r['idDelito']:r for b in j['data'] for r in b['listaDados']}
a=rows(2024)
for ident,total in [(38,23),(41,23),(37,143),(22,724),(30,965)]:
    check(f'2024:delito{ident}:native',a[ident]['total'],total)
    check(f'2024:delito{ident}:sum12',sum(a[ident][m] for m in months),total)
    check(f'2024:delito{ident}:published',a[ident]['publicado'],12)
check('roubo_total_inclui_carga_banco',a[30]['total'],a[133]['total']+a[46]['total']+a[49]['total'])
b=rows(2025)
check('2025:ocorrencias',b[38]['total'],29);check('2025:vitimas',b[41]['total'],33)
c=rows(2024,9)
check('2024:prisoes_nativas',c[88]['total'],2170)
check('2024:prisoes_soma12',sum(c[88][m] for m in months),2170)
check('2024:nao_somar_outras_categorias',c[86]['total']+c[87]['total'],2531)
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'testes-ssp-independentes.json').write_text(json.dumps({'status':'PASS','checks':checks,'scope':'Nova captura externa pelo integrador; não compara GT consigo mesmo.'},ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'status':'PASS','checks':len(checks)},ensure_ascii=False))
