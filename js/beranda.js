/*
 * beranda.js: Beranda (index.html).
 * Peta tampak atas posisi delapan planet hari ini, daftar tautannya, penggaris SA,
 * pintasan ke Jelajah 3D, dan isi bagian "Tentang data".
 */
(function () {
  'use strict';

  if (!window.App || !App.data || !window.Astro) {
    // Tanpa data tidak ada peta, daftar jarak, dan penggaris: sembunyikan wadahnya yang kosong.
    document.getElementById('snapshot').hidden = true;
    document.querySelector('.today').hidden = true;
    document.getElementById('ruler').closest('.section').hidden = true;
    // Pesan galat data sudah ditampilkan common.js; bila common.js sendiri gagal, tampilkan di sini.
    if (!window.App) {
      var holder = document.createElement('div');
      holder.className = 'wrap';
      holder.innerHTML = '<p class="notice notice--error" role="alert"><strong>Ada masalah.</strong> ' +
        'Skrip situs tidak termuat lengkap. Muat ulang halaman; bila masih gagal, pastikan folder js berisi common.js, astro.js, dan data.js.</p>';
      document.querySelector('main').prepend(holder);
    }
    return;
  }

  var canvas = document.getElementById('snapshot-canvas');
  var list = document.getElementById('today-list');
  var HIT = 22; // jari-jari sentuh minimum (piksel CSS)

  // Hari ini, dibatasi ke rentang tabel elemen orbit JPL (1800-2050).
  var now = new Date();
  var date = new Date(Math.min(Math.max(now.getTime(), Astro.MIN_DATE.getTime()), Astro.MAX_DATE.getTime()));
  var jd = Astro.jdFromDate(date);

  var sun = App.body('sun');
  var planets = App.planets().filter(function (b) { return b.orbit; }).map(function (b) {
    var pos = Astro.helioPosition(b.orbit, jd);
    return {
      body: b,
      pos: pos,
      r: Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z),
      path: Astro.orbitPath(b.orbit, jd, 180)
    };
  });
  var byId = {};
  planets.forEach(function (p) { byId[p.body.id] = p; });

  // Jarak terjauh setelah dipadatkan (aphelion Neptunus) menentukan skala peta.
  var reach = 0;
  planets.forEach(function (p) {
    p.path.forEach(function (q) { reach = Math.max(reach, Math.sqrt(Math.hypot(q.x, q.y))); });
  });

  // Dilihat dari kutub utara ekliptika, cincin Saturnus tampak sebagai elips dengan rasio sumbu
  // sin 61,9° (lintang ekliptika kutub Saturnus). Kutubnya di bujur 79,5°, hampir ke arah atas peta,
  // jadi sumbu panjang elips hampir mendatar, sama seperti cincin datar di App.drawBody.
  var RING_TILT = Math.sin(61.9 * Astro.DEG);

  var css = getComputedStyle(document.documentElement);
  function token(name, fallback) { return css.getPropertyValue(name).trim() || fallback; }
  var color = {
    accent: token('--accent', '#ffb547'),
    text: token('--text', '#e8ecf4'),
    muted: token('--text-muted', '#a3afc4'),
    bg: token('--bg-sunken', '#070a12')
  };
  var fontFamily = getComputedStyle(document.body).fontFamily;

  var view = null, cx = 0, cy = 0, unit = 1, rSun = 6, fontPx = 12, active = null;

  /* ---------- Isi teks dan daftar ---------- */

  document.getElementById('snapshot-date').textContent = App.fmtDate(date);

  if (date.getTime() !== now.getTime()) {
    var outside = document.createElement('p');
    outside.className = 'notice small';
    outside.setAttribute('role', 'status');
    outside.textContent = 'Tanggal di perangkatmu (' + App.fmtDate(now) + ') di luar rentang tabel orbit JPL, ' +
      App.fmtDate(Astro.MIN_DATE) + ' sampai ' + App.fmtDate(Astro.MAX_DATE) + ', jadi peta memakai ' +
      App.fmtDate(date) + '. Periksa pengaturan tanggal perangkat, lalu muat ulang halaman.';
    document.getElementById('snapshot').prepend(outside);
  }

  function distance(p) {
    return App.fmt(p.r, 2, 2) + ' SA';
  }

  canvas.setAttribute('aria-label', 'Peta posisi planet pada ' + App.fmtDate(date) +
    ', dilihat dari atas kutub utara ekliptika. Jarak dari Matahari: ' +
    planets.map(function (p) { return p.body.name + ' ' + distance(p); }).join(', ') + '.');

  list.innerHTML = planets.map(function (p) {
    var id = App.esc(p.body.id);
    return '<li><a href="ensiklopedia.html#' + id + '" data-id="' + id + '">' +
      '<span class="dot" style="--c: ' + App.esc(p.body.color) + '" aria-hidden="true"></span>' +
      '<span class="today__name">' + App.esc(p.body.name) + '</span> ' +
      '<span class="today__val num">' + distance(p) + '<span class="visually-hidden"> dari Matahari</span></span>' +
      '</a></li>';
  }).join('');
  var links = Array.prototype.slice.call(list.querySelectorAll('a'));

  var auNote = document.getElementById('au-note');
  var nbsp = String.fromCharCode(160); // spasi tak terputus: angka dan satuannya tetap sebaris
  auNote.textContent = 'SA adalah satuan astronomi: 1' + nbsp + 'SA = ' +
    App.fmt((App.data.constants.AU_KM || Astro.AU_KM) / 1e6, 1) + nbsp + 'juta' + nbsp +
    'km, kira-kira jarak rata-rata Bumi ke Matahari.';
  auNote.hidden = false;

  /* ---------- Peta ---------- */

  // Tampak atas: x ekliptika ke kanan, y ke atas. Jarak r dari Matahari dipadatkan menjadi akar r
  // supaya Merkurius dan Neptunus muat dalam satu gambar.
  function toScreen(v) {
    var r = Math.hypot(v.x, v.y);
    var k = r > 0 ? Math.sqrt(r) * unit / r : 0;
    return { x: cx + v.x * k, y: cy - v.y * k };
  }

  // Jari-jari yang harus dihindari label; untuk Saturnus termasuk cincinnya (2,27 kali bola di drawBody).
  function extent(p) {
    return p.body.id === 'saturn' ? p.rPx * 2.3 : p.rPx;
  }

  function labelFont() {
    return '600 ' + fontPx + 'px ' + fontFamily;
  }

  function layout() {
    view = App.fitCanvas(canvas);
    var size = Math.min(view.w, view.h);
    cx = view.w / 2;
    cy = view.h / 2;
    fontPx = size < 420 ? 12 : 13;
    rSun = Math.max(5, size * 0.016);
    unit = (size / 2 - Math.max(12, size * 0.04)) / reach;
    planets.forEach(function (p) {
      var s = toScreen(p.pos);
      p.x = s.x;
      p.y = s.y;
      // Ukuran tidak berskala: diameter dipangkatkan 0,35 agar Merkurius tetap terlihat
      // dan Jupiter tidak menutupi orbit di dekatnya.
      p.rPx = Math.max(2.2, size * 0.0075 * Math.pow((p.body.diameter_km || 12756) / 12756, 0.35));
      p.screenPath = p.path.map(toScreen);
    });
    placeLabels();
  }

  /* Penempatan nama: coba delapan arah di sekitar planet (mulai dari arah menjauhi Matahari)
     pada tiga jarak, pilih yang tidak menabrak nama lain, planet lain, Matahari, atau tepi kanvas.
     Nama yang terpaksa diletakkan agak jauh diberi garis penunjuk. */
  var ANGLES = [0, 1, -1, 2, -2, 3, -3, 4].map(function (k) { return k * Math.PI / 4; });
  var GAPS = [3, 12, 24];

  function overlapCost(box, boxes, circles) {
    var cost = 0;
    boxes.forEach(function (o) {
      var ox = Math.min(box.x + box.w, o.x + o.w) - Math.max(box.x, o.x);
      var oy = Math.min(box.y + box.h, o.y + o.h) - Math.max(box.y, o.y);
      if (ox > 0 && oy > 0) cost += 50 + ox * oy;
    });
    circles.forEach(function (c) {
      var nx = Math.max(box.x, Math.min(c.x, box.x + box.w));
      var ny = Math.max(box.y, Math.min(c.y, box.y + box.h));
      var d = Math.hypot(c.x - nx, c.y - ny);
      if (d < c.r) cost += 50 + (c.r - d) * 20;
    });
    var pad = 2;
    var spill = Math.max(0, pad - box.x) + Math.max(0, box.x + box.w - (view.w - pad)) +
      Math.max(0, pad - box.y) + Math.max(0, box.y + box.h - (view.h - pad));
    return cost + spill * 40;
  }

  function placeLabels() {
    var ctx = view.ctx;
    ctx.font = labelFont();
    var h = fontPx + 4;
    var circles = planets.map(function (p) { return { x: p.x, y: p.y, r: extent(p) + 2 }; });
    circles.push({ x: cx, y: cy, r: rSun * 1.5 });
    var boxes = [];
    planets.forEach(function (p) {
      var w = Math.ceil(ctx.measureText(p.body.name).width) + 6;
      var out = Math.atan2(cy - p.y, p.x - cx);
      var best = null;
      GAPS.forEach(function (gap, gi) {
        ANGLES.forEach(function (da, ai) {
          var a = out + da, c = Math.cos(a), s = Math.sin(a);
          var d = extent(p) + gap;
          var ax = p.x + c * d, ay = p.y - s * d;
          var box = {
            x: c > 0.38 ? ax : c < -0.38 ? ax - w : ax - w / 2,
            y: s > 0.38 ? ay - h : s < -0.38 ? ay : ay - h / 2,
            w: w,
            h: h,
            ax: ax,
            ay: ay,
            leader: gi > 0
          };
          box.cost = overlapCost(box, boxes, circles) + gi * 2 + ai * 0.5;
          if (!best || box.cost < best.cost) best = box;
        });
      });
      p.label = best;
      boxes.push(best);
    });
  }

  function strokePath(ctx, pts, style, width) {
    ctx.beginPath();
    pts.forEach(function (q, i) {
      if (i) ctx.lineTo(q.x, q.y);
      else ctx.moveTo(q.x, q.y);
    });
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function draw() {
    var ctx = view.ctx;
    ctx.clearRect(0, 0, view.w, view.h);
    ctx.lineJoin = 'round';

    planets.forEach(function (p) {
      if (p !== active) strokePath(ctx, p.screenPath, 'rgba(163, 175, 196, 0.28)', 1);
    });
    if (active) strokePath(ctx, active.screenPath, color.accent, 1.5);

    if (sun) App.drawBody(ctx, sun, cx, cy, rSun);
    planets.forEach(function (p) {
      App.drawBody(ctx, p.body, p.x, p.y, p.rPx, {
        light: Math.atan2(cy - p.y, cx - p.x), // sisi terang menghadap Matahari
        ringTilt: RING_TILT
      });
    });

    if (active) {
      ctx.beginPath();
      ctx.arc(active.x, active.y, extent(active) + 4, 0, Math.PI * 2);
      ctx.strokeStyle = color.accent;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.font = labelFont();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    planets.forEach(function (p) {
      var L = p.label, on = p === active;
      if (L.leader) {
        var a = Math.atan2(L.ay - p.y, L.ax - p.x), r0 = extent(p) + 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x + Math.cos(a) * r0, p.y + Math.sin(a) * r0);
        ctx.lineTo(L.ax, L.ay);
        ctx.strokeStyle = on ? color.accent : 'rgba(163, 175, 196, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Tepi gelap di sekeliling huruf agar nama tetap terbaca saat memotong garis orbit.
      ctx.lineWidth = 3;
      ctx.strokeStyle = color.bg;
      ctx.strokeText(p.body.name, L.x + 3, L.y + L.h / 2);
      ctx.fillStyle = on ? color.text : color.muted;
      ctx.fillText(p.body.name, L.x + 3, L.y + L.h / 2);
    });
  }

  /* ---------- Sorotan dan klik ---------- */

  function setActive(p) {
    if (p === active) return;
    active = p;
    links.forEach(function (a) {
      a.classList.toggle('is-active', !!p && a.getAttribute('data-id') === p.body.id);
    });
    draw();
  }

  // Urutan: tepat di bola planet, lalu di nama, lalu planet terdekat dalam jari-jari sentuh.
  function pick(x, y) {
    var best = null, bestD = Infinity, i;
    planets.forEach(function (p) {
      var d = Math.hypot(x - p.x, y - p.y);
      if (d <= extent(p) + 4 && d < bestD) { best = p; bestD = d; }
    });
    if (best) return best;
    for (i = 0; i < planets.length; i++) {
      var L = planets[i].label;
      if (x >= L.x && x <= L.x + L.w && y >= L.y && y <= L.y + L.h) return planets[i];
    }
    planets.forEach(function (p) {
      var d = Math.hypot(x - p.x, y - p.y);
      if (d <= Math.max(HIT, extent(p) + 8) && d < bestD) { best = p; bestD = d; }
    });
    return best;
  }

  function pickEvent(e) {
    var rect = canvas.getBoundingClientRect();
    return pick(e.clientX - rect.left, e.clientY - rect.top);
  }

  canvas.addEventListener('pointermove', function (e) {
    var p = pickEvent(e);
    canvas.style.cursor = p ? 'pointer' : '';
    setActive(p);
  });

  canvas.addEventListener('pointerleave', function () {
    setActive(null);
  });

  canvas.addEventListener('click', function (e) {
    var p = pickEvent(e);
    if (!p) return;
    var href = 'ensiklopedia.html#' + p.body.id;
    if (e.ctrlKey || e.metaKey) window.open(href, '_blank');
    else window.location.href = href;
  });

  function fromList(e) {
    var a = e.target.closest ? e.target.closest('a[data-id]') : null;
    return a ? byId[a.getAttribute('data-id')] : null;
  }

  list.addEventListener('mouseover', function (e) { setActive(fromList(e) || active); });
  list.addEventListener('mouseleave', function () { setActive(null); });
  list.addEventListener('focusin', function (e) { setActive(fromList(e)); });
  list.addEventListener('focusout', function () { setActive(null); });

  var queued = false;
  function render() {
    queued = false;
    layout();
    draw();
  }

  render();
  new ResizeObserver(function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(render);
  }).observe(canvas);

  /* ---------- Penggaris SA, pintasan Jelajah 3D, Tentang data ---------- */

  App.ruler(document.getElementById('ruler'), { link: true });

  var jump = ['earth', 'mars', 'jupiter', 'saturn', 'halley'].map(App.body).filter(Boolean);
  if (jump.length) {
    document.getElementById('jump-list').innerHTML = jump.map(function (b) {
      return '<li><a class="chip" href="jelajah.html#' + App.esc(b.id) + '">' +
        '<span class="dot" style="--c: ' + App.esc(b.color) + '" aria-hidden="true"></span>' +
        App.esc(b.name) + '<span class="visually-hidden"> di Jelajah 3D</span></a></li>';
    }).join('');
    document.getElementById('feature-jump').hidden = false;
  }

  var asOfValue = App.data.constants.MOONS_AS_OF || (App.body('earth') || {}).moons_as_of;
  var asOf = App.fromInputDate(asOfValue);
  if (asOf) {
    var moonsNote = document.getElementById('moons-note');
    moonsNote.textContent = 'Jumlah bulan tiap benda diperiksa per ' + App.fmtDate(asOf) +
      '. Angka itu bisa bertambah karena astronom masih terus menemukan satelit baru.';
    moonsNote.hidden = false;
  }

  var sources = App.data.sources || [];
  if (sources.length) {
    document.getElementById('sources').innerHTML = sources.map(function (s) {
      var name = App.esc(s.name);
      return '<li>' + (s.url ? '<a href="' + App.esc(s.url) + '">' + name + '</a>' : '<span>' + name + '</span>') + '</li>';
    }).join('');
    document.getElementById('sources-box').hidden = false;
  }
})();
