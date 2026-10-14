/*
 * bandingkan.js: halaman Bandingkan.
 * 1. Deretan ukuran sebenarnya (kanvas), 2. dua benda berdampingan dengan kalimat perbandingan,
 * 3. grafik batang (DOM), 4. tabel data yang bisa diurutkan.
 */
(function () {
  'use strict';

  // Bila data tidak termuat, common.js sudah menampilkan pesan galat di halaman.
  if (!window.App || !App.data || !window.Astro) return;

  var fmt = App.fmt;
  var esc = App.esc;
  var EARTH = App.body('earth');
  var YEAR_DAYS = App.data.constants.SIDEREAL_YEAR_DAYS;
  var FONT = getComputedStyle(document.body).fontFamily;
  var rootStyle = getComputedStyle(document.documentElement);
  var INK = {
    text: rootStyle.getPropertyValue('--text').trim(),
    muted: rootStyle.getPropertyValue('--text-muted').trim(),
    lead: rootStyle.getPropertyValue('--line-strong').trim(),
    onSun: rootStyle.getPropertyValue('--accent-ink').trim()
  };
  // Tepi luar cincin A Saturnus sekitar 2,27 kali jari-jari planetnya (sama dengan cincin di App.drawBody).
  var RING = 2.27;
  // Besaran yang tidak berlaku untuk Matahari, dan besaran yang diukur terhadap Matahari.
  var NOT_FOR_SUN = /^(distance_million_km|orbital_period_days|day_length_h|moons)$/;
  var AROUND_SUN = /^(distance_million_km|orbital_period_days)$/;

  function $(id) { return document.getElementById(id); }
  function has(v) { return typeof v === 'number' && !isNaN(v); }
  function isPlanet(b) { return b.type === 'terrestrial' || b.type === 'gas_giant' || b.type === 'ice_giant'; }
  function isGiant(b) { return b.type === 'gas_giant' || b.type === 'ice_giant'; }
  function nameOf(b) { return b.name; }
  // Huruf kecil hanya di awal, agar "Jarak dari Matahari" tidak menjadi "jarak dari matahari".
  function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  var NB = String.fromCharCode(160); // spasi tak terputus: angka dan satuannya tidak terpisah baris
  function km(v) { return fmt(v, 0) + NB + 'km'; }
  // Satu desimal minimal agar 9,0 tidak tampil sebagai 9 di samping 8,7.
  function dec(v) { return fmt(v, 2, 1); }

  // Jarak dan periode Bulan di data diukur terhadap Bumi, jadi tidak dipakai sebagai nilai "dari Matahari".
  function usable(b, field) {
    return has(b[field]) && !(AROUND_SUN.test(field) && b.parent !== 'sun');
  }

  // Tidak berlaku (bukan tidak diketahui): orbit dan hari untuk Matahari, jumlah bulan untuk satelit alami.
  function notApplicable(b, field) {
    return (b.id === 'sun' && NOT_FOR_SUN.test(field)) || (b.type === 'moon' && field === 'moons');
  }

  // ['a', 'b', 'c'] -> 'a, b, dan c'
  function joinList(items) {
    if (items.length < 3) return items.join(' dan ');
    return items.slice(0, -1).join(', ') + ', dan ' + items[items.length - 1];
  }

  // Rasio dengan dua angka penting untuk nilai di bawah 1: 0,53; 0,0092; 1,88; 11,2; 109.
  function fmtRatio(x) {
    if (x >= 100) return fmt(x, 0);
    if (x >= 10) return fmt(x, 1);
    if (x >= 1) return fmt(x, 2);
    return fmt(x, Math.max(2, Math.ceil(-Math.log10(x)) + 1));
  }

  // Banyak angka penting seperti tertulis di data, agar massa tidak tampil lebih teliti dari sumbernya.
  function sigDigits(v) {
    var s = String(Math.abs(v)).split('e')[0];
    var digits = s.replace('.', '').replace(/^0+/, '');
    if (s.indexOf('.') < 0) digits = digits.replace(/0+$/, '');
    return Math.max(1, digits.length);
  }

  function massSci(v) { return App.fmtSci(v * 1e24, Math.max(0, sigDigits(v) - 1)); }

  function fmtCell(v) {
    var a = Math.abs(v);
    return fmt(v, a >= 100 ? 1 : a >= 1 ? 2 : 3);
  }

  function asOfText(b) {
    var d = b && b.moons_as_of ? App.fromInputDate(b.moons_as_of) : null;
    return d ? App.fmtDate(d) : '';
  }

  var MOONS_DATE = asOfText(EARTH);

  function onResize(fn) {
    var frame = 0;
    window.addEventListener('resize', function () {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fn);
    });
  }

  // Bola berbayang dari App.drawBody. Pendar Matahari dipotong agar tepinya tetap di ukuran sebenarnya.
  function drawSphere(ctx, b, x, y, r) {
    if (b.id !== 'sun') {
      App.drawBody(ctx, b, x, y, r);
      return;
    }
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();
    App.drawBody(ctx, b, x, y, r);
    ctx.restore();
  }

  /* 1. Ukuran sebenarnya */

  function initLineup() {
    var canvas = $('lineup-canvas');
    var scroller = $('lineup-scroll');
    var extra = $('lineup-extra');
    var hint = $('lineup-hint');
    var list = $('lineup-list');
    var note = $('lineup-note');
    var sun = App.body('sun');
    var jupiter = App.body('jupiter');

    var JUPITER_PX = 140;  // diameter Jupiter di gambar; benda lain mengikuti skala yang sama
    var SUN_VISIBLE = 104; // lebar bagian Matahari yang terlihat di garis tengah
    var GAP = 22, TOP = 18, RIGHT = 22, LABEL_GAP = 24, LINE = 17, BOTTOM = 12;
    var FONT_NAME = '600 13px ' + FONT;
    var FONT_SMALL = '12px ' + FONT;
    var measure = document.createElement('canvas').getContext('2d');

    function textWidth(text, font) {
      measure.font = font;
      return measure.measureText(text).width;
    }

    function members() {
      return App.bodies(function (b) {
        if (!has(b.diameter_km)) return false;
        return isPlanet(b) || (extra.checked && (b.id === 'moon' || b.id === 'ceres' || b.id === 'pluto'));
      });
    }

    function updateScroll() {
      var over = scroller.scrollWidth > scroller.clientWidth + 1;
      hint.hidden = !over;
      // Wadah yang bisa digeser harus bisa difokus agar bisa digeser dengan tombol panah.
      if (over) scroller.setAttribute('tabindex', '0');
      else scroller.removeAttribute('tabindex');
    }

    function draw() {
      var bodies = members();
      var s = JUPITER_PX / jupiter.diameter_km; // piksel per km, satu skala untuk semua benda
      var x = SUN_VISIBLE + GAP + 6;
      var items = bodies.map(function (b) {
        var r = b.diameter_km / 2 * s;
        var half = b.id === 'saturn' ? r * RING : r;
        var slot = Math.max(2 * half, textWidth(b.name, FONT_NAME), textWidth(km(b.diameter_km), FONT_SMALL));
        var item = { b: b, r: r, x: x + slot / 2 };
        x += slot + GAP;
        return item;
      });
      var rMax = JUPITER_PX / 2;
      var y0 = TOP + rMax;
      var y1 = y0 + rMax + LABEL_GAP;
      var y2 = y1 + LINE;

      canvas.style.width = Math.ceil(x - GAP + RIGHT) + 'px';
      canvas.style.height = Math.ceil(y2 + BOTTOM) + 'px';
      var fit = App.fitCanvas(canvas);
      var ctx = fit.ctx;
      ctx.clearRect(0, 0, fit.w, fit.h);

      // Pusat Matahari jauh di kiri luar kanvas; yang terlihat hanya tepinya.
      var R = sun.diameter_km / 2 * s;
      drawSphere(ctx, sun, SUN_VISIBLE - R, y0, R);
      ctx.textAlign = 'left';
      ctx.fillStyle = INK.onSun;
      ctx.font = FONT_NAME;
      ctx.fillText(sun.name, 10, y1);
      ctx.font = FONT_SMALL;
      ctx.fillText(km(sun.diameter_km), 10, y2);

      ctx.textAlign = 'center';
      ctx.lineWidth = 1;
      items.forEach(function (it) {
        drawSphere(ctx, it.b, it.x, y0, it.r);
        var from = y0 + it.r + 5, to = y1 - 15;
        if (to - from > 6) {
          ctx.strokeStyle = INK.lead;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.moveTo(Math.round(it.x) + 0.5, from);
          ctx.lineTo(Math.round(it.x) + 0.5, to);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = INK.text;
        ctx.font = FONT_NAME;
        ctx.fillText(it.b.name, it.x, y1);
        ctx.fillStyle = INK.muted;
        ctx.font = FONT_SMALL;
        ctx.fillText(km(it.b.diameter_km), it.x, y2);
      });

      var biggest = bodies.reduce(function (m, b) { return b.diameter_km > m.diameter_km ? b : m; });
      var smallest = bodies.reduce(function (m, b) { return b.diameter_km < m.diameter_km ? b : m; });
      canvas.setAttribute('aria-label', 'Tepi Matahari dan ' + joinList(bodies.map(nameOf)) +
        ' digambar berjajar dengan skala ukuran yang sama. Setelah Matahari, ' + biggest.name + ' paling besar dan ' +
        smallest.name + ' paling kecil. Jarak antarbenda tidak berskala. Daftar diameternya ada setelah gambar ini.');
      list.innerHTML = [sun].concat(bodies).map(function (b) {
        var t = b.name + ': diameter ' + km(b.diameter_km);
        if (b.id !== 'earth') t += ', ' + fmtRatio(b.diameter_km / EARTH.diameter_km) + ' kali diameter Bumi';
        return '<li>' + esc(t) + '</li>';
      }).join('');
      note.textContent = 'Lengkungan di kiri adalah tepi Matahari. Diameternya ' +
        fmtRatio(sun.diameter_km / EARTH.diameter_km) + ' kali diameter Bumi dan ' +
        fmtRatio(sun.diameter_km / jupiter.diameter_km) + ' kali diameter Jupiter, jadi hanya tepinya yang muat di gambar.';
      updateScroll();
    }

    extra.addEventListener('change', draw);
    onResize(draw);
    draw();
  }

  /* 2. Bandingkan dua benda */

  var TYPE_ORDER = ['star', 'terrestrial', 'gas_giant', 'ice_giant', 'moon', 'dwarf', 'comet'];

  function fillSelect(select) {
    TYPE_ORDER.forEach(function (type) {
      var group = App.bodies(function (b) { return b.type === type; });
      if (!group.length) return;
      var og = document.createElement('optgroup');
      og.label = group[0].category;
      group.forEach(function (b) { og.appendChild(new Option(b.name, b.id)); });
      select.appendChild(og);
    });
  }

  // "Diameter Bumi 1,88 kali diameter Mars (12.756 km dibanding 6.792 km)."
  function ratioSentence(subject, object, x, y, tx, ty) {
    if (x === y) return subject + ' sama dengan ' + object + ' (keduanya ' + tx + ').';
    var r = fmtRatio(x / y);
    var how = r === '1' ? 'hampir sama dengan' : r + ' kali';
    return subject + ' ' + how + ' ' + object + ' (' + tx + ' dibanding ' + ty + ').';
  }

  // Dua durasi dalam satuan yang sama: jam bila keduanya pendek, hari bila salah satunya panjang.
  function hoursPair(a, b) {
    var inDays = Math.max(a, b) >= 48;
    return [a, b].map(function (h) { return inDays ? fmt(h / 24, h < 24 ? 2 : 1) + NB + 'hari' : fmt(h, 1) + NB + 'jam'; });
  }

  function daysPair(a, b) {
    var inYears = Math.max(a, b) >= 2 * YEAR_DAYS;
    return [a, b].map(function (d) {
      if (!inYears) return fmt(d, 1) + NB + 'hari';
      var y = d / YEAR_DAYS;
      return fmt(y, y < 10 ? 2 : 1) + NB + 'tahun';
    });
  }

  function moonSentence(a, b) {
    var na = a.moons, nb = b.moons, date = asOfText(a) || asOfText(b);
    var s;
    if (na === nb) {
      s = a.name + ' dan ' + b.name + ' sama-sama ' + (na === 0 ? 'tidak punya satelit alami' : 'punya ' + fmt(na, 0) + ' satelit alami');
    } else {
      s = (na === 0 ? a.name + ' tidak punya satelit alami' : a.name + ' punya ' + fmt(na, 0) + ' satelit alami') +
        ', sedangkan ' + b.name + (nb === 0 ? ' tidak punya' : ' punya ' + fmt(nb, 0));
    }
    return s + (date ? ' (data per ' + date + ').' : '.');
  }

  // Kenapa sebuah besaran tidak dibandingkan: tidak berlaku, diukur terhadap planet induk, atau datanya kosong.
  function skipReason(lacking, field) {
    var sun = lacking.filter(function (b) { return b.id === 'sun'; })[0];
    if (sun && NOT_FOR_SUN.test(field)) return 'tidak berlaku untuk ' + sun.name;
    var moon = lacking.filter(function (b) { return b.type === 'moon'; })[0];
    var parent = moon && App.body(moon.parent);
    if (moon && field === 'moons') return moon.name + ' sendiri adalah satelit alami ' + parent.name;
    if (moon && AROUND_SUN.test(field) && has(moon[field])) return 'data ' + moon.name + ' diukur terhadap ' + parent.name;
    return 'data ' + joinList(lacking.map(nameOf)) + ' tidak ada';
  }

  function comparison(a, b) {
    var lines = [], skipped = {}, order = [];
    function ok(field) { return usable(a, field) && usable(b, field); }
    function skip(what, field) {
      var why = skipReason([a, b].filter(function (x) { return !usable(x, field); }), field);
      if (!skipped[why]) { skipped[why] = []; order.push(why); }
      skipped[why].push(what);
    }

    if (ok('diameter_km')) {
      lines.push(ratioSentence('Diameter ' + a.name, 'diameter ' + b.name, a.diameter_km, b.diameter_km, km(a.diameter_km), km(b.diameter_km)));
    } else skip('diameter', 'diameter_km');

    if (ok('gravity_m_s2')) {
      lines.push(ratioSentence('Gravitasi permukaan ' + a.name, 'gravitasi permukaan ' + b.name, a.gravity_m_s2, b.gravity_m_s2,
        dec(a.gravity_m_s2) + NB + 'm/s²', dec(b.gravity_m_s2) + NB + 'm/s²'));
    } else skip('gravitasi', 'gravity_m_s2');

    if (ok('day_length_h')) {
      var d = hoursPair(a.day_length_h, b.day_length_h);
      lines.push(ratioSentence('Panjang satu hari di ' + a.name, 'panjang satu hari di ' + b.name, a.day_length_h, b.day_length_h, d[0], d[1]));
    } else if (ok('rotation_period_h')) {
      // Tanpa data panjang hari, yang dibandingkan periode rotasinya (arah putaran diabaikan).
      var ra = Math.abs(a.rotation_period_h), rb = Math.abs(b.rotation_period_h), r = hoursPair(ra, rb);
      lines.push(ratioSentence('Periode rotasi ' + a.name, 'periode rotasi ' + b.name, ra, rb, r[0], r[1]));
    } else skip('panjang hari', 'rotation_period_h');

    if (ok('orbital_period_days')) {
      var p = daysPair(a.orbital_period_days, b.orbital_period_days);
      lines.push(ratioSentence('Waktu ' + a.name + ' untuk sekali mengelilingi Matahari', 'waktu ' + b.name,
        a.orbital_period_days, b.orbital_period_days, p[0], p[1]));
    } else skip('periode orbit', 'orbital_period_days');

    if (ok('distance_million_km')) {
      var dist = function (v) { return fmt(v, v < 1000 ? 1 : 0) + NB + 'juta' + NB + 'km'; };
      lines.push(ratioSentence('Jarak rata-rata ' + a.name + ' dari Matahari', 'jarak rata-rata ' + b.name,
        a.distance_million_km, b.distance_million_km, dist(a.distance_million_km), dist(b.distance_million_km)));
    } else skip('jarak dari Matahari', 'distance_million_km');

    if (ok('mean_temperature_c')) {
      var ta = a.mean_temperature_c, tb = b.mean_temperature_c, diff = ta - tb;
      var deg = function (v) { return fmt(v, 0) + NB + '°C'; };
      lines.push(diff === 0
        ? 'Suhu rata-rata ' + a.name + ' sama dengan suhu rata-rata ' + b.name + ' (keduanya ' + deg(ta) + ').'
        : 'Suhu rata-rata ' + a.name + ' ' + deg(Math.abs(diff)) + ' lebih ' + (diff > 0 ? 'tinggi' : 'rendah') +
          ' daripada suhu rata-rata ' + b.name + ' (' + deg(ta) + ' dibanding ' + deg(tb) + ').');
    } else skip('suhu rata-rata', 'mean_temperature_c');

    if (ok('moons')) lines.push(moonSentence(a, b));
    else skip('jumlah satelit alami', 'moons');

    var notes = [];
    var giants = [a, b].filter(isGiant);
    if (giants.length) {
      notes.push(joinList(giants.map(nameOf)) + ' tidak punya permukaan padat, jadi gravitasi dan suhunya diukur pada lapisan atmosfer bertekanan 1' + NB + 'bar.');
    }
    if (a.id === 'sun' || b.id === 'sun') {
      notes.push('Permukaan Matahari yang dimaksud adalah fotosfer, lapisan yang memancarkan cahaya yang kita lihat.');
    }
    order.forEach(function (why) {
      notes.push('Tidak dibandingkan: ' + joinList(skipped[why]) + ', karena ' + why + '.');
    });
    return { lines: lines, notes: notes };
  }

  function initCompare() {
    var selA = $('pick-a');
    var selB = $('pick-b');
    var swap = $('swap');
    var msg = $('compare-msg');
    var canvas = $('compare-canvas');
    var caption = $('compare-caption');
    var list = $('compare-list');
    var notesEl = $('compare-notes');
    var current = null;
    var notice = null;

    fillSelect(selA);
    fillSelect(selB);

    // ?a=mars&b=earth dari tautan Ensiklopedia. Kode kosong atau tidak dikenal diganti Bumi atau Mars,
    // dipilih agar tidak sama dengan benda di kolom lainnya.
    var params = new URLSearchParams(location.search);
    var ids = App.bodies().map(function (b) { return b.id; }); // bukan App.body(): ?a=constructor lolos lewat prototipe objek
    var unknown = [];
    function fromUrl(key) {
      var id = params.get(key);
      if (!id) return null;
      if (ids.indexOf(id) >= 0) return id;
      unknown.push(id.slice(0, 40));
      return null;
    }
    var idA = fromUrl('a'), idB = fromUrl('b');
    idA = idA || (idB === 'earth' ? 'mars' : 'earth');
    idB = idB || (idA === 'mars' ? 'earth' : 'mars');
    selA.value = idA;
    selB.value = idB;
    if (unknown.length) {
      notice = App.showError(msg, 'Kode benda "' + unknown.join('" dan "') + '" pada alamat halaman tidak dikenal, jadi yang ditampilkan ' +
        App.body(selA.value).name + ' dan ' + App.body(selB.value).name + '. Pilih benda lain dari daftar di bawah.');
    }

    function draw(a, b) {
      var fit = App.fitCanvas(canvas), ctx = fit.ctx, w = fit.w, h = fit.h;
      ctx.clearRect(0, 0, w, h);
      var LABEL_H = 46, PAD = 14;
      var slot = w / 2, cy = (h - LABEL_H) / 2 + 6;
      var maxR = (h - LABEL_H) / 2 - PAD;
      var maxHalf = slot / 2 - PAD;
      // Satu skala untuk keduanya: benda terbesar (dengan cincin Saturnus) mengisi tempatnya.
      var s = Infinity;
      [a, b].forEach(function (x) {
        if (!has(x.diameter_km)) return;
        var rk = x.diameter_km / 2;
        s = Math.min(s, maxR / rk, maxHalf / (rk * (x.id === 'saturn' ? RING : 1)));
      });
      var tiny = [], unknownSize = [];
      ctx.textAlign = 'center';
      [a, b].forEach(function (x, i) {
        var cx = slot * i + slot / 2;
        if (has(x.diameter_km)) {
          var r = x.diameter_km / 2 * s;
          drawSphere(ctx, x, cx, cy, r);
          if (r < 2) {
            ctx.strokeStyle = INK.muted;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, 9, 0, Math.PI * 2);
            ctx.stroke();
            tiny.push(x.name);
          }
        } else {
          unknownSize.push(x.name);
        }
        ctx.fillStyle = INK.text;
        ctx.font = '600 14px ' + FONT;
        ctx.fillText(x.name, cx, h - LABEL_H + 18);
        ctx.fillStyle = INK.muted;
        ctx.font = '13px ' + FONT;
        ctx.fillText(has(x.diameter_km) ? km(x.diameter_km) : 'diameter tidak diketahui', cx, h - LABEL_H + 36);
      });

      function sizeOf(x) { return has(x.diameter_km) ? km(x.diameter_km) : 'tidak diketahui'; }
      canvas.setAttribute('aria-label', a.name + ' dan ' + b.name + ' digambar berdampingan dengan skala yang sama. Diameter ' +
        a.name + ' ' + sizeOf(a) + ', diameter ' + b.name + ' ' + sizeOf(b) + '.');
      var parts = [];
      if (unknownSize.length) {
        parts.push('Diameter ' + joinList(unknownSize) + ' tidak ada di data, jadi tidak digambar.');
      } else {
        parts.push('Keduanya digambar dengan skala yang sama.');
      }
      if (tiny.length) parts.push(joinList(tiny) + ' terlalu kecil untuk terlihat pada skala ini, jadi letaknya ditandai lingkaran tipis.');
      caption.textContent = parts.join(' ');
    }

    function update() {
      var a = App.body(selA.value), b = App.body(selB.value);
      if (!a || !b) return;
      current = [a, b];
      try {
        history.replaceState(null, '', '?a=' + encodeURIComponent(a.id) + '&b=' + encodeURIComponent(b.id) + location.hash);
      } catch (e) { /* sebagian browser menolak mengubah alamat berkas lokal; perbandingan tetap jalan */ }
      draw(a, b);
      if (a.id === b.id) {
        list.innerHTML = '<li>' + esc('Kamu memilih ' + a.name + ' di kedua kolom. Pilih benda lain di salah satu kolom untuk melihat perbandingannya.') + '</li>';
        notesEl.innerHTML = '';
        return;
      }
      var c = comparison(a, b);
      list.innerHTML = c.lines.length
        ? c.lines.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('')
        : '<li>' + esc('Data ' + a.name + ' dan ' + b.name + ' tidak cukup untuk dibandingkan. Pilih benda lain.') + '</li>';
      notesEl.innerHTML = c.notes.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    }

    function changed() {
      if (notice) { notice.remove(); notice = null; }
      update();
    }

    selA.addEventListener('change', changed);
    selB.addEventListener('change', changed);
    swap.addEventListener('click', function () {
      var t = selA.value;
      selA.value = selB.value;
      selB.value = t;
      changed();
    });
    onResize(function () { if (current) draw(current[0], current[1]); });
    update();
  }

  /* 3. Grafik */

  var LOG_MIN_SPREAD = 50;

  function years(b) { return has(b.orbital_period_days) ? b.orbital_period_days / YEAR_DAYS : null; }

  // Tiap besaran: judul berupa pertanyaan, catatan satuan, label di ujung batang, nilai tepat untuk keterangan.
  var PROPS = [
    {
      key: 'diameter_km', name: 'Diameter', unit: 'km',
      question: 'Seberapa besar diameter {set}?',
      note: 'Diameter dalam kilometer.',
      label: function (b) { return km(b.diameter_km); },
      exact: function (b) { return fmt(b.diameter_km, 1) + NB + 'km'; },
      vsEarth: 'diameter Bumi'
    },
    {
      key: 'mass_1e24_kg', name: 'Massa', unit: '× 10²⁴ kg',
      question: 'Berapa massa {set}?',
      note: 'Massa dalam kilogram. Angka di sumbu memakai satuan 10²⁴' + NB + 'kg.',
      label: function (b) { return App.fmtSci(b.mass_1e24_kg * 1e24, Math.min(2, sigDigits(b.mass_1e24_kg) - 1)) + NB + 'kg'; },
      exact: function (b) { return massSci(b.mass_1e24_kg) + NB + 'kg'; },
      vsEarth: 'massa Bumi'
    },
    {
      key: 'density_kg_m3', name: 'Massa jenis', unit: 'kg/m³',
      question: 'Seberapa padat {set}?',
      note: 'Massa jenis rata-rata (massa dibagi volume) dalam kg/m³.',
      label: function (b) { return fmt(b.density_kg_m3, 0) + NB + 'kg/m³'; },
      vsEarth: 'massa jenis Bumi'
    },
    {
      key: 'gravity_m_s2', name: 'Gravitasi', unit: 'm/s²',
      question: 'Seberapa besar gravitasi di permukaan {set}?',
      note: 'Percepatan gravitasi di permukaan dalam m/s². Raksasa gas dan es tidak punya permukaan padat, jadi nilainya diukur pada lapisan atmosfer bertekanan 1' + NB + 'bar.',
      label: function (b) { return dec(b.gravity_m_s2) + NB + 'm/s²'; },
      vsEarth: 'gravitasi Bumi'
    },
    {
      key: 'escape_velocity_km_s', name: 'Kecepatan lepas', unit: 'km/s',
      question: 'Seberapa cepat benda harus dilontarkan agar lepas dari {set}?',
      note: 'Kecepatan lepas dalam km/s: kecepatan awal terkecil agar benda yang dilontarkan dari permukaan tidak tertarik kembali, ' +
        'tanpa memperhitungkan hambatan udara. Untuk raksasa gas dan es, dihitung dari lapisan atmosfer bertekanan 1' + NB + 'bar.',
      label: function (b) { return dec(b.escape_velocity_km_s) + NB + 'km/s'; },
      vsEarth: 'kecepatan lepas Bumi'
    },
    {
      key: 'distance_million_km', name: 'Jarak dari Matahari', unit: 'juta km',
      question: 'Seberapa jauh {set} dari Matahari?',
      note: 'Jarak rata-rata dari Matahari dalam juta kilometer.',
      label: function (b) { var v = b.distance_million_km; return fmt(v, v < 1000 ? 1 : 0) + NB + 'juta' + NB + 'km'; },
      exact: function (b) { return fmt(b.distance_million_km, 2) + NB + 'juta' + NB + 'km'; },
      more: function (b) { return fmt(b.distance_million_km * 1e6 / Astro.AU_KM, 2) + NB + 'SA dari Matahari'; }
    },
    {
      key: 'orbital_period_days', name: 'Periode orbit', unit: 'tahun',
      value: years,
      question: 'Berapa lama {set} mengelilingi Matahari satu kali?',
      note: 'Periode orbit dalam tahun Bumi (1' + NB + 'tahun = ' + fmt(YEAR_DAYS, 3) + NB + 'hari).',
      label: function (b) { var y = years(b); return fmt(y, y < 10 ? 2 : 1) + NB + 'tahun'; },
      exact: function (b) { return fmt(b.orbital_period_days, 1) + NB + 'hari'; },
      more: function (b) { var y = years(b); return fmt(y, y < 10 ? 2 : 1) + NB + 'tahun Bumi'; }
    },
    {
      key: 'day_length_h', name: 'Panjang hari', unit: 'jam',
      question: 'Berapa lama satu hari di {set}?',
      note: 'Panjang satu hari matahari (dari tengah hari ke tengah hari berikutnya) dalam jam.',
      label: function (b) { return fmt(b.day_length_h, 1) + NB + 'jam'; },
      more: function (b) {
        var h = b.day_length_h;
        if (b.id === 'earth') return '';
        return h >= 48 ? 'sekitar ' + fmt(h / 24, 1) + NB + 'hari Bumi' : fmtRatio(h / EARTH.day_length_h) + ' kali panjang hari di Bumi';
      }
    },
    {
      key: 'mean_temperature_c', name: 'Suhu rata-rata', unit: '°C', min: -273.15, // nol mutlak
      question: 'Seberapa panas atau dingin {set}?',
      note: 'Suhu rata-rata dalam °C. Batang ke kanan berarti di atas 0' + NB + '°C, batang ke kiri di bawah 0' + NB +
        '°C. Untuk raksasa gas dan es, suhunya diukur pada lapisan bertekanan 1' + NB + 'bar.',
      label: function (b) { return fmt(b.mean_temperature_c, 0) + NB + '°C'; },
      more: function (b) {
        var d = b.mean_temperature_c - EARTH.mean_temperature_c;
        if (b.id === 'earth') return '';
        if (d === 0) return 'sama dengan Bumi';
        return fmt(Math.abs(d), 0) + NB + '°C lebih ' + (d > 0 ? 'panas' : 'dingin') + ' daripada Bumi';
      }
    },
    {
      key: 'moons', name: 'Jumlah bulan', unit: 'bulan',
      question: 'Berapa banyak bulan yang dimiliki {set}?',
      note: 'Jumlah bulan (satelit alami)' + (MOONS_DATE ? ', data per ' + MOONS_DATE : '') + '.',
      label: function (b) { return fmt(b.moons, 0); },
      exact: function (b) { return fmt(b.moons, 0) + NB + 'bulan'; }
    }
  ];

  function valueOf(p, b) {
    var v = p.value ? p.value(b) : b[p.key];
    return has(v) ? v : null;
  }

  function exactText(p, b) { return p.exact ? p.exact(b) : p.label(b); }

  function moreText(p, b, v) {
    if (p.more) return p.more(b);
    if (!p.vsEarth || b.id === 'earth') return '';
    var e = valueOf(p, EARTH);
    return e ? fmtRatio(v / e) + ' kali ' + p.vsEarth : '';
  }

  // Langkah garis bantu yang bulat: 1, 2, 2,5, atau 5 kali pangkat sepuluh.
  function niceStep(range, count) {
    var raw = range / count;
    var mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var f = raw / mag;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
  }

  // Skala: x(v) memberi posisi 0..1 di area batang; base = posisi titik awal batang.
  // floor: batas fisik sumbu (suhu tidak bisa di bawah nol mutlak), garis bantu tetap di kelipatan langkah.
  function makeScale(values, useLog, count, floor) {
    if (useLog) {
      var pos = values.filter(function (v) { return v > 0; });
      // Dimulai satu dekade di bawah nilai terkecil agar batang terpendek tetap terlihat.
      var e0 = Math.ceil(Math.log10(Math.min.apply(null, pos)) - 1e-9) - 1;
      var e1 = Math.ceil(Math.log10(Math.max.apply(null, pos)) - 1e-9);
      var ticks = [];
      for (var e = e0; e <= e1; e++) ticks.push(Number('1e' + e));
      return {
        x: function (v) { return v > 0 ? (Math.log10(v) - e0) / (e1 - e0) : null; },
        base: 0,
        ticks: ticks,
        log: true
      };
    }
    var lo = Math.min(0, Math.min.apply(null, values));
    var hi = Math.max(0, Math.max.apply(null, values));
    if (hi === lo) hi = lo + 1;
    var step = niceStep(hi - lo, count);
    lo = Math.max(Math.floor(lo / step) * step, floor === undefined ? -Infinity : floor);
    hi = Math.ceil(hi / step) * step;
    var list = [];
    for (var i = Math.ceil(lo / step - 1e-9); i * step <= hi + step / 2; i++) list.push(Number((i * step).toPrecision(12)));
    return {
      x: function (v) { return (v - lo) / (hi - lo); },
      base: (0 - lo) / (hi - lo),
      ticks: list,
      log: false
    };
  }

  // Posisi di dalam area batang, menyisakan ruang label --pl di kiri dan --pr di kanan.
  function at(f) {
    return 'var(--pl) + (100% - var(--pl) - var(--pr)) * ' + f.toFixed(5);
  }

  function initChart() {
    var figure = $('chart');
    var rowsEl = $('chart-rows');
    var ticksEl = $('chart-ticks');
    var tip = $('chart-tip');
    var propSel = $('chart-prop');
    var dwarfBox = $('chart-dwarf');
    var logBox = $('chart-log');
    var logHint = $('log-hint');
    var title = $('chart-title');
    var note = $('chart-note');
    var unitEl = $('chart-unit');
    var logNote = $('chart-lognote');
    var sortBtns = Array.prototype.slice.call(document.querySelectorAll('[data-sort]'));
    var measure = document.createElement('canvas').getContext('2d');
    var state = { prop: 3, dwarfs: false, sort: 'distance', log: false, selected: 'earth' };
    var rows = {}; // baris per id benda, dipakai ulang agar batang bergerak halus saat besaran berganti
    var narrowNow = null;

    PROPS.forEach(function (p, i) { propSel.appendChild(new Option(p.name, String(i))); });
    propSel.value = String(state.prop);

    function makeRow(b) {
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'bar-row';
      row.dataset.id = b.id;
      row.innerHTML = '<span class="bar-row__name"><span class="dot" style="--c:' + esc(b.color) + '" aria-hidden="true"></span>' +
        esc(b.name) + '</span><span class="bar-row__track"><span class="bar-row__grids"></span>' +
        '<span class="bar-row__bar"></span><span class="bar-row__value"></span></span>';
      return row;
    }

    // Bila label sumbu bertumpuk, tampilkan tiap label ke-n saja (label garis awal selalu tampil),
    // jadi jarak antarlabel tetap teratur, juga pada skala logaritmik.
    function thinTicks() {
      var ticks = ticksEl.querySelectorAll('.chart__tick');
      var base = Number(ticksEl.dataset.base) || 0;
      var boxes = [];
      ticks.forEach(function (el) {
        el.style.visibility = '';
        boxes.push(el.getBoundingClientRect());
      });
      var step = 1;
      for (; step < ticks.length; step++) {
        var last = -Infinity, fits = true;
        for (var i = 0; i < ticks.length && fits; i++) {
          if ((i - base) % step) continue;
          fits = boxes[i].left >= last + 8;
          last = boxes[i].right;
        }
        if (fits) break;
      }
      ticks.forEach(function (el, k) {
        if ((k - base) % step) el.style.visibility = 'hidden';
      });
    }

    function render() {
      var p = PROPS[state.prop];
      var items = App.bodies(function (b) { return isPlanet(b) || (state.dwarfs && b.type === 'dwarf'); })
        .map(function (b) { return { b: b, v: valueOf(p, b) }; });
      var values = items.filter(function (i) { return i.v !== null; }).map(function (i) { return i.v; });

      // Judul ada di wilayah aria-live; hanya diganti bila isinya berubah agar tidak dibacakan ulang saat diurutkan.
      var question = p.question.replace('{set}', state.dwarfs ? 'tiap planet dan planet kerdil' : 'tiap planet');
      if (title.textContent !== question) title.textContent = question;
      note.textContent = p.note;

      // Skala logaritmik hanya untuk nilai positif yang rentangnya besar. Batas 50 kali membuat jarak
      // planet (Merkurius ke Neptunus sekitar 78 kali) ikut tersedia bersama massa, periode, dan bulan.
      var positive = values.filter(function (v) { return v > 0; });
      var spread = positive.length > 1 ? Math.max.apply(null, positive) / Math.min.apply(null, positive) : 1;
      var negative = values.some(function (v) { return v < 0; });
      var logOk = !negative && spread > LOG_MIN_SPREAD;
      var useLog = logOk && state.log;
      logBox.disabled = !logOk;
      logBox.checked = useLog;
      if (negative) {
        logHint.textContent = 'Skala logaritmik tidak tersedia untuk ' + lower(p.name) + ' karena ada nilai di bawah nol.';
      } else if (logOk) {
        logHint.textContent = 'Nilai terbesar ' + fmtRatio(spread) + ' kali nilai terkecil, jadi skala logaritmik bisa membantu melihat nilai yang kecil.';
      } else {
        logHint.textContent = 'Skala logaritmik tidak tersedia: nilai terbesar hanya ' + fmtRatio(spread) +
          ' kali nilai terkecil. Skala ini dipakai bila bedanya lebih dari ' + LOG_MIN_SPREAD + ' kali.';
      }

      var empty = rowsEl.querySelector('.chart__empty');
      if (empty) empty.remove();
      if (!values.length) {
        Object.keys(rows).forEach(function (id) { rows[id].remove(); });
        rows = {};
        rowsEl.innerHTML = '<p class="chart__empty">' + esc('Belum ada data ' + lower(p.name) + ' untuk benda-benda ini. Pilih besaran lain.') + '</p>';
        ticksEl.innerHTML = '';
        unitEl.textContent = '';
        logNote.hidden = true;
        return;
      }

      if (state.sort === 'value') {
        items.sort(function (x, y) {
          if (x.v === null || y.v === null) return x.v === null ? (y.v === null ? 0 : 1) : -1;
          return y.v - x.v;
        });
      } else {
        items.sort(function (x, y) { return x.b.distance_million_km - y.b.distance_million_km; });
      }

      narrowNow = figure.clientWidth < 560;
      var sc = makeScale(values, useLog, narrowNow ? 3 : 5, p.min);

      // Ruang label di kiri (nilai negatif) dan kanan, diukur dari teks label yang sebenarnya.
      measure.font = '14px ' + FONT;
      var padL = 0, padR = 0;
      items.forEach(function (i) {
        i.text = i.v === null ? 'tidak diketahui' : p.label(i.b);
        if (i.v === null) return;
        var w = measure.measureText(i.text).width + 12;
        if (i.v < 0) padL = Math.max(padL, w);
        else padR = Math.max(padR, w);
      });
      figure.style.setProperty('--pl', Math.ceil(padL) + 'px');
      figure.style.setProperty('--pr', Math.ceil(padR) + 'px');

      var grid = sc.ticks.map(function (t, k) {
        var isBase = sc.log ? k === 0 : t === 0;
        return '<span class="bar-row__grid' + (isBase ? ' is-base' : '') + '" style="left:calc(' + at(sc.x(t)) + ')"></span>';
      }).join('');

      var keep = {};
      items.forEach(function (i) {
        var row = rows[i.b.id] || (rows[i.b.id] = makeRow(i.b));
        keep[i.b.id] = true;
        var bar = row.querySelector('.bar-row__bar');
        var val = row.querySelector('.bar-row__value');
        row.querySelector('.bar-row__grids').innerHTML = grid;
        var x0 = sc.base;
        var x1 = i.v === null ? null : sc.x(i.v);
        if (x1 === null) {
          // Tidak diketahui, atau 0 pada skala logaritmik: tanpa batang, label di garis awal.
          x1 = x0;
        }
        var neg = x1 < x0;
        bar.classList.toggle('is-neg', neg);
        bar.style.left = 'calc(' + at(Math.min(x0, x1)) + ')';
        bar.style.width = 'calc((100% - var(--pl) - var(--pr)) * ' + Math.abs(x1 - x0).toFixed(5) + ')';
        if (neg) {
          val.style.left = '';
          val.style.right = 'calc(100% - (' + at(x1) + ') + 6px)';
        } else {
          val.style.right = '';
          val.style.left = 'calc(' + at(x1) + ' + 6px)';
        }
        val.textContent = i.text;
        var more = i.v === null ? '' : moreText(p, i.b, i.v);
        row.setAttribute('aria-label', i.b.name + ': ' + (i.v === null ? 'tidak diketahui' : exactText(p, i.b)) + (more ? ', ' + more : ''));
        row.setAttribute('aria-pressed', String(state.selected === i.b.id));
        rowsEl.appendChild(row);
      });
      Object.keys(rows).forEach(function (id) {
        if (!keep[id]) { rows[id].remove(); delete rows[id]; }
      });

      ticksEl.dataset.base = String(sc.log ? 0 : Math.max(0, sc.ticks.indexOf(0)));
      ticksEl.innerHTML = sc.ticks.map(function (t) {
        var text = sc.log && t < 1 ? fmt(t, 8) : fmt(t, 2);
        return '<span class="chart__tick" style="left:calc(' + at(sc.x(t)) + ')">' + esc(text) + '</span>';
      }).join('');
      thinTicks();
      unitEl.textContent = 'Satuan sumbu: ' + p.unit + (useLog ? ', skala logaritmik' : '') + '.';

      if (useLog) {
        var zeros = items.filter(function (i) { return i.v === 0; }).map(function (i) { return i.b.name; });
        logNote.textContent = 'Pada skala logaritmik, setiap garis bantu tegak bernilai 10 kali garis di sebelah kirinya, sehingga nilai yang kecil tetap terlihat. ' +
          'Panjang batang tidak lagi sebanding dengan nilainya, jadi bacalah angka di ujung batang.' +
          (zeros.length ? ' Nilai 0 tidak bisa digambar pada skala ini, jadi ' + joinList(zeros) + ' tidak punya batang.' : '');
        logNote.hidden = false;
      } else {
        logNote.hidden = true;
      }
    }

    /* Keterangan nilai tepat, muncul saat batang disorot tetikus atau difokus papan ketik. */

    function hideTip() { tip.hidden = true; }

    function showTip(row) {
      var p = PROPS[state.prop];
      var b = App.body(row.dataset.id);
      var v = valueOf(p, b);
      tip.textContent = '';
      var strong = document.createElement('strong');
      strong.textContent = v === null ? 'tidak diketahui' : exactText(p, b);
      var name = document.createElement('span');
      name.textContent = b.name;
      tip.appendChild(strong);
      tip.appendChild(name);
      var more = v === null ? '' : moreText(p, b, v);
      if (more) {
        var extra = document.createElement('span');
        extra.textContent = more;
        tip.appendChild(extra);
      }
      tip.hidden = false;
      var fr = figure.getBoundingClientRect();
      var rr = row.getBoundingClientRect();
      var br = row.querySelector('.bar-row__bar').getBoundingClientRect();
      var anchor = (v !== null && v < 0 ? br.left : br.right) - fr.left;
      var left = Math.max(8, Math.min(fr.width - tip.offsetWidth - 8, anchor - tip.offsetWidth / 2));
      var top = rr.top - fr.top - tip.offsetHeight - 6;
      if (top < 0) top = rr.bottom - fr.top + 6;
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    }

    function focusedRow() {
      var f = document.activeElement;
      return f && f.classList && f.classList.contains('bar-row') && rowsEl.contains(f) ? f : null;
    }

    propSel.addEventListener('change', function () { state.prop = Number(propSel.value); hideTip(); render(); });
    dwarfBox.addEventListener('change', function () { state.dwarfs = dwarfBox.checked; hideTip(); render(); });
    logBox.addEventListener('change', function () { state.log = logBox.checked; hideTip(); render(); });
    sortBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.sort = btn.getAttribute('data-sort');
        sortBtns.forEach(function (o) { o.setAttribute('aria-pressed', String(o === btn)); });
        hideTip();
        render();
      });
    });

    rowsEl.addEventListener('click', function (e) {
      var row = e.target.closest('.bar-row');
      if (!row) return;
      state.selected = state.selected === row.dataset.id ? null : row.dataset.id;
      rowsEl.querySelectorAll('.bar-row').forEach(function (r) {
        r.setAttribute('aria-pressed', String(r.dataset.id === state.selected));
      });
    });
    rowsEl.addEventListener('pointerover', function (e) {
      var row = e.target.closest('.bar-row');
      if (row) showTip(row);
    });
    // Fokus dari klik tetikus tidak terlihat, jadi keterangannya ikut hilang saat penunjuk keluar.
    // Fokus papan ketik dan ketukan jari tetap menampilkan keterangan baris yang difokus.
    rowsEl.addEventListener('pointerleave', function (e) {
      var row = focusedRow();
      if (row && (e.pointerType !== 'mouse' || row.matches(':focus-visible'))) showTip(row); else hideTip();
    });
    rowsEl.addEventListener('focusin', function (e) {
      var row = e.target.closest('.bar-row');
      if (row) showTip(row);
    });
    rowsEl.addEventListener('focusout', hideTip);
    rowsEl.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideTip();
    });

    onResize(function () {
      hideTip();
      if ((figure.clientWidth < 560) !== narrowNow) render();
      else thinTicks();
    });
    render();
  }

  /* 4. Tabel data */

  function initTable() {
    var table = $('data-table');
    var thead = table.tHead;
    var tbody = table.tBodies[0];
    var status = $('sort-status');
    var dates = {};
    App.bodies().forEach(function (b) { if (b.moons_as_of) dates[b.moons_as_of] = true; });
    // Bila semua jumlah bulan diperiksa pada tanggal yang sama, tanggalnya cukup ditulis di judul kolom.
    var oneDate = Object.keys(dates).length <= 1;

    var COLUMNS = [
      { label: 'Nama', text: true, get: nameOf },
      { label: 'Kategori', text: true, get: function (b) { return b.category; } },
      { label: 'Diameter', unit: 'km', field: 'diameter_km' },
      { label: 'Massa', unit: 'kg', field: 'mass_1e24_kg', show: massSci },
      { label: 'Massa jenis', unit: 'kg/m³', field: 'density_kg_m3' },
      { label: 'Gravitasi', unit: 'm/s²', field: 'gravity_m_s2', show: dec },
      { label: 'Kecepatan lepas', unit: 'km/s', field: 'escape_velocity_km_s', show: dec },
      { label: 'Jarak dari Matahari', unit: 'juta km', field: 'distance_million_km' },
      { label: 'Periode orbit', unit: 'hari', field: 'orbital_period_days' },
      { label: 'Panjang hari', unit: 'jam', field: 'day_length_h' },
      { label: 'Suhu rata-rata', unit: '°C', field: 'mean_temperature_c' },
      { label: 'Jumlah bulan', unit: oneDate && MOONS_DATE ? 'per ' + MOONS_DATE : '', field: 'moons' }
    ];
    var sort = { col: -1, dir: 1 };

    thead.innerHTML = '<tr>' + COLUMNS.map(function (c, i) {
      return '<th scope="col"' + (c.text ? '' : ' class="n"') + '><button type="button" class="sort-btn" data-col="' + i + '">' +
        '<span class="th-label">' + esc(c.label) + (c.unit ? '<small>' + esc(c.unit) + '</small>' : '') + '</span>' +
        '<span class="sort-ind" aria-hidden="true"></span></button></th>';
    }).join('') + '</tr>';

    function cell(c, b) {
      var v = b[c.field];
      if (!has(v)) {
        return '<span class="na">' + (notApplicable(b, c.field) ? 'tidak berlaku' : 'tidak diketahui') + '</span>';
      }
      var t = esc(c.show ? c.show(v) : fmtCell(v));
      if (AROUND_SUN.test(c.field) && b.parent !== 'sun') {
        t += '<span class="cell-note">terhadap ' + esc(App.body(b.parent).name) + '</span>';
      }
      if (c.field === 'moons' && !oneDate && b.moons_as_of) {
        t += '<span class="cell-note">per ' + esc(asOfText(b)) + '</span>';
      }
      return t;
    }

    function sortKey(c, b) {
      if (c.text) return c.get(b);
      return usable(b, c.field) ? b[c.field] : null;
    }

    function renderBody() {
      var list = App.bodies();
      if (sort.col >= 0) {
        var c = COLUMNS[sort.col];
        list.sort(function (x, y) {
          var a = sortKey(c, x), b = sortKey(c, y);
          // Nilai kosong selalu di bawah, apa pun arah urutannya.
          if (a === null || b === null) return a === null ? (b === null ? 0 : 1) : -1;
          return (c.text ? String(a).localeCompare(String(b), 'id') : a - b) * sort.dir;
        });
      }
      tbody.innerHTML = list.map(function (b) {
        return '<tr><th scope="row"><a href="ensiklopedia.html#' + esc(b.id) + '"><span class="dot" style="--c:' + esc(b.color) +
          '" aria-hidden="true"></span>' + esc(b.name) + '</a></th><td class="cat">' + esc(b.category) + '</td>' +
          COLUMNS.slice(2).map(function (c) { return '<td class="n">' + cell(c, b) + '</td>'; }).join('') + '</tr>';
      }).join('');
    }

    thead.addEventListener('click', function (e) {
      var btn = e.target.closest('.sort-btn');
      if (!btn) return;
      var col = Number(btn.getAttribute('data-col'));
      sort.dir = sort.col === col ? -sort.dir : 1;
      sort.col = col;
      thead.querySelectorAll('th').forEach(function (th, i) {
        if (i === col) th.setAttribute('aria-sort', sort.dir === 1 ? 'ascending' : 'descending');
        else th.removeAttribute('aria-sort');
        th.querySelector('.sort-ind').textContent = i === col ? (sort.dir === 1 ? '▲' : '▼') : '';
      });
      renderBody();
      var c = COLUMNS[col];
      status.textContent = 'Tabel diurutkan menurut ' + lower(c.label) + ', ' +
        (c.text ? (sort.dir === 1 ? 'dari A ke Z' : 'dari Z ke A') : (sort.dir === 1 ? 'dari yang terkecil' : 'dari yang terbesar')) + '.';
    });

    renderBody();
  }

  // Bila satu bagian gagal (misalnya data berubah bentuk), bagian lain tetap tampil.
  [['ukuran', initLineup], ['dua-benda', initCompare], ['grafik', initChart], ['tabel', initTable]].forEach(function (part) {
    try {
      part[1]();
    } catch (err) {
      var box = document.querySelector('#' + part[0] + ' .wrap');
      if (box) App.showError(box, 'Bagian ini gagal ditampilkan. Muat ulang halaman; bila masih gagal, periksa berkas js/data.js.');
      if (window.console) console.error(err);
    }
  });
})();
