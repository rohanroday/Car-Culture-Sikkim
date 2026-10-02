import { $, $$ } from '../lib/dom.js';

export function initSwipeDots() {
  /* ---------- drives swipe row: progress dots ---------- */
    var row = $('#driveRow'), dots = $$('#driveDots i'), cards = $$('.card', row), cur = 0, t = null;
    row.addEventListener('scroll', function(){
      if (t) return;
      t = requestAnimationFrame(function(){
        t = null;
        var mid = row.scrollLeft + row.clientWidth / 2, best = 0, bd = 1e9;
        cards.forEach(function(c, i){ var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
        if (best !== cur) { cur = best; dots.forEach(function(d, i){ d.classList.toggle('on', i === best); }); }
      });
    }, { passive: true });
}
