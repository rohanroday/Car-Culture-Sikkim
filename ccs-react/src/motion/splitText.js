import { $, $$, rng } from '../lib/dom.js';

export function splitText() {
  /* ---------- text splitting, once, seeded ---------- */
  $$('[data-split]').forEach(function(el, n){
    var mode = el.getAttribute('data-split');
    var text = el.textContent.trim();
    var band = el.closest('.band');
    var spread = band && band.dataset.spread ? parseFloat(band.dataset.spread) : 0.55;
    var r = rng(7919 * (n + 1));
    var words = text.split(/\s+/);
    var total = text.replace(/\s/g, '').length, ci = 0;
    el.textContent = '';
    var sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = text;
    var vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true');
    words.forEach(function(w, wi){
      var ws = document.createElement('span'); ws.className = 'w';
      if (mode === 'c') {
        w.split('').forEach(function(ch){
          var c = document.createElement('span'); c.className = 'c'; c.textContent = ch;
          c.style.setProperty('--th', (ci / total * spread + r() * 0.06).toFixed(3));
          c.style.setProperty('--jx', (-(16 + r() * 34)).toFixed(0) + 'px');
          ci++; ws.appendChild(c);
        });
      } else if (mode === 'h') {
        ws.className = 'lw';
        var inner = document.createElement('span'); inner.textContent = w; ws.appendChild(inner);
      } else {
        ws.textContent = w;
        ws.style.setProperty('--th', (wi / words.length * spread).toFixed(3));
        ws.style.setProperty('--i', (wi / words.length * 0.86).toFixed(3));
      }
      vis.appendChild(ws);
      if (wi < words.length - 1) vis.appendChild(document.createTextNode(' '));
    });
    el.appendChild(sr); el.appendChild(vis);
  });
  $$('.fx-mist .mist').forEach(function(el){
    var soft = document.createElement('span');
    soft.className = 'soft'; soft.setAttribute('aria-hidden', 'true');
    soft.textContent = $('.sharp', el).textContent;
    el.appendChild(soft);
  });
}
