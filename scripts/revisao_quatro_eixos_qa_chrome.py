"""Chrome real via CDP; fixture do módulo com DOM real; nenhum screenshot."""
from pathlib import Path
import json,re,subprocess,time,threading,http.server,os,websocket,traceback
ROOT=Path(__file__).resolve().parent.parent;OUT=ROOT/'docs/dados-publicos-revisao/revisao-independente-quatro-eixos/20261008/qa'
html=(ROOT/'app.html').read_text(encoding='utf8');html=re.sub(r'<script\b[^>]*>.*?</script>','',html,flags=re.S|re.I)
html=re.sub(r'<(?:img|iframe|source|video|audio)\b[^>]*>','',html,flags=re.I)
html=html.replace('<head>','<head><base href="/"><style>.hub-axis-content.hidden{display:none} canvas{max-height:320px} </style>',1)
scripts=['https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js','https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js','/radar_hub_controller.js','/economia_visual.js','/financas_visual.js']
html=html.replace('</body>',''.join('<script src="'+s+'"></script>' for s in scripts)+'</body>');fixture=OUT/'browser-fixture.html';fixture.write_text(html,encoding='utf8')
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
profile=OUT/('chrome-test-profile-'+str(time.time_ns()));profile.mkdir(exist_ok=True)
chrome=Path('C:/Program Files/Google/Chrome/Application/chrome.exe')
proc=subprocess.Popen([str(chrome),'--headless=new','--disable-gpu','--no-proxy-server','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--remote-allow-origins=*','--user-data-dir='+str(profile),'about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=subprocess.CREATE_NO_WINDOW)
results={'kind':'Chrome real headless; fixture isolada do Radar Hub com DOM de app.html e controller real. App.js não executado. Não é E2E do login/aplicação completa.','screenshots':False,'events':[],'scenarios':[]}
try:
 for _ in range(60):
  if (profile/'DevToolsActivePort').exists():break
  time.sleep(.5)
 port=int((profile/'DevToolsActivePort').read_text().splitlines()[0]);import requests
 targets=requests.get(f'http://127.0.0.1:{port}/json',timeout=5).json()
 target=next(t for t in targets if t.get('type')=='page' and t.get('url')=='about:blank')
 ws=websocket.create_connection(target['webSocketDebuggerUrl'],timeout=100,suppress_origin=True);seq=0
 def call(method,params=None):
  global seq
  seq+=1;request_id=seq;ws.send(json.dumps({'id':request_id,'method':method,'params':params or {}}))
  while True:
   msg=json.loads(ws.recv())
   if msg.get('method') in ['Runtime.exceptionThrown','Runtime.consoleAPICalled','Log.entryAdded','Network.loadingFailed']:results['events'].append(msg)
   if msg.get('id')==request_id:
    if 'error' in msg:raise RuntimeError(msg['error'])
    return msg.get('result',{})
 def evaluate(expr):
  r=call('Runtime.evaluate',{'expression':expr,'awaitPromise':True,'returnByValue':True})
  if r.get('exceptionDetails'):raise RuntimeError(r['exceptionDetails'])
  return r.get('result',{}).get('value')
 call('Page.enable');call('Runtime.enable');call('Network.enable');call('Log.enable')
 axes=['demografia','saude','seguranca','economia','financas','meio_ambiente','educacao','mobilidade']
 for mode,offline,mobile,slow in [('desktop-online',False,False,False),('desktop-offline',True,False,False),('mobile-limitada',False,True,True),('verificacao-remota-offline',True,False,False)]:
  print('Chrome',mode,'início',flush=True)
  call('Network.setCacheDisabled',{'cacheDisabled':True})
  call('Emulation.setDeviceMetricsOverride',{'width':375 if mobile else 1440,'height':812 if mobile else 1000,'deviceScaleFactor':1,'mobile':mobile})
  call('Network.emulateNetworkConditions',{'offline':False,'latency':100 if slow else 0,'downloadThroughput':1048576 if slow else -1,'uploadThroughput':1048576 if slow else -1})
  url=f'http://127.0.0.1:{server.server_port}/'+fixture.relative_to(ROOT).as_posix()+'?mode='+mode
  results.setdefault('navigations',[]).append({'url':url,'response':call('Page.navigate',{'url':url})});start=time.perf_counter()
  for _ in range(180):
   if evaluate("location.href==="+json.dumps(url)+" && document.readyState!=='loading' && typeof window.initRadarHub==='function' && typeof window.renderEconomiaVisual==='function' && typeof window.renderFinancasVisual==='function' && typeof window.Chart==='function'"):break
   time.sleep(.5)
  results.setdefault('ready_diagnostics',[]).append(evaluate("({url:location.href,title:document.title,ready:document.readyState,init:typeof window.initRadarHub,resources:performance.getEntriesByType('resource').map(e=>({name:e.name,duration:e.duration})),body:document.body?.innerText?.slice(0,300)})"))
  assert evaluate("location.href==="+json.dumps(url)+" && typeof window.renderFinancasVisual==='function'"),'Navegação nova precisa terminar antes de ativar offline'
  if offline:call('Network.emulateNetworkConditions',{'offline':True,'latency':0,'downloadThroughput':-1,'uploadThroughput':-1})
  evaluate("window.RADAR_HUB_VERIFY_ONLINE_PACKAGE="+('true' if mode=='verificacao-remota-offline' else 'false')+";true")
  init=evaluate("(async()=>{await window.initRadarHub();return {Chart:typeof window.Chart,heap:performance.memory?.usedJSHeapSize??null};})()")
  checks=[]
  for axis in axes:
   evaluate("window.switchRadarHubAxis("+json.dumps(axis)+");true");time.sleep(.12)
   # switchRadarHubAxis agenda renderização; observar conclusão, não um sleep fixo.
   for _ in range(50):
    if evaluate("(()=>{const c=document.getElementById('hub-axis-container-"+axis+"');return !!c&&Array.from(c.querySelectorAll('canvas')).every(e=>!!Chart.getChart(e)||!!document.getElementById('fallback-'+e.id));})()"):break
    time.sleep(.1)
   row=evaluate("(()=>{const c=document.getElementById('hub-axis-container-"+axis+"');return {axis:"+json.dumps(axis)+",visible:!!c&&!c.classList.contains('hidden'),cards:Array.from(c?.querySelectorAll('[data-radar-indicator]')||[]).map(e=>({id:e.dataset.radarIndicator,value:e.textContent})),charts:Array.from(c?.querySelectorAll('canvas')||[]).map(e=>({id:e.id,rendered:typeof Chart!=='undefined'&&!!Chart.getChart(e),fallback:!!document.getElementById('fallback-'+e.id)}))};})()")
   if axis=='educacao':
    row['networkDenominator']=evaluate("(()=>{const chart=Chart.getChart('hubChartEducacaoRede');const values=chart.data.datasets[0].data;return {total:values.reduce((s,v)=>s+v,0),formatterFull:chart.config.options.plugins.datalabels.formatter(163965),labels:chart.data.labels};})()")
    assert row['networkDenominator']['total']==163965 and row['networkDenominator']['formatterFull']=='100.0%', 'Denominador redes educação deve reproduzir total nativo2023'
   checks.append(row)
  export=evaluate("(()=>{const e=window.getRadarHubExport();const csv=window.serializeRadarHubCsv(e.indicators);return {version:e.dataset_version,count:e.indicators.length,nullCount:e.indicators.filter(r=>r.valor===null).length,csvBOM:csv.charCodeAt(0)===65279,periods:e.indicators.every(r=>r.competencia!==undefined),sourceLinks:e.indicators.filter(r=>r.valor!==null).every(r=>/^https?:/.test(r.url)),mobFuture:e.mobilidade_series.filter(r=>r.competencia>'2026-08'&&r.competencia<'2027'&&r.evidencia.family==='transporte_bilhetagem'&&r.valor!==null).length};})()")
  export['reviewSeries']=evaluate("(()=>{return ['educacao','saude','seguranca','demografia'].map(axis=>{const rows=window.getRevisaoQuatroEixosExport(axis);const native=Object.values(RADAR_HUB_PACKAGE.groundTruth.eixos[axis].series_auditadas).flat();const map=new Map(rows.map(r=>[r.id,r]));const csv=window.serializeRadarHubCsv(rows);return {axis,count:rows.length,nativeCount:native.length,unique:map.size===rows.length,valuesMatch:native.every(r=>map.get(r.evidence_id)?.valor===r.value&&map.get(r.evidence_id)?.competencia===r.period),csvBOM:csv.charCodeAt(0)===65279,hasSource:rows.every(r=>/^https?:/.test(r.url)&&!!r.evidencia.sha256),suspendedNull:rows.filter(r=>r.status_declarado.startsWith('SUSPENSO')).every(r=>r.valor===null)};});})()")
  assert all(r['count']==r['nativeCount'] and r['unique'] and r['valuesMatch'] and r['csvBOM'] and r['hasSource'] and r['suspendedNull'] for r in export['reviewSeries']), 'Séries quatro eixos JSON/CSV e evidência inconsistentes'
  timings=evaluate("performance.getEntriesByType('resource').filter(e=>e.name.includes('radar_hub')).map(e=>({url:e.name,duration:e.duration,transferSize:e.transferSize,encodedBodySize:e.encodedBodySize,decodedBodySize:e.decodedBodySize}))")
  export['inlineVersion']=evaluate('RADAR_HUB_PACKAGE.dataset_version')
  export['bill42']=evaluate("(()=>{const rows=window.getMobilidadeP4Export().filter(r=>r.status_declarado==='SUSPENSO_ERRO_COLUNA');return {count:rows.length,allNull:rows.every(r=>r.valor===null&&r.evidencia.normalized_value===null&&r.evidencia.display_value===null),ids:rows.map(r=>r.id)};})()")
  export['afterFilters']=evaluate("(()=>{const before=JSON.stringify(window.getMobilidadeP4Export());for(const cat of ['todas','automoveis','motos']){window.filterHubChart('mob_frota','categoria',cat);for(const mode of ['anual','mensal'])window.filterHubChart('mob_fatalidades','mode',mode);}return before===JSON.stringify(window.getMobilidadeP4Export());})()")
  from hashlib import sha256
  expected=json.loads((ROOT/'data/radar_hub/radar_hub_package.json').read_text(encoding='utf8'))
  assert export['version']==export['inlineVersion']==expected['dataset_version']
  assert export['bill42']['count']==42 and export['bill42']['allNull'] and export['afterFilters']
  assert set(export['bill42']['ids'])=={r['evidence_id'] for r in json.loads((ROOT/'data/radar_hub/mobilidade_reconciliation_20261008.json').read_text(encoding='utf8'))['overrides']}
  export['completeCompetencePreserved']=evaluate("window.getRadarHubExport().indicators.every(r=>r.competencia===(RADAR_HUB_PACKAGE.metadataRegistry.indicators.find(i=>i.indicator_id===r.id).competencia??RADAR_HUB_PACKAGE.metadataRegistry.indicators.find(i=>i.indicator_id===r.id).base_year??null))")
  results['scenarios'].append({'mode':mode,'seconds':time.perf_counter()-start,'initialization':init,'axes':checks,'export':export,'network_resources':timings,'network_note':'HTTP local sem compressão; rede limitada a 1 MiB/s e latência 100 ms no cenário móvel. Viewport emulado, não dispositivo físico.'});print('Chrome',mode,'fim',round(time.perf_counter()-start,2),flush=True)
 for scenario in results['scenarios']:
  if scenario['mode']!='verificacao-remota-offline':assert not any('radar_hub_package.json' in r['url'] for r in scenario['network_resources']), 'Transferência redundante reapareceu'
 results['status']='PASS' if all(s['export']['count']==122 and s['export']['nullCount']==28 and s['export']['completeCompetencePreserved'] and s['export']['sourceLinks'] and s['export']['csvBOM'] and s['export']['mobFuture']==0 and all(a['visible'] and all(c['rendered'] or c['fallback'] for c in a['charts']) for a in s['axes']) for s in results['scenarios']) and not any(e['method']=='Runtime.exceptionThrown' for e in results['events']) else 'REVIEW'
except Exception as e:results.update(status='FAIL',error=str(e),trace=traceback.format_exc());print('Chrome FAIL',str(e)[:300],flush=True)
finally:
 (OUT/'testes-chrome-real.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8');proc.terminate();server.shutdown()
