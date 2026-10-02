import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$ } from '../lib/dom.js';

export function initFaq() {
  /* ---------- questions (no library needed) ---------- */
  $$('.qa button').forEach(function(b){
    b.addEventListener('click', function(){
      b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      setTimeout(function(){ ScrollTrigger.refresh(); }, 600);
    });
  });
}
