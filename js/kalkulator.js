/*
 * kalkulator.js: lima kalkulator di kalkulator.html (berat, umur, cahaya, model skala, perjalanan).
 * Angka benda langit selalu dibaca dari SOLAR_DATA saat halaman dibuka. Jarak dari Bumi pada
 * tanggal tertentu dihitung dengan astro.js (elemen orbit JPL, hanya berlaku 1800-2050).
 */
(function () {
  'use strict';

  // Tanpa data tidak ada yang bisa dihitung: sembunyikan kalkulator agar tidak ada isian mati.
  // Pesan galat dan langkah perbaikannya sudah ditampilkan common.js.
  if (!window.App || !App.data || !window.Astro) {
    document.querySelectorAll('.calc, .calc-toc').forEach(function (el) { el.style.display = 'none'; });
    return;
  }

  var K = App.data.constants;
  var fmt = App.fmt;
  var esc = App.esc;
  var DAY_MS = 86400000;
  var C_KM_H = K.C_KM_S * 3600;
  var JPL_MIN = App.toInputDate(Astro.MIN_DATE);
  var JPL_MAX = App.toInputDate(Astro.MAX_DATE);
  var sun = App.body('sun');
  var earth = App.body('earth');

  function $(id) { return document.getElementById(id); }

  function bodiesById(ids) {
    return ids.map(App.body).filter(Boolean);
  }

  // Tiga angka penting, nol di belakang tetap ditulis supaya kolom rata: 2,75 / 32,3 / 974 / 2,60.
  function fmt3(x) {
    var d = x > 0 ? Math.max(0, 2 - Math.floor(Math.log10(x))) : 0;
    return fmt(x, d, d);
  }

  // 4,64e9 -> "4,64 miliar"
  function fmtBig(n) {
    var steps = [[1e12, 'triliun'], [1e9, 'miliar'], [1e6, 'juta']];
    for (var i = 0; i < steps.length; i++) {
      if (n >= steps[i][0]) return fmt3(n / steps[i][0]) + ' ' + steps[i][1];
    }
    return fmt3(n);
  }

  // Spasi tak terputus: angka tidak terpisah dari satuannya saat sel tabel membungkus baris.
  var NBSP = String.fromCharCode(160);

  function keepUnits(s) {
    return s.replace(/(\d) /g, '$1' + NBSP);
  }

  // Panjang di model (meter) dalam satuan yang paling mudah dibayangkan.
  function fmtLength(m) {
    if (m < 0.01) return fmt3(m * 1000) + NBSP + 'mm';
    if (m < 1) return fmt3(m * 100) + NBSP + 'cm';
    if (m < 1000) return fmt3(m) + NBSP + 'm';
    return fmt3(m / 1000) + NBSP + 'km';
  }

  // Jarak Bulan dibulatkan ke ribuan km: rumus Bulan di astro.js hanya memakai suku-suku terbesar,
  // jadi angka satuan kilometernya tidak bermakna.
  function fmtKm(km) {
    return km < 1e6 ? fmt(Math.round(km / 1000) * 1000, 0) + NBSP + 'km' : fmt(km / 1e6, 1, 1) + NBSP + 'juta' + NBSP + 'km';
  }

  function fmtAU(km) {
    var au = km / K.AU_KM;
    return (au < 10 ? fmt(au, 2, 2) : fmt(au, 1, 1)) + NBSP + 'SA';
  }

  function note(text) {
    return text ? '<span class="cell-note">' + esc(text) + '</span>' : '';
  }

  function nameCell(b, sub) {
    return '<th scope="row"><span class="body-name"><span class="dot" style="--c:' + esc(b.color) + '"></span>' +
      esc(b.name) + '</span>' + note(sub) + '</th>';
  }

  function num(html) {
    return '<td class="n">' + keepUnits(html) + '</td>';
  }

  // Teks isian ke angka dengan kebiasaan Indonesia: koma desimal (47,5) dan titik ribuan (28.000).
  // Titik tanpa koma dibaca sebagai desimal (47.5), kecuali polanya jelas pola ribuan.
  function parseNum(text) {
    var s = text.replace(/\s+/g, '');
    if (s.indexOf(',') !== -1) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : NaN;
  }

  function setError(input, msg) {
    $(input.id + '-error').textContent = msg;
    if (msg) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    return !msg;
  }

  // Isian kosong yang belum pernah disentuh tidak langsung diberi pesan galat.
  function emptyMsg(input, msg) {
    return input.dataset.touched ? msg : '';
  }

  // Angka positif dalam batas rule; null bila tidak sah (pesannya tampil di bawah isian).
  function readNumber(input, rule) {
    var text = input.value.trim();
    var v = parseNum(text);
    var msg = !text ? emptyMsg(input, rule.empty)
      : isNaN(v) ? 'Tulis dengan angka saja, misalnya ' + rule.example + '.'
      : v <= 0 ? rule.positive
      : v < rule.min ? rule.tooSmall
      : v > rule.max ? rule.tooBig
      : '';
    return setError(input, msg) && text ? v : null;
  }

  // Tanggal "YYYY-MM-DD" di antara min dan max; string ISO bisa dibandingkan langsung.
  function readDate(input, min, max, rule) {
    var v = input.value;
    var msg = !v ? (input.validity.badInput
        ? 'Tanggal belum lengkap atau tidak ada di kalender (misalnya 31 Februari). Periksa tanggal, bulan, dan tahun.'
        : emptyMsg(input, rule.empty))
      : v < min ? rule.early
      : v > max || !App.fromInputDate(v) ? rule.late
      : '';
    return setError(input, msg) && v ? v : null;
  }

  var MASS = {
    min: 0.1, max: 1000, example: '50',
    empty: 'Isi massa badanmu dalam kilogram, misalnya 50.',
    positive: 'Massa harus lebih dari 0 kg.',
    tooSmall: 'Massa terlalu kecil untuk dihitung. Isi paling sedikit 0,1 kg.',
    tooBig: 'Angka ini terlalu besar untuk massa badan. Isi paling banyak 1.000 kg.'
  };

  var SUN_CM = {
    min: 0.1, max: 10000, example: '30',
    empty: 'Isi diameter Matahari di modelmu dalam cm, atau pilih salah satu bola.',
    positive: 'Diameter harus lebih dari 0 cm.',
    tooSmall: 'Diameter terlalu kecil untuk dihitung. Isi paling sedikit 0,1 cm (1 mm).',
    tooBig: 'Diameter terlalu besar. Isi paling banyak 10.000 cm (100 m).'
  };

  var SPEED = {
    min: 0.1, max: Math.round(C_KM_H), example: '100',
    empty: 'Isi kecepatan dalam km/jam, atau pilih salah satu contoh.',
    positive: 'Kecepatan harus lebih dari 0 km/jam.',
    tooSmall: 'Kecepatan terlalu kecil untuk dihitung. Isi paling sedikit 0,1 km/jam.',
    tooBig: 'Tidak ada benda yang bisa melaju lebih cepat daripada cahaya, yaitu ' + fmt(C_KM_H, 0) + ' km/jam.'
  };

  var JPL_RANGE = 'Pilih tanggal antara ' + App.fmtDate(Astro.MIN_DATE) + ' dan ' + App.fmtDate(Astro.MAX_DATE) +
    '. Rumus posisi planet dari JPL yang dipakai di sini hanya berlaku dalam rentang itu.';
  var SKY_DATE = { empty: 'Isi tanggal dengan lengkap (tanggal, bulan, tahun), misalnya hari ini.', early: JPL_RANGE, late: JPL_RANGE };

  // Tampilkan tabel hasil, atau sembunyikan dan jelaskan sebabnya di kalimat hasil.
  function showResult(key, ok, why) {
    $(key + '-wrap').hidden = !ok;
    if (!ok) $(key + '-summary').textContent = why;
  }

  // 1. Berat di benda lain

  var WEIGHT_IDS = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'ceres', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

  function renderWeight() {
    var m = readNumber($('berat-massa'), MASS);
    if (m === null) return showResult('berat', false, 'Hasil muncul setelah massa badan diisi dengan benar.');
    // Timbangan di Bumi menampilkan gaya dibagi g Bumi; g Bumi diambil dari baris Bumi di data.
    var gEarth = earth.gravity_m_s2;
    $('berat-rows').innerHTML = bodiesById(WEIGHT_IDS).map(function (b) {
      var g = b.gravity_m_s2;
      var sub = b.id === 'sun' ? 'di permukaan tampak'
        : b.type === 'gas_giant' || b.type === 'ice_giant' ? 'pada tekanan 1' + NBSP + 'bar'
        : b.id === 'earth' ? 'acuan' : '';
      if (g === null) return '<tr>' + nameCell(b, sub) + '<td colspan="3">tidak diketahui</td></tr>';
      var force = m * g, d = force < 100 ? 1 : 0;
      return '<tr>' + nameCell(b, sub) + num(fmt(g, 2, 1)) + num(fmt(force / gEarth, 1, 1)) +
        num(fmt(force, d, d)) + '</tr>';
    }).join('');
    $('berat-caption').textContent = 'Berat untuk massa ' + fmt(m, 2) + ' kg';
    var moon = App.body('moon'), mars = App.body('mars');
    $('berat-summary').innerHTML = 'Timbangan yang menunjukkan <strong>' + fmt(m, 2) + ' kg</strong> di Bumi akan menunjukkan <strong>' +
      fmt(m * moon.gravity_m_s2 / gEarth, 1, 1) + ' kg</strong> di ' + esc(moon.name) + ' dan <strong>' +
      fmt(m * mars.gravity_m_s2 / gEarth, 1, 1) + ' kg</strong> di ' + esc(mars.name) + '.';
    showResult('berat', true);
  }

  // 2. Umurmu di planet lain

  var AGE_IDS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

  // Tanggal kalender dihitung sebagai hari UTC (ms), supaya zona waktu, jam musim panas, dan
  // selisih jam lokal zaman dulu tidak menggeser tanggal ulang tahun.
  function dayOf(date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  }

  // Ulang tahun kalender pada tahun tertentu; lahir 29 Februari jatuh ke 1 Maret di tahun biasa.
  function birthdayIn(birth, year) {
    var b = new Date(birth);
    return Date.UTC(year, b.getUTCMonth(), b.getUTCDate());
  }

  function fmtDay(ms) {
    var u = new Date(ms);
    return App.fmtDate(new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate()));
  }

  function renderAge() {
    var now = new Date();
    var input = $('umur-lahir');
    var todayStr = App.toInputDate(now);
    // Mengisi ulang max (walau nilainya sama) membuat Chrome membuang angka tahun yang sedang diketik.
    if (input.max !== todayStr) input.max = todayStr;
    var v = readDate(input, '1900-01-01', todayStr, {
      empty: 'Isi tanggal lahirmu dengan lengkap (tanggal, bulan, tahun).',
      early: 'Tanggal lahir paling awal 1 Januari 1900.',
      late: 'Tanggal lahir tidak boleh melewati hari ini (' + App.fmtDate(now) + ').'
    });
    if (v === null) {
      return showResult('umur', false, input.getAttribute('aria-invalid')
        ? 'Hasil belum bisa dihitung. Perbaiki isian tanggal lahir.'
        : 'Isi tanggal lahirmu untuk melihat umurmu di tiap planet.');
    }
    var today = dayOf(now);
    var birth = dayOf(App.fromInputDate(v));
    var birthYear = new Date(birth).getUTCFullYear();
    var days = (today - birth) / DAY_MS;
    var years = now.getFullYear() - birthYear;
    if (birthdayIn(birth, now.getFullYear()) > today) years--;
    var lastBirthday = birthdayIn(birth, birthYear + years);
    var sinceBirthday = (today - lastBirthday) / DAY_MS;

    $('umur-rows').innerHTML = bodiesById(AGE_IDS).filter(function (b) { return b.orbital_period_days > 0; }).map(function (b) {
      var P = b.orbital_period_days;
      var planetAge, nth, next, todayNth = 0;
      if (b.id === 'earth') {
        // Di Bumi pakai kalender, supaya tanggalnya sama persis dengan hari lahirmu.
        nth = years + 1;
        next = birthdayIn(birth, birthYear + nth);
        planetAge = years + sinceBirthday / ((next - lastBirthday) / DAY_MS);
        if (years > 0 && sinceBirthday === 0) todayNth = years;
      } else {
        // Ulang tahun ke-n jatuh pada hari ketika n × P hari sudah terlewati;
        // 1e-9 menahan galat pembulatan (10 × 224,7 = 2246,9999...).
        planetAge = days / P;
        var done = Math.floor(planetAge + 1e-9);
        nth = done + 1;
        next = birth + Math.ceil(nth * P - 1e-9) * DAY_MS;
        if (done > 0 && Math.ceil(done * P - 1e-9) === days) todayNth = done;
      }
      var nextYear = new Date(next).getUTCFullYear();
      var label = '<span class="nowrap">(ke-' + (todayNth || nth) + ')</span>';
      var when = todayNth ? 'hari ini ' + label
        : nextYear < 2100 ? fmtDay(next) + ' ' + label
        : 'sekitar tahun ' + nextYear + ' ' + label + ', jauh di masa depan';
      var yearLength = 'setahun = ' + keepUnits(P < 1000 ? fmt(P, 1, 1) + ' hari' : fmt(P / earth.orbital_period_days, 1, 1) + ' tahun Bumi');
      // Umur dibulatkan ke bawah seperti umur biasa: 29,97 tahun ditulis 29,9, bukan 30,0.
      var dec = planetAge < 10 ? 2 : 1, step = Math.pow(10, dec);
      return '<tr>' + nameCell(b, (b.type === 'dwarf' ? b.category + ', ' : '') + yearLength) +
        num(fmt(Math.floor(planetAge * step + 1e-9) / step, dec, dec)) + '<td>' + when + '</td></tr>';
    }).join('');

    $('umur-caption').textContent = 'Umurmu per ' + App.fmtDate(now) + ' (hari ini)';
    var earthAge = years ? years + ' tahun' + (sinceBirthday ? ' ' + sinceBirthday + ' hari' : '') : sinceBirthday + ' hari';
    $('umur-summary').innerHTML = days === 0
      ? 'Kamu lahir hari ini, jadi umurmu di semua planet masih 0.'
      : 'Kamu sudah hidup <strong>' + fmt(days, 0) + ' hari</strong>. Di Bumi, umurmu <strong>' + earthAge + '</strong>.' +
        (years > 0 && sinceBirthday === 0 ? ' Hari ini ulang tahunmu yang <span class="nowrap">ke-' + years + '</span>.' : '');
    showResult('umur', true);
  }

  // 3. Kecepatan cahaya

  var FROM_EARTH_IDS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

  // Jarak (km) dari Bumi ke tiap benda pada pukul 12.00 waktu perangkat di tanggal itu.
  // Posisi "earth" di data adalah pusat massa Bumi-Bulan; selisihnya dengan pusat Bumi < 5.000 km.
  function distancesFromEarth(dateStr, ids) {
    var jd = Astro.jdFromDate(App.fromInputDate(dateStr, 12));
    var e = Astro.helioPosition(earth.orbit, jd);
    return bodiesById(ids).map(function (b) {
      var km = b.id === 'moon' ? Astro.moonPosition(jd).distKm
        : K.AU_KM * (b.id === 'sun' ? Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z)
          : Astro.fromEarth(Astro.helioPosition(b.orbit, jd), e).dist);
      return { body: b, km: km };
    });
  }

  function byBody(list, id) {
    return list.filter(function (r) { return r.body.id === id; })[0];
  }

  function distanceCell(b, km) {
    return num(fmtKm(km) + (b.id === 'moon' ? '' : note(fmtAU(km))));
  }

  function lightTime(km) {
    return App.fmtDuration(km / K.C_KM_S);
  }

  function renderSunlight() {
    // Komet Halley dilewati: jarak rata-ratanya (sumbu semi-mayor) jauh dari jarak yang biasa ia tempati.
    $('cahaya-matahari-rows').innerHTML = App.bodies(function (b) {
      return b.parent === 'sun' && b.distance_million_km && b.type !== 'comet';
    }).map(function (b) {
      var km = b.distance_million_km * 1e6;
      return '<tr>' + nameCell(b) + distanceCell(b, km) + num(lightTime(km)) + '</tr>';
    }).join('');
    $('cahaya-matahari-summary').innerHTML = 'Sinar Matahari butuh <strong>' + lightTime(earth.distance_million_km * 1e6) +
      '</strong> untuk sampai ke Bumi pada jarak rata-ratanya.';

    var fills = {
      c: fmt(K.C_KM_S, 3),
      sunEarth: lightTime(earth.distance_million_km * 1e6),
      ly: fmtBig(K.LY_KM),
      proximaLy: fmt(K.PROXIMA_LY, 4),
      proximaKm: fmtBig(K.PROXIMA_LY * K.LY_KM)
    };
    document.querySelectorAll('[data-fill]').forEach(function (el) {
      el.textContent = fills[el.getAttribute('data-fill')];
    });
  }

  function renderFromEarth() {
    var v = readDate($('cahaya-tgl'), JPL_MIN, JPL_MAX, SKY_DATE);
    if (v === null) return showResult('cahaya-bumi', false, 'Hasil belum bisa dihitung. Perbaiki isian tanggal.');
    var list = distancesFromEarth(v, FROM_EARTH_IDS);
    $('cahaya-bumi-rows').innerHTML = list.map(function (r) {
      return '<tr>' + nameCell(r.body) + distanceCell(r.body, r.km) + num(lightTime(r.km)) + '</tr>';
    }).join('');
    var date = App.fmtDate(App.fromInputDate(v));
    $('cahaya-bumi-caption').textContent = 'Jarak dari Bumi pada ' + App.fmtDateTime(App.fromInputDate(v, 12));
    var sunKm = byBody(list, 'sun').km;
    $('cahaya-bumi-summary').innerHTML = 'Pada ' + date + ', Matahari berjarak <strong>' + fmtKm(sunKm) +
      '</strong> dari Bumi, jadi sinarnya butuh <strong>' + lightTime(sunKm) + '</strong>.';
    showResult('cahaya-bumi', true);
  }

  // Tombol contoh (model skala dan perjalanan)

  function presetButtons(group) {
    return document.querySelectorAll('[data-preset="' + group + '"] button');
  }

  function syncPresets(group, value) {
    presetButtons(group).forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(value !== null && Number(btn.value) === value));
    });
  }

  function bindPresets(group, input, render) {
    presetButtons(group).forEach(function (btn) {
      btn.addEventListener('click', function () {
        input.value = fmt(Number(btn.value), 2);
        input.dataset.touched = '1';
        render();
      });
    });
  }

  // 4. Model skala

  function renderScale() {
    var cm = readNumber($('skala-d'), SUN_CM);
    syncPresets('skala', cm);
    if (cm === null) return showResult('skala', false, 'Hasil belum bisa dihitung. Perbaiki isian diameter.');
    var k = cm / 100 / sun.diameter_km; // meter di model untuk tiap kilometer sebenarnya
    var rows = App.planets().map(function (b) {
      return '<tr>' + nameCell(b) + num(fmtLength(b.diameter_km * k)) + num(fmtLength(b.distance_million_km * 1e6 * k)) + '</tr>';
    });
    rows.push('<tr><th scope="row"><span class="body-name"><span class="dot"></span>Proxima Centauri</span>' +
      note('bintang terdekat') + '</th><td class="n muted">tidak ada di data</td>' +
      num(fmtLength(K.PROXIMA_LY * K.LY_KM * k)) + '</tr>');
    $('skala-rows').innerHTML = rows.join('');
    $('skala-caption').textContent = 'Ukuran di model dengan Matahari berdiameter ' + fmt(cm, 2) + ' cm';
    $('skala-summary').innerHTML = 'Skala <strong>1 : ' + fmtBig(sun.diameter_km * 1e5 / cm) + '</strong>. ' +
      esc(earth.name) + ' menjadi bola <strong>' + fmtLength(earth.diameter_km * k) + '</strong> yang berjarak <strong>' +
      fmtLength(earth.distance_million_km * 1e6 * k) + '</strong> dari Matahari model.';
    showResult('skala', true);
  }

  // 5. Perjalanan

  var TRAVEL_IDS = ['moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

  function renderTravel() {
    var speed = readNumber($('jalan-v'), SPEED);
    syncPresets('jalan', speed);
    var v = readDate($('jalan-tgl'), JPL_MIN, JPL_MAX, SKY_DATE);
    if (speed === null || v === null) return showResult('jalan', false, 'Hasil belum bisa dihitung. Perbaiki isian yang ditandai.');
    function trip(km) { return App.fmtDuration(km / speed * 3600); }
    var list = distancesFromEarth(v, TRAVEL_IDS);
    $('jalan-rows').innerHTML = list.map(function (r) {
      return '<tr>' + nameCell(r.body) + distanceCell(r.body, r.km) + num(trip(r.km)) + '</tr>';
    }).join('');
    $('jalan-caption').textContent = 'Dengan ' + fmt(speed, 2) + ' km/jam, ke posisi tiap benda pada ' + App.fmtDateTime(App.fromInputDate(v, 12));
    var moon = byBody(list, 'moon'), mars = byBody(list, 'mars');
    $('jalan-summary').innerHTML = 'Dengan kecepatan tetap <strong>' + fmt(speed, 2) + ' km/jam</strong> tanpa berhenti, perjalanan ke ' +
      esc(moon.body.name) + ' butuh <strong>' + trip(moon.km) + '</strong> dan ke ' + esc(mars.body.name) +
      ' <strong>' + trip(mars.km) + '</strong>.';
    showResult('jalan', true);
  }

  // Tabel lebar dan penggaris yang bergulir harus bisa difokus agar bisa digeser dengan papan ketik.

  function markScrollable() {
    document.querySelectorAll('.calc .table-wrap, .calc-ruler').forEach(function (el) {
      if (el.scrollWidth > el.clientWidth + 1) {
        el.tabIndex = 0;
        el.setAttribute('role', 'region');
        el.setAttribute('aria-label', el.getAttribute('data-label'));
      } else {
        el.removeAttribute('tabindex');
        el.removeAttribute('role');
        el.removeAttribute('aria-label');
      }
    });
  }

  // Galat di satu kalkulator tidak boleh menghentikan kalkulator lain.
  function guard(panelId, fn) {
    return function () {
      try {
        fn();
      } catch (err) {
        var panel = $(panelId);
        if (!panel.querySelector('.notice--error')) {
          App.showError(panel, 'Perhitungan di bagian ini gagal. Muat ulang halaman; bila masih gagal, laporkan lewat GitHub.');
        }
        if (window.console) console.error(err);
      }
      markScrollable();
    };
  }

  var today = App.toInputDate(new Date());
  var skyDefault = today > JPL_MAX ? JPL_MAX : today;
  $('cahaya-tgl').value = skyDefault;
  $('jalan-tgl').value = skyDefault;

  var weight = guard('berat', renderWeight);
  var age = guard('umur', renderAge);
  var sunlight = guard('cahaya', renderSunlight);
  var fromEarth = guard('cahaya', renderFromEarth);
  var scale = guard('skala', renderScale);
  var travel = guard('perjalanan', renderTravel);

  [['berat-massa', weight], ['umur-lahir', age], ['cahaya-tgl', fromEarth], ['skala-d', scale],
    ['jalan-v', travel], ['jalan-tgl', travel]].forEach(function (pair) {
    var input = $(pair[0]);
    function onEdit() {
      input.dataset.touched = '1';
      pair[1]();
    }
    input.addEventListener('input', onEdit);
    input.addEventListener('change', onEdit);
    // Tanggal yang baru setengah diketik tidak memicu 'input' (nilainya tetap kosong), jadi tandai
    // isian dari ketikan dan periksa lagi saat isian ditinggalkan. Tombol Tab tidak dihitung.
    input.addEventListener('keydown', function (e) {
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') input.dataset.touched = '1';
    });
    input.addEventListener('blur', pair[1]);
  });
  bindPresets('skala', $('skala-d'), scale);
  bindPresets('jalan', $('jalan-v'), travel);

  guard('skala', function () { App.ruler($('skala-ruler')); })();
  weight();
  age();
  sunlight();
  fromEarth();
  scale();
  travel();

  var resizeFrame = 0;
  window.addEventListener('resize', function () {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(markScrollable);
  });
})();
