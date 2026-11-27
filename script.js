(function () {
  'use strict';

  /* =====================================================================
     EDITABLE CONTENT: change the invitation text here.
     "\n" forces a line break.
     (Link-preview text lives in the <head> of index.html; the calendar
     event lives in assets/tsd-christmas-party-2026.ics.)
     ===================================================================== */
  var CONTENT = {
    cover: {
      titleTop: 'TSD',
      titleMain: 'Christmas\nParty 2026',
      script: 'You’re Invited',
      prompt: 'CLICK TO OPEN'
    },
    card: {
      theme: 'STRONGER: Wired for\nGreatness, Powered by Passion',
      venue: 'SLD Events Pavilion',
      address: 'Antipolo Del Norte, Lipa City',
      date: 'December 18, 2026',
      time: '5:00 PM Onwards',
      mapUrl: 'https://maps.app.goo.gl/RPTJfF8uCEnWGuTv6?g_st=ic'
    },
    label: {
      line1: 'Christmas',
      script: 'Party',
      year: '2026'
    },
    button: {
      details: 'Tap to View Details'
    },
    details: {
      calendarButton: 'Add to Calendar'
    },
    music: {
      src: 'assets/christmas.mp3',
      volume: 0.35,      // 0–1, target volume after the fade-in
      fadeInSeconds: 2.5
    }
  };
  /* ===================================================================== */

  var doc = document;
  var $ = function (sel) { return doc.querySelector(sel); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  /* ---------- copy ---------- */
  function lookup(path) {
    return path.split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, CONTENT);
  }
  function fillCopy() {
    doc.querySelectorAll('[data-copy]').forEach(function (el) {
      var v = lookup(el.getAttribute('data-copy'));
      if (typeof v === 'string') el.textContent = v;
    });
    ['#venueLink', '#closingVenue'].forEach(function (sel) {
      var a = $(sel);
      if (a) a.href = CONTENT.card.mapUrl;
    });
  }

  /* =====================================================================
     MUSIC
     Started inside the envelope tap (browsers only allow sound after a
     user gesture). Web Audio is used for the fade because iOS ignores
     audio.volume. Every step is guarded: if anything fails, the page
     simply stays silent.
     ===================================================================== */
  var Music = (function () {
    var audio = null, ctx = null, gain = null;
    var started = false, muted = false, failed = false, wantPlaying = false;
    var target = CONTENT.music.volume;
    var fadeTimer = null;

    try { muted = sessionStorage.getItem('tsd-muted') === '1'; } catch (e) { /* storage blocked */ }

    function init() {
      try {
        audio = new Audio();
        audio.loop = true;
        audio.preload = 'auto';
        audio.setAttribute('playsinline', '');
        audio.addEventListener('error', function () { failed = true; onFail(); });
        audio.src = CONTENT.music.src;
      } catch (e) { failed = true; }
    }

    function onFail() {
      var btn = $('#soundBtn');
      if (btn) { btn.classList.remove('is-shown'); btn.hidden = true; }
    }

    function setLevel(v, seconds) {
      if (gain && ctx) {
        try {
          var now = ctx.currentTime;
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.linearRampToValueAtTime(v, now + Math.max(0.01, seconds));
          return;
        } catch (e) { /* fall through to element volume */ }
      }
      if (!audio) return;
      clearInterval(fadeTimer);
      var from = audio.volume, steps = Math.max(1, Math.round(seconds * 20)), i = 0;
      fadeTimer = setInterval(function () {
        i++;
        try { audio.volume = Math.min(1, Math.max(0, from + (v - from) * (i / steps))); } catch (e) { /* ignore */ }
        if (i >= steps) clearInterval(fadeTimer);
      }, 50);
    }

    function play() {
      if (!audio || failed) return;
      try {
        if (ctx && ctx.state !== 'running' && ctx.resume) ctx.resume().catch(function () {});
        var p = audio.play();
        if (p && p.catch) p.catch(function () { /* blocked or interrupted: stay silent */ });
      } catch (e) { /* ignore */ }
    }

    // must be called synchronously inside the tap handler
    function start() {
      if (started || failed || !audio) return;
      started = true;
      wantPlaying = !muted;
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* not supported */ }
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) {
          ctx = new AC();
          var source = ctx.createMediaElementSource(audio);
          gain = ctx.createGain();
          gain.gain.value = 0;
          source.connect(gain);
          gain.connect(ctx.destination);
        } else {
          audio.volume = 0;
        }
      } catch (e) {
        ctx = null; gain = null;
        try { audio.volume = 0; } catch (e2) { /* ignore */ }
      }
      if (!muted) {
        play();
        setLevel(target, CONTENT.music.fadeInSeconds);
      }
    }

    function setMuted(m) {
      muted = m;
      wantPlaying = !m;
      try { sessionStorage.setItem('tsd-muted', m ? '1' : '0'); } catch (e) { /* ignore */ }
      if (!started || failed) return;
      if (m) {
        setLevel(0, 0.35);
        setTimeout(function () { if (muted && audio) audio.pause(); }, 380);
      } else {
        play();
        setLevel(target, 0.8);
      }
    }

    // pause in the background, resume when the tab comes back
    doc.addEventListener('visibilitychange', function () {
      if (!started || failed || !audio) return;
      if (doc.hidden) {
        audio.pause();
        if (ctx && ctx.suspend) ctx.suspend().catch(function () {});
      } else if (wantPlaying) {
        play();
      }
    });
    // iOS sometimes refuses to resume without a gesture: retry on the next tap
    doc.addEventListener('pointerdown', function () {
      if (started && wantPlaying && audio && (audio.paused || (ctx && ctx.state !== 'running'))) play();
    }, { passive: true });

    return {
      init: init,
      start: start,
      setMuted: setMuted,
      isMuted: function () { return muted; },
      hasFailed: function () { return failed; }
    };
  })();

  /* =====================================================================
     CONFETTI (light DOM burst: transform/opacity only)
     ===================================================================== */
  function confettiBurst(x, y) {
    if (reduceMotion) return;
    var layer = $('#confetti');
    if (!layer || !layer.animate) return;
    var colors = ['#d1a01f', '#e8c25a', '#f3dd94', '#b8860b', '#fff1c1', '#c9a227'];
    var count = window.innerWidth < 500 ? 46 : 64;
    var frag = doc.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var p = doc.createElement('i');
      var w = 6 + Math.random() * 7, h = w * (0.4 + Math.random() * 0.8);
      p.style.width = w + 'px';
      p.style.height = h + 'px';
      p.style.background = colors[i % colors.length];
      frag.appendChild(p);
      var angle = (-90 + (Math.random() - 0.5) * 150) * Math.PI / 180;
      var dist = 90 + Math.random() * Math.min(260, window.innerWidth * 0.55);
      var dx = Math.cos(angle) * dist, dy = Math.sin(angle) * dist;
      var fall = 160 + Math.random() * 220;
      var rot = (Math.random() - 0.5) * 900;
      var dur = 1500 + Math.random() * 900;
      p.animate([
        { transform: 'translate(' + x + 'px,' + y + 'px) rotate(0deg) scale(.6)', opacity: 1 },
        { transform: 'translate(' + (x + dx) + 'px,' + (y + dy) + 'px) rotate(' + rot * 0.5 + 'deg) scale(1)', opacity: 1, offset: 0.35 },
        { transform: 'translate(' + (x + dx * 1.25) + 'px,' + (y + dy + fall) + 'px) rotate(' + rot + 'deg) scale(.9)', opacity: 0 }
      ], { duration: dur, easing: 'cubic-bezier(.15,.7,.35,1)', fill: 'forwards' })
        .onfinish = (function (el) { return function () { el.remove(); }; })(p);
    }
    layer.appendChild(frag);
  }

  /* =====================================================================
     OPENING SEQUENCE
     ===================================================================== */
  var opened = false;

  function openInvitation() {
    if (opened) return;
    opened = true;
    Music.start(); // same tap → allowed to play

    var cover = $('#cover');
    cover.classList.add('is-opening');
    $('#openBtn').setAttribute('aria-expanded', 'true');

    if (reduceMotion || !Element.prototype.animate) {
      wait(250).then(showScene);
      return;
    }

    var body = $('.envelope__body');
    var flap = $('.envelope__flap');
    var card = $('.envelope__card');
    var crack = $('.seal-crack path');
    var env = $('#openBtn');
    var persp = 'perspective(' + Math.round(env.offsetWidth * 2.6) + 'px) ';

    // 1. press + crack the seal
    body.animate([{ transform: 'scale(1)' }, { transform: 'scale(.975)' }, { transform: 'scale(1)' }],
      { duration: 340, easing: 'ease-out' });
    var len = 400;
    try { len = crack.getTotalLength(); } catch (e) { /* ignore */ }
    crack.style.strokeDasharray = len;
    crack.animate([{ strokeDashoffset: len, opacity: 1 }, { strokeDashoffset: 0, opacity: 1 }],
      { duration: 240, delay: 110, easing: 'ease-in', fill: 'forwards' });

    wait(420).then(function () {
      // 2. flap opens in 3D (carrying the top half of the seal)
      crack.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
      flap.animate([
        { transform: persp + 'rotateX(0deg)' },
        { transform: persp + 'rotateX(180deg)' }
      ], { duration: 900, easing: 'cubic-bezier(.5,.05,.25,1)', fill: 'forwards' });
      setTimeout(function () { flap.style.zIndex = '1'; }, 470); // edge-on → tuck behind the card
      return wait(620);
    }).then(function () {
      // 3. card slides out + gold confetti
      card.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-58%)' }],
        { duration: 1050, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'forwards' });
      var r = env.getBoundingClientRect();
      setTimeout(function () { confettiBurst(r.left + r.width / 2, r.top + r.height * 0.05); }, 260);
      return wait(1500);
    }).then(showScene);
  }

  function showScene() {
    var cover = $('#cover');
    var scene = $('#scene');
    var program = $('#program');

    window.scrollTo(0, 0);
    cover.classList.add('is-overlay');           // keep the cover on top while the scene appears under it
    scene.hidden = false;
    if (program) program.hidden = false;
    doc.body.classList.remove('is-locked');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        scene.classList.add('is-in');
        cover.classList.add('is-leaving');
        showSoundButton();
      });
    });

    setTimeout(function () {
      cover.hidden = true;
      var h = $('#sceneHeading');
      if (h) { try { h.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    }, reduceMotion ? 450 : 900);
  }

  /* =====================================================================
     SOUND BUTTON
     ===================================================================== */
  function showSoundButton() {
    var btn = $('#soundBtn');
    if (!btn || Music.hasFailed()) return;
    syncSoundButton();
    btn.hidden = false;
    requestAnimationFrame(function () { btn.classList.add('is-shown'); });
  }
  function syncSoundButton() {
    var btn = $('#soundBtn');
    var m = Music.isMuted();
    btn.setAttribute('aria-pressed', m ? 'true' : 'false');
    btn.setAttribute('aria-label', m ? 'Play music' : 'Mute music');
  }

  /* =====================================================================
     INIT
     ===================================================================== */
  function init() {
    fillCopy();
    Music.init();

    var cover = $('#cover');
    var btn = $('#openBtn');
    btn.setAttribute('aria-expanded', 'false');
    // the whole cover is tappable; the envelope is the keyboard-focusable control
    cover.addEventListener('click', openInvitation);

    $('#soundBtn').addEventListener('click', function () {
      Music.setMuted(!Music.isMuted());
      syncSoundButton();
    });

    $('#detailsBtn').addEventListener('click', function (e) {
      var target = $('#program');
      if (!target) return;
      e.preventDefault();
      this.classList.add('was-used'); // stops the "tap me" hint
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      var title = $('#programTitle');
      if (title) {
        setTimeout(function () { try { title.focus({ preventScroll: true }); } catch (e2) { /* ignore */ } }, reduceMotion ? 0 : 900);
      }
    });

    // start the entrance once fonts are ready (or after a short timeout)
    var go = function () { doc.documentElement.classList.add('is-ready'); };
    var fontsReady = doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, wait(1200)]).then(go, go);
  }

  // small shared hooks for program.js
  window.TSD = { confettiBurst: confettiBurst, reduceMotion: reduceMotion };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
