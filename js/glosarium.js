/*
 * glosarium.js: daftar istilah dari SOLAR_DATA.glossary.
 * Pencarian langsung (huruf besar-kecil dan tanda aksen dianggap sama), indeks huruf awal,
 * tautan "Lihat juga", dan glosarium.html#slug yang menggulir ke istilah lalu menyorotnya.
 */
(function () {
  'use strict';

  if (!window.App || !App.data) return;

  function byId(id) { return document.getElementById(id); }

  var root = byId('glossary');
  var input = byId('g-search');
  var count = byId('g-count');
  var lettersNav = byId('g-letters-nav');
  var letters = byId('g-letters');
  var list = byId('g-list');
  var empty = byId('g-empty');
  var emptyQ = byId('g-empty-q');
  var missing = byId('g-missing');

  // Huruf kecil tanpa tanda aksen, jadi "kuípér" tetap menemukan "Kuiper".
  function fold(s) {
    return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function letterOf(term) {
    var c = fold(term).charAt(0).toUpperCase();
    return /[A-Z]/.test(c) ? c : '#';
  }

  function groupId(letter) {
    return 'huruf-' + (letter === '#' ? 'lain' : letter.toLowerCase());
  }

  function letterLabel(letter) {
    return letter === '#' ? '0-9' : letter;
  }

  function decode(s) {
    try { return decodeURIComponent(s); } catch (e) { return s; }
  }

  var terms = (App.data.glossary || []).filter(function (g) { return g && g.term && g.slug; })
    .sort(function (a, b) { return a.term.localeCompare(b.term, 'id', { sensitivity: 'base' }); });

  root.hidden = false;
  if (!terms.length) {
    root.innerHTML = '<p class="notice">Daftar istilah belum tersedia di data situs ini. Coba muat ulang halaman; bila masih kosong, berkas js/data.js perlu dibuat ulang.</p>';
    return;
  }

  var bySlug = {};
  terms.forEach(function (g) { bySlug[g.slug] = g; });

  var groupOrder = [], groups = {};
  terms.forEach(function (g) {
    var letter = letterOf(g.term);
    if (!groups[letter]) { groups[letter] = []; groupOrder.push(letter); }
    groups[letter].push({ g: g, letter: letter, hay: fold(g.term + ' ' + g.definition) });
  });

  function seeAlso(g) {
    var links = (g.see || []).filter(function (s) { return bySlug[s] && s !== g.slug; }).map(function (s) {
      return '<a href="#' + App.esc(s) + '">' + App.esc(bySlug[s].term) + '</a>';
    });
    return links.length ? '<p class="term__see">Lihat juga: ' + links.join(', ') + '</p>' : '';
  }

  // Daftar dibangun sekali; pencarian hanya menyembunyikan dan menampilkan entri.
  // Tujuan #slug dan #huruf-x sengaja tidak memakai atribut id: lompatan bawaan browser saat halaman
  // selesai dimuat akan menimpa posisi gulir dan fokus yang diatur goToHash().
  list.innerHTML = groupOrder.map(function (letter) {
    var id = groupId(letter);
    return '<section class="letter-group" data-group="' + id + '">' +
      '<h2 class="letter-group__title" tabindex="-1">' + letterLabel(letter) + '</h2>' +
      '<dl class="terms">' + groups[letter].map(function (e) {
        return '<div class="term" data-slug="' + App.esc(e.g.slug) + '" tabindex="-1">' +
          '<dt>' + App.esc(e.g.term) + '</dt>' +
          '<dd><p>' + App.esc(e.g.definition) + '</p>' + seeAlso(e.g) + '</dd>' +
          '</div>';
      }).join('') + '</dl></section>';
  }).join('');

  var entries = [], entryBySlug = {}, groupEls = {};
  var termEls = list.querySelectorAll('.term');
  groupOrder.forEach(function (letter) {
    groupEls[letter] = list.querySelector('[data-group="' + groupId(letter) + '"]');
    groups[letter].forEach(function (e) {
      e.el = termEls[entries.length];
      entries.push(e);
      entryBySlug[e.g.slug] = e;
    });
  });

  /* ---------- Pencarian ---------- */

  var countTimer = null;

  function apply(query) {
    var text = query.trim();
    var tokens = fold(text).split(/\s+/).filter(Boolean);
    var shown = 0, present = {};
    entries.forEach(function (e) {
      var ok = tokens.every(function (t) { return e.hay.indexOf(t) !== -1; });
      e.el.hidden = !ok;
      if (ok) { shown++; present[e.letter] = true; }
    });
    groupOrder.forEach(function (letter) { groupEls[letter].hidden = !present[letter]; });

    letters.innerHTML = groupOrder.filter(function (l) { return present[l]; }).map(function (l) {
      return '<li><a href="#' + groupId(l) + '">' + letterLabel(l) + '</a></li>';
    }).join('');
    lettersNav.hidden = !shown;
    empty.hidden = shown > 0;
    emptyQ.textContent = text;
    // Saat kosong, pemberitahuan di daftar sudah menyebut hal yang sama; hitungan cukup untuk pembaca layar.
    count.classList.toggle('visually-hidden', !shown);

    var message = !tokens.length ? terms.length + ' istilah'
      : shown ? shown + ' dari ' + terms.length + ' istilah cocok dengan "' + text + '"'
      : 'Tidak ada istilah yang cocok dengan "' + text + '"';
    // Jeda singkat agar pembaca layar tidak membacakan jumlah pada setiap ketukan.
    clearTimeout(countTimer);
    countTimer = setTimeout(function () { count.textContent = message; }, tokens.length ? 350 : 0);
  }

  function clearSearch() {
    input.value = '';
    apply('');
  }

  input.addEventListener('input', function () { apply(input.value); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && input.value) {
      e.preventDefault();
      clearSearch();
    }
  });
  byId('g-clear').addEventListener('click', function () {
    clearSearch();
    input.focus();
  });

  /* ---------- Tautan #slug ---------- */

  var target = null;

  // scrollIntoView memakai scroll-padding-top dari style.css, jadi tujuan berhenti di bawah kepala halaman.
  function goToHash() {
    var id = decode(location.hash.slice(1));
    if (target) target.el.classList.remove('is-target');
    target = null;
    missing.hidden = true;
    if (!id) return;

    var e = entryBySlug[id];
    if (e) {
      if (e.el.hidden) clearSearch();
      e.el.classList.add('is-target');
      target = e;
      e.el.scrollIntoView({ block: 'start' });
      e.el.focus({ preventScroll: true });
      return;
    }
    var letter = groupOrder.filter(function (l) { return groupId(l) === id; })[0];
    if (letter) {
      if (groupEls[letter].hidden) clearSearch();
      groupEls[letter].scrollIntoView({ block: 'start' });
      groupEls[letter].querySelector('h2').focus({ preventScroll: true });
      return;
    }
    // Tujuan yang memang punya id, misalnya #main dari tautan "Langsung ke isi", diurus browser.
    if (document.getElementById(id)) return;
    missing.textContent = 'Istilah "' + id + '" tidak ada di glosarium. Pilih istilah lain dari daftar di bawah.';
    missing.hidden = false;
    missing.scrollIntoView({ block: 'nearest' });
  }

  // Tautan ke istilah yang sedang tersaring: kosongkan pencarian dulu agar tujuannya tampak.
  root.addEventListener('click', function (ev) {
    var a = ev.target.closest('a[href^="#"]');
    if (!a) return;
    var e = entryBySlug[decode(a.getAttribute('href').slice(1))];
    if (e && e.el.hidden) clearSearch();
    // Hash yang sama tidak memicu hashchange, jadi sorot langsung.
    if (a.getAttribute('href') === location.hash) {
      ev.preventDefault();
      goToHash();
    }
  });

  window.addEventListener('hashchange', function () { goToHash(); });

  // Browser bisa memulihkan isi kotak pencarian saat pengguna kembali ke halaman ini.
  apply(input.value);
  goToHash();
})();
