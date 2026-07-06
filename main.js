/* ============================================================
   HKTCG — scroll-film hero (generated walkthrough edition)
   Five AI-generated clips (Higgsfield: GPT Image 2 stills →
   Kling v3 image-to-video camera moves), cut into frames and
   scrubbed by scroll — the raw store videos are NOT used.
     scene 1  logo wall — dolly forward, arrive beside the boxed T
     scene 2  slat doors — walk through the opening
     scene 3  collectible museum — drift around the red cube
     scene 4  showcase hall — pan 向左向右 across the shelves
     scene 5  grand floor — walk the aisle under the ring light
   Engine: canvas frame scrub, fractional blend, nearest-loaded
   fallback (from the SolaraLab site), native scroll, IO reveals.
   ============================================================ */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- scroll-scrub canvas ---------- */
  var COUNT = window.__FRAME_COUNT || 175; // set in index.html after the cut
  var FRAME = function (i) { return "assets/film/f-" + String(i + 1).padStart(3, "0") + ".jpg"; };

  var canvas = document.getElementById("film");
  var ctx = canvas ? canvas.getContext("2d") : null;
  var hero = document.getElementById("hero");
  var frames = [], anyLoaded = false;
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  var cw = 0, ch = 0;

  function resize() {
    if (!canvas) return;
    cw = canvas.clientWidth; ch = canvas.clientHeight;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function blit(img, alpha) {
    if (!img || !img.complete || !img.naturalWidth) return false;
    var s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    var w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) * 0.45, w, h);
    ctx.globalAlpha = 1;
    return true;
  }
  function ok(i) { return frames[i] && frames[i].complete && frames[i].naturalWidth; }
  function nearest(i) {
    if (ok(i)) return i;
    for (var d = 1; d < COUNT; d++) {
      if (ok(i - d)) return i - d;
      if (ok(i + d)) return i + d;
    }
    return -1;
  }
  function render(fi) {
    if (!ctx) return;
    var i0 = Math.floor(fi), frac = fi - i0, i1 = Math.min(COUNT - 1, i0 + 1);
    var base = nearest(i0); if (base < 0) return;
    blit(frames[base], 1);
    if (frac > 0.01 && base === i0 && ok(i1)) blit(frames[i1], frac);
  }
  if (canvas && ctx) {
    resize();
    for (var i = 0; i < COUNT; i++) {
      var img = new Image(); img.decoding = "async";
      img.onload = (function (idx) { return function () {
        anyLoaded = true; if (idx === 0) update();
      }; })(i);
      img.src = FRAME(i); frames[i] = img;
    }
  }

  function heroProgress() {
    if (!hero) return 0;
    var r = hero.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  }

  /* ---------- overlays keyed to scroll (scenes are 20% each) ---------- */
  function ramp(p, a, b) { return Math.min(1, Math.max(0, (p - a) / (b - a))); }
  var overlays = [
    [document.getElementById("ov1"), -0.05, 0.095],
    [document.getElementById("ov2"), 0.115, 0.215],
    [document.getElementById("ov3"), 0.24, 0.38],
    [document.getElementById("ov4"), 0.44, 0.58],
    [document.getElementById("ov5"), 0.63, 0.78],
    [document.getElementById("ov6"), 0.87, 1.01]
  ];
  var hint = document.getElementById("hint");
  var bar = document.getElementById("progress");
  var nav = document.getElementById("nav");

  var ticking = false;
  function update() {
    ticking = false;
    var p = heroProgress();
    if (anyLoaded) render(p * (COUNT - 1));
    overlays.forEach(function (o) {
      var el = o[0]; if (!el) return;
      var vis = Math.min(ramp(p, o[1], o[1] + 0.035), 1 - ramp(p, o[2] - 0.035, o[2]));
      vis = Math.min(1, Math.max(0, vis));
      el.style.opacity = vis.toFixed(3);
      el.style.transform = "translateY(" + (14 * (1 - vis)) + "px)";
    });
    if (hint) hint.style.opacity = Math.max(0, 1 - ramp(p, 0.01, 0.04)).toFixed(3);

    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { resize(); onScroll(); }, { passive: true });

  if (reduceMotion && hero) hero.style.height = "100vh";
  update();

  /* ---------- smooth anchor nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"); if (id.length < 2) return;
      var target = document.querySelector(id); if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---------- IO reveals ---------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }
})();
