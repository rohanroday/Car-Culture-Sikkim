import { $, root } from '../lib/dom.js';

export function initMobileMenu() {
  /* ---------- phone menu ---------- */
    var btn = $('#menuBtn'), menu = $('#menu'), open = false;
    function set(o){
      open = o; root.classList.toggle('menu-open', o);
      btn.setAttribute('aria-expanded', o ? 'true' : 'false');
      btn.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
      if (o) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
      if (o) { var first = $('a', menu); if (first) setTimeout(function(){ first.focus({ preventScroll: true }); }, 60); }
      else btn.focus({ preventScroll: true });
      document.dispatchEvent(new CustomEvent('ccs:menu', { detail: o }));
    }
    menu.setAttribute('inert', '');
    btn.addEventListener('click', function(){ set(!open); });
    menu.addEventListener('click', function(e){ if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && open) set(false); });
    matchMedia('(min-width: 901px)').addEventListener('change', function(e){ if (e.matches && open) set(false); });
}
