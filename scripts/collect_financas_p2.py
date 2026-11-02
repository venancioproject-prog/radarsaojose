"""Coleta oficial P2 com respostas brutas, paginação e log; não altera a base."""
import argparse, concurrent.futures, datetime, hashlib, json, threading, time
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'data/radar_hub/financas_raw_2026-10-05'
RAW.mkdir(parents=True, exist_ok=True)
LOCK = threading.Lock()
RATE_LOCK = threading.Lock()
LAST_REQUEST = 0.0
LOG = RAW / 'access_log.json'

def fetch(name, url, paginate=False, force=False):
    records = json.loads(LOG.read_text(encoding='utf8')) if LOG.exists() else []
    old = [a for a in records if a['name'] == name and a.get('status_code') == 200]
    if old and not force:
        return old[-1]
    result = []
    page = 0
    while url:
        accessed = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-3))).isoformat()
        a = dict(name=name, requested_url=url, accessed_at=accessed, page=page)
        try:
            if 'apidatalake.tesouro.gov.br' in url:
                global LAST_REQUEST
                with RATE_LOCK:
                    time.sleep(max(0, 1.05-(time.monotonic()-LAST_REQUEST)))
                    LAST_REQUEST=time.monotonic()
            response = requests.get(url, timeout=(20, 65), headers={'User-Agent':'RadarSaoJose-AuditoriaPublica/2.0'})
            suffix = 'json' if 'json' in response.headers.get('content-type','') else ('pdf' if response.content.startswith(b'%PDF') else ('zip' if response.content.startswith(b'PK') else 'html'))
            path = RAW / (name + (f'-page{page}' if page else '') + '.' + suffix)
            path.write_bytes(response.content)
            a.update(url=response.url, status_code=response.status_code, content_type=response.headers.get('content-type'), raw_file=path.relative_to(ROOT).as_posix(), sha256=hashlib.sha256(response.content).hexdigest(), bytes=len(response.content))
            if suffix == 'json' and response.status_code == 200:
                payload=response.json(); a['items']=len(payload.get('items',[])) if isinstance(payload,dict) else len(payload)
                a['hasMore']=payload.get('hasMore') if isinstance(payload,dict) else None
                next_url=next((l['href'] for l in payload.get('links',[]) if l.get('rel')=='next'),None) if isinstance(payload,dict) else None
            else:next_url=None
        except Exception as exc:
            a['error']=str(exc);next_url=None
        with LOCK:
            records = json.loads(LOG.read_text(encoding='utf8')) if LOG.exists() else []
            records.append(a); LOG.write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf8')
        result.append(a)
        print(name,page,a.get('status_code',a.get('error')),a.get('items',''),flush=True)
        url=next_url if paginate else None; page+=1
        if page>100:raise RuntimeError('Paginação excessiva: '+name)
    return result[-1]

def api(kind, year, **params):
    p={'an_exercicio':year, 'id_ente':3549904, **params}
    return 'https://apidatalake.tesouro.gov.br/ords/siconfi/tt/'+kind+'?'+requests.compat.urlencode(p)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--batch',default='initial');args=parser.parse_args()
    if args.batch=='initial':
        jobs=[('siconfi-swagger','https://apidatalake.tesouro.gov.br/docs/siconfi/',False),('tce-api-doc','https://transparencia.tce.sp.gov.br/apis',False),('tce-municipios','https://transparencia.tce.sp.gov.br/api/json/municipios',False),('prefeitura-contas','https://servicos.sjc.sp.gov.br/portal_da_transparencia/contas_publicas.aspx?assunto=Atendimento+%C3%A0+Lei+de+Responsabilidade+Fiscal+n%C2%BA+101%2F00+-+TCE&tipo=0',False),('siconfi-documentacao','https://siconfi.tesouro.gov.br/siconfi/pages/public/conteudo/conteudo.jsf?id=46903',False)]
        for y in [2023,2024,2025]:
            jobs += [(f'dca-{y}',api('dca',y),True),(f'rreo-{y}-6',api('rreo',y,nr_periodo=6,co_tipo_demonstrativo='RREO'),True),(f'rgf-{y}-3',api('rgf',y,in_periodicidade='Q',nr_periodo=3,co_tipo_demonstrativo='RGF',co_poder='E'),True)]
    elif args.batch=='historical':
        jobs=[(f'dca-{y}',api('dca',y),True) for y in range(2013,2023)]
        jobs += [(f'rreo-{y}-6',api('rreo',y,nr_periodo=6,co_tipo_demonstrativo='RREO'),True) for y in range(2015,2023)]
        jobs += [(f'rgf-{y}-3',api('rgf',y,in_periodicidade='Q',nr_periodo=3,co_tipo_demonstrativo='RGF',co_poder='E'),True) for y in range(2015,2023)]
        jobs += [(f'rreo-2026-{n}',api('rreo',2026,nr_periodo=n,co_tipo_demonstrativo='RREO'),True) for n in range(1,5)]
        jobs += [(f'rgf-2026-{n}',api('rgf',2026,nr_periodo=n,in_periodicidade='Q',co_tipo_demonstrativo='RGF',co_poder='E'),True) for n in [1,2]]
    elif args.batch=='periodic':
        jobs=[(f'rreo-{y}-{n}',api('rreo',y,nr_periodo=n,co_tipo_demonstrativo='RREO'),True) for y in range(2013,2026) for n in range(1,7)]
        jobs += [(f'rgf-{y}-{n}',api('rgf',y,nr_periodo=n,in_periodicidade='Q',co_tipo_demonstrativo='RGF',co_poder='E'),True) for y in range(2013,2026) for n in range(1,4)]
        jobs += [(f'dca-{y}',api('dca',y),True) for y in [2011,2012]]
    elif args.batch=='references':
        prefix='https://siconfi.tesouro.gov.br/siconfi/pages/public/arquivo/conteudo/'
        jobs=[('api-layout','https://apidatalake.tesouro.gov.br/docs/siconfi.yaml',False),('finbra-historico','https://www.tesourotransparente.gov.br/consultas/finbra/finbra-financas-do-brasil-dados-contabeis-dos-municipios-1989-a-2012',False)]
        jobs += [(name,prefix+filename,False) for name,filename in [('layout-dca-2023','2024_Tabela_de_fatos_DCA_2023.pdf'),('layout-rreo-2023','2023_Tabela_de_fatos_RREO_Municipios.pdf'),('layout-rgf-2023','2023_Tabela_de_fatos_RGF_Estados_Municipios.pdf'),('layout-dca-2025','2026_Tabela_de_fatos_dca_2025_06022026.pdf')]]
        jobs += [(f'tce-painel-{y}',f'https://transparencia.tce.sp.gov.br/municipio/sao-jose-dos-campos/{y}',False) for y in [2023,2024,2025,2026]]
        jobs += [('prefeitura-rreo-2026-4','https://servicos.sjc.sp.gov.br/sf/downloads/contas_publicas/cop_000010243.pdf',False)]
    else:raise ValueError(args.batch)
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        futures=[pool.submit(fetch,*j) for j in jobs]
        for f in concurrent.futures.as_completed(futures):f.result()
