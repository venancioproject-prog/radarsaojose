'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');

async function recovery({ mfa = true, alreadyVerified = false, legacy = false } = {}) {
  const html = fs.readFileSync(path.join(__dirname, '../recuperar-senha.html'), 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
  let ready, submit, authEvent, updates = 0, verifies = 0, signouts = 0, listed = 0;
  let verifyError = null, updateError = null, sessionUser = 'recovery-user';
  const code = { value: '', required: false };
  const button = { disabled: false };
  const update = { hidden: true, elements: { password: { value: 'CasaAz9!1' }, confirm: { value: 'CasaAz9!1' } },
    querySelector: () => button, addEventListener: (_, callback) => { submit = callback; },
    reset() { this.elements.password.value = ''; this.elements.confirm.value = ''; code.value = ''; } };
  const nodes = { request: { hidden: true }, update, status: { textContent: '' }, title: {}, retry: { hidden: true },
    'recovery-mfa': { hidden: true }, 'authenticator-code': code };
  const location = { search: '?modo=redefinir', hash: legacy ? '' : '#recovery_token=synthetic-only-token',
    pathname: '/recuperar-senha.html', href: 'https://fixture.invalid/recuperar-senha.html?modo=redefinir' };
  const user = { id: 'recovery-user' };
  const auth = {
    verifyOtp: async () => ({ data: { session: { user } } }),
    onAuthStateChange: callback => { authEvent = callback; },
    getSession: async () => ({ data: { session: { user: { id: sessionUser } } } }),
    updateUser: async () => { updates += 1; return { error: updateError }; },
    signOut: async () => { signouts += 1; },
    mfa: {
      getAuthenticatorAssuranceLevel: async () => ({ data: {
        currentLevel: alreadyVerified ? 'aal2' : 'aal1', nextLevel: mfa ? 'aal2' : 'aal1'
      } }),
      listFactors: async () => { listed += 1; return { data: { totp: [{ id: 'own-factor', status: 'verified' }] } }; },
      challengeAndVerify: async payload => {
        assert.equal(payload.factorId, 'own-factor');
        assert.equal(payload.code, '123456');
        verifies += 1;
        return { error: verifyError };
      }
    }
  };
  vm.runInNewContext(script, {
    URL, URLSearchParams, location,
    setTimeout(callback, delay) { if (!delay) queueMicrotask(callback); return 1; }, clearTimeout() {},
    document: { getElementById: id => nodes[id], addEventListener: (_, callback) => { ready = callback; } },
    window: { location, history: { replaceState() {} }, radarSupabaseConfig: { url: 'fixture', key: 'fixture' },
      supabase: { createClient: () => ({ auth }) } }
  });
  await ready();
  if (legacy) authEvent('PASSWORD_RECOVERY', { user });
  await new Promise(resolve => setImmediate(resolve));
  return { nodes, button, code, submit: () => submit({ preventDefault() {} }),
    wrongCode: () => { verifyError = { code: 'mfa_verification_failed' }; },
    updateError: value => { updateError = value; }, differentUser: () => { sessionUser = 'different-user'; },
    stats: () => ({ updates, verifies, signouts, listed }) };
}

test('Recovery asks for the verified authenticator and never changes password without its code', async () => {
  const f = await recovery();
  assert.equal(f.nodes.update.hidden, false);
  assert.equal(f.nodes['recovery-mfa'].hidden, false);
  assert.equal(f.code.required, true);
  await f.submit();
  assert.match(f.nodes.status.textContent, /6 números/);
  assert.equal(f.stats().updates, 0);
  f.code.value = '123456';
  await f.submit();
  assert.equal(f.stats().verifies, 1);
  assert.equal(f.stats().updates, 1);
  assert.equal(f.stats().signouts, 1);
  assert.match(f.nodes.status.textContent, /Senha atualizada/);
  assert.equal(f.nodes.update.hidden, true);
  assert.equal(f.code.value, '');
});

test('Wrong MFA codes explain the reason and leave password unchanged', async () => {
  const f = await recovery();
  f.code.value = '123456'; f.wrongCode();
  await f.submit();
  assert.match(f.nodes.status.textContent, /incorreto ou expirou/);
  assert.equal(f.stats().updates, 0);
  assert.equal(f.code.value, '');
  assert.equal(f.button.disabled, false);
});

test('Ordinary accounts and sessions already at aal2 do not require an extra authenticator', async () => {
  for (const options of [{ mfa: false }, { alreadyVerified: true }, { mfa: false, legacy: true }]) {
    const f = await recovery(options);
    assert.equal(f.nodes['recovery-mfa'].hidden, true);
    await f.submit();
    assert.equal(f.stats().updates, 1);
    assert.equal(f.stats().verifies, 0);
  }
});

test('An insufficient_aal response opens the MFA step instead of blaming the password', async () => {
  const f = await recovery({ alreadyVerified: true });
  f.updateError({ code: 'insufficient_aal' });
  await f.submit();
  assert.match(f.nodes.status.textContent, /exige o autenticador/);
  assert.equal(f.nodes['recovery-mfa'].hidden, false);
  assert.equal(f.code.required, true);
  assert.equal(f.button.disabled, false);
});

test('Recovery explains the missing password requirements and rejects a switched account', async () => {
  const f = await recovery({ mfa: false });
  f.nodes.update.elements.password.value = 'PASSWORD9!';
  await f.submit();
  assert.match(f.nodes.status.textContent, /minúscula/);
  assert.doesNotMatch(f.nodes.status.textContent, /9 caracteres/);
  assert.equal(f.stats().updates, 0);
  f.nodes.update.elements.password.value = 'CasaAz9!1';
  f.differentUser();
  await f.submit();
  assert.equal(f.stats().updates, 0);
  assert.match(f.nodes.status.textContent, /sessão de recuperação terminou/);
});
