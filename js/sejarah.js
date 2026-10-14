/*
 * sejarah.js: linimasa dari SOLAR_DATA.timeline dengan saringan kategori.
 * Tahun negatif berarti sebelum Masehi (SM). Tanggal lengkap hanya ditulis bila harinya diketahui.
 */
(function () {
  'use strict';

  if (!window.App || !App.data) return;

  var CATEGORIES = [
    { key: 'semua', label: 'Semua' },
    { key: 'pengamatan', label: 'Pengamatan' },
    { key: 'teori', label: 'Teori' },
    { key: 'penemuan', label: 'Penemuan' },
    { key: 'misi', label: 'Misi' },
    { key: 'indonesia', label: 'Indonesia' }
  ];

  function byId(id) { return document.getElementById(id); }

  var root = byId('history');
  var filters = byId('h-filters');
  var countEl = byId('h-count');
  var list = byId('h-list');
  var empty = byId('h-empty');
  var emptyCat = byId('h-empty-cat');

  function categoryLabel(key) {
    for (var k = 0; k < CATEGORIES.length; k++) if (CATEGORIES[k].key === key) return CATEGORIES[k].label;
    return key ? key.charAt(0).toUpperCase() + key.slice(1) : '';
  }

  function yearText(year) {
    return year < 0 ? Math.abs(year) + ' SM' : String(year);
  }

  var events = (App.data.timeline || []).filter(function (t) { return t && t.title && isFinite(t.year); })
    .sort(function (a, b) { return a.year - b.year || String(a.date).localeCompare(String(b.date)); });

  root.hidden = false;
  if (!events.length) {
    root.innerHTML = '<p class="notice">Data linimasa belum tersedia di data situs ini. Coba muat ulang halaman; bila masih kosong, berkas js/data.js perlu dibuat ulang.</p>';
    return;
  }

  list.innerHTML = events.map(function (t) {
    // App.fromInputDate hanya menerima "YYYY-MM-DD", jadi tanggal berisi tahun saja menghasilkan null.
    var day = App.fromInputDate(t.date);
    var when;
    if (day) {
      when = '<span class="tl-year" aria-hidden="true">' + yearText(t.year) + '</span>' +
        '<time class="tl-date" datetime="' + App.esc(t.date) + '">' + App.fmtDate(day) + '</time>';
    } else if (t.year > 0) {
      when = '<time class="tl-year" datetime="' + String(t.year).padStart(4, '0') + '">' + t.year + '</time>';
    } else {
      when = '<span class="tl-year">' + yearText(t.year) + '</span>';
    }
    return '<li class="tl-item" data-cat="' + App.esc(t.category) + '">' +
      '<div class="tl-when">' + when + '</div>' +
      '<div class="tl-body">' +
      '<p class="tl-cat">' + App.esc(categoryLabel(t.category)) + '</p>' +
      '<h2 class="tl-title">' + App.esc(t.title) + '</h2>' +
      (t.detail ? '<p class="tl-detail">' + App.esc(t.detail) + '</p>' : '') +
      '</div></li>';
  }).join('');

  var counts = {};
  events.forEach(function (t) { counts[t.category] = (counts[t.category] || 0) + 1; });

  filters.innerHTML = CATEGORIES.map(function (c) {
    var n = c.key === 'semua' ? events.length : (counts[c.key] || 0);
    return '<button type="button" class="chip" data-cat="' + c.key + '" aria-pressed="false">' +
      c.label + ' <span class="chip__count">' + n + '</span></button>';
  }).join('');

  var items = list.querySelectorAll('.tl-item');

  function setFilter(key) {
    var shown = [];
    Array.prototype.forEach.call(filters.querySelectorAll('.chip'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === key));
    });
    Array.prototype.forEach.call(items, function (li, k) {
      var ok = key === 'semua' || li.getAttribute('data-cat') === key;
      li.hidden = !ok;
      if (ok) shown.push(events[k]);
    });
    list.hidden = !shown.length;
    empty.hidden = shown.length > 0;
    emptyCat.textContent = categoryLabel(key);
    // Saat kosong, pemberitahuan di bawah sudah menyebutnya; hitungan cukup untuk pembaca layar.
    countEl.classList.toggle('visually-hidden', !shown.length);

    if (!shown.length) {
      countEl.textContent = 'Tidak ada peristiwa dalam kategori ' + categoryLabel(key) + '.';
      return;
    }
    var first = shown[0].year, last = shown[shown.length - 1].year;
    var range = first === last ? yearText(first) : yearText(first) + ' sampai ' + yearText(last);
    countEl.textContent = key === 'semua'
      ? 'Menampilkan semua ' + shown.length + ' peristiwa, ' + range + '.'
      : 'Menampilkan ' + shown.length + ' dari ' + events.length + ' peristiwa dalam kategori ' +
        categoryLabel(key) + ', ' + range + '.';
  }

  filters.addEventListener('click', function (e) {
    var btn = e.target.closest('.chip');
    if (btn) setFilter(btn.getAttribute('data-cat'));
  });

  byId('h-show-all').addEventListener('click', function () {
    setFilter('semua');
    filters.querySelector('[data-cat="semua"]').focus();
  });

  setFilter('semua');
})();
