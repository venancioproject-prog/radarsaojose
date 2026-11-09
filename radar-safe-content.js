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
    const template = document.createElement('template');
    template.innerHTML = String(html ?? '');
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
    copy(template.content, fragment);
    target.replaceChildren(fragment);
  }

  window.radarSafeContent = Object.freeze({ escape, render });
})();
