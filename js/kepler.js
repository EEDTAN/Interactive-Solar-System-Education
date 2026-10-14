/*
 * kepler.js: halaman Hukum Kepler.
 * 1. Lab kanvas hukum I dan II: posisi planet dihitung dari persamaan Kepler di setiap langkah animasi.
 * 2. Hukum III: grafik log-log dari SOLAR_DATA, kalkulator a <-> P, dan tabel P²/a³.
 */
(function () {
  'use strict';

  // common.js sudah menampilkan pesan galat bila data.js atau astro.js tidak termuat.
  if (!window.App || !App.data || !window.Astro) return;

  var TAU = Math.PI * 2;
  var SECTORS = 12;        // juring hukum II
  var ARC_STEPS = 128;     // titik per busur juring; selisih luas poligon antarjuring di bawah 0,01 %
  var LOOP_SECONDS = 12;   // lama satu putaran orbit pada kecepatan 1×
  var TIME_STEPS = 120;    // langkah penggeser waktu, 10 langkah per juring
  var PRESET_IDS = ['earth', 'mars', 'mercury', 'pluto', 'halley'];
  var YEAR_DAYS = App.data.constants.SIDEREAL_YEAR_DAYS;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fmt = App.fmt;
  var SUN = App.body('sun');

  function $(id) { return document.getElementById(id); }
  function clamp(x, lo, hi) { return Math.min(hi, Math.max(lo, x)); }
  function setText(el, s) { if (el.textContent !== s) el.textContent = s; }

  // Tiga angka penting: 0,241; 5,2; 164; 0,00465.
  function fmtSig(x) {
    return fmt(x, clamp(2 - Math.floor(Math.log10(Math.abs(x))), 0, 12));
  }

  // Eksentrisitas seteliti datanya (0,017; 0,2488; 0,9673), nilai penggeser dua desimal (0,20).
  function fmtE(e) { return fmt(e, 4, 2); }

  var rootStyle = getComputedStyle(document.documentElement);
  function token(name) { return rootStyle.getPropertyValue(name).trim(); }
  var COLOR = {
    bg: token('--bg-sunken'),
    text: token('--text'),
    muted: token('--text-muted'),
    line: token('--line-strong'),
    accent: token('--accent')
  };

  /* ---------- Geometri orbit ----------
   * Satuan a = 1. Pusat elips di (0, 0), perihelion di sumbu x positif, Matahari di (e, 0),
   * fokus kosong di (-e, 0). Anomali rata-rata M bertambah rata terhadap waktu; persamaan
   * Kepler M = E - e sin E memberi anomali eksentrik E, lalu posisinya (cos E, b sin E).
   */

  function polygonArea(pts) {
    var s = 0;
    for (var i = 0, n = pts.length; i < n; i++) {
      var p = pts[i], q = pts[(i + 1) % n];
      s += p[0] * q[1] - q[0] * p[1];
    }
    return Math.abs(s) / 2;
  }

  // Juring k disapu antara M = k/12 dan (k+1)/12 putaran, jadi waktu tempuhnya sama.
  // Luasnya dihitung dari poligon yang juga digambar, sebagai bukti hukum II.
  function makeOrbit(e) {
    var b = Math.sqrt(1 - e * e);
    var bounds = [];
    for (var k = 0; k <= SECTORS; k++) bounds.push(Astro.solveKepler(TAU * k / SECTORS, e));
    var sectors = [], areas = [], perimeter = 0;
    for (k = 0; k < SECTORS; k++) {
      var pts = [[e, 0]];
      for (var j = 0; j <= ARC_STEPS; j++) {
        var E = bounds[k] + (bounds[k + 1] - bounds[k]) * j / ARC_STEPS;
        pts.push([Math.cos(E), b * Math.sin(E)]);
        if (j) perimeter += Math.hypot(pts[j + 1][0] - pts[j][0], pts[j + 1][1] - pts[j][1]);
      }
      sectors.push(pts);
      areas.push(polygonArea(pts));
    }
    var ellipse = Math.PI * b;
    var sum = areas.reduce(function (s, x) { return s + x; }, 0);
    return {
      e: e,
      b: b,
      sectors: sectors,
      areaShare: sum / SECTORS / ellipse,
      spread: (Math.max.apply(null, areas) - Math.min.apply(null, areas)) / (ellipse / SECTORS),
      // Kecepatan rata-rata terhadap waktu = keliling / periode. Dengan GM = a = 1, periodenya 2π.
      vMean: perimeter / TAU
    };
  }

  function orbitState(orbit, t) {
    var M = TAU * t;
    if (M > Math.PI) M -= TAU;
    var E = Astro.solveKepler(M, orbit.e);
    var x = Math.cos(E), y = orbit.b * Math.sin(E);
    var r1 = Math.hypot(x - orbit.e, y);  // ke Matahari
    var r2 = Math.hypot(x + orbit.e, y);  // ke fokus kosong
    // Vis-viva v² = GM (2/r - 1/a); dengan GM = a = 1 hasilnya dalam satuan sqrt(GM/a).
    return { x: x, y: y, r1: r1, r2: r2, v: Math.sqrt(2 / r1 - 1) };
  }

  // Skala nyata dari data: a dalam km, dan sqrt(GM/a) = 2πa/P menurut hukum III.
  function realScale(body) {
    var aAU = App.semiMajorAU(body);
    if (!aAU || !body.orbital_period_days) return null;
    var aKm = aAU * Astro.AU_KM;
    return { aKm: aKm, vc: TAU * aKm / (body.orbital_period_days * 86400) };
  }

  /* ---------- Lab hukum I dan II ---------- */

  var canvas = $('orbit-canvas');
  var ui = {
    presets: $('presets'), ecc: $('ecc'), eccOut: $('ecc-out'), play: $('play'), speed: $('speed'),
    time: $('time'), timeOut: $('time-out'), law1: $('law1'), law2: $('law2'),
    r: $('ro-r'), rKm: $('ro-r-km'), v: $('ro-v'), vKm: $('ro-v-km'),
    law1Box: $('ro-law1'), sum: $('ro-sum'), sumParts: $('ro-sum-parts'),
    law2Box: $('ro-law2'), area: $('ro-area'), spread: $('ro-spread'),
    apsides: $('apsides')
  };
  var lab = {
    e: 0, body: null, orbit: null, real: null,
    t: 0, speed: 1, playing: !reduceMotion,
    law1: ui.law1.checked, law2: ui.law2.checked
  };
  var GENERIC = { id: 'planet', name: 'Planet', color: COLOR.muted };
  var fontFamily = getComputedStyle(document.body).fontFamily;

  // Eksentrisitas yang sama dengan di ensiklopedia (kolom orbital_eccentricity).
  var presets = PRESET_IDS.map(App.body).filter(function (b) { return b && typeof b.orbital_eccentricity === 'number'; });
  var presetButtons = presets.map(function (b) {
    var li = document.createElement('li');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.dataset.id = b.id;
    btn.setAttribute('aria-pressed', 'false');
    var dot = document.createElement('span');
    dot.className = 'dot';
    dot.setAttribute('aria-hidden', 'true');
    dot.style.setProperty('--c', b.color);
    var ecc = document.createElement('span');
    ecc.className = 'chip__e';
    ecc.textContent = fmtE(b.orbital_eccentricity);
    btn.append(dot, b.name + ' ', ecc);
    btn.addEventListener('click', function () { setOrbit(b.orbital_eccentricity, b); });
    li.appendChild(btn);
    ui.presets.appendChild(li);
    return btn;
  });

  function label(ctx, text, x, y, align, color) {
    ctx.textAlign = align;
    ctx.lineWidth = 4;
    ctx.strokeStyle = COLOR.bg;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color || COLOR.muted;
    ctx.fillText(text, x, y);
  }

  // Label di tengah ruas (x0,y0)-(x1,y1), digeser menjauhi titik (ox, oy).
  // Ruas pendek (planet dekat fokus) tanpa label, agar tidak menimpa label perihelion/aphelion.
  function segmentLabel(ctx, text, x0, y0, x1, y1, ox, oy) {
    var mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    var len = Math.hypot(x1 - x0, y1 - y0);
    if (len < 32) return;
    var nx = -(y1 - y0) / len, ny = (x1 - x0) / len;
    if (nx * (mx - ox) + ny * (my - oy) < 0) { nx = -nx; ny = -ny; }
    label(ctx, text, mx + nx * 11, my + ny * 11, 'center', COLOR.text);
  }

  function draw() {
    var fit = App.fitCanvas(canvas), ctx = fit.ctx, W = fit.w, H = fit.h;
    var orbit = lab.orbit, e = orbit.e, s = orbitState(orbit, lab.t);
    ctx.clearRect(0, 0, W, H);
    ctx.font = '12px ' + fontFamily;
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    // A = a dalam piksel, tetap untuk semua e, jadi sumbu panjang tidak berubah saat e digeser.
    // Label perihelion/aphelion di luar ujung sumbu bila muat, kalau tidak di bawahnya.
    var apsW = Math.max(ctx.measureText('perihelion').width, ctx.measureText('aphelion').width);
    var A = Math.max(24, Math.min(W / 2 - apsW / 2 - 8, H / 2 - 16));
    var outside = W / 2 - A >= apsW + 16;
    var cx = W / 2, cy = H / 2;
    function X(x) { return cx + x * A; }
    function Y(y) { return cy - y * A; }
    var sunX = X(e), emptyX = X(-e), px = X(s.x), py = Y(s.y);
    // Ukuran tidak berskala; diperkecil untuk orbit sangat lonjong agar planet tidak menutupi Matahari.
    var near = A * (1 - e);

    if (lab.law2) {
      var current = Math.min(SECTORS - 1, Math.floor(lab.t * SECTORS));
      orbit.sectors.forEach(function (pts, k) {
        ctx.beginPath();
        ctx.moveTo(sunX, cy);
        for (var i = 1; i < pts.length; i++) ctx.lineTo(X(pts[i][0]), Y(pts[i][1]));
        ctx.closePath();
        ctx.fillStyle = k === current ? COLOR.accent : COLOR.muted;
        ctx.globalAlpha = k === current ? 0.32 : (k % 2 ? 0.06 : 0.18);
        ctx.fill();
      });
      ctx.globalAlpha = 0.6;  // batas juring 3,8:1 terhadap latar kanvas
      ctx.strokeStyle = COLOR.muted;
      ctx.lineWidth = 1;
      ctx.beginPath();
      orbit.sectors.forEach(function (pts) {
        ctx.moveTo(sunX, cy);
        ctx.lineTo(X(pts[1][0]), Y(pts[1][1]));
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.strokeStyle = COLOR.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(X(-1), cy);
    ctx.lineTo(X(1), cy);
    ctx.stroke();

    ctx.strokeStyle = COLOR.muted;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, A, A * orbit.b, 0, 0, TAU);
    ctx.stroke();

    if (lab.law1) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = SUN.color;
      ctx.beginPath();
      ctx.moveTo(sunX, cy);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.strokeStyle = COLOR.text;
      ctx.beginPath();
      ctx.moveTo(emptyX, cy);
      ctx.lineTo(px, py);
      ctx.stroke();
    }

    App.drawBody(ctx, SUN, sunX, cy, clamp(near * 0.55, 3, 8));
    var together = e * A < 2;
    if (!together) {
      ctx.strokeStyle = COLOR.text;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(emptyX, cy, 4, 0, TAU);
      ctx.stroke();
    }

    // Semua label setelah garis, agar garis tidak menimpa teks.
    if (outside) {
      label(ctx, 'perihelion', X(1) + 8, cy, 'left');
      label(ctx, 'aphelion', X(-1) - 8, cy, 'right');
    } else {
      label(ctx, 'perihelion', X(1), cy + 18, 'center');
      label(ctx, 'aphelion', X(-1), cy + 18, 'center');
    }
    var sunText = together ? 'Matahari (kedua fokus berimpit)' : 'Matahari';
    label(ctx, sunText, sunX, cy - 18, 'center');
    if (!together) {
      var room = (ctx.measureText(sunText).width + ctx.measureText('fokus kosong').width) / 2 + 10;
      label(ctx, 'fokus kosong', emptyX, sunX - emptyX >= room ? cy - 18 : cy + 18, 'center');
    }
    if (lab.law1) {
      segmentLabel(ctx, 'r₁', sunX, cy, px, py, emptyX, cy);
      segmentLabel(ctx, 'r₂', emptyX, cy, px, py, sunX, cy);
    }

    App.drawBody(ctx, lab.body || GENERIC, px, py, clamp(near * 0.45, 2.5, 6), {
      light: Math.atan2(cy - py, sunX - px)
    });
    return s;
  }

  function fmtKm(km) { return fmt(km / 1e6, 1, 1) + ' juta km'; }
  function fmtKmS(v) { var d = v < 10 ? 2 : 1; return fmt(v, d, d) + ' km/s'; }

  function updateReadouts(s) {
    var real = lab.real;
    setText(ui.r, fmt(s.r1, 3, 3) + ' a');
    setText(ui.v, fmt(s.v / lab.orbit.vMean, 2, 2) + ' × rata-rata');
    setText(ui.rKm, real ? fmtKm(s.r1 * real.aKm) : '');
    setText(ui.vKm, real ? fmtKmS(s.v * real.vc) : '');
    if (lab.law1) {
      setText(ui.sum, fmt(s.r1 + s.r2, 3, 3) + ' a');
      setText(ui.sumParts, 'r₁ ' + fmt(s.r1, 3, 3) + ' a + r₂ ' + fmt(s.r2, 3, 3) + ' a');
    }
    var time = fmt(lab.t, 2) + ' periode';
    setText(ui.timeOut, time);
    if (ui.time.getAttribute('aria-valuetext') !== time) ui.time.setAttribute('aria-valuetext', time);
  }

  function updateApsides() {
    var o = lab.orbit, e = o.e, real = lab.real;
    var rows = [
      ['Perihelion (terdekat)', 1 - e, Math.sqrt((1 + e) / (1 - e))],
      ['Aphelion (terjauh)', 1 + e, Math.sqrt((1 - e) / (1 + e))]
    ];
    ui.apsides.textContent = '';
    rows.forEach(function (row) {
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.scope = 'row';
      th.textContent = row[0];
      tr.append(th,
        cell(fmt(row[1], 3, 3) + ' a', real && fmtKm(row[1] * real.aKm)),
        cell(fmt(row[2] / o.vMean, 2, 2) + ' × rata-rata', real && fmtKmS(row[2] * real.vc)));
      ui.apsides.appendChild(tr);
    });
  }

  function cell(main, sub) {
    var td = document.createElement('td');
    td.className = 'n';
    td.textContent = main;
    if (sub) {
      var span = document.createElement('span');
      span.className = 'muted small';
      span.textContent = sub;
      td.append(document.createElement('br'), span);
    }
    return td;
  }

  function describe(s) {
    var who = lab.body ? lab.body.name : 'Planet';
    return 'Orbit elips dengan eksentrisitas ' + fmtE(lab.e) + (lab.body ? ' (' + lab.body.name + ')' : '') +
      '. Matahari berada di salah satu fokus, fokus yang lain kosong.' +
      (lab.law1 ? ' Garis dari kedua fokus ke benda yang mengorbit ditampilkan; jumlah panjang keduanya selalu 2a.' : '') +
      (lab.law2 ? ' Orbit dibagi menjadi 12 juring yang masing-masing ditempuh dalam 1/12 periode.' : '') +
      ' ' + who + ' berjarak ' + fmt(s.r1, 2) + ' a dari Matahari dan bergerak ' +
      fmt(s.v / lab.orbit.vMean, 2) + ' kali kecepatan rata-rata.';
  }

  var lastDescribed = 0;
  function render(force) {
    var s = draw();
    updateReadouts(s);
    var now = Date.now();
    if (force || now - lastDescribed > 1000) {
      canvas.setAttribute('aria-label', describe(s));
      lastDescribed = now;
    }
  }

  function setOrbit(e, body) {
    lab.e = e;
    lab.body = body || null;
    lab.orbit = makeOrbit(e);
    lab.real = body ? realScale(body) : null;
    ui.ecc.value = e;
    var eText = fmtE(e);
    ui.eccOut.textContent = eText;
    ui.ecc.setAttribute('aria-valuetext', eText + (body ? ' (' + body.name + ')' : ''));
    presetButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(!!body && btn.dataset.id === body.id));
    });
    setText(ui.area, fmt(lab.orbit.areaShare * 100, 2, 2) + ' % luas elips');
    setText(ui.spread, 'selisih terbesar antarjuring ' + fmt(lab.orbit.spread * 100, 4) + ' %');
    updateApsides();
    render(true);
  }

  var raf = 0, lastTs = 0, onScreen = true;
  function frame(ts) {
    raf = 0;
    if (!lab.playing || !onScreen) return;
    // Langkah dibatasi 0,1 detik agar planet tidak melompat setelah tab kembali aktif.
    if (lastTs) lab.t = (lab.t + Math.min(0.1, (ts - lastTs) / 1000) * lab.speed / LOOP_SECONDS) % 1;
    lastTs = ts;
    ui.time.value = Math.round(lab.t * TIME_STEPS);
    render(false);
    raf = requestAnimationFrame(frame);
  }

  function startLoop() {
    if (!raf && lab.playing && onScreen) {
      lastTs = 0;
      raf = requestAnimationFrame(frame);
    }
  }

  function setPlaying(on) {
    lab.playing = on;
    ui.play.textContent = on ? 'Jeda' : 'Putar';
    if (on) startLoop();
    else render(true);
  }

  ui.ecc.addEventListener('input', function () { setOrbit(Number(ui.ecc.value), null); });
  ui.play.addEventListener('click', function () { setPlaying(!lab.playing); });
  var speedButtons = Array.prototype.slice.call(ui.speed.querySelectorAll('button'));
  speedButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      lab.speed = Number(btn.dataset.speed);
      speedButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
    });
  });
  ui.time.addEventListener('input', function () {
    if (lab.playing) setPlaying(false);
    lab.t = Number(ui.time.value) / TIME_STEPS;
    render(true);
  });
  ui.law1.addEventListener('change', function () {
    lab.law1 = ui.law1.checked;
    ui.law1Box.hidden = !lab.law1;
    render(true);
  });
  ui.law2.addEventListener('change', function () {
    lab.law2 = ui.law2.checked;
    ui.law2Box.hidden = !lab.law2;
    render(true);
  });

  new ResizeObserver(function () { if (!raf) render(false); }).observe(canvas.parentNode);
  new IntersectionObserver(function (entries) {
    onScreen = entries[0].isIntersecting;
    startLoop();
  }).observe(canvas);

  ui.law1Box.hidden = !lab.law1;
  ui.law2Box.hidden = !lab.law2;
  // Mulai dengan Merkurius: cukup lonjong untuk memperlihatkan hukum II, tetapi tetap planet biasa.
  var first = presets.filter(function (b) { return b.id === 'mercury'; })[0] || presets[0];
  setOrbit(first ? first.orbital_eccentricity : 0, first);
  setPlaying(lab.playing);

  /* ---------- Hukum III: data ---------- */

  // P dalam tahun sideris Bumi, a dalam SA, sehingga P² = a³.
  var orbiters = App.bodies(function (b) {
    return b.parent === 'sun' && App.semiMajorAU(b) && b.orbital_period_days;
  }).map(function (b) {
    var a = App.semiMajorAU(b), P = b.orbital_period_days / YEAR_DAYS;
    return { body: b, a: a, P: P, ratio: P * P / (a * a * a) };
  }).sort(function (p, q) { return p.a - q.a; });

  var chartBox = $('chart'), tip = $('chart-tip');
  if (!orbiters.length) {
    App.showError(chartBox, 'Data orbit tidak tersedia, jadi grafik dan tabel tidak bisa dibuat. Muat ulang halaman.');
  }

  function decades(values) {
    return [
      Math.floor(Math.log10(Math.min.apply(null, values))),
      Math.ceil(Math.log10(Math.max.apply(null, values)))
    ];
  }
  var xExp = orbiters.length ? decades(orbiters.map(function (p) { return p.a; })) : [-1, 2];
  var yExp = orbiters.length ? decades(orbiters.map(function (p) { return p.P; })) : [-1, 3];
  // Rentang a tempat garis P = a^1,5 berada di dalam grafik.
  var lineA0 = Math.max(Math.pow(10, xExp[0]), Math.pow(10, yExp[0] / 1.5));
  var lineA1 = Math.min(Math.pow(10, xExp[1]), Math.pow(10, yExp[1] / 1.5));

  /* ---------- Hukum III: grafik log-log (SVG) ---------- */

  var NS = 'http://www.w3.org/2000/svg';
  var LABEL_H = 14;
  var chart = null;   // keadaan gambar terakhir, dipakai titik kalkulator
  var calcPoint = null;

  function svgEl(tag, attrs, parent) {
    var el = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(el);
    return el;
  }

  function svgText(parent, str, x, y, anchor) {
    var el = svgEl('text', { x: x, y: y, 'text-anchor': anchor }, parent);
    el.textContent = str;
    return el;
  }

  function overlaps(a, b, pad) {
    return a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;
  }

  // Jarak dari kotak label ke pusat sebuah titik (0 bila di dalam kotak).
  function boxDist(b, c) {
    return Math.hypot(Math.max(b.x - c.x, 0, c.x - (b.x + b.w)), Math.max(b.y - c.y, 0, c.y - (b.y + b.h)));
  }

  // Jarak titik (px, py) ke ruas s.
  function segDist(s, px, py) {
    var dx = s.x2 - s.x1, dy = s.y2 - s.y1;
    var k = clamp(((px - s.x1) * dx + (py - s.y1) * dy) / (dx * dx + dy * dy || 1), 0, 1);
    return Math.hypot(s.x1 + k * dx - px, s.y1 + k * dy - py);
  }

  // Garis penunjuk dari tepi titik ke ujung label.
  function leaderOf(it, c) {
    var tx = c.x + (c.anchor === 'start' ? -3 : 3), dx = tx - it.x, dy = c.y - it.y;
    var len = Math.hypot(dx, dy) || 1;
    return { x1: it.x + dx / len * (it.r + 2), y1: it.y + dy / len * (it.r + 2), x2: tx, y2: c.y };
  }

  function hitsSegment(s, b) {
    var x0 = Math.max(b.x, s.x1), x1 = Math.min(b.x + b.w, s.x2);
    if (x0 > x1) return false;
    var k = (s.y2 - s.y1) / (s.x2 - s.x1);
    var ya = s.y1 + k * (x0 - s.x1), yb = s.y1 + k * (x1 - s.x1);
    return Math.max(ya, yb) >= b.y && Math.min(ya, yb) <= b.y + b.h;
  }

  // Calon posisi label: kanan, kiri, serong, bawah, atas, lalu bergeser dengan garis penunjuk.
  function spots(it) {
    var g = it.r + 5, list = [];
    function add(x, y, anchor, leader) {
      var left = anchor === 'start' ? x : anchor === 'end' ? x - it.w : x - it.w / 2;
      list.push({ x: x, y: y, anchor: anchor, leader: leader, box: { x: left, y: y - LABEL_H / 2, w: it.w, h: LABEL_H } });
    }
    add(it.x + g, it.y, 'start');
    add(it.x - g, it.y, 'end');
    add(it.x + g - 2, it.y + 13, 'start');
    add(it.x - g + 2, it.y - 13, 'end');
    add(it.x, it.y + g + 8, 'middle');
    add(it.x, it.y - g - 8, 'middle');
    for (var k = 1; k <= 4; k++) {
      for (var dx = 22; dx <= 40; dx += 18) {
        add(it.x + dx, it.y + 16 * k, 'start', true);
        add(it.x - dx, it.y - 16 * k, 'end', true);
        add(it.x + dx, it.y - 16 * k, 'start', true);
        add(it.x - dx, it.y + 16 * k, 'end', true);
      }
      // Tepat di bawah titik: sisi kanan-bawah garis selalu kosong.
      if (k > 1) add(it.x + 4, it.y + 16 * k, 'end', true);
    }
    return list;
  }

  // Posisi pertama yang tidak menabrak label lain, titik, atau tepi; sebisanya juga tidak menabrak garis.
  // Label tanpa garis penunjuk harus lebih dekat ke titiknya sendiri daripada ke titik lain.
  function placeLabel(it, gLbl, gLead) {
    var el = svgEl('text', { class: 'lbl', 'dominant-baseline': 'central' }, gLbl);
    el.textContent = it.name;
    it.w = el.getComputedTextLength();
    var list = spots(it), b = chart.bounds;
    for (var pass = 0; pass < 2; pass++) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i], box = c.box;
        if (box.x < b.x || box.y < b.y || box.x + box.w > b.x + b.w || box.y + box.h > b.y + b.h) continue;
        if (chart.placed.some(function (q) { return overlaps(q, box, 2); })) continue;
        if (chart.circles.some(function (q) { return boxDist(box, q) < q.r + 2; })) continue;
        if (pass === 0 && hitsSegment(chart.line, box)) continue;
        var lead = c.leader ? leaderOf(it, c) : null;
        if (lead) {
          // Garis penunjuk tidak boleh berimpit dengan garis hukum III atau melewati titik lain,
          // dan labelnya harus jelas terpisah dari titik lain.
          if (segDist(chart.line, lead.x2, lead.y2) < 6) continue;
          if (chart.circles.some(function (q) {
            return q !== it && (segDist(lead, q.x, q.y) < q.r + 3 || boxDist(box, q) < q.r + 6);
          })) continue;
        } else {
          var own = boxDist(box, it);
          if (chart.circles.some(function (q) { return q !== it && boxDist(box, q) < own + 4; })) continue;
        }
        el.setAttribute('x', c.x);
        el.setAttribute('y', c.y);
        el.setAttribute('text-anchor', c.anchor);
        chart.placed.push(box);
        if (lead) svgEl('line', { class: 'leader', x1: lead.x1, y1: lead.y1, x2: lead.x2, y2: lead.y2 }, gLead);
        return;
      }
    }
    el.remove();  // tidak ada tempat: nama tetap ada di tooltip dan tabel
  }

  function renderChart(force) {
    var W = Math.floor(chartBox.clientWidth);
    if (!orbiters.length || !W || (chart && chart.w === W && !force)) return;
    var H = Math.round(clamp(W * 0.62, 380, 460));
    var m = { l: 46, r: 14, t: 28, b: 46 };
    var pw = W - m.l - m.r, ph = H - m.t - m.b;
    function sx(a) { return m.l + (Math.log10(a) - xExp[0]) / (xExp[1] - xExp[0]) * pw; }
    function sy(P) { return m.t + ph - (Math.log10(P) - yExp[0]) / (yExp[1] - yExp[0]) * ph; }

    var old = chartBox.querySelector('svg');
    if (old) old.remove();
    hideTip();
    var svg = svgEl('svg', {
      width: W, height: H, viewBox: '0 0 ' + W + ' ' + H,
      role: 'group', 'aria-labelledby': 'chart-title', 'aria-describedby': 'chart-hint'
    });
    chartBox.insertBefore(svg, tip);

    var gAxes = svgEl('g', { 'aria-hidden': 'true' }, svg);
    var ex, k;
    for (ex = xExp[0]; ex <= xExp[1]; ex++) {
      var x = sx(Math.pow(10, ex));
      svgEl('line', { class: 'grid', x1: x, y1: m.t, x2: x, y2: m.t + ph }, gAxes);
      svgText(gAxes, fmt(Math.pow(10, ex), 1), x, m.t + ph + 18, 'middle');
      for (k = 2; ex < xExp[1] && k < 10; k++) {
        var xm = sx(k * Math.pow(10, ex));
        svgEl('line', { class: 'axis', x1: xm, y1: m.t + ph, x2: xm, y2: m.t + ph + 4 }, gAxes);
      }
    }
    for (ex = yExp[0]; ex <= yExp[1]; ex++) {
      var y = sy(Math.pow(10, ex));
      svgEl('line', { class: 'grid', x1: m.l, y1: y, x2: m.l + pw, y2: y }, gAxes);
      svgText(gAxes, fmt(Math.pow(10, ex), 1), m.l - 8, y + 4, 'end');
      for (k = 2; ex < yExp[1] && k < 10; k++) {
        var ym = sy(k * Math.pow(10, ex));
        svgEl('line', { class: 'axis', x1: m.l - 4, y1: ym, x2: m.l, y2: ym }, gAxes);
      }
    }
    svgEl('line', { class: 'axis', x1: m.l, y1: m.t + ph, x2: m.l + pw, y2: m.t + ph }, gAxes);
    svgEl('line', { class: 'axis', x1: m.l, y1: m.t, x2: m.l, y2: m.t + ph }, gAxes);
    svgText(gAxes, 'Sumbu semi-mayor a (SA)', m.l + pw / 2, H - 6, 'middle');
    svgText(gAxes, 'Periode P (tahun)', 0, 12, 'start');

    var line = {
      x1: sx(lineA0), y1: sy(Math.pow(lineA0, 1.5)),
      x2: sx(lineA1), y2: sy(Math.pow(lineA1, 1.5))
    };
    svgEl('line', { class: 'law-line', x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2, 'aria-hidden': 'true' }, svg);

    var gLead = svgEl('g', { 'aria-hidden': 'true' }, svg);
    var gPts = svgEl('g', {}, svg);
    var gCalc = svgEl('g', { 'aria-hidden': 'true' }, svg);
    var gLbl = svgEl('g', { 'aria-hidden': 'true' }, svg);

    chart = {
      w: W, sx: sx, sy: sy, line: line, gCalc: gCalc, svg: svg,
      bounds: { x: m.l + 2, y: m.t + 2, w: pw - 4, h: ph - 4 },
      placed: [], circles: [], items: []
    };

    orbiters.forEach(function (p, i) {
      var x = sx(p.a), y = sy(p.P);
      var g = svgEl('g', {
        class: 'pt', tabindex: '0', role: 'button', 'data-i': i,
        'aria-label': p.body.name + ': a ' + fmtSig(p.a) + ' SA, P ' + fmtSig(p.P) + ' tahun'
      }, gPts);
      svgEl('circle', { class: 'pt__ring', cx: x, cy: y, r: 8.5 }, g);
      svgEl('circle', { class: 'pt__dot', cx: x, cy: y, r: 5, fill: p.body.color }, g);
      chart.items.push({ x: x, y: y, g: g, name: p.body.name });
    });

    // Titik yang bertumpuk (Komet Halley dan Uranus; Pluto, Haumea, Makemake) berbagi satu label,
    // karena label terpisah tidak jelas milik titik yang mana.
    chart.items.forEach(function (it, i) {
      var prev = chart.items[i - 1];
      if (prev && Math.hypot(it.x - prev.x, it.y - prev.y) < 12) chart.circles[chart.circles.length - 1].members.push(it);
      else chart.circles.push({ members: [it] });
    });
    chart.circles.forEach(function (c) {
      var n = c.members.length;
      c.x = c.members.reduce(function (s, it) { return s + it.x; }, 0) / n;
      c.y = c.members.reduce(function (s, it) { return s + it.y; }, 0) / n;
      c.r = 5 + Math.max.apply(null, c.members.map(function (it) { return Math.hypot(it.x - c.x, it.y - c.y); }));
      c.name = c.members.map(function (it) { return it.name; }).join(', ');
    });
    chart.circles.forEach(function (c) { placeLabel(c, gLbl, gLead); });
    chart.basePlaced = chart.placed.slice();
    drawCalcPoint();
  }

  // Titik hasil kalkulator digambar terpisah agar titik data (dan fokus keyboard) tidak dibuat ulang.
  function drawCalcPoint() {
    if (!chart) return;
    var g = chart.gCalc;
    g.textContent = '';
    chart.placed = chart.basePlaced.slice();
    if (!calcPoint || calcPoint.a < lineA0 || calcPoint.a > lineA1) return;
    var item = { x: chart.sx(calcPoint.a), y: chart.sy(calcPoint.P), r: 6 };
    item.name = fmtSig(calcPoint.a) + ' SA, ' + fmtSig(calcPoint.P) + ' tahun';
    svgEl('circle', { class: 'calc-pt', cx: item.x, cy: item.y, r: item.r }, g);
    var circles = chart.circles;
    chart.circles = circles.concat([item]);
    placeLabel(item, g, g);
    chart.circles = circles;
  }

  function showTip(i) {
    var p = orbiters[i], it = chart && chart.items[i];
    if (!p || !it) return;
    tip.textContent = '';
    [['span', p.body.name], ['strong', 'a = ' + fmtSig(p.a) + ' SA'], ['strong', 'P = ' + fmtSig(p.P) + ' tahun'],
      ['span', 'P²/a³ = ' + fmt(p.ratio, 3, 3)]].forEach(function (row) {
      var el = document.createElement(row[0]);
      el.textContent = row[1];
      tip.appendChild(el);
    });
    tip.hidden = false;
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var left = it.x + 14 + tw > chart.w ? it.x - 14 - tw : it.x + 14;
    var top = it.y - th - 10 < 0 ? it.y + 14 : it.y - th - 10;
    tip.style.transform = 'translate(' + Math.round(Math.max(0, left)) + 'px, ' + Math.round(top) + 'px)';
  }

  function hideTip() { tip.hidden = true; }

  function pointOf(target) {
    var g = target && target.closest ? target.closest('.pt') : null;
    return g && chartBox.contains(g) ? g : null;
  }

  // Titik terdekat dari penunjuk dalam radius 22 px: area sentuh 44 px tanpa merebut titik tetangga.
  function nearestPoint(ev) {
    if (!chart) return -1;
    var box = chart.svg.getBoundingClientRect(), best = -1, bestD = 22;
    chart.items.forEach(function (it, i) {
      var d = Math.hypot(it.x - (ev.clientX - box.left), it.y - (ev.clientY - box.top));
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  function hover(i) {
    if (!chart) return;
    chart.items.forEach(function (it, k) { it.g.classList.toggle('is-hover', k === i); });
    chart.svg.style.cursor = i < 0 ? '' : 'pointer';
    var focused = pointOf(document.activeElement);
    if (i >= 0) showTip(i);
    else if (focused) showTip(Number(focused.dataset.i));
    else hideTip();
  }

  // Satu set pendengar untuk semua titik (delegasi), karena SVG dibuat ulang saat ukuran berubah.
  chartBox.addEventListener('pointermove', function (ev) { hover(nearestPoint(ev)); });
  chartBox.addEventListener('pointerleave', function () { hover(-1); });
  chartBox.addEventListener('focusin', function (ev) {
    var g = pointOf(ev.target);
    if (g) showTip(Number(g.dataset.i));
  });
  chartBox.addEventListener('focusout', hideTip);
  chartBox.addEventListener('click', function (ev) {
    var i = nearestPoint(ev);
    if (i < 0) return;
    useInCalc(orbiters[i]);
    showTip(i);
  });
  chartBox.addEventListener('keydown', function (ev) {
    var g = pointOf(ev.target);
    if (!g) return;
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      useInCalc(orbiters[Number(g.dataset.i)]);
    } else if (ev.key === 'Escape') {
      hideTip();
    }
  });

  new ResizeObserver(function () { renderChart(false); }).observe(chartBox);

  /* ---------- Hukum III: kalkulator a <-> P ---------- */

  var calc = { a: $('calc-a'), p: $('calc-p'), aErr: $('calc-a-err'), pErr: $('calc-p-err'), result: $('calc-result') };
  // Batas bawah: orbit harus di luar Matahari. Batas atas: tepi luar Awan Oort.
  var A_MIN = SUN.diameter_km / 2 / Astro.AU_KM;
  var A_MAX = App.data.constants.OORT_CLOUD_AU[1];
  var P_MIN = Math.pow(A_MIN, 1.5), P_MAX = Math.pow(A_MAX, 1.5);

  // Angka dengan koma (atau titik) desimal, tanpa pemisah ribuan.
  function parseNumber(str) {
    var s = String(str).replace(/\s+/g, '');
    if (!s) return { empty: true };
    if (s.charAt(0) === '-') return { error: 'Nilai harus lebih besar dari 0.' };
    if (!/^(\d+[.,]?\d*|[.,]\d+)$/.test(s)) {
      return { error: 'Tulis angka saja, tanpa pemisah ribuan dan dengan koma untuk desimal, misalnya 5,2.' };
    }
    return { value: Number(s.replace(',', '.')) };
  }

  function rangeError(v, isA) {
    if (v <= 0) return 'Nilai harus lebih besar dari 0.';
    if (isA && v <= A_MIN) {
      return 'Orbit sekecil itu berada di dalam Matahari. Isi nilai lebih dari ' + fmtSig(A_MIN) + ' SA (jari-jari Matahari).';
    }
    if (!isA && v <= P_MIN) {
      return 'Periode sependek itu berarti orbitnya di dalam Matahari. Isi nilai lebih dari ' + fmtSig(P_MIN) +
        ' tahun (' + App.fmtDuration(P_MIN * YEAR_DAYS * 86400) + ').';
    }
    if (isA && v > A_MAX) return 'Isi nilai sampai ' + fmt(A_MAX) + ' SA, tepi luar Awan Oort.';
    if (!isA && v > P_MAX) {
      return 'Isi nilai sampai sekitar ' + fmt(P_MAX / 1e6, 1) + ' juta tahun, periode orbit di tepi luar Awan Oort.';
    }
    return '';
  }

  function setError(input, errEl, msg) {
    setText(errEl, msg);
    if (msg) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  // Nilai hasil hitung untuk kotak isian: empat angka penting, koma desimal, tanpa pemisah ribuan.
  function toInputText(x) {
    return String(Number(x.toPrecision(4))).replace('.', ',');
  }

  function showResult(lines) {
    calc.result.textContent = '';
    lines.forEach(function (s) {
      var p = document.createElement('p');
      p.textContent = s;
      calc.result.appendChild(p);
    });
  }

  // "a = 5,2 SA" dengan spasi tak terputus agar tidak terpotong di akhir baris.
  var NB = '\u00a0';
  function eq(sym, value, unit) { return sym + NB + '=' + NB + value + NB + unit; }

  function nearest(a) {
    return orbiters.reduce(function (best, p) {
      return !best || Math.abs(Math.log(p.a / a)) < Math.abs(Math.log(best.a / a)) ? p : best;
    }, null);
  }

  function calcFrom(src) {
    var isA = src === 'a';
    var input = isA ? calc.a : calc.p, other = isA ? calc.p : calc.a;
    var errEl = isA ? calc.aErr : calc.pErr;
    setError(other, isA ? calc.pErr : calc.aErr, '');
    var res = parseNumber(input.value);
    var msg = res.empty ? '' : res.error || rangeError(res.value, isA);
    setError(input, errEl, msg);
    if (res.empty || msg) {
      other.value = '';
      calcPoint = null;
      drawCalcPoint();
      showResult(res.empty ? ['Isi salah satu kotak untuk melihat hasilnya.'] : []);
      return;
    }
    var a = isA ? res.value : Math.pow(res.value, 2 / 3);
    var P = isA ? Math.pow(a, 1.5) : res.value;
    other.value = toInputText(isA ? P : a);
    calcPoint = { a: a, P: P };
    drawCalcPoint();

    var lines = [isA
      ? 'Benda dengan ' + eq('a', fmtSig(a), 'SA') + ' mengelilingi Matahari sekali dalam ' + fmtSig(P) + NB + 'tahun' +
        (P < 2 ? ' (' + App.fmtDuration(P * YEAR_DAYS * 86400) + ').' : '.')
      : 'Benda yang mengelilingi Matahari sekali dalam ' + fmtSig(P) + NB + 'tahun memiliki sumbu semi-mayor ' +
        eq('a', fmtSig(a), 'SA') + '.'];
    var n = nearest(a);
    if (n) lines.push('Nilai a terdekat di data: ' + n.body.name + ' (' + eq('a', fmtSig(n.a), 'SA') + ', ' + eq('P', fmtSig(n.P), 'tahun') + ').');
    if (a < lineA0 || a > lineA1) lines.push('Titik hasil hitungan ini berada di luar rentang grafik.');
    showResult(lines);
  }

  function useInCalc(p) {
    calc.a.value = toInputText(p.a);
    calcFrom('a');
  }

  calc.a.addEventListener('input', function () { calcFrom('a'); });
  calc.p.addEventListener('input', function () { calcFrom('p'); });

  /* ---------- Hukum III: tabel P²/a³ ---------- */

  // Empat angka penting dengan jumlah desimal tetap: 0,05805; 1,000; 140,6; 313.518.
  function fmt4(x) {
    var d = clamp(3 - Math.floor(Math.log10(x)), 0, 8);
    return fmt(x, d, d);
  }

  var tbody = $('ratio-rows');
  orbiters.forEach(function (p) {
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.scope = 'row';
    var name = document.createElement('span');
    name.className = 'body-name';
    var dot = document.createElement('span');
    dot.className = 'dot';
    dot.setAttribute('aria-hidden', 'true');
    dot.style.setProperty('--c', p.body.color);
    name.append(dot, p.body.name);
    th.appendChild(name);
    tr.appendChild(th);
    [fmt(p.ratio, 3, 3), fmt4(p.a), fmt4(p.P), fmt4(p.P * p.P), fmt4(p.a * p.a * p.a)].forEach(function (s) {
      var td = document.createElement('td');
      td.className = 'n';
      td.textContent = s;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  if (orbiters.length) {
    var worst = orbiters.reduce(function (w, p) { return Math.abs(1 - p.ratio) > Math.abs(1 - w.ratio) ? p : w; });
    $('ratio-note').textContent = 'P adalah periode orbit dari data dibagi ' + fmt(YEAR_DAYS, 3) +
      ' hari, satu tahun sideris Bumi. Semua hasil bagi mendekati 1; selisih terbesar ada pada ' + worst.body.name +
      ', sekitar ' + fmt(Math.abs(1 - worst.ratio) * 100, 1) + ' %. Selisih sekecil ini muncul karena a dan P ' +
      'sebagian berasal dari sumber yang berbeda (elemen orbit JPL dan lembar data NASA), dan karena rumus ' +
      'P² = a³ mengabaikan massa benda itu sendiri.';
  }

  renderChart(true);
  calcFrom('a');
})();
