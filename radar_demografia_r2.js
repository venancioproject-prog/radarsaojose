/* Demografia only. Derived projection is lazy, SHA-256 checked and cache-versioned. */
(function(global){
 'use strict';
 const HASH='68b5baa7eb0d1440f97bb2325688edcb08e8f868004b4587de9d18f55802e231',URL='data/radar_hub/projections/demografia-r2.json',VERSION='sha256:7e9547065b7f4f0a284f654c8756d21c1c3433226947d5fcf1d8b88e42f17046';
 const blue='#0369a1',violet='#6d28d9',petroleo='#0b556d',esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),fmt=(n,d=0)=>n==null?'Não disponível':Number(n).toLocaleString('pt-BR',{maximumFractionDigits:d,minimumFractionDigits:d});
 let data,pending,root,map,layer,region='todas',selected=null,lastWidth=0;
 let municipalityBoundary=null,boundaryLayer=null,legalReference=null,legalLayer=null,showLegalReference=false;
 let territoryData=null,territoryAttempted=false,territoryMode='regioes',territoryMetric='populacao',searchTerm='';
 const state={historyProduct:'Censo',historyFrom:1970,historyTo:2022,pyramidYear:2022,pyramidUnit:'Pessoas',sexYear:2022,racePeriod:'2010–2022',raceMode:'year',raceYear:2022,raceFrom:2010,raceTo:2022,raceCategory:'Todas',raceUnit:'Percentual',religionPanel:'2022',religionUnit:'Percentual',homesPanel:'2022',urbanYear:2010};
 const visible=new Map();
 async function verify(text){if(!global.crypto?.subtle)throw Error('Verificação SHA-256 indisponível');const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));if(Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('')!==HASH)throw Error('Integridade da projeção inválida');const parseStart=performance.now(),p=JSON.parse(text);if(root)root.dataset.demoParseMs=(performance.now()-parseStart).toFixed(2);if(p.presentation_version!==VERSION||p.territory!=='3549904')throw Error('Projeção incompatível');return p;}
 async function load(){if(data)return data;if(pending)return pending;pending=(async()=>{let text;const loadStart=performance.now();try{const response=await fetch(URL,{cache:'no-cache'});if(!response.ok)throw Error('HTTP '+response.status);text=await response.text();data=await verify(text);if(root){root.dataset.demoLoadMs=(performance.now()-loadStart).toFixed(2);root.dataset.demoBytes=String(new TextEncoder().encode(text).length);root.dataset.demoCache='network';}try{localStorage.setItem('radar:demografia:r2:'+HASH,text);}catch(_){}return data;}catch(e){try{text=localStorage.getItem('radar:demografia:r2:'+HASH);if(text){data=await verify(text);if(root)root.dataset.demoCache='verified-offline';return data;}}catch(_){}throw e;}})();try{return await pending;}finally{pending=null;}}
 let raceHistoryAttempted=false;
 async function loadRaceHistory(){if(raceHistoryAttempted)return;raceHistoryAttempted=true;const hash='aed114e9b0368d88eca9103bd385ca163ccf7aac86a85720825f3c7a03fca77b',key='radar:demografia:race:'+hash;try{let raw;try{const r=await fetch('data/radar_hub/projections/demografia-cor-raca-historica.json',{cache:'no-cache'});if(!r.ok)throw Error('HTTP');raw=await r.text();}catch(_){raw=localStorage.getItem(key);}if(!raw)throw Error('Absent');const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));if(Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('')!==hash)throw Error('Hash');const extra=JSON.parse(raw);if(extra.territory!=='3549904'||extra.rows.length!==10||!extra.rows.every(r=>[1991,2000].includes(r.year)&&r.value!=null&&r.denominator>0))throw Error('Recorte');const offset=data.sources.length;data={...data,sources:[...data.sources,...extra.sources],rows:{...data.rows,race:[...data.rows.race,...extra.rows.map(r=>({...r,source:r.source+offset}))]},notes:{...data.notes,raceHistorical:extra.note}};try{localStorage.setItem(key,raw);}catch(_){}if(root)root.dataset.demoRaceHistory='verified';}catch(_){if(root)root.dataset.demoRaceHistory='unavailable';}}

 async function loadMunicipalityBoundary(){
  const hash='dac7c167692b6244acdd5331ab311f8815a45dc95528ce245e7bde481bd63ba6',key='radar:demografia:limite:'+hash;
  async function checked(raw){const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));if(Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('')!==hash)throw Error('Limite inválido');const geo=JSON.parse(raw);if(!geo.geometry)throw Error('Geometria ausente');return geo;}
  try{const res=await fetch('data/radar_hub/projections/demografia-limite-municipal.json',{cache:'no-cache'});if(!res.ok)throw Error('HTTP');const raw=await res.text();municipalityBoundary=await checked(raw);try{localStorage.setItem(key,raw);}catch(_){} }
  catch(_){try{const raw=localStorage.getItem(key);if(raw)municipalityBoundary=await checked(raw);}catch(_){} }
 }
 async function loadLegalReference(){
  const hash='b317fccebcd65d6518a06d4f93a625615a52678f2e30167fd927d357b9b11605',key='radar:demografia:legal:'+hash;
  async function check(raw){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));if(Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('')!==hash)throw Error('Hash');const p=JSON.parse(raw);if(p.features.length!==2||p.population_join_eligible!==false)throw Error('Contrato');return p;}
  try{const r=await fetch('data/radar_hub/projections/demografia-setores-lc612.json',{cache:'no-cache'});if(!r.ok)throw Error('HTTP');const raw=await r.text();legalReference=await check(raw);try{localStorage.setItem(key,raw);}catch(_){} }
  catch(_){try{const raw=localStorage.getItem(key);if(raw)legalReference=await check(raw);}catch(_){} }
 }
 function renderLegalReference(adjustBounds=false){
  if(legalLayer){map.removeLayer(legalLayer);legalLayer=null;}
  if(showLegalReference&&legalReference){
   if(!map.getPane('demoHistoric')){map.createPane('demoHistoric');map.getPane('demoHistoric').style.zIndex='625';}
   legalLayer=L.geoJSON(legalReference,{pane:'demoHistoric',style:{color:'#a855f7',weight:4,dashArray:'7 4',fill:false},onEachFeature(f,l){
    const name=esc(f.properties.nome),message='<strong>'+name+' · limite histórico de 2018</strong><br>LC 612/2018 · Anexo V-A<br>Referência territorial de 2018 — não corresponde necessariamente à divisão atual.<br>Sem vínculo populacional validado para 2022.<br><a href="https://www.sjc.sp.gov.br/media/krxpdphi/10_anexo5a_coordenadas_setores_socioeconomicos.pdf" target="_blank" rel="noopener">Fonte: coordenadas oficiais da Prefeitura</a>';
    l.bindTooltip(name+' · 2018',{permanent:true,direction:'top'});l.bindPopup(message);
   }}).addTo(map);
   legalLayer.eachLayer(l=>{const el=l.getElement?.();if(el){el.setAttribute('tabindex','0');el.setAttribute('role','button');el.setAttribute('aria-label',l.feature.properties.nome+' · limite histórico de 2018');el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();l.openPopup();}});}});
   if(adjustBounds)map.fitBounds(legalLayer.getBounds(),{padding:[55,55],maxZoom:12});
  }else if(adjustBounds&&boundaryLayer)map.fitBounds(boundaryLayer.getBounds(),{padding:[15,15]});
  const legend=root?.querySelector('#demo-historic-legend');if(legend)legend.hidden=!showLegalReference;
 }
 function territoryContext(){
  const selector=root?.querySelector('#demo-region');
  if(selector&&territoryData){const current=region;selector.innerHTML='<option value="todas">Todas as regiões (total SJC)</option>'+territoryData.regioes.map(r=>'<option value="'+esc(r.nome.toLocaleLowerCase('pt-BR').includes('francisco')?'são francisco xavier':r.nome.toLocaleLowerCase('pt-BR'))+'">'+esc(r.nome)+' ('+fmt(r.populacao)+' hab)</option>').join('');selector.value=current;}
  const host=root?.querySelector('#hubMapDemografiaCalor');if(!host)return;
  let note=root.querySelector('#demo-territory-context');
  if(!note){note=document.createElement('details');note.id='demo-territory-context';note.className='demo-note';host.insertAdjacentElement('afterend',note);}
  note.innerHTML='<summary>Cobertura e divisões territoriais</summary><p>'+(municipalityBoundary?'O contorno tracejado mostra o município inteiro (IBGE, distritos 2022).':'O limite municipal verificado está indisponível nesta sessão; a malha de setores continua utilizável.')+' A malha disponível contém 35 unidades; Rural Norte, Rural Sul, Buquirinha e Santa Inês permanecem disponíveis na consulta tabular, sem limites vetoriais nesta camada.</p><p>Região Rural municipal: <strong>15.212 habitantes</strong> (13.718 no Norte + 1.494 no Sul). Situação rural do domicílio no IBGE: <strong>8.899 habitantes</strong>. As classificações são distintas; sua correspondência espacial não foi harmonizada.</p><p>Freitas figura como subsetor rural 31 no Decreto 20.090/2025. Costinha é uma localidade da região norte; não foi comprovado um limite próprio nem sua equivalência a esse subsetor. A divisão rural de 2025 não substitui os recortes censitários de 2022.</p><p><a href="https://www.sjc.sp.gov.br/servicos/governanca/populacao/" target="_blank" rel="noopener">População e regiões · Prefeitura</a> · <a href="https://sidra.ibge.gov.br/tabela/9923" target="_blank" rel="noopener">Situação do domicílio · IBGE</a> · <a href="https://geoftp.ibge.gov.br/organizacao_do_territorio/malhas_territoriais/malhas_de_setores_censitarios__divisoes_intramunicipais/censo_2022/distritos/shp/UF/SP_distritos_CD2022.zip" target="_blank" rel="noopener">Limite municipal · distritos IBGE 2022</a> · <a href="https://servicos.sjc.sp.gov.br/Legislacao/Arquivos/Decretos/2025/DE_2025_00020090.pdf" target="_blank" rel="noopener">Subsetores rurais · Decreto 20.090/2025</a></p>'; 
  if(note?.insertAdjacentHTML)note.insertAdjacentHTML('beforeend','<p>A tabela municipal atual traz Norte:61.940 e Rural:15.212. A notícia de 2024 traz 61.780 e 15.372; a causa da diferença de 160 pessoas não foi documentada. Esta tela utiliza integralmente a tabela municipal consultada em13/10/2026.</p><p>Domicílios regionais: valores publicados pela Prefeitura. Embora a coluna oficial use “particulares”, seu total de 282.214 coincide com todos os domicílios recenseados no IBGE, cujo total de particulares é 281.931. O universo regional ainda requer esclarecimento; 9.808 são domicílios publicados para a região Rural, não habitantes nem domicílios particulares ocupados rurais do IBGE.</p>');
  else if(note)note.innerHTML+='<p>A tabela municipal atual traz Norte:61.940 e Rural:15.212. A notícia de 2024 traz 61.780 e 15.372; a causa da diferença de 160 pessoas não foi documentada. Esta tela utiliza integralmente a tabela municipal consultada em13/10/2026.</p><p>Domicílios regionais: valores publicados pela Prefeitura. Embora a coluna oficial use “particulares”, seu total de 282.214 coincide com todos os domicílios recenseados no IBGE, cujo total de particulares é 281.931. O universo regional ainda requer esclarecimento; 9.808 são domicílios publicados para a região Rural, não habitantes nem domicílios particulares ocupados rurais do IBGE.</p>';
  let controls=root.querySelector('#demo-historic-controls');
  if(legalReference){
   if(!controls){controls=document.createElement('div');controls.id='demo-historic-controls';controls.className='demo-note';host.insertAdjacentElement('beforebegin',controls);}
   controls.innerHTML='<label><input type="checkbox" data-demo-legal-reference '+(showLegalReference?'checked':'')+'> <strong>Exibir limites históricos de 2018</strong></label><p id="demo-historic-legend" '+(showLegalReference?'':'hidden')+'><span style="color:#a855f7">━</span> Buquirinha e Santa Inês · Referência territorial de 2018 — não corresponde necessariamente à divisão atual.</p>';
  }


 }
 async function loadTerritory(){if(territoryData)return territoryData;if(territoryAttempted)return territoryData;territoryAttempted=true;
  const hash='88398f4a71bdb029843069a3f4a48b7e46cb73b38511ad66df8257ec66711696',key='radar:demografia:territorio:'+hash;
  async function checked(raw){const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));if(Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('')!==hash)throw Error('Hash territorial');const parsed=JSON.parse(raw);if(parsed.territory!=='3549904'||parsed.regioes.length!==8||parsed.setores.length!==39)throw Error('Recorte territorial');return parsed;}
  try{const res=await fetch('data/radar_hub/projections/demografia-territorio.json',{cache:'no-cache'});if(!res.ok)throw Error('HTTP');const raw=await res.text();territoryData=await checked(raw);try{localStorage.setItem(key,raw);}catch(_){} }
  catch(_){try{const raw=localStorage.getItem(key);if(raw)territoryData=await checked(raw);}catch(_){} }
  return territoryData;
 }
 function findSector(code,name){if(!territoryData?.setores)return null;const c=String(code||'').trim();const n=String(name||'').trim().toLowerCase();if(c)return territoryData.setores.find(s=>s.codigo===c)||null;return territoryData.setores.find(s=>s.nome.toLowerCase()===n||(s.nome_geo&&s.nome_geo.toLowerCase()===n));}
 function findRegion(name){if(!territoryData?.regioes)return null;const n=String(name||'').trim().toLowerCase();return territoryData.regioes.find(r=>r.nome.toLowerCase()===n||(n==='são francisco xavier'&&r.nome.toLowerCase().includes('francisco'))||(n.includes('francisco')&&r.nome.toLowerCase().includes('francisco'))||r.nome.toLowerCase().replace(/[^a-z]/g,'')===n.replace(/[^a-z]/g,''));}
 function getFeatureColor(p){if(territoryMetric!=='populacao')return '#cbd5e1';const sec=findSector(p.codigo_setor,p.nome);if(!sec||sec.populacao==null)return '#e2e8f0';const pop=sec.populacao;if(pop>=50000)return '#0369a1';if(pop>=30000)return '#0284c7';if(pop>=15000)return '#38bdf8';if(pop>=5000)return '#7dd3fc';return '#bae6fd';}
 function getFeatureStyle(f,isActive=false){if(isActive)return {color:'#0f172a',weight:3.5,fillColor:'#38bdf8',fillOpacity:.85};return {color:blue,weight:1,fillColor:getFeatureColor(f.properties),fillOpacity:.65};}
 function updateSelectionCard(name){const box=root?.querySelector('#demo-territory-selection');if(!box)return;if(!territoryData){box.textContent=name?`${name} · unidade municipal`:'Escolha um polígono ou uma unidade na lista.';return;}if(!name||name==='todas'){box.className='demo-territory-hero';box.innerHTML='<div class="demo-thero-head"><span class="demo-thero-badge"><i class="fa-solid fa-city" aria-hidden="true"></i> São José dos Campos</span><span class="demo-thero-year">Censo 2022</span></div><div class="demo-thero-main"><strong class="demo-thero-pop">697.054</strong><span class="demo-thero-label">habitantes no município</span></div><div class="demo-thero-stats"><div class="demo-tstat-item"><span>Domicílios recenseados · IBGE:</span> <strong>282.214</strong></div><div class="demo-tstat-item"><span>Densidade Demográfica:</span> <strong>634,03 hab/km²</strong></div></div><p class="demo-thero-hint">Selecione uma região ou setor para consultar a população oficial apurada pelo IBGE e PMSJC.</p>';return;}const reg=findRegion(name);if(reg&&territoryMode==='regioes'){box.className='demo-territory-hero demo-thero-region';box.innerHTML=`<div class="demo-thero-head"><span class="demo-thero-badge"><i class="fa-solid fa-map" aria-hidden="true"></i> Macro-Região</span><span class="demo-thero-rank">#${reg.ranking} em população</span></div><h5 class="demo-thero-title">${reg.nome==='Rural'?'Região Rural · divisão da Prefeitura':'Região '+esc(reg.nome)}</h5><div class="demo-thero-main"><strong class="demo-thero-pop">${fmt(reg.populacao)}</strong><span class="demo-thero-label">habitantes (${fmt(reg.pct_populacao,2)}% de SJC)</span></div><div class="demo-thero-stats"><div class="demo-tstat-item"><span>Domicílios · tabela regional municipal:</span> <strong>${fmt(reg.domicilios)}</strong></div><div class="demo-tstat-item"><span>Fonte oficial:</span> <strong>PMSJC · Censo 2022 · consulta 13/10/2026</strong></div></div>`;return;}const sec=findSector(null,name);if(sec){box.className='demo-territory-hero demo-thero-sector';const geoText=sec.has_geometry?'Geometria disponível · vínculo cartográfico pendente':'Área oficial tabular (sem polígono vetorial na malha)';box.innerHTML=`<div class="demo-thero-head"><span class="demo-thero-badge">${sec.codigo_oficial===null?'Área rural municipal':'Setor '+esc(sec.codigo)} · Região ${esc(sec.regiao)}</span><span class="demo-thero-rank">#${sec.ranking} de 39</span></div><h5 class="demo-thero-title">${esc(sec.nome)}</h5><div class="demo-thero-main"><strong class="demo-thero-pop">${fmt(sec.populacao)}</strong><span class="demo-thero-label">habitantes (${fmt(sec.pct_populacao,2)}% de SJC)</span></div><div class="demo-thero-stats"><div class="demo-tstat-item"><span>Malha vetorial:</span> <strong>${geoText}</strong></div><div class="demo-tstat-item"><span>Densidade setorial:</span> <strong>Pendente de base específica</strong></div></div><p class="demo-thero-hint">Fonte: Prefeitura · Censo 2022 · tabela consultada em 13/10/2026.</p>${sec.nota_divergencia?`<p class="demo-thero-subnote"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> ${esc(sec.nota_divergencia)}</p>`:''}`;return;}box.textContent=name+' · unidade municipal';}
 function updateTerritoryList(features){const list=root?.querySelector('#demo-territory-list');const countEl=root?.querySelector('#hubChartDemografiaRegioes');const searchWrap=root?.querySelector('#demo-search-container');if(!list)return;if(!territoryData){list.innerHTML=features.slice().sort((a,b)=>a.properties.nome.localeCompare(b.properties.nome,'pt-BR')).map(f=>`<button type="button" data-demo-sector="${esc(f.properties.nome)}" aria-pressed="${selected===f.properties.nome}">${esc(f.properties.nome)} <span>· ${esc(f.properties.regiao)}</span></button>`).join('');if(countEl)countEl.textContent=features.length+' unidades municipais nesta seleção · lista em ordem alfabética.';return;}if(searchWrap)searchWrap.hidden=territoryMode!=='setores';if(territoryMode==='regioes'){const maxPop=territoryData.regioes[0].populacao;list.innerHTML=territoryData.regioes.map(r=>{const isSel=selected===r.nome||region===r.nome.toLocaleLowerCase('pt-BR');return `<button type="button" class="demo-territory-item-btn" data-demo-region-select="${esc(r.nome)}" aria-pressed="${isSel}"><div class="demo-titem-top"><span class="demo-titem-rank">#${r.ranking}</span><strong class="demo-titem-name">${esc(r.nome)}</strong><span class="demo-titem-pop">${fmt(r.populacao)} hab</span></div><div class="demo-titem-bar"><div class="demo-titem-track"><i style="width:${(r.populacao/maxPop*100).toFixed(1)}%"></i></div><span class="demo-titem-pct">${fmt(r.pct_populacao,2)}%</span></div><div class="demo-titem-sub"><span>${fmt(r.domicilios)} domicílios · tabela municipal</span></div></button>`;}).join('');if(countEl)countEl.textContent='8 macro-regiões oficiais somam 697.054 habitantes e 282.214 domicílios.';}else{let filtered=territoryData.setores.slice();if(region!=='todas'){filtered=filtered.filter(s=>s.regiao.toLocaleLowerCase('pt-BR')===region||(region==='são francisco xavier'&&s.regiao.toLowerCase().includes('francisco')));if(filtered.length===0){filtered=territoryData.setores.filter(s=>s.regiao.toLocaleLowerCase('pt-BR').includes(region));}}if(searchTerm){const term=searchTerm.toLowerCase();filtered=filtered.filter(s=>s.nome.toLowerCase().includes(term)||s.codigo.toLowerCase().includes(term)||s.regiao.toLowerCase().includes(term));}const maxPop=territoryData.setores[0].populacao;list.innerHTML=filtered.map(s=>{const isSel=selected===s.nome;const geoTag=s.has_geometry?'<span class="demo-tbadge-geo" title="Polígono mapeado na malha vetorial"><i class="fa-solid fa-draw-polygon" aria-hidden="true"></i> Mapeado</span>':'<span class="demo-tbadge-tab" title="Área oficial tabular (sem polígono na malha)"><i class="fa-solid fa-table" aria-hidden="true"></i> Sem geometria na malha atual</span>';return `<button type="button" class="demo-territory-item-btn" data-demo-sector="${esc(s.nome)}" aria-pressed="${isSel}"><div class="demo-titem-top"><span class="demo-titem-rank">#${s.ranking}</span><strong class="demo-titem-name">${esc(s.nome)}</strong><span class="demo-titem-regiao">${esc(s.regiao)}</span><span class="demo-titem-pop">${fmt(s.populacao)} hab</span></div><div class="demo-titem-bar"><div class="demo-titem-track"><i style="width:${(s.populacao/maxPop*100).toFixed(1)}%"></i></div><span class="demo-titem-pct">${fmt(s.pct_populacao,2)}%</span></div><div class="demo-titem-sub">${geoTag}${!s.has_geometry&&legalReference?.features.some(f=>f.properties.codigo_setor===s.codigo)?'<span class="demo-tbadge-tab" style="color:#a855f7">Limite histórico disponível · 2018</span>':''}${s.nota_divergencia?'<span class="demo-tbadge-div" title="Divergência de subsetores na publicação"><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> Subsetores</span>':''}</div></button>`;}).join('');if(countEl)countEl.textContent=`${filtered.length} de 39 setores e áreas exibidos · Censo 2022.`;}}
 function yearButtons(key,years,selected){return `<div class="demo-years" role="group" aria-label="Censo">${years.map(y=>`<button type="button" class="demo-action" data-demo-mode="${key}" data-value="${y}" aria-pressed="${String(selected)===String(y)}">${y}</button>`).join('')}</div>`;}


 function select(key,label,values){return `<label>${esc(label)}<select data-demo-filter="${key}">${values.map(v=>{const [value,text]=Array.isArray(v)?v:[v,v];return `<option value="${esc(value)}" ${String(state[key])===String(value)?'selected':''}>${esc(text)}</option>`;}).join('')}</select></label>`;}
 const text=(x,y,t,attrs='')=>`<text x="${x}" y="${y}" ${attrs}>${esc(t)}</text>`;
 function mark(shape,r,description){return `<g tabindex="0" role="img" aria-label="${esc(description)}" data-demo-tip="${esc(description)}">${shape}<title>${esc(description)}</title></g>`;}
 function svg(body,h,label){return `<svg class="demo-svg" viewBox="0 0 720 ${h}" role="group" aria-label="${esc(label)}">${body}</svg>`;}
 const legend=(a,b,ca=blue)=>`<div class="demo-legend"><span><i style="background:${ca}"></i>${esc(a)}</span>${b?`<span><i style="background:${violet}"></i>${esc(b)}</span>`:''}</div>`;
 function value(r,unit){return r.value==null?null:unit==='Percentual'?100*r.value/r.denominator:r.value;}
 function decorate(rows,unit){return rows.map(r=>({...r,display_value:value(r,unit),display_unit:unit,percentage:r.value!=null&&r.denominator?100*r.value/r.denominator:null,source_url:data.sources[r.source]?.url,source_sha256:data.sources[r.source]?.sha256,universe:data.sources[r.source]?.universe}));}
 function source(rows,note,unit){const ids=[...new Set(rows.map(r=>r.source))],years=[...new Set(rows.map(r=>r.year))].sort((a,b)=>a-b);return `<div class="demo-source">${ids.map(i=>`<a href="${esc(data.sources[i].url)}" target="_blank" rel="noopener">IBGE · SIDRA ${esc(data.sources[i].url.split('/').pop())}</a>`).join(' · ')}<span>${years.length?(years.length===1?years[0]:years[0]+'–'+years.at(-1)):'Sem observações'} · ${esc(unit)} · São José dos Campos</span></div>`;}
  function tools(key,rows,note,unit){const exportRows=decorate(rows,unit);visible.set(key,exportRows);return `${source(rows,note,unit)}<div class="demo-disclosures"><details><summary>Ficha técnica e rastreabilidade</summary><p>${esc(note)}</p>${[...new Set(rows.map(r=>r.source))].map(i=>`<p>${esc(data.sources[i].universe)} · ${esc(data.sources[i].edition)}<br>SHA-256: ${esc(data.sources[i].sha256)}</p>`).join('')}<p>Percentual = contagem / denominador explícito × 100. Ausências são null; não interpoladas. Projeção R2; fonte consolidada ${VERSION}.</p></details><details><summary>Tabela alternativa · ${rows.length} registros</summary><div class="demo-table-wrap"><table><caption class="demo-note">Mesmo recorte exibido no gráfico</caption><thead><tr><th>Ano</th><th>Categoria</th><th>Recorte</th><th>Contagem</th><th>Denominador</th><th>${esc(unit)}</th></tr></thead><tbody>${exportRows.map(r=>`<tr><td>${r.year}</td><td>${esc(r.category)}</td><td>${esc(r.sex||r.product||'Total')}</td><td>${fmt(r.value,Number.isInteger(r.value)?0:2)}</td><td>${r.denominator?fmt(r.denominator):'-'}</td><td>${fmt(r.display_value,['Percentual','Taxa anual (%)','Moradores por domicílio'].includes(unit)?2:0)}</td></tr>`).join('')}</tbody></table></div></details></div>`;}
 function put(key,controls,chart,summary,rows,note,unit='Pessoas'){const host=root.querySelector(`[data-demo-chart="${key}"]`);if(!host)return;const open=[...host.querySelectorAll('details')].map(d=>d.open);const slot=['sex','urban','race','religion'].includes(key)&&root?root.querySelector(`[data-demo-slot="${key}"]`):null;if(slot)slot.innerHTML=controls;const ctrlHtml=slot?'':`<div class="demo-controls">${controls}</div>`;const body=`${ctrlHtml}${chart}<p class="demo-summary">${summary}</p><div class="demo-tip demo-chart-tip" hidden aria-live="polite"></div>`,footer=tools(key,rows,note,unit);host.innerHTML=['history','pyramid','race','religion'].includes(key)?`<div class="demo-card-body">${body}</div><div class="demo-card-footer">${footer}</div>`:body+footer;host.querySelectorAll('details').forEach((d,i)=>d.open=!!open[i]);}
  function history(){const rs=data.rows.history.filter(r=>r.product===state.historyProduct),years=rs.map(r=>r.year);if(!years.includes(+state.historyFrom))state.historyFrom=Math.min(...years);if(!years.includes(+state.historyTo))state.historyTo=Math.max(...years);const rows=rs.filter(r=>r.year>=+state.historyFrom&&r.year<=+state.historyTo),host=root.querySelector('[data-demo-chart="history"]'),width=Math.max(260,host.clientWidth||720),left=width<400?44:54,right=width-18,isDesktop=global.matchMedia?.('(min-width:1001px)').matches??(width>=500),h=isDesktop?510:(width<450?290:(width<600?320:360)),baseY=h-54,plotH=baseY-44,max=Math.max(...rs.map(r=>r.value))*1.08,start=+state.historyFrom,end=+state.historyTo,x=year=>left+(year-start)/Math.max(1,end-start)*(right-left),y=v=>baseY-v/max*plotH;let body=`<defs><linearGradient id="demo-petroleo-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${petroleo}" stop-opacity="0.14"/><stop offset="100%" stop-color="${petroleo}" stop-opacity="0.01"/></linearGradient></defs>`;for(let i=0;i<=4;i++){const v=max*i/4;body+=`<path d="M${left} ${y(v).toFixed(1)}H${right}" stroke="#e2e8f0" stroke-width="1"/>`+text(left-8,(y(v)+4).toFixed(1),fmt(v/1000)+' mil','text-anchor="end" class="demo-axis-label"');}const isCenso=state.historyProduct==='Censo';if(rows.length>1){const areaD=`M ${x(rows[0].year).toFixed(1)} ${y(0).toFixed(1)} `+rows.map(r=>`L ${x(r.year).toFixed(1)} ${y(r.value).toFixed(1)}`).join(' ')+` L ${x(rows.at(-1).year).toFixed(1)} ${y(0).toFixed(1)} Z`;body+=`<path d="${areaD}" fill="url(#demo-petroleo-grad)"/>`;body+=`<path d="${rows.map((r,i)=>(i?'L':'M')+x(r.year).toFixed(1)+' '+y(r.value).toFixed(1)).join(' ')}" fill="none" stroke="${petroleo}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="demo-history-line"/>`;if(isCenso){for(let i=1;i<rows.length;i++){const prev=rows[i-1],curr=rows[i];const x1=x(prev.year),y1=y(prev.value);const x2=x(curr.year),y2=y(curr.value);const dx=x2-x1;if(dx>=38){const t=i===5?(width<380?0.60:0.56):(i>=3?0.52:0.50);const offset=(i===3||i===4)?14:13;const mx=x1+t*dx,my=y1+t*(y2-y1);const yearsDiff=curr.year-prev.year,ratio=curr.value/prev.value,diffPct=(ratio-1)*100,geomAnnual=(Math.pow(ratio,1/Math.max(1,yearsDiff))-1)*100,sign=diffPct>=0?'+':'',label=`${sign}${fmt(diffPct,1)}%`,desc=`${prev.year} a ${curr.year} (${yearsDiff} ${yearsDiff===1?'ano':'anos'}): ${sign}${fmt(diffPct,1)}% no período · taxa geométrica de ${geomAnnual>=0?'+':''}${fmt(geomAnnual,2)}% ao ano`,pw=width<420?34:36,ph=width<420?13:14,pillY=my-offset;body+=`<g class="demo-growth-pill" tabindex="0" role="img" aria-label="${esc(desc)}" data-demo-tip="${esc(desc)}"><rect x="${(mx-pw/2).toFixed(1)}" y="${(pillY-ph/2).toFixed(1)}" width="${pw}" height="${ph}" rx="${(ph/2).toFixed(1)}" fill="#ecfdf5" stroke="#86efac" stroke-width="1" class="demo-pill-bg"/><text x="${mx.toFixed(1)}" y="${pillY.toFixed(1)}" fill="#166534" font-size="${width<420?9:9.5}" font-weight="700" text-anchor="middle" dominant-baseline="central" class="demo-pill-text">${esc(label)}</text></g>`;}}}}const every=isCenso?1:Math.max(1,Math.ceil(rows.length/Math.max(2,Math.floor((right-left)/80))));rows.forEach((r,i)=>{const desc=`${r.year} · ${r.product}: ${fmt(r.value)} habitantes`;body+=mark(`<circle cx="${x(r.year).toFixed(1)}" cy="${y(r.value).toFixed(1)}" r="6" fill="${petroleo}" stroke="#ffffff" stroke-width="2.5" class="demo-history-dot"/>`,r,desc);if((i%every===0&&(i===0||x(rows.at(-1).year)-x(r.year)>60))||i===rows.length-1){const anchor=i===0?'start':i===rows.length-1?'end':'middle';body+=text(x(r.year).toFixed(1),(y(r.value)-13).toFixed(1),fmt(r.value),`text-anchor="${anchor}" fill="#0f172a" font-size="12" font-weight="750" class="demo-point-value"`)+text(x(r.year).toFixed(1),(baseY+26).toFixed(1),r.year,`text-anchor="${anchor}" fill="#64748b" font-size="11.5" font-weight="600" class="demo-year-label"`);}});const chart=`<svg class="demo-svg demo-history" viewBox="0 0 ${width} ${h}" style="height:${h}px" role="group" aria-label="Evolução da população em habitantes">${body}</svg>`;const summary=rows.length?(state.historyProduct==='Censo'?`${fmt(rows.at(-1).value)} habitantes no Censo ${rows.at(-1).year} · série histórica de ${rows.length} Censos oficiais. Rótulos verdes nos segmentos destacam a variação acumulada do intervalo (interaja para ver a taxa anual média).`:`${fmt(rows.at(-1).value)} habitantes em ${rows.at(-1).year} · ${rows.length} estimativas oficiais publicadas.`):'Nenhuma observação nesse intervalo.';put('history',select('historyProduct','Produto',['Censo','Estimativa'])+select('historyFrom','De',years)+select('historyTo','Até',years),legend(state.historyProduct+' · habitantes',null,petroleo)+chart,summary,rows,'Linha liga somente observações publicadas; não preenche anos ausentes. Censos e estimativas separados. Limites municipais conforme cada edição.','Pessoas');}
 function pyramid(){const rows=data.rows.pyramid.filter(r=>r.year==state.pyramidYear),max=Math.max(...decorate(data.rows.pyramid,state.pyramidUnit).map(r=>r.display_value))*1.05,bands=[...new Set(rows.map(r=>r.category))].reverse(),unit=state.pyramidUnit,suffix=unit==='Percentual'?'%':'';const chart=legend('Homens','Mulheres')+`<div class="demo-pyramid" role="group" aria-label="Pirâmide etária: 21 faixas por sexo">${bands.map(band=>{const rs=rows.filter(r=>r.category===band),cell=sex=>{const r=rs.find(r=>r.sex===sex),v=value(r,unit),description=`${band} · ${sex}: ${fmt(r.value)} pessoas · ${fmt(100*r.value/r.denominator,2)}%`;return `<div class="demo-pyramid-side ${sex==='homens'?'demo-male':'demo-female'}" tabindex="0" role="img" aria-label="${esc(description)}" data-demo-tip="${esc(description)}"><span class="demo-pyramid-number">${fmt(v,unit==='Percentual'?2:0)}${suffix}</span><div class="demo-pyramid-track"><i style="width:${v/max*100}%"></i></div></div>`;};return `<div class="demo-pyramid-row">${cell('homens')}<span class="demo-age">${esc(band.replace(' anos ou mais','+').replace(' anos','').replace(' a ','–'))}</span>${cell('mulheres')}</div>`;}).join('')}</div><p class="demo-note">${unit==='Percentual'?'% da população municipal':'Pessoas'} · escala comum aos três Censos: 0–${fmt(max,unit==='Percentual'?1:0)}${suffix} por lado.</p>`;put('pyramid',select('pyramidYear','Censo',[2000,2010,2022])+select('pyramidUnit','Unidade',['Pessoas','Percentual']),chart,`${fmt(rows.reduce((sum,r)=>sum+r.value,0))} residentes · Censo ${state.pyramidYear}`,rows,'21 faixas disjuntas. 2010: idades simples agrupadas onde não existe faixa quinquenal nativa. Percentuais sobre o total do respectivo Censo.',unit);const a=data.auxiliary[String(state.pyramidYear)];[['idade-mediana','median',' anos'],['indice-envelhecimento','aging',''],['razao-sexo','sex_ratio',''],['razao-dependencia','dependency','%']].forEach(([id,k,s])=>{const el=root.querySelector('#demo-metric-'+id);if(el)el.textContent=a[k]==null?'Não disponível':fmt(a[k],k==='median'?0:2)+s;});root.querySelector('#demo-aux-year').innerHTML='Censo '+state.pyramidYear+' · <a href="https://sidra.ibge.gov.br/tabela/9515" target="_blank" rel="noopener">Métricas publicadas · IBGE 9515</a>'; }
 function compositionKpis(rows,type,total){const icons={homens:'<circle cx="12" cy="4" r="2.5"/><path d="M8 22v-7H6l2-7h8l2 7h-2v7M12 15v7"/>',mulheres:'<circle cx="12" cy="4" r="2.5"/><path d="M8 22v-5H5l4-9h6l4 9h-3v5M12 17v5"/>',urbana:'<path d="M3 22V9h7V3h11v19M7 13v2m0 3v1m7-12v2m4-2v2m-4 3v2m4-2v2m-4 3v2m4-2v2M1 22h22"/>',rural:'<path d="M5 19C-1 9 9 3 22 3c0 12-6 19-15 16M3 22 18 7M10 15l-1-6m4 3 6 1"/>'};return `<div class="demo-composition-kpis" role="group" aria-label="${type==='sex'?'Participação por sexo':'População urbana e rural'}">${rows.map(r=>{const key=r.category.toLocaleLowerCase('pt-BR'),label=key==='homens'?'Homens':key==='mulheres'?'Mulheres':key==='urbana'?'Urbana':'Rural',percent=r.value==null?null:total?100*r.value/total:value(r,'Percentual');return `<div class="demo-composition-kpi demo-kpi-${key}"><div class="demo-kpi-label"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[key]||''}</svg><span>${label}</span></div><strong class="demo-kpi-percent">${percent==null?'Não disponível':fmt(percent,2)+'%'}</strong><span class="demo-kpi-count">${r.value==null?'Contagem não disponível':fmt(r.value)+' pessoas'}</span></div>`;}).join('')}</div>`;}
 function sex(){const rows=data.rows.sex.filter(r=>r.year==state.sexYear),total=rows.reduce((sum,r)=>sum+r.value,0);put('sex',select('sexYear','Censo',[1970,1980,1991,2000,2010,2022]),compositionKpis(rows,'sex',total),`${fmt(total)} pessoas · Censo ${state.sexYear}`,rows,'Sexo conforme classificação censitária oficial. Participações sobre o total do respectivo Censo.','Percentual');}

  function dumbbell(rows,unit,years){const family=[1991,2010].includes(years[0])?data.rows.race.filter(r=>years.includes(r.year)):data.rows.religion_history,max=unit==='Percentual'?100:Math.max(1,...family.map(r=>r.value??0))*1.08,cats=[...new Set(rows.map(r=>r.category))].sort((a,b)=>value(rows.find(r=>r.category===b&&r.year===years[1]),unit)-value(rows.find(r=>r.category===a&&r.year===years[1]),unit));return legend(years[0],years[1])+`<div class="demo-editorial-dumbbells">${cats.map(cat=>{const rs=rows.filter(r=>r.category===cat).sort((a,b)=>a.year-b.year),a=value(rs[0],unit),b=rs[1]?value(rs[1],unit):null,pp=a!=null&&b!=null?100*rs[1].value/rs[1].denominator-100*rs[0].value/rs[0].denominator:null,x=v=>12+v/max*276;let body='<path d="M12 31H288" stroke="#e2e8f0" stroke-width="1"/>';[12,150,288].forEach(pos=>body+=`<path d="M${pos} 27V35" stroke="#cbd5e1"/>`);if(a!=null&&b!=null)body+=`<path d="M${x(a)} 31H${x(b)}" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>`;rs.forEach((r,j)=>{const v=value(r,unit);if(v!=null)body+=`<path d="M${x(v)} 31V${j?43:19}" stroke="${j?violet:blue}"/>`;});return `<div class="demo-dumbbell-row"><span class="demo-category">${esc(cat)}</span><div class="demo-dumbbell-plot"><svg class="demo-mini-svg" viewBox="0 0 300 62" preserveAspectRatio="none" role="group" aria-label="${esc(cat)} · ${years[0]} e ${years[1]}">${body}</svg>${rs.map((r,j)=>{const v=value(r,unit);return `${v==null?'':`<span class="demo-fixed-dot ${j?'demo-dot-latest':'demo-dot-earliest'}" style="left:${4+v/max*92}%" tabindex="0" role="img" aria-label="${esc(cat)} · ${r.year}: ${fmt(v,unit==='Percentual'?2:0)} ${esc(unit)}" data-demo-tip="${esc(cat)} · ${r.year}: ${fmt(r.value)} pessoas · ${fmt(100*r.value/r.denominator,2)}%"></span>`}<span class="demo-dot-label ${j?'demo-latest':'demo-earliest'}" style="left:clamp(28px,${v==null?50:4+v/max*92}%,calc(100% - 28px))">${fmt(v,unit==='Percentual'?2:0)}${unit==='Percentual'?'%':''}</span>`;}).join('')}</div><span class="demo-difference" aria-label="${esc(cat)}: variação ${pp==null?'não disponível':fmt(pp,2)+' pontos percentuais'}">${pp==null?'-':(pp>0?'+':'')+fmt(pp,2)}<small>p.p.</small></span></div>`;}).join('')}</div><p class="demo-note demo-comparison-scale">Escala fixa: 0–${fmt(max,unit==='Percentual'?0:0)}${unit==='Percentual'?'%':' pessoas'} · ordenação pela participação mais recente.</p>`;}
 function censusHeader(key,title,subtitle){const card=root.querySelector(`[data-demo-chart="${key}"]`)?.closest?.('article');if(!card)return;let slot=card.querySelector(`[data-demo-slot="${key}"]`);if(!slot&&global.document?.createElement){const header=document.createElement('div'),titles=document.createElement('div');header.className='demo-card-header';titles.className='demo-card-header-titles';slot=document.createElement('div');slot.className='demo-header-control';slot.dataset.demoSlot=key;for(const node of [card.querySelector('.demo-kicker'),card.querySelector('h4'),card.querySelector('.demo-subtitle')])if(node)titles.appendChild(node);header.appendChild(titles);header.appendChild(slot);card.insertBefore(header,card.firstChild);}const heading=card.querySelector('h4'),sub=card.querySelector('.demo-subtitle');if(heading)heading.textContent=title;if(sub)sub.textContent=subtitle;}
 function censusBars(rows){return `<div class="demo-bars demo-census-bars">${rows.map(r=>{const pct=r.value!=null&&r.denominator>0?100*r.value/r.denominator:null,label=pct==null?'Não disponível':(pct>0&&pct<.005?'<0,01':fmt(pct,2))+'%',description=`Censo ${r.year} · ${r.category}: ${label}${r.value!=null?' · '+fmt(r.value)+' pessoas':''}`;return `<div class="demo-bar-row"><div class="demo-bar-heading"><span class="demo-category">${esc(r.category)}</span><strong>${esc(label)}${r.value!=null?`<small>${fmt(r.value)} pessoas</small>`:''}</strong></div>${pct==null?'':`<div class="demo-bar-track" tabindex="0" role="img" aria-label="${esc(description)}" data-demo-tip="${esc(description)}"><i style="width:${pct}%;"></i></div>`}</div>`;}).join('')}</div>`;}
 function race(){const available=[...new Set(data.rows.race.map(r=>r.year))].sort((a,b)=>a-b);let rows=state.raceMode==='compare'?data.rows.race.filter(r=>[+state.raceFrom,+state.raceTo].includes(r.year)):data.rows.race.filter(r=>r.year===+state.raceYear);if(state.raceCategory&&state.raceCategory!=='Todas')rows=rows.filter(r=>r.category===state.raceCategory);censusHeader('race','Cor ou raça no Censo','Composição da população no Censo selecionado.');put('race',select('raceYear','Censo',available),censusBars(rows),state.raceMode==='compare'?'Comparação censitária municipal.':`Censo ${state.raceYear} · população municipal.`,rows,+state.raceYear<2010?data.notes.raceHistorical:data.notes.race,state.raceUnit||'Percentual');}

 function bars(rows,unit){const max=Math.max(1,...rows.map(r=>value(r,unit)||0))*1.08;return `<div class="demo-bars">${rows.map(r=>{const v=value(r,unit),digits=['Percentual','Taxa anual (%)','Moradores por domicílio'].includes(unit)?2:0,label=(unit==='Percentual'&&v>0&&v<0.005?'<0,01':fmt(v,digits))+(unit==='Percentual'||unit==='Taxa anual (%)'?'%':unit==='Moradores por domicílio'?' moradores':unit==='Pessoas'?' pessoas':unit==='Domicílios'?' domicílios':''),description=`${r.year} · ${r.category}: ${label}${unit==='Percentual'?' · '+fmt(r.value)+' pessoas':''}`;return `<div class="demo-bar-row${r.category==='Total'?' demo-reference':''}"><div class="demo-bar-heading"><span class="demo-category">${esc(r.category)}</span><strong>${esc(label)}${unit==='Percentual'?`<small>${fmt(r.value)} pessoas</small>`:''}</strong></div>${v==null?'<span>Não disponível</span>':`<div class="demo-bar-track" tabindex="0" role="img" aria-label="${esc(description)}" data-demo-tip="${esc(description)}"><i style="width:${v/max*100}%"></i></div>`}</div>`;}).join('')}</div>`;}
 function religion(){const panel=String(state.religionPanel),rows=panel==='2022'?data.rows.religion_2022:panel==='2000–2010'?data.rows.religion_history:data.rows.religion_history.filter(r=>r.year===+panel);censusHeader('religion','Religiões da população','Categorias disponíveis no Censo selecionado.');put('religion',select('religionPanel','Censo',[2000,2010,2022]),censusBars(rows),panel==='2022'?'Em 2022, os dados de religião referem-se à população de 10 anos ou mais.':`Censo ${panel} · população de todas as idades. Recorte validado de quatro grupos, não exaustivo.`,rows,data.notes.religion,state.religionUnit||'Percentual');}

 function homes(){
  const card=root.querySelector?.('[data-demo-chart=homes]')?.closest?.('article');
  if(card){
    const h4=card.querySelector('h4');
    if(h4)h4.textContent='Como vivem os moradores de São José?';
    const subtitle=card.querySelector('.demo-subtitle');
    if(subtitle)subtitle.textContent='Conheça os domicílios da cidade e suas transformações ao longo dos Censos.';
  }

  const mode=state.homesPanel;
  let rows,note=data.notes.homes,unit='Domicílios';
  const tot2022=data.rows.homes_2022.find(r=>r.category==='Total')?.value||282214;
  const permOcup2022=data.rows.homes_2022.find(r=>r.category==='Particular permanente ocupado')?.value||247894;

  const cats2022=[
    {key:'Particular permanente ocupado',label:'Particular permanente ocupado',color:'#0284c7'},
    {key:'Particular permanente não ocupado - vago',label:'Particular permanente vago',color:'#f59e0b'},
    {key:'Particular permanente não ocupado - uso ocasional',label:'Uso ocasional',color:'#64748b'},
    {key:'Coletivo',label:'Coletivo',color:'#8b5cf6'},
    {key:'Particular improvisado',label:'Particular improvisado',color:'#ec4899'}
  ];

  const rows2022=cats2022.map(c=>{
    const raw=data.rows.homes_2022.find(r=>r.category===c.key);
    const val=raw?raw.value:0;
    return {
      year:2022,
      category:c.label,
      official_category:c.key,
      value:val,
      denominator:tot2022,
      percentage:100*val/tot2022,
      color:c.color,
      source:raw?raw.source:19
    };
  });

  if(mode==='1991–2010'){
    rows=data.rows.homes_history.filter(r=>r.category==='Domicílios particulares ocupados').map(r=>({...r,category:String(r.year)+' · particulares ocupados'}));
  }else if(mode==='Moradores'){
    rows=data.rows.homes_history.filter(r=>r.category==='Média de moradores em domicílios particulares ocupados').map(r=>({...r,category:String(r.year)+' · média publicada'}));
    unit='Moradores por domicílio';
  }else if(mode==='2000'||mode==='2010'){
    rows=data.rows.homes_species.filter(r=>r.year==+mode);
  }else{
    rows=rows2022;
  }

  const stackedBarHtml=rows2022.map(r=>{
    const pct=100*r.value/tot2022;
    const minW=pct<0.5?'min-width:3px;':'';
    const tip=`${r.category}: ${fmt(r.value)} (${fmt(pct,2)}%)`;
    return `<div style="width:${pct.toFixed(2)}%;background:${r.color};${minW}" title="${esc(tip)}" data-demo-tip="${esc(tip)}" tabindex="0"></div>`;
  }).join('');

  const tableRowsHtml=rows2022.map(r=>{
    const pct=100*r.value/tot2022;
    const tip=`${r.category}: ${fmt(r.value)} domicílios (${fmt(pct,2)}% do total)`;
    return `<div class="demo-moradia-row" tabindex="0" data-demo-tip="${esc(tip)}" role="row"><span class="demo-mrow-dot" style="background:${r.color}" aria-hidden="true"></span><span class="demo-mrow-label" role="cell">${esc(r.category)}</span><span class="demo-mrow-val" role="cell">${fmt(r.value)}</span><span class="demo-mrow-pct" role="cell">${fmt(pct,2)}%</span></div>`;
  }).join('');

  const totalRowHtml=`<div class="demo-moradia-row demo-mrow-total" role="row"><span class="demo-mrow-dot demo-mrow-dot-total" aria-hidden="true"></span><span class="demo-mrow-label" role="cell">Total de domicílios recenseados</span><span class="demo-mrow-val" role="cell">${fmt(tot2022)}</span><span class="demo-mrow-pct" role="cell">100,00%</span></div>`;

  const histOcup=[
    {year:1991,val:107484,x:45,y:98,concept:'particulares ocupados'},
    {year:2000,val:145050,x:155,y:78,concept:'particulares ocupados'},
    {year:2010,val:189587,x:265,y:58,concept:'particulares ocupados'},
    {year:2022,val:247894,x:385,y:32,isTransition:true,concept:'particulares permanentes ocupados'}
  ];

  let histSvgBody='<path d="M40 108H395M40 68H395M40 28H395" stroke="#f1f5f9" stroke-width="1"/>';
  histSvgBody+=text(35,111,'100 mil','text-anchor="end" class="demo-svg-axis-label"')+text(35,71,'180 mil','text-anchor="end" class="demo-svg-axis-label"')+text(35,31,'250 mil','text-anchor="end" class="demo-svg-axis-label"');
  histSvgBody+=`<path d="M45 98 L155 78 L265 58" fill="none" stroke="${blue}" stroke-width="2.5" stroke-linecap="round"/>`;
  histSvgBody+=`<path d="M265 58 L385 32" fill="none" stroke="${blue}" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 3"/>`;

  histOcup.forEach((p,i)=>{
    const tipDesc=`Censo ${p.year}: ${fmt(p.val)} domicílios (${p.concept})`;
    const isLast=p.year===2022;
    const dot=isLast
      ?`<circle cx="${p.x}" cy="${p.y}" r="5" fill="#f0f9ff" stroke="${blue}" stroke-width="2.5"/>`
      :`<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${blue}" stroke="#fff" stroke-width="2"/>`;
    histSvgBody+=mark(dot,p,tipDesc);
    const anchor=i===0?'start':isLast?'end':'middle';
    histSvgBody+=text(p.x,p.y-9,fmt(p.val)+(isLast?'*':''),`text-anchor="${anchor}" class="demo-point-value"`);
    histSvgBody+=text(p.x,126,p.year+(isLast?'*':''),`text-anchor="${anchor}" class="demo-point-year"`);
  });

  const histSvg=`<svg class="demo-svg demo-moradia-svg" viewBox="0 0 420 135" role="group" aria-label="Evolução dos domicílios ocupados nos Censos (1991 a 2022)">${histSvgBody}</svg>`;

  const avgData=[
    {year:1991,avg:'4,1',tip:'Censo 1991: 4,1 moradores por domicílio particular ocupado (Tabela 156)'},
    {year:2000,avg:'3,7',tip:'Censo 2000: 3,7 moradores por domicílio particular ocupado (Tabela 156)'},
    {year:2010,avg:'3,3',tip:'Censo 2010: 3,3 moradores por domicílio particular ocupado (Tabela 156)'},
    {year:2022,avg:'2,8',isLatest:true,tip:'Censo 2022: 2,8 moradores por particular permanente ocupado (Tabela 4712)'}
  ];

  const avgStripHtml=avgData.map(a=>{
    const cls=a.isLatest?'demo-mavg-item demo-mavg-item-current':'demo-mavg-item';
    return `<div class="${cls}" tabindex="0" role="img" aria-label="${esc(a.tip)}" data-demo-tip="${esc(a.tip)}"><span class="demo-mavg-year">${a.year}</span><strong class="demo-mavg-val">${a.avg}</strong><span class="demo-mavg-unit">moradores/dom.${a.isLatest?'*':''}</span></div>`;
  }).join('');

  const chart=`<div class="demo-moradia-wrap">
    <div class="demo-moradia-block">
      <div class="demo-moradia-head">
        <span class="demo-moradia-kicker">Retrato de 2022</span>
        <h5 class="demo-moradia-heading">Distribuição dos domicílios recenseados</h5>
        <p class="demo-moradia-sub">Espécies oficiais de domicílios recenseados pelo IBGE (Tabela 4711 · universo municipal total)</p>
      </div>

      <div class="demo-moradia-kpis-compact" role="group" aria-label="Totais de domicílios em 2022">
        <div class="demo-mkpi-compact">
          <span class="demo-mkpi-label">Total recenseado</span>
          <strong class="demo-mkpi-val">${fmt(tot2022)}</strong>
          <span class="demo-mkpi-sub">100% dos domicílios</span>
        </div>
        <div class="demo-mkpi-compact demo-mkpi-compact-highlight">
          <span class="demo-mkpi-label">Particulares permanentes ocupados</span>
          <strong class="demo-mkpi-val">${fmt(permOcup2022)}</strong>
          <span class="demo-mkpi-sub">${fmt(100*permOcup2022/tot2022,2)}% do total</span>
        </div>
      </div>

      <div class="demo-moradia-stacked-bar" role="img" aria-label="Composição proporcional dos domicílios em 2022">
        ${stackedBarHtml}
      </div>

      <div class="demo-moradia-table" role="table" aria-label="Espécies de domicílios no Censo 2022">
        ${tableRowsHtml}
        ${totalRowHtml}
      </div>
    </div>

    <div class="demo-moradia-history-grid">
      <div class="demo-moradia-block">
        <div class="demo-moradia-head">
          <span class="demo-moradia-kicker">Evolução histórica</span>
          <h5 class="demo-moradia-heading">Domicílios ocupados nos Censos</h5>
          <p class="demo-moradia-sub">Série histórica dos Censos Demográficos (IBGE)</p>
        </div>

        <div class="demo-moradia-svg-wrap">
          ${histSvg}
        </div>

        <div class="demo-moradia-series-pills">
          <span class="demo-mpill">1991 a 2000: <strong>+35,0%</strong></span>
          <span class="demo-mpill">2000 a 2010: <strong>+30,7%</strong></span>
        </div>

        <p class="demo-moradia-footnote">* 1991 a 2010: particulares ocupados (Tabela 156). 2022: particulares permanentes ocupados (Tabela 4711; conceito estrito, não comparável diretamente para taxa contínua).</p>
      </div>

      <div class="demo-moradia-block">
        <div class="demo-moradia-head">
          <span class="demo-moradia-kicker">Densidade domiciliar</span>
          <h5 class="demo-moradia-heading">Média de moradores por domicílio</h5>
          <p class="demo-moradia-sub">Razão oficial de moradores por domicílio ocupado nos Censos</p>
        </div>

        <div class="demo-moradia-highlight-box">
          <span class="demo-mkpi-label">Dado mais recente · Censo 2022</span>
          <div class="demo-mhighlight-row">
            <strong class="demo-mhighlight-val">2,8</strong>
            <span class="demo-mhighlight-unit">moradores por domicílio</span>
          </div>
          <p class="demo-mhighlight-sub">Universo: domicílios particulares permanentes ocupados (Tabela 4712: 2,80).</p>
        </div>

        <div class="demo-moradia-avg-strip" role="group" aria-label="Histórico da média de moradores">
          ${avgStripHtml}
        </div>

        <p class="demo-moradia-footnote">* 1991 a 2010: Tabela 156 (particulares ocupados). 2022: Tabela 4712 (particulares permanentes ocupados). Razão de moradores por domicílio.</p>
      </div>
    </div>
  </div>`;

  const summary=`${fmt(tot2022)} domicílios recenseados no Censo 2022 · ${fmt(permOcup2022)} particulares permanentes ocupados (${fmt(100*permOcup2022/tot2022,2)}%).`;
  if(mode!=='2022'){
    put('homes','',bars(rows,unit),summary,rows,note,unit);
  }else{
    put('homes','',chart,summary,rows,note,unit);
  }
}
 function urban(){const title=root?.querySelector('[data-demo-chart=urban]')?.closest?.('article')?.querySelector?.('h4');if(title)title.textContent='Moradores por situação do domicílio · IBGE';const rows=state.urbanYear==2022?data.rows.urban_2022.filter(r=>r.category!=='total').map(r=>({...r,denominator:data.rows.urban_2022.find(x=>x.category==='total').value})):data.rows.urban_history.filter(r=>r.year==state.urbanYear);put('urban',select('urbanYear','Censo',[1970,1980,1991,2000,2010,2022]),compositionKpis(rows,'urban'),state.urbanYear==2022?'IBGE: moradores em domicílios classificados como urbanos (688.155) ou rurais (8.899). A população da região Rural na divisão da Prefeitura é 15.212; os recortes não são equivalentes.':'Situação do domicílio na classificação de cada edição do IBGE.',rows,'1970–2010: tabela 202. 2022: classificação censitária própria; não inferir transformação territorial nem comparar com divisão municipal.','Percentual');}
 function growth(){const c=data.rows.history.filter(r=>r.product==='Censo'),rows=c.slice(1).map((r,i)=>({...r,category:c[i].year+'–'+r.year,value:100*((r.value/c[i].value)**(1/(r.year-c[i].year))-1),formula:'100*((pop_final/pop_inicial)^(1/anos)-1)',start_value:c[i].value,end_value:r.value,interval_years:r.year-c[i].year}));visible.set('growth',decorate(rows,'Taxa anual (%)'));const host=root.querySelector('[data-demo-chart=growth]');if(!host)return;put('growth','',bars(rows,'Taxa anual (%)'),'Taxa geométrica média anual por intervalo censitário.',rows,'Calculado sobre os totais municipais publicados; diferenças territoriais das edições devem ser consideradas.','Taxa anual (%)');host.querySelectorAll('summary').forEach((el,i)=>el.textContent=i===0?'Metodologia':'Tabela · 5 intervalos');}
 function draw(key){if(!data)return;try{({history,pyramid,sex,race,religion,homes,urban,growth}[key])?.();}catch(e){visible.delete(key);const el=root.querySelector(`[data-demo-chart="${key}"]`);if(el)el.innerHTML='<p role="status">Visualização indisponível; os demais cartões continuam disponíveis.</p>';root.dataset.demoErrors=(root.dataset.demoErrors||'')+key+';';console.error('Demografia R2 '+key+':',e.message);}}
 function exportData(key,format){const rows=visible.get(key)||[];const payload={territory:'3549904',projection_sha256:HASH,presentation_version:VERSION,filters:{...state},rows};if(format==='json')return JSON.stringify(payload,null,2);const fields=['year','category','sex','product','value','denominator','percentage','display_value','display_unit','universe','source_url','source_sha256','formula'];return '\uFEFF'+fields.join(';')+'\r\n'+rows.map(r=>fields.map(k=>'"'+String(r[k]??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');}
 function setFilter(key,v){const raceYears=[...new Set(data?.rows.race.map(r=>r.year)||[])];const allowed={raceMode:['year','compare'],raceYear:raceYears,racePeriod:data?.rows.race.some(r=>r.year===1991)?['1991–2000','2010–2022']:['2010–2022'],historyProduct:['Censo','Estimativa'],pyramidYear:[2000,2010,2022],pyramidUnit:['Pessoas','Percentual'],sexYear:[1970,1980,1991,2000,2010,2022],raceCategory:['Todas',...new Set(data?.rows.race.map(r=>r.category)||[])],raceUnit:['Pessoas','Percentual'],religionPanel:['2000','2010','2022','2000–2010'],religionUnit:['Pessoas','Percentual'],homesPanel:['2022','1991–2010','Moradores','2000','2010'],urbanYear:[1970,1980,1991,2000,2010,2022]};if(key==='historyFrom'||key==='historyTo')allowed[key]=data.rows.history.filter(r=>r.product===state.historyProduct).map(r=>r.year);if(!allowed[key]?.some(x=>String(x)===String(v)))throw Error('Filtro inelegível');state[key]=v;if(key==='raceYear')state.raceMode='year';if(key==='racePeriod'){[state.raceFrom,state.raceTo]=v==='1991–2000'?[1991,2000]:[2010,2022];state.raceMode='compare';}draw(key.startsWith('history')?'history':key.startsWith('pyramid')?'pyramid':key.startsWith('sex')?'sex':key.startsWith('race')?'race':key.startsWith('religion')?'religion':key.startsWith('homes')?'homes':'urban');}
  function renderTerritory(){
    if(!root)return;
    if(global.RadarDemografiaIBGE)return global.RadarDemografiaIBGE.mount(root);
    const host=root.querySelector('#hubMapDemografiaCalor');
    if(!host)return;
    loadTerritory();
    loadMunicipalityBoundary();
    loadLegalReference();
    if(!global.L)return;
    if(!map){
      map=L.map(host,{preferCanvas:true,scrollWheelZoom:false}).setView([-23.2,-45.9],11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18}).addTo(map);
    }
    const geo=global.SJC_SETORES_GEOJSON||null;
    if(!geo)return;
    if(layer){map.removeLayer(layer);layer=null;}
    const rawFeatures=geo.features||[];
    const sanitized=rawFeatures.map(f=>({
      type:'Feature',
      geometry:f.geometry,
      properties:{
        codigo_setor:String(f.properties.codigo_setor||''),
        nome:String(f.properties.nome||''),
        regiao:String(f.properties.regiao||'')
      }
    }));
    const filtered=region==='todas'?sanitized:sanitized.filter(f=>f.properties.regiao.toLowerCase()===region||(region==='são francisco xavier'&&f.properties.regiao.toLowerCase().includes('francisco')));
    layer=L.geoJSON({type:'FeatureCollection',features:filtered},{
      style:f=>getFeatureStyle(f,selected===f.properties.nome),
      onEachFeature(f,l){
        l.on('click',()=>focus(f.properties.nome));
      }
    }).addTo(map);
    updateTerritoryList(filtered);
    updateSelectionCard(selected);
    territoryContext();
    renderLegalReference(false);
  }
  function focus(name){
   if(!name){region='todas';selected=null;renderTerritory();return;}
   const reg=findRegion(name),sec=findSector(null,name);
   if(reg&&territoryMode==='regioes'){
    region=reg.nome.toLocaleLowerCase('pt-BR').includes('francisco')?'são francisco xavier':reg.nome.toLocaleLowerCase('pt-BR');selected=reg.nome;renderTerritory();
    if(layer)layer.eachLayer(l=>l.setStyle(getFeatureStyle(l.feature,true)));
    selectionCoverage(reg.nome,true);return;
   }
   // Resolve a sector by its territorial code, not by a neighbouring name.
   let resolvedPolygon=null;
   if(sec&&layer)layer.eachLayer(l=>{if(l.feature.properties.codigo_setor===sec.codigo)resolvedPolygon=l;});
   selected=sec?sec.nome:name;
   if(layer)layer.eachLayer(l=>l.setStyle(getFeatureStyle(l.feature,l===resolvedPolygon)));
   if(resolvedPolygon){map.fitBounds(resolvedPolygon.getBounds(),{maxZoom:14});resolvedPolygon.openPopup();}
   else if(boundaryLayer&&map)map.fitBounds(boundaryLayer.getBounds(),{padding:[15,15]});
   updateSelectionCard(selected);selectionCoverage(selected,false);
   root?.querySelectorAll('[data-demo-sector]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demoSector===selected)));
  }
  function selectionCoverage(name,isRegion){
   const box=root?.querySelector('#demo-territory-selection');if(!box)return;
   const matching=layer?.getLayers?.()||[];
   const note=document.createElement('p');note.className='demo-thero-hint';
   note.textContent=isRegion?(matching.length?'Destaque dos setores disponíveis desta região; não representa seu limite regional completo.':'Limite espacial desta região indisponível na camada atual. O contorno tracejado representa somente o município.'):(matching.some(l=>l.feature.properties.nome===name)?'Polígono da divisão intramunicipal · edição IBGE 2022.':'População disponível na tabela municipal; limite espacial desta unidade indisponível na camada atual.');
   box.appendChild(note);
  }
  function filterRegion(r){
   if(r==='sfx')r='são francisco xavier';r=r.toLocaleLowerCase('pt-BR');
   const reg=findRegion(r);if(r!=='todas'&&territoryData&&!reg)return;
   region=r;selected=territoryMode==='regioes'&&reg?reg.nome:null;renderTerritory();
   if(selected){if(layer)layer.eachLayer(l=>l.setStyle(getFeatureStyle(l.feature,true)));selectionCoverage(selected,true);}
  }
  function setTerritoryMode(mode){if(mode!=='regioes'&&mode!=='setores')return;territoryMode=mode;selected=null;if(root){root.querySelectorAll('[data-demo-tmode]').forEach(b=>{const isCurrent=b.dataset.demoTmode===mode;b.setAttribute('aria-pressed',String(isCurrent));if(isCurrent)b.classList.add('active');else b.classList.remove('active');});}renderTerritory();}
  async function mount(container,snapshot){if(snapshot?.dataset_version!==VERSION){container.querySelectorAll('[data-demo-chart]').forEach(e=>e.textContent='Versão da apresentação incompatível. Nenhum valor publicado.');return;}root=container;if(!root.dataset.demoBound){root.dataset.demoBound='true';const aux=root.querySelector('#demo-aux-year'),metrics=root.querySelector('.demo-metrics');if(aux?.parentElement&&metrics&&document.createElement){const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Indicadores etários complementares';details.appendChild(summary);aux.parentElement.appendChild(details);details.appendChild(aux);details.appendChild(metrics);}const grid=root.querySelector('.demo-grid'),urbanCard=root.querySelector('[data-demo-chart=urban]')?.closest?.('article'),raceCard=root.querySelector('[data-demo-chart=race]')?.closest?.('article');if(urbanCard&&raceCard)grid?.insertBefore?.(urbanCard,raceCard);if(global.ResizeObserver)new ResizeObserver(()=>{if(!data||!root.clientWidth||root.clientWidth===lastWidth)return;lastWidth=root.clientWidth;['history','pyramid','sex','race','religion','homes','urban','growth'].forEach(draw);}).observe(root);root.addEventListener('change',e=>{if(e.target.matches('[data-demo-legal-reference]')){showLegalReference=e.target.checked;renderLegalReference(true);}if(e.target.dataset.demoFilter){const key=e.target.dataset.demoFilter;setFilter(key,e.target.value);if(key.startsWith('race')||key.startsWith('religion')||key.startsWith('sex')||key.startsWith('urban'))root.querySelector(`[data-demo-filter="${key}"]`)?.focus?.({preventScroll:true});}if(e.target.id==='demo-region')filterRegion(e.target.value);});root.addEventListener('input',e=>{if(e.target.id==='demo-sector-search'){searchTerm=e.target.value.trim();updateTerritoryList(layer?.toGeoJSON?.().features||[]);}});root.addEventListener('click',e=>{const mode=e.target.closest('[data-demo-mode]');if(mode){setFilter(mode.dataset.demoMode,mode.dataset.value);root.querySelector(`[data-demo-mode="${mode.dataset.demoMode}"][data-value="${mode.dataset.value}"]`)?.focus?.({preventScroll:true});}const tmode=e.target.closest('[data-demo-tmode]');if(tmode)setTerritoryMode(tmode.dataset.demoTmode);const sector=e.target.closest('[data-demo-sector]');if(sector)focus(sector.dataset.demoSector);const regSelect=e.target.closest('[data-demo-region-select]');if(regSelect)focus(regSelect.dataset.demoRegionSelect);if(e.target.closest('[data-demo-clear-selection]'))focus(null);if(e.target.closest('[data-demo-retry]'))mount(root,snapshot);});const tip=e=>{const target=e.target.closest('[data-demo-tip]');if(target){const el=target.closest('[data-demo-chart]')?.querySelector('.demo-tip');if(el){el.textContent=target.dataset.demoTip;el.hidden=false;}}};root.addEventListener('pointerover',tip);root.addEventListener('focusin',tip);root.addEventListener('pointerdown',tip);}try{await renderTerritory();}catch(e){root.querySelector('#hubMapDemografiaCalor').textContent='Mapa indisponível; os gráficos continuam disponíveis.';console.warn('Demografia: mapa indisponível',e.message);}try{await load();await loadRaceHistory();const renderStart=performance.now();['history','pyramid','sex','race','religion','homes','urban','growth'].forEach(draw);data.kpis.forEach(k=>root.querySelectorAll(`[data-radar-indicator="${k.indicator_id}"]`).forEach(el=>el.textContent=fmt(k.value,k.indicator_id==='demo_densidade_demografica'?2:0)));root.dataset.demoRenderMs=(performance.now()-renderStart).toFixed(2);if(performance.memory)root.dataset.demoHeapBytes=String(performance.memory.usedJSHeapSize);root.dataset.demoReady='true';}catch(e){root.querySelectorAll('[data-demo-chart]').forEach(el=>el.innerHTML='<p role="status">Projeção verificada indisponível. Ausência não representa zero.</p><button class="demo-action" data-demo-retry>Tentar novamente</button>');console.error('Demografia R2:',e.message);}}
  global.RadarDemografiaR2={mount,render:draw,setFilter,exportData,getProjection:key=>visible.get(key),filterRegion,focus,renderTerritory,setTerritoryMode,switchMetric:m=>{if(m==='populacao'){territoryMetric='populacao';renderTerritory();return true;}return false;},verify};
})(window);

