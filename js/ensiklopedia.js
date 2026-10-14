/*
 * ensiklopedia.js: daftar entri (benda langit dan wilayah) dan detail satu entri dari hash URL.
 * ensiklopedia.html#mars membuka Mars; tanpa hash yang dibuka Matahari.
 * Semua teks dan angka diambil dari SOLAR_DATA saat halaman dibuka.
 */
(function () {
  'use strict';

  var article = document.getElementById('entry');
  var indexNav = document.getElementById('ens-index');
  var select = document.getElementById('ens-select');
  var status = document.getElementById('ens-status');

  if (!window.App || !App.data || !window.Astro) {
    // Tanpa data tidak ada entri untuk dipilih: daftar dan pilihan dibuang agar tidak ada kontrol mati.
    indexNav.remove();
    select.closest('.ens-picker').remove();
    article.innerHTML = '';
    if (!window.App) {
      article.innerHTML = '<div class="notice notice--error" role="alert"><strong>Ada masalah.</strong> ' +
        'Berkas js/common.js tidak termuat. Pastikan folder js lengkap, lalu muat ulang halaman.</div>';
    } // selain itu common.js sudah menampilkan pesan galatnya
    return;
  }

  var esc = App.esc, fmt = App.fmt;
  var D = App.data;
  var CONST = D.constants || {};
  var EARTH = App.body('earth');

  // Pita letak wilayah di penggaris SA, dari konstanta data.
  var REGION_BAND = { 'asteroid-belt': 'ASTEROID_BELT_AU', 'kuiper-belt': 'KUIPER_BELT_AU' };

  /* ---------- Kelompok entri ---------- */

  var TYPE_ORDER = ['star', 'terrestrial', 'moon', 'gas_giant', 'ice_giant', 'dwarf', 'comet'];
  var bodies = App.bodies();
  bodies.forEach(function (b) {
    if (TYPE_ORDER.indexOf(b.type) < 0) TYPE_ORDER.push(b.type);
  });

  var groups = [];
  TYPE_ORDER.forEach(function (type) {
    var items = bodies.filter(function (b) { return b.type === type; });
    if (items.length) groups.push({ label: items[0].category || type, items: items });
  });
  if (D.regions && D.regions.length) groups.push({ label: 'Wilayah tata surya', items: D.regions, region: true });

  var entries = [];
  var byId = {};
  groups.forEach(function (g) {
    g.items.forEach(function (x) {
      var e = { id: x.id, name: x.name, color: g.region ? null : x.color, region: !!g.region, data: x };
      entries.push(e);
      byId[x.id] = e;
    });
  });

  /* ---------- Format angka ---------- */

  // Banyaknya angka penting pada nilai data (0,073 -> 2; 1988400 -> 5), supaya hasil hitungan
  // tidak tampak lebih teliti daripada data asalnya.
  function sigCount(x) {
    var s = String(Math.abs(x));
    var digits = s.replace('.', '').replace(/^0+/, '');
    if (s.indexOf('.') < 0) digits = digits.replace(/0+$/, '');
    return Math.max(1, digits.length);
  }

  // Bulatkan ke n angka penting, lalu format id-ID.
  function sig(x, n) {
    if (!x) return fmt(0, 0);
    var p = Math.floor(Math.log10(Math.abs(x))) + 1 - n;
    var f = Math.pow(10, p);
    return fmt(Math.round(x / f) * f, Math.max(0, -p));
  }

  // Nilai data apa adanya, hanya diberi format id-ID.
  function plain(x) {
    var s = String(Math.abs(x));
    if (s.indexOf('e') >= 0) return App.fmtSci(x, 2);
    var dot = s.indexOf('.');
    return fmt(x, dot < 0 ? 0 : Math.min(6, s.length - dot - 1));
  }

  function unit(suffix) {
    return function (v) { return plain(v) + suffix; };
  }

  function mass(m) {
    return App.fmtSci(m * 1e24, Math.min(4, sigCount(m) - 1)) + '\u00a0kg';
  }

  // Jarak juta km ke satuan astronomi (SA).
  function au(millionKm) {
    return sig(millionKm * 1e6 / Astro.AU_KM, Math.min(3, sigCount(millionKm))) + '\u00a0SA';
  }

  // Hari ke tahun Bumi (tahun sideris dari data).
  function years(days) {
    return CONST.SIDEREAL_YEAR_DAYS ? sig(days / CONST.SIDEREAL_YEAR_DAYS, Math.min(3, sigCount(days))) + '\u00a0tahun' : '';
  }

  function earthDays(hours) {
    return sig(hours / 24, Math.min(3, sigCount(hours))) + '\u00a0hari';
  }

  // Minimal dua angka penting: nilai data seperti 9.0 atau 5.0 kehilangan nol belakangnya di JavaScript.
  function vsEarth(b, key) {
    var v = b[key], ref = EARTH && EARTH[key];
    if (b.id === 'earth' || v == null || !ref) return null;
    return sig(v / ref, Math.max(2, Math.min(3, sigCount(v), sigCount(ref)))) + '\u00a0×\u00a0Bumi';
  }

  function asOf(b) {
    var d = b.moons_as_of && App.fromInputDate(b.moons_as_of);
    return d ? 'data per ' + App.fmtDate(d) : '';
  }

  // Nama wilayah yang bukan nama diri ditulis kecil di tengah kalimat: "sabuk asteroid", "heliosfer"
  // (tetapi "Sabuk Kuiper", "Awan Oort").
  function regionInText(name) {
    return / [A-Z]/.test(name) ? name : name.charAt(0).toLowerCase() + name.slice(1);
  }

  // "a, b, dan c" sesuai EYD.
  function listJoin(items) {
    if (items.length < 3) return items.join(' dan ');
    return items.slice(0, -1).join(', ') + ', dan ' + items[items.length - 1];
  }

  /* ---------- Potongan HTML ---------- */

  function dot(color) {
    return color ? '<span class="dot" style="--c: ' + esc(color) + '" aria-hidden="true"></span>' : '';
  }

  function section(title, body) {
    return '<section class="entry__section"><h3>' + title + '</h3>' + body + '</section>';
  }

  function head(category, name, tagline) {
    return '<p class="entry__cat muted">' + esc(category) + '</p>' +
      '<h2 class="entry__name" id="entry-title" tabindex="-1">' + esc(name) + '</h2>' +
      (tagline ? '<p class="lead entry__tagline">' + esc(tagline) + '</p>' : '');
  }

  function plate(label, value, sub) {
    return '<div><dt>' + label + '</dt><dd>' + value + (sub ? '<small>' + sub + '</small>' : '') + '</dd></div>';
  }

  function figure(img) {
    var credit = img.credit ? 'Kredit: ' + esc(img.credit) + '.' : '';
    var source = img.source_page ? ' <a href="' + esc(img.source_page) + '">Sumber foto</a>' : '';
    return '<figure class="entry__photo">' +
      '<img src="' + esc(img.src) + '" width="512" height="512" alt="' + esc(img.title || '') + '" decoding="async">' +
      '<figcaption>' + esc(img.title || '') +
      (credit || source ? '<p class="figure-credit">' + credit + source + '</p>' : '') +
      '</figcaption></figure>';
  }

  // Pelat angka utama di samping foto. k: jenis benda (lihat renderBody).
  function keyPlates(b, k) {
    var p = [];
    var level = k.star ? 'di fotosfer' : k.giant ? 'pada lapisan bertekanan 1 bar' : '';
    function withLevel(ratio) { return [ratio, level].filter(Boolean).join(', '); }

    if (b.diameter_km != null) p.push(plate('Diameter', plain(b.diameter_km) + '\u00a0km', vsEarth(b, 'diameter_km')));
    if (b.mass_1e24_kg != null) p.push(plate('Massa', mass(b.mass_1e24_kg), vsEarth(b, 'mass_1e24_kg')));
    if (b.gravity_m_s2 != null) p.push(plate('Gravitasi', plain(b.gravity_m_s2) + '\u00a0m/s²', withLevel(vsEarth(b, 'gravity_m_s2'))));
    if (b.distance_million_km != null) {
      p.push(plate(k.near ? 'Jarak rata-rata dari Bumi' : 'Jarak rata-rata dari Matahari',
        plain(b.distance_million_km) + '\u00a0juta\u00a0km', k.near ? '' : au(b.distance_million_km)));
    }
    if (b.orbital_period_days != null) {
      p.push(plate(k.near ? 'Periode orbit mengelilingi Bumi' : 'Periode orbit',
        plain(b.orbital_period_days) + '\u00a0hari', k.near ? '' : years(b.orbital_period_days)));
    }
    if (b.day_length_h != null) {
      p.push(plate('Panjang hari', plain(b.day_length_h) + '\u00a0jam', b.day_length_h >= 48 ? earthDays(b.day_length_h) + '\u00a0Bumi' : ''));
    } else if (b.rotation_period_h != null) {
      var rot = Math.abs(b.rotation_period_h);
      p.push(plate('Periode rotasi', plain(rot) + '\u00a0jam',
        [rot >= 48 ? earthDays(rot) : '', b.rotation_period_h < 0 ? 'retrograd' : ''].filter(Boolean).join(', ')));
    }
    if (b.mean_temperature_c != null) {
      p.push(plate(k.star ? 'Suhu permukaan' : 'Suhu rata-rata', plain(b.mean_temperature_c) + '\u00a0°C', level));
    }
    if (b.moons != null) p.push(plate('Jumlah bulan', fmt(b.moons, 0), asOf(b)));
    return p.join('');
  }

  /* ---------- Penggaris SA ---------- */

  var LOG_NOTE = ' Skalanya logaritmik: rentang 1 sampai 10 SA sama panjang dengan rentang 10 sampai 100 SA. ' +
    'Satu satuan astronomi (SA) adalah jarak rata-rata Bumi ke Matahari, sekitar ' + fmt(Astro.AU_KM / 1e6, 1) + '\u00a0juta\u00a0km.';

  function rulerSpecBody(b) {
    var name = esc(b.name);
    if (b.type === 'star') {
      return { title: 'Jarak planet dari Matahari', caption: 'Titik-titik menandai jarak rata-rata planet dan benda lain dari Matahari.' + LOG_NOTE };
    }
    if (b.parent === 'earth' && EARTH) {
      return {
        highlight: 'earth',
        caption: name + ' mengelilingi Bumi, jadi jaraknya dari Matahari hampir sama dengan jarak Bumi, rata-rata ' +
          au(EARTH.distance_million_km) + '.' + LOG_NOTE
      };
    }
    if (b.parent !== 'sun') return null;
    if (b.perihelion_million_km != null && b.aphelion_million_km != null) {
      return {
        highlight: b.id,
        caption: 'Pita kuning menandai rentang jarak ' + name + ' dari Matahari, dari ' + au(b.perihelion_million_km) +
          ' di titik terdekat sampai ' + au(b.aphelion_million_km) + ' di titik terjauh.' + LOG_NOTE
      };
    }
    return { highlight: b.id, caption: LOG_NOTE.trim() };
  }

  function rulerSection(spec) {
    return '<section class="entry__section"><h3>' + (spec.title || 'Jarak dari Matahari') + '</h3>' +
      '<div id="ens-ruler"></div><p class="small muted ruler-caption">' + spec.caption + '</p></section>';
  }

  // Pita wilayah: posisinya dihitung dari label "1 SA" dan "10 SA" milik penggaris itu sendiri,
  // jadi tetap pas walau ukuran penggaris di common.js berubah.
  function addBand(svg, range) {
    var x1 = null, x10 = null;
    [].forEach.call(svg.querySelectorAll('text'), function (t) {
      if (t.textContent === '1 SA') x1 = Number(t.getAttribute('x'));
      if (t.textContent === '10 SA') x10 = Number(t.getAttribute('x'));
    });
    var axis = svg.querySelector('.axis');
    if (x1 === null || x10 === null || !axis) return;
    var left = Number(axis.getAttribute('x1')), right = Number(axis.getAttribute('x2'));
    function x(a) { return Math.min(right, Math.max(left, x1 + Math.log10(a) * (x10 - x1))); }
    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', 'ens-band');
    rect.setAttribute('x', x(range[0]));
    rect.setAttribute('width', Math.max(2, x(range[1]) - x(range[0])));
    rect.setAttribute('y', Number(axis.getAttribute('y1')) - 2);
    rect.setAttribute('height', 4);
    rect.setAttribute('rx', 2);
    svg.insertBefore(rect, svg.querySelector('a, g'));
  }

  function drawRuler(spec) {
    var box = document.getElementById('ens-ruler');
    if (!box) return;
    var svg = App.ruler(box, { highlight: spec.highlight, link: true });
    if (spec.band) addBand(svg, spec.band);
    // Di layar sempit penggaris digulir; geser supaya benda atau pita yang disorot terlihat.
    var target = svg.querySelector('.is-hl circle, .ens-band');
    if (target && box.scrollWidth > box.clientWidth) {
      var bb = target.getBBox();
      var scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
      box.scrollLeft = (bb.x + bb.width / 2) * scale - box.clientWidth / 2;
    }
  }

  /* ---------- Bagian teks ---------- */

  function textSections(x) {
    var h = '';
    if (x.description && x.description.length) {
      h += section('Tentang ' + esc(byId[x.id].region ? regionInText(x.name) : x.name), '<div class="prose">' +
        x.description.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>');
    }
    if (x.facts && x.facts.length) {
      h += section('Fakta singkat', '<ul class="facts">' +
        x.facts.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>');
    }
    if (x.composition) h += section('Komposisi', '<p class="prose">' + esc(x.composition) + '</p>');
    return h;
  }

  /* ---------- Tabel data lengkap ---------- */

  // na: baris tidak berlaku untuk benda ini bila nilainya kosong (tidak dilaporkan sebagai data yang belum ada).
  function dataRows(b, k) {
    var noOrbit = !b.parent;
    var center = k.near ? 'Bumi' : 'Matahari';
    function dist(v) { return plain(v) + '\u00a0juta\u00a0km' + (k.near ? '' : ' (' + au(v) + ')'); }
    function hours(v) {
      var a = Math.abs(v);
      return plain(a) + '\u00a0jam' + (a >= 48 ? ' (' + earthDays(a) + ')' : '');
    }
    return [
      { key: 'diameter_km', label: 'Diameter', val: unit('\u00a0km'), ratio: true },
      { key: 'mass_1e24_kg', label: 'Massa', val: mass, ratio: true },
      { key: 'density_kg_m3', label: 'Massa jenis rata-rata', val: unit('\u00a0kg/m³'), ratio: true },
      {
        key: 'gravity_m_s2', ratio: true, val: unit('\u00a0m/s²'),
        label: k.star ? 'Gravitasi di fotosfer' : k.giant ? 'Gravitasi pada lapisan bertekanan 1 bar' : 'Gravitasi permukaan'
      },
      { key: 'escape_velocity_km_s', label: 'Kecepatan lepas', val: unit('\u00a0km/s'), ratio: true },
      {
        key: 'rotation_period_h', label: 'Periode rotasi',
        val: function (v) { return hours(v) + (v < 0 ? ', retrograd' : ''); }
      },
      { key: 'day_length_h', label: 'Panjang hari (satu kali siang dan malam)', val: hours, na: k.star },
      { key: 'distance_million_km', label: 'Jarak rata-rata dari ' + center, val: dist, na: noOrbit },
      {
        key: 'perihelion_million_km', val: dist, na: noOrbit,
        label: k.near ? 'Jarak terdekat ke Bumi (perige)' : 'Jarak terdekat ke Matahari (perihelion)'
      },
      {
        key: 'aphelion_million_km', val: dist, na: noOrbit,
        label: k.near ? 'Jarak terjauh dari Bumi (apoge)' : 'Jarak terjauh dari Matahari (aphelion)'
      },
      {
        key: 'orbital_period_days', na: noOrbit,
        label: k.near ? 'Periode orbit mengelilingi Bumi' : 'Periode orbit',
        val: function (v) { return plain(v) + '\u00a0hari' + (k.near ? '' : ' (' + years(v) + ')'); }
      },
      {
        key: 'orbital_velocity_km_s', val: unit('\u00a0km/s'), na: noOrbit,
        label: k.near ? 'Kecepatan orbit mengelilingi Bumi' : 'Kecepatan orbit rata-rata'
      },
      {
        key: 'orbital_inclination_deg', label: 'Kemiringan orbit terhadap ekliptika', na: noOrbit,
        val: function (v) { return plain(v) + '°' + (v > 90 ? ' (orbit retrograd)' : ''); }
      },
      { key: 'orbital_eccentricity', label: 'Eksentrisitas orbit', val: plain, na: noOrbit },
      { key: 'axial_tilt_deg', label: 'Kemiringan sumbu rotasi', val: unit('°') },
      {
        key: 'mean_temperature_c', val: unit('\u00a0°C'),
        label: k.star ? 'Suhu permukaan (fotosfer)' : k.giant ? 'Suhu rata-rata pada lapisan bertekanan 1 bar' : 'Suhu rata-rata'
      },
      {
        // Merkurius dan Bulan bernilai 0 di data: yang ada hanya eksosfer, bukan ruang hampa sempurna.
        key: 'surface_pressure_bar', label: 'Tekanan atmosfer di permukaan', na: k.star || k.comet,
        val: function (v) { return v === 0 ? 'hampir 0 (eksosfer sangat tipis)' : plain(v) + '\u00a0bar'; },
        none: k.giant ? 'tidak ada, planet ini tidak punya permukaan padat' : ''
      },
      {
        key: 'moons', label: 'Jumlah bulan', na: k.star || k.comet || k.near,
        val: function (v) { var d = asOf(b); return fmt(v, 0) + (d ? ' (' + d + ')' : ''); }
      },
      {
        key: 'rings', label: 'Cincin', na: k.star || k.comet,
        val: function (v) { return v ? 'ada' : 'tidak ada'; }
      },
      {
        key: 'magnetic_field', label: 'Medan magnet global',
        val: function (v) { return { yes: 'ada', no: 'tidak ada', unknown: 'belum diketahui' }[v] || esc(v); }
      }
    ];
  }

  function dataSection(b, k) {
    var rows = [], missing = [], hasRatio = false;
    dataRows(b, k).forEach(function (r) {
      var v = b[r.key];
      if (v == null) {
        if (r.none) rows.push([r.label, r.none, '']);
        else if (!r.na) missing.push(r.label.charAt(0).toLowerCase() + r.label.slice(1));
        return;
      }
      var ratio = r.ratio ? vsEarth(b, r.key) : null;
      if (ratio) hasRatio = true;
      rows.push([r.label, r.val(v), ratio || '']);
    });

    var name = esc(b.name);
    var notes = [];
    if (k.giant) {
      notes.push(name + ' tidak punya permukaan padat. Gravitasi dan suhunya dinyatakan pada lapisan atmosfer bertekanan 1 bar, ' +
        'kira-kira sama dengan tekanan udara di permukaan laut Bumi.');
    }
    if (b.rotation_period_h < 0) {
      notes.push('Retrograd: ' + name + ' berputar berlawanan arah dengan putaran sebagian besar planet.');
    }
    if (b.orbital_inclination_deg > 90) {
      notes.push('Orbit retrograd: ' + name + ' mengelilingi Matahari berlawanan arah dengan planet-planet.');
    }
    if (missing.length) notes.push('Data ' + listJoin(missing) + ' belum tersedia di situs ini.');
    if (!rows.length && !notes.length) return '';

    // Di ponsel kolom "Dibanding Bumi" disembunyikan dan rasionya tampil di bawah nilai (lihat CSS).
    var table = rows.length ? '<div class="table-wrap" data-label="Data fisik dan orbit ' + name + '"><table class="data-table ens-data">' +
      '<caption>Data fisik dan orbit ' + name + '</caption><thead><tr><th scope="col">Besaran</th><th scope="col">Nilai</th>' +
      (hasRatio ? '<th scope="col" class="ens-ratio-col">Dibanding Bumi</th>' : '') + '</tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] +
          (r[2] ? '<span class="ens-ratio-inline">' + r[2] + '</span>' : '') + '</td>' +
          (hasRatio ? '<td class="ens-ratio-col">' + r[2] + '</td>' : '') + '</tr>';
      }).join('') + '</tbody></table></div>' : '';
    var notesHtml = notes.length ? '<div class="entry__notes small muted">' +
      notes.map(function (n) { return '<p>' + n + '</p>'; }).join('') + '</div>' : '';
    return section('Data lengkap', table + notesHtml);
  }

  /* ---------- Bulan dan misi ---------- */

  function moonsSection(b) {
    var list = b.moonList || [];
    if (!list.length) return '';
    var name = esc(b.name);
    function num(v, digits) { return v == null ? null : fmt(v, digits); }
    // Kolom yang semua nilainya kosong untuk benda ini tidak ditampilkan.
    var cols = [
      { head: 'Diameter rata-rata (km)', n: true, get: function (m) { return m.radius_km == null ? null : num(2 * m.radius_km, 2 * m.radius_km < 100 ? 1 : 0); } },
      { head: 'Jarak rata-rata dari ' + name + ' (km)', n: true, get: function (m) { return num(m.distance_km, 0); } },
      { head: 'Periode orbit (hari)', n: true, get: function (m) { return m.period_days == null ? null : num(m.period_days, m.period_days < 10 ? 2 : 1); } },
      {
        head: 'Ditemukan', get: function (m) {
          var s = [m.discovered, m.discoverer].filter(function (v) { return v != null && v !== ''; }).join(', ');
          return s ? esc(s) : null;
        }
      },
      { head: 'Catatan', cls: 'ens-note', get: function (m) { return m.note ? esc(m.note) : null; } }
    ].filter(function (c) { return list.some(function (m) { return c.get(m) != null; }); });

    var retro = false;
    var body = list.map(function (m) {
      var linked = App.bodies(function (x) { return x.name === m.name && x.id !== b.id; })[0];
      var cell = linked ? '<a href="#' + esc(linked.id) + '">' + esc(m.name) + '</a>' : esc(m.name);
      if (m.retrograde) {
        retro = true;
        cell += '<span class="ens-retro small muted">orbit retrograd</span>';
      }
      return '<tr role="row"><th scope="row" role="rowheader">' + cell + '</th>' + cols.map(function (c) {
        var v = c.get(m);
        var cls = [c.n ? 'n' : '', c.cls || ''].filter(Boolean).join(' ');
        return '<td role="cell" data-label="' + c.head + '"' + (cls ? ' class="' + cls + '"' : '') + '>' +
          (v == null ? '<span class="muted">tidak ada data</span>' : v) + '</td>';
      }).join('') + '</tr>';
    }).join('');

    var total = b.moons;
    var dateText = asOf(b);
    var caption = (total != null && total > list.length ?
      fmt(list.length, 0) + ' dari ' + fmt(total, 0) + ' bulan ' + name + ' yang diketahui' :
      'Semua bulan ' + name + ' yang diketahui') + (dateText ? ' (' + dateText + ')' : '') + '.';
    var title = (total != null && total > list.length ? 'Bulan utama ' : 'Bulan ') + name;

    // Peran ARIA ditulis eksplisit karena di ponsel tabel ini ditampilkan bertumpuk (display: block),
    // dan sebagian browser lalu berhenti membacanya sebagai tabel.
    return section(title,
      '<div class="table-wrap" data-label="Tabel ' + title + '"><table class="data-table ens-moons" role="table"><caption>' + caption + '</caption>' +
      '<thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Nama</th>' + cols.map(function (c) {
        return '<th scope="col" role="columnheader"' + (c.n ? ' class="n"' : '') + '>' + c.head + '</th>';
      }).join('') + '</tr></thead><tbody role="rowgroup">' + body + '</tbody></table></div>' +
      (retro ? '<div class="entry__notes small muted"><p>Orbit retrograd: bulan itu beredar berlawanan arah dengan arah rotasi planetnya.</p></div>' : ''));
  }

  function missionsSection(b) {
    var list = b.missions || [];
    if (!list.length) return '';
    return section('Misi antariksa', '<ul class="missions">' + list.map(function (m) {
      var meta = [m.agency, m.years].filter(Boolean).join(' · ');
      return '<li><h4>' + esc(m.name) + '</h4>' + (meta ? '<p class="small muted">' + esc(meta) + '</p>' : '') +
        (m.note ? '<p>' + esc(m.note) + '</p>' : '') + '</li>';
    }).join('') + '</ul>');
  }

  function actions(b) {
    var links = [];
    if (b.orbit || b.id === 'sun' || b.id === 'moon') {
      links.push('<a class="btn btn--primary" href="jelajah.html#' + esc(b.id) + '">Lihat di Jelajah 3D</a>');
    }
    var other = b.id === 'earth' ? App.body('mars') : EARTH;
    if (other) {
      links.push('<a class="btn" href="bandingkan.html?a=' + esc(b.id) + '&amp;b=' + esc(other.id) + '">Bandingkan dengan ' + esc(other.name) + '</a>');
    }
    return links.length ? '<div class="row entry__actions no-print">' + links.join('') + '</div>' : '';
  }

  function pager(id) {
    var i = entries.indexOf(byId[id]);
    var prev = entries[i - 1], next = entries[i + 1];
    function link(e, cls, label, rel) {
      return '<a class="' + cls + '" href="#' + esc(e.id) + '" rel="' + rel + '"><span class="small muted">' + label +
        '</span><span class="pager__name">' + esc(e.name) + '</span></a>';
    }
    return '<nav class="pager no-print" aria-label="Entri sebelum dan sesudahnya">' +
      (prev ? link(prev, 'pager__prev', 'Sebelumnya', 'prev') : '') +
      (next ? link(next, 'pager__next', 'Berikutnya', 'next') : '') + '</nav>';
  }

  /* ---------- Tampilan entri ---------- */

  function renderBody(b) {
    var k = {
      star: b.type === 'star',
      giant: b.type === 'gas_giant' || b.type === 'ice_giant',
      comet: b.type === 'comet',
      near: b.parent === 'earth'
    };
    var photo = b.image && b.image.src ? figure(b.image) : '';
    var plates = keyPlates(b, k);
    var ruler = rulerSpecBody(b);

    article.innerHTML = head(b.category, b.name, b.tagline) +
      (photo || plates ? '<div class="entry__top' + (photo ? ' entry__top--photo' : '') + '">' + photo +
        (plates ? '<dl class="plates">' + plates + '</dl>' : '') + '</div>' : '') +
      (ruler ? rulerSection(ruler) : '') +
      textSections(b) + dataSection(b, k) + moonsSection(b) + missionsSection(b) + actions(b) + pager(b.id);

    if (ruler) drawRuler(ruler);
    var img = article.querySelector('.entry__photo img');
    if (img) {
      // Berkas foto hilang: tampilkan entri tanpa foto, bukan gambar rusak.
      img.addEventListener('error', function () {
        var top = img.closest('.entry__top');
        img.closest('figure').remove();
        if (top) top.classList.remove('entry__top--photo');
      });
    }
  }

  function renderRegion(r) {
    var key = REGION_BAND[r.id];
    var range = key && CONST[key];
    var ruler = range ? { band: range, caption: 'Pita kuning menandai perkiraan letak ' + esc(regionInText(r.name)) + '.' + LOG_NOTE } : null;
    article.innerHTML = head('Wilayah tata surya', r.name, r.tagline) + (ruler ? rulerSection(ruler) : '') +
      textSections(r) + pager(r.id);
    if (ruler) drawRuler(ruler);
  }

  function renderNotFound(raw) {
    var shown = raw.length > 40 ? raw.slice(0, 40) + '…' : raw;
    article.innerHTML = '<h2 class="entry__name" id="entry-title" tabindex="-1">Entri tidak ditemukan</h2>' +
      '<div class="notice">Ensiklopedia ini tidak punya entri dengan alamat <strong class="ens-hash">#' + esc(shown) +
      '</strong>. Mungkin tautannya salah ketik. Pilih salah satu entri di bawah ini.</div>' +
      '<div class="ens-all">' + groups.map(function (g) {
        return '<h3>' + esc(g.label) + '</h3><ul class="chip-list">' + g.items.map(function (x) {
          var e = byId[x.id];
          return '<li><a class="chip" href="#' + esc(e.id) + '">' + dot(e.color) + esc(e.name) + '</a></li>';
        }).join('') + '</ul>';
      }).join('') + '</div>';
  }

  /* ---------- Daftar entri dan navigasi ---------- */

  function renderIndex() {
    indexNav.innerHTML = groups.map(function (g, gi) {
      return '<p class="ens-index__label" id="ens-g' + gi + '">' + esc(g.label) + '</p><ul aria-labelledby="ens-g' + gi + '">' +
        g.items.map(function (x) {
          var e = byId[x.id];
          return '<li><a href="#' + esc(e.id) + '" data-id="' + esc(e.id) + '">' + dot(e.color) + esc(e.name) + '</a></li>';
        }).join('') + '</ul>';
    }).join('');
    select.innerHTML = groups.map(function (g) {
      return '<optgroup label="' + esc(g.label) + '">' + g.items.map(function (x) {
        return '<option value="' + esc(x.id) + '">' + esc(x.name) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
  }

  // Gulir daftar samping (bukan halaman) supaya entri terpilih terlihat.
  function revealInIndex(a) {
    var top = a.offsetTop, bottom = top + a.offsetHeight;
    if (top < indexNav.scrollTop) indexNav.scrollTop = top - 8;
    else if (bottom > indexNav.scrollTop + indexNav.clientHeight) indexNav.scrollTop = bottom - indexNav.clientHeight + 8;
  }

  // reveal: gulir daftar samping ke entri terpilih (hanya saat pengguna berpindah entri;
  // saat halaman baru dibuka daftar dibaca dari atas).
  function markCurrent(id, reveal) {
    [].forEach.call(indexNav.querySelectorAll('a'), function (a) {
      if (a.getAttribute('data-id') === id) {
        a.setAttribute('aria-current', 'true');
        if (reveal) revealInIndex(a);
      } else {
        a.removeAttribute('aria-current');
      }
    });
    if (id) {
      select.value = id;
    } else {
      select.selectedIndex = -1;
      indexNav.scrollTop = 0;
    }
  }

  // Tabel yang lebih lebar dari layarnya bisa digulir dengan papan ketik.
  function markScrollers() {
    [].forEach.call(article.querySelectorAll('.table-wrap'), function (w) {
      if (w.scrollWidth > w.clientWidth + 1) {
        w.tabIndex = 0;
        w.setAttribute('role', 'region');
        w.setAttribute('aria-label', w.getAttribute('data-label'));
      } else {
        w.removeAttribute('tabindex');
        w.removeAttribute('role');
        w.removeAttribute('aria-label');
      }
    });
  }

  function focusHeading() {
    var h = document.getElementById('entry-title');
    if (!h) return;
    var header = document.querySelector('.site-header');
    var top = article.getBoundingClientRect().top - (header ? header.offsetHeight : 0) - 16;
    if (top < 0) window.scrollBy(0, top);
    h.focus({ preventScroll: true });
  }

  function hashValue() {
    var raw = location.hash.replace(/^#/, '');
    try {
      raw = decodeURIComponent(raw);
    } catch (err) { /* hash tidak sah: pakai apa adanya */ }
    return raw.trim();
  }

  var rendered = false;
  var selectTarget = null; // id yang baru dipilih lewat <select>

  function route(userNav) {
    var raw = hashValue();
    var id = raw.toLowerCase() || 'sun';
    if (!byId[id] && raw && document.getElementById(raw)) {
      // Tautan ke bagian halaman (misalnya "Langsung ke isi"), bukan entri: entri yang tampil dibiarkan.
      if (rendered) return;
      id = 'sun';
    }
    var e = byId[id] || null;
    if (!e) renderNotFound(raw);
    else if (e.region) renderRegion(e.data);
    else renderBody(e.data);
    rendered = true;
    markCurrent(e ? e.id : null, userNav);
    markScrollers();
    document.title = (e ? e.name : 'Entri tidak ditemukan') + ' | Ensiklopedia | Interactive Solar System';
    // Pilihan lewat <select>: fokus dibiarkan (tombol panah bisa terus dipakai); cukup diumumkan.
    // Pesan dikosongkan pada perpindahan lain supaya pilihan yang sama nanti diumumkan lagi.
    var viaSelect = userNav && selectTarget === id;
    selectTarget = null;
    status.textContent = viaSelect ? 'Menampilkan ' + e.name + '.' : '';
    if (userNav && !viaSelect) focusHeading();
  }

  renderIndex();
  route(false);

  window.addEventListener('hashchange', function () { route(true); });
  select.addEventListener('change', function () {
    if (!select.value) return;
    selectTarget = select.value;
    location.hash = select.value;
  });

  var resizeQueued = false;
  window.addEventListener('resize', function () {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(function () {
      resizeQueued = false;
      markScrollers();
    });
  });
})();
