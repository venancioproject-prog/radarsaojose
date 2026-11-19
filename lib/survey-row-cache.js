'use strict';

// Private, process-local snapshots only. Authorization stays in the API handlers.
function createSurveyRowCache({ ttlMs = 300000, maxBytes = 8 * 1024 * 1024, now = Date.now } = {}) {
  let currentScope;
  const entries = new Map();

  async function read(scope, projection, load) {
    if (!['full', 'preview'].includes(projection)) throw new Error('Invalid survey projection');
    if (scope !== currentScope) {
      entries.clear();
      currentScope = scope;
    }
    for (const [key, entry] of entries) {
      if (!entry.pending && entry.expiresAt <= now()) entries.delete(key);
    }
    const existing = entries.get(projection);
    if (existing) {
      // Parse a new copy so one calculation cannot alter another request's base.
      return JSON.parse(existing.pending ? await existing.pending : existing.json);
    }

    const entry = {};
    entries.set(projection, entry);
    entry.pending = Promise.resolve().then(load).then(rows => {
      const json = JSON.stringify(rows);
      if (currentScope === scope && entries.get(projection) === entry) {
        if (rows.length && Buffer.byteLength(json, 'utf8') <= maxBytes) {
          entry.json = json;
          entry.expiresAt = now() + ttlMs;
        } else {
          // Large/empty results still work, but are not retained as snapshots.
          entries.delete(projection);
        }
      }
      return json;
    });
    try {
      return JSON.parse(await entry.pending);
    } catch (error) {
      if (entries.get(projection) === entry) entries.delete(projection);
      throw error;
    } finally {
      delete entry.pending;
    }
  }
  read.clear = () => { entries.clear(); currentScope = undefined; };
  return read;
}

module.exports = { createSurveyRowCache };
