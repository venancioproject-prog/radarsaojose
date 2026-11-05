/* Opt-in offline shell; never intercepts app.html, controller or other axes. */
// PILOT_SHELL_RELEASE_START
const CACHE = "radar-piloto-shell-92a3157c59e3fef072a12922dedf7458de9213b03c8ad63438d6d879f8c17e19";
const HASHES = {"radar-piloto.html":"40abcb532e952f00bcb279b27430b2a3d14fb350b7eeb50442b017f7c90a452a","radar_piloto_visual.css":"afdc653fe0c207c53e241c48fe635c2dca2635b8f48e19332ff78400405450d7","radar_piloto_visual.js":"99a78314d3d2e38d13890cb5ec8e3279cb7d049633a99aeca6709900749b4707","radar_piloto_loader.js":"9d1d8377d6b62a4e53b9501d1bb3869f5482536dcd1c55a1dcd1362b218a484c","radar_piloto_release.js":"5c59dc39ca24d52a4227f8f2fcc3e88f824e82fb072d0f2668dda6a17ebb8058"};
// PILOT_SHELL_RELEASE_END
const FILES = ['radar-piloto.html', 'radar_piloto_visual.css', 'radar_piloto_visual.js', 'radar_piloto_loader.js', 'radar_piloto_release.js'];
const allowed = new Set(FILES.map(f => new URL(f, self.registration.scope).pathname));
async function shell() {
  const cache = await caches.open(CACHE);
  // Atomic list: publish only after every resource response succeeds.
  const responses = await Promise.all(FILES.map(async f => {
    const url = new URL(f, self.registration.scope);
    const response = await fetch(url, {cache: 'no-store'});
    if (!response.ok) throw new Error('Offline shell unavailable');
    const bytes = await response.clone().arrayBuffer();
    const sha = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2,'0')).join('');
    if (!HASHES[f] || sha !== HASHES[f]) throw new Error('Offline shell integrity failure: ' + f);
    return [url, response];
  }));
  await Promise.all(responses.map(([url, response]) => cache.put(url, response)));
}
self.addEventListener('install', event => event.waitUntil(shell().then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !allowed.has(url.pathname)) return;
  event.respondWith((async () => {
    const cached = await (await caches.open(CACHE)).match(url.origin + url.pathname);
    return cached || new Response('Piloto não disponível offline; preparar com rede.', {status:503});
  })());
});
