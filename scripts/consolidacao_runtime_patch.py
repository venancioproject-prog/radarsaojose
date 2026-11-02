"""Corrige vínculos e estados sem redesenho, screenshots ou alteração de app.js."""
from pathlib import Path
import json,re
from build_radar_hub_package import write_atomic
ROOT=Path(__file__).resolve().parent.parent;BASE=ROOT/'data/radar_hub';OUT=sorted((ROOT/'docs/dados-publicos-revisao/consolidacao-geral').glob('20*'))[-1]
code=(ROOT/'radar_hub_controller.js').read_text(encoding='utf8');html=(ROOT/'app.html').read_text(encoding='utf8')
# Exportar o recorte completo de todos os eixos, inclusive SE parcial/corte mensal.
fixed_code=code.replace("competencia:(['economia','financas'].includes(i.category) ? i.competencia : i.base_year) ?? null", "competencia:i.competencia ?? i.base_year ?? null")
if fixed_code!=code:
 code=fixed_code
 write_atomic(ROOT/'radar_hub_controller.js',code)
# A unidade acompanha o conceito do Censo, sem apresentar matrícula como pessoa única.
fixed_html=re.sub(r'(data-radar-indicator="educ_matriculas_total_censo"[^>]*>.*?</span>\s*<span[^>]*>)estudantes(</span>)',r'\1matrículas\2',html,flags=re.S)
if fixed_html!=html:
 html=fixed_html
 write_atomic(ROOT/'app.html',html)
# Uma segunda execução não duplica vínculos nem bloqueios já aplicados.
if 'function updateConsolidatedCards(' in code:
 assert 'function equalHubValues(' in code and 'hub-benchmark-cards-grid' in code
 assert html.count('data-radar-indicator=') >= 16
 print('Correções de runtime já presentes; pacote é regenerado pelo builder separado.')
 raise SystemExit(0)
# Igualdade profunda sem duas serializações de dezenas de MB a cada carregamento.
old="""  function validHubPackage(p) {
    return p && p.schema_version === 1 && p.dataset_version === RADAR_HUB_PACKAGE.dataset_version &&
      JSON.stringify(p) === JSON.stringify(RADAR_HUB_PACKAGE);
  }"""
new="""  function equalHubValues(a, b) {
    if (a === b) return true;
    if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    return keys.every(key => Object.prototype.hasOwnProperty.call(b, key) && equalHubValues(a[key], b[key]));
  }
  function validHubPackage(p) {
    return p && p.schema_version === 1 && p.dataset_version === RADAR_HUB_PACKAGE.dataset_version &&
      equalHubValues(p, RADAR_HUB_PACKAGE);
  }"""
