"""Correções de dados/rótulos e exportação; não altera layout nem app.js."""
from pathlib import Path
import importlib.util,re
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('builder',ROOT/'scripts/build_radar_hub_package.py');b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
p=ROOT/'radar_hub_controller.js';code=p.read_text(encoding='utf8')
def edit_function(name,changes):
    global code
    start=code.index('  function '+name+'(');end=code.find('\n  function ',start+1)
    if end<0:end=len(code)
    block=code[start:end]
    for before,after in changes:
        assert block.count(before)==1,(name,before,block.count(before));block=block.replace(before,after,1)
    code=code[:start]+block+code[end:]
edit_function('renderEducacaoMatriculasChart',[
    ("const mat = gt.eixos.educacao.matriculas_censo_escolar_2023 || {};","const mat = gt.eixos.educacao.matriculas_censo_escolar_2023 || {};\n    const total = mat.total_matriculas;\n    const hasTotal = typeof total === 'number' && Number.isFinite(total) && total > 0;"),
    ("'Educação Especial Inclusiva'","'Educação Especial (comuns e exclusivas)'"),
    ("'Ensino Médio Regular'","'Ensino Médio (inclui integrado)'"),
    ("'Educação Profissional / Técnica'","'Educação Profissional Técnica de Nível Médio'"),
    ("`${(v / 1000).toFixed(1)}k (${((v / 142850) * 100).toFixed(1)}%)`","`${(v / 1000).toFixed(1)}k${hasTotal ? ` (${((v / total) * 100).toFixed(1)}%)` : ''}`"),
    ('matrículas ativas','matrículas — Censo Escolar 2023')])
edit_function('renderEducacaoRedeChart',[
    ('const values = rows.map(row => row.matriculas ?? null);',"const values = rows.map(row => row.matriculas ?? null);\n    const total = gt.eixos.educacao.matriculas_censo_escolar_2023?.total_matriculas;\n    const hasTotal = typeof total === 'number' && Number.isFinite(total) && total > 0 && rows.length === 4 && values.every(v => typeof v === 'number' && Number.isFinite(v)) && values.reduce((sum, v) => sum + v, 0) === total;"),
    ("`${((v / 142850) * 100).toFixed(1)}%`","hasTotal ? `${((v / total) * 100).toFixed(1)}%` : Number(v).toLocaleString('pt-BR')"),
    (' estudantes`',' matrículas — Censo Escolar 2023`')])
edit_function('renderEducacaoFluxoChart',[
    ('% de conformidade nos indicadores oficiais do INEP','% — escolarização de residentes de 6 a 14 anos, IBGE/Censo 2022')])

# Mantém os gates existentes. A mensagem distingue fonte reproduzida de gráfico ainda não vinculado.
old='Histórico/composição sem vínculo externo reproduzível nesta consolidação; arquivos preservados para conferência. Não representa zero.'
new='Este gráfico está em revisão. Séries comprovadas, quando disponíveis, estão na exportação. Indicadores sem evidência não representam zero.'
for name in re.findall(r'  function (render(?:Demografia|Seguranca)\w+)\(',code):
    start=code.index('  function '+name+'(');end=code.find('\n  function ',start+1);block=code[start:end if end>=0 else None]
    if old in block:edit_function(name,[(old,new)])

anchor='  window.getRadarHubExport = function() {'
assert code.count(anchor)==1 and 'window.getRevisaoQuatroEixosExport' not in code
helper="""  window.getRevisaoQuatroEixosExport = function(axis) {
    const p = RADAR_HUB_CACHE.package;
    if (!p || !['educacao', 'saude', 'seguranca', 'demografia'].includes(axis)) return [];
    const data = p.groundTruth.eixos[axis];
    return Object.entries(data.series_auditadas || {}).flatMap(([family, rows]) => rows.map(row => {
      const e = {...data.series_metadata[row.source_metadata_id], ...row};
      return {id:e.evidence_id, nome:e.variable, eixo:axis, valor:e.value ?? null,
        unidade:e.unit, competencia:e.period, status_declarado:e.status, status_pacote:p.audit_status,
        fonte:e.institution, url:e.source_url, data_consulta:e.accessed_at, versao:p.dataset_version,
        evidencia:{...e, family}, consistencia_local:null};
    }));
  };

"""
code=code.replace(anchor,helper+anchor,1)
anchor="      indicators:p.metadataRegistry.indicators.map(i => ({"
assert code.count(anchor)==1
code=code.replace(anchor,"      ...(['educacao', 'saude', 'seguranca', 'demografia'].includes(RADAR_HUB_CACHE.activeAxis)\n        ? {[RADAR_HUB_CACHE.activeAxis + '_series']:window.getRevisaoQuatroEixosExport(RADAR_HUB_CACHE.activeAxis)} : {}),\n"+anchor,1)
code=code.replace('data_consulta:i.evidencia?.data_consulta ?? i.last_checked ?? null,','data_consulta:i.evidencia?.accessed_at ?? i.evidencia?.data_consulta ?? i.last_checked ?? null,',1)
before='...(exportData.mobilidade_series || [])];'
assert code.count(before)==1
code=code.replace(before,'...(exportData.mobilidade_series || []),...([\'educacao\',\'saude\',\'seguranca\',\'demografia\'].flatMap(axis => exportData[axis + \'_series\'] || []))];',1)
b.write_atomic(p,code)

