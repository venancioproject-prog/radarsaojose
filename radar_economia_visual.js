/* P1.1 — apresentação exclusiva de Economia; entrada: pacote aprovado P1.
 * Não consulta fontes, não altera evidência nem dados armazenados. */
(function () {
  'use strict';
  /* ECONOMIA_P1_SOURCES_START */
  const APPROVED_SOURCES = {
  "pib": {
    "url": "https://ftp.ibge.gov.br/Pib_Municipios/2022_2023/base/base_de_dados_2010_2023_txt.zip",
    "accessed_at": "2026-10-04T23:35:21.402753-03:00"
  },
  "pibOld": {
    "url": "https://ftp.ibge.gov.br/Pib_Municipios/2022_2023/base/base_de_dados_2002_2009_txt.zip",
    "accessed_at": "2026-10-04T23:35:26.416112-03:00"
  },
  "caged": {
    "url": "https://drive.usercontent.google.com/download?id=1LFiRd5cYqCLbBv7udPWtus6h4cF3GaA0&export=download",
    "accessed_at": "2026-10-04T23:55:41.842686-03:00"
  },
  "cempre": {
    "url": "https://servicodados.ibge.gov.br/api/v3/agregados/9510/periodos/2022-2024/variaveis/1606%7C10143%7C706%7C367?localidades=N6%5B3549904%5D&classificacao=12762%5B117897%5D",
    "accessed_at": "2026-10-04T23:40:50.630165-03:00"
  }
};
  /* ECONOMIA_P1_SOURCES_END */
  const charts = new Map();
  const state = {pib:'total',composition:null,saldoYear:null,movementYear:null,salary:'reais'};
  let model = null;
  const DIRECT = 'VALIDADO_EXTERNAMENTE';
  const DERIVED = 'CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS';
  const palette = window.RadarDataVizPalette.forAxis('economia');
  const sectors = [
    ['servicos','Serviços, exceto administração pública'],['industria','Indústria'],
    ['administracao','Administração pública'],['agro','Agropecuária'],['impostos','Impostos líquidos de subsídios']
  ];
  function sectorColor(key) {
    const dark=document.documentElement.classList.contains('dark');
    return (dark ? {servicos:'#38bdf8',industria:'#fb923c',administracao:'#34d399',agro:'#a3e635',impostos:'#f472b6'} : {servicos:'#0284c7',industria:'#f97316',administracao:'#10b981',agro:'#84cc16',impostos:'#ec4899'})[key];
  }
  const monthNames = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const number = (v,dec=0) => v == null || !Number.isFinite(v) ? 'Dado não disponível' : Number(v).toLocaleString('pt-BR',{minimumFractionDigits:dec,maximumFractionDigits:dec});
  const money = (v,dec=2) => v == null ? 'Dado não disponível' : 'R$ '+number(v,dec);
  const signed = (v,dec=0) => v == null ? 'Dado não disponível' : (v>0?'+':'')+number(v,dec);
  const competence = value => {const [year,month]=String(value).split('-');return `${monthNames[Number(month)-1] || '? '}/${year}`;};
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text = (id,value) => {const el=document.getElementById(id);if(el) el.textContent=value;if(id.startsWith('eco-insight-'))document.getElementById('hubChartEconomia'+id.slice(12))?.setAttribute('aria-label',value);};
  const variable = (id,year) => model?.cempre.find(r=>r.variable_id===String(id) && r.ano===Number(year));
  const sum = (rows,key) => rows.length && rows.every(r=>r[key]!=null) ? rows.reduce((a,r)=>a+r[key],0) : null;
  const share = (row,key) => row?.pib_milhoes != null && row.pib_milhoes>0 && row.components_mil_reais?.[key]!=null ? 100*row.components_mil_reais[key]/(row.pib_milhoes*1000) : null;
  function indicator(id) {
    const i=model?.pkg.metadataRegistry.indicators.find(r=>r.indicator_id===id);
    const a=model?.pkg.economiaAudit?.indicators?.[id];
    return i && a && [DIRECT,DERIVED].includes(a.status) && i.value!=null && i.value===a.value &&
      i.audit_status===a.status && i.evidence_id===a.evidence_id && (i.competencia || i.base_year)===a.period ? i : null;
  }
  function makeModel(gt,pkg) {
    const econ=gt?.eixos?.economia || {};
    return {pkg,econ,pib:[...(econ.pib_serie_historica || [])].sort((a,b)=>a.ano-b.ano),
      monthly:[...(econ.novo_caged_serie_mensal || [])].sort((a,b)=>a.competencia.localeCompare(b.competencia)),
      cempre:[...(econ.cempre_serie || [])].sort((a,b)=>a.ano-b.ano)};
  }
  function sources() {
    // URLs já abertas e preservadas na P1; não é uma nova coleta.
    return {
      pib:APPROVED_SOURCES.pib?.url || null,
      pibOld:APPROVED_SOURCES.pibOld?.url || null,
      caged:indicator('econ_caged_estoque_2026_08')?.official_url || null,
      cempre:indicator('econ_cempre_unidades_locais_2024')?.official_url || null
    };
  }
  function sourceStrip(key,institution,period,url,calculated=false,additional=null) {
    const el=document.getElementById('eco-source-'+key);if(!el)return;
    el.innerHTML=`<span>Fonte: ${esc(institution)} · ${esc(period)}${calculated?' · cálculo Radar São José a partir de dados oficiais':''}</span> `+
      (url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="font-bold text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">Consultar fonte oficial ↗</a>`:'<span>Fonte não disponível nesta versão</span>')+
      (additional?` <a href="${esc(additional)}" target="_blank" rel="noopener noreferrer" class="font-semibold text-blue-700 hover:underline">Base 2002–2009 ↗</a>`:'');
  }
  function select(id,options,current) {
    const el=document.getElementById(id);if(!el)return current;
    const values=options.map(o=>String(o.value));const selected=values.includes(String(current))?String(current):values.at(-1);
    el.innerHTML=options.map(o=>`<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('');el.value=selected ?? '';el.disabled=!options.length;
    return selected;
  }
  function years() {
    return [...new Set(model.monthly.map(r=>r.ano))].sort((a,b)=>a-b).map(year=>{
      const rows=model.monthly.filter(r=>r.ano===year);const partial=rows.length<12;
      return {value:year,label:String(year)+(partial?' parcial até '+monthNames[rows.at(-1).mes-1]:'')};
    });
  }
  function annual() {
    return years().map(y=>{
      const rows=model.monthly.filter(r=>r.ano===Number(y.value));const published=model.econ.emprego_formal_novo_caged?.saldo_anual_historico?.find(r=>r.ano===Number(y.value));
      return {ano:Number(y.value),months:rows.length,parcial:rows.length<12,competencia:rows.at(-1).competencia,
        estoque:rows.at(-1).estoque ?? null,admissoes:sum(rows,'admissoes'),desligamentos:sum(rows,'desligamentos'),
        saldo:sum(rows,'saldo'),status:published?.status || DERIVED,evidence_id:published?.evidence_id || null,rows};
    });
  }
  function renderChart(key,type,labels,datasets,extra={},tooltip={}) {
    const id='hubChartEconomia'+key,canvas=document.getElementById(id);if(!canvas || !window.Chart)return;
    const card=canvas.closest('article'),meta=metadata(key);
    if(card && meta){
      const heading=card.querySelector('header h4'),subtitle=card.querySelector('header p');
      if(heading)heading.textContent=meta.descriptor[0];
      if(subtitle)subtitle.textContent=meta.descriptor[1]+' '+meta.descriptor[2]+' · '+meta.descriptor[3]+'.';
    }
    charts.get(key)?.destroy();charts.delete(key);
    const hasData=datasets.some(d=>d.data.some(v=>v!=null));
    let empty=document.getElementById('eco-empty-'+key);
    if(empty)empty.classList.toggle('hidden',hasData);
    canvas.classList.toggle('hidden',!hasData);
    if(!hasData)return;
    const base={responsive:true,maintainAspectRatio:false,animation:{duration:250},interaction:{mode:'index',intersect:false},
      layout:{padding:{top:24,right:20,bottom:4}},
      plugins:{legend:{display:datasets.length>1,position:'bottom',labels:{boxWidth:10,boxHeight:10,padding:12,color:palette.text,font:{family:'Inter',size:12}}},
        datalabels:{display:c=>c.dataset.data[c.dataIndex]!=null&&(type==='line'?datasets.length===1&&c.dataIndex===labels.length-1:labels.length<=12&&(datasets.length===1||labels.length<=6)),anchor:'end',align:extra.indexAxis==='y'?'right':'top',clamp:true,color:palette.text,font:{family:'Inter',size:12,weight:'600'},formatter:v=>number(v,Math.abs(v)<100?1:0)},tooltip:{padding:12,displayColors:datasets.length>1,callbacks:tooltip}},
      scales:{x:{grid:{display:false},ticks:{autoSkip:true,maxTicksLimit:8,maxRotation:0,color:palette.text,font:{family:'Inter',size:12}}},
        y:{grid:{color:palette.grid},ticks:{color:palette.text,font:{family:'Inter',size:12},callback:v=>number(v)}}}};
    const options={...base,...extra,plugins:{...base.plugins,...(extra.plugins || {})},scales:{...base.scales,...(extra.scales || {})}};
    if(key==='Pib'||key==='Nominal'){
      const nominal=key==='Nominal';
      options.plugins.datalabels={...base.plugins.datalabels,
        display:c=>{
          const value=c.dataset.data[c.dataIndex];if(value==null)return false;
          const width=c.chart.chartArea?.width || c.chart.width || 600;
          const spacing=key==='Pib'&&state.pib==='per_capita'?78:54;
          const slots=Math.max(3,Math.floor(width/spacing));
          const step=Math.max(1,Math.ceil((labels.length-1)/Math.max(1,slots-1)));
          const peak=nominal&&value===Math.max(...c.dataset.data.filter(v=>v!=null));
          return c.dataIndex===0||c.dataIndex===labels.length-1||c.dataIndex%step===0||(nominal&&value<0)||peak;
        },
        anchor:c=>nominal&&c.dataset.data[c.dataIndex]<0?'start':'end',
        align:c=>nominal&&c.dataset.data[c.dataIndex]<0?'bottom':'top',
        offset:6,
        clip:false,
        font:c=>({family:'Inter',size:c.chart.width<420?10:11,weight:'600'}),
        formatter:v=>nominal?signed(v,1)+'%':money(v,state.pib==='per_capita'?0:1)
      };
      if(nominal){
        const values=datasets[0].data.filter(v=>v!=null);
        options.layout={padding:{top:24,right:34,bottom:12,left:8}};
        options.scales.y={...options.scales.y,suggestedMin:Math.min(0,Math.floor(Math.min(...values)/5)*5-5),suggestedMax:Math.ceil(Math.max(...values)/5)*5+5};
      }
    }
    for(const axis of Object.values(options.scales)){axis.ticks={...axis.ticks,color:palette.text,font:{family:'Inter',size:12,...axis.ticks?.font}};if(axis.title)axis.title={...axis.title,color:palette.text,font:{family:'Inter',size:12,...axis.title.font}};if(axis.grid?.display!==false&&!axis.grid?.color)axis.grid={...axis.grid,color:palette.grid};}
    options.plugins.tooltip={...options.plugins.tooltip,backgroundColor:palette.ink,titleColor:palette.surface,bodyColor:palette.surface,footerColor:palette.surface,borderColor:palette.grid,borderWidth:1};
    const chart=new Chart(canvas.getContext('2d'),{type,data:{labels,datasets},options});charts.set(key,chart);
    visibleTable(key,canvas,labels,datasets);
    const describedBy=canvas.getAttribute?.('aria-describedby');
    if(describedBy)canvas.setAttribute('aria-label',document.getElementById(describedBy)?.textContent || key);
  }
  function visibleTable(key,canvas,labels,datasets) {
    const card=canvas.closest('article'); if(!card)return;
    let detail=card.querySelector('[data-eco-table]');
    if(!detail){detail=document.createElement('details');detail.dataset.ecoTable=key;detail.className='eco-alternative';card.appendChild(detail);}
    const decimals=['Estoque','Saldo','Movimentacao','Anual','Empresas'].includes(key)?0:2;
    const m=metadata(key);
    detail.innerHTML='<summary>Tabela alternativa</summary><div class="eco-table-scroll" tabindex="0" role="region" aria-label="Tabela de '+esc(m?.descriptor[0] || key)+'"><table><caption>'+esc(m?m.descriptor[0]+' · '+m.descriptor[2]+' · '+m.descriptor[3]:'Dados do recorte exibido')+'</caption><thead><tr><th scope="col">Período / categoria</th>'+datasets.map(d=>'<th scope="col">'+esc(d.label)+'</th>').join('')+'</tr></thead><tbody>'+labels.map((label,i)=>'<tr><th scope="row">'+esc(Array.isArray(label)?label.join(' '):label)+'</th>'+datasets.map(d=>'<td>'+esc(number(d.data[i],decimals))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  const line = (label,data,color=palette.primary) => ({label,data,borderColor:color,backgroundColor:palette.light,pointBackgroundColor:color,pointBorderColor:color,borderWidth:2.5,pointRadius:data.length>30?0:3,pointHoverRadius:5,tension:0,spanGaps:false,fill:false});
  const bars = (label,data,color=palette.primary) => ({label,data,backgroundColor:color,borderRadius:4,maxBarThickness:32});
  const divergent = data => ({...bars('Saldo',data),backgroundColor:data.map(v=>v==null?palette.grid:v>=0?palette.primary:palette.dark)});
  const zeroScale = () => ({beginAtZero:true,grid:{color:c=>c.tick.value===0?palette.text:palette.grid,lineWidth:c=>c.tick.value===0?1.5:1},ticks:{callback:v=>signed(v),color:palette.text}});
  function renderPib() {
    const rows=model.pib,pc=state.pib==='per_capita',values=rows.map(r=>pc?r.pib_per_capita??null:r.pib_milhoes==null?null:r.pib_milhoes/1000);
    document.querySelectorAll('[data-eco-pib]').forEach(btn=>{const active=btn.dataset.ecoPib===state.pib;btn.setAttribute('aria-pressed',String(active));btn.classList.toggle('bg-brand-950',active);btn.classList.toggle('text-white',active);});
    renderChart('Pib','line',rows.map(r=>String(r.ano)),[line(pc?'PIB per capita (R$/habitante)':'PIB municipal (R$ bilhões)',values)],
      {scales:{y:{title:{display:true,text:pc?'R$/habitante':'R$ bilhões'},ticks:{callback:v=>pc?money(v,0):number(v,1)}}}},
      {title:items=>String(rows[items[0].dataIndex].ano),label:c=>pc?`PIB per capita: ${money(values[c.dataIndex])} / habitante`:`PIB municipal: ${money(values[c.dataIndex])} bilhões`,
        afterLabel:c=>pc?'Valor publicado pelo IBGE':`Valor de origem: ${money(rows[c.dataIndex].pib_milhoes,6)} milhões`,footer:()=>['IBGE — PIB dos Municípios','Preços correntes; 2022/2023 sujeitos a revisão.']});
    const last=rows.at(-1);text('eco-insight-Pib',last?`Em ${last.ano}, ${pc?'o PIB per capita foi '+money(last.pib_per_capita)+' por habitante':'o PIB municipal atingiu '+money(last.pib_milhoes==null?null:last.pib_milhoes/1000,1)+' bilhões'}. Valores nominais, sem deflação.`:'Série não disponível.');
    sourceStrip('Pib','IBGE — PIB dos Municípios',rows.length?`${rows[0].ano}–${last.ano}`:'sem período',sources().pib,false,sources().pibOld);
  }
  function nominalRows() {
    return model.pib.slice(1).map((r,i)=>{const prior=model.pib[i];return {ano:r.ano,current:r,prior,
      value:r.ano===prior.ano+1 && r.pib_milhoes!=null && prior.pib_milhoes!=null && prior.pib_milhoes!==0 ? (r.pib_milhoes/prior.pib_milhoes-1)*100 : null};});
  }
  function renderNominal() {
    const rows=nominalRows(),values=rows.map(r=>r.value);
    renderChart('Nominal','bar',rows.map(r=>String(r.ano)),[{...divergent(values),label:'Variação nominal (%)'}],{scales:{y:{...zeroScale(),title:{display:true,text:'Variação nominal (%)'},ticks:{callback:v=>signed(v,0)+'%'}}}},
      {title:items=>String(rows[items[0].dataIndex].ano),label:c=>'Variação nominal: '+signed(c.raw,2)+'%',afterLabel:c=>{const r=rows[c.dataIndex];return [`PIB: ${money(r.current.pib_milhoes/1000)} bilhões`,`PIB ${r.prior.ano}: ${money(r.prior.pib_milhoes/1000)} bilhões`];},footer:()=>['Calculado a partir de dados oficiais.','Não representa crescimento real.']});
    text('eco-insight-Nominal','Variação dos valores a preços correntes. Fórmula: ((PIB atual / PIB anterior) − 1) × 100; sem deflator.');
    sourceStrip('Nominal','IBGE — PIB dos Municípios',rows.length?`${rows[0].ano}–${rows.at(-1).ano}`:'sem período',sources().pib,true,sources().pibOld);
  }
  function comparable() {return model.pib.filter(r=>sectors.every(([key])=>share(r,key)!=null));}
  function renderComposition() {
    const rows=comparable();state.composition=select('eco-composition-year',rows.map(r=>({value:r.ano,label:String(r.ano)})),state.composition);
    const row=rows.find(r=>String(r.ano)===state.composition);
    const datasets=[{...bars('Participação no PIB (%)',sectors.map(([key])=>share(row,key))),backgroundColor:sectors.map(([key])=>sectorColor(key))}];
    const labels=[['Serviços, exceto','administração pública'],'Indústria',['Administração','pública'],'Agropecuária',['Impostos líquidos','de subsídios']];
    renderChart('Setores','bar',labels,datasets,{indexAxis:'y',layout:{padding:{top:8,right:48,bottom:4}},scales:{x:{min:0,max:100,title:{display:true,text:'Participação no PIB (%)'},ticks:{callback:v=>number(v)+'%'}},y:{grid:{display:false},ticks:{autoSkip:false,font:{family:'Inter',size:12}}}}},
      {title:()=>`PIB municipal · ${state.composition}`,label:c=>`${sectors[c.dataIndex][1]}: ${number(c.raw,2)}%`,afterLabel:c=>{const key=sectors[c.dataIndex][0];return `Componente: ${money(row?.components_mil_reais?.[key]==null?null:row.components_mil_reais[key]/1e6)} bilhões`;},footer:()=>['Calculado a partir de componentes oficiais.','Denominador: PIB; inclui impostos separados do VAB.']});
    text('eco-insight-Setores',row?`${row.ano}: serviços, exceto administração pública, representam ${number(share(row,'servicos'),1)}% do PIB; indústria, ${number(share(row,'industria'),1)}%.`:'Composição não disponível.');
    sourceStrip('Setores','IBGE — PIB dos Municípios',state.composition || 'sem período',sources().pib,true,sources().pibOld);
  }
  function renderStructure() {
    const rows=comparable();
    renderChart('Estrutura','line',rows.map(r=>String(r.ano)),sectors.map(([key,label],i)=>({...line(label,rows.map(r=>share(r,key)),sectorColor(key)),borderDash:[[],[7,3],[2,3],[8,3,2,3],[4,4]][i],pointStyle:['circle','rect','triangle','rectRot','crossRot'][i]})),
      {scales:{y:{min:0,title:{display:true,text:'Participação no PIB (%)'},ticks:{callback:v=>number(v)+'%'}}}},
      {title:items=>String(rows[items[0].dataIndex].ano),label:c=>`${c.dataset.label}: ${number(c.raw,2)}%`,footer:()=>['Calculado: componente / PIB × 100.','IBGE; sem abertura setorial em 2022/2023.']});
    text('eco-insight-Estrutura','Compare as participações ao longo do tempo. Ative ou desative componentes pela legenda. Abertura oficial disponível até 2021.');
    sourceStrip('Estrutura','IBGE — PIB dos Municípios',rows.length?`${rows[0].ano}–${rows.at(-1).ano}`:'sem período',sources().pib,true,sources().pibOld);
  }
  function renderStock() {
    const rows=model.monthly;
    renderChart('Estoque','line',rows.map(r=>competence(r.competencia)),[line('Estoque de vínculos formais',rows.map(r=>r.estoque??null),palette.dark)],
      {scales:{y:{title:{display:true,text:'Vínculos formais'},ticks:{callback:v=>number(v)}}}},
      {title:items=>competence(rows[items[0].dataIndex].competencia),label:c=>number(c.raw)+' vínculos formais',footer:()=>['MTE — Novo CAGED; edição ago/2026 com ajustes.','2026 parcial até agosto; dados sujeitos a revisão.']});
    const last=rows.at(-1);text('eco-insight-Estoque',last?`${competence(last.competencia)}: ${number(last.estoque)} vínculos formais. Estoque mensal publicado; não é fechamento anual de 2026.`:'Estoque não disponível.');
    sourceStrip('Estoque','Ministério do Trabalho e Emprego — Novo CAGED',rows.length?`${competence(rows[0].competencia)}–${competence(last.competencia)}`:'sem período',sources().caged);
  }
  function employmentTooltip(rows) {return {title:items=>competence(rows[items[0].dataIndex].competencia),label:c=>c.dataset.label+': '+signed(c.raw),
    afterBody:items=>{const r=rows[items[0].dataIndex];return [`Admissões: ${number(r.admissoes)}`,`Desligamentos: ${number(r.desligamentos)}`,`Saldo: ${signed(r.saldo)} vínculos líquidos`];},
    footer:()=>['MTE — Novo CAGED; edição ago/2026 com ajustes.','2026 parcial até agosto.']};}
  function renderSaldo() {
    state.saldoYear=select('eco-saldo-year',years(),state.saldoYear);
    const rows=model.monthly.filter(r=>String(r.ano)===state.saldoYear),values=rows.map(r=>r.saldo??null);
    renderChart('Saldo','bar',rows.map(r=>competence(r.competencia)),[{...divergent(values),label:'Saldo mensal (vínculos líquidos)'}],{scales:{y:zeroScale()}},employmentTooltip(rows));
    text('eco-insight-Saldo',rows.length?`${state.saldoYear}${rows.length<12?' parcial até '+monthNames[rows.at(-1).mes-1]:''}: ${signed(sum(rows,'saldo'))} vínculos líquidos nos ${rows.length} meses disponíveis. Valores positivos criam vínculos líquidos; negativos reduzem.`:'Saldo não disponível.');
    sourceStrip('Saldo','Ministério do Trabalho e Emprego — Novo CAGED',years().find(y=>String(y.value)===state.saldoYear)?.label || 'sem período',sources().caged);
  }
  function renderMovement() {
    state.movementYear=select('eco-movement-year',years(),state.movementYear);
    const rows=model.monthly.filter(r=>String(r.ano)===state.movementYear);
    renderChart('Movimentacao','bar',rows.map(r=>competence(r.competencia)),[bars('Admissões',rows.map(r=>r.admissoes??null),palette.primary),bars('Desligamentos',rows.map(r=>r.desligamentos??null),palette.secondary)],
      {scales:{y:{beginAtZero:true,title:{display:true,text:'Movimentações de vínculos'},ticks:{callback:v=>number(v)}}}},employmentTooltip(rows));
    text('eco-insight-Movimentacao','Admissões e desligamentos são movimentações, não pessoas únicas. Cada ano mostra apenas as competências publicadas.');
    sourceStrip('Movimentacao','Ministério do Trabalho e Emprego — Novo CAGED',years().find(y=>String(y.value)===state.movementYear)?.label || 'sem período',sources().caged);
  }
  function renderAnnual() {
    const rows=annual(),values=rows.map(r=>r.saldo);
    renderChart('Anual','bar',rows.map(r=>String(r.ano)+(r.parcial?'*':'')),[{...divergent(values),label:'Saldo anual (vínculos líquidos)',borderWidth:rows.map(r=>r.parcial?2:0),borderColor:palette.text}],{scales:{y:zeroScale()}},
      {title:items=>{const r=rows[items[0].dataIndex];return String(r.ano)+(r.parcial?' · parcial até '+monthNames[Number(r.competencia.slice(-2))-1]:' · ano completo');},label:c=>'Saldo: '+signed(c.raw),
        afterLabel:c=>{const r=rows[c.dataIndex];return [`Admissões: ${number(r.admissoes)}`,`Desligamentos: ${number(r.desligamentos)}`,`Estoque em ${competence(r.competencia)}: ${number(r.estoque)} vínculos`];},
        footer:items=>rows[items[0].dataIndex].status===DIRECT?'Saldo acumulado publicado pelo MTE.':'Calculado pela soma dos saldos mensais oficiais.'});
    const last=rows.at(-1);text('eco-insight-Anual',last?.parcial?`* ${last.ano} parcial até ${monthNames[Number(last.competencia.slice(-2))-1]}. ${last.months} meses; comparação com anos completos exige esse cuidado.`:'Anos completos publicados.');
    sourceStrip('Anual','Ministério do Trabalho e Emprego — Novo CAGED','2020–2026* · * parcial até agosto',sources().caged,true);
  }
  function cempreYears(ids) {return [...new Set(model.cempre.map(r=>r.ano))].sort((a,b)=>a-b).filter(y=>ids.every(id=>variable(id,y)?.value!=null));}
  function renderCompanies() {
    const ys=cempreYears(['367','706']);
    renderChart('Empresas','bar',ys.map(String),[bars('Empresas e outras organizações atuantes',ys.map(y=>variable('367',y).value),palette.primary),bars('Unidades locais',ys.map(y=>variable('706',y).value),palette.dark)],
      {scales:{y:{beginAtZero:true,title:{display:true,text:'Organizações / unidades locais'},ticks:{callback:v=>number(v)}}}},
      {title:items=>String(ys[items[0].dataIndex]),label:c=>c.dataset.label+': '+number(c.raw),footer:()=>['Organização: entidade empresarial ou outra organização atuante.','Unidade local: endereço de atuação dessa organização.','CEMPRE; não equivale a CNPJs ativos.']});
    const last=ys.at(-1);text('eco-insight-Empresas',last?`${last}: ${number(variable('367',last).value)} empresas e outras organizações atuantes e ${number(variable('706',last).value)} unidades locais. São conceitos distintos.`:'Tecido empresarial não disponível.');
    sourceStrip('Empresas','IBGE — CEMPRE',ys.length?`${ys[0]}–${last}`:'sem período',sources().cempre);
  }
  function renderSalary() {
    const id=state.salary==='sm'?'1606':'10143',ys=cempreYears([id]),values=ys.map(y=>variable(id,y).value),sm=id==='1606';
    document.querySelectorAll('[data-eco-salary]').forEach(btn=>{const active=btn.dataset.ecoSalary===state.salary;btn.setAttribute('aria-pressed',String(active));btn.classList.toggle('bg-brand-950',active);btn.classList.toggle('text-white',active);});
    renderChart('Remuneracao','line',ys.map(String),[line(sm?'Salário médio mensal (salários mínimos)':'Salário médio mensal (R$)',values,palette.primary)],
      {scales:{y:{title:{display:true,text:sm?'Salários mínimos':'R$ por mês'},ticks:{callback:v=>sm?number(v,1):money(v,0)}}}},
      {title:items=>String(ys[items[0].dataIndex]),label:c=>sm?number(c.raw,1)+' salários mínimos':money(c.raw)+' / mês',footer:()=>['IBGE — CEMPRE. Série com metodologia desde 2022.','Não representa salário de admissão do Novo CAGED.']});
    const last=ys.at(-1);text('eco-insight-Remuneracao',last?`${last}: salário médio mensal de ${sm?number(variable(id,last).value,1)+' salários mínimos':money(variable(id,last).value)} no CEMPRE. Não concatenado à série anterior a 2022.`:'Remuneração não disponível.');
    sourceStrip('Remuneracao','IBGE — CEMPRE',ys.length?`${ys[0]}–${last}`:'sem período',sources().cempre);
  }
  function kpis() {
    const pib=indicator('econ_pib_municipal_2023'),pc=indicator('econ_pib_per_capita'),stock=indicator('econ_caged_estoque_2026_08');
    const orgs=indicator('econ_cempre_organizacoes_2024'),locais=indicator('econ_cempre_unidades_locais_2024');
    const lastAnnual=annual().find(r=>r.ano===2026);
    // The accumulated saldo is present in the approved P1 series and is direct.
    const saldo=lastAnnual?.status===DIRECT && lastAnnual.evidence_id==='mte-202608-saldo-2026'?lastAnnual.saldo:null;
    text('hub-econ-pib-total',pib?money(pib.value/1000,1):'Dado não disponível');
    text('hub-econ-pib-pc',pc?money(pc.value):'Dado não disponível');
    text('hub-kpi-emprego',stock?number(stock.value):'Dado não disponível');
    text('hub-kpi-emprego-reference',stock?`${competence(stock.competencia)} · competência mensal`:'Estoque não disponível');
    text('hub-econ-saldo',signed(saldo));text('hub-econ-organizacoes',orgs?number(orgs.value):'Dado não disponível');text('hub-econ-locais',locais?number(locais.value):'Dado não disponível');
    const definitions=[['hub-econ-pib-total','IBGE · PIB dos Municípios',sources().pib],['hub-econ-pib-pc','IBGE · PIB dos Municípios',sources().pib],['hub-kpi-emprego','MTE · Novo CAGED',sources().caged],['hub-econ-saldo','MTE · Novo CAGED',sources().caged],['hub-econ-organizacoes','IBGE · CEMPRE',sources().cempre],['hub-econ-locais','IBGE · CEMPRE',sources().cempre]];
    for(const [id,label,url] of definitions){const card=document.getElementById(id)?.closest('article');if(!card)continue;let source=card.querySelector('.eco-kpi-source');if(!source){source=document.createElement('p');source.className='eco-kpi-source';card.appendChild(source);}source.innerHTML=url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`:esc(label);}
    const intro=document.querySelector('#hub-axis-container-economia > div > p');
    if(intro)intro.textContent='Quanto a cidade produz, quais atividades compõem sua economia e como evoluem os vínculos de trabalho formal. PIB per capita é produção por habitante; não é renda das famílias.';
  }
  function updateCards(gt,pkg) {if(pkg)model=makeModel(gt,pkg);if(model)kpis();}
  window.updateEconomiaVisualCards=updateCards;
  window.renderEconomiaVisual = function(gt,pkg) {
    model=makeModel(gt,pkg);kpis();renderPib();renderNominal();renderComposition();renderStructure();
    renderStock();renderSaldo();renderAnnual();renderSalary();
  };
  window.filterEconomiaVisual = function(key,value) {
    if(!model)return;
    const renderers={pib:renderPib,composition:renderComposition,saldoYear:renderSaldo,movementYear:renderMovement,salary:renderSalary};
    if(!(key in renderers))return;
    if(key==='pib' && !['total','per_capita'].includes(value))return;
    if(key==='salary' && !['reais','sm'].includes(value))return;
    if(['saldoYear','movementYear'].includes(key) && !years().some(y=>String(y.value)===String(value)))return;
    if(key==='composition' && !comparable().some(r=>String(r.ano)===String(value)))return;
    state[key]=String(value);renderers[key]();
  };
  function metadata(key) {
    const source=sources(),first=model.pib[0]?.ano,last=model.pib.at(-1)?.ano;
    const group=['Pib','Nominal','Setores','Estrutura'].includes(key)?'pib':['Empresas','Remuneracao'].includes(key)?'cempre':'caged';
    const variableId=key==='Remuneracao'?(state.salary==='sm'?'1606':'10143'):null;
    const descriptor={
      Pib:[state.pib==='per_capita'?'Como evoluiu o PIB por habitante?':'Como evoluiu o PIB municipal?',state.pib==='per_capita'?'Produção dividida pela população de referência; não representa renda familiar.':'Valor da produção municipal a preços correntes; sem deflação.',`${first}–${last}`,state.pib==='per_capita'?'R$/habitante':'R$ bilhões',state.pib==='per_capita'?'Valor per capita publicado pelo IBGE; não equivale à renda disponível.':'Conversão do PIB: R$ milhões / 1000 = R$ bilhões.',DIRECT],
      Nominal:['Variação Nominal Anual do PIB','Variação dos valores correntes entre anos consecutivos.',`${first+1}–${last}`,'%','((PIB atual / PIB anterior) − 1) × 100. Componentes: dois PIBs anuais oficiais; sem deflator.',DERIVED],
      Setores:['Composição do PIB Municipal','Participação dos cinco componentes separados no PIB.',state.composition,'% do PIB','100 × componente em R$ mil / (PIB em R$ milhões × 1000). Administração e impostos separados.',DERIVED],
      Estrutura:['Transformação da Estrutura Econômica','Evolução da participação de cada componente no PIB.','2002–2021','% do PIB','100 × componente / PIB, ambos na mesma unidade.',DERIVED],
      Estoque:['Evolução do Emprego Formal','Estoque mensal oficial de vínculos celetistas, não pessoas únicas.','jan/2020–ago/2026','vínculos','Estoque diretamente publicado, não reconstruído por acumulação de saldos.',DIRECT],
      Saldo:['Saldo Mensal de Empregos','Admissões menos desligamentos na competência mensal.',years().find(y=>String(y.value)===state.saldoYear)?.label,'vínculos líquidos','Saldo mensal diretamente publicado pelo MTE; admissões/desligamentos disponíveis.',DIRECT],
      Movimentacao:['Movimentação do Mercado de Trabalho','Admissões e desligamentos por competência; movimentações de vínculos.',years().find(y=>String(y.value)===state.movementYear)?.label,'movimentações','Duas variáveis diretamente publicadas; não contar como trabalhadores únicos.',DIRECT],
      Anual:['Saldo de Empregos por Ano','Saldo anual; admissões, desligamentos e estoque da última competência no tooltip.','2020–2026* · * parcial até agosto','vínculos líquidos','Soma dos saldos dos 12 meses em 2020–2025. Acumulado janeiro–agosto/2026 diretamente publicado. Admissões/desligamentos anuais somados; estoque obtido da última competência oficial.',DERIVED],
      Empresas:['Evolução do Tecido Empresarial','Empresas e outras organizações atuantes são entidades; unidades locais são seus endereços de atuação. Uma organização pode possuir várias unidades locais.','2022–2024','organizações / unidades locais','SIDRA 9510, CNAE Total 12762[117897], variáveis 367 e 706. Não equivale a CNPJs ativos nem distribuição MEI/ME/EPP.',DIRECT],
      Remuneracao:['Qual é o salário médio no CEMPRE?','Média mensal dos assalariados das unidades locais; valores nominais.','2022–2024',state.salary==='sm'?'salários mínimos':'R$/mês',`SIDRA 9510, CNAE Total 12762[117897], variável ${variableId}; valores diretamente publicados.`,DIRECT]
    }[key];
    if(!descriptor)return null;
    const ind=group==='caged'?indicator('econ_caged_estoque_2026_08'):group==='cempre'?indicator('econ_cempre_unidades_locais_2024'):indicator('econ_pib_municipal_2023');
    return {descriptor,group,url:source[group],agency:group==='caged'?'Ministério do Trabalho e Emprego':'IBGE',
      system:group==='caged'?'Novo CAGED — Tabela 8.1, edição agosto/2026':group==='cempre'?'CEMPRE — SIDRA 9510':'PIB dos Municípios — publicação 2022–2023',
      date:ind?.evidencia?.data_consulta || null,
      limitation:group==='caged'?'Novo CAGED desde 2020; não concatenado à RAIS/CAGED antigo. Revisões retrospectivas incorporadas até a edição auditada agosto/2026. Edição dezembro/2024 preservada como evidência; valores históricos podem mudar entre publicações. 2026 parcial até agosto.':group==='cempre'?'Quebra metodológica em 2022; não concatenar à série anterior. Organizações e unidades locais não são CNPJs ativos. Valores em reais são nominais.':'Preços correntes, sem deflação. 2022/2023 sujeitos a revisão e sem abertura setorial. Per capita: estimativas até 2021; Censo em 2022/2023.'};
  }
  window.openEconomiaVisualMetadata=function(key) {
    if(!model)return;const m=metadata(key);if(!m)return;
    // Reuses the native drawer, then replaces only this economy view's content.
    window.openIndicatorMetadata(m.group==='caged'?'econ_caged_estoque_2026_08':m.group==='cempre'?'econ_cempre_unidades_locais_2024':'econ_pib_municipal_2023');
    const [title,definition,period,unit,formula,status]=m.descriptor;
    text('drawer-indicator-name',title);text('drawer-audit-status',status===DERIVED?'Calculado a partir de fontes oficiais':'Dados oficiais aprovados na P1');
    text('drawer-val',unit);text('drawer-source',m.agency);text('drawer-system',m.system);text('drawer-year',period);text('drawer-freq',m.group==='caged' && key!=='Anual'?'Mensal':'Anual');
    text('drawer-methodology',`${definition}\nTerritório: São José dos Campos, SP · IBGE 3549904${m.group==='caged'?' · código MTE 354990':''}.\n${formula}\n${m.limitation}`);
    text('drawer-evidencia-data',m.date || 'Não disponível');text('drawer-evidencia-tool','Extração oficial preservada na P1');
    text('drawer-evidencia-trecho',`${definition}\n${formula}\nStatus: ${status}`);
    const link=document.getElementById('drawer-evidencia-url');if(link && m.url){link.href=m.url;link.textContent='Consultar fonte oficial ↗';link.rel='noopener noreferrer';}
    const official=document.getElementById('drawer-url-link');if(official && m.url){official.href=m.url;official.rel='noopener noreferrer';}
    text('drawer-context-warning-text',m.limitation);
  };
  window.getEconomiaVisualExport=function() {
    if(!model)return [];
    const result=[],src=sources();
    const add=(id,name,period,value,unit,status,group,evidence,formula=null,partial=false)=>{
      const sourceKey=group==='pib' && Number(period)<2010?'pibOld':group;
      result.push({id,nome:name,eixo:'economia',valor:value??null,unidade:unit,competencia:String(period),status_declarado:value==null?'NAO_DISPONIVEL':status,status_pacote:model.pkg.audit_status,fonte:group==='caged'?'Ministério do Trabalho e Emprego':group==='cempre'?'IBGE — CEMPRE':'IBGE — PIB dos Municípios',url:src[sourceKey],data_consulta:APPROVED_SOURCES[sourceKey]?.accessed_at || null,versao:model.pkg.dataset_version,evidencia:{ids:evidence,formula,parcial:partial,...(id==='eco_variacao_nominal' && Number(period)===2010?{component_urls:[src.pibOld,src.pib]}:{})},consistencia_local:null});
    };
    for(const r of model.pib){
      add('eco_serie_pib_total','PIB municipal',r.ano,r.pib_milhoes,'R$ milhões',DIRECT,'pib',[r.evidence_ids.pib_mil_reais],'R$ mil / 1000');
      add('eco_serie_pib_pc','PIB per capita',r.ano,r.pib_per_capita,'R$/habitante',DIRECT,'pib',[r.evidence_ids.pib_per_capita]);
      for(const [key,label] of sectors)if(r.components_mil_reais[key]!=null)add('eco_participacao_'+key,label+' / PIB',r.ano,share(r,key),'%',DERIVED,'pib',[r.evidence_ids[key],r.evidence_ids.pib_mil_reais],'100 × componente / PIB');
    }
    for(const r of nominalRows())add('eco_variacao_nominal','Variação nominal anual do PIB',r.ano,r.value,'%',DERIVED,'pib',[r.current.evidence_ids.pib_mil_reais,r.prior.evidence_ids.pib_mil_reais],'((PIB atual / PIB anterior) − 1) × 100');
    for(const r of model.monthly)for(const metric of ['estoque','admissoes','desligamentos','saldo'])add('eco_caged_'+metric,metric,r.competencia,r[metric],metric==='estoque'?'vínculos':metric==='saldo'?'vínculos líquidos':'movimentações',DIRECT,'caged',[r.evidence_ids[metric]],null,r.ano===2026);
    for(const r of annual())for(const metric of ['saldo','admissoes','desligamentos','estoque'])add('eco_anual_'+metric,metric+' anual',r.ano,r[metric],metric==='estoque'?'vínculos':metric==='saldo'?'vínculos líquidos':'movimentações',metric==='estoque'?DIRECT:metric==='saldo'?r.status:DERIVED,'caged',metric==='estoque'?[r.rows.at(-1).evidence_ids.estoque]:metric==='saldo' && r.status===DIRECT?[r.evidence_id]:r.rows.map(m=>m.evidence_ids[metric]),metric==='estoque'?'estoque publicado na última competência do ano':metric==='saldo' && r.status===DIRECT?null:'soma das competências disponíveis; não completar meses faltantes',r.parcial);
    for(const r of model.cempre)add('eco_cempre_'+r.variable_id,{'367':'Empresas e outras organizações atuantes','706':'Unidades locais','10143':'Salário médio mensal em reais','1606':'Salário médio mensal em salários mínimos'}[r.variable_id],r.ano,r.value,{'367':'organizações','706':'unidades locais','10143':'R$/mês','1606':'salários mínimos'}[r.variable_id],DIRECT,'cempre',[r.evidence_id]);
    return result;
  };
})();

(function(global){'use strict';
const URL='public-data/economia/apresentacao.v1.json', HASH='273ada1dea1434ead9ed45050bdaa15eda17fbe0362d0eb46d81eb653fb5b994';let promise=null,contract=null;
async function verify(text){const bytes=new TextEncoder().encode(text);const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');if(hash!==HASH)throw Error('Integridade do recorte Economia');const d=JSON.parse(text);if(d.municipio!=='3549904')throw Error('Território incorreto');return d;}
async function load(){const key='radar:economia:'+HASH;let text;try{const r=await fetch(URL,{cache:'no-cache'});if(!r.ok)throw Error('HTTP '+r.status);text=await r.text();const d=await verify(text);try{localStorage.setItem(key,text);}catch{}return d;}catch(e){try{text=localStorage.getItem(key);}catch{}if(text)return verify(text);throw e;}}
async function mount(container){if(!container)return;if(!promise)promise=load().catch(e=>{promise=null;throw e;});try{contract=await promise;global.renderEconomiaVisual(contract.groundTruth,contract);container.dataset.contractHash=HASH;container.dataset.ready='true';container.querySelectorAll('article canvas').forEach(canvas=>{const card=canvas.closest('article');if(!card.querySelector('.eco-method')){const d=document.createElement('details');d.className='eco-method';const key=canvas.id.replace('hubChartEconomia','');d.innerHTML='<summary>Como interpretar</summary><p>'+({Pib:'PIB a preços correntes. Valores nominais não representam crescimento real.',Nominal:'Variação percentual nominal entre dois anos consecutivos, sem deflator.',Setores:'Componentes mutuamente separados, incluindo impostos. Sem abertura setorial em 2022 e 2023.',Estrutura:'Participação dos componentes no PIB; série termina em 2021.',Estoque:'Vínculos celetistas, não pessoas únicas. Novo CAGED desde 2020.',Saldo:'Admissões menos desligamentos. Edição agosto de 2026 incorpora revisões.',Movimentacao:'Movimentações de vínculos. Uma pessoa pode ter mais de uma movimentação.',Anual:'2026 é parcial: janeiro a agosto. Não comparar como ano completo.',Empresas:'Organizações e unidades locais são conceitos distintos; não são CNPJs ativos.',Remuneracao:'Salário médio do CEMPRE. Quebra metodológica em 2022.'}[key]||'Consulte a ficha técnica para universo e unidade.')+'</p>';card.appendChild(d);}});}catch(e){container.dataset.ready='false';let msg=container.querySelector('.eco-load-error');if(!msg){msg=document.createElement('p');msg.className='eco-load-error';msg.setAttribute('role','status');container.prepend(msg);}msg.textContent='O recorte de Economia não pôde ser verificado. Tente novamente.';}}
const approvedCards=global.updateEconomiaVisualCards;global.updateEconomiaVisualCards=function(){if(contract)approvedCards(contract.groundTruth,contract);};
global.RadarEconomiaVisual={mount,verify,fingerprint:HASH,getContract:()=>contract};
})(window);

