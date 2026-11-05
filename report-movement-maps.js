/* SVG maps have no tile requests or nested scrolling; controls work in every report mode. */
(function(){
 'use strict';
 function select(control){
  const map=control.closest('[data-movement-map]');if(!map)return;
  const index=control.dataset.mapSelect;
  map.querySelectorAll('.movement-map-pin,.movement-map-place,.movement-map-sector').forEach(el=>el.classList.toggle('is-active',el.dataset.mapSelect===index||el.dataset.mapArea===index));
  map.querySelectorAll('[data-map-select]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.mapSelect===index)));
 }
 function initialize(){document.querySelectorAll('[data-movement-map]').forEach(map=>{const first=map.querySelector('button[data-map-select]');if(first)select(first)})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
 document.addEventListener('click',event=>{const control=event.target.closest?.('[data-movement-map] [data-map-select]');if(control)select(control)});
 document.addEventListener('keydown',event=>{const control=event.target.closest?.('g[data-map-select]');if(control&&(event.key==='Enter'||event.key===' ')){event.preventDefault();select(control)}});
})();
