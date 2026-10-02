import { $, $$, rng } from '../lib/dom.js';

export function buildRailTicks() {
  var railTicks = [];
  /* ---------- altitude rail ticks: one every 100 m, labelled every 500 m ---------- */
    var scale = $('#altScale'), mark = $('#railMark'), top = 4310, bot = 1650;
    for (var m = 1700; m <= 4300; m += 100) {
      var t = document.createElement('i');
      t.className = 'tick' + (m % 500 === 0 ? ' major' : '');
      t.style.top = ((top - m) / (top - bot) * 100).toFixed(2) + '%';
      if (m % 500 === 0) { var b = document.createElement('b'); b.textContent = m.toLocaleString('en-IN'); t.appendChild(b); }
      scale.insertBefore(t, mark);
      railTicks.push({ el: t, m: m, near: false });
    }
  return railTicks;
}

export function buildDecorations() {
  /* ---------- decorations drawn in code ---------- */
  (function topo(){
    var svg = $('#topo'), r = rng(4310), out = '';
    [[1180, 240, 9], [330, 760, 8], [860, 900, 5]].forEach(function(c){
      var p1 = r() * 6.28, p2 = r() * 6.28, p3 = r() * 6.28;
      for (var ring = 1; ring <= c[2]; ring++) {
        var R = ring * 62, d = '';
        for (var a = 0; a <= 72; a++) {
          var t = a / 72 * Math.PI * 2;
          var rad = R * (1 + 0.16 * Math.sin(3 * t + p1) + 0.09 * Math.sin(5 * t + p2 + ring * 0.3) + 0.05 * Math.sin(7 * t + p3));
          d += (a ? 'L' : 'M') + (c[0] + rad * Math.cos(t)).toFixed(1) + ' ' + (c[1] + rad * 0.7 * Math.sin(t)).toFixed(1);
        }
        out += '<path d="' + d + 'Z"/>';
      }
    });
    svg.innerHTML = out;
  })();

  function buildFlags(){
    var svg = $('#flags'), W = Math.max(320, svg.clientWidth || innerWidth), H = 64;
    var cols = ['var(--flag-blue)', 'var(--flag-white)', 'var(--flag-red)', 'var(--flag-green)', 'var(--flag-yellow)'];
    var n = Math.floor(W / 46), sag = 26, out = '';
    var y = function(x){ var u = x / W; return 6 + sag * 4 * u * (1 - u); };
    out += '<path class="string" d="M0 6Q' + W / 2 + ' ' + (6 + sag * 2) + ' ' + W + ' 6"/>';
    for (var i = 0; i < n; i++) {
      var x = (i + 0.5) * (W / n) - 13;
      out += '<rect x="' + x.toFixed(1) + '" y="' + y(x + 13).toFixed(1) + '" width="26" height="20" rx="1" fill="' + cols[i % 5] + '" opacity=".82" style="animation-delay:' + (-(i * 0.37) % 4.6).toFixed(2) + 's"/>';
    }
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML = out;
  }
  buildFlags();
  var flagTimer;
  addEventListener('resize', function(){ clearTimeout(flagTimer); flagTimer = setTimeout(buildFlags, 250); });

  var track = $('#track');
  (function marqueeWords(){
    var words = ['Meets', 'Mountain drives', 'Builds', 'Tuners', '4x4s', 'Superbikes', 'Night runs', 'Petrolheads'];
    var html = '';
    for (var k = 0; k < 6; k++) words.forEach(function(w){ html += '<span>' + w + '</span>'; });
    track.innerHTML = html;
  })();

  (function ticks(){
    var out = '';
    for (var i = 0; i <= 8; i++) {
      var ang = (135 + 270 * i / 8) * Math.PI / 180, c = Math.cos(ang), s = Math.sin(ang);
      out += '<line class="tick" x1="' + (150 + 100 * c).toFixed(1) + '" y1="' + (150 + 100 * s).toFixed(1) + '" x2="' + (150 + 108 * c).toFixed(1) + '" y2="' + (150 + 108 * s).toFixed(1) + '"/>';
      out += '<text x="' + (150 + 84 * c).toFixed(1) + '" y="' + (150 + 84 * s).toFixed(1) + '">' + i + '</text>';
    }
    $('#ticks').innerHTML = out;
  })();
}
