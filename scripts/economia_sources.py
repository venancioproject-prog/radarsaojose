"""Coleta reproduzível de fontes desta rodada; não altera indicadores."""
import json, hashlib, sys
from datetime import datetime, timezone, timedelta
from pathlib import Path
import requests
ROOT=Path(__file__).resolve().parent.parent
RAW=ROOT/'data/radar_hub/economia_raw_2026-10-04'
RAW.mkdir(parents=True,exist_ok=True)
def fetch(name,url):
    manifest=RAW/'access_log.json'
    log=json.loads(manifest.read_text(encoding='utf-8')) if manifest.exists() else []
    item={'name':name,'requested_url':url,'accessed_at':datetime.now(timezone(timedelta(hours=-3))).isoformat()}
    try:
        res=requests.get(url,timeout=(10,45),headers={'User-Agent':'RadarHub-EconomiaAudit/1.0'},stream=True)
        item.update(url=res.url,status_code=res.status_code,content_type=res.headers.get('Content-Type'))
        data=bytearray()
        for chunk in res.iter_content(65536):
            data.extend(chunk)
            if len(data)>65_000_000:raise ValueError('Mais de 65MB: coleta interrompida, sem evidência numérica')
        path=RAW/name;path.write_bytes(data)
        item.update(raw_file=str(path.relative_to(ROOT)).replace('\\','/'),sha256=hashlib.sha256(data).hexdigest(),bytes=len(data))
    except Exception as error:item['error']=str(error)
    log.append(item);manifest.write_text(json.dumps(log,ensure_ascii=False,indent=2),encoding='utf-8')
    print(name,item.get('status_code'),item.get('bytes'),item.get('error',''))
    return item
if __name__=='__main__':fetch(sys.argv[1],sys.argv[2])
