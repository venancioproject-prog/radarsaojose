(() => {
  'use strict';
  const videos = [...document.querySelectorAll('.module-showcase video')];

  function loadVideo(video) {
    const source = video.querySelector('source[data-src]');
    if (!source) return;
    const srcUrl = source.dataset.src;
    source.src = srcUrl;
    source.removeAttribute('data-src');
    if (!video.src || video.src === window.location.href) {
      video.src = srcUrl;
    }
    video.preload = 'auto';
    video.load();
  }

  function playVideo(video) {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const startPlay = () => {
      const playback = video.play();
      if (playback && typeof playback.catch === 'function') {
        playback.catch(() => {
          video.addEventListener('canplay', () => {
            video.play().catch(() => {});
          }, { once: true });
        });
      }
    };

    if (video.readyState >= 2) {
      startPlay();
    } else {
      video.addEventListener('loadeddata', startPlay, { once: true });
      startPlay();
    }
  }

  videos.forEach(video => {
    video.style.cursor = 'pointer';
    video.addEventListener('click', () => {
      if (video.paused) {
        playVideo(video);
      } else {
        video.pause();
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const loader = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadVideo(entry.target);
          loader.unobserve(entry.target);
        }
      });
    }, { rootMargin: '300px' });

    const playback = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadVideo(entry.target);
          playVideo(entry.target);
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.1 });

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
