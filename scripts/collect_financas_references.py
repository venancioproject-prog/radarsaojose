"""Referências municipais por formulário oficial e reconciliação TCESP."""
import datetime, hashlib, html, json, re
from urllib.parse import urljoin
import requests
from collect_financas_p2 import RAW, ROOT, LOG, fetch, api

def municipal(year,subject):
    url='https://servicos.sjc.sp.gov.br/portal_da_transparencia/contas_publicas.aspx?tipo=0'
    name=f'prefeitura-lista-{subject}-{year}'
    if any(a['name']==name and a.get('status_code')==200 for a in json.loads(LOG.read_text(encoding='utf8'))):return
    session=requests.Session();initial=session.get(url,timeout=40);initial.raise_for_status()
    fields={html.unescape(k):html.unescape(v) for k,v in re.findall(r'<input[^>]*name="([^"]+)"[^>]*value="([^"]*)"',initial.text)}
    selects=re.findall(r'<select[^>]*name="([^"]+)"[^>]*>(.*?)</select>',initial.text,re.S)
    for namefield,body in selects:
        opts=re.findall(r'<option[^>]*value="([^"]*)"[^>]*>(.*?)</option>',body,re.S)
        if namefield.endswith('cmbExercicio'):fields[namefield]=str(year)
        elif namefield.endswith('ddlAssunto'):
            key='Responsabilidade Fiscal' if subject=='rreo' else ('Gestão Fiscal' if subject=='rgf' else 'Balanço')
            fields[namefield]=next(html.unescape(v) for v,t in opts if key in html.unescape(t))
    fields['__EVENTTARGET']='ctl00$cphConteudo$btn_Pesquisar';fields['__EVENTARGUMENT']=''
    response=session.post(url,data=fields,timeout=45);response.raise_for_status()
    path=RAW/(name+'.html');path.write_bytes(response.content)
    a={'name':name,'requested_url':url,'url':response.url,'method':'POST','parameters':{'exercise':year,'subject':fields['ctl00$cphConteudo$ddlAssunto']},'accessed_at':datetime.datetime.now().astimezone().isoformat(),'status_code':response.status_code,'raw_file':path.relative_to(ROOT).as_posix(),'sha256':hashlib.sha256(response.content).hexdigest(),'bytes':len(response.content)}
    log=json.loads(LOG.read_text(encoding='utf8'));log.append(a);LOG.write_text(json.dumps(log,ensure_ascii=False,indent=2),encoding='utf8')
    print(name,response.status_code,flush=True)
    links=[(html.unescape(h),html.unescape(re.sub('<.*?>',' ',t)).strip()) for h,t in re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>',response.text,re.S) if '.pdf' in h]
    for href,title in links:
        desired=('6' in title.split(' ')[0] or '6º Bimestre' in title) if subject=='rreo' else (('3' in title.split(' ')[0]) if subject=='rgf' else True)
        if desired:
            fetch(f'prefeitura-{subject}-{year}-'+re.search(r'cop_(\d+)',href).group(1),urljoin(url,href).replace('http:','https:'))

if __name__=='__main__':
    # Respostas 429 são tentativas, nunca evidência numérica.
    for y in [2022,2023,2024,2025]:fetch(f'rgf-{y}-2',api('rgf',y,nr_periodo=2,in_periodicidade='Q',co_tipo_demonstrativo='RGF',co_poder='E'),True)
    fetch('dca-2011',api('dca',2011),True)
    fetch('siconfi-extrato-2023','https://apidatalake.tesouro.gov.br/ords/siconfi/tt/extrato_entregas?an_exercicio=2023&id_ente=3549904',True)
    for y in [2023,2024,2025]:
        municipal(y,'rreo');municipal(y,'rgf')
    for y in [2023,2024]:
        for kind in ['receitas','despesas']:
            fetch(f'tce-{kind}-{y}',f'https://transparencia.tce.sp.gov.br/sites/default/files/csv/{kind}-sao-jose-dos-campos-{y}.zip')
    municipal(2012,'rreo')
