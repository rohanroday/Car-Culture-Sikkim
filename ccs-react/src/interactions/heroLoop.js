import { $, $$ } from '../lib/dom.js';
import { CONFIG, GATES, RM, gated } from '../config/site.js';

export function initHeroLoop() {
  /* ---------- small screens: the film loops behind the still hero ---------- */
    var sec = $('#heroStatic'), v = $('#loopVideo'), loaded = false, onScreen = true;
    if (!CONFIG.loopVideo) return;
    function update(){
      var saver = navigator.connection && navigator.connection.saveData;
      var want = gated() && !RM.matches && !saver && onScreen && !document.hidden && sec.offsetParent !== null;
      if (want) {
        if (!loaded) {
          loaded = true; v.src = CONFIG.loopVideo;
          v.addEventListener('playing', function(){ sec.classList.add('playing'); }, { once: true });
          v.addEventListener('error', function(){ sec.classList.remove('playing'); });
        }
        var p = v.play(); if (p && p.catch) p.catch(function(){});   // blocked autoplay just leaves the still
      } else if (loaded) v.pause();
    }
    new IntersectionObserver(function(es){ onScreen = es[0].isIntersecting; update(); }).observe(sec);
    GATES.forEach(function(q){ matchMedia(q).addEventListener('change', update); });
    document.addEventListener('visibilitychange', update);
    update();
}
