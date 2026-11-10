(function () {
  const status = document.getElementById('crm-accounts-status');
  const list = document.getElementById('crm-accounts-list');
  const previous = document.getElementById('crm-accounts-previous');
  const next = document.getElementById('crm-accounts-next');
  const searchInput = document.getElementById('mondaySearch');
  const countEl = document.getElementById('mondayListCount');
  const pageInfo = document.getElementById('mondayPageInfo');

  const kpiGratis = document.getElementById('mondayKpiGratis');
  const kpiPagos = document.getElementById('mondayKpiPagos');
  const kpiNovos = document.getElementById('mondayKpiNovos');
  const kpiConversao = document.getElementById('mondayKpiConversao');

  const profiles = {
    empresario: 'Empresário(a)',
    gestor: 'Diretor / Gestor',
    marketing: 'Marketing',
    agencia: 'Agência / Publicidade',
    investidor: 'Investidor(a)',
    imobiliario: 'Setor Imobiliário',
    consultor: 'Consultoria',
    inteligencia: 'Pesquisa / Inteligência',
    setor_publico: 'Setor Público',
    comunicacao: 'Comunicação / Imprensa',
    professor: 'Professor(a)',
    estudante: 'Estudante',
    outros: 'Outros'
  };

  // Cores icônicas do Monday.com para status e planos
  const mondayStatusBadges = {
    gratis: '<span class="px-3 py-1 rounded text-[11px] font-black text-white bg-[#579BFC] block text-center shadow-2xs">GRÁTIS</span>',
    dash: '<span class="px-3 py-1 rounded text-[11px] font-black text-white bg-[#00C875] block text-center shadow-2xs">DASH</span>',
    report: '<span class="px-3 py-1 rounded text-[11px] font-black text-white bg-[#A25DDC] block text-center shadow-2xs">REPORT</span>',
    midia: '<span class="px-3 py-1 rounded text-[11px] font-black text-white bg-[#FDAB3D] block text-center shadow-2xs">MÍDIA VIP</span>'
  };

  const mondayStageBadges = {
    lead: '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">Novo Cadastro</span>',
    ativo: '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">Assinante Ativo</span>',
    oportunidade: '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">Em Negociação</span>'
  };

  const consultiveQuestions = {
    empresario: [
      'Qual região ou bairro de SJC hoje mais impacta o faturamento do seu negócio?',
      'Você tem sentido a concorrência se movimentar mais forte no digital ou ponto físico?'
    ],
    gestor: [
      'Quais métricas de mercado você mais precisa validar com a diretoria neste trimestre?',
      'Como vocês estão projetando a demanda de consumo para a região de SJC em 2026?'
    ],
    marketing: [
      'Quais canais de mídia em SJC hoje entregam o melhor retorno real para as suas campanhas?',
      'Você já viu os recortes de tempo de tela e consumo digital da pesquisa para a sua persona?'
    ],
    imobiliario: [
      'Qual zona de São José você considera mais promissora para lançamentos nos próximos 18 meses?',
      'Os dados mostram evasão e atratividade por bairro. Gostaria de ver o mapa comparativo?'
    ],
    geral: [
      'Conseguiu navegar nos dados da pesquisa de São José dos Campos?',
      'Tem algum setor específico da cidade que você gostaria de ver com mais profundidade?'
    ]
  };

  let allAccounts = [];
  let page = 1;
  let loading = false;

  function formatPhone(raw) {
    if (!raw) return '';
    const digits = String(raw).replace(/\D/g, '');
    if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return raw;
  }

  function getWhatsAppLink(rawPhone, name, profile) {
    if (!rawPhone) return null;
    let digits = String(rawPhone).replace(/\D/g, '');
    if (!digits) return null;
    if (digits.length <= 11) digits = '55' + digits;
    const greeting = encodeURIComponent(`Olá, ${name || 'tudo bem'}! Aqui é do Radar São José. Vi que você acessou como ${profile || 'usuário'} e gostaria de saber se conseguiu visualizar os dados do seu setor!`);
    return `https://wa.me/${digits}?text=${greeting}`;
  }

  window.openConsultiveDrawer = function(accountJson) {
    try {
      const acc = JSON.parse(decodeURIComponent(accountJson));
      const questions = consultiveQuestions[acc.profile] || consultiveQuestions.geral;
      const qHtml = questions.map((q, idx) => `
        <li class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2.5">
          <span class="w-5 h-5 rounded-full bg-[#0073EA] text-white flex items-center justify-center text-[10px] font-black shrink-0">${idx + 1}</span>
          <span class="leading-relaxed font-medium">${q}</span>
        </li>
      `).join('');
      const waLink = getWhatsAppLink(acc.phone, acc.name, profiles[acc.profile] || 'usuário');

      const modalHtml = `
        <div id="crm-lead-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 relative">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#0073EA]/10 text-[#0073EA] font-black text-sm flex items-center justify-center">
                  ${(acc.name || 'U').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 class="text-base font-black text-slate-900">${acc.name}</h3>
                  <p class="text-xs text-slate-500 font-medium">${acc.email}</p>
                </div>
              </div>
              <button onclick="document.getElementById('crm-lead-modal').remove()" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">&times;</button>
            </div>
            
            <div class="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-slate-400 block font-bold text-[10px] uppercase tracking-wider mb-0.5">Perfil Declarado</span>
                <span class="font-extrabold text-slate-900">${profiles[acc.profile] || acc.profile || 'Geral'}</span>
              </div>
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-slate-400 block font-bold text-[10px] uppercase tracking-wider mb-0.5">Plano Comercial</span>
                <span class="font-extrabold text-slate-900 uppercase">${acc.plan || 'Grátis'}</span>
              </div>
            </div>

            <div class="mb-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-black uppercase tracking-wider text-slate-600">Perguntas Consultivas (CS & CX)</span>
                <span class="text-[10px] font-bold text-slate-400">Roteiro Inteligente</span>
              </div>
              <ul class="space-y-2.5">${qHtml}</ul>
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button onclick="document.getElementById('crm-lead-modal').remove()" class="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">Fechar</button>
              ${waLink ? `
                <a href="${waLink}" target="_blank" rel="noopener" class="px-4 py-2.5 rounded-xl text-xs font-black bg-[#00C875] hover:bg-[#00B468] text-white flex items-center gap-2 shadow-sm transition-all">
                  <i class="fa-brands fa-whatsapp text-sm"></i> Iniciar Contato via WhatsApp
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      `;
      const prevModal = document.getElementById('crm-lead-modal');
      if (prevModal) prevModal.remove();
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    } catch (e) {
      console.error('Erro ao abrir roteiro consultivo:', e);
    }
  };

  function renderRows(accounts) {
    if (!list) return;
    list.replaceChildren();

    if (!accounts || accounts.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="8" class="py-12 text-center text-slate-400 font-semibold">Nenhum contato encontrado no momento.</td>';
      list.appendChild(emptyRow);
      return;
    }

    accounts.forEach((acc, idx) => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-slate-50/70 transition-colors border-b border-slate-100 group';

      const profileLabel = profiles[acc.profile] || acc.profile || 'Geral';
      const phoneFormatted = formatPhone(acc.phone);
      const waLink = getWhatsAppLink(acc.phone, acc.name, profileLabel);
      const planBadge = mondayStatusBadges[acc.plan] || mondayStatusBadges.gratis;
      const stageBadge = acc.plan && acc.plan !== 'gratis' ? mondayStageBadges.ativo : mondayStageBadges.lead;
      const encodedAcc = encodeURIComponent(JSON.stringify(acc));

      row.innerHTML = `
        <td class="py-3.5 pl-6 pr-4 text-slate-400 font-mono text-[11px]">${idx + 1}</td>
        <td class="py-3.5 pr-4">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full ${acc.plan && acc.plan !== 'gratis' ? 'bg-[#00C875]' : 'bg-[#579BFC]'} shrink-0"></span>
            <span class="font-extrabold text-slate-900 group-hover:text-[#0073EA] transition-colors">${acc.name || 'Sem nome'}</span>
          </div>
        </td>
        <td class="py-3.5 pr-4 text-slate-600 font-medium">${acc.email || '—'}</td>
        <td class="py-3.5 pr-4 text-center">
          ${waLink ? `
            <a href="${waLink}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition-all shadow-2xs" title="Conversar no WhatsApp">
              <i class="fa-brands fa-whatsapp text-emerald-600 text-sm"></i> ${phoneFormatted}
            </a>
          ` : (phoneFormatted ? `<span class="text-xs text-slate-600 font-medium">${phoneFormatted}</span>` : `<span class="text-xs text-slate-400 italic">Não informado</span>`)}
        </td>
        <td class="py-3.5 pr-4 text-center">
          <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-block">${profileLabel}</span>
        </td>
        <td class="py-3.5 pr-4 text-center w-28">
          ${planBadge}
        </td>
        <td class="py-3.5 pr-4 text-center">
          ${stageBadge}
        </td>
        <td class="py-3.5 pr-6 text-right">
          <button onclick="openConsultiveDrawer('${encodedAcc}')" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0073EA] hover:text-white text-slate-700 font-bold text-xs transition-all shadow-2xs flex items-center gap-1.5 ml-auto">
            <i class="fa-regular fa-comment-dots"></i> Roteiro
          </button>
        </td>
      `;
      list.appendChild(row);
    });
  }

  function updateKpis(accounts) {
    if (!accounts) return;
    const total = accounts.length;
    const gratis = accounts.filter(a => !a.plan || a.plan === 'gratis').length;
    const pagos = accounts.filter(a => a.plan && a.plan !== 'gratis').length;
    const convRate = total > 0 ? ((pagos / total) * 100).toFixed(1) + '%' : '0%';

    if (kpiGratis) kpiGratis.textContent = gratis;
    if (kpiPagos) kpiPagos.textContent = pagos;
    if (kpiNovos) kpiNovos.textContent = gratis;
    if (kpiConversao) kpiConversao.textContent = convRate;
    if (countEl) countEl.textContent = `${total} contato(s) cadastrado(s)`;
  }

  async function loadMondayCrm(requestedPage) {
    if (loading) return;
    loading = true;
    if (previous) previous.disabled = true;
    if (next) next.disabled = true;
    if (status) status.textContent = 'Carregando base de usuários...';

    try {
      const { data } = await window.supabaseClient.auth.getSession();
      if (!data.session?.access_token) throw new Error('Sessão ausente');
      const response = await fetch('/api/crm-accounts?page=' + requestedPage, {
        headers: { Authorization: 'Bearer ' + data.session.access_token }
      });
      if (!response.ok) throw new Error('Falha ao obter lista');

      const result = await response.json();
      allAccounts = result.accounts || [];
      renderRows(allAccounts);
      updateKpis(allAccounts);

      page = requestedPage;
      if (pageInfo) pageInfo.textContent = `Página ${page}`;
      if (status) status.textContent = '';
      if (previous) previous.disabled = page <= 1;
      if (next) next.disabled = !result.hasNextPage;
    } catch (err) {
      if (status) status.textContent = 'Erro ao sincronizar. Verifique a permissão.';
      console.warn('[Monday CRM Error]:', err);
    } finally {
      loading = false;
    }
  }

  window.loadMondayCrm = loadMondayCrm;

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = (e.target.value || '').toLowerCase().trim();
      if (!query) {
        renderRows(allAccounts);
        return;
      }
      const filtered = allAccounts.filter(a => 
        (a.name || '').toLowerCase().includes(query) ||
        (a.email || '').toLowerCase().includes(query) ||
        (profiles[a.profile] || a.profile || '').toLowerCase().includes(query)
      );
      renderRows(filtered);
    });
  }

  if (previous) previous.addEventListener('click', () => loadMondayCrm(page - 1));
  if (next) next.addEventListener('click', () => loadMondayCrm(page + 1));

  // Carrega automaticamente assim que o DOM carregar
  document.addEventListener('DOMContentLoaded', () => {
    loadMondayCrm(1);
  });
  // Se o DOM já tiver carregado:
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => loadMondayCrm(1), 200);
  }
})();
