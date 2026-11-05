(() => {
  'use strict';
  const videos = [...document.querySelectorAll('.module-showcase video')];
  function loadVideo(video) {
    const source = video.querySelector('source[data-src]');
    if (!source) return;
    source.src = source.dataset.src;
    source.removeAttribute('data-src');
    video.load();
  }
  function playVideo(video) {
    video.muted = true;
    const playback = video.play();
    if (playback) playback.catch(() => {});
  }
  if ('IntersectionObserver' in window) {
    const loader = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadVideo(entry.target);
          loader.unobserve(entry.target);
        }
      });
    }, { rootMargin: '250px' });
    const playback = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadVideo(entry.target);
          playVideo(entry.target);
        } else {
          entry.target.pause();
        }
      });
    });
    videos.forEach(video => {
      loader.observe(video);
      playback.observe(video);
    });
  } else {
    videos.forEach(video => {
      loadVideo(video);
      playVideo(video);
    });
  }
})();

// Keep module actions after the demonstration on phones, including keyboard order.
(() => {
  const mobile = window.matchMedia('(max-width: 640px)');
  const placements = [...document.querySelectorAll('.module-story')].flatMap(story => {
    const copy = story.querySelector('.module-copy');
    const button = copy?.querySelector(':scope > a.btn-primary, :scope > a.module-paid-cta');
    const demo = story.querySelector('.module-demo');
    return button && demo ? [{ copy, button, demo }] : [];
  });
  const update = () => placements.forEach(({ copy, button, demo }) => {
    button.classList.toggle('module-mobile-cta', mobile.matches);
    if (mobile.matches) demo.after(button);
    else copy.append(button);
  });
  update();
  mobile.addEventListener('change', update);
})();

(() => {
  const button = document.querySelector('.nav-toggle-btn');
  const menu = document.getElementById('primaryNavMenu');
  if (!button || !menu) return;
  const close = () => { menu.classList.remove('active'); button.setAttribute('aria-expanded', 'false'); };
  button.addEventListener('click', () => {
    const open = menu.classList.toggle('active');
    button.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
})();
