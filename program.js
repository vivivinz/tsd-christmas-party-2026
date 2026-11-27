/* =====================================================================
   PROGRAM: "Wired for Greatness" lights timeline
   Self-contained: program.js + program.css + <section id="program">.
   ===================================================================== */

/* ---------------------------------------------------------------------
   EDIT THE PROGRAM HERE
   time:  text in the gold pill (use "" to hide the pill for that item)
   title: activity name
   act:   1–4 (act names are in ACTS below)
   Items whose title contains "Raffle" get a gift-ticket icon automatically;
   the LAST item is styled as the finale (disco ball + confetti).
   --------------------------------------------------------------------- */
var PROGRAM = [
  { time: '5:00 – 5:30 PM', title: 'Registration', act: 1 },
  { time: '5:30 – 5:45 PM', title: 'Short Introduction / Activity', act: 1 },
  { time: '5:45 – 5:50 PM', title: 'Prayer', act: 1 },
  { time: '5:50 – 6:00 PM', title: 'Welcoming of Guests', act: 1 },
  { time: '6:00 – 6:10 PM', title: 'Opening Remarks', act: 1 },
  { time: '6:10 – 6:20 PM', title: 'Powerful Message', act: 1 },

  { time: '6:20 – 6:40 PM', title: 'Ice Breaker', act: 2 },
  { time: '6:40 – 6:45 PM', title: 'Raffle (First Set)', act: 2 },
  { time: '6:45 – 7:00 PM', title: 'Game 1', act: 2 },
  { time: '7:00 – 7:05 PM', title: 'Teaser Video for Ka-Voice', act: 2 },
  { time: '7:05 – 7:20 PM', title: 'Game 2', act: 2 },
  { time: '7:20 – 7:30 PM', title: 'Raffle (Second Set)', act: 2 },

  { time: '7:30 – 8:00 PM', title: 'Dinner (Band 1st Set)', act: 3 },
  { time: '8:00 – 9:00 PM', title: 'Ka-Voice Proper', act: 3 },
  { time: '9:00 – 9:10 PM', title: 'TSD Management Production Number', act: 3 },

  { time: '9:10 – 9:20 PM', title: 'Raffle (Last)', act: 4 },
  { time: '9:20 – 9:25 PM', title: 'Closing Remarks', act: 4 },
  { time: '9:25 – 9:30 PM', title: 'Awarding of Winners', act: 4 },
  { time: '9:30 PM – End', title: 'Band Last Set', act: 4 },
  { time: '', title: 'Party Time', act: 4 }
];

/* Act headers: name + the Christmas elements used for that header
   (marker = hangs on the light wire, deco = beside the header). */
var ACTS = {
  1: { name: 'The Welcome',        marker: 'black-bow',    deco: 'candle' },
  2: { name: 'Games & Giveaways',  marker: 'holly',        deco: 'gift-red' },
  3: { name: 'Dinner & Showcase',  marker: 'red-ornament', deco: 'champagne-glasses' },
  4: { name: 'The Grand Finale',   marker: 'gold-ribbon',  deco: 'christmas-tree' }
};

/* Section text */
var PROGRAM_COPY = {
  eyebrow: 'TSD Christmas Party 2026',
  title: 'The Program',
  lede: 'Follow the lights — here’s how the night unfolds.',
  closingLine: 'Wired for Greatness,\nPowered by Passion',
  backLabel: 'Back to invitation'
};
/* ===================================================================== */


