(() => {
  const menus = [...document.querySelectorAll('[data-header-menu-toggle]')].map(button => ({
    button,
    panel: document.getElementById(button.getAttribute('aria-controls'))
  })).filter(menu => menu.panel);

  function setOpen({ button, panel }, open) {
    button.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('active', open);
  }

  document.addEventListener('click', event => {
    for (const menu of menus) {
      const { button, panel } = menu;
      const open = button.getAttribute('aria-expanded') === 'true';
      if (button.contains(event.target)) {
        setOpen(menu, !open);
      } else if (open && !panel.contains(event.target)) {
        setOpen(menu, false);
      } else if (open && event.target.closest('a, button')) {
        setOpen(menu, false);
        if (panel.contains(document.activeElement)) button.focus();
      }
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    for (const menu of menus) {
      if (menu.button.getAttribute('aria-expanded') !== 'true') continue;
      const restoreFocus = menu.panel.contains(document.activeElement);
      setOpen(menu, false);
      if (restoreFocus) menu.button.focus();
    }
  });

  matchMedia('(max-width: 1024px)').addEventListener('change', () => {
    for (const menu of menus) setOpen(menu, false);
  });
})();
