/* Read-only Supabase source dedicated to the presentation. Memory cache only. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RadarReportSource = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  async function fetchSnapshot({ url, key, fetchImpl = globalThis.fetch, pageSize = 500, signal }) {
    const records = [], ids = new Set(); let total = null, start = 0;
    do {
      const response = await fetchImpl(url + '/rest/v1/respostas_pesquisa?select=*&order=id.asc', {
        headers: { apikey: key, Prefer: 'count=exact', Range: `${start}-${start + pageSize - 1}`, 'Range-Unit': 'items' }, signal
      });
      if (!response.ok) throw new Error('Supabase presentation query failed: HTTP ' + response.status);
      const range = response.headers.get('content-range');
      const count = range && range.match(/\/(\d+)$/);
      if (!count) throw new Error('Supabase did not supply an exact visible record count.');
      const nextTotal = Number(count[1]);
      if (total !== null && nextTotal !== total) throw new Error('The dataset changed during pagination. Refresh required.');
      total = nextTotal;
      const page = await response.json();
      if (!Array.isArray(page) || (!page.length && records.length < total)) throw new Error('Incomplete Supabase response.');
      for (const row of page) {
        if (row.id == null || ids.has(row.id)) throw new Error('Missing or repeated identifier during pagination. No records excluded.');
        ids.add(row.id); records.push(row);
      }
      start += page.length;
      if (records.length > total) throw new Error('Supabase record count mismatch.');
    } while (records.length < total);
    return { records, metadata: { source: 'radar_primary', provider: 'Supabase', table: 'respostas_pesquisa', queriedAt: new Date().toISOString(), received: records.length, visibleCount: total, query: 'select=*&order=id.asc; paginated; count=exact', accessScope: 'Records visible to the configured publishable credential; RLS completeness beyond this scope is not certified.', cache: 'memory', exclusionRules: [] } };
  }
  function create(config) {
    let snapshot = null, pending = null, loadedAt = 0;
    const ttlMs = config.ttlMs ?? 60000;
    return {
      async load({ force = false } = {}) {
        if (pending) return pending;
        if (!force && snapshot && Date.now() - loadedAt < ttlMs) return snapshot;
        pending = fetchSnapshot(config).then(result => { snapshot = result; loadedAt = Date.now(); return result; }).catch(error => { snapshot = null; loadedAt = 0; throw error; }).finally(() => { pending = null; });
        return pending;
      },
      invalidate() { snapshot = null; loadedAt = 0; }
    };
  }
  return { fetchSnapshot, create };
});
