(function () {
  const section = document.getElementById('crm-registered-accounts');
  const status = document.getElementById('crm-accounts-status');
  const list = document.getElementById('crm-accounts-list');
  const previous = document.getElementById('crm-accounts-previous');
  const next = document.getElementById('crm-accounts-next');
  const profiles = {
    empresario: 'Empresário(a) ou empreendedor(a)', gestor: 'Diretor(a) ou gestor(a)',
    marketing: 'Marketing', agencia: 'Agência ou publicidade', investidor: 'Investidor(a)',
    imobiliario: 'Setor imobiliário', consultor: 'Consultoria', inteligencia: 'Pesquisa ou inteligência de mercado',
    setor_publico: 'Setor público', comunicacao: 'Jornalismo ou comunicação',
    professor: 'Professor(a)', estudante: 'Estudante', outros: 'Outros'
  };
  let page = 1;
  let loading = false;

  async function load(requestedPage) {
    if (loading) return;
    loading = true;
    previous.disabled = next.disabled = true;
    list.replaceChildren();
    status.textContent = 'Carregando contas…';
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
        row.className = 'border-t border-slate-100';
        const profile = Object.hasOwn(profiles, account.profile) ? profiles[account.profile] : '—';
        for (const value of [account.name || '—', account.email || '—', profile, account.firstAccessComplete ? 'Concluído' : 'Pendente']) {
          const cell = document.createElement('td');
          cell.className = 'py-2 pr-4';
          cell.textContent = value;
          row.appendChild(cell);
        }
        return row;
      });
      list.replaceChildren(...rows);
      page = requestedPage;
      status.textContent = rows.length ? 'Página ' + page : 'Nenhuma conta nesta página.';
      previous.disabled = page <= 1;
      next.disabled = !result.hasNextPage;
    } catch {
      status.textContent = 'Não foi possível carregar as contas. Feche e abra esta seção para tentar novamente.';
    } finally {
      loading = false;
    }
  }

  section.addEventListener('toggle', () => { if (section.open) load(1); });
  previous.addEventListener('click', () => load(page - 1));
  next.addEventListener('click', () => load(page + 1));
})();
