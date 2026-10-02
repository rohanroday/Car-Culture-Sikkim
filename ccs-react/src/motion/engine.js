import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';
import { $, $$, clamp, smoothstep, rng, root } from '../lib/dom.js';
import { CONFIG, GATES, RM, FINE, gated } from '../config/site.js';

/* The animation engine: everything that shares scroll state lives in one closure.
   It runs once, after React has rendered the page. */
export function startEngine(railTicks) {
  var reduced = RM.matches;
  var track = $('#track');
  var intro = $('#intro');
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);

  /* ---------- living loops pause off screen and on hidden tabs ---------- */
  var liveIO = new IntersectionObserver(function(es){
    es.forEach(function(e){ e.target.classList.toggle('live', e.isIntersecting); });
  });
  $$('[data-live]').forEach(function(el){ liveIO.observe(el); });
  document.addEventListener('visibilitychange', function(){ document.body.classList.toggle('paused', document.hidden); });

  /* ---------- the interactive moment: hold to start ---------- */
  var revSec = $('#rev'), startBtn = $('#start'), gauge = $('.gauge'), rpmEl = $('#rpm'), hint = $('#hint');
  var rev = 0, holding = false, revDone = false, revRaf = null, revLast = 0, revPinned = false, lastRev = -1, lastRpm = '', lastRpmAt = 0, idleTo = 0.14;
  function paintRev(now, force){
    if (force || Math.abs(rev - lastRev) > 0.003) { lastRev = rev; gauge.style.setProperty('--rev', rev.toFixed(3)); }
    if (force || now - lastRpmAt > 100) {
      var s = (Math.round(rev * 8000 / 50) * 50).toLocaleString('en-IN');
      if (s !== lastRpm) { lastRpm = s; rpmEl.textContent = s; }
      lastRpmAt = now;
    }
  }
  function revTick(now){
    var dt = Math.min(100, now - (revLast || now)); revLast = now;
    if (revDone) rev += (idleTo - rev) * (1 - Math.pow(1 - 0.07, dt / 16.667));
    else if (holding) rev = Math.min(1, rev + dt / 1700 * (0.55 + 0.9 * (1 - rev * 0.5)));
    else rev += (0 - rev) * (1 - Math.pow(1 - 0.06, dt / 16.667));
    if (!revDone && rev >= 1) completeRev(false);
    var resting = (revDone && Math.abs(rev - idleTo) < 0.002) || (!revDone && !holding && rev < 0.002);
    if (resting) { rev = revDone ? idleTo : 0; revRaf = null; revLast = 0; paintRev(now, true); return; }
    paintRev(now, false);
    revRaf = requestAnimationFrame(revTick);
  }
  function kickRev(){ if (revRaf === null) revRaf = requestAnimationFrame(revTick); }
  function completeRev(instant){
    if (revDone) return;
    revDone = true; holding = false;
    startBtn.classList.remove('holding');
    revSec.classList.add('revved');
    startBtn.textContent = 'Engine running';
    startBtn.setAttribute('aria-disabled', 'true');
    hint.textContent = 'Idling at 1,100. You are one of us now.';
    if (!instant && navigator.vibrate) { try { navigator.vibrate([18, 40, 30]); } catch (_) {} }
    if (instant) { rev = idleTo; paintRev(performance.now(), true); } else kickRev();
  }
  function resetRev(){
    revDone = false; rev = 0; revPinned = false;
    revSec.classList.remove('revved');
    startBtn.textContent = 'Hold to start';
    startBtn.removeAttribute('aria-disabled');
    hint.textContent = 'Press and hold. Do not let go early.';
    paintRev(performance.now(), true);
  }
  function holdStart(e){
    if (revDone) return;
    if (reduced) { completeRev(true); return; }
    if (e && e.pointerId !== undefined && startBtn.setPointerCapture) { try { startBtn.setPointerCapture(e.pointerId); } catch (_) {} }
    holding = true; startBtn.classList.add('holding'); kickRev();
  }
  function holdEnd(){
    if (!holding) return;
    holding = false; startBtn.classList.remove('holding');
    if (!revDone) hint.textContent = 'Let go too early. Hold it all the way.';
  }
  startBtn.addEventListener('pointerdown', holdStart);
  startBtn.addEventListener('pointerup', holdEnd);
  startBtn.addEventListener('pointercancel', holdEnd);
  startBtn.addEventListener('lostpointercapture', holdEnd);
  startBtn.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  startBtn.addEventListener('keydown', function(e){ if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); holdStart(); } });
  startBtn.addEventListener('keyup', function(e){ if (e.key === ' ' || e.key === 'Enter') holdEnd(); });
  startBtn.addEventListener('click', function(e){ if (e.detail === 0 && !holding && !revDone && rev < 0.02) completeRev(true); });

  /* ---------- Lenis smooth scroll (mouse and trackpad only) ---------- */
  var lenis = null;
  function lenisRaf(time){ lenis.raf(time * 1000); }
  function startLenis(){
    if (lenis || !Lenis || reduced || !FINE.matches) return;
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(lenisRaf);
  }
  function stopLenis(){
    if (!lenis) return;
    gsap.ticker.remove(lenisRaf); lenis.destroy(); lenis = null;
  }
  document.addEventListener('ccs:menu', function(e){ if (lenis) { if (e.detail) lenis.stop(); else lenis.start(); } });
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href'), t = id.length > 1 ? $(id) : null;
    if (!t || !lenis) return;
    e.preventDefault();
    lenis.scrollTo(t, { offset: id === '#top' ? 0 : -64, duration: 1.5, easing: function(x){ return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); } });
    history.replaceState(null, '', id);
  });

  /* ---------- the scrub hero ---------- */
  var hero = $('#top'), stage = $('#stage'), video = $('#heroVideo'), posterLayer = $('#poster'), ring = $('#ring'), cue = $('#cue');
  var bands = $$('.band', stage).map(function(el, i, all){
    var a = parseFloat(el.dataset.a), b = parseFloat(el.dataset.b);
    return { el: el, a: a, b: b, first: i === 0, last: i === all.length - 1,
      f: Math.min(0.02, (b - a) / 3),
      ramp: el.dataset.ramp ? parseFloat(el.dataset.ramp) : Math.min(0.025, (b - a) * 0.35),
      op: -1, k: -1, on: null };
  });
  var target = 0, shown = 0, heroTicking = false, lastTick = 0, heroOnScreen = true, scrubOn = false, heroInit = false, heroST = null;
  var loadK = 0, loadStart = 0, introDone = false, videoReady = false, lastP = -1, cueGone = null;
  var endingEl = $('#ending'), endingOp = -1, endingSet = false;

  function heroProgress(){
    var range = hero.offsetHeight - innerHeight;
    if (range <= 0) return 0;
    return clamp(-hero.getBoundingClientRect().top / range, 0, 1);
  }
  function updateCaptions(p){
    for (var i = 0; i < bands.length; i++) {
      var B = bands[i];
      var op = (B.first ? 1 : smoothstep(p, B.a, B.a + B.f)) * (B.last ? 1 : 1 - smoothstep(p, B.b - B.f, B.b));
      var k = clamp((p - B.a) / B.ramp, 0, 1);
      if (B.first) k = Math.max(k, loadK);
      if (Math.abs(op - B.op) > 0.004 || (op === 0 && B.op !== 0) || (op === 1 && B.op !== 1)) { B.op = op; B.el.style.opacity = op.toFixed(3); }
      if (Math.abs(k - B.k) > 0.008 || (k === 0 && B.k !== 0) || (k === 1 && B.k !== 1)) { B.k = k; B.el.style.setProperty('--k', k.toFixed(3)); }
      var on = op > 0.001;
      if (on !== B.on) { B.on = on; B.el.classList.toggle('on', on); }
    }
    if (!videoReady && Math.abs(p - lastP) > 0.002) { lastP = p; stage.style.setProperty('--p', p.toFixed(3)); }
    // at rest the 720p film hands over to the full-resolution last frame
    var eo = videoReady ? smoothstep(p, 0.975, 0.998) : 0;
    if (Math.abs(eo - endingOp) > 0.01 || (eo === 0 && endingOp !== 0) || (eo === 1 && endingOp !== 1)) { endingOp = eo; endingEl.style.opacity = eo.toFixed(2); }
    var gone = p > 0.03;
    if (gone !== cueGone) { cueGone = gone; cue.classList.toggle('gone', gone); }
  }

  var seekBusy = false, pendingTime = null;
  function requestSeek(t){
    if (!videoReady || !video.duration) return;
    if (seekBusy) { pendingTime = t; return; }
    if (Math.abs(video.currentTime - t) < 0.008) return;
    seekBusy = true;
    video.currentTime = t;
  }
  video.addEventListener('seeked', function(){
    seekBusy = false;
    if (pendingTime !== null) { var t = pendingTime; pendingTime = null; requestSeek(t); }
  });
  video.addEventListener('error', function(){ seekBusy = false; pendingTime = null; if (heroInit) failVideo(); });

  function heroTick(){
    var now = performance.now();
    var dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    // Lenis already eases the scroll, so this lerp only has to hide the seek steps
    shown += (target - shown) * (1 - Math.pow(1 - (lenis ? 0.3 : 0.16), dt / 16.667));
    var loading = introDone && loadK < 1;
    if (loading) { loadK = clamp((now - loadStart) / 1300, 0, 1); loadK = loadK * loadK * (3 - 2 * loadK); }
    if (Math.abs(target - shown) < 0.0004 && !loading) { shown = target; heroTicking = false; lastTick = 0; gsap.ticker.remove(heroTick); }
    requestSeek(shown * (video.duration || 0) * 0.999);
    updateCaptions(shown);
  }
  function kickHero(){
    if (heroTicking || !scrubOn) return;
    heroTicking = true; lastTick = 0; gsap.ticker.add(heroTick);
  }

  function failVideo(){
    videoReady = false;
    stage.classList.remove('video-ready');
    stage.classList.add('video-failed');
  }
  function loadHeroBlob(){
    var ctrl = new AbortController();
    var watchdog = setTimeout(function(){ ctrl.abort(); }, 20000);
    return fetch(CONFIG.heroVideo, { priority: 'low', signal: ctrl.signal }).then(function(res){
      if (!res.ok || !res.body) throw new Error('video ' + res.status);
      var total = Number(res.headers.get('Content-Length')) || CONFIG.heroBytes || 1;
      var reader = res.body.getReader(), chunks = [], got = 0, lastRing = 0;
      function pump(){
        return reader.read().then(function(r){
          if (r.done) return;
          clearTimeout(watchdog);
          watchdog = setTimeout(function(){ ctrl.abort(); }, 20000);
          chunks.push(r.value); got += r.value.length;
          var frac = Math.min(1, got / total), now = performance.now();
          if (now - lastRing > 100 || frac === 1) { lastRing = now; ring.style.setProperty('--ld', Math.round(126 * (1 - frac))); }
          return pump();
        });
      }
      return pump().then(function(){
        clearTimeout(watchdog);
        ring.style.setProperty('--ld', 0);
        video.src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
        video.load();
        video.addEventListener('canplay', function(){
          videoReady = true;
          if (!endingSet) { endingSet = true; endingEl.style.backgroundImage = "url('" + CONFIG.ending + "')"; }
          requestSeek(shown * video.duration * 0.999);
          stage.classList.add('video-ready');
        }, { once: true });
      });
    });
  }
  function initHeroOnce(){
    if (heroInit) return; heroInit = true;
    posterLayer.style.backgroundImage = "url('" + CONFIG.poster + "')";
    if (!CONFIG.heroVideo) { failVideo(); return; }
    var started = false;
    var start = function(){ if (started) return; started = true; loadHeroBlob().catch(failVideo); };
    var img = new Image(); img.onload = start; img.onerror = start; img.src = CONFIG.poster;
    setTimeout(start, 4000);
  }
  function enableScrub(){
    if (scrubOn) return; scrubOn = true;
    initHeroOnce();
    bands.forEach(function(b){ b.op = -1; b.k = -1; b.on = null; });
    lastP = -1; cueGone = null;
    target = shown = heroProgress();
    heroST = ScrollTrigger.create({
      trigger: hero, start: 'top top', end: 'bottom bottom',
      onUpdate: function(self){ target = self.progress; kickHero(); }
    });
    updateCaptions(shown);
    kickHero();
    startFx();
  }
  function disableScrub(){
    if (!scrubOn) return; scrubOn = false;
    if (heroST) { heroST.kill(); heroST = null; }
    gsap.ticker.remove(heroTick); heroTicking = false; lastTick = 0;
    stopFx();
  }
  function applyHeroMode(){ if (gated()) disableScrub(); else enableScrub(); }
  new IntersectionObserver(function(es){
    heroOnScreen = es[0].isIntersecting;
    if (heroOnScreen && scrubOn) { kickHero(); startFx(); } else stopFx();
  }).observe(hero);

  /* ---------- three.js, layer one: drifting snow and mist over the hero film ---------- */
  var fxBlocked = false, terrainBlocked = false;
  var fx = null, fxOn = false, pointerX = 0, pointerY = 0, scrollVel = 0;
  function buildFx(){
    if (fx || !THREE) return;
    var canvas = $('#fx'), renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, powerPreference: 'high-performance' }); }
    catch (e) { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25));
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(55, 1, 0.1, 60); cam.position.z = 8;
    var N = 900, pos = new Float32Array(N * 3), seed = new Float32Array(N), r = rng(99);
    for (var i = 0; i < N; i++) { pos[i * 3] = (r() - 0.5) * 28; pos[i * 3 + 1] = (r() - 0.5) * 16; pos[i * 3 + 2] = (r() - 0.5) * 14 - 1; seed[i] = r(); }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    var mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, depthTest: false,
      uniforms: { uTime: { value: 0 }, uP: { value: 0 }, uVel: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uA: { value: 0 } },
      vertexShader: [
        'attribute float aSeed; uniform float uTime,uP,uVel,uPR; varying float vA;',
        'void main(){ vec3 p=position;',
        ' p.z=mod(p.z+uP*150.0*(0.6+aSeed*0.8)+uTime*0.5+8.0,14.0)-8.0;',
        ' p.y=mod(p.y-uTime*0.28*(0.4+aSeed)+8.0,16.0)-8.0;',
        ' p.x+=sin(uTime*0.3+aSeed*40.0)*0.4+uTime*0.14*(aSeed-0.3);',
        ' p.x=mod(p.x+14.0,28.0)-14.0;',
        ' vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv;',
        ' float s=(1.6+aSeed*aSeed*7.0)*uPR*(1.0+min(abs(uVel)*1.4,2.2));',
        ' gl_PointSize=s*(7.0/-mv.z);',
        ' vA=(0.16+0.5*aSeed)*smoothstep(0.6,3.0,-mv.z)*smoothstep(16.0,11.0,-mv.z); }'
      ].join('\n'),
      fragmentShader: [
        'precision mediump float; varying float vA; uniform float uA;',
        'void main(){ float d=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.0,d);',
        ' gl_FragColor=vec4(0.94,0.96,1.0,a*a*vA*uA); }'
      ].join('\n')
    });
    scene.add(new THREE.Points(geo, mat));
    function size(){
      var w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    }
    size(); addEventListener('resize', size);
    fx = { renderer: renderer, scene: scene, cam: cam, mat: mat, t0: performance.now(), size: size };
  }
  function fxTick(){
    var u = fx.mat.uniforms, now = performance.now();
    u.uTime.value = (now - fx.t0) / 1000;
    u.uP.value = shown;
    u.uVel.value += (scrollVel - u.uVel.value) * 0.12;
    // spray and snow rush past while driving, and thin out once the car is parked
    var dens = 0.62 - 0.3 * smoothstep(shown, 0.8, 0.9);
    u.uA.value += (dens * (introDone ? 1 : 0) - u.uA.value) * 0.06;
    fx.cam.position.x += (pointerX * 0.5 - fx.cam.position.x) * 0.05;
    fx.cam.position.y += (-pointerY * 0.3 - fx.cam.position.y) * 0.05;
    fx.renderer.render(fx.scene, fx.cam);
  }
  function startFx(){
    if (fxOn || fxBlocked || !scrubOn || !heroOnScreen || reduced) return;
    buildFx(); if (!fx) return;
    fx.size(); fxOn = true; gsap.ticker.add(fxTick);
  }
  function stopFx(){ if (!fxOn) return; fxOn = false; gsap.ticker.remove(fxTick); }
  addEventListener('pointermove', function(e){ pointerX = e.clientX / innerWidth * 2 - 1; pointerY = e.clientY / innerHeight * 2 - 1; }, { passive: true });

  /* ---------- three.js, layer two: the contour-line mountain range behind every section ---------- */
  var terrain = null, terrainOn = false, pageProg = 0, terrainFrame = 0;
  function buildTerrain(){
    if (terrain || !THREE) return;
    var canvas = $('#terrain'), renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' }); }
    catch (e) { return; }
    var gl = renderer.getContext();
    if (!renderer.capabilities.isWebGL2 && !gl.getExtension('OES_standard_derivatives')) { renderer.dispose(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, FINE.matches ? 1.25 : 1));
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(48, 1, 0.1, 120);
    var geo = new THREE.PlaneGeometry(90, 70, 200, 160); geo.rotateX(-Math.PI / 2);
    var mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      extensions: { derivatives: true },
      uniforms: { uTime: { value: 0 }, uScroll: { value: 0 }, uLine: { value: new THREE.Color(0xa3afc0) }, uAccent: { value: new THREE.Color(0xffd21f) } },
      vertexShader: [
        'uniform float uTime,uScroll; varying float vH; varying float vDist;',
        'float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }',
        'float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);',
        ' return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y); }',
        'float fbm(vec2 p){ float a=0.5,s=0.0; for(int i=0;i<4;i++){ s+=a*noise(p); p=p*2.03+17.0; a*=0.5; } return s; }',
        'void main(){ vec3 p=position; vec2 q=p.xz*0.07+vec2(uTime*0.004,-uScroll-uTime*0.01);',
        ' float h=pow(fbm(q),1.7)*11.0; p.y=h; vH=h;',
        ' vec4 mv=modelViewMatrix*vec4(p,1.0); vDist=-mv.z; gl_Position=projectionMatrix*mv; }'
      ].join('\n'),
      fragmentShader: [
        'precision highp float; varying float vH; varying float vDist; uniform vec3 uLine,uAccent;',
        'void main(){ float f=vH*1.5; float w=max(fwidth(f),0.0001);',
        ' float l=abs(fract(f-0.5)-0.5)/w; float line=1.0-smoothstep(0.0,1.25,l);',
        ' float idx=floor(f+0.5); float acc=step(4.5,mod(idx,6.0));',
        ' float fade=smoothstep(58.0,14.0,vDist)*smoothstep(2.0,7.0,vDist);',
        ' gl_FragColor=vec4(mix(uLine,uAccent,acc),line*fade*mix(0.15,0.34,acc)); }'
      ].join('\n')
    });
    scene.add(new THREE.Mesh(geo, mat));
    function size(){
      var w = innerWidth, h = innerHeight;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    }
    size(); addEventListener('resize', size);
    terrain = { renderer: renderer, scene: scene, cam: cam, mat: mat, t0: performance.now() };
    root.classList.add('gl');
  }
  function terrainTick(){
    // the hero film covers the whole screen while it plays: skip the draw
    if (scrubOn && heroCover) return;
    // when the page is still the range only drifts, so every second frame is plenty
    terrainFrame++;
    if (Math.abs(scrollVel) < 0.002 && (terrainFrame & 1)) return;
    var u = terrain.mat.uniforms;
    u.uTime.value = (performance.now() - terrain.t0) / 1000;
    u.uScroll.value += (scrollY / innerHeight * 0.16 - u.uScroll.value) * 0.1;
    var c = terrain.cam;
    c.position.set(pointerX * 0.6, 13.5 - 5.5 * pageProg, 20);
    c.lookAt(0, 3.2 - 1.2 * pageProg, -8);
    terrain.renderer.render(terrain.scene, c);
  }
  function startTerrain(){
    if (terrainOn || terrainBlocked || reduced) return;
    buildTerrain(); if (!terrain) return;
    terrainOn = true; root.classList.add('gl'); gsap.ticker.add(terrainTick);
  }
  function stopTerrain(){
    if (!terrainOn) return;
    terrainOn = false; gsap.ticker.remove(terrainTick); root.classList.remove('gl');
  }

  /* ---------- page tick: altimeter, nav, scroll speed ---------- */
  var nav = $('#nav'), altv = $('#altv'), altFill = $('#altFill');
  var railScale = $('#altScale'), railMark = $('#railMark'), railFill = $('#railFill'), railV = $('#railV'), railH = 0, lastMY = -1;
  var lastAlt = '', lastAltAt = 0, navSolid = null, heroRange = 0, docRange = 1, heroCover = true, lastY = scrollY;
  function measure(){
    heroRange = scrubOn ? hero.offsetHeight - innerHeight : 0;
    docRange = Math.max(1, document.documentElement.scrollHeight - innerHeight - heroRange);
    railH = railScale.clientHeight; lastMY = -1;
  }
  function pageTick(){
    var y = scrollY, now = performance.now();
    scrollVel = (y - lastY) / innerHeight * 6; lastY = y;
    heroCover = y < heroRange - 2;
    pageProg = clamp((y - heroRange) / docRange, 0, 1);
    var solid = y > 24;
    if (solid !== navSolid) { navSolid = solid; nav.classList.toggle('solid', solid); }
    var alt = (scrubOn && y < heroRange) ? CONFIG.altTop + (CONFIG.altPass - CONFIG.altTop) * (y / heroRange)
      : CONFIG.altPass + (CONFIG.altTown - CONFIG.altPass) * pageProg;
    // the rail marker rides every frame, so it glides with the scroll
    if (railH) {
      var f = clamp((alt - CONFIG.altTown) / (CONFIG.altPass - CONFIG.altTown), 0, 1), my = (1 - f) * railH;
      if (Math.abs(my - lastMY) > 0.2) {
        lastMY = my;
        railMark.style.transform = 'translateY(' + my.toFixed(1) + 'px)';
        railFill.style.transform = 'scaleY(' + f.toFixed(4) + ')';
      }
    }
    if (now - lastAltAt > 100) {
      var s = (Math.round(alt / 5) * 5).toLocaleString('en-IN');
      if (s !== lastAlt) {
        lastAlt = s; altv.textContent = s; railV.textContent = s;
        altFill.style.transform = 'scaleY(' + clamp((alt - CONFIG.altTown) / (CONFIG.altPass - CONFIG.altTown), 0.04, 1).toFixed(3) + ')';
        for (var i = 0; i < railTicks.length; i++) {
          var T = railTicks[i], near = Math.abs(T.m - alt) < 140;
          if (near !== T.near) { T.near = near; T.el.classList.toggle('near', near); }
        }
      }
      lastAltAt = now;
    }
  }
  gsap.ticker.add(pageTick);
  ScrollTrigger.addEventListener('refresh', measure);

  /* ---------- smoothness governor: if this machine drops frames, shed the WebGL layers one step at a time ---------- */
  var slowFrames = 0, okFrames = 0, quality = 3, govArmed = 0;
  function governor(time, dt){
    if (document.hidden || dt > 250 || !introDone) { slowFrames = 0; return; }
    if (govArmed < 90) { govArmed++; return; }           // let the page settle after load first
    if (dt > 27) { slowFrames++; okFrames = 0; } else { okFrames++; if (okFrames > 20) slowFrames = Math.max(0, slowFrames - 1); }
    if (slowFrames < 45 || quality === 0) return;
    slowFrames = 0; quality--;
    if (quality === 2) {                                  // step 1: draw the canvases at 1x
      if (fx) { fx.renderer.setPixelRatio(1); fx.mat.uniforms.uPR.value = 1; fx.size(); }
      if (terrain) { terrain.renderer.setPixelRatio(1); terrain.renderer.setSize(innerWidth, innerHeight, false); }
    } else if (quality === 1) { fxBlocked = true; stopFx(); }   // step 2: drop the snow over the film
    else { terrainBlocked = true; stopTerrain(); gsap.ticker.remove(governor); }   // step 3: drawn contour lines instead of WebGL
  }
  gsap.ticker.add(governor);

  /* ---------- GSAP choreography for everything below the hero ---------- */
  var motionCtx = null;
  function setupMotion(){
    var cleanups = [];

    // entrances: whatever enters together arrives in sequence
    var items = $$('.rv');
    gsap.set(items, { autoAlpha: 0, y: 38 });
    ScrollTrigger.batch(items, {
      start: 'top 88%', once: true,
      onEnter: function(batch){ gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09, overwrite: true }); }
    });

    // section headlines: words rise out of a mask
    $$('[data-split="h"]').forEach(function(h){
      var inner = $$('.lw > span', h);
      gsap.set(inner, { yPercent: 118 });
      ScrollTrigger.create({ trigger: h, start: 'top 86%', once: true,
        onEnter: function(){ gsap.to(inner, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: 0.07, delay: 0.08 }); } });
    });

    // the statement lights up word by word as it crosses the screen
    var statement = $('#statement');
    gsap.fromTo(statement, { '--r': 0 }, { '--r': 1.2, ease: 'none',
      scrollTrigger: { trigger: statement, start: 'top 86%', end: 'bottom 42%', scrub: 0.6 } });

    // the four-line road draws itself
    $$('[data-draw]').forEach(function(road){
      gsap.fromTo(road, { '--d': 0 }, { '--d': 1, ease: 'none',
        scrollTrigger: { trigger: road, start: 'top 94%', end: 'top 34%', scrub: 0.7 } });
    });

    // counters
    $$('[data-count]').forEach(function(el){
      var to = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', o = { v: 0 }, last = '';
      el.textContent = '0' + suf;
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function(){
        gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: function(){
          var s = Math.round(o.v) + suf; if (s !== last) { last = s; el.textContent = s; }
        } });
      } });
      cleanups.push(function(){ el.textContent = to + suf; });
    });

    // depth: photos drift at their own speed
    var fm = $('.feature .media'), fi = $('.feature .media img');
    gsap.fromTo([fi, $('#convoyVideo')], { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.14, ease: 'none',
      scrollTrigger: { trigger: fm, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (matchMedia('(min-width: 721px)').matches) {
    gsap.fromTo('.collage .a', { y: 34 }, { y: -34, ease: 'none', scrollTrigger: { trigger: '.collage', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.collage .b', { y: 96 }, { y: -72, ease: 'none', scrollTrigger: { trigger: '.collage', start: 'top bottom', end: 'bottom top', scrub: true } });
    }
    $$('.bigno').forEach(function(b, i){
      gsap.fromTo(b, { x: i ? 46 : -46 }, { x: 0, ease: 'none', scrollTrigger: { trigger: b, start: 'top bottom', end: 'top 45%', scrub: 0.8 } });
    });
    gsap.fromTo('.join .panel-box', { scale: 0.94, y: 60 }, { scale: 1, y: 0, ease: 'none',
      scrollTrigger: { trigger: '.join .panel-box', start: 'top bottom', end: 'top 45%', scrub: 0.6 } });
    gsap.fromTo('footer .logo img', { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: 'none',
      scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } });

    // marquee: rolls on its own, speeds up and flips with the scroll
    var mq = $('.marquee'), x = 0, dir = 1, half = track.scrollWidth / 2, boost = 0, setX = gsap.quickSetter(track, 'x', 'px'), skew = gsap.quickSetter(track, 'skewX', 'deg'), lastSk = 0;
    var onResize = function(){ half = track.scrollWidth / 2; };
    addEventListener('resize', onResize);
    var mqTick = function(time, dt){
      if (!mq.classList.contains('live')) return;
      if (Math.abs(scrollVel) > 0.02) dir = scrollVel > 0 ? 1 : -1;
      boost += (Math.min(Math.abs(scrollVel) * 26, 30) - boost) * 0.1;
      x -= dir * (0.75 + boost) * (dt / 16.667);
      if (x <= -half) x += half; else if (x > 0) x -= half;
      setX(x);
      var sk = clamp(-scrollVel * 9, -7, 7); sk = lastSk + (sk - lastSk) * 0.12;
      if (Math.abs(sk - lastSk) > 0.01) { lastSk = sk; skew(sk); }
    };
    gsap.ticker.add(mqTick);
    cleanups.push(function(){ gsap.ticker.remove(mqTick); removeEventListener('resize', onResize); gsap.set(track, { clearProps: 'transform' }); });

    // magnetic buttons, mouse only
    if (FINE.matches) {
      $$('.btn').forEach(function(b){
        var qx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3.out' }), qy = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3.out' });
        var move = function(e){ var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.28); qy((e.clientY - r.top - r.height / 2) * 0.38); };
        var leave = function(){ qx(0); qy(0); };
        b.addEventListener('pointermove', move); b.addEventListener('pointerleave', leave);
        cleanups.push(function(){ b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); });
      });
    }

    return function(){ cleanups.forEach(function(f){ f(); }); };
  }
  function startMotion(){ if (!motionCtx && !reduced) motionCtx = gsap.context(setupMotion); }
  function stopMotion(){ if (motionCtx) { motionCtx.revert(); motionCtx = null; } }

  /* ---------- convoy loop inside the feature card ---------- */
  (function(){
    var media = $('#convoyMedia'), v = $('#convoyVideo'), loaded = false;
    if (!CONFIG.convoyVideo) return;
    new IntersectionObserver(function(es){
      if (es[0].isIntersecting && !reduced) {
        if (!loaded) { loaded = true; v.src = CONFIG.convoyVideo; v.addEventListener('playing', function(){ media.classList.add('playing'); }, { once: true }); }
        var p = v.play(); if (p && p.catch) p.catch(function(){});
      } else if (loaded) v.pause();
    }, { threshold: 0.3 }).observe(media);
  })();

  /* ---------- reduced motion, live in both directions ---------- */
  function pinToFinalStates(){
    reduced = true; root.classList.add('rm');
    stopMotion(); stopLenis(); stopTerrain(); stopFx();
    if (!revDone) { completeRev(true); revPinned = true; }
  }
  function unpinFinalStates(){
    reduced = false; root.classList.remove('rm');
    if (revPinned) resetRev();
    startLenis(); startTerrain(); startMotion();
  }
  var MQLS = GATES.map(function(q){ return matchMedia(q); });
  MQLS.forEach(function(m){
    m.addEventListener('change', function(){
      if (m.media === RM.media) { if (RM.matches) pinToFinalStates(); else unpinFinalStates(); }
      applyHeroMode(); measure(); ScrollTrigger.refresh();
    });
  });
  FINE.addEventListener('change', function(){ if (FINE.matches) startLenis(); else stopLenis(); });

  /* ---------- go: a short curtain, then the first headline assembles ---------- */
  function lift(){
    introDone = true; loadStart = performance.now(); kickHero();
  }
  if (reduced) {
    pinToFinalStates(); intro.style.display = 'none'; introDone = true; loadK = 1;
    applyHeroMode(); measure();
  } else {
    startLenis(); startTerrain(); applyHeroMode(); startMotion(); measure();
    intro.style.animation = 'none';
    var navBits = $$('#nav > *');
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .fromTo('#intro .mark', { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 0.7 })
      .fromTo('#intro .bar i', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, 0.1)
      .to('#intro .mark, #intro .bar', { autoAlpha: 0, y: -18, duration: 0.4, ease: 'power2.in' }, 0.85)
      .add(lift, 1.05)
      .to(intro, { yPercent: -100, duration: 1.0, ease: 'expo.inOut' }, 1.0)
      .from(navBits, { y: -22, autoAlpha: 0, duration: 0.9, stagger: 0.06, clearProps: 'all' }, 1.45)
      .from('#altrail .cap', { autoAlpha: 0, x: 16, duration: 0.9, stagger: 0.08, clearProps: 'all' }, 1.7)
      .from('#altrail .mark', { autoAlpha: 0, duration: 0.9, clearProps: 'opacity,visibility' }, 1.9)
      .from('#altrail .line', { scaleY: 0, transformOrigin: '50% 0%', duration: 1.1, ease: 'expo.inOut', clearProps: 'transform' }, 1.55)
      .from('#altrail .tick', { scaleX: 0, duration: 0.6, stagger: { each: 0.018, from: 'start' }, clearProps: 'transform' }, 1.75)
      .set(intro, { display: 'none' });
  }
}
