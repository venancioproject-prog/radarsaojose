(function () {
  'use strict';

  const profiles = window.radarContact.profiles;
  const stages = {
    novo: 'Novo cadastro', contato: 'Contato iniciado', interesse: 'Interesse declarado',
    acompanhamento: 'Em acompanhamento', sem_interesse: 'Sem interesse'
  };
  const plans = { gratis: 'Grátis', dash: 'Dash', report: 'Report', midia: 'Mídia' };
  const list = document.getElementById('crm-accounts-list');
  const status = document.getElementById('crm-accounts-status');
  const previous = document.getElementById('crm-accounts-previous');
  const next = document.getElementById('crm-accounts-next');
  const search = document.getElementById('mondaySearch');
  let page = 1;
  let controller;
  let accounts = [];
  let followupsAvailable = false;
  let activeDialog;
  let searchTimer;
  let viewMode = 'table';
  const board = document.getElementById('crm-board-view');
  const tableView = document.getElementById('crm-table-view');
  const refreshButton = document.getElementById('crm-accounts-refresh');

  function element(tag, text, classes) {
    const node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = String(text);
    if (classes) node.className = classes;
    return node;
  }

  function dateLabel(value) {
    if (!value) return 'Não informado';
    const date = new Date(value.length === 10 ? value + 'T12:00:00' : value);
    return Number.isFinite(date.getTime()) ? date.toLocaleDateString('pt-BR') : 'Não informado';
  }

  function whatsapp(account) {
    const phone = window.radarContact.normalizePhone(account.phone);
    if (!phone) return null;
    const greeting = 'Olá, ' + (account.name || 'tudo bem') + '! Aqui é da equipe do Radar São José.';
    const link = element('a', account.phone, 'font-bold text-emerald-700 underline');
    link.href = 'https://wa.me/' + phone.slice(1) + '?text=' + encodeURIComponent(greeting);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  async function authorizedFetch(url, options = {}) {
    const { data, error } = await window.supabaseClient.auth.getSession();
    if (error || !data.session?.access_token) throw new Error('Sua sessão terminou. Entre novamente.');
    const response = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: 'Bearer ' + data.session.access_token },
      cache: 'no-store'
    });
    if (response.status === 401) throw new Error('Sua sessão terminou. Entre novamente.');
    if (response.status === 403) {
      window.location.replace('seguranca-conta.html?destino=admin');
      throw new Error('Confirme o autenticador para continuar.');
    }
    return response;
  }

  function renderRows() {
    list.replaceChildren();
    if (!accounts.length) {
      const row = element('tr');
      const cell = element('td', 'Nenhum cadastro encontrado com estes filtros.', 'p-8 text-center text-slate-500');
      cell.colSpan = 8;
      row.append(cell);
      list.append(row);
      renderBoard();
      return;
    }
    accounts.forEach((account, index) => {
      const row = element('tr');
      row.append(element('td', (page - 1) * 50 + index + 1));
      const contact = element('td');
      const identity = element('div', null, 'crm-contact-cell');
      const avatar = element('span', initials(account), 'crm-avatar');
      avatar.setAttribute('aria-hidden', 'true');
      const identityText = element('div');
      const name = element('button', account.name || 'Nome não informado', 'crm-contact-name');
      name.type = 'button';
      name.addEventListener('click', () => openAccount(account, name));
      identityText.append(name, element('p', account.email || 'E-mail não informado', 'crm-contact-email'));
      identity.append(avatar, identityText);
      contact.append(identity);
      row.append(contact);
      const phoneCell = element('td');
      phoneCell.append(whatsapp(account) || element('span', 'Não informado', 'text-slate-400'));
      row.append(phoneCell);
      row.append(element('td', profiles[account.profile] || 'Não informado'));
      const access = account.isAdmin ? 'Administrador' : plans[account.plan] || 'Grátis';
      const planCell = element('td');
      planCell.append(element('span', access, 'crm-badge' + (account.isAdmin ? ' crm-badge-admin' : account.plan !== 'gratis' ? ' crm-badge-paid' : '')));
      if (account.isGuest) planCell.append(element('div', 'Convidado Mídia', 'mt-1 text-xs text-slate-500'));
      row.append(planCell);
      const stageCell = element('td');
      const stage = Object.hasOwn(stages, account.followup?.stage) ? account.followup.stage : 'novo';
      stageCell.append(element('span', followupsAvailable ? stages[stage] : 'Indisponível', 'crm-badge crm-stage-' + stage));
      row.append(stageCell);
      row.append(element('td', followupsAvailable ? nextContactLabel(account) : 'Indisponível', dateClass(account)));
      const action = element('td');
      const button = element('button', 'Abrir ficha', 'crm-btn');
      button.type = 'button';
      button.addEventListener('click', () => openAccount(account, button));
      action.append(button);
      row.append(action);
      list.append(row);
    });
    renderBoard();
  }

  function initials(account) {
    return (account.name || account.email || 'Contato').trim().split(/\s+/).slice(0, 2)
      .map(part => Array.from(part)[0] || '').join('').toLocaleUpperCase('pt-BR');
  }

  function today() {
    const date = new Date();
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }

  function dateClass(account) {
    const date = account.followup?.next_contact_date;
    return !date ? '' : date < today() ? 'crm-date-overdue' : date === today() ? 'crm-date-today' : '';
  }

  function nextContactLabel(account) {
    const date = account.followup?.next_contact_date;
    return !date ? 'Sem data definida' : date === today() ? 'Hoje' : (date < today() ? 'Atrasado · ' : '') + dateLabel(date);
  }

  function renderBoard() {
    if (!board) return;
    board.replaceChildren();
    const commercial = accounts.filter(account => !account.isAdmin);
    if (!followupsAvailable) {
      board.append(element('p', 'O acompanhamento está indisponível. A tabela continua mostrando os acessos dos contatos.', 'crm-column-empty'));
    } else {
      Object.entries(stages).forEach(([key, label]) => {
        const column = element('section', null, 'crm-column');
        const contacts = commercial.filter(account => (account.followup?.stage || 'novo') === key);
        const heading = element('h3', null, 'crm-column-heading');
        heading.append(element('span', label), element('span', contacts.length, 'crm-column-count'));
        column.append(heading);
        if (!contacts.length) column.append(element('p', 'Nenhum contato nesta página.', 'crm-column-empty'));
        contacts.forEach(account => {
          const card = element('button', null, 'crm-board-contact');
          card.type = 'button';
          card.append(element('p', account.name || 'Contato sem nome', 'crm-board-name'),
            element('p', account.email || 'E-mail não informado', 'crm-board-meta'),
            element('p', plans[account.plan] || 'Grátis', 'crm-board-meta'),
            element('p', nextContactLabel(account), 'crm-board-meta ' + dateClass(account)));
          card.addEventListener('click', () => openAccount(account, card));
          column.append(card);
        });
        board.append(column);
      });
    }
    const summary = document.getElementById('crm-page-summary');
    if (summary) {
      const due = commercial.filter(account => account.followup?.next_contact_date && account.followup.next_contact_date <= today()).length;
      summary.textContent = followupsAvailable
        ? commercial.length + ' contato(s) comerciais nesta página · ' + due + ' retorno(s) para hoje ou atrasados. O quadro usa esta página; administradores aparecem apenas na tabela.'
        : 'Acompanhamento indisponível. Etapas e datas não foram presumidas.';
    }
  }

  function setView(mode) {
    viewMode = mode;
    if (tableView) tableView.hidden = viewMode !== 'table';
    if (board) board.hidden = viewMode !== 'board';
    document.getElementById('crm-view-table')?.setAttribute('aria-pressed', String(viewMode === 'table'));
    document.getElementById('crm-view-board')?.setAttribute('aria-pressed', String(viewMode === 'board'));
  }

  function setMetrics(metrics) {
    const values = {
      mondayKpiGratis: metrics?.free,
      mondayKpiPagos: metrics?.paid,
      mondayKpiNovos: metrics?.newLast30Days,
      mondayKpiConversao: metrics ? metrics.paidShare.toLocaleString('pt-BR') + '%' : null
    };
    Object.entries(values).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = value ?? '—';
    });
  }

  const planFilter = element('select', null, 'px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800');
  planFilter.setAttribute('aria-label', 'Filtrar por plano');
  planFilter.id = 'crm-plan-filter';
  [['', 'Todos os planos'], ...Object.entries(plans), ['admin', 'Administradores']].forEach(([value, label]) => {
    const option = element('option', label);
    option.value = value;
    planFilter.append(option);
  });
  const profileFilter = element('select', null, planFilter.className);
  profileFilter.setAttribute('aria-label', 'Filtrar por perfil');
  profileFilter.id = 'crm-profile-filter';
  [['', 'Todos os perfis'], ...Object.entries(profiles)].forEach(([value, label]) => {
    const option = element('option', label);
    option.value = value;
    profileFilter.append(option);
  });
  const filterBar = element('div', null, 'crm-filter-bar');
  filterBar.append(planFilter, profileFilter);
  const clearFilters = element('button', 'Limpar filtros', 'crm-btn');
  clearFilters.type = 'button';
  clearFilters.addEventListener('click', () => {
    search.value = ''; planFilter.value = ''; profileFilter.value = '';
    clearTimeout(searchTimer); loadRadarCrm(1);
  });
  filterBar.append(clearFilters);
  const tableContainer = list.closest('.overflow-x-auto');
  const filterHost = document.getElementById('crm-filters-host');
  if (filterHost) filterHost.append(filterBar);
  else tableContainer.parentElement.before(filterBar);

  async function loadRadarCrm(requestedPage = page) {
    if (!window.currentAdminUser) return;
    controller?.abort();
    const request = new AbortController();
    controller = request;
    previous.disabled = true;
    next.disabled = true;
    if (refreshButton) refreshButton.disabled = true;
    status.textContent = 'Carregando cadastros…';
    status.setAttribute('role', 'status');
    try {
      const query = new URLSearchParams({
        page: requestedPage,
        search: search.value.trim(),
        plan: planFilter.value,
        profile: profileFilter.value
      });
      const response = await authorizedFetch('/api/crm-accounts?' + query, { signal: request.signal });
      if (!response.ok) throw new Error('Não foi possível consultar a base. Clique em Atualizar para tentar novamente.');
      const result = await response.json();
      if (controller !== request) return;
      page = result.page;
      accounts = result.accounts;
      followupsAvailable = result.followupsAvailable;
      renderRows();
      setMetrics(result.metrics);
      document.getElementById('mondayListCount').textContent = result.total + ' cadastro(s) encontrado(s)';
      document.getElementById('mondayPageInfo').textContent = 'Página ' + page + ' de ' + result.totalPages;
      status.textContent = followupsAvailable ? '' : 'Base carregada. Salvamento de acompanhamento indisponível no momento.';
      previous.disabled = page <= 1;
      next.disabled = !result.hasNextPage;
    } catch (error) {
      if (request.signal.aborted || controller !== request) return;
      accounts = [];
      renderRows();
      setMetrics(null);
      document.getElementById('mondayListCount').textContent = 'Consulta indisponível';
      status.textContent = error.message || 'Não foi possível consultar a base.';
    } finally {
      if (controller === request && refreshButton) refreshButton.disabled = false;
    }
  }

  function openAccount(account, opener) {
    activeDialog?.remove();
    const dialog = element('dialog', null, 'crm-contact-dialog');
    dialog.setAttribute('aria-labelledby', 'crm-contact-title');
    const title = element('h2', account.name || 'Contato sem nome', 'text-xl font-bold');
    title.id = 'crm-contact-title';
    const close = element('button', 'Fechar', 'crm-btn');
    close.setAttribute('aria-label', 'Fechar ficha do contato');
    close.type = 'button';
    const header = element('div', null, 'crm-dialog-header');
    const identity = element('div');
    identity.append(title, element('p', account.email || 'E-mail não informado', 'text-xs text-slate-500'));
    header.append(element('span', initials(account), 'crm-avatar'), identity, close);
    dialog.append(header);
    const body = element('div', null, 'crm-dialog-body');
    dialog.append(body);
    const details = element('dl', null, 'crm-detail-grid');
    const rows = [
      ['E-mail', account.email],
      ['Perfil declarado', profiles[account.profile] || 'Não informado'],
      ['Acesso vigente', account.isAdmin ? 'Administrador' : plans[account.plan]],
      ['Origem do acesso', account.isAdmin ? 'Administração' : account.isGuest ? 'Convite Mídia' : account.plan === 'gratis' ? 'Gratuito' : 'Assinatura'],
      ['Validade do plano', dateLabel(account.periodEnd)],
      ['Cadastro', dateLabel(account.createdAt)],
      ['E-mail confirmado', account.emailConfirmed ? 'Sim' : 'Pendente'],
      ['Termos aceitos', account.termsAcceptedAt ? dateLabel(account.termsAcceptedAt) : 'Pendente'],
      ['Primeiro acesso', account.firstAccessComplete ? 'Completo' : 'Pendente']
    ];
    rows.forEach(([label, value]) => {
      const group = element('div', null, 'min-w-0');
      group.append(element('dt', label, 'text-xs text-slate-500'), element('dd', value || 'Não informado', 'break-words'));
      details.append(group);
    });
    body.append(details);
    const phone = whatsapp(account);
    if (phone) {
      phone.textContent = 'Conversar pelo WhatsApp';
      body.append(phone);
    }
    const form = element('form', null, 'mt-5 space-y-3');
    const stageLabel = element('label', 'Etapa do acompanhamento', 'block text-sm font-bold');
    const stage = element('select', null, 'block w-full mt-1 p-2 border rounded-lg bg-white text-slate-900');
    stage.name = 'stage';
    Object.entries(stages).forEach(([value, label]) => {
      const option = element('option', label);
      option.value = value;
      stage.append(option);
    });
    stageLabel.append(stage);
    const notesLabel = element('label', 'Anotações da equipe', 'block text-sm font-bold');
    const notes = element('textarea', null, 'block w-full mt-1 p-2 border rounded-lg bg-white text-slate-900');
    notes.name = 'notes';
    notes.rows = 4;
    notes.maxLength = 5000;
    notesLabel.append(notes);
    const dateLabelNode = element('label', 'Próximo contato (opcional)', 'block text-sm font-bold');
    const date = element('input', null, 'block w-full mt-1 p-2 border rounded-lg bg-white text-slate-900');
    date.type = 'date';
    date.name = 'nextContactDate';
    dateLabelNode.append(date);
    const save = element('button', 'Salvar acompanhamento', 'px-4 py-2 rounded-lg bg-sky-700 text-white font-bold disabled:opacity-50');
    save.type = 'submit';
    const message = element('p', 'Carregando acompanhamento…', 'text-sm text-slate-600');
    message.setAttribute('role', 'status');
    const history = element('div', null, 'mt-5 space-y-3 text-sm');
    form.append(stageLabel, notesLabel, dateLabelNode, save, message);
    body.append(form, history);
    let revision = account.followup?.revision || 0;
    let saving = false;
    let writable = false;
    function fill(followup) {
      revision = followup?.revision || 0;
      stage.value = followup?.stage || 'novo';
      notes.value = followup?.notes || '';
      date.value = followup?.next_contact_date || '';
    }
    function setEnabled(enabled) {
      [stage, notes, date, save].forEach(input => { input.disabled = !enabled; });
    }
    fill(account.followup);
    setEnabled(false);
    function finish() {
      if (saving) return;
      dialog.close();
    }
    close.addEventListener('click', finish);
    dialog.addEventListener('cancel', event => { if (saving) event.preventDefault(); });
    dialog.addEventListener('close', () => {
      dialog.remove();
      if (activeDialog === dialog) activeDialog = null;
      if (opener.isConnected) opener.focus();
      else search.focus();
    });
    document.body.append(dialog);
    activeDialog = dialog;
    dialog.showModal();
    close.focus();

    async function refreshFollowup() {
      try {
        const response = await authorizedFetch('/api/crm-accounts?userId=' + encodeURIComponent(account.id));
        if (!response.ok) throw new Error('O acompanhamento está indisponível. A equipe precisa conferir a configuração do CRM.');
        const result = await response.json();
        if (activeDialog !== dialog) return;
        fill(result.followup);
        account.followup = result.followup;
        writable = true;
        setEnabled(true);
        message.textContent = result.followup ? 'Última atualização em ' + dateLabel(result.followup.updated_at) + '.' : 'Nenhum contato registrado pela equipe.';
        history.replaceChildren(element('h3', 'Histórico de alterações', 'crm-history-title'));
        if (!result.history.length) history.append(element('p', 'Sem alterações registradas.', 'text-slate-500'));
        result.history.forEach(item => {
          const entry = element('div', null, 'crm-history-entry');
          entry.append(element('p', dateLabel(item.changed_at) + ' · ' + stages[item.stage], 'font-semibold'));
          if (item.notes) entry.append(element('p', item.notes, 'whitespace-pre-wrap break-words'));
          if (item.next_contact_date) entry.append(element('p', 'Próximo contato em ' + dateLabel(item.next_contact_date)));
          history.append(entry);
        });
        return true;
      } catch (error) {
        if (activeDialog !== dialog) return;
        message.textContent = error.message;
        writable = false;
        setEnabled(false);
        return false;
      }
    }
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (saving || !writable) return;
      saving = true;
      setEnabled(false);
      message.textContent = 'Salvando…';
      try {
        const response = await authorizedFetch('/api/crm-accounts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: account.id, stage: stage.value, notes: notes.value,
            nextContactDate: date.value || null, revision
          })
        });
        if (response.status === 409) {
          writable = false;
          throw new Error('Outra pessoa atualizou esta ficha. Copie sua anotação e reabra a ficha para conferir a versão atual.');
        }
        if (!response.ok) throw new Error('Não foi possível salvar. Suas alterações continuam no formulário para tentar novamente.');
        const result = await response.json();
        account.followup = result.followup;
        revision = result.followup.revision;
        renderRows();
        const refreshed = await refreshFollowup();
        message.textContent = refreshed ? 'Acompanhamento salvo no banco.'
          : 'Acompanhamento salvo. Não foi possível atualizar o histórico; reabra a ficha para conferir.';
      } catch (error) {
        message.textContent = error.message;
      } finally {
        saving = false;
        setEnabled(writable);
      }
    });
    refreshFollowup();
  }

  function updateFilters() { loadRadarCrm(1); }
  search.placeholder = 'Buscar nome, e-mail, telefone ou perfil';
  search.setAttribute('aria-label', 'Buscar cadastros em toda a base');
  search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(updateFilters, 300);
  });
  planFilter.addEventListener('change', updateFilters);
  profileFilter.addEventListener('change', updateFilters);
  document.getElementById('crm-view-table')?.addEventListener('click', () => setView('table'));
  document.getElementById('crm-view-board')?.addEventListener('click', () => setView('board'));
  refreshButton?.addEventListener('click', () => loadRadarCrm(page));
  previous.addEventListener('click', () => loadRadarCrm(page - 1));
  next.addEventListener('click', () => loadRadarCrm(page + 1));
  window.loadRadarCrm = loadRadarCrm;
  window.loadMondayCrm = loadRadarCrm;

  function ready() {
    const admin = window.currentAdminUser;
    if (!admin) return;
    document.getElementById('crm-admin-name').textContent = admin.nome || 'Administrador';
    document.getElementById('crm-admin-email').textContent = admin.email || '';
    loadRadarCrm(1);
  }
  window.addEventListener('radar-admin-ready', ready);
  ready();
  document.getElementById('crm-signout').addEventListener('click', async event => {
    event.preventDefault();
    try {
      const { error } = await window.supabaseClient.auth.signOut();
      if (error) throw error;
      ['radarsaojose_crm_subscribers_v3', 'radarsaojose_crm_subscribers_v2',
        'radarsaojose_crm_subscribers', 'radar_crm_inbound'].forEach(key => localStorage.removeItem(key));
      window.location.replace('login.html');
    } catch {
      status.textContent = 'Não foi possível encerrar sua sessão. Tente novamente.';
    }
  });
})();
