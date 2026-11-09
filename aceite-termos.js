(function () {
  const version = "0.2";

  window.radarLegal = Object.freeze({
    version,
    hasAccepted(user) {
      const acceptance = user?.user_metadata?.radar_terms_acceptance;
      return acceptance?.version === version && Number.isFinite(Date.parse(acceptance.accepted_at));
    },
    displayName(user) {
      const meta = user?.user_metadata;
      const name = [meta?.radar_full_name, meta?.full_name, meta?.name].find(value => typeof value === "string" && value.trim());
      return name?.trim().slice(0, 120) || "";
    },
    needsFirstAccess(user) {
      return !this.hasAccepted(user) || !user?.user_metadata?.radar_profile_type || !user?.user_metadata?.radar_full_name?.trim?.();
    },
    async recordAcceptance(client, user, overrides = {}) {
      if (!client || !user?.id) return false;
      const acceptance = user?.user_metadata?.radar_terms_acceptance;
      const termsVersion = overrides.terms_version || acceptance?.version || version;
      const acceptedAt = overrides.accepted_at || (Number.isFinite(Date.parse(acceptance?.accepted_at)) ? acceptance.accepted_at : new Date().toISOString());
      const profileType = overrides.profile_type || user?.user_metadata?.radar_profile_type || null;
      try {
        const { data: existing, error: selectErr } = await client
          .from("terms_acceptances")
          .select("id")
          .eq("user_id", user.id)
          .eq("terms_version", termsVersion)
          .limit(1);
        if (!selectErr && Array.isArray(existing) && existing.length > 0) {
          return true;
        }
        const { error: insertErr } = await client.from("terms_acceptances").insert({
          user_id: user.id,
          terms_version: termsVersion,
          profile_type: profileType,
          accepted_at: acceptedAt,
          user_agent: (typeof navigator !== "undefined" && navigator.userAgent) ? navigator.userAgent : null
        });
        if (insertErr && insertErr.code !== "23505") {
          console.warn("Falha ao registrar auditoria imutavel de termos:", insertErr);
          return false;
        }
        return true;
      } catch (auditErr) {
        console.warn("Falha ao registrar auditoria imutavel de termos:", auditErr);
        return false;
      }
    }
  });
})();
