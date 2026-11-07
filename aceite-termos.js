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
    }
  });
})();
