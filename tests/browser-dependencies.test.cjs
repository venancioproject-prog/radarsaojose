'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { validate, auditOnline } = require('../scripts/audit-browser-dependencies.cjs');
const { buildPolicy, scriptHash } = require('../scripts/build-browser-csp.cjs');

test('Every public page pins third-party scripts and checks their integrity', () => {
  const result = validate();
  assert.ok(result.pages >= 40);
  assert.equal(result.uniqueLibraries, 14);
  assert.ok(result.scriptReferences > 50);
});

test('The unused vulnerable PDF bundle is absent and the real export still invokes browser printing', () => {
  const root = path.join(__dirname, '..');
  const admin = fs.readFileSync(path.join(root, 'admin-crm.html'), 'utf8');
  assert.doesNotMatch(admin, /<script[^>]+html2pdf/i);
  const source = fs.readFileSync(path.join(root, 'business-plan-controller.js'), 'utf8');
  const start = source.indexOf('function exportBusinessPlanPDF()');
  const end = source.indexOf('\n}', start) + 2;
  const calls = [];
  const context = { PlanInlineEditor: { isEditing: true, stopEditing: () => calls.push('finish-editing') },
    window: { print: () => calls.push('print') } };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end), context);
  context.exportBusinessPlanPDF();
  assert.deepEqual(calls, ['finish-editing', 'print']);
});

test('Dependency audit fails on known advisories, missing results and incomplete pagination', async () => {
  const request = async () => ({ ok: true, json: async () => ({ results: [] }) });
  await assert.rejects(auditOnline(request), /Incomplete/);
  const checked = [];
  const response = kind => async (url, options) => {
    assert.equal(url, 'https://api.osv.dev/v1/querybatch');
    const queries = JSON.parse(options.body).queries;
    checked.push(...queries);
    const results = queries.map(() => ({}));
    if (kind === 'vulnerable') results[0] = { vulns: [{ id: 'GHSA-fixture-only' }] };
    if (kind === 'pagination') results[0] = { next_page_token: 'fixture' };
    return { ok: true, json: async () => ({ results }) };
  };
  await assert.rejects(auditOnline(response('vulnerable')), /GHSA-fixture-only/);
  await assert.rejects(auditOnline(response('pagination')), /pagination/);
  assert.equal((await auditOnline(response('clean'))).advisoriesFound, 0);
  assert.ok(checked.every(query => Object.keys(query).sort().join(',') === 'package,version'));
});

test('Published CSP allows approved script hashes but not arbitrary inline scripts or eval', () => {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../vercel.json'), 'utf8'));
  const policy = config.headers.find(rule => rule.source === '/(.*)').headers.find(header => header.key === 'Content-Security-Policy').value;
  assert.equal(policy, buildPolicy(), 'Run node scripts/build-browser-csp.cjs after changing inline application scripts');
  const directives = Object.fromEntries(policy.split(';').map(part => {
    const [name, ...values] = part.trim().split(/\s+/); return [name, values];
  }));
  assert.ok(!directives['script-src'].includes("'unsafe-inline'"));
  assert.ok(!directives['script-src'].includes("'unsafe-eval'"));
  assert.ok(!directives['script-src'].includes('*'));
  assert.ok(!directives['script-src'].includes(scriptHash('document.body.textContent="UNAPPROVED"')));
  assert.deepEqual(directives['script-src-attr'], ["'unsafe-inline'"], 'Existing handlers still need a separate migration');
  assert.deepEqual(directives['form-action'], ["'self'"]);
  assert.ok(Buffer.byteLength(policy) < 7000);
});


test('Business plan collaboration never connects a public channel and preserves server refresh', async () => {
  const source=fs.readFileSync(path.join(__dirname,'../business-plan-controller.js'),'utf8');
  const start=source.indexOf('const PlanRealtimeCollab = {');
  const end=source.indexOf('\nfunction toggleActiveCollaborator',start);
  let channelCalls=0, refreshes=0, timer;
  const applied=[];
  const context={window:{supabaseClient:{channel:()=>{channelCalls+=1;throw Error('Public channel must remain unused');}}},
    currentPlanState:{updated_at:'2026-11-01T00:00:00Z'},
    fetchPlanStateFromCloud:async()=>{refreshes+=1;return {updated_at:'2026-11-02T00:00:00Z',saved_by:'mayumi'};},
    applyRemotePlanState:state=>applied.push(state),clearInterval:()=>{},
    setInterval:(callback,delay)=>{assert.equal(delay,4500);timer=callback;return 1;}};
  vm.createContext(context);
  vm.runInContext(source.slice(start,end)+'\nglobalThis.collab=PlanRealtimeCollab;',context);
  context.collab.setupRealtimeChannel();
  context.collab.broadcastChange('text_edited',{html:'private content'});
  context.collab.trackLocalPresence('private section');
  assert.equal(channelCalls,0);
  assert.equal(context.collab.channel,null);
  context.collab.lastRemoteSyncTs=1;
  context.collab.startPollingFallback();
  await timer();
  assert.equal(refreshes,1);
  assert.equal(applied.length,1);
});
