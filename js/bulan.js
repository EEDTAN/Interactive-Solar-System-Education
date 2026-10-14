/*
 * bulan.js: halaman Fase Bulan.
 * Posisi Bulan dan Matahari dihitung js/astro.js (suku terbesar Meeus). Semua tanggal dan jam
 * memakai zona waktu perangkat pengguna.
 */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  var viewer = $('viewer');

  // Keadaan galat: judul menyebut masalahnya, kontrol yang tidak bisa bekerja disembunyikan.
  function disable() {
    $('phase-name').textContent = 'Fase Bulan tidak bisa dihitung';
    viewer.style.display = 'block'; // satu kolom: judul lalu pesan galat
    Array.prototype.forEach.call(document.querySelectorAll('.viewer__stage, .viewer__facts, .viewer__controls, .schedule, .explain'), function (e) {
      e.hidden = true;
    });
  }

  if (!window.App || !App.data || !window.Astro) {
    // common.js sudah menampilkan pesan galat bila data tidak termuat.
    disable();
    if (!window.App) {
      $('phase-name').insertAdjacentHTML('afterend', '<div class="notice notice--error" role="alert"><strong>Ada masalah.</strong> ' +
        'Berkas js/common.js tidak termuat. Pastikan berkas itu ada, lalu muat ulang halaman.</div>');
    }
    return;
  }

  var data = App.data;
  var C = data.constants || {};
  var MOON = App.body('moon'), EARTH = App.body('earth'), SUN = App.body('sun');
  var DEG = Math.PI / 180;
  var ORDER = ['new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous', 'full', 'waning-gibbous', 'last-quarter', 'waning-crescent'];
  // Bentuk empat fase utama: bagian tersinari dan sisi terangnya.
  var SHAPES = {
    'new': { k: 0, waxing: true },
    'first-quarter': { k: 0.5, waxing: true },
    'full': { k: 1, waxing: true },
    'last-quarter': { k: 0.5, waxing: false }
  };
  var PHASES = {};
  (data.moonPhases || []).forEach(function (p) { PHASES[p.key] = p; });

  var MIN = Astro.MIN_DATE, MAX = Astro.MAX_DATE;

  var fmtDay = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var fmtClock = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
  var fmtHM = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' });
  var fmtMonth = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });

  var css = getComputedStyle(document.documentElement);
  function cssVar(name) { return css.getPropertyValue(name).trim(); }
  var COL = {
    muted: cssVar('--text-muted'),
    accent: cssVar('--accent'),
    line: cssVar('--line-strong'),
    bg: cssVar('--bg-sunken'),
    moon: MOON ? MOON.color : '#b9b9b4'
  };
  // Sisi malam Bulan: warna Bulan yang sangat redup. Tepinya minimal 3:1 terhadap latar agar
  // bulatan piringan tetap terlihat saat Bulan baru.
  var DARK = 'rgba(185, 185, 180, 0.13)';
  var RIM = 'rgba(185, 185, 180, 0.55)';
  var FONT = getComputedStyle(document.body).fontFamily;

  var el = {
    name: $('phase-name'), when: $('when'), desc: $('phase-desc'), status: $('status'),
    moon: $('moon-canvas'), orbit: $('orbit-canvas'), orbitList: $('orbit-list'),
    illum: $('v-illum'), age: $('v-age'), angle: $('v-angle'), dist: $('v-dist'),
    slider: $('age'), sliderOut: $('age-out'), ticks: $('age-ticks'), sliderHint: $('age-hint'),
    date: $('date'), time: $('time'), dateErr: $('date-error'), timeErr: $('time-error'), tz: $('tz'),
    prevDay: $('prev-day'), nextDay: $('next-day'), now: $('now'),
    nextIntro: $('next-intro'), nextList: $('next-list'),
    calMonth: $('cal-month'), calCaption: $('cal-caption'), calBody: $('cal-body'),
    calPrev: $('cal-prev'), calNext: $('cal-next'),
    note: $('equator-note')
  };

  var state = { date: null, lun: null, phase: null, cal: null, calKey: '', ticksKey: null };

  /* ---------- Geometri Bulan ---------- */

  // Bagian piringan yang tersinari sebagai data path SVG (dipakai juga di kanvas lewat Path2D).
  // k = bagian tersinari 0..1. Terminator adalah setengah elips dengan sumbu pendek r|1 - 2k|,
  // sehingga luas daerah terang tepat k kali luas piringan. waxing: sisi terang di kanan.
  function litPath(cx, cy, r, k, waxing) {
    var a = r * Math.abs(1 - 2 * k);
    var limb = waxing ? 1 : 0;
    var term = (k < 0.5) === waxing ? 0 : 1;
    function n(v) { return Math.round(v * 100) / 100; }
    return 'M' + n(cx) + ' ' + n(cy - r) +
      'A' + n(r) + ' ' + n(r) + ' 0 0 ' + limb + ' ' + n(cx) + ' ' + n(cy + r) +
      'A' + n(a) + ' ' + n(r) + ' 0 0 ' + term + ' ' + n(cx) + ' ' + n(cy - r) + 'Z';
  }

  function moonSvg(k, waxing, cls) {
    var lit = k > 0.0005 ? '<path d="' + litPath(14, 14, 12, k, waxing) + '" fill="' + COL.moon + '"></path>' : '';
    return '<svg class="' + cls + '" viewBox="0 0 28 28" aria-hidden="true" focusable="false">' +
      '<circle cx="14" cy="14" r="12" fill="' + DARK + '" stroke="' + RIM + '" stroke-width="1"></circle>' + lit + '</svg>';
  }

  /* ---------- Waktu ---------- */

  function pad(n) { return String(n).padStart(2, '0'); }
  function jdOf(d) { return Astro.jdFromDate(d); }
  function clamp(d) { return d < MIN ? new Date(MIN) : d > MAX ? new Date(MAX) : d; }
  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  function nowMinute() { var d = new Date(); d.setSeconds(0, 0); return d; }
  function shiftDays(d, n) { var c = new Date(d); c.setDate(c.getDate() + n); return c; }
  function clock(d) { return fmtClock.format(d); }
  function days(x) { return App.fmt(x, 1, 1) + ' hari'; }

  // "WIB (UTC+7)" untuk tanggal d, mengikuti zona waktu perangkat.
  function tzLabel(d) {
    var part = fmtClock.formatToParts(d).filter(function (x) { return x.type === 'timeZoneName'; })[0];
    var name = part ? part.value : '';
    var off = -Math.round(d.getTimezoneOffset());
    var sign = off < 0 ? '−' : '+';
    off = Math.abs(off);
    var utc = 'UTC' + sign + Math.floor(off / 60) + (off % 60 ? '.' + pad(off % 60) : '');
    return name && !/^(GMT|UTC)/.test(name) ? name + ' (' + utc + ')' : utc;
  }

  // Siklus yang memuat jd: Bulan baru sebelumnya (start), sesudahnya (end), dan tiga fase utama di antaranya.
  function lunation(jd) {
    var start = jd - Astro.moonPhase(jd).ageDays;
    // Mulai setengah hari setelah Bulan baru agar Bulan baru itu sendiri tidak ikut terhitung.
    var marks = Astro.nextPhases(start + 0.5, 4);
    return { start: start, end: marks[3].jd, marks: marks };
  }

  /* ---------- Perubahan tanggal ---------- */

  function setDate(d, from) {
    state.date = clamp(d);
    if (from !== 'slider' || !state.lun) state.lun = lunation(jdOf(state.date));
    if (from !== 'inputs') syncInputs();
    render(from);
  }

  function syncInputs() {
    el.date.value = App.toInputDate(state.date);
    el.time.value = pad(state.date.getHours()) + ':' + pad(state.date.getMinutes());
    setError(el.date, el.dateErr, '');
    setError(el.time, el.timeErr, '');
  }

  // Tombol yang dinonaktifkan saat sedang difokus menjatuhkan fokus ke body; pindahkan ke pasangannya.
  function setDisabled(btn, off, partner) {
    var had = document.activeElement === btn;
    btn.disabled = off;
    if (off && had) partner.focus();
  }

  function setError(input, box, message) {
    box.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function readInputs() {
    var dv = el.date.value, tv = el.time.value;
    var d = App.fromInputDate(dv);
    var t = /^(\d{2}):(\d{2})/.exec(tv);
    var dateMsg = '', timeMsg = '';
    if (!dv) dateMsg = 'Tanggal belum lengkap. Isi hari, bulan, dan tahun.';
    else if (!d || d < MIN || d > MAX) dateMsg = 'Pilih tanggal dari ' + App.fmtDate(MIN) + ' sampai ' + App.fmtDate(MAX) + '.';
    if (!t) timeMsg = 'Jam belum lengkap. Isi jam dan menit.';
    setError(el.date, el.dateErr, dateMsg);
    setError(el.time, el.timeErr, timeMsg);
    if (dateMsg || timeMsg) return;
    d.setHours(Number(t[1]), Number(t[2]), 0, 0);
    setDate(d, 'inputs');
  }

  /* ---------- Tampilan utama ---------- */

  function render(from) {
    var d = state.date, jd = jdOf(d);
    var p = Astro.moonPhase(jd);
    var ph = PHASES[p.key];
    var pct = p.illumination * 100;
    var pctText = App.fmt(pct, pct < 1 || pct > 99 ? 1 : 0) + '%';
    state.phase = p;

    el.name.textContent = ph.name;
    el.when.textContent = App.fmtDateTime(d);
    el.illum.textContent = pctText;
    el.age.textContent = days(p.ageDays);
    el.angle.innerHTML = Math.round(p.elongation) % 360 + '°<small>0° Bulan baru, 180° purnama</small>';
    // astro.js memakai suku jarak terbesar saja: selisihnya dengan JPL Horizons bisa ratusan km.
    el.dist.innerHTML = App.fmt(Math.round(p.moon.distKm / 1000) * 1000) + ' km' +
      '<small>pusat ke pusat, perkiraan; rata-rata ' + App.fmt(C.MOON_DISTANCE_KM) + ' km</small>';
    el.desc.textContent = ph.description;
    el.tz.textContent = 'Jam mengikuti zona waktu perangkatmu: ' + tzLabel(d) + '.';
    setDisabled(el.prevDay, shiftDays(d, -1) < MIN, el.nextDay);
    setDisabled(el.nextDay, shiftDays(d, 1) > MAX, el.prevDay);

    drawMoon(p);
    el.moon.setAttribute('aria-label', 'Bulan pada ' + App.fmtDateTime(d) + ': ' + ph.name + ', ' + pctText +
      ' piringan tersinari' + (pct >= 1 && pct <= 99 ? ', sisi terang di ' + (p.waxing ? 'kanan' : 'kiri') : '') +
      ' (arah pandang belahan Bumi utara).');

    renderSlider(jd, ph);
    drawOrbit(p);
    renderOrbitText(p, ph);
    renderNext(jd);
    state.cal = { y: d.getFullYear(), m: d.getMonth() };
    renderCalendar();

    if (from !== 'init') announce(ph.name + ', ' + pctText + ' tersinari, ' + App.fmtDateTime(d) + '.');
  }

  var announceTimer = null;
  // Ditunda sebentar agar pembaca layar tidak dibanjiri saat penggeser digeser.
  function announce(text) {
    clearTimeout(announceTimer);
    announceTimer = setTimeout(function () { el.status.textContent = text; }, 700);
  }

  function drawMoon(p) {
    var f = App.fitCanvas(el.moon), ctx = f.ctx;
    var r = Math.min(f.w, f.h) * 0.4, cx = f.w / 2, cy = f.h / 2;
    ctx.clearRect(0, 0, f.w, f.h);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = DARK;
    ctx.fill();
    ctx.strokeStyle = RIM;
    ctx.lineWidth = 1;
    ctx.stroke();
    if (p.illumination > 0.0005) {
      ctx.fillStyle = COL.moon;
      ctx.fill(new Path2D(litPath(cx, cy, r, p.illumination, p.waxing)));
    }
  }

  /* ---------- Penggeser umur Bulan ---------- */

  function renderSlider(jd, ph) {
    var lun = state.lun, len = lun.end - lun.start;
    var max = Math.floor(len * 10) / 10;
    var age = jd - lun.start;
    el.slider.max = String(max);
    // Juga saat digeser: di batas 1800/2050 tanggal dipotong, jadi tombol geser harus ikut kembali.
    el.slider.value = String(Math.min(max, Math.max(0, Math.round(age * 10) / 10)));
    el.sliderOut.textContent = days(age);
    el.slider.setAttribute('aria-valuetext', days(age) + ', ' + ph.name);

    if (state.ticksKey === lun.start) return;
    state.ticksKey = lun.start;
    var ticks = [{ key: 'new', jd: lun.start }].concat(lun.marks);
    el.ticks.innerHTML = ticks.map(function (m) {
      var f = Math.min(1, (m.jd - lun.start) / max);
      return '<span style="--f:' + f.toFixed(4) + '">' + App.esc(PHASES[m.key].name) + '</span>';
    }).join('');
    el.sliderHint.textContent = 'Siklus ini: Bulan baru ' + App.fmtDateTime(Astro.dateFromJd(lun.start)) +
      ' sampai Bulan baru ' + App.fmtDateTime(Astro.dateFromJd(lun.end)) + ' (' + App.fmt(len, 2) + ' hari).';
  }

  /* ---------- Diagram dari atas ---------- */

  // Bulan kecil dengan separuh kanannya terang (Matahari di kanan diagram).
  function halfLit(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = '#2a2d36';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fillStyle = COL.moon;
    ctx.fill();
  }

  function drawOrbit(p) {
    var f = App.fitCanvas(el.orbit), ctx = f.ctx, w = f.w, h = f.h;
    var size = w < 420 ? 12 : 13, lh = size + 3;
    var font = size + 'px ' + FONT;
    ctx.clearRect(0, 0, w, h);
    ctx.font = font;
    ctx.lineCap = 'round';

    // Pita sinar Matahari di tepi kanan: garis sejajar yang menuju ke kiri.
    var band = 44;
    ctx.strokeStyle = SUN.color;
    ctx.lineWidth = 1.5;
    for (var k = 0; k < 6; k++) {
      var ry = h * (0.24 + k * 0.104), x0 = w - 10, x1 = w - band + 8;
      ctx.beginPath();
      ctx.moveTo(x0, ry);
      ctx.lineTo(x1, ry);
      ctx.moveTo(x1 + 5, ry - 4);
      ctx.lineTo(x1, ry);
      ctx.lineTo(x1 + 5, ry + 4);
      ctx.stroke();
    }
    ctx.fillStyle = COL.muted;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('Sinar', w - 10, 10);
    ctx.fillText('Matahari', w - 10, 10 + lh);

    // Ukuran orbit dipilih agar label terpanjang (diukur tebal, seperti label fase saat ini) tetap muat.
    var labels = ORDER.map(function (key) { return PHASES[key].name.split(' '); });
    var maxW = 0, maxLines = 1;
    ctx.font = '600 ' + font;
    labels.forEach(function (lines) {
      maxLines = Math.max(maxLines, lines.length);
      lines.forEach(function (t) { maxW = Math.max(maxW, ctx.measureText(t).width); });
    });
    var areaW = w - band, cx = areaW / 2, cy = h / 2;
    var rm = Math.max(5, Math.min(8, w * 0.02)), gap = 7;
    var R = Math.min(cx - maxW - rm - gap - 6, cy - maxLines * lh - rm - gap - 6);
    var Rl = R + rm + gap;

    ctx.strokeStyle = COL.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, 2 * Math.PI);
    ctx.stroke();

    // Panah arah peredaran Bulan (berlawanan arah jarum jam dilihat dari utara).
    [22.5, 202.5].forEach(function (deg) {
      var a = deg * DEG, px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
      var tx = -Math.sin(a), ty = -Math.cos(a), nx = Math.cos(a), ny = -Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(px - tx * 4 + nx * 4, py - ty * 4 + ny * 4);
      ctx.lineTo(px + tx * 3, py + ty * 3);
      ctx.lineTo(px - tx * 4 - nx * 4, py - ty * 4 - ny * 4);
      ctx.stroke();
    });

    // Delapan posisi fase beserta namanya.
    ORDER.forEach(function (key, i) {
      var a = i * 45 * DEG, c = Math.cos(a), s = Math.sin(a);
      ctx.globalAlpha = 0.7;
      halfLit(ctx, cx + R * c, cy - R * s, rm);
      ctx.globalAlpha = 1;
      var cur = key === p.key, lines = labels[i];
      var lx = cx + Rl * c, ly = cy - Rl * s, blockH = lines.length * lh;
      var top = s > 0.3 ? ly - blockH : s < -0.3 ? ly : ly - blockH / 2;
      ctx.font = (cur ? '600 ' : '') + font;
      ctx.fillStyle = cur ? COL.accent : COL.muted;
      ctx.textAlign = c > 0.3 ? 'left' : c < -0.3 ? 'right' : 'center';
      ctx.textBaseline = 'top';
      lines.forEach(function (t, j) { ctx.fillText(t, lx, top + j * lh + 1); });
    });
    ctx.font = font;

    // Bumi di tengah, sisi siangnya menghadap Matahari.
    var rE = Math.max(7, R * 0.13);
    var a = p.elongation * DEG, mx = cx + R * Math.cos(a), my = cy - R * Math.sin(a), rM = rm * 1.6;
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = COL.line;
    ctx.beginPath();
    ctx.moveTo(cx + (rE + 3) * Math.cos(a), cy - (rE + 3) * Math.sin(a));
    ctx.lineTo(mx - (rM + 6) * Math.cos(a), my + (rM + 6) * Math.sin(a));
    ctx.stroke();
    ctx.setLineDash([]);
    App.drawBody(ctx, EARTH, cx, cy, rE, { light: 0 });
    var bw = ctx.measureText(EARTH.name).width;
    ctx.fillStyle = COL.bg;
    ctx.fillRect(cx - bw / 2 - 3, cy + rE + 3, bw + 6, lh);
    ctx.fillStyle = COL.muted;
    ctx.textAlign = 'center';
    ctx.fillText(EARTH.name, cx, cy + rE + 4);

    // Bulan pada elongasinya saat ini, ditandai warna aksen.
    halfLit(ctx, mx, my, rM);
    ctx.strokeStyle = COL.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mx, my, rM + 4, 0, 2 * Math.PI);
    ctx.stroke();
  }

  function renderOrbitText(p, ph) {
    var deg = Math.round(p.elongation) % 360;
    el.orbit.setAttribute('aria-label', 'Diagram dari atas: Matahari di kanan, Bumi di tengah, Bulan di orbitnya pada sudut ' + deg +
      ' derajat dari arah Matahari, di posisi ' + ph.name + '.');
    el.orbitList.innerHTML = ORDER.map(function (key, i) {
      var cur = key === p.key;
      return '<li' + (cur ? ' aria-current="true"' : '') + '>' + App.esc(PHASES[key].name) + ': ' + (i * 45) + ' derajat' +
        (cur ? ', posisi Bulan pada waktu pilihan' : '') + '</li>';
    }).join('');
  }

  /* ---------- Fase utama berikutnya ---------- */

  function renderNext(jd) {
    el.nextIntro.textContent = 'Dihitung dari ' + App.fmtDateTime(state.date) + '.';
    el.nextList.innerHTML = Astro.nextPhases(jd, 8).map(function (x) {
      var d = Astro.dateFromJd(x.jd), shape = SHAPES[x.key];
      return '<li>' + moonSvg(shape.k, shape.waxing, 'phase-list__moon') +
        '<span class="phase-list__text"><span class="phase-list__name">' + App.esc(PHASES[x.key].name) + '</span>' +
        '<span>' + App.esc(fmtDay.format(d)) + '</span>' +
        '<span class="muted">sekitar pukul ' + App.esc(clock(d)) + '</span></span></li>';
    }).join('');
  }

  /* ---------- Kalender ---------- */

  function renderCalendar() {
    var y = state.cal.y, m = state.cal.m, today = new Date(), sel = state.date;
    var key = y + '-' + m + '|' + sel.toDateString() + '|' + today.toDateString();
    if (key === state.calKey) return;
    state.calKey = key;

    var first = new Date(y, m, 1), nextMonth = new Date(y, m + 1, 1), prevMonth = new Date(y, m - 1, 1);
    var count = new Date(y, m + 1, 0).getDate(), lead = first.getDay(); // 0 = Minggu
    var endJd = jdOf(nextMonth);
    // Fase utama yang jatuh di bulan ini, ditempatkan pada tanggal lokalnya.
    var marks = {};
    Astro.nextPhases(jdOf(first), 6).forEach(function (x) {
      if (x.jd < endJd) marks[Astro.dateFromJd(x.jd).getDate()] = x;
    });

    var cells = [];
    for (var i = 0; i < lead; i++) cells.push('<td class="cal__pad"></td>');
    for (var d = 1; d <= count; d++) {
      var noon = new Date(y, m, d, 12);
      var p = Astro.moonPhase(jdOf(noon));
      var mark = marks[d], when = mark ? Astro.dateFromJd(mark.jd) : null;
      var isToday = sameDay(noon, today), isSel = sameDay(noon, sel);
      var cls = 'cal__day' + (isToday ? ' is-today' : '') + (isSel ? ' is-selected' : '') + (mark ? ' has-phase' : '');
      var sr = mark ? PHASES[mark.key].name + ' sekitar pukul ' + clock(when) : PHASES[p.key].name;
      if (isToday) sr += ', hari ini';
      if (isSel) sr += ', tanggal pilihan';
      cells.push('<td class="' + cls + '"><span class="cal__num">' + d + '</span>' +
        moonSvg(p.illumination, p.waxing, 'cal__moon') +
        (mark ? '<span class="cal__phase" aria-hidden="true"><span class="cal__phase-name">' + App.esc(PHASES[mark.key].name) +
          '</span> <span class="cal__time">' + App.esc(fmtHM.format(when)) + '</span></span>' : '') +
        '<span class="visually-hidden">' + App.esc(sr) + '</span></td>');
    }
    while (cells.length % 7) cells.push('<td class="cal__pad"></td>');
    var rows = [];
    for (var r = 0; r < cells.length; r += 7) rows.push('<tr>' + cells.slice(r, r + 7).join('') + '</tr>');
    el.calBody.innerHTML = rows.join('');

    var label = fmtMonth.format(first);
    el.calMonth.textContent = label;
    el.calCaption.textContent = 'Fase Bulan setiap hari, ' + label;
    el.calPrev.innerHTML = '<span aria-hidden="true">‹</span> <span class="visually-hidden">Kalender </span>' + App.esc(fmtMonth.format(prevMonth));
    el.calNext.innerHTML = '<span class="visually-hidden">Kalender </span>' + App.esc(fmtMonth.format(nextMonth)) + ' <span aria-hidden="true">›</span>';
    setDisabled(el.calPrev, prevMonth < MIN, el.calNext);
    setDisabled(el.calNext, nextMonth > MAX, el.calPrev);
  }

  function moveMonth(n) {
    var c = new Date(state.cal.y, state.cal.m + n, 1);
    state.cal = { y: c.getFullYear(), m: c.getMonth() };
    renderCalendar();
  }

  /* ---------- Teks penjelasan dari data ---------- */

  function fillExplanations() {
    var sid = C.SIDEREAL_MONTH_DAYS, syn = C.SYNODIC_MONTH_DAYS;
    var values = {
      sidereal: App.fmt(sid, 2),
      synodic: App.fmt(syn, 2),
      gap: App.fmt(syn - sid, 1),
      // Sudut yang ditempuh Bumi di orbitnya selama satu bulan sideris.
      shift: App.fmt(360 * sid / C.SIDEREAL_YEAR_DAYS, 0),
      rotation: App.fmt(MOON.rotation_period_h === null ? null : MOON.rotation_period_h / 24, 2)
    };
    Array.prototype.forEach.call(document.querySelectorAll('[data-fill]'), function (s) {
      s.textContent = values[s.getAttribute('data-fill')];
    });
    if (data.moonPhaseNote) el.note.textContent = data.moonPhaseNote;
    else el.note.hidden = true;
  }

  /* ---------- Awal ---------- */

  function init() {
    fillExplanations();

    el.date.addEventListener('input', readInputs);
    el.time.addEventListener('input', readInputs);
    el.prevDay.addEventListener('click', function () { setDate(shiftDays(state.date, -1), 'step'); });
    el.nextDay.addEventListener('click', function () { setDate(shiftDays(state.date, 1), 'step'); });
    el.now.addEventListener('click', function () { setDate(nowMinute(), 'now'); });
    el.slider.addEventListener('input', function () {
      setDate(Astro.dateFromJd(state.lun.start + Number(el.slider.value)), 'slider');
    });
    el.calPrev.addEventListener('click', function () { moveMonth(-1); });
    el.calNext.addEventListener('click', function () { moveMonth(1); });

    var queued = false;
    window.addEventListener('resize', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        drawMoon(state.phase);
        drawOrbit(state.phase);
      });
    });

    setDate(nowMinute(), 'init');
  }

  function fail(message) {
    disable();
    $('phase-name').parentNode.appendChild(App.showError(viewer, message));
  }

  if (!MOON || !EARTH || !SUN || ORDER.some(function (k) { return !PHASES[k]; })) {
    fail('Data Bulan atau nama fase Bulan di js/data.js tidak lengkap. Pastikan berkas itu utuh, lalu muat ulang halaman.');
    return;
  }
  try {
    init();
  } catch (err) {
    console.error(err);
    fail('Perhitungan fase Bulan gagal di browser ini. Muat ulang halaman; bila masih gagal, buka dengan versi terbaru Chrome, Firefox, Edge, atau Safari.');
  }
})();
