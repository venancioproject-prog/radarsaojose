from collect_mobilidade_p4 import *
import re
p=ROOT/'radar_hub_controller.js';code=p.read_text(encoding='utf8')
for function,canvas,reason in [('renderMobilidadeFatalidadesChart','hubChartMobilidadeFatalidades','Infosiga: dados externos não obtidos nesta rodada; série suspensa.'),('renderMobilidadeVitimasChart','hubChartMobilidadeVitimas','Perfil de vítimas sem comprovação externa nesta rodada; suspenso.'),('renderMobilidadeTaxaChart','hubChartMobilidadeTaxa','Taxa e comparações suspensas: denominadores externos compatíveis não validados.')]:
 start=code.index('  function '+function+'(');end=code.index('\n  //',start)
 code=code[:start]+f"  function {function}(gt) {{\n    showChartFallback('{canvas}', null, 'https://infosiga.detran.sp.gov.br/', 'Evidências P4', '{reason}');\n  }}\n"+code[end:]
start=code.index('  function renderMobilidadeFrotaChart(');end=code.index('  // G15:',start)
block=code[start:end].replace('Frota Total Licenciada','Frota total registrada').replace('Automóveis Particulares','Automóveis registrados').replace('Frota Total de Veículos','Frota total registrada')
if 'Frota sem vínculo com evidência P4.' not in block:block=block.replace('    hideChartFallback(canvasId);',"    if (!RADAR_HUB_CACHE.package?.mobilidadeAudit || !serie.some(r => r.total != null)) { showChartFallback(canvasId, null, 'https://www.gov.br/transportes/', 'SENATRAN', 'Frota sem vínculo com evidência P4.'); return; }\n    hideChartFallback(canvasId);")
block=block.replace('tension: 0.3','tension: 0').replace('          pointRadius: 5',"          spanGaps: false,\n          pointRadius: 5")
code=code[:start]+block+code[end:]
code=code.replace("    } else if (axisName === 'mobilidade') {\n      renderMobilidadeFrotaChart(gt);","    } else if (axisName === 'mobilidade') {\n      updateMobilidadeP4Cards();\n      renderMobilidadeFrotaChart(gt);")
helper="""  function updateMobilidadeP4Cards() {
    const p=RADAR_HUB_CACHE.package;
    if (!p?.mobilidadeAudit) return;
    for (const [elId,id] of [['mob-p4-frota','mob_frota_total_2024'],['mob-p4-taxa','mob_taxa_motorizacao'],['mob-p4-obitos','mob_fatalidades_transito_2024'],['mob-p4-motos','mob_vitimas_motociclistas_pct']]) {
      const el=document.getElementById(elId), b=p.mobilidadeAudit.indicators[id];
      const i=p.metadataRegistry.indicators.find(r=>r.indicator_id===id);
      const valid=b && i && b.value===i.value && b.evidence_id===i.evidence_id && ['CONFIRMADO_FONTE_OFICIAL','CALCULADO_A_PARTIR_DE_FONTES_OFICIAIS','DISPONIVEL_COM_LIMITACAO'].includes(b.status);
      if(el)el.textContent=valid && b.value!=null ? Number(b.value).toLocaleString('pt-BR') : 'Dado não disponível';
    }
  }
  window.getMobilidadeP4Export = function() {
    const p=RADAR_HUB_CACHE.package; if(!p?.mobilidadeAudit)return [];
    const mob=p.groundTruth.eixos.mobilidade;
    return Object.entries(mob.series_auditadas || {}).flatMap(([family,rows])=>rows.map(row=>{const e={...mob.series_metadata[row.source_metadata_id],...row};return {id:e.evidence_id,nome:e.variable,eixo:'mobilidade',valor:e.value ?? null,unidade:e.unit,competencia:e.period,status_declarado:e.status,status_pacote:p.audit_status,fonte:e.institution,url:e.source_url,data_consulta:e.accessed_at,versao:p.dataset_version,evidencia:{...e,family},consistencia_local:null};}));
  };

"""
if '  function updateMobilidadeP4Cards()' not in code:code=code.replace('  window.getRadarHubExport = function() {',helper+'  window.getRadarHubExport = function() {')
code=code.replace("      ...(RADAR_HUB_CACHE.activeAxis === 'meio_ambiente' ? {meio_ambiente_series:window.getMeioAmbienteP3Export()} : {}),","      ...(RADAR_HUB_CACHE.activeAxis === 'meio_ambiente' ? {meio_ambiente_series:window.getMeioAmbienteP3Export()} : {}),\n      ...(RADAR_HUB_CACHE.activeAxis === 'mobilidade' ? {mobilidade_series:window.getMobilidadeP4Export()} : {}),")
code=code.replace('...(exportData.meio_ambiente_series || [])];','...(exportData.meio_ambiente_series || []),...(exportData.mobilidade_series || [])];')
p.write_text(code,encoding='utf8')
p=ROOT/'app.html';html=p.read_text(encoding='utf8');start=html.index('  <!-- EIXO: MOBILIDADE &');end=html.index('  <!-- EIXO: FINANÇAS PÚBLICAS',start);block=html[start:end]
for old,element in [('476.500','mob-p4-frota'),('0,66','mob-p4-taxa'),('82','mob-p4-obitos'),('49,5%','mob-p4-motos')]:
 pattern=r'(<span)( class="text-xl sm:text-2xl font-black text-brand-950">)'+re.escape(old)+r'(</span>)'
 block=re.sub(pattern,lambda m:m[1]+' id="'+element+'"'+m[2]+'Dado não disponível'+m[3],block,count=1)
 replacements={'+1,6% vs 2023 (302,8k automóveis e 81,9k motos).':'Frota registrada · dezembro2024 · 498.566 veículos.','1 veículo a cada 1,5 hab. (RMVale: 0,61 • SP: 0,75 • BR: 0,56).':'Suspensa: denominador populacional compatível não validado.','Taxa de 11,3 / 100k hab. Aumento de 10,8% vs 2023.':'Suspenso: arquivo externo Infosiga não obtido na P4.','Quase metade das mortes no trânsito envolvem motos.':'Perfil suspenso até comprovação externa.','Série histórica de licenciamentos e composição modal (2012 a 2024)':'Estoques registrados em dezembro · posições disponíveis2003–2025 · lacunas preservadas.','Frota Geral (476,5k)':'Frota registrada','Automóveis (302,8k)':'Automóveis registrados','Motocicletas (81,9k)':'Motocicletas + motonetas','Série histórica anual consolidada e sazonalidade mês a mês':'Série suspensa · dados externos Infosiga não obtidos nesta rodada','Anual (2015–2024)':'Anual · suspensa','Mensal (Jan–Dez)':'Mensal · suspensa','Distribuição percentual das vítimas fatais de 2023':'Perfil suspenso até comprovação externa'}
for a,b in replacements.items():block=block.replace(a,b)
# Descrições adicionais sem prova também não permanecem como afirmação visual.
block=re.sub(r'(<p class="text-xs text-slate-500 font-medium">)(.*?)(</p>)',lambda m:m[1]+('Comparações suspensas: competências e denominadores sem comprovação externa.' if any(w in m[2].lower() for w in ['por habitante','comparativo','proporção','composição das vítimas','distribuição']) else m[2])+m[3],block)
html=html[:start]+block+html[end:];p.write_text(html,encoding='utf8')
print('Runtime P4: mesmo layout; frota vinculada, três gráficos suspensos, exportações completas.')
