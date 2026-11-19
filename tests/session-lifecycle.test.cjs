'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
function app({ failedChart = false } = {}) {
  let event, pageShow, signouts = 0, redirects = 0, reloads = 0, clearedMedia = 0;
  const storage = new Map(['userRole', 'userPlan', 'userName', 'userEmail', 'authProvider', 'theme'].map(k => [k, 'saved']));
  const hidden = new Set();
  const context = {
    surveyRequest: 0, allSurveyRecords: [{ id: 'private' }],
    chartInstances: { chart: { destroy() { if (failedChart) throw Error('Fixture chart failure'); } } },
    dynamicChartsGrid: { dataset: { publicSurvey: 'true' }, replaceChildren() {} },
    clearExecutiveCharts() {},
    localStorage: { removeItem: key => storage.delete(key) },
    document: { getElementById: () => ({ classList: { add: cls => hidden.add(cls) } }) },
    window: { appState: { user: { id: 'private' }, role: 'admin', plan_type: 'midia' },
      clearPaidReport() {}, RadarReportUI: { render() {} },
      clearMidiaSession: () => { clearedMedia += 1; },
      location: { replace: () => { redirects += 1; }, reload: () => { reloads += 1; } },
      addEventListener: (type, callback) => { if (type === 'pageshow') pageShow = callback; } },
    supabaseClient: { auth: {
      onAuthStateChange: callback => { event = callback; },
      async signOut() {
        assert.equal(context.window.appState.user, null, 'Hide private state before waiting for the network');
        assert.equal(hidden.has('hidden'), true);
        signouts += 1;
      }
    } }
  };
  vm.createContext(context);
  const start = source.indexOf('function clearPrivateSessionState()');
  vm.runInContext(source.slice(start, source.indexOf('\nfunction setLoginLoading', start)), context);
  const bindStart = source.indexOf('  supabaseClient?.auth?.onAuthStateChange?.(');
  vm.runInContext(source.slice(bindStart, source.indexOf('  await checkActiveSession();', bindStart)), context);
  return { context, storage, fire: type => event(type), show: persisted => pageShow({ persisted }),
    stats: () => ({ signouts, redirects, reloads, clearedMedia }) };
}

test('Logout clears private state and identity hints before signing out, without erasing display preferences', async () => {
  const f = app({ failedChart: true });
  await f.context.handleLogout();
  assert.equal(f.context.allSurveyRecords.length, 0);
  assert.equal(f.context.window.allSurveyRecords.length, 0);
  assert.equal(f.context.window.currentFilteredRecords.length, 0);
  assert.equal(f.context.window.appState.plan_type, 'gratis');
  assert.deepEqual([...f.storage.keys()], ['theme']);
  assert.deepEqual(f.stats(), { signouts: 1, redirects: 1, reloads: 0, clearedMedia: 1 });
});

test('Cross-tab signout clears the page without recursive auth calls, and history restores revalidate by reloading', () => {
  const f = app();
  for (const event of ['INITIAL_SESSION', 'SIGNED_IN', 'TOKEN_REFRESHED']) f.fire(event);
  assert.equal(f.stats().redirects, 0);
  f.fire('SIGNED_OUT');
  assert.equal(f.context.window.appState.user, null);
  assert.equal(f.stats().signouts, 0, 'An auth callback must not call signOut again');
  assert.equal(f.stats().redirects, 1);
  f.show(false); f.show(true);
  assert.equal(f.stats().reloads, 1);
});

test('A Media response arriving after session cleanup cannot repopulate private records or continue pagination', async () => {
  let finish, fetches = 0, emptied = 0;
  const content = { classList: { toggle() {}, add() {}, remove() {} }, replaceChildren: () => { emptied += 1; } };
  const context = {
    Image: class {},
    window: { radarSupabaseConfig: {}, radarCanLoadModule: () => true },
    document: { readyState: 'loading', addEventListener() {}, getElementById: id => id === 'midia-dashboard-content' ? content : null },
    supabaseClient: { auth: { getSession: async () => ({ data: { session: { access_token: 'synthetic-only' } } }) } },
    fetch: () => { fetches += 1; return new Promise(resolve => { finish = resolve; }); }
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../midia_dashboard.js'), 'utf8'), context);
  const pending = context.window.fetchMidiaData();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(fetches, 1);
  context.window.clearMidiaSession();
  finish({ ok: true, json: async () => ({ rows: [{ id: 'private', caption: 'PRIVATE' }], next: 'more' }) });
  await pending;
  assert.equal(fetches, 1);
  assert.equal(context.window.allMidiaRecords.length, 0);
  assert.equal(context.window.filteredMidiaRecords.length, 0);
  assert.equal(emptied, 1);
});
