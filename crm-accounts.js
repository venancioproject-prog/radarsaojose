(function () {
  const section = document.getElementById('crm-registered-accounts');
  const status = document.getElementById('crm-accounts-status');
  const list = document.getElementById('crm-accounts-list');
  const previous = document.getElementById('crm-accounts-previous');
  const next = document.getElementById('crm-accounts-next');
  
  const profiles = {
    empresario: 'Empresário(a)',
    gestor: 'Diretor(a) / Gestor(a)',
    marketing: 'Marketing',
    agencia: 'Agência / Publicidade',
    investidor: 'Investidor(a)',
    imobiliario: 'Setor Imobiliário',
    consultor: 'Consultoria',
    inteligencia: 'Pesquisa / Inteligência',
    setor_publico: 'Setor Público',
    comunicacao: 'Comunicação / Jornalismo',
    professor: 'Professor(a)',
    estudante: 'Estudante',
    outros: 'Geral / Outros'
  };

  const planBadges = {
    gratis: '<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">Grátis</span>',
    dash: '<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-100 text-cyan-800">Dash</span>',
    report: '<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">Report</span>',
    midia: '<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Mídia VIP</span>'
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
      const qHtml = questions.map((q, idx) => `<li class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800"><strong>${idx + 1}.</strong> ${q}</li>`).join('');
      const waLink = getWhatsAppLink(acc.phone, acc.name, profiles[acc.profile] || 'usuário');

      const modalHtml = `
        <div id="crm-lead-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 class="text-base font-black text-slate-900">${acc.name}</h3>
                <p class="text-xs text-slate-500">${acc.email}</p>
              </div>
              <button onclick="document.getElementById('crm-lead-modal').remove()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">&times;</button>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-slate-400 block font-bold">Perfil Declarado</span>
                <span class="font-extrabold text-slate-800">${profiles[acc.profile] || acc.profile || 'Geral'}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-slate-400 block font-bold">Plano Atual</span>
                <span class="font-extrabold text-slate-800 uppercase">${acc.plan || 'Grátis'}</span>
              </div>
            </div>
            <div class="mb-4">
              <span class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Roteiro Consultivo Sugerido (CS & CX)</span>
              <ul class="space-y-2">${qHtml}</ul>
            </div>
            <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button onclick="document.getElementById('crm-lead-modal').remove()" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">Fechar</button>
              ${waLink ? `<a href="${waLink}" target="_blank" rel="noopener" class="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"><i class="fa-brands fa-whatsapp text-sm"></i> Chamar no WhatsApp</a>` : ''}
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

  async function load(requestedPage) {
    if (loading) return;
    loading = true;
    previous.disabled = next.disabled = true;
    list.replaceChildren();
    status.textContent = 'Carregando contas reais da plataforma…';
    try {
      const { data } = await window.supabaseClient.auth.getSession();
      if (!data.session?.access_token) throw new Error('Sessão ausente');
      const response = await fetch('/api/crm-accounts?page=' + requestedPage, {
        headers: { Authorization: 'Bearer ' + data.session.access_token }
      });
      if (response.status === 403) {
        status.textContent = 'A lista está disponível para administradores do Radar.';
        return;
      }
      if (!response.ok) throw new Error('Lista indisponível');

      const result = await response.json();
      const rows = result.accounts.map(account => {
        const row = document.createElement('tr');
        row.className = 'border-t border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer';
        
        const profileLabel = profiles[account.profile] || account.profile || 'Geral';
        const phoneFormatted = formatPhone(account.phone);
        const waLink = getWhatsAppLink(account.phone, account.name, profileLabel);
        const badge = planBadges[account.plan] || planBadges.gratis;
        const encodedAcc = encodeURIComponent(JSON.stringify(account));

        row.innerHTML = `
          <td class="py-3 pr-4 font-bold text-slate-900">${account.name || 'Sem nome'}</td>
          <td class="py-3 pr-4 text-slate-600">${account.email || '—'}</td>
          <td class="py-3 pr-4">
            ${waLink ? `
              <a href="${waLink}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition-colors" title="Conversar no WhatsApp">
                <i class="fa-brands fa-whatsapp text-emerald-600"></i> ${phoneFormatted}
              </a>
            ` : (phoneFormatted ? `<span class="text-xs text-slate-600">${phoneFormatted}</span>` : `<span class="text-xs text-slate-400 italic">Não informado</span>`)}
          </td>
          <td class="py-3 pr-4 text-xs font-semibold text-slate-700">${profileLabel}</td>
          <td class="py-3 pr-4">${badge}</td>
          <td class="py-3 text-right">
            <button onclick="openConsultiveDrawer('${encodedAcc}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors" title="Ver roteiro de abordagem consultiva">
              <i class="fa-solid fa-comments text-cyan-700 mr-1"></i> Abordagem
            </button>
          </td>
        `;
        return row;
      });

      list.replaceChildren(...rows);
      page = requestedPage;
      status.textContent = rows.length ? `Exibindo ${rows.length} conta(s) - Página ${page}` : 'Nenhuma conta encontrada.';
      previous.disabled = page <= 1;
      next.disabled = !result.hasNextPage;
    } catch {
      status.textContent = 'Não foi possível carregar as contas. Tente novamente.';
    } finally {
      loading = false;
    }
  }

  section.addEventListener('toggle', () => { if (section.open) load(1); });
  previous.addEventListener('click', () => load(page - 1));
  next.addEventListener('click', () => load(page + 1));
})();
