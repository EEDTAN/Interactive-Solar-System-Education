/*
 * jelajah.js: halaman Jelajah 3D. Mengatur waktu, kontrol tampilan, pilihan benda, kartu data,
 * dan tabel "Dilihat dari Bumi". Gambar 3D dikerjakan oleh js/orrery.js.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('orrery');
  // Bila data atau astro.js tidak termuat, common.js sudah menampilkan pesan galat.
  if (!canvas || !window.App || !App.data || !window.Astro || !window.Orrery) return;
  if (!canvas.getContext || !canvas.getContext('2d')) {
    App.showError(document.querySelector('.jelajah__view'), 'Peramban ini tidak bisa menggambar kanvas. Buka halaman ini di peramban versi terbaru.');
    return;
  }

  function $(id) { return document.getElementById(id); }
  var fmt = App.fmt, esc = App.esc;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var JD_MIN = Astro.jdFromDate(Astro.MIN_DATE), JD_MAX = Astro.jdFromDate(Astro.MAX_DATE);
  var YEAR_DAYS = App.data.constants.SIDEREAL_YEAR_DAYS; // hari per tahun Bumi, sama dengan ensiklopedia
  var LIMIT_NOTE = 'Posisi di halaman ini dihitung dengan tabel elemen orbit JPL yang hanya berlaku dari tahun 1800 sampai 2050.';
  var VISIBILITY = {
    'sun-glare': 'terlalu dekat Matahari',
    'all-night': 'hampir sepanjang malam',
    evening: 'langit senja (setelah Matahari terbenam)',
    morning: 'langit pagi (sebelum Matahari terbit)'
  };

  var SCENE = App.bodies(function (b) { return b.id === 'sun' || b.id === 'moon' || b.orbit; });
  var EARTH = App.body('earth');
  var SKY_PLANETS = App.planets().filter(function (p) { return p.id !== 'earth' && p.orbit; });

  var dateText = $('date-text'), dateInput = $('date-input'), dateError = $('date-error');
  var playBtn = $('play'), statusEl = $('time-status');
  var trueScale = $('true-scale');
  var chipList = $('body-chips'), card = $('body-card');
  var sky = $('sky'), skyBody = $('sky-body'), skyDate = $('sky-date');

  var orrery = new Orrery(canvas);
  orrery.setReducedMotion(reduceMotion);

  var state = {
    jd: clampJd(Astro.jdFromDate(new Date())),
    playing: !reduceMotion,
    speed: 1,
    dir: 1,
    selected: null,
    dayKey: ''
  };

  function clampJd(jd) { return Math.min(JD_MAX, Math.max(JD_MIN, jd)); }
  function vlen(v) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }

  /* ---------- Putaran gambar ---------- */

  // requestAnimationFrame hanya berjalan selama waktu diputar atau kamera/skala sedang beranimasi.
  var raf = 0, lastT = 0;
  var live = { jd: NaN, sel: undefined, scale: undefined, t: 0 };

  function frame(now) {
    raf = 0;
    if (state.playing) {
      if (lastT) advance(Math.min(0.1, (now - lastT) / 1000));
      lastT = now;
    } else {
      lastT = 0;
    }
    orrery.setDate(state.jd);
    var animating = orrery.render(now);
    updateDateText();
    updateLive(now, false);
    if (state.playing || animating) raf = requestAnimationFrame(frame);
  }

  function requestRender() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function advance(dt) {
    var jd = state.jd + state.speed * state.dir * dt;
    if (jd >= JD_MAX || jd <= JD_MIN) {
      state.jd = clampJd(jd);
      setPlaying(false);
      showLimit();
      return;
    }
    state.jd = jd;
  }

  function atLimit() {
    return (state.dir > 0 && state.jd >= JD_MAX) || (state.dir < 0 && state.jd <= JD_MIN);
  }

  function showLimit() {
    statusEl.textContent = 'Waktu berhenti di ' + App.fmtDate(Astro.dateFromJd(state.jd)) + '. ' + LIMIT_NOTE;
  }

  /* ---------- Tampilan teks yang mengikuti waktu ---------- */

  function updateDateText() {
    var date = Astro.dateFromJd(state.jd);
    var key = App.toInputDate(date);
    if (key === state.dayKey) return;
    state.dayKey = key;
    dateText.textContent = App.fmtDate(date);
    skyDate.textContent = App.fmtDate(date);
    if (document.activeElement !== dateInput) {
      dateInput.value = key;
      setDateError('');
    }
  }

  // Kartu, tabel, dan label kanvas: paling sering 4 kali per detik selama waktu berjalan.
  function updateLive(now, force) {
    var same = live.jd === state.jd && live.sel === state.selected && live.scale === trueScale.checked;
    if (!force && same) return;
    if (!force && state.playing && now - live.t < 250) return;
    live.jd = state.jd;
    live.sel = state.selected;
    live.scale = trueScale.checked;
    live.t = now;
    var dd = $('card-distance');
    var b = state.selected && App.body(state.selected);
    if (dd && b) dd.innerHTML = distanceHtml(b);
    updateSky();
    updateCanvasLabel();
  }

  // Jarak dari Matahari pada tanggal ini.
  function sunDistance(b) {
    var r = vlen(Astro.helioPosition(b.orbit, state.jd));
    return {
      au: fmt(r, r < 10 ? 3 : 2) + ' SA',
      km: fmt(r * Astro.AU_KM / 1e6, 1) + ' juta km'
    };
  }

  function distanceHtml(b) {
    if (b.orbit) {
      var d = sunDistance(b);
      return d.au + '<small>' + d.km + '</small>';
    }
    // Deret Bulan di astro.js hanya memakai suku terbesar, jadi jaraknya dibulatkan ke ribuan km (sama dengan Fase Bulan).
    return fmt(Math.round(Astro.moonPosition(state.jd).distKm / 1000) * 1000) + ' km<small>pusat ke pusat, dibulatkan</small>';
  }

  function updateCanvasLabel() {
    var b = state.selected && App.body(state.selected);
    var text = 'Tampilan tiga dimensi tata surya pada ' + App.fmtDate(Astro.dateFromJd(state.jd)) + ', ' +
      (trueScale.checked ? 'skala sebenarnya' : 'skala dipadatkan') + '. ';
    if (b) {
      text += 'Terpilih: ' + b.name;
      if (b.orbit) text += ', ' + sunDistance(b).au + ' dari Matahari';
      text += '.';
    } else {
      text += 'Belum ada benda yang dipilih; pilih lewat tombol benda di panel.';
    }
    canvas.setAttribute('aria-label', text);
  }

  function updateSky() {
    if (!sky.open) return;
    var earthPos = Astro.helioPosition(EARTH.orbit, state.jd);
    skyBody.innerHTML = SKY_PLANETS.map(function (p) {
      var f = Astro.fromEarth(Astro.helioPosition(p.orbit, state.jd), earthPos);
      var km = f.dist * Astro.AU_KM;
      var dec = f.dist < 10 ? 3 : 2; // desimal tetap supaya angka sekolom rata
      return '<tr' + (p.id === state.selected ? ' class="is-selected"' : '') + '>' +
        '<th scope="row"><span class="jelajah__name"><span class="dot" style="--c:' + esc(p.color) + '"></span>' + esc(p.name) + '</span></th>' +
        '<td class="n">' + fmt(f.dist, dec, dec) + ' SA<br><span class="muted small">' + fmt(km / 1e6, 1, 1) + ' juta km</span></td>' +
        '<td class="n">' + App.fmtDuration(km / Astro.C_KM_S) + '</td>' +
        '<td class="n">' + fmt(f.elongation, 0) + '° ' + (f.east ? 'timur' : 'barat') + '</td>' +
        '<td>' + VISIBILITY[Astro.visibility(f.elongation, f.east)] + '</td>' +
        '</tr>';
    }).join('');
  }

  /* ---------- Kartu benda terpilih ---------- */

  function plate(label, value, sub, id) {
    return '<div><dt>' + label + '</dt><dd' + (id ? ' id="' + id + '"' : '') + '>' + value +
      (sub ? '<small>' + sub + '</small>' : '') + '</dd></div>';
  }

  function plates(b) {
    var out = [];
    if (b.orbit) out.push(plate('Jarak dari Matahari pada tanggal ini', distanceHtml(b), '', 'card-distance'));
    if (b.id === 'moon') out.push(plate('Jarak dari Bumi pada tanggal ini', distanceHtml(b), '', 'card-distance'));
    out.push(plate('Diameter', b.diameter_km === null ? 'tidak diketahui' : fmt(b.diameter_km, 0) + ' km'));
    if (b.id !== 'sun') {
      var P = b.orbital_period_days;
      var around = b.parent === 'earth' ? 'mengelilingi Bumi' : '';
      if (P === null) out.push(plate('Periode orbit', 'tidak diketahui'));
      else if (P >= 730) out.push(plate('Periode orbit', fmt(P / YEAR_DAYS, 1) + ' tahun', fmt(P, 0) + ' hari'));
      else out.push(plate('Periode orbit', fmt(P, 1) + ' hari', P >= 365 ? fmt(P / YEAR_DAYS, 2) + ' tahun' : around));
      var D = b.day_length_h;
      if (D === null) out.push(plate('Panjang hari', 'tidak diketahui'));
      else if (D >= 48) out.push(plate('Panjang hari', fmt(D / 24, 1) + ' hari', fmt(D, 1) + ' jam'));
      else out.push(plate('Panjang hari', fmt(D, 1) + ' jam'));
    }
    if (b.moons !== null) {
      var asOf = App.fromInputDate(b.moons_as_of);
      out.push(plate('Jumlah bulan', fmt(b.moons, 0), asOf ? 'per ' + App.fmtDate(asOf) : ''));
    }
    return out.join('');
  }

  function renderCard(notice) {
    var b = state.selected && App.body(state.selected);
    if (!b) {
      card.innerHTML = notice || '<p class="muted">Belum ada benda yang dipilih. Pilih salah satu tombol di atas, atau klik benda di kanvas, untuk melihat datanya di sini.</p>';
      return;
    }
    var img = b.image;
    card.innerHTML =
      '<div class="jelajah__card-head">' +
        (img ? '<img src="' + esc(img.src) + '" alt="" width="88" height="88">' : '') +
        '<div><p class="small muted">' + esc(b.category) + '</p><h3>' + esc(b.name) + '</h3></div>' +
      '</div>' +
      (img ? '<p class="figure-credit">Foto: ' + esc(img.title) + '. Kredit: ' + esc(img.credit) + '</p>' : '') +
      '<p>' + esc(b.summary) + '</p>' +
      '<dl class="plates">' + plates(b) + '</dl>' +
      '<p><a class="btn" href="ensiklopedia.html#' + encodeURIComponent(b.id) + '">Buka di ensiklopedia</a></p>';
  }

  /* ---------- Pilihan benda ---------- */

  chipList.innerHTML = SCENE.map(function (b) {
    return '<li><button type="button" class="chip" aria-pressed="false" data-id="' + esc(b.id) + '">' +
      '<span class="dot" style="--c:' + esc(b.color) + '"></span>' + esc(b.name) + '</button></li>';
  }).join('');

  // focus: kamera ikut pindah ke benda; closer: sekaligus mendekat; instant: tanpa animasi.
  function select(id, focus, closer, instant) {
    state.selected = id;
    // Benda yang disembunyikan lewat sakelar dimunculkan lagi saat dipilih.
    ['moon', 'halley'].forEach(function (opt) {
      var box = document.querySelector('[data-opt="' + opt + '"]');
      if (id === opt && !box.checked) {
        box.checked = true;
        orrery.setOptions(readOptions());
      }
    });
    orrery.select(id);
    if (id && focus) orrery.focus(id, closer, instant);
    chipList.querySelectorAll('.chip').forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-id') === id));
    });
    renderCard();
    if (history.replaceState) history.replaceState(null, '', id ? '#' + id : location.pathname + location.search);
    requestRender();
  }

  chipList.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (chip) select(chip.getAttribute('data-id'), true);
  });

  function applyHash(instant) {
    var id = location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch (e) { /* tautan rusak seperti #%E0: pakai apa adanya */ }
    if (!id) return;
    if (orrery.has(id)) {
      select(id, true, false, instant);
      return;
    }
    var b = App.body(id);
    select(null);
    renderCard('<p class="notice">' + (b
      ? esc(b.name) + ' tidak ditampilkan di Jelajah 3D karena data orbitnya tidak tersedia di situs ini. Datanya bisa kamu baca di <a href="ensiklopedia.html#' + encodeURIComponent(b.id) + '">ensiklopedia</a>.'
      : 'Benda dengan kode "' + esc(id) + '" tidak ada di Jelajah 3D. Pilih salah satu tombol benda di atas.') + '</p>');
  }

  window.addEventListener('hashchange', function () { applyHash(false); });

  /* ---------- Waktu ---------- */

  function setPlaying(on) {
    state.playing = on;
    playBtn.textContent = on ? 'Jeda' : 'Jalankan';
    if (on) statusEl.textContent = '';
    requestRender();
  }

  function togglePlay() {
    if (!state.playing && atLimit()) {
      showLimit();
      return;
    }
    setPlaying(!state.playing);
  }

  function setDateError(msg) {
    dateError.textContent = msg;
    if (msg) dateInput.setAttribute('aria-invalid', 'true');
    else dateInput.removeAttribute('aria-invalid');
  }

  function setJd(jd) {
    state.jd = clampJd(jd);
    state.dayKey = '';
    statusEl.textContent = '';
    requestRender();
  }

  playBtn.addEventListener('click', togglePlay);

  $('today').addEventListener('click', function () {
    setDateError('');
    setJd(Astro.jdFromDate(new Date()));
  });

  dateInput.addEventListener('change', function () {
    var value = dateInput.value;
    var date = App.fromInputDate(value, 12);
    if (!date) {
      setDateError('Tanggal belum lengkap atau tidak sah. Isi hari, bulan, dan tahun.');
      return;
    }
    if (date < Astro.MIN_DATE || date > Astro.MAX_DATE) {
      setDateError('Pilih tanggal antara 1 Januari 1800 dan 31 Desember 2050. Di luar rentang itu tabel orbit JPL yang dipakai halaman ini tidak berlaku.');
      return;
    }
    setDateError('');
    setJd(Astro.jdFromDate(date));
  });

  // Selama isian difokus, tanggal yang berjalan tidak menimpanya; setelah fokus pindah, isian diselaraskan lagi.
  dateInput.addEventListener('blur', function () {
    if (dateError.textContent) return;
    state.dayKey = '';
    requestRender();
  });

  function bindSegmented(group, onPick) {
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      group.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      onPick(btn);
      requestRender();
    });
  }

  bindSegmented($('speed'), function (btn) { state.speed = Number(btn.getAttribute('data-days')); });
  bindSegmented($('direction'), function (btn) {
    state.dir = Number(btn.getAttribute('data-dir'));
    statusEl.textContent = '';
  });

  /* ---------- Tampilan ---------- */

  function readOptions() {
    var o = {};
    document.querySelectorAll('[data-opt]').forEach(function (box) { o[box.getAttribute('data-opt')] = box.checked; });
    return o;
  }

  document.querySelectorAll('[data-opt]').forEach(function (box) {
    box.addEventListener('change', function () {
      orrery.setOptions(readOptions());
      requestRender();
    });
  });

  trueScale.addEventListener('change', function () {
    orrery.setTrueScale(trueScale.checked);
    requestRender();
  });

  $('center-sun').addEventListener('click', function () {
    orrery.centerSun();
    requestRender();
  });

  $('top-view').addEventListener('click', function () {
    orrery.topView();
    requestRender();
  });

  sky.addEventListener('toggle', function () { updateLive(performance.now(), true); });
  sky.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sky.open) {
      sky.open = false;
      sky.querySelector('summary').focus();
    }
  });

  /* ---------- Kanvas: seret, gulir, cubit, klik, papan ketik ---------- */

  var pointers = new Map();
  var gesture = null, lastTap = null;
  var ROTATE_PER_PX = 0.006;

  function pinchDistance() {
    var p = Array.from(pointers.values());
    return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
  }

  canvas.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) gesture = { moved: 0, multi: false, pinch: 0 };
    else if (pointers.size === 2 && gesture) {
      gesture.multi = true;
      gesture.pinch = pinchDistance();
    }
  });

  canvas.addEventListener('pointermove', function (e) {
    var p = pointers.get(e.pointerId);
    if (!p || !gesture) return;
    var dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;
    if (pointers.size === 1 && !gesture.multi) {
      gesture.moved += Math.abs(dx) + Math.abs(dy);
      orrery.rotate(-dx * ROTATE_PER_PX, dy * ROTATE_PER_PX);
      if (gesture.moved > 6) canvas.classList.add('is-dragging');
      requestRender();
    } else if (pointers.size === 2) {
      var d = pinchDistance();
      if (gesture.pinch > 0 && d > 0) orrery.zoomBy(gesture.pinch / d);
      gesture.pinch = d;
      requestRender();
    }
  });

  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    canvas.classList.remove('is-dragging');
    if (e.type === 'pointerup' && pointers.size === 0 && gesture && !gesture.multi && gesture.moved <= 6) tap(e);
    if (pointers.size === 0) gesture = null;
  }
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);

  // Klik/ketuk: pilih benda terdekat. Klik kedua yang cepat pada benda yang sama: mendekat.
  function tap(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left, y = e.clientY - rect.top;
    var now = performance.now();
    var twice = lastTap && now - lastTap.t < 400 && Math.hypot(x - lastTap.x, y - lastTap.y) < 24;
    if (twice && lastTap.id) {
      var first = lastTap.id;
      lastTap = null;
      select(first, true, true);
      return;
    }
    var id = orrery.pick(x, y, e.pointerType === 'mouse' ? 14 : 22);
    lastTap = { t: now, x: x, y: y, id: id };
    if (id) select(id, true);
    else if (state.selected) select(null);
  }

  canvas.addEventListener('wheel', function (e) {
    e.preventDefault();
    var dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1);
    orrery.zoomBy(Math.exp(Math.max(-200, Math.min(200, dy)) * 0.0015));
    requestRender();
  }, { passive: false });

  canvas.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return; // Ctrl/Cmd + dan - tetap untuk memperbesar halaman
    var step = 5 * Math.PI / 180;
    switch (e.key) {
      case 'ArrowLeft': orrery.rotate(step, 0); break;
      case 'ArrowRight': orrery.rotate(-step, 0); break;
      case 'ArrowUp': orrery.rotate(0, step); break;
      case 'ArrowDown': orrery.rotate(0, -step); break;
      case '+': case '=': orrery.zoomBy(1 / 1.25); break;
      case '-': case '_': orrery.zoomBy(1.25); break;
      case ' ': togglePlay(); break;
      case 'Escape': select(null); break;
      default: return;
    }
    e.preventDefault();
    requestRender();
  });

  /* ---------- Awal ---------- */

  function onResize() {
    orrery.resize();
    requestRender();
  }

  orrery.setOptions(readOptions());
  orrery.setTrueScale(trueScale.checked, true);
  setPlaying(state.playing);
  renderCard();
  applyHash(true);
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(canvas);
  else window.addEventListener('resize', onResize);
  onResize();
})();
