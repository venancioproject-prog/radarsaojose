/* P2.1: apresentação de evidências já aprovadas; nenhuma coleta ou mutação dos dados. */
(function(){
  'use strict';
  let model=null;
  const charts=new Map(),views=new Map();
  const state={budgetStage:'empenhada',executionYear:2025,functionYear:2025,functionStage:'liquidada',trendStage:'liquidada',functions:['10','12','15','04'],revenueYear:2025,taxGroup:'tributos',investmentStage:'liquidada',debtMetric:'DividaConsolidada',cashMetric:'caixa'};
  const p=window.RadarDataVizPalette.forAxis('financas');
  const stage={empenhada:'Despesas Empenhadas',liquidada:'Despesas Liquidadas',paga:'Despesas Pagas'};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=(v,d=2)=>v==null?'Dado não disponível':Number(v).toLocaleString('pt-BR',{maximumFractionDigits:d,minimumFractionDigits:d});
  const money=v=>v==null?'Dado não disponível':(v<0?'− ':'')+'R$ '+num(Math.abs(v)/(Math.abs(v)>=1e9?1e9:1e6))+(Math.abs(v)>=1e9?' bi':' mi');
  const text=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  const value=r=>r?.value??null;
  const source=r=>model.fin.source_catalog[model.fin.series_sources[r?.evidence_id] || model.fin.series_sources[r?.component_evidence_ids?.[0]]];
  const annual=()=>model.fin.series_orcamentarias_anuais.filter(r=>!r.parcial && r.ano<=2025);
  // Each family/year is indexed once for each immutable package identity.
  function rows(f,y){return y==null?model.families[f]||[]:model.index.get(f+'|'+y)||[];}
  function find(f,y,code,st,period){return rows(f,y).find(r=>r.classification===code && (!st||r.stage===st) && (period==null||r.period_number===period));}
  function annualPoint(r,k){return {value:r[k]??null,evidence_id:r.evidence_ids[k],component_evidence_ids:k==='resultado_orcamentario'?[r.evidence_ids.receita_realizada,r.evidence_ids.despesa_empenhada]:[],exercise:r.ano,competence:r.ano+'-RREO-B'+r.periodo,period_number:r.periodo,stage:k,unit:'BRL',partial:r.parcial,status:k==='resultado_orcamentario'?'CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS':'CONFIRMADO_FONTE_OFICIAL',scope:r.abrangencia,statement:'RREO-Anexo 01',classification:k};}
  function dataset(label,points,i=0){return {label,data:points.map(value),_points:points,borderColor:p.series(i),backgroundColor:p.series(i),borderWidth:2,pointRadius:3,pointStyle:['circle','rect','triangle','crossRot','rectRot'][i%5],borderDash:[[],[5,3],[2,3],[8,3,2,3],[9,4]][i%5],tension:0,spanGaps:false};}
  function chart(key,type,labels,sets,{horizontal=false,percent=false,calculated=false,note='',formula='',scale=1e6}={}){
    const canvas=document.getElementById('hubChartFinancas'+key);if(!canvas||!window.Chart)return;
    charts.get(key)?.destroy();charts.delete(key);
    const points=sets.flatMap(d=>d._points||[]).filter(Boolean),last=points.at(-1),src=source(last);
    views.set(key,{points,sets,labels,percent,calculated,note,formula});
    const footer=document.getElementById('fin-source-'+key);
    const opened=[...(footer?.querySelectorAll?.('details')||[])].map(e=>e.open);
    if(footer)footer.innerHTML=`<span>${calculated?'Cálculo: Radar São José a partir de dados oficiais. ':''}Fonte: Tesouro Nacional · SICONFI · ${esc(last?.statement)} · ${esc(last?.competence)} · acesso ${esc(src?.accessed_at)}</span> `+(src?.url?`<a class="font-bold text-blue-700 hover:underline" href="${esc(src.url)}" target="_blank" rel="noopener noreferrer">Consultar fonte oficial ↗</a>`:'<span>Fonte não disponível neste recorte.</span>');
    canvas.setAttribute?.('aria-label',key+' · '+labels.join(', ')+' · '+(percent?'percentual':'reais correntes'));
    const lastValues=sets.map(d=>`${d.label}: ${percent?num(d.data.at(-1),2)+'%':money(d.data.at(-1))}`).join(' · ');
    updateTable(key,sets,labels,note,formula);
    footer?.querySelectorAll?.('details').forEach((e,i)=>e.open=!!opened[i]);
    text('fin-summary-'+key,key==='Funcoes'?`${state.functionYear} · ${stage[state.functionStage]} · ${points.length} funções de governo. Valores individuais por função; não representam um total somado.`:`${note} ${lastValues}. ${points.some(r=>r.value==null)?'Há valores suspensos ou ausentes; lacunas não preenchidas.':''}`);
    const numericAxis={beginAtZero:type==='bar',title:{display:true,color:p.text,text:percent?'%':scale===1e9?'R$ bilhões correntes':'R$ milhões correntes'},ticks:{color:p.text,callback:v=>num(percent?v:v/scale,1)},grid:{color:ctx=>ctx.tick.value===0?p.ink:p.grid}};
    charts.set(key,new Chart(canvas,{type,data:{labels,datasets:sets},options:{responsive:true,maintainAspectRatio:false,animation:false,indexAxis:horizontal?'y':'x',interaction:{mode:'index',intersect:false},plugins:{datalabels:{display:ctx=>ctx.chart.config.type==='bar'&&ctx.dataset.data.length<=5,color:p.text,anchor:'end',align:'end',font:{size:12},formatter:v=>v==null?'':num(percent?v:v/scale,1)},legend:{display:sets.length>1,position:'bottom',labels:{color:p.text,usePointStyle:true,boxWidth:10,font:{size:12,family:'Montserrat'}}},tooltip:{backgroundColor:p.surface,titleColor:p.text,bodyColor:p.text,borderColor:p.grid,borderWidth:1,callbacks:{label:c=>{const p=c.dataset._points?.[c.dataIndex];return `${c.dataset.label}: ${p?.value==null?'Valor suspenso ou ausente':percent?num(p.value)+'%':'R$ '+num(p.value)} · ${p?.competence??labels[c.dataIndex]} · ${p?.stage??''} · ${p?.status??''}${p?.partial?' · parcial':''}`;},afterBody:items=>{if(!['Orcamento','Resultado'].includes(key))return [];const r=annual()[items[0]?.dataIndex];return r?[`Receita realizada: R$ ${num(r.receita_realizada)}`,`Despesa ${key==='Resultado'?'empenhada':state.budgetStage}: R$ ${num(r['despesa_'+(key==='Resultado'?'empenhada':state.budgetStage)])}`,`${key==='Resultado'||state.budgetStage==='empenhada'?'Resultado orçamentário calculado':'Diferença entre os estágios selecionados'}: R$ ${num(key==='Resultado'?r.resultado_orcamentario:r.receita_realizada-r['despesa_'+state.budgetStage])}`]:[];}}}},scales:horizontal?{x:numericAxis,y:{grid:{display:false},ticks:{color:p.text,font:{size:12}}}}:{x:{grid:{display:false},ticks:{color:p.text,maxRotation:0,autoSkip:true,maxTicksLimit:8,font:{size:12}}},y:numericAxis}}}));
  }

  function updateTable(key,sets,labels,note,formula){
    const footer=document.getElementById('fin-source-'+key);if(!footer)return;
    const heads=sets.map(d=>'<th scope="col">'+esc(d.label)+'</th>').join('');
    const body=labels.map((l,i)=>'<tr><th scope="row">'+esc(l)+'</th>'+sets.map(d=>'<td>'+num(d.data[i],2)+'</td>').join('')+'</tr>').join('');
    footer.insertAdjacentHTML('beforeend','<details class="fin-detail"><summary>Tabela alternativa e ficha técnica</summary><p>'+esc(note)+' '+esc(formula)+' Valores originais; município 3549904. BRL corrente, exceto gráficos percentuais. RREO consolidado, DCA por classificação e RGF Executivo mantêm seus universos próprios.</p><div class="fin-table-scroll"><table><caption>'+esc(key)+' · recorte visível</caption><thead><tr><th scope="col">Competência / categoria</th>'+heads+'</tr></thead><tbody>'+body+'</tbody></table></div></details>');
  }

  function render(key){
    const a=annual(),years=Array.from({length:13},(_,i)=>2013+i);
    if(key==='Orcamento')chart(key,'line',a.map(r=>r.ano),[dataset('Receita realizada',a.map(r=>annualPoint(r,'receita_realizada'))),dataset('Despesa '+state.budgetStage,a.map(r=>annualPoint(r,'despesa_'+state.budgetStage)),1)],{scale:1e9});
    if(key==='Resultado'){const d=dataset('Resultado orçamentário',a.map(r=>annualPoint(r,'resultado_orcamentario')));d.backgroundColor=d.data.map(v=>v<0?p.negative:p.primary);chart(key,'bar',a.map(r=>r.ano),[d],{calculated:true,formula:'Receita realizada − despesa empenhada; componentes evidence_ids de cada exercício.'});}
    if(key==='Execucao'){
      const r=a.find(r=>r.ano===Number(state.executionYear));if(!r)return;
      const keys=['dotacao_atualizada','despesa_empenhada','despesa_liquidada','despesa_paga'];
      const points=keys.map(k=>({...annualPoint(r,k),absolute:r[k],value:r[k]==null||r.dotacao_atualizada==null?null:100*r[k]/r.dotacao_atualizada}));
      chart(key,'bar',['Dotação atualizada','Empenhado','Liquidado','Pago'],[dataset('Percentual da dotação',points)],{horizontal:true,percent:true,calculated:true,formula:'100 × estágio / dotação atualizada',note:keys.map((k,i)=>['Dotação atualizada','Despesa empenhada','Despesa liquidada','Despesa paga'][i]+': '+money(r[k])).join(' · ')});
      const c=charts.get(key);c.options.plugins.tooltip.callbacks.afterLabel=ctx=>'Valor absoluto: R$ '+num(points[ctx.dataIndex].absolute);
    }
    if(key==='Funcoes'){
      const p=rows('despesa_dca_funcao',state.functionYear).filter(r=>r.stage===stage[state.functionStage] && /^\d{2} - /.test(r.label)).sort((a,b)=>(b.value??-Infinity)-(a.value??-Infinity));
      const area=document.getElementById('fin-area-'+key);if(area){area.style.height=Math.max(220,p.length*27)+'px';area.parentElement.style.overflow='hidden';}
      chart(key,'bar',p.map(r=>r.label.slice(5)),[dataset(stage[state.functionStage],p)],{horizontal:true});
      text('fin-health-functions',['10','12'].map(code=>{const r=p.find(r=>r.label.startsWith(code+' - '));return `Função ${code==='10'?'Saúde':'Educação'} · ${state.functionYear} · ${stage[state.functionStage]}: ${money(value(r))}`;}).join(' · ')+'. Valores absolutos das funções; não são ASPS/MDE. Altere ano e estágio no bloco de funções.');
    }
    if(key==='EvolucaoFuncoes')chart(key,'line',years,state.functions.map((code,i)=>Object.assign(dataset(model.functionLabels.get(code),years.map(y=>rows('despesa_dca_funcao',y).find(r=>r.label.startsWith(code+' - ') && r.stage===stage[state.trendStage])),Number(code)),{borderColor:p.category('funcao:'+code),backgroundColor:p.category('funcao:'+code)})),{note:'Classificação funcional pelo código oficial de dois dígitos; sem interpolação.'});
    if(key==='Receitas'){
      const p=['RO1.0.0.0.00.0.0','RO2.0.0.0.00.0.0'].map(c=>find('receita_dca_natureza',state.revenueYear,c,'Receitas Brutas Realizadas'));
      chart(key,'bar',['Receitas correntes','Receitas de capital'],[dataset('Receitas brutas realizadas',p)],{horizontal:true,note:'Dois grupos do mesmo nível. Exclui receitas intraorçamentárias e não deduz FUNDEB/outras deduções.'});
    }
    if(key==='Tributos'){
      const codes=state.taxGroup==='tributos'?[['IPTU','RO1.1.1.2.50.0.0'],['ISS','RO1.1.1.4.51.1.0'],['ITBI','RO1.1.1.2.53.0.0'],['IRRF','RO1.1.1.3.03.0.0'],['Taxas','RO1.1.2.0.00.0.0']]:[['FPM','RO1.7.1.1.51.0.0'],['ICMS','RO1.7.2.1.50.0.0'],['IPVA','RO1.7.2.1.51.0.0'],['SUS federal corrente','RO1.7.1.3.00.0.0'],['FUNDEB','RO1.7.5.1.00.0.0']];
      chart(key,'bar',[2022,2023,2024,2025],codes.map(([l,c],i)=>dataset(l,[2022,2023,2024,2025].map(y=>find('receita_dca_natureza',y,c,'Receitas Brutas Realizadas')),i)),{note:'Exploração das contas selecionadas; não totalizar. SUS: somente transferências federais correntes; FUNDEB: conta própria, sem complemento da União.'});
    }
    if(key==='Constitucionais'){
      const yy=years.filter(y=>y>=2022),codes=[['ASPS','AplicacaoTotalDasDespesasComAcoesEServicosPublicosDeSaude'],['MDE','MinimoAnualDasReceitasDeImpostosNaManutencaoEDesenvolvimentoDoEnsinoDemonstrativoSimplificado']];
      const sets=codes.flatMap(([l,c],i)=>['% Aplicado Até o Bimestre','% Mínimo a Aplicar no Exercício'].map((s,j)=>{const d=dataset(l+(j?' · mínimo publicado':''),yy.map(y=>find('resumo_rreo',y,c,s,6)),i);if(j)d.borderDash=[5,5];return d;}));
      chart(key,'line',yy,sets,{percent:true,note:'2022–2025: recorte anual pós-mudanças do FUNDEB/demonstrativo. Os períodos anteriores não são concatenados artificialmente.'});
    }
    if(key==='Investimentos')chart(key,'line',years,[dataset('Investimentos · '+stage[state.investmentStage],years.map(y=>find('despesa_dca_natureza',y,'DO4.4.00.00.00.00',stage[state.investmentStage])))],{note:'Conta GND 4 oficial; DCA, sem deflator.'});
    if(key==='Pessoal'){
      const pp=rows('pessoal_rgf').filter(r=>r.classification==='DespesaComPessoalTotal' && r.stage==='% sobre a RCL Ajustada' && r.exercise<=2025).sort((a,b)=>a.exercise-b.exercise||a.period_number-b.period_number);
      const codes=[['DTP/RCL ajustada','DespesaComPessoalTotal'],['Alerta','LimiteDeAlertaDespesaComPessoalTotal'],['Prudencial','LimitePrudencialDespesaComPessoalTotal'],['Máximo','LimiteMaximoDespesaComPessoalTotal']];
      chart(key,'line',pp.map(r=>r.competence),codes.map(([l,c],i)=>dataset(l,pp.map(r=>find('pessoal_rgf',r.exercise,c,'% sobre a RCL Ajustada',r.period_number)),i)),{percent:true,note:'Somente colunas com RCL ajustada. 2025 Q3: 26,99% publicado; valor absoluto da DTP permanece null por divergência. Sem reconstrução.'});
    }
    if(key==='Divida'){
      const p=rows('divida_rgf').filter(r=>r.classification===state.debtMetric && r.exercise<=2025 && r.stage===`Até o ${r.period_number}º Quadrimestre`).sort((a,b)=>a.exercise-b.exercise||a.period_number-b.period_number);
      chart(key,'line',p.map(r=>r.competence),[dataset(state.debtMetric,p)],{percent:state.debtMetric==='PercentualDaDCLSobreARCL',note:'2025 Q3: Valor suspenso: divergência entre versões oficiais consultadas. Linha interrompida nessa competência.'});
    }
    if(key==='Caixa'){
      const cash=state.cashMetric==='caixa',yy=years.filter(y=>y>=2017),codes=cash?[['Caixa bruto','DisponibilidadeDeCaixaBruta'],['Caixa líquido','DisponibilidadeDeCaixaLiquida']]:[['RP processados','RestosAPagarProcessadosDemonstrativoSimplificado'],['RP não processados','RestosAPagarNaoProcessadosDemonstrativoSimplificado']];
      chart(key,'bar',yy,codes.map(([l,c],i)=>dataset(l,yy.map(y=>find(cash?'caixa_restos_rgf':'resumo_rreo',y,c,cash?null:state.cashMetric,cash?3:6)),i)),{note:cash?'RGF 05 · Executivo · caixa bruto e líquido são medidas alternativas; não somar.':'RREO 14 · consolidado · '+state.cashMetric+' até o 6º bimestre; não comparar com caixa do Executivo.'});
    }
  }
  const keys=['Orcamento','Resultado','Execucao','Funcoes','EvolucaoFuncoes','Receitas','Tributos','Constitucionais','Investimentos','Pessoal','Divida','Caixa'];
  window.renderFinancasVisual=function(gt,pkg){
    if(model?.pkg!==pkg){const fin=gt.eixos.financas,index=new Map(),families=fin.series_auditadas;for(const [f,rr] of Object.entries(families))for(const r of rr){const k=f+'|'+r.exercise;if(!index.has(k))index.set(k,[]);index.get(k).push(r);}const functionLabels=new Map();for(const r of families.despesa_dca_funcao)if(/^\d{2} - /.test(r.label))functionLabels.set(r.label.slice(0,2),r.label.slice(5));model={pkg,fin,index,families,functionLabels};
      const e=document.getElementById('fin-control-functions');if(e)e.innerHTML=[...functionLabels].map(([v,l])=>`<option value="${v}" ${state.functions.includes(v)?'selected':''}>${esc(l)}</option>`).join('');
    }
    const r=annual().find(r=>r.ano===2025),inv=find('despesa_dca_natureza',2025,'DO4.4.00.00.00.00','Despesas Liquidadas');
    for(const [k,p] of [['receita',annualPoint(r,'receita_realizada')],['despesa',annualPoint(r,'despesa_empenhada')],['resultado',annualPoint(r,'resultado_orcamentario')],['investimentos',inv]]){text('fin-kpi-'+k,money(value(p)));views.set('kpi-'+k,{points:[p],note:k==='resultado'?'Receita realizada − despesa empenhada; calculado a partir de fontes oficiais.':'Valor P2 aprovado.',formula:k==='resultado'?'Receita realizada − despesa empenhada':''});}
    text('fin-context',`Previsão atualizada: ${money(r.previsao_atualizada)} · realização da receita: ${num(r.realizacao_receita_pct,1)}% · dotação atualizada: ${money(r.dotacao_atualizada)}.`);
    keys.forEach(render);
    if(typeof window.compareFinancasStage==='function')window.compareFinancasStage('empenhada');
    updateRestosAPagarBlock();
  };

  const STAGE_DATA_2025 = {
    receita: 5112491710.24,
    stages: {
      empenhada: {
        label: 'Despesa empenhada',
        valor: 5245931732.40,
        resultado: -133440022.16,
        status: 'Déficit orçamentário oficial registrado no RREO',
        statusClass: 'fin-status-deficit',
        explanation: 'Compromissos orçamentários formalmente assumidos durante o exercício de 2025. Como as despesas empenhadas (R$ 5,25 bi) superaram as receitas realizadas (R$ 5,11 bi), este é o <strong>déficit orçamentário registrado oficialmente no RREO</strong> (Anexo 1, p. 2 e Anexo 14, p. 39). Representa o resultado legal definitivo do Balanço Orçamentário.'
      },
      liquidada: {
        label: 'Despesa liquidada',
        valor: 5115661287.57,
        resultado: -3169577.33,
        status: 'Diferença por liquidação (base da reportagem)',
        statusClass: 'fin-status-warning',
        explanation: 'Despesas cujo direito do credor foi verificado e atestado após regular entrega do bem ou serviço em 2025. A subtração aritmética entre a receita realizada e a despesa liquidada produz <strong>− R$ 3.169.577,33</strong> (aproximadamente R$ 3,17 milhões), que é <strong>a diferença calculada e divulgada pela reportagem do OVALE / Aqui Vale</strong>. <em>Atenção técnica:</em> esse cálculo não constitui uma linha autônoma de déficit orçamentário oficial no RREO.'
      },
      paga: {
        label: 'Despesa paga',
        valor: 5046568546.33,
        resultado: 65923163.91,
        status: 'Diferença de pagamentos do ano',
        statusClass: 'fin-status-info',
        explanation: 'Diferença estritamente aritmética entre receitas arrecadadas e desembolsos efetivados no exercício (+ R$ 65,92 milhões). <strong>Atenção metodológica:</strong> este valor <u>não</u> comprova superávit financeiro global, saldo bancário livre nem dinheiro disponível para gastar, pois desconsidera restos a pagar de anos anteriores quitados e vinculações constitucionais de caixa.'
      }
    }
  };

  function updateRestosAPagarBlock(){
    const fmt=v=>'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
    text('fin-rp-committed',fmt(5245931732.40));
    text('fin-rp-settled',fmt(5115661287.57));
    text('fin-rp-difference',fmt(130270444.83));
  }

  window.compareFinancasStage=function(stageKey){
    const d=STAGE_DATA_2025.stages[stageKey]||STAGE_DATA_2025.stages.empenhada;
    const maxVal=Math.max(STAGE_DATA_2025.receita,d.valor);
    const buttons=document.querySelectorAll('.fin-stage-buttons button[data-fin-stage]');
    buttons.forEach(btn=>{
      const active=btn.getAttribute('data-fin-stage')===stageKey;
      btn.setAttribute('aria-pressed',active?'true':'false');
      btn.classList.toggle('active',active);
    });
    const fmt=v=>'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
    const fmtDiff=v=>(v<0?'− ':'+ ')+'R$ '+Number(Math.abs(v)).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
    text('fin-compare-revenue',fmt(STAGE_DATA_2025.receita));
    text('fin-compare-label',d.label);
    text('fin-compare-expense',fmt(d.valor));
    text('fin-compare-result',fmtDiff(d.resultado));
    const statusEl=document.getElementById('fin-compare-status');
    if(statusEl){statusEl.textContent=d.status;statusEl.className='fin-status-pill '+d.statusClass;}
    const expEl=document.getElementById('fin-compare-explanation');
    if(expEl)expEl.innerHTML=d.explanation;
    const recPct=(STAGE_DATA_2025.receita/maxVal)*100;
    const expPct=(d.valor/maxVal)*100;
    const mRec=document.getElementById('fin-meter-revenue');if(mRec)mRec.style.width=recPct.toFixed(2)+'%';
    const mExp=document.getElementById('fin-meter-expense');if(mExp)mExp.style.width=expPct.toFixed(2)+'%';
  };

  const filters={budgetStage:'Orcamento',executionYear:'Execucao',functionYear:'Funcoes',functionStage:'Funcoes',trendStage:'EvolucaoFuncoes',functions:'EvolucaoFuncoes',revenueYear:'Receitas',taxGroup:'Tributos',investmentStage:'Investimentos',debtMetric:'Divida',cashMetric:'Caixa'};
  window.filterFinancasVisual=function(k,v){if(!model||!filters[k])return;const el=document.getElementById('fin-control-'+k);if(k==='functions'){if(!Array.isArray(v)||v.some(c=>!model.functionLabels.has(c)))return;}else if(el&&!Array.from(el.options).some(o=>o.value===String(v)))return;state[k]=v;render(filters[k]);};
  window.openFinancasVisualMetadata=function(key,competence){
    if(!model)return;const view=views.get(key);if(!view)return;const points=view.points.filter(Boolean),p=competence?points.find(r=>r.competence===competence):points.at(-1),src=source(p);
    if(typeof window.openIndicatorMetadata==='function')window.openIndicatorMetadata('fin_receita_realizada_2025');
    text('drawer-indicator-name',key);text('drawer-audit-status',p?.status||'NAO_DISPONIVEL');text('drawer-val',p?.unit||'BRL');text('drawer-source','Tesouro Nacional');text('drawer-system','SICONFI · '+(p?.statement||''));text('drawer-year',p?.competence||'');text('drawer-freq',p?.statement?.startsWith('RGF')?'Quadrimestral':p?.statement?.startsWith('RREO')?'Bimestral, recorte anual B6':'Anual');
    const info=`Definição: ${key}; ${view.note||''}\nMunicípio: São José dos Campos · IBGE 3549904. Abrangência: ${p?.scope}.\nEstágio: ${p?.stage}; classificação: ${p?.classification}. Unidade original: ${p?.unit}. Parcial: ${p?.partial?'sim':'não'}.\nFórmula/transformação: ${view.formula||'Valor diretamente publicado; escala de exibição em milhões/bilhões, sem alterar o valor original.'}\nEvidências: ${points.map(r=>r.evidence_id).join(', ')}.\nLimitações: valores correntes, sem deflator, sem per capita; FINBRA 2012 não concatenado. Classificação da receita: quebras em 2018/2022; exploração restrita a 2022–2025. ASPS/MDE não equivalem às funções. Revisões: versão oficial preservada na P2; sem atualização externa nesta fase.\n2025 RGF Q3: DTP absoluta, DC, DCL e DCL/RCL suspensos por divergência entre versões oficiais; percentual de pessoal 26,99% confirmado separadamente. ${p?.limitation||''}`;
    const components=p?.component_evidence_ids?.length?'\nComponentes do cálculo: '+p.component_evidence_ids.join(', '):'';
    text('drawer-methodology',info+components);text('drawer-evidencia-trecho',info+components);text('drawer-evidencia-data',src?.accessed_at||'Não disponível');text('drawer-context-warning-text',p?.value==null?'Valor suspenso: divergência entre versões oficiais consultadas.':view.note||'Valores correntes; observar escopo e estágio.');
    for(const id of ['drawer-url-link','drawer-evidencia-url']){const e=document.getElementById(id);if(e&&src?.url){e.href=src.url;e.textContent='Consultar fonte oficial ↗';e.target='_blank';e.rel='noopener noreferrer';}}
  };
  window.getFinancasVisualState=()=>({state:{...state,functions:[...state.functions]},chartCount:charts.size,indexSize:model?.index.size,views:[...views].map(([key,v])=>({key,evidence_ids:v.points.filter(Boolean).map(p=>p.evidence_id)}))});

  let pending=null;
  const expected='835d46eea166c5d17eea2761deed61703e83414cc19b02e9a9e7e2f4f8101be6';
  async function verify(raw){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));return Array.from(new Uint8Array(d),n=>n.toString(16).padStart(2,'0')).join('')===expected;}
  async function load(){const cache='radar-financas-'+expected;let raw;try{const r=await fetch('public-data/financas/apresentacao.v1.json',{cache:'no-cache'});if(!r.ok)throw Error('Resposta indisponível');raw=await r.text();if(!await verify(raw))throw Error('Integridade');try{localStorage.setItem(cache,raw);}catch(_){}}catch(error){try{raw=localStorage.getItem(cache);}catch(_){}if(!raw||!await verify(raw))throw error;}return JSON.parse(raw);}
  async function mount(container){if(!container)return;if(model){window.renderFinancasVisual({eixos:{financas:model.fin}},model.pkg);return;}if(!pending)pending=load().then(c=>{window.renderFinancasVisual({eixos:{financas:c.fin}},c);container.dataset.financasReady='true';container.dataset.contractHash=expected;return c;}).catch(e=>{pending=null;let status=container.querySelector('[data-fin-error]');if(!status){status=document.createElement('p');status.dataset.finError='true';status.setAttribute('role','status');container.prepend(status);}status.textContent='Dados financeiros temporariamente indisponíveis. Reabra este eixo para tentar novamente.';throw e;});return pending;}
  window.RadarFinancasVisual={mount,verify,getState:()=>window.getFinancasVisualState()};

})();
