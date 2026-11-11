'use strict';

const { requireAdmin } = require('../api/_authorization');
const { configuration, db } = require('./billing-store');

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const stages = new Set(['novo', 'contato', 'interesse', 'acompanhamento', 'sem_interesse']);

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'PUT'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const { url } = configuration();
    const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!await requireAdmin(req, res, { url, anonKey })) return;

    if (req.method === 'GET') {
      const id = req.query?.userId;
      if (typeof id !== 'string' || !uuid.test(id)) return res.status(400).json({ code: 'INVALID_USER' });
      const [rows, history] = await Promise.all([
        db('crm_account_followups?user_id=eq.' + encodeURIComponent(id) + '&select=*'),
        db('crm_account_followup_history?user_id=eq.' + encodeURIComponent(id) + '&select=stage,notes,next_contact_date,revision,changed_at&order=revision.desc&limit=20')
      ]);
      return res.status(200).json({ followup: rows[0] || null, history });
    }

    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({ code: 'INVALID_BODY' });
    }
    const fields = new Set(['userId', 'stage', 'notes', 'nextContactDate', 'revision']);
    if (!body || typeof body !== 'object' || Array.isArray(body) ||
        Object.keys(body).some(key => !fields.has(key)) ||
        typeof body.userId !== 'string' || !uuid.test(body.userId) ||
        !stages.has(body.stage) || typeof body.notes !== 'string' || body.notes.length > 5000 ||
        !Number.isInteger(body.revision) || body.revision < 0 || body.revision >= 2147483647) {
      return res.status(400).json({ code: 'INVALID_FOLLOWUP' });
    }
    const date = body.nextContactDate;
    if (date !== null && date !== '' &&
        (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
         !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)) {
      return res.status(400).json({ code: 'INVALID_DATE' });
    }
    const record = {
      user_id: body.userId,
      stage: body.stage,
      notes: body.notes.trim(),
      next_contact_date: date || null,
      updated_by: req.adminUser.id
    };
    let saved;
    if (body.revision === 0) {
      saved = await db('crm_account_followups?on_conflict=user_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
        body: JSON.stringify(record)
      });
    } else {
      saved = await db('crm_account_followups?user_id=eq.' + encodeURIComponent(body.userId) +
        '&revision=eq.' + body.revision, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(record)
      });
    }
    if (!saved?.length) return res.status(409).json({ code: 'FOLLOWUP_CHANGED' });
    return res.status(200).json({ followup: saved[0] });
  } catch {
    return res.status(503).json({ code: 'CRM_FOLLOWUPS_UNAVAILABLE' });
  }
};
