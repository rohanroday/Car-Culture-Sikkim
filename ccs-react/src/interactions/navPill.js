import { $, $$ } from '../lib/dom.js';

export function initNavPill() {
  /* ---------- nav: the pill slides to whichever section is on screen ---------- */
    var list = $('#navLinks'), ind = $('#navInd'), links = $$('a', list), cur = null;
    var map = links.map(function(a){ return { a: a, sec: $(a.getAttribute('href')) }; });
    function place(){
      if (!cur) { ind.style.opacity = 0; return; }
      ind.style.width = cur.offsetWidth + 'px';
      ind.style.transform = 'translateX(' + cur.offsetLeft + 'px)';
      ind.style.opacity = 1;
    }
    function pick(){
      var mid = innerHeight * 0.45, found = null;
      map.forEach(function(m){ var r = m.sec.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) found = m.a; });
      if (found === cur) return;
      cur = found;
      links.forEach(function(a){ if (a === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      place();
    }
    var t = null;
    addEventListener('scroll', function(){ if (t === null) t = requestAnimationFrame(function(){ t = null; pick(); }); }, { passive: true });
    addEventListener('resize', function(){ pick(); place(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    pick();
}
