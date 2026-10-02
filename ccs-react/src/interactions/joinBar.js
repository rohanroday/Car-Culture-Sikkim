import { $, $$ } from '../lib/dom.js';

export function initJoinBar() {
  /* ---------- sticky join bar: after the hero, until the form or footer is in view ---------- */
    var bar = $('#joinbar'), pastHero = false, nearEnd = false, shown = false;
    var heroEls = [$('#top'), $('#heroStatic')], endEls = [$('#join'), $('footer')];
    var vis = new Map();
    function update(){
      var want = pastHero && !nearEnd;
      if (want === shown) return;
      shown = want; bar.classList.toggle('show', want);
      if (want) bar.removeAttribute('inert'); else bar.setAttribute('inert', '');
    }
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ vis.set(e.target, e.isIntersecting); });
      pastHero = !heroEls.some(function(el){ return vis.get(el); });
      nearEnd = endEls.some(function(el){ return vis.get(el); });
      update();
    });
    heroEls.concat(endEls).forEach(function(el){ io.observe(el); });
}
