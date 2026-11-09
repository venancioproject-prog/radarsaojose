(function () {
  const version = "0.2";

  window.radarLegal = Object.freeze({
    version,
    hasAccepted(user, dbRecord) {
      if (dbRecord !== undefined) {
        return dbRecord?.terms_version === version && Number.isFinite(Date.parse(dbRecord.accepted_at));
      }
      const acceptance = user?.user_metadata?.radar_terms_acceptance;
      return acceptance?.version === version && Number.isFinite(Date.parse(acceptance.accepted_at));
    },
    displayName(user) {
      const meta = user?.user_metadata;
      const name = [meta?.radar_full_name, meta?.full_name, meta?.name].find(value => typeof value === "string" && value.trim());
      return name?.trim().slice(0, 120) || "";
    },
    needsFirstAccess(user, dbRecord) {
      const accepted = dbRecord !== undefined ? this.hasAccepted(user, dbRecord) : this.hasAccepted(user);
      const profileType = dbRecord?.profile_type || user?.user_metadata?.radar_profile_type;
      return !accepted || !profileType || !this.displayName(user);
    },
    async fetchAcceptance(client, user) {
      if (!client || !user?.id) return null;
      try {
        const { data, error } = await client
          .from("terms_acceptances")
          .select("id, user_id, terms_version, profile_type, accepted_at")
          .eq("user_id", user.id)
          .eq("terms_version", version)
          .limit(1);
        if (error) return null;
        const row = Array.isArray(data) ? data[0] : null;
        if (!row || row.terms_version !== version || !Number.isFinite(Date.parse(row.accepted_at))) {
          return null;
        }
        return row;
      } catch {
        return null;
      }
    },
    async recordAcceptance(client, user, overrides = {}) {
      if (!client || !user?.id) return null;
      const existing = await this.fetchAcceptance(client, user);
      if (existing) return existing;
      const profileType = overrides.profile_type || user?.user_metadata?.radar_profile_type || null;
      try {
        const { error: insertErr } = await client.from("terms_acceptances").insert({
          user_id: user.id,
          terms_version: version,
          profile_type: profileType,
          user_agent: (typeof navigator !== "undefined" && navigator.userAgent) ? navigator.userAgent : null
        });
        if (insertErr && insertErr.code !== "23505") {
          console.warn("Falha ao registrar auditoria imutavel de termos:", insertErr);
          return null;
        }
        return await this.fetchAcceptance(client, user);
      } catch (auditErr) {
        console.warn("Falha ao registrar auditoria imutavel de termos:", auditErr);
        return null;
      }
    },
    async checkFirstAccess(client, user) {
      if (!user?.id) {
        return { accepted: false, needsFirstAccess: true, record: null, profileType: "", fullName: "" };
      }
      const record = await this.fetchAcceptance(client, user);
      const accepted = this.hasAccepted(user, record);
      const profileType = record?.profile_type || user?.user_metadata?.radar_profile_type || "";
      const fullName = this.displayName(user);
      const needsFirstAccess = !accepted || !profileType || fullName.length < 2;
      return { accepted, needsFirstAccess, record, profileType, fullName };
    }
  });
})();
