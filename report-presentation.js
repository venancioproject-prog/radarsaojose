/* Report-only presentation controller. Keeps source IDs and metric bindings stable. */
(function () {
  'use strict';
  if (window.RadarReportPresentation?.initialized) return;
  window.RadarReportPresentation = {initialized:true, state:()=>({presenting,current:current+1,total:slides().length,origin:origin(slides()[current])})};
  let presenting = false;
  let current = 0;
  let frame = 0;
  let previousFocus = null;
  let enteredFullscreen = false;
  const report = () => document.getElementById('executive-report-view');
  const slides = () => Array.from(report()?.querySelectorAll(':scope > article') || []);
  const origin = slide => Number(slide?.dataset.reportOrigin || slide?.dataset.reportBlock || 1);
  const chapter = slide => {
    if (['methodology-detail','methodology-sources'].includes(slide?.dataset.reportSection)) return 'METODOLOGIA E FONTES';
    const id = slide?.id || '';
    if (id.includes('benchmark') || slide?.classList.contains('report-opportunities') || slide?.classList.contains('op-bookend') || slide?.classList.contains('op-card')) {
      return 'CAPÍTULO 04 • ESTRATÉGIA & FUTURO';
    }
    if (slide?.classList.contains('report-qualitative') || id.startsWith('rep-tela-049') || id.startsWith('rep-tela-05') || id.startsWith('rep-tela-06')) {
      return 'CAPÍTULO 02 • PESQUISA QUALITATIVA';
    }
    if (slide?.classList.contains('report-movements-editorial') || slide?.classList.contains('report-culture') || (Number(slide?.dataset.reportOrigin) >= 70 && Number(slide?.dataset.reportOrigin) < 94)) {
      return 'CAPÍTULO 03 • MOVIMENTOS CULTURAIS';
    }
    const n = origin(slide);
    if (n < 2) return 'ABERTURA';
    if (n < 13) return 'INTRODUÇÃO & MÉTODO';
    if (n < 49) return 'CAPÍTULO 01 • PESQUISA QUANTITATIVA';
    if (n < 70) return 'CAPÍTULO 02 • PESQUISA QUALITATIVA';
    if (n < 94) return 'CAPÍTULO 03 • MOVIMENTOS CULTURAIS';
    return 'CAPÍTULO 04 • ESTRATÉGIA & FUTURO';
  };
  function pauseMedia(slide) {
    slide?.querySelectorAll('video').forEach(video => video.pause());
    slide?.querySelectorAll('iframe').forEach(iframe => {
      try {
        const url = new URL(iframe.src, location.href);
        if (/^(www\.)?(youtube(-nocookie)?\.com)$/.test(url.hostname)) iframe.contentWindow?.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}), url.origin);
      } catch (_) { /* Unavailable media does not interrupt navigation. */ }
    });
  }
  function closeIndex(restoreFocus = false) {
    const drawer = document.getElementById('pres-toc-drawer');
    drawer?.classList.remove('open');
    document.getElementById('pres-btn-index')?.setAttribute('aria-expanded','false');
    if (restoreFocus) document.getElementById('pres-btn-index')?.focus({preventScroll:true});
  }
  function resizeCharts(slide) {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const canvases = slide ? [...slide.querySelectorAll('canvas')] : [...(report()?.querySelectorAll('canvas') || [])];
      canvases.forEach(canvas => {
        if (!canvas.getBoundingClientRect().width) return;
        try {
          if (canvas.reportChartPending) {
            const pending = canvas.reportChartPending;
            canvas.reportChartPending = null;
            if (pending.type === 'sankey') window.renderReportChartSankey?.(canvas.id, pending.data);
            else window.renderReportChartBar?.(canvas.id, pending.data, pending.color);
          }
          const chart = window.Chart?.getChart?.(canvas);
          chart?.resize();
          chart?.update('none');
        } catch (error) { console.warn('Report chart resize:', canvas.id, error.message); }
      });
    });
  }
  function refreshCounters() {
    const all = slides();
    all.forEach((slide, index) => {
      slide.dataset.reportPosition = index + 1;
      const meta = slide.querySelector('.report-page-meta');
      const counter = meta?.querySelector(':scope > span:last-child');
      if (counter) counter.textContent = (index+1)+' / '+all.length;
      const label = meta?.querySelector(':scope > div > span:first-child');
      if (label) label.textContent = 'TELA '+String(index+1).padStart(2,'0');
      if (Number(slide.dataset.reportParts)>1 && !meta?.querySelector('[data-report-continuity]')) {
        const note = document.createElement('span');
        note.dataset.reportContinuity = '';
        note.className = 'report-continuity-note';
        note.textContent = 'Parte '+slide.dataset.reportPart+' de '+slide.dataset.reportParts;
        meta?.querySelector(':scope > div')?.append(note);
      }
    });
    document.querySelectorAll('[data-pres-target]').forEach(button => {
      const target = document.getElementById(button.dataset.presTarget)?.closest('article');
      const index = all.indexOf(target);
      const number = button.querySelector('span:last-child');
      if (number && index>=0) number.textContent=String(index+1).padStart(2,'0');
    });
    return all;
  }
  function update() {
    const all = slides();
    if (!all.length) return;
    current = Math.max(0, Math.min(current, all.length-1));
    all.forEach((slide,index) => {
      if (index!==current && slide.classList.contains('active-slide')) pauseMedia(slide);
      slide.classList.toggle('active-slide',index===current);
      if (presenting) slide.setAttribute('aria-hidden',index===current?'false':'true');
      else slide.removeAttribute('aria-hidden');
    });
    const slide = all[current];
    const title = slide.querySelector('h1,h2,h3')?.textContent.replace(/\s+/g,' ').trim() || 'Tela '+(current+1);
    const counter = document.getElementById('pres-counter');
    if (counter) counter.textContent=(current+1)+' / '+all.length;
    const previous = document.getElementById('pres-btn-prev');
    const next = document.getElementById('pres-btn-next');
    if (previous) previous.disabled=current===0;
    if (next) next.disabled=current===all.length-1;
    const chapterLabel = document.getElementById('pres-chapter-label');
    const titleLabel = document.getElementById('pres-slide-title');
    if (chapterLabel) chapterLabel.textContent=chapter(slide);
    if (titleLabel) titleLabel.textContent=title;
    const progress=document.getElementById('presentation-progress-bar');
    if (progress) progress.style.width=(all.length<2?100:current/(all.length-1)*100)+'%';
    resizeCharts(slide);
    requestAnimationFrame(()=>resizeCharts(slide));
  }
  window.goToDeckSlide = function(number) {
    const all=slides();
    if (!all.length) return;
    current=Math.max(0,Math.min(all.length-1,Number(number)-1));
    closeIndex();
    update();
  };
  window.navigateReportTo = function(id) {
    const all=slides();
    const target=document.getElementById(id)?.closest('article');
    const index=all.indexOf(target);
    if (index<0) return;
    if (presenting) window.goToDeckSlide(index+1);
    else all[index].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  };
  window.openFullscreenDeck = function() {
    if (presenting) return;
    window.switchMainTab?.('report');
    const all=refreshCounters();
    if (!all.length) return;
    const fixedHeader=document.getElementById('main-app-header')?.getBoundingClientRect();
    const offset=fixedHeader && fixedHeader.bottom>0 ? fixedHeader.bottom+16 : 88;
    let nearest=Infinity;
    all.forEach((slide,index)=>{
      const distance=Math.abs(slide.getBoundingClientRect().top-offset);
      if(distance<nearest){nearest=distance;current=index;}
    });
    previousFocus=document.activeElement;
    presenting=true;
    document.body.classList.add('presentation-mode');
    closeIndex();
    update();
    document.getElementById('pres-btn-next')?.focus({preventScroll:true});
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(()=>{enteredFullscreen=true;}).catch(()=>{enteredFullscreen=false;});
    }
  };
  window.closeFullscreenDeck = function() {
    if (!presenting) return;
    const active=slides()[current];
    pauseMedia(active);
    presenting=false;
    closeIndex();
    document.body.classList.remove('presentation-mode');
    slides().forEach(slide=>{slide.classList.remove('active-slide');slide.removeAttribute('aria-hidden');});
    let restoreObserver;
    let restoreTimer;
    const stopRestoring=()=>{
      restoreObserver?.disconnect();
      clearTimeout(restoreTimer);
      window.removeEventListener('wheel',stopRestoring);
      window.removeEventListener('touchstart',stopRestoring);
      window.removeEventListener('keydown',stopRestoring);
    };
    const alignReading=()=>{
      if (!presenting) active?.scrollIntoView({behavior:'instant',block:'start'});
    };
    if (report() && window.ResizeObserver) {
      restoreObserver=new ResizeObserver(alignReading);
      restoreObserver.observe(report());
      restoreTimer=setTimeout(stopRestoring,800);
      window.addEventListener('wheel',stopRestoring,{passive:true});
      window.addEventListener('touchstart',stopRestoring,{passive:true});
      window.addEventListener('keydown',stopRestoring);
    }
    const restore=()=>{
      resizeCharts();
      if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
      // Charts regain their app dimensions after presentation styles are removed.
      // Restore the reading position after that reflow, not before it.
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        alignReading();
      }));
    };
    if (enteredFullscreen && document.fullscreenElement) document.exitFullscreen?.().catch(()=>{}).finally(restore);
    enteredFullscreen=false;
    restore();
    requestAnimationFrame(restore);
  };
  window.nextDeckSlide = function(){if(presenting && current<slides().length-1){current++;closeIndex();update();}};
  window.prevDeckSlide = function(){if(presenting && current>0){current--;closeIndex();update();}};
  window.refreshReportLayout = function(){refreshCounters();resizeCharts(presenting?slides()[current]:null);};
  let initialized=false;
  function initialize() {
    if(initialized)return;
    initialized=true;
    refreshCounters();
    document.getElementById('pres-btn-next')?.addEventListener('click',window.nextDeckSlide);
    document.getElementById('pres-btn-prev')?.addEventListener('click',window.prevDeckSlide);
    document.getElementById('pres-btn-exit')?.addEventListener('click',window.closeFullscreenDeck);
    document.getElementById('pres-toc-close')?.addEventListener('click',()=>closeIndex(true));
    const drawer=document.getElementById('pres-toc-drawer');
    const indexButton=document.getElementById('pres-btn-index');
    indexButton?.addEventListener('click',()=>{
      const open=drawer?.classList.toggle('open');
      indexButton.setAttribute('aria-expanded',String(Boolean(open)));
      if(open) drawer.querySelector('button')?.focus();
    });
    document.querySelectorAll('[data-pres-target]').forEach(button=>button.addEventListener('click',()=>window.navigateReportTo(button.dataset.presTarget)));
    report()?.addEventListener('click',event=>{
      const link=event.target.closest('a.q-theme[href^="#rep-tela-"]');
      if(!link || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
      event.preventDefault();
      window.navigateReportTo(link.hash.slice(1));
    });
    document.getElementById('sidebar-report-index')?.addEventListener('click',event=>{
      const link=event.target.closest('a[href^="#rep-tela-"]');
      if(link){event.preventDefault();window.navigateReportTo(link.hash.slice(1));}
    });
    document.addEventListener('click',event=>{
      if(presenting && drawer?.classList.contains('open') && !drawer.contains(event.target) && !indexButton?.contains(event.target))closeIndex();
    });
    document.addEventListener('keydown',event=>{
      if(!presenting)return;
      if(event.key==='Escape'){
        event.preventDefault();
        if(drawer?.classList.contains('open'))closeIndex(true);
        else window.closeFullscreenDeck();
        return;
      }
      if(drawer?.classList.contains('open')){
        if(event.key==='Tab'){
          const buttons=[...drawer.querySelectorAll('button,a[href]')];
          const first=buttons[0],last=buttons.at(-1);
          if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus();}
          else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
        }
        return;
      }
      const active=document.activeElement;
      if(active?.matches('input,textarea,select,[contenteditable="true"]'))return;
      if(['ArrowRight','PageDown'].includes(event.key)||(event.key===' '&&!active?.matches('button,a'))){event.preventDefault();window.nextDeckSlide();}
      else if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();window.prevDeckSlide();}
      else if(event.key==='Home'){event.preventDefault();window.goToDeckSlide(1);}
      else if(event.key==='End'){event.preventDefault();window.goToDeckSlide(slides().length);}
    });
    document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement && presenting && enteredFullscreen)window.closeFullscreenDeck();});
    window.addEventListener('resize',()=>resizeCharts(presenting?slides()[current]:null));
    if(report())new MutationObserver(()=>resizeCharts(presenting?slides()[current]:null)).observe(report(),{attributes:true,attributeFilter:['class']});
    report()?.querySelectorAll('iframe').forEach(iframe=>{
      try{
        const url=new URL(iframe.src,location.href);
        if(/^(www\.)?(youtube(-nocookie)?\.com)$/.test(url.hostname)){
          url.searchParams.set('enablejsapi','1');
          if(/^https?:$/.test(location.protocol))url.searchParams.set('origin',location.origin);
          iframe.src=url.href;
        }
      }catch(_){/* Preserve unsupported existing embeds. */}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize);else initialize();
})();

