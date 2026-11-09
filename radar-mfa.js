(function () {
  async function status(client, user) {
    const { data, error } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error || !data?.currentLevel) throw error || new Error("Sessão indisponível");
    const admin = user.app_metadata?.role === "admin" || user.app_metadata?.is_admin === true;
    const enabled = data.nextLevel === "aal2";
    return { enabled, required: (admin || enabled) && data.currentLevel !== "aal2" };
  }

  window.radarMfa = Object.freeze({
    status,
    async redirectIfRequired(client, user, adminPanel = false) {
      if (!(await status(client, user)).required) return false;
      window.location.replace(adminPanel ? "seguranca-conta.html?destino=admin" : "seguranca-conta.html");
      return true;
    }
  });
})();
