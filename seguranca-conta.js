document.addEventListener("DOMContentLoaded", async () => {
  const description = document.getElementById("description");
  const enroll = document.getElementById("enroll");
  const setup = document.getElementById("setup");
  const form = document.getElementById("challenge");
  const status = document.getElementById("status");
  const back = document.getElementById("back");
  const keyField = document.getElementById("key");
  const { url, key } = window.radarSupabaseConfig || {};
  let factorId;

  try {
    if (!url || !key || !window.supabase) throw new Error("Configuração indisponível");
    const client = window.supabase.createClient(url, key);
    const { data, error } = await client.auth.getUser();
    if (error || !data?.user) {
      window.location.replace("login.html");
      return;
    }
    const user = data.user;
    const signOut = document.getElementById("sign-out");
    signOut.hidden = false;
    signOut.addEventListener("click", async () => {
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) {
        status.textContent = "Não foi possível sair. Tente novamente.";
        return;
      }
      window.location.replace("login.html");
    });
    const admin = user.app_metadata?.role === "admin" || user.app_metadata?.is_admin === true;
    const target = admin && new URLSearchParams(location.search).get("destino") === "admin" ? "admin-crm.html" : "app.html";
    const mfa = await window.radarMfa.status(client, user);
    const { data: factors, error: factorError } = await client.auth.mfa.listFactors();
    if (factorError) throw factorError;
    factorId = factors.totp?.find(factor => factor.status === "verified")?.id;

    status.textContent = "";
    back.href = target;
    back.hidden = mfa.required;
    if (factorId && !mfa.required) {
      description.textContent = "Verificação em duas etapas ativa.";
      return;
    }
    if (factorId) {
      description.textContent = "Abra seu app autenticador e digite o código atual para entrar.";
      form.hidden = false;
    } else {
      description.textContent = admin
        ? "Configure o autenticador para acessar a administração."
        : "Ative a verificação em duas etapas para proteger sua conta.";
      enroll.hidden = false;
    }

    enroll.addEventListener("click", async () => {
      enroll.disabled = true;
      status.textContent = "Preparando o autenticador…";
      try {
        const { data: currentFactors } = await client.auth.mfa.listFactors();
        const unverified = currentFactors?.totp?.filter(f => f.status === "unverified") || [];
        for (const factor of unverified) {
          try {
            await client.auth.mfa.unenroll({ factorId: factor.id });
          } catch {
            // Ignora erro ao desvincular fator não verificado residual
          }
        }

        const { data, error } = await client.auth.mfa.enroll({ factorType: "totp" });
        if (error) throw error;
        factorId = data.id;
        document.getElementById("qr").src = data.totp.qr_code;
        keyField.value = data.totp.secret;
        setup.hidden = false;
        form.hidden = false;
        enroll.hidden = true;
        status.textContent = "";
      } catch {
        status.textContent = "Não foi possível preparar o autenticador. Tente novamente.";
        enroll.disabled = false;
      }
    });
    document.getElementById("copy").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(keyField.value);
        status.textContent = "Chave copiada.";
      } catch {
        keyField.select();
        status.textContent = "Selecione e copie a chave.";
      }
    });
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const button = form.querySelector("button");
      const code = form.elements.code.value;
      if (!factorId || !/^\d{6}$/.test(code) || button.disabled) return;
      button.disabled = true;
      status.textContent = "Verificando o código…";
      try {
        const { error } = await client.auth.mfa.challengeAndVerify({ factorId, code });
        if (error) throw error;
        keyField.value = "";
        window.location.replace(target);
      } catch {
        status.textContent = "Não foi possível verificar. Confira o código atual e tente novamente.";
        button.disabled = false;
      }
    });
  } catch {
    status.textContent = "Não foi possível conferir a segurança da conta. Volte ao login e tente novamente.";
    back.textContent = "Voltar ao login";
    back.href = "login.html";
    back.hidden = false;
  }
});
