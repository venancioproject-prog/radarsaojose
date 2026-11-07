(function () {
  const version = "0.2";

  window.radarLegal = Object.freeze({
    version,
    hasAccepted(user) {
      const acceptance = user?.user_metadata?.radar_terms_acceptance;
      return acceptance?.version === version && Number.isFinite(Date.parse(acceptance.accepted_at));
    },
    needsFirstAccess(user) {
      return !this.hasAccepted(user) || !user?.user_metadata?.radar_profile_type;
    }
  });
})();