(function () {
  'use strict';

  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];

  // intrinsic sizes of the decorative webp files (for width/height attributes)
  var SIZES = {
    'black-bow': [207, 190], 'holly': [216, 184], 'red-ornament': [184, 311], 'gold-ribbon': [224, 175],
    'candle': [242, 386], 'gift-red': [204, 223], 'gift-black': [304, 310], 'gift-cream': [194, 212],
    'champagne-glasses': [322, 290], 'christmas-tree': [520, 777], 'bottle': [142, 497],
    'disco-ball': [245, 291], 'gold-squiggle': [446, 46]
  };
  // card-corner and wide-screen margin decorations (rotated, never the same twice in a row)
  var CORNER_DECOS = ['holly', 'gold-ribbon', 'black-bow'];
  var MARGIN_DECOS = ['gift-cream', 'bottle', 'gift-black', 'candle', 'champagne-glasses', 'gift-red', 'red-ornament'];

  var lastDeco = '';
  function pick(list, i) {
    for (var k = 0; k < list.length; k++) {
      var n = list[(i + k) % list.length];
      if (n !== lastDeco) { lastDeco = n; return n; }
    }
    return list[i % list.length];
  }
  function deco(name, cls) {
    var im = doc.createElement('img');
    im.loading = 'lazy';
    im.decoding = 'async';
    im.alt = '';
    im.className = cls;
    var s = SIZES[name] || [200, 200];
    im.width = s[0];
    im.height = s[1];
    im.src = 'assets/' + name + '.webp';
    lastDeco = name;
    return im;
  }
  function el(tag, cls, text) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  var TICKET_SVG =
    '<svg class="p-ticket" viewBox="0 0 28 20" aria-hidden="true">' +
    '<path class="p-ticket__body" d="M3 2h22a1.5 1.5 0 0 1 1.5 1.5v3.6a2.9 2.9 0 0 0 0 5.8v3.6A1.5 1.5 0 0 1 25 18H3a1.5 1.5 0 0 1-1.5-1.5v-3.6a2.9 2.9 0 0 0 0-5.8V3.5A1.5 1.5 0 0 1 3 2Z"/>' +
    '<path class="p-ticket__cut" d="M19 4.5v11"/>' +
    '<rect class="p-ticket__gift" x="7.5" y="8.6" width="7" height="5.6" rx=".5"/>' +
    '<path class="p-ticket__ribbon" d="M11 8.6v5.6M7.5 10.6h7"/>' +
    '<path class="p-ticket__bow" d="M11 8.4c-1.6-2.2-3.6-1-2.4.1.6.5 1.6.3 2.4-.1Zm0 0c1.6-2.2 3.6-1 2.4.1-.6.5-1.6.3-2.4-.1Z"/>' +
    '</svg>';

  /* ---------------------------------------------------------------- render */
  function render() {
    var timeline = $('#programTimeline');
    if (!timeline) return;

    // group by act, keeping order
    var groups = [];
    PROGRAM.forEach(function (item, idx) {
      var g = groups[groups.length - 1];
      if (!g || g.act !== item.act) { g = { act: item.act, items: [] }; groups.push(g); }
      g.items.push({ data: item, index: idx });
    });

    var side = 0;           // alternates left/right on wide screens
    var cardCount = 0;
    var frag = doc.createDocumentFragment();

    groups.forEach(function (g, gi) {
      var act = ACTS[g.act] || { name: 'Act ' + g.act };
      var section = el('section', 'act');
      section.setAttribute('aria-labelledby', 'act-title-' + gi);
      section.dataset.act = g.act;

      // ---- act header
      var head = el('header', 'act__head' + (gi % 2 ? ' act__head--flip' : ''));
      if (act.marker) head.appendChild(deco(act.marker, 'act__marker act__marker--' + act.marker));
      var text = el('div', 'act__text');
      text.appendChild(el('span', 'act__num', 'Act ' + (ROMAN[g.act] || g.act)));
      var h = el('h3', 'act__title', act.name);
      h.id = 'act-title-' + gi;
      text.appendChild(h);
      text.appendChild(deco('gold-squiggle', 'act__squiggle'));
      head.appendChild(text);
      if (act.deco) head.appendChild(deco(act.deco, 'act__deco act__deco--' + act.deco));
      section.appendChild(head);

      // ---- items
      var list = el('ol', 'act__list');
      g.items.forEach(function (entry) {
        var item = entry.data;
        var isFinale = entry.index === PROGRAM.length - 1;
        var isRaffle = /raffle/i.test(item.title);
        var li = el('li', 'p-item ' + (side % 2 ? 'p-item--right' : 'p-item--left') +
          (isRaffle ? ' p-item--raffle' : '') + (isFinale ? ' p-item--finale' : ''));
        side++;

        var bulb = el('span', 'p-bulb');
        bulb.setAttribute('aria-hidden', 'true');
        bulb.appendChild(el('i', 'p-bulb__glass'));
        li.appendChild(bulb);

        var card = el('div', 'p-card');
        // a small corner decoration on every third regular card
        if (!isFinale && !isRaffle && cardCount % 3 === 1) {
          card.classList.add('p-card--deco');
          card.appendChild(deco(pick(CORNER_DECOS, cardCount), 'p-card__corner'));
        }
        if (item.time && String(item.time).trim()) card.appendChild(el('span', 'p-time', item.time));
        var title = el('p', 'p-title');
        if (isRaffle) title.insertAdjacentHTML('afterbegin', TICKET_SVG);
        title.appendChild(doc.createTextNode(item.title));
        card.appendChild(title);
        if (isFinale) {
          card.appendChild(deco('disco-ball', 'p-card__disco'));
          var sp = el('span', 'p-card__sparkles');
          sp.setAttribute('aria-hidden', 'true');
          sp.innerHTML = '<i></i><i></i><i></i>';
          card.appendChild(sp);
        }
        li.appendChild(card);

        // wide screens: an occasional decoration in the empty half
        if (!isFinale && cardCount % 4 === 2) {
          li.appendChild(deco(pick(MARGIN_DECOS, cardCount), 'p-margin'));
        }
        cardCount++;
        list.appendChild(li);
      });
      section.appendChild(list);
      frag.appendChild(section);
    });

    timeline.appendChild(frag);
  }

  function fillCopy() {
    doc.querySelectorAll('[data-program-copy]').forEach(function (e) {
      var v = PROGRAM_COPY[e.getAttribute('data-program-copy')];
      if (typeof v === 'string') e.textContent = v;
    });
  }

  /* ---------------------------------------------------------- light-up */
  function lightUp(li) {
    li.classList.add('is-lit');
    if (li.classList.contains('p-item--finale') && !reduceMotion && window.TSD && window.TSD.confettiBurst) {
      setTimeout(function () {
        var r = li.querySelector('.p-card').getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) window.TSD.confettiBurst(r.left + r.width / 2, r.top + r.height * 0.3);
      }, 420);
    }
  }

  function observe() {
    var items = doc.querySelectorAll('.p-item, .act__head');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (i) { i.classList.add('is-lit', 'is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        if (t.classList.contains('p-item')) lightUp(t); else t.classList.add('is-in');
        io.unobserve(t); // once lit, stays lit
      });
    }, { rootMargin: '0px 0px -18% 0px', threshold: 0.01 });
    items.forEach(function (i) { io.observe(i); });
  }

  /* ------------------------------------------- snow + wire progress + back */
  function makeSnow() {
    var box = $('.program__snow');
    if (!box || reduceMotion) return;
    var n = window.innerWidth < 600 ? 14 : 22;
    var html = '';
    for (var i = 0; i < n; i++) {
      var left = (Math.random() * 100).toFixed(1);
      var size = (3 + Math.random() * 4).toFixed(1);
      var dur = (9 + Math.random() * 9).toFixed(1);
      var delay = (-Math.random() * 18).toFixed(1);
      var drift = ((Math.random() - 0.5) * 60).toFixed(0);
      var round = Math.random() < 0.55;
      html += '<i style="left:' + left + '%;width:' + size + 'px;height:' + (round ? size : (size * 0.55).toFixed(1)) +
        'px;animation-duration:' + dur + 's;animation-delay:' + delay + 's;--drift:' + drift + 'px;' +
        (round ? 'border-radius:50%;' : '') + '"></i>';
    }
    box.innerHTML = html;
  }

  function scrollEffects() {
    var program = $('#program');
    var timeline = $('#programTimeline');
    var fill = $('.timeline__fill');
    var backFloat = $('#backFloat');
    var ticking = false;
    var active = false;

    function update() {
      ticking = false;
      if (program.hidden) return;
      var vh = window.innerHeight;
      var pr = program.getBoundingClientRect();
      var nowActive = pr.top < vh && pr.bottom > 0;
      if (nowActive !== active) {
        active = nowActive;
        program.classList.toggle('is-active', active);
      }
      if (fill && active) {
        var tr = timeline.getBoundingClientRect();
        var p = (vh * 0.72 - tr.top) / tr.height;
        p = Math.max(0, Math.min(1, p));
        fill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      }
      if (backFloat) {
        var show = pr.top < -vh * 0.4 && pr.bottom > vh * 0.5;
        if (show && backFloat.hidden) {
          backFloat.hidden = false;
          requestAnimationFrame(function () { backFloat.classList.add('is-shown'); });
        } else if (!show && backFloat.classList.contains('is-shown')) {
          backFloat.classList.remove('is-shown');
        }
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  function backButtons() {
    doc.querySelectorAll('.js-back').forEach(function (b) {
      b.addEventListener('click', function () {
        var scene = $('#scene');
        if (scene && !scene.hidden) scene.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        else window.scrollTo(0, 0);
        var h = $('#sceneHeading');
        if (h) setTimeout(function () { try { h.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, reduceMotion ? 0 : 900);
      });
    });
  }

  function init() {
    fillCopy();
    render();
    makeSnow();
    observe();
    scrollEffects();
    backButtons();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
