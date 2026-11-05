/* Territorial presentation: IBGE definitive 2022 mesh with PMSJC Human Neighborhoods & Macro-Regions. */
(function(global){
 'use strict';
 const URL='data/radar_hub/projections/demografia-ibge-territorio.json';
 const HASH='4000dac85f6467f43e9d2e209a6f7e04a15904d11ab237b02b16b68c2dd714b7';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=(x,d=0)=>x==null?'Não divulgado':Number(x).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});
 const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

 const SECTOR_NAMES = {
  '01': { name: 'Alto da Ponte', regiao: 'Norte', aliases: ['Alto da Ponte', 'Vila Dirce', 'Jardim Guimarães', 'Vila Zizinha'] },
  '01A': { name: 'Banhado - Jaguari', regiao: 'Norte', aliases: ['Jaguari', 'Banhado Jaguari'] },
  '02': { name: 'Santana', regiao: 'Norte', aliases: ['Santana', 'Vila Cristina', 'Jardim Telespark', 'Vila Sinhá', 'Vila Paiva', 'Mirante do Buquirinha'] },
  '02A': { name: 'Banhado - Santana', regiao: 'Norte', aliases: ['Banhado Santana'] },
  '03': { name: 'Centro', regiao: 'Centro', aliases: ['Centro', 'Centro Histórico', 'Vila Nova São José', 'Mercado Municipal'] },
  '03A': { name: 'Banhado - Centro', regiao: 'Centro', aliases: ['Banhado Centro', 'Nova Esperança', 'Comunidade do Banhado'] },
  '04': { name: 'Jardim Paulista', regiao: 'Centro', aliases: ['Jardim Paulista', 'Monte Castelo', 'Vila Tesouro', 'Vila Nair'] },
  '05': { name: 'Vila Industrial', regiao: 'Leste', aliases: ['Vila Industrial', 'Tatetuba', 'Jardim Ismênia', 'Vila Rossi', 'Jardim Jussara'] },
  '05A': { name: 'Banhado - Martins Guimarães', regiao: 'Leste', aliases: ['Martins Guimarães', 'Banhado Martins Guimarães'] },
  '06': { name: 'Eugênio de Melo', regiao: 'Leste', aliases: ['Eugênio de Melo', 'Eugenio de Melo', 'Galo Branco', 'Jardim Itapuã', 'Jardim das Flores'] },
  '06A': { name: 'Banhado - Eugênio de Melo', regiao: 'Leste', aliases: ['Banhado Eugênio de Melo'] },
  '07': { name: 'Campos de São José', regiao: 'Leste', aliases: ['Campos de São José', 'Mariana', 'Jardim Mariana', 'Residencial União'] },
  '08': { name: 'Vista Verde', regiao: 'Leste', aliases: ['Vista Verde', 'Cidade Vista Verde', 'Jardim Americano'] },
  '09': { name: 'Jardim da Granja', regiao: 'Sudeste', aliases: ['Jardim da Granja', 'Granja', 'Parque Martim Cererê', 'Jardim Colorado', 'Parque Santa Rita', 'Jardim São Vicente', 'São Vicente'] },
  '10': { name: 'DCTA', regiao: 'Sudeste', aliases: ['DCTA', 'CTA', 'Aeroporto', 'Embraer', 'Vila Aeronáutica', 'INPE'] },
  '11': { name: 'Interlagos', regiao: 'Sul', aliases: ['Interlagos', 'Jardim Interlagos', 'Jardim Torrão de Ouro', 'Torrão de Ouro', 'Rio Comprido'] },
  '12': { name: 'Campo dos Alemães', regiao: 'Sul', aliases: ['Campo dos Alemães', 'Colonial', 'Jardim Colonial', 'Dom Pedro', 'Jardim Dom Pedro', 'Jardim República'] },
  '13': { name: 'Bosque dos Eucaliptos', regiao: 'Sul', aliases: ['Bosque dos Eucaliptos', 'Bosque', 'Quinta das Flores', 'Jardim Portugal', 'Jardim Estoril'] },
  '14': { name: 'Jardim Satélite', regiao: 'Sul', aliases: ['Jardim Satélite', 'Satélite', 'Floradas de São José', 'Floradas', 'Cidade Jardim'] },
  '15': { name: 'Morumbi', regiao: 'Sul', aliases: ['Morumbi', 'Jardim Morumbi', 'Jardim Oriente', 'Renascer', 'Jardim União'] },
  '16': { name: 'Parque Industrial', regiao: 'Sul', aliases: ['Parque Industrial', 'Palmeiras de São José', 'Vila Sanches', 'Jardim América'] },
  '17': { name: 'Jardim das Indústrias', regiao: 'Oeste', aliases: ['Jardim das Indústrias', 'Indústrias', 'Alvorada', 'Jardim Alvorada'] },
  '17A': { name: 'Banhado - Limoeiro', regiao: 'Oeste', aliases: ['Limoeiro', 'Banhado Limoeiro'] },
  '18': { name: 'Urbanova', regiao: 'Oeste', aliases: ['Urbanova', 'Alphaville', 'Residencial Jaguary', 'Mont Serrat', 'Altos da Serra'] },
  '19': { name: 'Aquarius', regiao: 'Oeste', aliases: ['Aquarius', 'Jardim Aquarius', 'Parque Residencial Aquarius'] },
  '20': { name: 'Vila Adyanna / Vila Ema', regiao: 'Centro', aliases: ['Vila Adyanna', 'Vila Adyana', 'Vila Ema', 'Jardim São Dimas', 'São Dimas', 'Vila Betânia', 'Betânia', 'Jardim Apolo', 'Apolo'] },
  '21': { name: 'São Francisco Xavier', regiao: 'São Francisco Xavier', aliases: ['São Francisco Xavier', 'SFX', 'Distrito de SFX', 'Serra da Mantiqueira'] },
  '25': { name: 'Vargem Grande / Luso Brasileiro', regiao: 'Norte', aliases: ['Vargem Grande', 'Luso Brasileiro', 'Jardim Guimarães', 'Vila Cândida'] },
  '25A': { name: 'Banhado - Vargem Grande', regiao: 'Norte', aliases: ['Banhado Vargem Grande'] },
  '26': { name: 'Esplanada', regiao: 'Centro', aliases: ['Esplanada', 'Jardim Esplanada', 'Jardim Nova América', 'Residencial Esplanada'] },
  '27': { name: 'Novo Horizonte', regiao: 'Leste', aliases: ['Novo Horizonte', 'Parque Novo Horizonte', 'Cerejeiras', 'Santa Inês', 'Jardim Cerejeiras'] },
  '28': { name: 'São Bento', regiao: 'Sul', aliases: ['São Bento', 'Jardim São Bento', 'Pousada do Vale'] },
  '29': { name: 'Putim / Setville', regiao: 'Sudeste', aliases: ['Putim', 'Setville', 'Residencial Minas Gerais', 'Jardim Santa Luzia', 'Jardim Santo Onofre', 'São Judas Tadeu'] },
  '30': { name: 'Bom Retiro', regiao: 'Leste', aliases: ['Bom Retiro', 'Jardim Copacabana', 'Parque Nova Esperança'] },
  '31': { name: 'Cajuru', regiao: 'Leste', aliases: ['Cajuru', 'Chácaras Reunidas', 'Jardim Helena', 'Pinheirinho'] }
 };

 const REGIONS_DATA = {
  'Sul': { nome: 'Sul', populacao: 237572, domicilios: 94218, ranking: 1, pct: 34.08 },
  'Leste': { nome: 'Leste', populacao: 181463, domicilios: 71890, ranking: 2, pct: 26.03 },
  'Centro': { nome: 'Centro', populacao: 72401, domicilios: 34502, ranking: 3, pct: 10.39 },
  'Oeste': { nome: 'Oeste', populacao: 64482, domicilios: 27110, ranking: 4, pct: 9.25 },
  'Sudeste': { nome: 'Sudeste', populacao: 62541, domicilios: 23640, ranking: 5, pct: 8.97 },
  'Norte': { nome: 'Norte', populacao: 61940, domicilios: 20512, ranking: 6, pct: 8.89 },
  'Rural': { nome: 'Rural', populacao: 15212, domicilios: 9808, ranking: 7, pct: 2.18 },
  'São Francisco Xavier': { nome: 'São Francisco Xavier', populacao: 1443, domicilios: 534, ranking: 8, pct: 0.21 }
 };

 function getFriendlyInfo(rawName){
  if(!rawName)return null;
  const match=String(rawName).match(/Setor Socioecon[ôo]mico\s*(\d+[A-Z]?)/i);
  if(!match)return null;
  const code=match[1].toUpperCase().padStart(2,'0'),codeRaw=match[1].toUpperCase();
  const info=SECTOR_NAMES[code]||SECTOR_NAMES[codeRaw];
  if(info)return {...info,code:match[1]};
  return null;
 }

 let root,card,data,pending,map,boundary,layer,selected=null,mode='bairros',region='todas',situation='todas',metric='population',search='',limit=60;
 let onlineSearchAt=0,onlineBusy=false;
 let cached=false,placesData,placesPending,place=null,placeLayer=null,related=new Set();

 async function verify(raw){
  const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));
  if(Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,'0')).join('')!==HASH)throw Error('Integridade territorial IBGE inválida');
  const p=JSON.parse(raw);
  if(p.territory!=='3549904'||p.census_year!==2022||p.setores.features.length!==1554||p.bairros.features.length!==35||p.totals.population!==697054)throw Error('Recorte territorial incompatível');
  for(const kind of ['setores','bairros']){const ids=p[kind].features.map(f=>f.properties.id);if(new Set(ids).size!==ids.length||ids.some(id=>!id.startsWith('3549904')))throw Error('Geocódigos inválidos');}
  return p;
 }

 async function load(){
  if(data)return data;if(pending)return pending;
  pending=(async()=>{const key='radar:demografia:ibge:'+HASH;const started=performance.now();
   try{const r=await fetch(URL,{cache:'no-cache'});if(!r.ok)throw Error('HTTP '+r.status);const raw=await r.text();data=await verify(raw);card.dataset.ibgeBytes=String(new TextEncoder().encode(raw).length);card.dataset.ibgeLoadMs=(performance.now()-started).toFixed(1);try{localStorage.setItem(key,raw);cached=true;}catch(_){cached=false;}}
   catch(e){const raw=localStorage.getItem(key);if(!raw)throw e;data=await verify(raw);cached=true;card.dataset.ibgeFallback='verified-offline';}
   card.dataset.ibgeCache=cached?'verified':'storage-unavailable';

   // Enrich bairros with human-friendly names, ranking and macro-region
   if(data?.bairros?.features){
    const sorted=data.bairros.features.slice().sort((a,b)=>(b.properties.population||0)-(a.properties.population||0));
    sorted.forEach((f,idx)=>{
     const p=f.properties,info=getFriendlyInfo(p.name);
     p.ranking=idx+1;
     p.friendly_name=info?info.name:p.name;
     p.friendly_bairro=p.friendly_name;
     p.regiao=info?info.regiao:'Municipal';
     p.sector_code=info?info.code:'';
     p.aliases=info?.aliases||[];
    });
   }

   // Enrich microsectors with friendly neighborhood and region
   if(data?.setores?.features){
    data.setores.features.forEach(f=>{
     const p=f.properties,info=getFriendlyInfo(p.bairro_name||p.name);
     if(info){
      p.friendly_bairro=info.name;
      p.regiao=info.regiao;
      p.sector_code=info.code;
      p.aliases=info.aliases||[];
     }else{
      p.friendly_bairro=p.bairro_name||p.locality||p.district_name||'São José dos Campos';
      p.regiao='Municipal';
      p.aliases=[];
     }
    });
   }

   return data;
  })();try{return await pending;}finally{pending=null;}
 }

 async function loadPlaces(){if(placesData)return placesData;if(placesPending)return placesPending;placesPending=(async()=>{const r=await fetch('data/radar_hub/projections/demografia-lugares-osm.json');if(!r.ok)throw Error('Índice local indisponível');const raw=await r.text(),digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));if(Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('')!=='3edd1a18830d6f967a6206e3a3ab3f740fe4438fbabeba5c8db5c21dbc836c00')throw Error('Integridade dos lugares inválida');const d=JSON.parse(raw);if(d.municipality!=='3549904'||d.sector_contract_sha256!==HASH)throw Error('Recorte incompatível');placesData=d;return d;})();try{return await placesPending;}finally{placesPending=null;}}

 function suggest(){
  const input=root.querySelector('#demo-place-search'),box=root.querySelector('#demo-place-suggestions');
  if(!input||!box)return;
  const term=norm(input.value.trim());
  if(term.length<2){box.innerHTML='';return;}
  if(!data?.bairros?.features){box.innerHTML='';return;}

  const matches=data.bairros.features.filter(f=>{
   const p=f.properties;
   if(norm(p.friendly_name).includes(term))return true;
   if(norm(p.name).includes(term))return true;
   if(norm(p.regiao).includes(term))return true;
   if(p.aliases&&p.aliases.some(a=>norm(a).includes(term)))return true;
   return false;
  }).sort((a,b)=>{
   const aExact=norm(a.properties.friendly_name)===term||(a.properties.aliases||[]).some(x=>norm(x)===term);
   const bExact=norm(b.properties.friendly_name)===term||(b.properties.aliases||[]).some(x=>norm(x)===term);
   if(aExact&&!bExact)return -1;
   if(!aExact&&bExact)return 1;
   return (b.properties.population||0)-(a.properties.population||0);
  });

  if(matches.length>0){
   box.innerHTML=matches.slice(0,10).map(f=>{
    const p=f.properties;
    const matchedAlias=(p.aliases||[]).find(a=>norm(a).includes(term)&&norm(a)!==norm(p.friendly_name));
    return '<button type="button" class="demo-action demo-place-option" data-sector-focus="'+esc(p.id)+'">'+
     '<div style="display:flex;justify-content:space-between;width:100%;align-items:center;"><strong>'+esc(p.friendly_name)+'</strong><span class="demo-titem-rank">#'+p.ranking+'</span></div>'+
     '<span>Região '+esc(p.regiao)+' · Setor Socioeconômico '+esc(p.sector_code)+' · '+fmt(p.population)+' hab'+(matchedAlias?' <em style="color:#0284c7">(inclui '+esc(matchedAlias)+')</em>':'')+'</span>'+
     '</button>';
   }).join('');
  }else{
   box.innerHTML='<p role="status" style="font-size:11.5px;color:#64748b;padding:6px 2px;margin:0">Nenhum bairro encontrado para "<strong>'+esc(input.value)+'</strong>". Experimente: Santana, Granja, Satélite, Aquarius, Vila Ema ou Centro.</p>';
  }
 }

 async function onlineSearch(){const box=root.querySelector('#demo-place-suggestions'),q=root.querySelector('#demo-place-search').value.trim();if(q.length<3){box.textContent='Digite pelo menos três letras.';return;}if(onlineBusy||Date.now()-onlineSearchAt<1100)return;onlineBusy=true;onlineSearchAt=Date.now();box.textContent='Consultando OpenStreetMap…';try{await loadPlaces();const bounds=global.RadarPlaceSpatial.bbox(data.boundary.geometry);const params=new URLSearchParams({q:q+', São José dos Campos, São Paulo, Brasil',format:'jsonv2',polygon_geojson:'1',addressdetails:'1',limit:'10',countrycodes:'br',bounded:'1',viewbox:bounds.join(',')});const r=await fetch('https://nominatim.openstreetmap.org/search?'+params);if(!r.ok)throw Error('Serviço temporariamente indisponível');const rows=await r.json();const accepted=[];for(const e of rows){if(!e.geojson)continue;const point=[Number(e.lon),Number(e.lat)];if(!global.RadarPlaceSpatial.inPoly(point,data.boundary.geometry))continue;if(!['place','highway','boundary'].includes(e.category||e.class))continue;const name=e.name||e.display_name.split(',')[0],kind=e.category==='highway'||e.class==='highway'?(name.toLowerCase().startsWith('avenida')?'Avenida':'Via'):['hamlet','village'].includes(e.type)?'Localidade':(e.category||e.class)==='boundary'?'Área de referência':'Bairro';const id='online-'+e.osm_type+'-'+e.osm_id;let p=placesData.places.find(p=>p.id===id);if(!p){p={id,name,kind,geometry:e.geojson,osm_ids:[e.osm_type+'/'+e.osm_id],center:[Number(e.lat),Number(e.lon)],approximate:e.geojson.type==='Point',sectors:global.RadarPlaceSpatial.links(e.geojson,data.setores.features)};placesData.places.push(p);}accepted.push(p);}box.innerHTML=accepted.length?accepted.map(p=>'<button type="button" class="demo-action demo-place-option" data-place-id="'+p.id+'"><strong>'+esc(p.name)+'</strong><span>'+esc(p.kind)+' · '+p.center.map(x=>fmt(x,4)).join(', ')+' · '+(p.approximate?'Localização aproximada':p.sectors.length+' setores relacionados')+'</span></button>').join(''):'<p role="status">Nenhum resultado geográfico dentro do município nesta consulta.</p>';}catch(e){box.textContent='A consulta externa não está disponível agora. As sugestões locais continuam funcionando.';}finally{onlineBusy=false;}}

 function placePanel(){const el=root.querySelector('#demo-place-result');if(!place){el.innerHTML='';return;}const contained=place.sectors.filter(s=>s.relation==='contido').length,partial=place.sectors.filter(s=>s.relation==='parcial').length;el.innerHTML='<strong>'+esc(place.name)+'</strong><p>'+esc(place.kind)+' · OpenStreetMap</p><p>'+(place.approximate?'Localização aproximada; limite de bairro não disponível. Não foram associados setores por proximidade.':place.kind==='Bairro'?contained+' setores contidos e '+partial+' parcialmente intersectados pelo limite mapeado no OSM. Não é uma delimitação municipal homologada.':place.sectors.length+' setores atravessados pelo trecho mapeado. Um resultado pode representar apenas parte da via.')+'</p><p>Os indicadores se referem ao setor censitário selecionado, que pode abranger outras ruas ou partes de bairros.</p><a href="https://www.openstreetmap.org/'+esc(place.osm_ids[0])+'" target="_blank" rel="noopener">Ver origem no OpenStreetMap</a>';}

 function choosePlace(id){place=placesData?.places.find(p=>p.id===id);if(!place)return;related=new Set(place.sectors.map(s=>s.id));selected=null;search='';situation='todas';limit=60;root.querySelector('#demo-ibge-search').value='';root.querySelector('#demo-place-search').value=place.name;root.querySelector('#demo-place-suggestions').innerHTML='';if(placeLayer)map.removeLayer(placeLayer);render();placeLayer=L.geoJSON({type:'Feature',geometry:place.geometry,properties:{}},{style:{color:'#e87918',weight:4,fillOpacity:.06},pointToLayer:(f,ll)=>L.circleMarker(ll,{radius:9,color:'#e87918',fillOpacity:.7})}).addTo(map);map.fitBounds(placeLayer.getBounds(),{padding:[30,30],maxZoom:15});placePanel();card.dataset.placeSelected=id;}

 function clearPlace(){place=null;related.clear();if(placeLayer){map.removeLayer(placeLayer);placeLayer=null;}root.querySelector('#demo-place-search').value='';root.querySelector('#demo-place-suggestions').innerHTML='';placePanel();}

 function sourceLink(fragment,label){const s=data.sources.find(s=>s.url.includes(fragment));return s?'<a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(label)+'</a>':'';}
 function sources(){return sourceLink(mode==='setores'?'SP_setores_CD2022.zip':'SP_bairros_CD2022.zip','IBGE · malha definitiva 2022')+' · '+sourceLink(mode==='setores'?'Agregados_por_setores_basico':'Agregados_por_bairros_basico','Agregados básicos · edição 20/05/2026')+' · '+sourceLink(mode==='setores'?'Agregados_por_setores_demografia':'Populacao_residente_por_bairros_sexo_idade','Sexo e idade · Censo 2022')+' · '+sourceLink(mode==='setores'?'Agregados_por_setores_renda_responsavel':'Agregados_por_bairros_renda_responsavel','Rendimento do responsável · edição 08/05/2026');}

 function eligibleFeatures(){
  const list=data[mode].features;
  const targetReg=norm(region);
  return list.filter(f=>{
   const p=f.properties;
   if(targetReg!=='todas'&&norm(p.regiao)!==targetReg)return false;
   return true;
  });
 }

 function listed(){
  const term=norm(search);
  return eligibleFeatures().filter(f=>{
   const p=f.properties;
   if(place&&!place.approximate&&!related.has(p.id))return false;
   if(!term)return true;
   const aliasStr=(p.aliases||[]).join(' ');
   if(mode==='bairros'){
    return norm([p.id,p.name,p.friendly_name,p.friendly_bairro,p.regiao,p.sector_code,aliasStr].join(' ')).includes(term);
   }
   return norm([p.id,p.name,p.friendly_bairro,p.bairro_name,p.locality,p.regiao,aliasStr].join(' ')).includes(term);
  });
 }

 function color(p){
  const n=p[metric];
  if(n==null)return '#cbd5e1';
  if(n===0)return '#e2e8f0';
  let cuts;
  if(mode==='bairros'){
   cuts=metric==='density'?[1000,4000,7000]:metric==='income_mean'?[2500,4500,9000]:[10000,25000,40000];
  }else{
   cuts=metric==='density'?[100,1000,5000]:metric==='income_mean'?[2000,4000,8000]:[250,500,1000];
  }
  return n>=cuts[2]?'#0369a1':n>=cuts[1]?'#0284c7':n>=cuts[0]?'#38bdf8':'#bae6fd';
 }

 function style(f){
  const p=f.properties;
  const isSel=p.id===selected;
  return {
   color:isSel?'#0f172a':related.has(p.id)?'#e87918':p.situation==='Rural'?'#0b556d':'#0284c7',
   weight:isSel?3.5:related.has(p.id)?2.5:1,
   dashArray:related.has(p.id)?'4 2':null,
   fillColor:color(p),
   fillOpacity:isSel?.85:.60
  };
 }

 function stat(label,value,unit=''){return '<div class="demo-tstat-item"><span>'+esc(label)+'</span><strong>'+esc(value)+(unit?' '+esc(unit):'')+'</strong></div>';}

 function selection(){
  const box=root.querySelector('#demo-territory-selection');box.className='demo-territory-hero';
  const f=selected?data[mode].features.find(f=>f.properties.id===selected):null;
  if(!f){
   if(region==='todas'){
    const t=data.totals;
    box.innerHTML='<div class="demo-thero-head"><span class="demo-thero-badge"><i class="fa-solid fa-city" aria-hidden="true"></i> São José dos Campos · IBGE</span><span class="demo-thero-year">Censo 2022</span></div>'+
     '<div class="demo-thero-main"><strong class="demo-thero-pop">'+fmt(t.population)+'</strong><span class="demo-thero-label">habitantes no município</span></div>'+
     '<div class="demo-thero-stats">'+stat('Domicílios recenseados',fmt(t.homes_total))+stat('Densidade municipal',fmt(t.density,2),'hab/km²')+stat('Situação urbana (IBGE)',fmt(t.urban_population),'pessoas')+stat('Situação rural (IBGE)',fmt(t.rural_population),'pessoas')+'</div>'+
     '<p class="demo-thero-hint">Explore os 35 bairros e setores oficiais ou filtre por macro-região para consultar população, densidade e renda apuradas.</p>';
    return;
   }
   const regInfo=REGIONS_DATA[region]||Object.values(REGIONS_DATA).find(r=>norm(r.nome)===norm(region));
   if(regInfo){
    box.className='demo-territory-hero demo-thero-region';
    box.innerHTML='<div class="demo-thero-head"><span class="demo-thero-badge"><i class="fa-solid fa-map" aria-hidden="true"></i> Macro-Região</span><span class="demo-thero-rank">#'+regInfo.ranking+' de 8 regiões</span></div>'+
     '<h5 class="demo-thero-title">'+(regInfo.nome==='Rural'?'Região Rural · divisão municipal':'Região '+esc(regInfo.nome))+'</h5>'+
     '<div class="demo-thero-main"><strong class="demo-thero-pop">'+fmt(regInfo.populacao)+'</strong><span class="demo-thero-label">habitantes ('+fmt(regInfo.pct,2)+'% de São José dos Campos)</span></div>'+
     '<div class="demo-thero-stats">'+stat('Domicílios na região',fmt(regInfo.domicilios))+stat('Fonte dos totais regionais','Prefeitura de SJC · Censo 2022')+'</div>'+
     '<p class="demo-thero-hint">Exibindo os bairros e setores da Região '+esc(regInfo.nome)+'. Selecione uma unidade abaixo ou no mapa para ver dados individuais.</p>';
    return;
   }
  }

  const p=f.properties;
  const isBairro=mode==='bairros';
  const displayName=isBairro?(p.friendly_name||p.name):('Setor '+p.id.slice(-4));
  const subTitle=isBairro?('Setor Socioeconômico '+esc(p.sector_code)+' · Região '+esc(p.regiao)+' · Censo 2022'):('Setor censitário IBGE: '+esc(p.id)+' · '+(p.friendly_bairro||p.bairro_name||'São José dos Campos'));

  let body='<div class="demo-thero-head"><span class="demo-thero-badge">'+(isBairro?('Setor '+esc(p.sector_code)+' · Região '+esc(p.regiao)):('Setor censitário IBGE'))+'</span>'+(p.ranking?'<span class="demo-thero-rank">#'+p.ranking+' em população</span>':'<span class="demo-thero-year">Censo 2022</span>')+'</div>'+
   '<h5 class="demo-thero-title">'+esc(displayName)+'</h5>'+
   '<p class="demo-thero-hint">'+subTitle+'</p>';

  if(!isBairro&&p.friendly_bairro){
   body+='<p class="demo-thero-hint">Bairro / Setor de referência: <strong>'+esc(p.friendly_bairro)+'</strong> (Região '+esc(p.regiao)+')</p>';
  }

  body+='<div class="demo-thero-main"><strong class="demo-thero-pop">'+fmt(p.population)+'</strong><span class="demo-thero-label">pessoas residentes ('+fmt(p.population?100*p.population/data.totals.population:0,2)+'% de SJC)</span></div>'+
   '<div class="demo-thero-stats">'+stat('Domicílios recenseados',fmt(p.homes_total))+stat('Particulares ocupados',fmt(p.homes_occupied))+stat('Área publicada',fmt(p.area_km2,2),'km²')+(p.density==null?'':stat('Densidade calculada',fmt(p.density,1),'hab/km²'))+'</div>';

  if(p.sex){
   body+='<div class="demo-thero-stats">'+stat('Homens',fmt(p.sex.men)+' ('+fmt(p.population?100*p.sex.men/p.population:0,1)+'%)')+stat('Mulheres',fmt(p.sex.women)+' ('+fmt(p.population?100*p.sex.women/p.population:0,1)+'%)')+'</div>';
  }

  if(p.income_mean!=null){
   body+='<div class="demo-thero-stats">'+stat('Renda média mensal do responsável','R$ '+fmt(p.income_mean,2))+(p.income_median==null?'':stat('Renda mediana mensal do responsável','R$ '+fmt(p.income_median,2)))+'</div><p class="demo-thero-hint">Responsáveis com rendimentos em domicílios particulares permanentes ocupados (IBGE Censo 2022).</p>';
  }

  if(p.ages){
   body+='<details class="demo-ibge-details"><summary>Faixas etárias desta unidade ('+fmt(p.population)+' residentes)</summary>'+
    '<table><caption>Faixas etárias publicadas · Censo 2022</caption><thead><tr><th>Faixa de idade</th><th>Habitantes</th><th>%</th></tr></thead><tbody>'+
    p.ages.map((n,i)=>'<tr><td>'+esc(data.age_labels[i].replace(/a(?=\d)/,'a '))+'</td><td>'+fmt(n)+'</td><td>'+(n==null?'Não divulgado':fmt(p.population?100*n/p.population:0,1)+'%')+'</td></tr>').join('')+
    '</tbody></table></details>';
  }

  body+='<p class="demo-thero-hint">Fonte oficial: IBGE · Censo Demográfico 2022.</p>';
  box.innerHTML=body;
 }

 function list(){
  const rows=listed();
  const countEl=root.querySelector('#hubChartDemografiaRegioes');
  const maxPop=rows.length?Math.max(...rows.map(r=>r.properties.population||0)):1;
  const isBairro=mode==='bairros';

  if(countEl){
   countEl.textContent=rows.length+' '+(isBairro?'bairros e setores':'setores censitários IBGE')+' '+(region!=='todas'?'na Região '+region:'nesta consulta')+' · '+Math.min(limit,rows.length)+' exibidos.';
  }

  const visible=rows.slice(0,limit);
  root.querySelector('#demo-territory-list').innerHTML=visible.map(f=>{
   const p=f.properties;
   const isSel=p.id===selected;
   const pctPop=(p.population/data.totals.population*100).toFixed(1);
   const barWidth=maxPop>0?(p.population/maxPop*100).toFixed(1):0;

   if(isBairro){
    return '<button type="button" class="demo-territory-item-btn" data-ibge-select="'+esc(p.id)+'" aria-pressed="'+isSel+'">'+
     '<div class="demo-titem-top"><span class="demo-titem-rank">#'+p.ranking+'</span><strong class="demo-titem-name">'+esc(p.friendly_name||p.name)+'</strong><span class="demo-titem-pop">'+fmt(p.population)+' hab</span></div>'+
     '<div class="demo-titem-bar"><div class="demo-titem-track"><i style="width:'+barWidth+'%"></i></div><span class="demo-titem-pct">'+pctPop+'%</span></div>'+
     '<div class="demo-titem-sub"><span>Setor '+esc(p.sector_code)+' · Região '+esc(p.regiao)+'</span>'+(p.income_mean!=null?'<span class="demo-titem-income">R$ '+fmt(p.income_mean,0)+'/mês</span>':'')+'</div>'+
     '</button>';
   }

   return '<button type="button" class="demo-territory-item-btn" data-ibge-select="'+esc(p.id)+'" aria-pressed="'+isSel+'">'+
    '<div class="demo-titem-top"><strong class="demo-titem-name demo-ibge-code">Setor · '+esc(p.id.slice(-4))+'</strong><span class="demo-titem-pop">'+fmt(p.population)+' hab</span></div>'+
    '<div class="demo-titem-sub">Setor censitário · '+esc(p.friendly_bairro||p.bairro_name||p.locality||'São José dos Campos')+(p.regiao&&p.regiao!=='Municipal'?' ('+esc(p.regiao)+')':'')+'</div>'+
    '</button>';
  }).join('')+(rows.length>limit?'<button type="button" class="demo-action" data-ibge-more>Mostrar mais unidades</button>':'');
 }

 function context(){
  const note=root.querySelector('#demo-ibge-context');
  if(note){
   note.textContent=mode==='bairros'
    ?'Divisão em 35 Bairros e Setores Socioeconômicos de São José dos Campos (Censo 2022). Dados oficiais de população, domicílios, densidade e rendimento do IBGE e PMSJC.'
    :'Malha definitiva de 1.554 microsetores censitários do IBGE (1.488 urbanos e 66 rurais). Resolução máxima por setor censitário individual.';
   note.hidden=false;
  }



  root.querySelectorAll('[data-ibge-mode], [data-demo-mode]').forEach(b=>{
   const bMode=b.dataset.ibgeMode||b.dataset.demoMode;
   const isActive=bMode===mode;
   b.classList.toggle('active',isActive);
   b.setAttribute('aria-pressed',String(isActive));
  });

  const regSelect=root.querySelector('#demo-ibge-region');
  if(regSelect){
   const matchOpt=Array.from(regSelect.options).find(o=>norm(o.value)===norm(region));
   if(matchOpt)regSelect.value=matchOpt.value;
  }



  const indSelect=root.querySelector('#demo-ibge-indicator');
  if(indSelect)indSelect.value=metric;

  const sourcesBox=root.querySelector('#demo-ibge-sources');
  if(sourcesBox)sourcesBox.innerHTML=sources()+'<br>Censo Demográfico 2022 · unidades e universos oficiais apurados.';

  let cuts,colors=['#bae6fd','#38bdf8','#0284c7','#0369a1'],metricTitle;
  if(mode==='bairros'){
   cuts=metric==='density'?[1000,4000,7000]:metric==='income_mean'?[2500,4500,9000]:[10000,25000,40000];
   metricTitle=metric==='density'?'Densidade demográfica dos bairros · hab/km²':metric==='income_mean'?'Rendimento médio do responsável · R$/mês':'População residente dos bairros · habitantes';
  }else{
   cuts=metric==='density'?[100,1000,5000]:metric==='income_mean'?[2000,4000,8000]:[250,500,1000];
   metricTitle=metric==='density'?'Densidade demográfica do setor · hab/km²':metric==='income_mean'?'Renda média mensal do responsável · R$':'População do setor censitário · pessoas';
  }
  const labels=['Abaixo de '+fmt(cuts[0]),fmt(cuts[0])+' a menos de '+fmt(cuts[1]),fmt(cuts[1])+' a menos de '+fmt(cuts[2]),fmt(cuts[2])+' ou mais'];

  const legendBox=root.querySelector('#demografia-map-legend-box');
  if(legendBox){
   legendBox.innerHTML='<span class="demo-leg-title">'+metricTitle+'</span>'+
    labels.map((label,i)=>'<span class="demo-leg-item"><i style="background:'+colors[i]+'"></i> '+label+'</span>').join('')+
    '<span class="demo-leg-item"><i style="background:#e2e8f0"></i> Zero publicado</span><span class="demo-leg-item"><i style="background:#cbd5e1"></i> Não divulgado</span>';
  }
 }

 function render(){
  if(!data||!map)return;
  const started=performance.now();
  if(layer)map.removeLayer(layer);
  const fs=eligibleFeatures();
  const isBairro=mode==='bairros';

  layer=L.geoJSON({type:'FeatureCollection',features:fs},{
   style,
   onEachFeature(f,l){
    const p=f.properties;
    const title=isBairro?(p.friendly_name+' · Setor '+p.sector_code):('Setor censitário IBGE · '+p.id);
    const sub=isBairro?('Região '+p.regiao):('Bairro de referência: '+(p.friendly_bairro||p.bairro_name||'Não identificado'));
    const valText=metric==='income_mean'
     ?(p.income_mean!=null?'Renda média do responsável: R$ '+fmt(p.income_mean,2):'Rendimento não divulgado')
     :metric==='density'
     ?('Densidade: '+fmt(p.density,1)+' hab/km²')
     :('População: '+fmt(p.population)+' habitantes ('+(p.population?fmt(100*p.population/data.totals.population,2):0)+'%)');

    l.bindTooltip('<strong>'+esc(title)+'</strong><br>'+esc(sub)+'<br>'+valText+'<br><small style="color:#64748b">Clique para ver todos os detalhes</small>',{sticky:true});
    l.on('click',()=>focus(p.id));
   }
  }).addTo(map);

  context();
  selection();
  list();

  card.dataset.ibgeRendered=String(fs.length);
  card.dataset.ibgeRenderMs=(performance.now()-started).toFixed(1);
  map.invalidateSize();

  if(!selected){
   if(region==='todas'&&mode==='bairros'){
    map.setView([-23.205,-45.885],12);
   }else if(fs.length&&layer.getBounds().isValid()){
    map.fitBounds(layer.getBounds(),{padding:[20,20],maxZoom:isBairro?13:12});
   }else if(boundary?.getBounds()?.isValid()){
    map.fitBounds(boundary.getBounds(),{padding:[16,16],maxZoom:12});
   }
  }
 }

 function focus(id){
  const f=data[mode].features.find(f=>f.properties.id===id);
  if(!f)return;
  selected=id;
  let found;
  layer.eachLayer(l=>{
   l.setStyle(style(l.feature));
   if(l.feature.properties.id===id)found=l;
  });
  if(found){
   found.bringToFront();
   map.fitBounds(found.getBounds(),{padding:[30,30],maxZoom:mode==='bairros'?14:15});
  }
  selection();
  list();
  card.dataset.ibgeSelected=id;
  placePanel();
  if(window.innerWidth<=768&&id&&root){
   const hero=root.querySelector('#demo-territory-selection');
   if(hero&&hero.scrollIntoView){
    hero.scrollIntoView({behavior:'smooth',block:'nearest'});
   }
  }
 }

 function setMode(next){
  if(!['setores','bairros'].includes(next))return;
  mode=next;
  situation='todas';
  selected=null;
  search='';
  const searchInput=root.querySelector('#demo-place-search')||root.querySelector('#demo-ibge-search');
  if(searchInput)searchInput.value='';
  limit=60;
  render();
 }

 function setRegion(next){
  if(!next||next==='todas'){
   region='todas';
  }else{
   const found=Object.keys(REGIONS_DATA).find(k=>norm(k)===norm(next));
   region=found||next;
  }
  selected=null;
  render();
 }

 function setSituation(next){
  if(!['todas','Urbana','Rural'].includes(next)||mode!=='setores')return;
  clearPlace();
  situation=next;
  selected=null;
  search='';
  limit=60;
  render();
 }

 async function mount(container){
  root=container;
  card=root.querySelector('.demo-card-territory');
  if(!card)return;

  if(!card.dataset.ibgeBound){
   card.dataset.ibgeBound='true';
   card.addEventListener('click',e=>{
    if(!data)return;
    const b=e.target.closest('[data-ibge-mode], [data-demo-mode]'),m=e.target.closest('[data-ibge-metric]'),s=e.target.closest('[data-ibge-select]');
    if(b)setMode(b.dataset.ibgeMode||b.dataset.demoMode);
    if(m){metric=m.dataset.ibgeMetric;render();}
    if(s)focus(s.dataset.ibgeSelect);
    const sectorBtn=e.target.closest('[data-sector-focus]');
    if(sectorBtn){
     const secId=sectorBtn.dataset.sectorFocus;
     if(mode!=='bairros')setMode('bairros');
     focus(secId);
     const searchInput=root.querySelector('#demo-place-search');
     const matchedF=data.bairros.features.find(f=>f.properties.id===secId);
     if(searchInput&&matchedF)searchInput.value=matchedF.properties.friendly_name;
     const box=root.querySelector('#demo-place-suggestions');
     if(box)box.innerHTML='';
     return;
    }
    const placeButton=e.target.closest('[data-place-id]');
    if(placeButton)choosePlace(placeButton.dataset.placeId);
    if(e.target.closest('[data-place-online]'))onlineSearch();
    if(e.target.closest('[data-ibge-clear]')){
     clearPlace();
     selected=null;
     region='todas';
     situation='todas';
     search='';
     limit=60;
     const searchInput=root.querySelector('#demo-place-search');
     if(searchInput)searchInput.value='';
     const regSelect=root.querySelector('#demo-ibge-region');
     if(regSelect)regSelect.value='todas';
     render();
    }
    if(e.target.closest('[data-ibge-more]')){limit+=60;list();}
   });

   card.addEventListener('change',e=>{
    if(!data)return;
    if(e.target.id==='demo-ibge-region')setRegion(e.target.value);
    if(e.target.id==='demo-ibge-indicator'){metric=e.target.value;render();}
   });

   card.addEventListener('input',e=>{
    if(!data)return;
    if(e.target.id==='demo-place-search'){
     search=e.target.value.trim();
     suggest();
     list();
    }
    if(e.target.id==='demo-ibge-search'){
     search=e.target.value.trim();
     limit=60;
     list();
    }
   });

   card.addEventListener('keydown',e=>{
    if(!data)return;
    if(e.target.id==='demo-place-search'){
     if(e.key==='Escape')root.querySelector('#demo-place-suggestions').innerHTML='';
     if(e.key==='ArrowDown'){e.preventDefault();(root.querySelector('[data-sector-focus]')||root.querySelector('[data-place-id]'))?.focus();}
     if(e.key==='Enter'){
      e.preventDefault();
      const topBtn=root.querySelector('[data-sector-focus]')||root.querySelector('[data-place-id]');
      if(topBtn)topBtn.click();
     }
    }
    if(e.target.id==='demo-ibge-search'&&e.key==='Enter'&&data[mode].features.some(f=>f.properties.id===e.target.value.trim()))focus(e.target.value.trim());
   });
  }

  try{
   await load();
   if(!map){
    map=L.map(root.querySelector('#hubMapDemografiaCalor'),{preferCanvas:true,scrollWheelZoom:false}).setView([-23.205,-45.885],12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    boundary=L.geoJSON(data.boundary,{interactive:false,style:{color:'#64748b',weight:2,dashArray:'6 5',fill:false}}).addTo(map);
    if(global.ResizeObserver)new ResizeObserver(()=>map.invalidateSize()).observe(root.querySelector('#hubMapDemografiaCalor'));
   }
   render();
   card.dataset.ibgeReady='true';
  }catch(e){
   root.querySelector('#demo-territory-selection').textContent='Consulta territorial IBGE indisponível nesta sessão. Nenhum valor municipal foi usado como substituto.';
   console.warn('Demografia IBGE:',e.message);
  }
 }

 global.RadarDemografiaIBGE={mount,render,focus,setMode,setRegion,setSituation,verify};
})(window);
