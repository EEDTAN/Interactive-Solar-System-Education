/*
 * common.js: fungsi bersama untuk semua halaman.
 * Dipanggil setelah js/data.js dan js/astro.js. Semua fungsi tersedia lewat objek global App.
 */
(function () {
  'use strict';

  var data = window.SOLAR_DATA || null;
  var byId = Object.create(null);
  if (data) data.bodies.forEach(function (b) { byId[b.id] = b; });

  /* ---------- Menu navigasi (layar sempit) ---------- */

  function initMenu() {
    var header = document.querySelector('.site-header');
    var toggle = header && header.querySelector('.nav-toggle');
    if (!toggle) return;
    function setOpen(open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
    });
    // Tab keluar dari menu menutupnya, supaya panel tidak menutupi elemen yang sedang difokus.
    header.addEventListener('focusout', function (e) {
      if (header.classList.contains('is-open') && e.relatedTarget && !header.contains(e.relatedTarget)) setOpen(false);
    });
  }

  /* ---------- Format angka, waktu, dan teks (bahasa Indonesia) ---------- */

  var formats = {};
  function numberFormat(max, min) {
    var key = max + ':' + min;
    if (!formats[key]) {
      formats[key] = new Intl.NumberFormat('id-ID', { maximumFractionDigits: max, minimumFractionDigits: min });
    }
    return formats[key];
  }

  // fmt(1391400) -> "1.391.400"; fmt(0.387, 2) -> "0,39"
  function fmt(n, max, min) {
    if (n === null || n === undefined || isNaN(n)) return '?';
    max = max === undefined ? 1 : max;
    var s = numberFormat(max, Math.min(min || 0, max)).format(n);
    return /^-0(,0+)?$/.test(s) ? s.slice(1) : s; // -0,04 dibulatkan menjadi "0", bukan "-0"
  }

  var SUPERSCRIPT = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };

  // fmtSci(6.42e23) -> "6,42 × 10²³"
  function fmtSci(x, digits) {
    if (x === null || x === undefined || !isFinite(x)) return '?';
    if (x === 0) return '0';
    digits = digits === undefined ? 2 : digits;
    var parts = Number(x).toExponential(digits).split('e'); // "6.42e+23": mantisa sudah dibulatkan
    var exp = Number(parts[1]);
    var sup = String(exp).split('').map(function (c) { return SUPERSCRIPT[c]; }).join('');
    return fmt(Number(parts[0]), digits, digits) + ' × 10' + sup;
  }

  // fmtDuration(499) -> "8 menit 19 detik"
  function fmtDuration(seconds) {
    if (seconds === null || seconds < 0 || !isFinite(seconds)) return '?';
    var s = Number(seconds);
    var MIN = 60, HOUR = 3600, DAY = 86400, YEAR = 365.25 * DAY;
    // Batas satuan memakai nilai setelah pembulatan: 59,6 detik menjadi "1 menit", bukan "60 detik".
    if (s < MIN - 0.5) return fmt(s, s < 10 ? 1 : 0) + ' detik';
    if (s < HOUR - 0.5) {
      var m = Math.floor(s / MIN), sec = Math.round(s % MIN);
      if (sec === 60) { m += 1; sec = 0; }
      return m + ' menit' + (sec ? ' ' + sec + ' detik' : '');
    }
    if (s < DAY - 30) {
      var h = Math.floor(s / HOUR), mi = Math.round((s % HOUR) / MIN);
      if (mi === 60) { h += 1; mi = 0; }
      return h + ' jam' + (mi ? ' ' + mi + ' menit' : '');
    }
    if (s < 2 * YEAR) return fmt(s / DAY, s < 10 * DAY ? 1 : 0) + ' hari';
    return fmt(s / YEAR, s < 100 * YEAR ? 1 : 0) + ' tahun';
  }

  var dateFormat = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  var timeFormat = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

  // fmtDate(date) -> "14 Oktober 2026"
  // Tanggal tidak sah (null, undefined, Invalid Date) menjadi "?", bukan 1 Januari 1970 atau hari ini.
  function isDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  function fmtDate(date) {
    return isDate(date) ? dateFormat.format(date) : '?';
  }

  // fmtDateTime(date) -> "14 Oktober 2026, 17.05 WIB" (zona waktu perangkat)
  function fmtDateTime(date) {
    return isDate(date) ? dateFormat.format(date) + ', ' + timeFormat.format(date) : '?';
  }

  // Tanggal lokal ke "YYYY-MM-DD" untuk <input type="date">.
  function toInputDate(date) {
    var y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
    return String(y).padStart(4, '0') + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  }

  // "YYYY-MM-DD" ke Date pada jam lokal tertentu (bawaan 00.00; boleh pecahan, 17.5 = 17.30).
  // Hasil null bila tidak sah, termasuk tanggal yang tidak ada seperti 2026-02-31.
  function fromInputDate(value, hours) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (!m) return null;
    var y = Number(m[1]), mo = Number(m[2]) - 1, d = Number(m[3]);
    var date = new Date(y, mo, d, 0, Math.round((hours || 0) * 60), 0);
    date.setFullYear(y, mo, d); // tahun < 100 tidak boleh digeser ke 19xx
    return date.getMonth() === mo && date.getDate() === d ? date : null;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Data ---------- */

  function body(id) {
    return byId[id] || null;
  }

  // Semua benda (urut dari Matahari ke luar), bisa disaring: bodies(function (b) { ... })
  function bodies(filter) {
    if (!data) return [];
    return filter ? data.bodies.filter(filter) : data.bodies.slice();
  }

  // Delapan planet saja.
  function planets() {
    return bodies(function (b) {
      return b.type === 'terrestrial' || b.type === 'gas_giant' || b.type === 'ice_giant';
    });
  }

  // Sumbu semi-mayor (SA) benda yang mengelilingi Matahari; null bila tidak ada.
  function semiMajorAU(b) {
    if (b.orbit) return b.orbit.a_au;
    if (b.parent === 'sun' && b.distance_million_km) return b.distance_million_km * 1e6 / Astro.AU_KM;
    return null;
  }

  /* ---------- Penyimpanan lokal (aman bila diblokir browser) ---------- */

  var store = {
    get: function (key, fallback) {
      try {
        var v = localStorage.getItem('iss:' + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem('iss:' + key, JSON.stringify(value));
      } catch (e) { /* mode privat atau penyimpanan penuh: abaikan */ }
    }
  };

  /* ---------- Keadaan galat ---------- */

  function showError(container, message) {
    var box = document.createElement('div');
    box.className = 'notice notice--error';
    box.setAttribute('role', 'alert');
    box.innerHTML = '<strong>Ada masalah.</strong> ' + esc(message);
    container.prepend(box);
    return box;
  }

  /* ---------- Menggambar benda langit di kanvas ---------- */

  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function shade(hex, amount) {
    var c = hexToRgb(hex).map(function (v) {
      return Math.max(0, Math.min(255, Math.round(amount < 0 ? v * (1 + amount) : v + (255 - v) * amount)));
    });
    return 'rgb(' + c.join(',') + ')';
  }

  // Cincin Saturnus sebagai elips datar. front = gambar separuh depan (setelah bola).
  function drawRing(ctx, x, y, r, tilt, front) {
    var inner = r * 1.24, outer = r * 2.27;
    ctx.save();
    ctx.beginPath();
    if (front) ctx.rect(x - outer - 2, y, outer * 2 + 4, outer + 2);
    else ctx.rect(x - outer - 2, y - outer - 2, outer * 2 + 4, outer + 2);
    ctx.clip();
    ctx.beginPath();
    ctx.ellipse(x, y, outer, outer * tilt, 0, 0, Math.PI * 2);
    ctx.ellipse(x, y, inner, inner * tilt, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(226, 207, 150, 0.55)';
    ctx.fill('evenodd');
    ctx.restore();
  }

  // Gambar benda bulat berbayang di (x, y) dengan jari-jari r piksel.
  // opts.light: arah datangnya cahaya Matahari di layar (radian), bawaan dari kiri.
  // opts.ring: false untuk menyembunyikan cincin Saturnus; opts.ringTilt: rasio elips cincin.
  function drawBody(ctx, b, x, y, r, opts) {
    opts = opts || {};
    // Jari-jari tidak sah (misalnya titik di belakang kamera) tidak digambar; galat di tengah
    // save()/clip() akan membuat kanvas terpotong untuk semua gambar sesudahnya.
    if (!(r > 0) || !isFinite(r) || !isFinite(x) || !isFinite(y)) return;
    var color = b.color || '#999999';
    if (b.id === 'sun') {
      var glow = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 2.4);
      glow.addColorStop(0, 'rgba(255, 214, 120, 0.9)');
      glow.addColorStop(0.42, 'rgba(255, 170, 60, 0.35)');
      glow.addColorStop(1, 'rgba(255, 140, 40, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, r * 2.4, 0, Math.PI * 2);
      ctx.fill();
      var disk = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, 0, x, y, r);
      disk.addColorStop(0, '#fff7dc');
      disk.addColorStop(0.6, '#ffd36b');
      disk.addColorStop(1, '#ffad33');
      ctx.fillStyle = disk;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    var light = isFinite(opts.light) && opts.light !== null ? opts.light : Math.PI;
    var ringed = b.id === 'saturn' && opts.ring !== false && r >= 2;
    var tilt = Math.min(1, Math.abs(isFinite(opts.ringTilt) && opts.ringTilt !== null ? opts.ringTilt : 0.32)); // dilihat dari bawah bidang cincin: tilt negatif
    if (ringed) drawRing(ctx, x, y, r, tilt, false);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, Math.max(r, 0.6), 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    if (r >= 4) {
      ctx.clip();
      // Pita awan raksasa gas.
      if (b.id === 'jupiter' || b.id === 'saturn') {
        var bands = b.id === 'jupiter' ? [-0.62, -0.3, 0.05, 0.38, 0.66] : [-0.5, -0.12, 0.3];
        bands.forEach(function (p, i) {
          ctx.fillStyle = shade(color, i % 2 ? -0.18 : 0.12);
          ctx.fillRect(x - r, y + p * r - r * 0.07, r * 2, r * 0.14);
        });
      }
      // Bayangan: sisi yang menghadap Matahari terang, sisi lain gelap.
      var lx = Math.cos(light), ly = Math.sin(light);
      var g = ctx.createRadialGradient(x + lx * r * 0.5, y + ly * r * 0.5, r * 0.05, x + lx * r * 0.2, y + ly * r * 0.2, r * 1.35);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
      g.addColorStop(0.45, 'rgba(0, 0, 0, 0)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0.82)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    ctx.restore();
    if (ringed) drawRing(ctx, x, y, r, tilt, true);
  }

  // Siapkan kanvas tajam di layar resolusi tinggi. Kembalikan {ctx, w, h} dalam piksel CSS.
  function fitCanvas(canvas) {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  /* ---------- Penggaris SA (motif identitas) ---------- */

  // Garis jarak dari Matahari berskala logaritmik (tiap garis besar 10 kali lebih jauh).
  // opts.highlight: id benda yang disorot (pita perihelion-aphelion ikut digambar).
  // opts.link: titik menjadi tautan ke ensiklopedia.
  function ruler(container, opts) {
    opts = opts || {};
    var W = 640, H = 78, left = 56, right = 24, axisY = 44;
    var minA = 0.25, maxA = 100;
    var span = Math.log10(maxA) - Math.log10(minA);
    function x(a) {
      var c = Math.min(maxA, Math.max(minA, a));
      return left + (Math.log10(c) - Math.log10(minA)) / span * (W - left - right);
    }
    // Nama benda di dua baris di atas garis; di bawah garis hanya label skala (1, 10, 100 SA).
    // Nama yang tidak muat di kedua baris dilewati (tetap terbaca lewat title dan aria-label).
    var rows = [[], []];
    function labelRow(cx, name, bold, prefer) {
      var half = name.length * (bold ? 3.9 : 3.6) + 3; // perkiraan setengah lebar teks 12 px
      for (var i = 0; i < 2; i++) {
        var k = (prefer + i) % 2;
        if (rows[k].every(function (s) { return cx + half < s[0] || cx - half > s[1]; })) {
          rows[k].push([cx - half, cx + half]);
          return k;
        }
      }
      return -1;
    }
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('class', 'au-ruler');
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-label', 'Jarak rata-rata dari Matahari, skala logaritmik dalam satuan astronomi');

    var parts = [];
    parts.push('<circle cx="26" cy="' + axisY + '" r="10" fill="#ffc94d"></circle>');
    parts.push('<text x="26" y="' + (axisY + 28) + '" text-anchor="middle">Matahari</text>');
    parts.push('<line class="axis" x1="' + left + '" y1="' + axisY + '" x2="' + (W - right) + '" y2="' + axisY + '"></line>');
    [0.3, 0.5, 2, 3, 5, 20, 30, 50].forEach(function (a) {
      parts.push('<line class="tick" x1="' + x(a) + '" y1="' + (axisY - 3) + '" x2="' + x(a) + '" y2="' + (axisY + 3) + '"></line>');
    });
    [1, 10, 100].forEach(function (a) {
      parts.push('<line class="tick" x1="' + x(a) + '" y1="' + (axisY - 7) + '" x2="' + x(a) + '" y2="' + (axisY + 7) + '"></line>');
      parts.push('<text x="' + x(a) + '" y="' + (axisY + 24) + '" text-anchor="middle">' + a + ' SA</text>');
    });

    var hl = opts.highlight ? body(opts.highlight) : null;
    if (hl && hl.perihelion_million_km && hl.aphelion_million_km && hl.parent === 'sun') {
      var q = hl.perihelion_million_km * 1e6 / Astro.AU_KM, Q = hl.aphelion_million_km * 1e6 / Astro.AU_KM;
      parts.push('<rect x="' + x(q) + '" y="' + (axisY - 2) + '" width="' + Math.max(2, x(Q) - x(q)) +
        '" height="4" rx="2" fill="#ffb547" opacity="0.55"><title>Jarak terdekat ' + fmt(q, 2) +
        ' SA, terjauh ' + fmt(Q, 2) + ' SA</title></rect>');
    }

    var hlRow = hl && hl.parent === 'sun' && semiMajorAU(hl) ? labelRow(x(semiMajorAU(hl)), hl.name, true, 0) : -1;
    var labelled = 0;
    // Urut dari dekat ke jauh, supaya urutan Tab sama dengan urutan titik dari kiri ke kanan.
    var list = bodies(function (b) { return b.parent === 'sun' && semiMajorAU(b); })
      .sort(function (p, q) { return semiMajorAU(p) - semiMajorAU(q); });
    var xs = list.map(function (b) { return x(semiMajorAU(b)); });
    list.forEach(function (b, i) {
      var a = semiMajorAU(b);
      var isHl = hl && hl.id === b.id;
      var isPlanet = b.type === 'terrestrial' || b.type === 'gas_giant' || b.type === 'ice_giant';
      var cx = xs[i];
      // Area klik tidak boleh menutupi titik tetangga (Uranus dan Komet Halley hanya 6 satuan berjarak).
      var hitR = 9;
      xs.forEach(function (v, j) { if (j !== i) hitR = Math.min(hitR, Math.abs(v - cx) / 2); });
      var label = esc(b.name) + ', ' + fmt(a, a < 10 ? 2 : 1, a < 10 ? 2 : 1) + ' SA';
      var dot = '<circle cx="' + cx + '" cy="' + axisY + '" r="' + (isHl ? 6 : 4) + '" fill="' + b.color + '"' +
        (isHl ? ' stroke="#ffb547" stroke-width="2"' : '') + '></circle>' +
        '<circle class="hit" cx="' + cx + '" cy="' + axisY + '" r="' + hitR + '" fill="transparent"></circle>';
      var row = isHl ? hlRow : (isPlanet ? labelRow(cx, b.name, false, labelled++ % 2) : -1);
      var text = row < 0 ? '' : '<text x="' + cx + '" y="' + (axisY - 12 - 16 * row) + '" text-anchor="middle">' + esc(b.name) + '</text>';
      var inner = '<title>' + label + '</title>' + dot + text;
      if (opts.link) {
        parts.push('<a href="ensiklopedia.html#' + b.id + '" aria-label="' + label + '" class="' + (isHl ? 'is-hl' : '') + '">' + inner + '</a>');
      } else {
        parts.push('<g class="' + (isHl ? 'is-hl' : '') + '">' + inner + '</g>');
      }
    });

    svg.innerHTML = parts.join('');
    container.innerHTML = '';
    container.classList.add('au-ruler-box'); // di layar sempit kotak ini yang digeser, bukan halaman
    container.appendChild(svg);
    return svg;
  }

  /* ---------- Awal ---------- */

  window.App = {
    data: data,
    body: body,
    bodies: bodies,
    planets: planets,
    semiMajorAU: semiMajorAU,
    fmt: fmt,
    fmtSci: fmtSci,
    fmtDuration: fmtDuration,
    fmtDate: fmtDate,
    fmtDateTime: fmtDateTime,
    toInputDate: toInputDate,
    fromInputDate: fromInputDate,
    esc: esc,
    store: store,
    showError: showError,
    drawBody: drawBody,
    fitCanvas: fitCanvas,
    ruler: ruler
  };

  initMenu();

  if (!data || !window.Astro) {
    var main = document.querySelector('main');
    if (main) {
      var holder = document.createElement('div'); // .wrap memberi jarak tepi yang sama dengan isi halaman
      holder.className = 'wrap';
      main.prepend(holder);
      showError(holder, 'Data aplikasi tidak termuat. Pastikan berkas js/data.js dan js/astro.js ada, lalu muat ulang halaman.');
    }
  }
})();
