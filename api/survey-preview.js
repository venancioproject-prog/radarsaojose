'use strict';

const store = require('../lib/billing-store');
const { filters, readSurveyRows, surveyPlan, surveyPreview } = require('../lib/survey-data');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED' });
  }
  const selected = req.query || {};
  if (Object.entries(selected).some(([field, value]) =>
    !Object.hasOwn(filters, field) || typeof value !== 'string' || !value || value.length > 100
  )) {
    return res.status(400).json({ code: 'INVALID_SURVEY_PREVIEW_QUERY' });
  }
  try {
    const full = ['dash', 'report', 'midia', 'admin'].includes(await surveyPlan(req));
    const result = surveyPreview(await readSurveyRows(), selected, full);
    if (process.env.VERCEL_ENV === 'preview') result.synthetic = true;
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof store.BillingError && error.status === 401) {
      return res.status(401).json({ code: 'INVALID_SESSION' });
    }
    return res.status(503).json({ code: 'SURVEY_PREVIEW_UNAVAILABLE' });
  }
};