if old in code:code=code.replace(old,new,1)
code=code.replace('serie.map(s => s.anos_iniciais || s.anos_iniciais_fundamental)','serie.map(s => s.anos_iniciais ?? s.anos_iniciais_fundamental ?? null)')
code=code.replace('Number(ultimo.taxa_100k).toLocaleString', 'Number(ultimo.taxa_por_100k ?? ultimo.taxa_100k).toLocaleString')
code=code.replace('canvas.parentNode.appendChild(fallbackContainer);','if (canvas.parentNode) canvas.parentNode.appendChild(fallbackContainer);')
code=code.replace('const vitimas = serie.map(item => item.vitimas);','const vitimas = serie.map(item => item.ocorrencias ?? null);')
code=code.replace('Vítimas de Homicídio Doloso (SSP-SP)','Ocorrências de Homicídio Doloso (SSP-SP)')
code=code.replace("label: 'Total de Estudantes Matriculados'","label: 'Matrículas — categorias com sobreposição; não somar'")
start=code.index('  function renderEducacaoRedeChart(');end=code.index('  function renderEducacaoFluxoChart(',start);part=code[start:end]
part=re.sub(r'    const labels = \[.*?\];\s*    const values = \[56420, 48910, 34980, 2540\];',"    const rows = gt.eixos.educacao.matriculas_por_rede_censo_2023 || [];\n    const labels = rows.map(row => row.rede);\n    const values = rows.map(row => row.matriculas ?? null);",part,flags=re.S);code=code[:start]+part+code[end:]
code=code.replace('const values = [98.4, 96.2, 88.9, 95.8];','const values = [gt.eixos.educacao.indicadores_socioeducacionais.taxa_escolarizacao_6_a_14_anos ?? null, null, null, null];')
code=code.replace("label: 'Percentual de Eficiência Escolar (%)'","label: 'Escolarização IBGE 2022; demais medidas sem comprovação'")
# Preservar funções, filtros e canvas; bloquear somente visualização sem vínculo comprovado.
for name,canvas,source in [('renderDemografiaHistoricoChart','hubChartDemografiaHistorico','IBGE'),('renderDemografiaPiramideChart','hubChartDemografiaPiramide','IBGE'),('renderDemografiaRegioesChart','hubChartDemografiaRegioes','IBGE / Prefeitura'),('renderDemografiaDistritosChart','hubChartDemografiaDistritos','IBGE / Prefeitura'),('renderDemografiaCorRacaChart','hubChartDemografiaCorRaca','IBGE'),('renderDemografiaUrbanoRuralChart','hubChartDemografiaUrbanoRural','IBGE'),('renderDemografiaDomiciliosChart','hubChartDemografiaDomicilios','IBGE'),('renderDemografiaReligiaoChart','hubChartDemografiaReligiao','IBGE'),('renderDemografiaCrescimentoChart','hubChartDemografiaCrescimento','IBGE'),('renderSegurancaMensalChart','hubChartSegurancaMensal','SSP-SP'),('renderSegurancaPatrimonioChart','hubChartSegurancaPatrimonio','SSP-SP / CSI'),('renderSegurancaDDMChart','hubChartSegurancaDDM','SSP-SP')]:
 pattern=r'(  function '+name+r'\([^\n]*\) \{)';note="Histórico/composição sem vínculo externo reproduzível nesta consolidação; arquivos preservados para conferência. Não representa zero."
 code=re.sub(pattern,lambda m:m[0]+f"\n    if (RADAR_HUB_CACHE.package?.consolidacaoStatus) {{ showChartFallback('{canvas}', null, 'https://{'www.ssp.sp.gov.br/estatistica/dados-mensais' if name.startswith('renderSeguranca') else 'sidra.ibge.gov.br/'}', '{source}', '{note}'); return; }}",code,count=1)
code=code.replace("    const container = document.getElementById('hubMapDemografiaCalor');","    const container = document.getElementById('hubMapDemografiaCalor');\n    if (container && RADAR_HUB_CACHE.package?.consolidacaoStatus) { container.textContent = 'Mapa populacional em revisão: 35 unidades municipais, vínculo censitário e classificação pendentes. Geometrias preservadas.'; return; }",1)
# Os elementos novos usam cadastro canônico; nenhum valor estático é necessário.
helper="""
  function updateConsolidatedCards() {
    const p = RADAR_HUB_CACHE.package;
    if (!p) return;
    document.querySelectorAll('[data-radar-indicator]').forEach(el => {
      const indicator = p.metadataRegistry.indicators.find(row => row.indicator_id === el.dataset.radarIndicator);
      const value = indicator?.value;
      const suspended = indicator?.audit_status?.startsWith('SUSPENSO') || indicator?.audit_status === 'NAO_VERIFICADO';
      el.textContent = value == null || suspended ? 'Dado não disponível' : typeof value === 'number' ? value.toLocaleString('pt-BR', {maximumFractionDigits:2}) : String(value);
    });
  }
"""
if 'function updateConsolidatedCards()' not in code:code=code.replace('  function updateTopKpis(gt) {',helper+'\n  function updateTopKpis(gt) {',1)
code=code.replace('    updateTopKpis(data.groundTruth);','    updateTopKpis(data.groundTruth);\n    updateConsolidatedCards();',1)
# HTML: apenas valores, definições e vínculos; mesmas seções e gráficos.
axis_bindings={'demografia':['demo_populacao_censo','demo_populacao_estimada_2024','demo_densidade_demografica','demo_domicilios_ocupados'],'saude':['saude_mortalidade_infantil','saude_leitos_hospitalares_total','saude_leitos_uti_adulto','saude_cobertura_vacinal_bcg'],'seguranca':['seg_homicidios_dolosos_2024','seg_roubos_veiculos_2024','seg_furtos_veiculos_2024','seg_produtividade_prisoes'],'educacao':['educ_ideb_anos_iniciais','educ_ideb_anos_finais','educ_matriculas_total_censo','educ_taxa_escolarizacao']}
for axis,ids in axis_bindings.items():
 start=html.index('<div id="hub-axis-container-'+axis+'"');end=html.index('<!-- Gráfico 1:',start);part=html[start:end];counter=[0]
 def annotate(m):
  j=counter[0];counter[0]+=1
  return f'<span data-radar-indicator="{ids[j]}" '+m[1]+'Dado não disponível</span>' if j<len(ids) else m[0]
 part=re.sub(r'<span (class="text-xl sm:text-2xl font-black text-brand-950">).*?</span>',annotate,part)
 assert counter[0]>=4,(axis,counter)
 html=html[:start]+part+html[end:]
