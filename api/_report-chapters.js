'use strict';

// Identificadores públicos para manter o índice e a navegação do Report de homologação.
const pages = [3, 6, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 43, 44, 45, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 7, 8, 9, 10];
const topics = ['Perfil dos moradores', 'Vida nos bairros', 'Mobilidade', 'Hábitos e consumo',
  'Lazer e cultura', 'Percepções da cidade', 'Comunicação local', 'Síntese da pesquisa'];

function demoChapters() {
  return pages.map((page, index) => `<article id="rep-tela-${String(page).padStart(3, '0')}" data-report-block="${page}"
    data-editorial-version="4" class="gg-slide rounded-3xl border border-slate-200 bg-white p-8 sm:p-12">
    <header class="space-y-4">
      <p class="text-xs font-bold uppercase text-cyan-800">Report de demonstração · ${page}</p>
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
