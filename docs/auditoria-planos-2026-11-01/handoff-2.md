Agente 2: removida concessão de plano no checkout, storage e escrita cliente em profiles.
Conclusão consulta usuário autenticado e perfil confirmado; erro/pendência não libera plano.
Simulador de planos agora só recarrega confirmação; removido atalho admin por texto do e-mail.
Gates principais deixam de aceitar plano/role do localStorage.
Arquivos: app.js, asaas-checkout-modal.js, tests/billing-browser-security.test.cjs.
PENDÊNCIAS: proteção real de dados premium e vigência cabe ao backend/RLS (agentes 1/7).
PENDÊNCIAS: agente 9 deve preservar refreshConfirmedPlan como única confirmação visual.
