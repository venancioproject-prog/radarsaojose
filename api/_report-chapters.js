'use strict';

// Identificadores públicos para manter o índice e a navegação do Report de homologação.
const pages = ["rep-tela-003", "rep-tela-006", "rep-tela-012", "rep-tela-013", "rep-tela-014", "rep-tela-015", "rep-tela-016", "rep-tela-017", "rep-tela-018", "rep-tela-019", "rep-tela-020", "rep-tela-021", "rep-tela-022", "rep-tela-023", "rep-tela-024", "rep-tela-025", "rep-tela-026", "rep-tela-027", "rep-tela-028", "rep-tela-029", "rep-tela-030", "rep-tela-031", "rep-tela-032", "rep-tela-033", "rep-tela-034", "rep-tela-035", "rep-tela-036", "rep-tela-037", "rep-tela-039", "rep-tela-040", "rep-tela-041", "rep-tela-043", "rep-tela-044", "rep-tela-045", "rep-tela-049", "rep-tela-050", "rep-tela-051", "rep-tela-052", "rep-tela-053", "rep-tela-053-cont-2", "rep-tela-054", "rep-tela-055", "rep-tela-055-cont-2", "rep-tela-056", "rep-tela-057", "rep-tela-057-cont-2", "rep-tela-058", "rep-tela-059", "rep-tela-059-cont-2", "rep-tela-060", "rep-tela-061", "rep-tela-061-cont-2", "rep-tela-062", "rep-tela-063", "rep-tela-063-cont-2", "rep-tela-064", "rep-tela-065", "rep-tela-065-cont-2", "rep-tela-066", "rep-tela-067", "rep-tela-067-cont-2", "rep-tela-068", "rep-tela-069", "rep-tela-069-cont-2", "rep-tela-070", "rep-tela-071", "rep-tela-071-cont-2", "rep-tela-072", "rep-tela-073", "rep-tela-074", "rep-tela-075", "rep-tela-075-cont-2", "rep-tela-076", "rep-tela-076-cont-2", "rep-tela-077", "rep-tela-077-cont-2", "rep-tela-078", "rep-tela-079", "rep-tela-079-cont-2", "rep-tela-080", "rep-tela-080-cont-2", "rep-tela-081", "rep-tela-081-cont-2", "rep-tela-082", "rep-tela-082-cont-2", "rep-tela-083", "rep-tela-084", "rep-tela-084-cont-2", "rep-tela-085", "rep-tela-085-cont-2", "rep-tela-086", "rep-tela-086-cont-2", "rep-tela-087", "rep-tela-087-cont-2", "rep-tela-088", "rep-tela-089", "rep-tela-089-cont-2", "rep-tela-090", "rep-tela-090-cont-2", "rep-tela-091", "rep-tela-091-cont-2", "rep-tela-092", "rep-tela-092-cont-2", "rep-tela-093", "rep-tela-094", "rep-tela-095", "rep-tela-095-cont-2", "rep-tela-096", "rep-tela-097", "rep-tela-098", "rep-tela-099", "rep-tela-100", "rep-tela-101", "rep-tela-102", "rep-tela-103", "rep-tela-104", "rep-tela-104-cont-2", "rep-tela-105", "rep-tela-106", "rep-tela-107", "rep-benchmarks-cidades", "rep-tela-108", "rep-tela-109", "rep-tela-110", "rep-tela-111", "rep-tela-112", "rep-tela-113", "rep-tela-114", "rep-tela-115", "rep-metodologia-fontes", "rep-tela-007", "rep-tela-008", "rep-metodo-distribuicoes", "rep-tela-009", "rep-tela-010", "rep-metodo-leitura", "rep-fontes-01", "rep-fontes-02", "rep-fontes-03", "rep-fontes-04", "rep-fontes-05", "rep-fontes-06", "rep-fontes-07", "rep-fontes-08", "rep-fontes-09", "rep-fontes-10", "rep-fontes-11", "rep-fontes-acervo"];
const topics = ['Perfil dos moradores', 'Vida nos bairros', 'Mobilidade', 'Hábitos e consumo',
  'Lazer e cultura', 'Percepções da cidade', 'Comunicação local', 'Síntese da pesquisa'];

function demoChapters() {
  return pages.map((page, index) => `<article id="${page}" data-report-block="${page.startsWith('rep-tela-') ? page.slice(9).split('-')[0] : page.slice(4)}"
    data-editorial-version="4" class="gg-slide rounded-3xl border border-slate-200 bg-white p-8 sm:p-12">
    <header class="space-y-4">
      <p class="text-xs font-bold uppercase text-cyan-800">Report de demonstração</p>
      <h2 class="text-3xl font-bold text-slate-900">${topics[index % topics.length]}</h2>
      <p>Exemplo ilustrativo para validar navegação, autorização e indicadores do plano Report.</p>
    </header>
    <div class="mt-8 rounded-xl bg-cyan-50 p-6">
      <span class="text-sm font-semibold">Respostas simuladas</span>
      <strong class="block text-3xl" data-report-spec='{"type":"sample"}'>—</strong>
    </div>
  </article>`).join('\n');
}

module.exports = { demoChapters };