p=ROOT/'app.html';html=p.read_text(encoding='utf8')
changes=[
('Divisão do alunado entre redes Municipal, Estadual, Privada e Federal','Matrículas de 2023 nas redes Municipal, Estadual, Privada e Federal; município da escola.'),
('Rendimento e Eficiência Escolar (INEP)','Escolarização e Indicadores Educacionais'),
('Contagem de boletins por mês de registro','Ocorrências por competência publicada SSP; regra territorial mudou em julho/2001'),
('1º lugar em menor taxa de homicídios (+500k hab)','Ranking suspenso: universo e denominadores sem reprodução completa'),
('Atuações operacionais homologadas e videomonitoramento municipal','Atividades SSP e CSI com universos distintos; não somar resultados'),
('Recortes temáticos complementares homologados pelo IBGE no Censo Demográfico 2022','Recortes do Censo 2022; vínculos com estes gráficos em revisão'),
('SMS 2024: 8,20; 2025: 7,65. Taxas publicadas; contagens não discriminadas. Referência municipal (meta 2022): 9,00/mil.','SMS: 2025 preliminar, 7,65/mil; 2024, 8,20/mil. Contagens não discriminadas. Referência municipal (meta 2022): 9,00/mil.'),
('Adulto, pediátrica e neonatal: valores pendentes de comprovação documental.','Códigos CNES de 12/2024 disponíveis na exportação; equivalência com estes KPIs ainda não comprovada.'),
('são particulares ocupados, 24.667','são particulares permanentes ocupados, 24.667')]
for before,after in changes:
    assert html.count(before)==1,(before,html.count(before));html=html.replace(before,after,1)
# Estes quatro cartões exibiam cifras/negações apesar da suspensão dos auxiliares no GT.
start=html.index('<!-- Card: Temas Censitários Especiais');end=html.index('<!-- EIXO: SAÚDE',start)
block=html[start:end]
for before,after in [
    ('97,86%','Em verificação'),
    ('557.069 alfabetizados de 569.237 pessoas com 15 anos ou mais (SIDRA Tab. 9543).','Numerador, denominador e recorte territorial aguardam reprodução primária.'),
    ('629 hab.','Em verificação'),
    ('0,09% da população residente municipal autodeclarada indígena no Censo 2022.','Definição e valor municipal aguardam reprodução específica; não confundir universos indígenas.'),
    ('34 áreas','Em verificação'),
    ('Comunidades urbanas mapeadas pelo IBGE, concentrando cerca de 4,8% da população.','Quantidade, população e correspondência territorial aguardam evidências reproduzidas.'),
    ('Sem delimitação','Em verificação'),
    ('Sem territórios oficialmente delimitados pelo INCRA ou IBGE em São José dos Campos.','Ausência de delimitação não foi comprovada nesta revisão.')]:
    assert block.count(before)==1,before;block=block.replace(before,after,1)
html=html[:start]+block+html[end:]
# Ficha técnica do gráfico de todas as redes deve apontar ao total, não somente ao fundamental.
pos=html.index('id="hubChartEducacaoRede"');start=html.rfind('<button ',0,pos)
block=html[start:pos]
assert block.count("openIndicatorMetadata('educ_matriculas_fundamental')")==1
html=html[:start]+block.replace("openIndicatorMetadata('educ_matriculas_fundamental')","openIndicatorMetadata('educ_matriculas_total_censo')",1)+html[pos:]
b.write_atomic(p,html)
print('Controller e rótulos corrigidos; layout e app.js preservados.')
