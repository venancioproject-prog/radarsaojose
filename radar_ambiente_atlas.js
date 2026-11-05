(function (global) {
  'use strict';
  const BASE = 'public-data/meio_ambiente/geosanja/';
  const themes = {
    municipais:{title:'APAs municipais',keys:['conservacao'],description:'Áreas de Proteção Ambiental municipais representadas no mapa de Unidades de Conservação do Plano Diretor de 2018.',reading:'Uma APA é um território com diretrizes de proteção ambiental. Seu limite não significa que toda a área seja coberta por floresta.',legend:[['APA municipal','#7854a0']]},
    estaduais:{title:'APAs estaduais',keys:['apas_estaduais'],description:'Limites das APAs estaduais disponibilizados pelo GeoSanja, dentro de São José dos Campos.',reading:'A camada identifica áreas estaduais de proteção. Os trechos da base não trazem a denominação individual de cada APA.',legend:[['APA estadual','#07885d']]},
    federais:{title:'APAs federais',keys:['apas_federais'],description:'Limites das APAs federais disponibilizados pelo GeoSanja, dentro de São José dos Campos.',reading:'As esferas municipal, estadual e federal podem se sobrepor. As áreas desses mapas não devem ser somadas.',legend:[['APA federal','#2877bd']]},
    naturais:{title:'Parques naturais e entorno protegido',keys:['parque_ruschi','parque_banhado'],description:'Parques naturais municipais do Banhado e Augusto Ruschi, com o entorno de proteção que acompanha a camada do Augusto Ruschi.',reading:'A zona de amortecimento é o entorno protegido do parque, com regras próprias. Não faz parte do perímetro do parque.',legend:[['Parque natural','#487927'],['Zona de amortecimento','#a28a25']]},
    urbanos:{title:'Parques urbanos: existentes e propostos',keys:['parques_urbanos'],description:'Parques urbanos representados no Plano Diretor de 2018, separados pela situação informada na base.',reading:'Uma área proposta no Plano Diretor não equivale a um parque implantado ou aberto à visitação. Consulte a situação de cada local.',legend:[['Existente na base','#07885d'],['Proposto na base','#ba7019'],['Outra situação / não informada','#62758a']]},
    interesse:{title:'Áreas urbanas de interesse ambiental',keys:['interesse_ambiental'],description:'Áreas de não ocupação, de controle de impermeabilização e remanescentes de vegetação do Inventário Florestal de 2010, reunidos no Plano Diretor de 2018.',reading:'São recortes distintos de planejamento e vegetação histórica. O mapa não representa uma medição atual da cobertura verde.',legend:[['Áreas de não ocupação','#ad6244'],['Controle de impermeabilização','#3b86a8'],['Vegetação · Inventário 2010','#4d8b47']]},
    inundacao:{title:'Áreas suscetíveis a inundação',keys:['inundacao'],description:'Áreas mapeadas na Etapa 1 do Plano Diretor de Drenagem e Manejo de Águas Pluviais (PDDMAP), identificadas no catálogo com referência ao decreto de 2021.',reading:'Suscetibilidade indica uma condição territorial mapeada. Não é alerta de chuva, previsão ou registro de inundação em tempo real.',legend:[['Suscetibilidade mapeada','#bd5b44']]}
  };
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cache = new Map();
  let manifestPromise, instance;
  async function json(url) {const r=await fetch(url);if(!r.ok)throw Error('Arquivo cartográfico indisponível');return r.json();}
  function collection(key) {
    if(!cache.has(key))cache.set(key,json(BASE+key+'.geojson').then(d=>{if(d.type!=='FeatureCollection'||!Array.isArray(d.features)||!d.features.length)throw Error('Camada inválida');return d;}).catch(e=>{cache.delete(key);throw e;}));
    return cache.get(key);
  }
  function label(feature,key,index) {
    const p=feature.properties || {};
    return String(p.nome || p.name || p.NOME || (key==='interesse_ambiental'?componentLabel(p._geosanja_component):'Trecho cartográfico '+(index+1)));
  }
  function componentLabel(c) {return {areaNaoOcupacao:'Áreas de não ocupação',areaControleImpermeabilizacao:'Controle de impermeabilização',fragmentosIF2010:'Vegetação · Inventário 2010'}[c] || c;}
  function color(feature,key) {
    const p=feature.properties || {}, text=String(p.nome || p.name || '').toLowerCase();
    if(key==='parque_ruschi' && text.includes('amortecimento'))return '#a28a25';
    if(key==='parques_urbanos')return p.situacao==='EXISTENTE'?'#07885d':p.situacao==='PROPOSTO'?'#ba7019':'#62758a';
    if(key==='interesse_ambiental')return {areaNaoOcupacao:'#ad6244',areaControleImpermeabilizacao:'#3b86a8',fragmentosIF2010:'#4d8b47'}[p._geosanja_component] || '#62758a';
    return instance.manifest.layers[key].color;
  }
  function showFeature(feature,key,index,layer) {
    const root=instance.root,p=feature.properties || {}, name=label(feature,key,index);
    const fields=[['Situação na base',p.situacao],['Referência informada',p.descriptio || p.descricao]];
    root.querySelector('[data-atlas-selection]').innerHTML=`<p class="amb-atlas-kicker">Área selecionada</p><h5>${esc(name)}</h5>${fields.filter(([,v])=>v).map(([k,v])=>`<p><strong>${k}:</strong> ${esc(v)}</p>`).join('')}<p>Fonte: ${esc(instance.manifest.layers[key].source_title)} · GeoSanja.</p>`;
    if(layer.getBounds)instance.map.fitBounds(layer.getBounds(),{padding:[28,28],maxZoom:14});
    layer.bindPopup(`<strong>${esc(name)}</strong>${p.situacao?'<br>Situação na base: '+esc(p.situacao):''}`).openPopup();
  }
  async function selectTheme(name) {
    if(!themes[name]||!instance?.map)return;
    const current=instance, request=++current.request, root=current.root, theme=themes[name];
    root.querySelector('[data-atlas-theme]').value=name;
    root.querySelector('[data-atlas-status]').textContent='Carregando o tema selecionado…';
    try {
      const datasets=await Promise.all(theme.keys.map(collection));
      if(instance!==current||request!==current.request)return;
      const next=global.L.featureGroup(), items=[];
      datasets.forEach((geo,i)=>{
        const key=theme.keys[i];
        global.L.geoJSON(geo,{style:f=>({color:color(f,key),fillColor:color(f,key),weight:1.7,fillOpacity:.24}),onEachFeature:(f,l)=>{
          const index=items.length;
          l.bindTooltip(esc(label(f,key,index)),{sticky:true});
          l.on('click',()=>showFeature(f,key,index,l));
          l.on('mouseover',()=>l.setStyle({weight:3,fillOpacity:.4}));
          l.on('mouseout',()=>l.setStyle({weight:1.7,fillOpacity:.24}));
          items.push({feature:f,key,layer:l,index});
        }}).addTo(next);
      });
      current.overlay?.remove();current.overlay=next.addTo(current.map);current.active=name;current.items=items;
      current.boundary.bringToFront();
      root.querySelector('[data-atlas-title]').textContent=theme.title;
      root.querySelector('[data-atlas-reading]').textContent=theme.description;
      root.querySelector('[data-atlas-interpretation]').textContent=theme.reading;
      root.querySelector('[data-atlas-legend]').innerHTML=theme.legend.map(([text,c])=>`<span><i style="background:${c}"></i>${esc(text)}</span>`).join('')+'<span><i class="amb-atlas-boundary-swatch"></i>Limite municipal</span>';
      root.querySelector('[data-atlas-selection]').innerHTML='<p>Clique em uma área do mapa para consultar sua identificação.</p>';
      const list=root.querySelector('[data-atlas-list]');
      if(items.length<=40) {
        list.innerHTML=items.map(item=>`<button type="button" data-atlas-feature="${item.index}">${esc(label(item.feature,item.key,item.index))}${item.feature.properties?.situacao?`<small>${esc(item.feature.properties.situacao)}</small>`:''}</button>`).join('');
      } else list.innerHTML='<p>Este tema reúne muitos fragmentos. Use o zoom e clique diretamente no mapa para explorar cada trecho.</p>';
      root.querySelector('[data-atlas-sources]').innerHTML=theme.keys.map(key=>`<span>${esc(current.manifest.layers[key].source_title)}</span>`).join(' · ');
      root.querySelector('[data-atlas-status]').textContent='Tema carregado.';
      current.map.fitBounds(next.getBounds(),{padding:[24,24],maxZoom:12});
      root.dataset.atlasTheme=name;
    } catch(e) {
      if(request!==current.request)return;
      root.querySelector('[data-atlas-theme]').value=current.active || name;
      root.querySelector('[data-atlas-status]').textContent='Não foi possível carregar este tema. Selecione-o novamente para tentar outra vez.';
    }
  }
  async function mount(root) {
    if(!root)return;
    if(instance?.root===root){instance.map?.invalidateSize({pan:false});return;}
    if(instance?.map)instance.map.remove();
    const current={root,request:0};instance=current;
    root.className='amb-atlas';
    root.innerHTML=`<header><div class="amb-atlas-heading"><p class="amb-eyebrow">Explore o território · GeoSanja</p><h3>APAs e outras áreas ambientais</h3><p>Escolha um tema e clique nas áreas para explorar o mapa.</p></div><div class="amb-atlas-toolbar"><label>Tema do mapa<select data-atlas-theme>${Object.entries(themes).map(([key,t])=>`<option value="${key}">${esc(t.title)}</option>`).join('')}</select></label></div></header><div class="amb-atlas-layout"><div class="amb-atlas-map-content"><div class="amb-atlas-map-wrap"><div class="amb-atlas-map" role="region" aria-label="Mapa ambiental interativo de São José dos Campos"></div><button type="button" data-atlas-reset><i class="fa-solid fa-expand" aria-hidden="true"></i> Ver todo o município</button></div><div class="amb-atlas-map-meta"><div class="amb-atlas-legend" data-atlas-legend aria-label="Legenda do mapa"></div><p class="amb-atlas-status" data-atlas-status role="status">Carregando o mapa…</p></div></div><aside class="amb-atlas-aside"><section class="amb-atlas-guide"><p class="amb-atlas-kicker">Sobre o tema</p><h4 data-atlas-title></h4><p data-atlas-reading></p><details class="amb-atlas-explanation"><summary>Como interpretar este tema</summary><p data-atlas-interpretation></p></details></section><section class="amb-atlas-area"><div data-atlas-selection class="amb-atlas-selection" aria-live="polite"></div><details><summary>Encontrar uma área no mapa</summary><div class="amb-atlas-list" data-atlas-list></div></details></section></aside></div><footer><p><a href="https://geo.sjc.sp.gov.br/" target="_blank" rel="noopener noreferrer">Prefeitura de São José dos Campos · GeoSanja</a> · <span data-atlas-sources></span></p><p class="amb-note" data-atlas-date></p><details><summary>Fontes e critérios dos mapas</summary><p>As geometrias foram extraídas das camadas públicas do GeoSanja, recortadas pelo limite municipal e simplificadas em 5 metros para navegação. O mapa é uma cópia da base consultada; não recebe alertas nem atualizações em tempo real.</p><p>APAs de esferas diferentes podem se sobrepor. Os limites de proteção, os parques propostos e os remanescentes históricos de vegetação representam conceitos distintos. Não calculamos um total somando essas áreas.</p><p><a href="${BASE}manifest.v1.json" target="_blank" rel="noopener noreferrer">Consultar as fontes e a identificação das camadas</a>.</p></details></footer>`;
    root.onchange=e=>{if(e.target.matches('[data-atlas-theme]'))selectTheme(e.target.value);};
    root.onclick=e=>{
      const feature=e.target.closest('[data-atlas-feature]');
      if(feature){const item=current.items?.[+feature.dataset.atlasFeature];if(item)showFeature(item.feature,item.key,item.index,item.layer);}
      if(e.target.closest('[data-atlas-reset]')&&current.boundary)current.map.fitBounds(current.boundary.getBounds(),{padding:[20,20]});
    };
    try {
      if(!global.L)throw Error('Biblioteca de mapas indisponível');
      if(!manifestPromise)manifestPromise=json(BASE+'manifest.v1.json').catch(e=>{manifestPromise=null;throw e;});
      const [manifest,boundary]=await Promise.all([manifestPromise,collection('limite')]);
      if(instance!==current)return;
      if(manifest.schema_version!==1||manifest.territory!=='3549904')throw Error('Mapa incompatível');
      current.manifest=manifest;
      current.map=global.L.map(root.querySelector('.amb-atlas-map'),{scrollWheelZoom:false,attributionControl:true}).setView([-23.05,-45.95],10);
      const tiles=global.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Camadas: GeoSanja'}).addTo(current.map);
      let tileWarning=false;
      tiles.on('tileerror',()=>{if(tileWarning)return;tileWarning=true;root.querySelector('[data-atlas-date]').textContent+=' O fundo de ruas está indisponível; os limites ambientais continuam disponíveis.';});
      current.boundary=global.L.geoJSON(boundary,{style:{color:'#52677b',weight:1.4,fill:false,dashArray:'5 4'},interactive:false}).addTo(current.map);
      current.map.fitBounds(current.boundary.getBounds(),{padding:[20,20]});
      global.L.control.scale({imperial:false,position:'bottomleft'}).addTo(current.map);
      root.querySelector('[data-atlas-date]').textContent='Base consultada em '+new Date(manifest.retrieved_at).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'})+'. As referências de cada tema estão descritas abaixo do mapa.';
      await selectTheme('municipais');
      root.dataset.atlasReady='true';
    } catch(e) {
      root.querySelector('[data-atlas-status]').textContent='O mapa não pôde ser carregado. Os indicadores abaixo continuam disponíveis.';
      const retry=document.createElement('button');retry.type='button';retry.textContent='Tentar carregar o mapa';retry.className='amb-atlas-retry';retry.onclick=()=>{if(instance===current){instance.map?.remove();instance=null;}mount(root);};root.querySelector('[data-atlas-status]').appendChild(retry);
    }
  }
  global.RadarAmbienteAtlas={mount,selectTheme,getState:()=>({active:instance?.active,features:instance?.items?.length || 0,zoom:instance?.map?.getZoom(),size:instance?.map?.getSize()})};
})(window);
