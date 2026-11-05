/* Presentation-only municipal atlas. Geometry and documentary facts stay separate. */
(function () {
  'use strict';
  const HASH = '4be052d9635c161bbc7465c942e135b7776545c5e02938944c1a45942394c026';
  const URL = 'public-data/mobilidade/atlas.v1.json';
  const instances = new WeakMap();
  let contractPromise;
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const safeURL = value => { try { const u = new window.URL(value, location.href); return /^https?:$/.test(u.protocol) ? escape(u.href) : ''; } catch (_) { return ''; } };
  async function verify(text) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('') === HASH;
  }
  async function load() {
    const key = 'radar-atlas-mobilidade:' + HASH;
    try {
      const response = await fetch(URL, {cache:'no-cache'});
      if (!response.ok) throw new Error('Contrato indisponível');
      const text = await response.text();
      if (!await verify(text)) throw new Error('Integridade inválida');
      const data = JSON.parse(text);
      if (data.schema_version !== 1 || !Array.isArray(data.roads) || data.features?.type !== 'FeatureCollection') throw new Error('Contrato incompatível');
      try { localStorage.setItem(key, text); } catch (_) { /* Optional cache. */ }
      return data;
    } catch (error) {
      let cached; try { cached = localStorage.getItem(key); } catch (_) { /* Optional cache. */ }
      if (cached && await verify(cached)) return JSON.parse(cached);
      throw error;
    }
  }
  const link = source => { const url = safeURL(source.url); return url ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${escape(source.label)}</a>${source.edition ? ` <span>· ${escape(source.edition)}</span>` : ''}` : escape(source.label); };
  function details(road) {
    const section = (title, values) => Array.isArray(values) && values.length ? `<section class="atlas-facts"><h5>${title}</h5><ul>${values.map(v => `<li>${escape(v)}</li>`).join('')}</ul></section>` : '';
    const geometry = road.geometry_note || road.geometry_names?.length ? `<details class="atlas-method"><summary>Identificação do traçado</summary>${road.geometry_note ? `<p>${escape(road.geometry_note)}</p>` : ''}${road.geometry_names?.length ? `<p>Nomes na base cartográfica: ${escape(road.geometry_names.join(' · '))}</p>` : ''}</details>` : '';
    return `<p class="atlas-ref">${escape(road.ref)} · ${escape(road.classification)}</p><h4>${escape(road.name)}</h4>${road.administrator ? `<p class="atlas-territorial"><strong>Responsável pelo trecho documentado:</strong> ${escape(road.administrator)}</p>` : ''}${section('Conexões regionais', road.destinations)}${section('Conexões documentadas', road.connections)}${section('Acessos documentados', road.accesses)}${section('Distritos do IBGE atravessados', road.districts)}${road.territorial_note ? `<p class="atlas-territorial">${escape(road.territorial_note)}</p>` : ''}<div class="atlas-official"><h5>Informação oficial</h5>${(road.sources || []).map(s => `<p>${link(s)}</p>`).join('')}</div>${geometry}`;
  }
  function draw(state) {
    const {root, data} = state;
    root.innerHTML = `<section class="mob-atlas" aria-labelledby="mob-atlas-title"><header class="atlas-heading"><p class="atlas-eyebrow">Atlas da Mobilidade</p><h3 id="mob-atlas-title">Por onde São José se conecta?</h3><p>Explore as rodovias e suas conexões documentadas no território municipal.</p></header><div class="atlas-layout"><div class="atlas-cartography"><div class="atlas-map" role="region" aria-label="Mapa interativo das rodovias de São José dos Campos"></div><div class="atlas-legend"><span><i></i>Traçado rodoviário</span><span><i class="selected"></i>Rodovia selecionada</span></div><p class="atlas-cart-source">Cartografia: ${link(data.geometry_source)} · ${escape(data.geometry_source.license || '')}</p></div><aside class="atlas-panel" aria-label="Exploração das rodovias"><label class="atlas-search">Buscar rodovia ou sigla<input type="search" data-atlas-search placeholder="Ex.: Dutra ou SP-099" autocomplete="off"></label><div class="atlas-road-list" aria-label="Rodovias disponíveis"></div><p class="atlas-status" role="status" aria-live="polite"></p><div class="atlas-context"></div></aside></div><details class="atlas-method"><summary>Sobre as camadas e a leitura territorial</summary><p>Rodovias é a camada disponível nesta edição. Vias estruturais, transporte coletivo, rede cicloviária e travessias dependem de geometrias e recortes verificáveis antes de sua inclusão.</p><p>Acesso documentado, conexão regional e atravessamento territorial são relações distintas. A proximidade visual no mapa não comprova acesso nem vínculo com um bairro.</p><p>O mapa-base é cartografia complementar do OpenStreetMap. As fontes oficiais sustentam as informações do painel; a fonte do traçado e sua edição estão identificadas abaixo do mapa.</p>${data.geometry_source.methodology ? `<p>${escape(data.geometry_source.methodology)}</p>` : ''}</details></section>`;
    state.map = L.map(root.querySelector('.atlas-map'), {scrollWheelZoom:false, zoomControl:true});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', detectRetina:false}).addTo(state.map);
    state.layers = [];
    state.geometry = L.geoJSON(data.features, {style: feature => style(feature.properties.road_id, state.selected), onEachFeature:(feature, layer) => {
      const road = data.roads.find(r => r.id === feature.properties.road_id);
      if (!road) return;
      layer.bindTooltip(`${escape(road.ref)} · ${escape(road.name)}`, {sticky:true});
      layer.on('click', () => select(state, road.id));
      state.layers.push({id:road.id, layer});
    }}).addTo(state.map);
    home(state);
    root.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || !root.contains(button)) return;
      if (button.dataset.atlasRoad) select(state, button.dataset.atlasRoad);
      if (button.dataset.atlasAction === 'clear') { select(state, null); }
      if (button.dataset.atlasAction === 'home') { select(state, null); home(state); }
    });
    root.querySelector('[data-atlas-search]').addEventListener('input', event => { state.query = event.target.value; list(state); });
    state.observer = new ResizeObserver(() => { if (root.getBoundingClientRect().width > 0) state.map.invalidateSize({pan:false}); });
    state.observer.observe(root);
    list(state);
    select(state, null);
  }
  function style(id, selected) { return {color:id === selected ? '#0369a1' : '#06b6d4', weight:id === selected ? 7 : 4, opacity:selected && id !== selected ? .4 : .95, lineCap:'round', lineJoin:'round'}; }
  function home(state) {
    if (state.data.bounds?.length === 2) state.map.fitBounds(state.data.bounds, {padding:[20,20]});
    else if (state.geometry.getBounds().isValid()) state.map.fitBounds(state.geometry.getBounds(), {padding:[20,20]});
  }
  function list(state) {
    const norm = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const query = norm(state.query || '').trim();
    const roads = state.data.roads.filter(r => norm(r.name + ' ' + r.ref + ' ' + (r.aliases || []).join(' ')).includes(query));
    state.root.querySelector('.atlas-road-list').innerHTML = roads.length ? roads.map(r => `<button type="button" data-atlas-road="${escape(r.id)}" aria-pressed="${state.selected === r.id}"><strong>${escape(r.ref)}</strong><span>${escape(r.name)}</span></button>`).join('') : '<p class="atlas-empty">Nenhuma rodovia encontrada. Tente o nome ou a sigla.</p>';
  }
  function select(state, id) {
    const road = state.data.roads.find(r => r.id === id);
    state.selected = road ? id : null;
    state.geometry.setStyle(feature => style(feature.properties.road_id, state.selected));
    if (road) {
      const bounds = L.latLngBounds([]);
      state.layers.filter(item => item.id === id).forEach(item => { bounds.extend(item.layer.getBounds()); item.layer.bringToFront(); });
      if (bounds.isValid()) state.map.fitBounds(bounds, {padding:[24,24], maxZoom:13});
    }
    state.root.querySelector('.atlas-context').innerHTML = road ? details(road) : '<div class="atlas-intro"><h4>Conheça as conexões da cidade</h4><p>Selecione uma rodovia na lista ou no mapa para consultar destinos, entroncamentos e fontes.</p></div>';
    state.root.querySelector('.atlas-status').textContent = road ? `${road.ref} selecionada` : 'Nenhuma rodovia selecionada';
    list(state);
  }
  async function mount(container) {
    if (!container) return false;
    container.setAttribute('data-mob-atlas-root', '');
    let state = instances.get(container);
    if (state) { if (state.map) requestAnimationFrame(() => state.map.invalidateSize({pan:false})); return state.ready; }
    state = {root:container, selected:null, query:''};
    instances.set(container, state);
    container.innerHTML = '<p class="atlas-loading" role="status">Carregando o Atlas da Mobilidade…</p>';
    state.ready = (async () => {
      try {
        if (!window.L) throw new Error('Mapa não disponível');
        if (!contractPromise) contractPromise = load().catch(error => { contractPromise = null; throw error; });
        state.data = await contractPromise;
        draw(state);
        return true;
      } catch (_) {
        if (state.observer) state.observer.disconnect();
        if (state.map) state.map.remove();
        instances.delete(container);
        container.innerHTML = '<p class="atlas-loading" role="status">O Atlas não pôde ser carregado nesta conexão. Os demais indicadores continuam disponíveis.</p>';
        return false;
      }
    })();
    return state.ready;
  }
  async function getJurisdictions(){if(!contractPromise)contractPromise=load().catch(error=>{contractPromise=null;throw error;});const data=await contractPromise;const ids=new Set();let federal=0,state=0;for(const road of data.roads){if(ids.has(road.id))continue;ids.add(road.id);if(road.classification==='rodovia federal')federal++;else if(road.classification.startsWith('rodovia estadual'))state++;}return {federal,state,municipal:null,source:data.geometry_source};}
  window.RadarMobilidadeAtlas = {mount, getJurisdictions, fingerprint:() => HASH};
})();
