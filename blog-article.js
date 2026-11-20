(() => {
  'use strict';
  const share = document.querySelector('[data-copy-article]');
  share?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(document.querySelector('link[rel="canonical"]').href);
      share.textContent = 'Link copiado';
    } catch {
      share.textContent = 'Copie o endereço desta página';
    }
  });
})();
