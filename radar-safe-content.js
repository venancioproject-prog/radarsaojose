(function () {
  const allowed = new Set('p div span h2 h3 h4 h5 h6 ul ol li strong b em i u s blockquote br hr a img figure figcaption table caption thead tbody tr th td code pre sup sub'.split(' '));

  function escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function safeUrl(value) {
    if (!value) return null;
    try {
      const url = new URL(value, location.href);
      return !url.username && !url.password && (url.origin === location.origin || url.protocol === 'https:')
        && ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  function render(target, html) {
    if (typeof window.DOMPurify?.sanitize !== 'function') {
      target.replaceChildren(document.createTextNode('Não foi possível carregar o conteúdo com segurança. Atualize a página.'));
      return;
    }
    // Keep the existing presentation allowlist; the maintained parser removes
    // malformed markup and active content before our minimal DOM reconstruction.
    const clean = window.DOMPurify.sanitize(String(html ?? ''), {
      ALLOWED_TAGS: [...allowed], ALLOWED_ATTR: ['href', 'src', 'alt'],
      ALLOW_DATA_ATTR: false, ALLOW_ARIA_ATTR: false, RETURN_DOM_FRAGMENT: true
    });
    function copy(source, destination) {
      for (const node of source.childNodes) {
        if (node.nodeType === 3) destination.append(document.createTextNode(node.textContent));
        if (node.namespaceURI !== 'http://www.w3.org/1999/xhtml' || !allowed.has(node.localName)) continue;
        const tag = node.localName;
        const next = document.createElement(tag);
        if (tag === 'a' || tag === 'img') {
          const attribute = tag === 'a' ? 'href' : 'src';
          const url = safeUrl(node.getAttribute(attribute));
          if (url) next.setAttribute(attribute, url);
          if (tag === 'a') next.rel = 'noopener noreferrer';
          if (tag === 'img') {
            next.alt = node.getAttribute('alt') || '';
            next.loading = 'lazy';
            next.referrerPolicy = 'no-referrer';
          }
        }
        copy(node, next);
        destination.append(next);
      }
    }
    const fragment = document.createDocumentFragment();
    copy(clean, fragment);
    target.replaceChildren(fragment);
  }

  function renderPlan(target, html) {
    if (typeof window.DOMPurify?.sanitize !== 'function') {
      target.replaceChildren(document.createTextNode('Não foi possível carregar o conteúdo com segurança. Atualize a página.'));
      return;
    }
    const table = target.tagName === 'TBODY';
    const source = table ? '<table><tbody>' + String(html ?? '') + '</tbody></table>' : String(html ?? '');
    const clean = window.DOMPurify.sanitize(source, {
      USE_PROFILES: { html: true }, ADD_ATTR: ['contenteditable'],
      FORBID_TAGS: ['style', 'form', 'input', 'textarea', 'select', 'option', 'iframe', 'object', 'embed', 'video', 'audio'],
      FORBID_ATTR: ['id', 'name', 'form', 'formaction'], RETURN_DOM_FRAGMENT: true
    });
    if (table) target.replaceChildren(...(clean.querySelector('tbody')?.childNodes || []));
    else target.replaceChildren(clean);
  }

  window.radarSafeContent = Object.freeze({ escape, render, renderPlan });
})();