/* Fit the combined origin slide without changing the embedded app layout. */
(function () {
  const slide = document.getElementById('rep-tela-003');
  if (!slide) return;
  let frame = 0;
  function fit() {
    frame = 0;
    if (!document.body.classList.contains('presentation-mode')) {
      slide.style.removeProperty('--fit');
      slide.style.removeProperty('--origin-nav-height');
      slide.classList.remove('origin-scroll-fallback');
      return;
    }
    if (!slide.classList.contains('active-slide')) return;
    if (window.innerWidth <= 760) {
      slide.style.setProperty('--fit', '1');
      slide.classList.add('origin-scroll-fallback');
      return;
    }
    const nav = document.getElementById('presentation-controls');
    const navHeight = nav?.getBoundingClientRect().height || 56;
    slide.style.setProperty('--origin-nav-height', navHeight + 'px');
    slide.classList.remove('origin-scroll-fallback');
    const body = slide.querySelector('.origin-body');
    const meta = slide.querySelector('.report-page-meta');
    const footer = slide.querySelector('.report-page-source');
    function fits() {
      const style = getComputedStyle(body);
      const contentHeight = Math.max(...[...body.children].map(block => block.getBoundingClientRect().height));
      const available = body.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      return contentHeight <= available * .97;
    }
    // Largest scale that leaves 3% breathing room; tiny screens retain full text via whole-slide scrolling.
    let fitted = false;
    for (let factor = 1.45; factor >= .819; factor -= .02) {
      slide.style.setProperty('--fit', Math.max(.82, factor).toFixed(2));
      if (fits()) { fitted = true; break; }
    }
    if (!fitted) {
      slide.style.setProperty('--fit', '.82');
      if (!fits()) slide.classList.add('origin-scroll-fallback');
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(fit); }
  new ResizeObserver(schedule).observe(slide);
  const nav = document.getElementById('presentation-controls');
  if (nav) new ResizeObserver(schedule).observe(nav);
  new MutationObserver(schedule).observe(document.body, {attributes:true,attributeFilter:['class']});
  new MutationObserver(records => {
    if (records.some(r => (r.oldValue || '').split(' ').includes('active-slide') !== slide.classList.contains('active-slide'))) schedule();
  }).observe(slide, {attributes:true,attributeFilter:['class'],attributeOldValue:true});
  window.addEventListener('resize', schedule);
  document.addEventListener('fullscreenchange', schedule);
  slide.querySelectorAll('img').forEach(img => img.addEventListener('load', schedule));
  document.fonts?.ready.then(schedule);
  window.fitOriginSlide = schedule;
  schedule();
})();

/* Methodology fullscreen fit; embedded mode remains normal document flow. */
(function () {
 const slide = document.getElementById('rep-tela-006');
 if (!slide || slide.classList.contains('report-method-merged')) return;
 let frame;
 function fit() {
  frame = 0;
  if (!document.body.classList.contains('presentation-mode')) {
   slide.style.removeProperty('--fit'); slide.classList.remove('method-scroll-fallback'); return;
  }
  if (!slide.classList.contains('active-slide')) return;
  slide.classList.remove('method-scroll-fallback');
  const body = slide.querySelector('.method-body');
  const content = slide.querySelector('.method-composition');
  let fits = false;
  for (let step = 0; step <= 32; step++) {
   slide.style.setProperty('--fit', Math.max(.82, 1.45 - step * .02).toFixed(2));
   if (content.getBoundingClientRect().height <= body.clientHeight * .97) { fits = true; break; }
  }
  if (!fits) slide.classList.add('method-scroll-fallback');
 }
 function schedule() { if (!frame) frame = requestAnimationFrame(fit); }
 new ResizeObserver(schedule).observe(slide);
 new MutationObserver(schedule).observe(document.body, {attributes:true,attributeFilter:['class']});
 new MutationObserver(records => {
  if (records.some(r => (r.oldValue || '').split(' ').includes('active-slide') !== slide.classList.contains('active-slide'))) schedule();
 }).observe(slide, {attributes:true,attributeFilter:['class'],attributeOldValue:true});
 slide.querySelectorAll('img').forEach(img => img.addEventListener('load',schedule));
 window.addEventListener('resize',schedule);
 document.addEventListener('fullscreenchange',schedule);
 document.fonts?.ready.then(schedule);
 schedule();
})();
