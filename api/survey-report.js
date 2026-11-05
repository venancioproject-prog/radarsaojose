'use strict';

const store = require('../lib/billing-store');
const M = require('../report-metrics');
const { minimumCount, readSurveyRows, surveyPlan } = require('../lib/survey-data');

const privateFields = new Set(['openDefinition', 'openExtra', 'influencersOpen']);
const publicField = field => Object.hasOwn(M.fields, field) && !privateFields.has(field);
const scalar = value => typeof value === 'string' && value.length <= 150;
const values = value => scalar(value) || (Array.isArray(value) && value.length <= 30 && value.every(scalar));
const validFilters = filters => filters && typeof filters === 'object' && !Array.isArray(filters) &&
  Object.entries(filters).every(([field, value]) => publicField(field) && values(value));

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

function safeMetric(engine, spec) {
  if (!validSpec(spec)) return null;
  if (spec.type === 'sample' || spec.type === 'total' || (spec.type === 'valid' && !spec.field)) {
    return { formatted: M.formatNumberBR(engine.n, 0) };
  }
  const result = spec.name ? engine.metric(spec.name) : engine.calculate({
    field: spec.field, filters: spec.filters, options: spec.options || [], exclude: spec.exclude,
    decimals: spec.decimals, type: spec.type === 'valid' ? 'percent' : spec.type
  });
  if (result.valid < minimumCount) return null;
  if (spec.type === 'valid') return { formatted: M.formatNumberBR(result.valid, 0) };
  if (Number.isFinite(result.numerator) && result.numerator !== 0 && result.numerator !== result.valid &&
    (result.numerator < minimumCount || result.valid - result.numerator < minimumCount)) return null;
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
    const { filters = {}, specs } = body || {};
    if (!validFilters(filters) || !Array.isArray(specs) || specs.length > 2000) {
      return res.status(400).json({ code: 'INVALID_REPORT_QUERY' });
    }
    const rows = await readSurveyRows();
    const engine = M.create(rows, {}, filters);
    const n = engine.n >= minimumCount && (engine.n === engine.N || engine.N - engine.n >= minimumCount) ? engine.n : 0;
    const distributions = n ? Object.fromEntries(Object.keys(M.fields).filter(publicField).map(field => {
      const { categories, valid } = engine.distribution(field);
      return [field, {
        valid: valid >= minimumCount ? valid : 0,
        categories: categories.filter(c => c.numerator >= minimumCount)
          .map(({ category, numerator, value }) => ({ category, numerator, value }))
      }];
    })) : {};
    const flows = n ? engine.flows().filter(flow => flow.numerator >= minimumCount)
      .map(({ from, to, flow }) => ({ from, to, flow })) : [];
    const metrics = n ? specs.map(spec => safeMetric(engine, spec)) : specs.map(() => null);
    return res.status(200).json({ N: engine.N, n, distributions, flows, metrics });
  } catch (error) {
    if (error instanceof SyntaxError) return res.status(400).json({ code: 'INVALID_REPORT_QUERY' });
    if (error instanceof store.BillingError && error.status === 401) return res.status(401).json({ code: 'INVALID_SESSION' });
    return res.status(503).json({ code: 'REPORT_UNAVAILABLE' });
  }
};