replacements={'Ensino Fundamental I. Meta nacional estipulada pelo MEC: 7,0.':'Rede pública, 2023. Metas do primeiro ciclo somente até 2021.','Ensino Fundamental II. Meta nacional estipulada pelo MEC: 6,2.':'Rede pública, 2023. IDEB distinto de nota SAEB.','Rede Municipal atende 56.420 estudantes na infância e fundamental.':'Censo Escolar 2023: 163.965 matrículas em todas as redes; não alunos únicos.','Aprovação escolar de 96,2% e distorção idade-série de apenas 4,2%.':'Censo Demográfico 2022: 99,09% dos residentes de 6 a 14 anos frequentavam escola.','Decomposição dos 142.850 estudantes atendidos na educação básica':'Matrículas 2023 por categoria; educação especial e profissional têm sobreposições. Não somar as barras.','Índice de Desenvolvimento da Educação Básica (2005 a 2023)':'Rede pública: 2005 a 2025. Metas oficiais do primeiro ciclo: 2007 a 2021.','Área total: 1.099,494 km² (353,9 km² urbanos e 745,7 km² rurais).':'Área da edição SIDRA 2022: 1.099,409 km²; recorte urbano/rural pendente.','Publicação DOU de 29/08/2024 (+3,97% pós-censo).':'Estimativa 2024 pendente de reprodução do arquivo original; resumo anterior preservado.','Taxa oficial SSP-SP: 3,28 / 100k hab. Menor número histórico.':'23 ocorrências e taxa publicada de 3,28 por 100 mil habitantes; vítimas têm definição distinta.','Taxa de 28,68 / 100k veíc. (Queda de 8,9% frente a 2023; 2025: 86).':'Recorte anual por tipo de veículo pendente de resposta original e definição.','Taxa de 145,22 / 100k veíc. (Queda de 40,4% frente a 2023; 2025: 733).':'Recorte anual por tipo de veículo pendente de resposta original e definição.','Meios e Esclarecimento (87% DEIC)':'Meios e Esclarecimento (em revisão)','Vítimas e Taxa de Homicídios':'Ocorrências e Taxa de Homicídios'}
for old,new in replacements.items():html=html.replace(old,new)
html=re.sub(r'(data-radar-indicator="educ_matriculas_total_censo"[^>]*>.*?</span>\s*<span[^>]*>)estudantes(</span>)',r'\1matrículas\2',html,flags=re.S)
# Comparações não auditadas não recebem barras ou vantagem calculada sobre zeros.
marker='  window.updateHubBenchmarkView = function() {'
if marker in code:code=code.replace(marker,marker+"\n    if (RADAR_HUB_CACHE.package?.consolidacaoStatus) { const grid = document.getElementById('hub-benchmark-cards-grid'); if (grid) grid.textContent = 'Comparações multicidades em revisão: fontes, competências e conceitos precisam ser reconciliados.'; return; }",1)
code=code.replace("competencia:(['economia','financas'].includes(i.category) ? i.competencia : i.base_year) ?? null", "competencia:i.competencia ?? i.base_year ?? null")
write_atomic(ROOT/'radar_hub_controller.js',code);write_atomic(ROOT/'app.html',html)
print('Vínculos, proteção de gráficos e null/zero corrigidos sem alterar app.js ou criar layout novo.')
