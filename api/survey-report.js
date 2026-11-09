'use strict';

const store = require('../lib/billing-store');
const { gunzipSync } = require('node:zlib');
const M = require('../report-metrics');
const { minimumCount, isSafeCount, isSafeFilterSubset, readSurveyRows, surveyPlan } = require('../lib/survey-data');

const privateFields = new Set(['openDefinition', 'openExtra', 'influencersOpen']);
const publicField = field => Object.hasOwn(M.fields, field) && !privateFields.has(field);
const scalar = value => typeof value === 'string' && value.length <= 150;
const values = value => scalar(value) || (Array.isArray(value) && value.length <= 30 && value.every(scalar));
const validFilters = filters => filters && typeof filters === 'object' && !Array.isArray(filters) &&
  Object.entries(filters).every(([field, value]) => publicField(field) && values(value));

function matchReportField(row, field, expected) {
  const allowed = Array.isArray(expected) ? expected : [expected];
  const actual = row.values[field];
  return Array.isArray(actual) ? actual.some(v => allowed.includes(v)) : allowed.includes(actual);
}

function isSafeReportFilters(records, filters, allowPredefinedArray = false) {
  const matched = isSafeFilterSubset(records, filters, matchReportField);
  if (matched.length < minimumCount) return false;
  for (const [field, expected] of Object.entries(filters || {})) {
    if (Array.isArray(expected) && field !== 'gender') {
      const distinct = [...new Set(expected)];
      if (!allowPredefinedArray) {
        for (const item of distinct) {
          const itemCount = matched.filter(row => matchReportField(row, field, item)).length;
          if (!isSafeCount(itemCount, matched.length)) return false;
        }
      } else {
        for (const item of distinct) {
          const itemCount = matched.filter(row => matchReportField(row, field, item)).length;
          if (itemCount > 0 && itemCount < minimumCount) return false;
        }
      }
    }
  }
  return true;
}

function validSpec(spec) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) return false;
  if (spec.name) return Object.hasOwn(M.definitions, spec.name);
  if (spec.type === 'sample' || spec.type === 'total' || (spec.type === 'valid' && !spec.field)) return true;
  return publicField(spec.field) &&
    [undefined, 'percent', 'mean', 'median', 'meanSelections', 'valid'].includes(spec.type) &&
    (!spec.filters || validFilters(spec.filters)) &&
    (!spec.options || (Array.isArray(spec.options) && values(spec.options))) &&
    (!spec.exclude || (Array.isArray(spec.exclude) && values(spec.exclude))) &&
    (spec.decimals == null || (Number.isInteger(spec.decimals) && spec.decimals >= 0 && spec.decimals <= 4));
}

function safeMetric(engine, spec, filteredRecords) {
  if (!validSpec(spec)) return null;
  if (spec.type === 'sample' || spec.type === 'total' || (spec.type === 'valid' && !spec.field)) {
    return { formatted: M.formatNumberBR(engine.n, 0) };
  }
  const effectiveDef = spec.name ? M.definitions[spec.name] : spec;
  const segFilters = effectiveDef?.filters || {};
  if (Object.keys(segFilters).length > 0) {
    if (!isSafeReportFilters(filteredRecords, segFilters, Boolean(spec.name))) return null;
  }
  const result = spec.name ? engine.metric(spec.name) : engine.calculate({
    field: spec.field, filters: spec.filters, options: spec.options || [], exclude: spec.exclude,
    decimals: spec.decimals, type: spec.type === 'valid' ? 'percent' : spec.type
  });
  if (!isSafeCount(result.valid, result.n) || !isSafeCount(result.valid, engine.n)) return null;
  if (spec.type === 'valid') return { formatted: M.formatNumberBR(result.valid, 0) };
  if (Number.isFinite(result.numerator)) {
    if (!isSafeCount(result.numerator, result.valid)) return null;
    if (!spec.name && Array.isArray(spec.options) && spec.options.length > 1) {
      for (const opt of new Set(spec.options)) {
        const single = engine.calculate({
          field: spec.field, filters: spec.filters, options: [opt], type: 'percent'
        });
        if (!isSafeCount(single.numerator, result.valid)) return null;
      }
    }
    if (!spec.name && Array.isArray(spec.exclude) && spec.exclude.length > 0) {
      for (const opt of new Set(spec.exclude)) {
        const excluded = engine.calculate({
          field: spec.field, filters: spec.filters, options: [opt], type: 'percent'
        });
        if (!isSafeCount(excluded.numerator, result.valid)) return null;
      }
    }
  }
  return {
    formatted: spec.type === 'numerator' ? M.formatNumberBR(result.numerator, 0) : result.formatted,
    value: result.value, valid: result.valid, smallBase: result.smallBase, status: result.status
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const plan = await surveyPlan(req);
    if (!['report', 'midia', 'admin'].includes(plan)) return res.status(403).json({ code: 'REPORT_REQUIRED' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (body?.action === 'chapters') {
      if (process.env.VERCEL_ENV === 'preview') {
        return res.status(200).json({ html: require('./_report-chapters').demoChapters(), synthetic: true });
      }
      const [document] = await store.db('report_private_documents?slug=eq.radar-2026&select=chapters_html&limit=1');
      if (!document?.chapters_html?.trim()) {
        return res.status(503).json({ code: 'REPORT_CHAPTERS_UNAVAILABLE' });
      }
      const saved = document.chapters_html;
      const html = saved.startsWith('gzip:') ?
        gunzipSync(Buffer.from(saved.slice(5), 'base64'), { maxOutputLength: 3 * 1024 * 1024 }).toString('utf8') : saved;
      return res.status(200).json({ html, synthetic: false });
    }
    const { filters = {}, specs } = body || {};
    if (!validFilters(filters) || !Array.isArray(specs) || specs.length > 2000) {
      return res.status(400).json({ code: 'INVALID_REPORT_QUERY' });
    }
    const rows = await readSurveyRows();
    const engine = M.create(rows, {}, filters);
    const eligibleRecords = engine.eligibility.records;
    const safeSelection = isSafeReportFilters(eligibleRecords, filters, false);
    const n = safeSelection ? engine.n : 0;
    const filteredRecords = safeSelection ? eligibleRecords.filter(row =>
      Object.entries(filters).every(([field, expected]) => matchReportField(row, field, expected))
    ) : [];
    const distributions = n ? Object.fromEntries(Object.keys(M.fields).filter(publicField).map(field => {
      const { categories, valid } = engine.distribution(field);
      const safeValid = isSafeCount(valid, n);
      return [field, {
        valid: safeValid ? valid : 0,
        categories: safeValid ? categories.filter(c => isSafeCount(c.numerator, valid))
          .map(({ category, numerator, value }) => ({ category, numerator, value })) : []
      }];
    })) : {};
    const flows = n ? engine.flows().filter(flow => isSafeCount(flow.numerator, flow.denominator))
      .map(({ from, to, flow }) => ({ from, to, flow })) : [];
    const metrics = n ? specs.map(spec => safeMetric(engine, spec, filteredRecords)) : specs.map(() => null);
    return res.status(200).json({ N: engine.N, n, distributions, flows, metrics });
  } catch (error) {
    if (error instanceof SyntaxError) return res.status(400).json({ code: 'INVALID_REPORT_QUERY' });
    if (error instanceof store.BillingError && error.status === 401) return res.status(401).json({ code: 'INVALID_SESSION' });
    return res.status(503).json({ code: 'REPORT_UNAVAILABLE' });
  }
};
