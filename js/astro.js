/*
 * astro.js: perhitungan astronomi untuk Interactive Solar System.
 *
 * Berkas ini tidak menyentuh DOM, jadi bisa dipakai di browser (variabel global Astro)
 * dan diuji di Node (node tests/test_astro.js).
 *
 * Posisi planet memakai elemen Kepler JPL "Approximate Positions of the Planets", Tabel 1
 * (berlaku 1800-2050). Hasilnya koordinat heliosentris pada bidang ekliptika J2000, dalam SA.
 * Posisi Bulan dan Matahari untuk fase Bulan memakai suku-suku terbesar dari
 * Jean Meeus, Astronomical Algorithms (bab 25 dan 47), ekliptika tanggal itu.
 */
(function (root) {
  'use strict';

  var DEG = Math.PI / 180;
  var J2000 = 2451545.0; // 1 Januari 2000 pukul 12.00 TT, dalam hari Julian
  var AU_KM = 149597870.7;
  var C_KM_S = 299792.458;
  var SYNODIC_RATE = 360 / 29.530588853; // laju rata-rata elongasi Bulan, derajat per hari

  // Batas tanggal yang didukung Tabel 1 JPL, dalam waktu lokal perangkat supaya tampil sebagai
  // 1 Januari 1800 dan 31 Desember 2050 di zona waktu mana pun (WIB, WITA, WIT).
  var MIN_DATE = new Date(1800, 0, 1);
  var MAX_DATE = new Date(2050, 11, 31, 23, 59);

  function norm360(x) {
    x %= 360;
    if (x < 0) x += 360;
    return x === 360 ? 0 : x; // -1e-15 + 360 dibulatkan menjadi 360
  }

  function norm180(x) {
    x = norm360(x);
    return x > 180 ? x - 360 : x;
  }

  // Hari Julian dari objek Date (UTC). Selisih UTC dan TT (sekitar 1 menit) diabaikan.
  function jdFromDate(date) {
    return date.getTime() / 86400000 + 2440587.5;
  }

  function dateFromJd(jd) {
    return new Date((jd - 2440587.5) * 86400000);
  }

  // Persamaan Kepler M = E - e sin E, diselesaikan dengan metode Newton (sudut dalam radian).
  // Tebakan awal M + 0,85 e tanda(sin M) tetap konvergen untuk orbit sangat lonjong (Komet Halley).
  function solveKepler(M, e) {
    var E = M + 0.85 * e * (Math.sin(M) >= 0 ? 1 : -1);
    for (var k = 0; k < 50; k++) {
      var dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-12) break;
    }
    return E;
  }

  // Ceres dan Halley punya beberapa set elemen (orbit.segments), masing-masing berlaku di sekitar
  // epoch-nya. Pilih set yang rentang berlakunya memuat jd.
  function segmentAt(segments, jd) {
    for (var k = 0; k < segments.length; k++) {
      var s = segments[k];
      if ((s.from_jd === null || jd >= s.from_jd) && (s.to_jd === null || jd < s.to_jd)) return s;
    }
    return segments[segments.length - 1];
  }

  // Elemen orbit pada tanggal tertentu: nilai J2000 ditambah laju per abad Julian.
  function elementsAt(orbit, jd) {
    if (orbit.segments) orbit = segmentAt(orbit.segments, jd);
    var T = (jd - J2000) / 36525;
    return {
      a: orbit.a_au + orbit.a_rate * T,
      e: orbit.e + orbit.e_rate * T,
      i: orbit.i_deg + orbit.i_rate * T,
      L: orbit.L_deg + orbit.L_rate * T,
      peri: orbit.peri_deg + orbit.peri_rate * T,
      node: orbit.node_deg + orbit.node_rate * T
    };
  }

  // Putar titik di bidang orbit (x' ke arah perihelion) ke bidang ekliptika J2000.
  function toEcliptic(xp, yp, el) {
    var w = (el.peri - el.node) * DEG; // argumen perihelion
    var O = el.node * DEG;             // bujur simpul naik
    var I = el.i * DEG;                // inklinasi
    var cw = Math.cos(w), sw = Math.sin(w);
    var cO = Math.cos(O), sO = Math.sin(O);
    var cI = Math.cos(I), sI = Math.sin(I);
    return {
      x: (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
      y: (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
      z: (sw * sI) * xp + (cw * sI) * yp
    };
  }

  function keplerPosition(orbit, jd) {
    var el = elementsAt(orbit, jd);
    var M = norm180(el.L - el.peri) * DEG; // anomali rata-rata
    var E = solveKepler(M, el.e);
    var xp = el.a * (Math.cos(E) - el.e);
    var yp = el.a * Math.sqrt(1 - el.e * el.e) * Math.sin(E);
    return toEcliptic(xp, yp, el);
  }

  // Posisi heliosentris {x, y, z} dalam SA.
  // Untuk Ceres dan Halley: hitung dengan dua set elemen yang epoch-nya mengapit jd, lalu campur
  // menurut jarak waktunya. Gerakannya jadi mulus, tanpa lompatan saat berganti set.
  function helioPosition(orbit, jd) {
    var segs = orbit.segments;
    if (!segs) return keplerPosition(orbit, jd);
    var k = 0;
    while (k < segs.length - 1 && segs[k + 1].epoch_jd <= jd) k++;
    if (k === segs.length - 1 || jd <= segs[k].epoch_jd) return keplerPosition(segs[k], jd);
    var w = (jd - segs[k].epoch_jd) / (segs[k + 1].epoch_jd - segs[k].epoch_jd);
    var p = keplerPosition(segs[k], jd), q = keplerPosition(segs[k + 1], jd);
    return { x: p.x + (q.x - p.x) * w, y: p.y + (q.y - p.y) * w, z: p.z + (q.z - p.z) * w };
  }

  // Titik-titik satu putaran orbit penuh (elips) memakai elemen pada tanggal jd.
  function orbitPath(orbit, jd, n) {
    n = n || 256;
    var el = elementsAt(orbit, jd);
    var b = el.a * Math.sqrt(1 - el.e * el.e);
    var pts = [];
    for (var k = 0; k <= n; k++) {
      var E = (k / n) * 2 * Math.PI;
      pts.push(toEcliptic(el.a * (Math.cos(E) - el.e), b * Math.sin(E), el));
    }
    return pts;
  }

  function length(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  // Bujur dan lintang ekliptika (derajat) dari sebuah vektor.
  function lonLat(v) {
    var r = length(v);
    return { lon: norm360(Math.atan2(v.y, v.x) / DEG), lat: Math.asin(v.z / r) / DEG, r: r };
  }

  // Benda dilihat dari Bumi. earthPos = posisi heliosentris Bumi (barisan "earth" di orbits.csv,
  // yaitu pusat massa Bumi-Bulan; bedanya dengan pusat Bumi kurang dari 5.000 km).
  // Hasil: jarak (SA), bujur/lintang geosentris, elongasi dari Matahari (derajat) dan
  // east = true bila benda di timur Matahari (terlihat di langit senja).
  function fromEarth(bodyPos, earthPos) {
    var v = { x: bodyPos.x - earthPos.x, y: bodyPos.y - earthPos.y, z: bodyPos.z - earthPos.z };
    var sun = { x: -earthPos.x, y: -earthPos.y, z: -earthPos.z };
    var g = lonLat(v);
    var s = lonLat(sun);
    var cosE = (v.x * sun.x + v.y * sun.y + v.z * sun.z) / (g.r * s.r);
    var elong = Math.acos(Math.max(-1, Math.min(1, cosE))) / DEG;
    return { dist: g.r, lon: g.lon, lat: g.lat, elongation: elong, east: norm180(g.lon - s.lon) > 0 };
  }

  // Perkiraan kapan benda bisa dilihat, dari elongasinya saja (tanpa lokasi pengamat).
  // 'sun-glare' : terlalu dekat Matahari
  // 'all-night' : dekat oposisi, terlihat hampir sepanjang malam
  // 'evening'   : di timur Matahari, terlihat setelah Matahari terbenam
  // 'morning'   : di barat Matahari, terlihat sebelum Matahari terbit
  function visibility(elongation, east) {
    if (elongation < 15) return 'sun-glare';
    if (elongation >= 150) return 'all-night';
    return east ? 'evening' : 'morning';
  }

  // Bujur geometris Matahari (derajat, ekuinoks tanggal itu). Meeus bab 25, ketelitian sekitar 0,01 derajat.
  function sunLongitude(jd) {
    var T = (jd - J2000) / 36525;
    var L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    var M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * DEG;
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
      (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
      0.000289 * Math.sin(3 * M);
    return norm360(L0 + C);
  }

  // Posisi Bulan dilihat dari pusat Bumi: bujur dan lintang ekliptika (derajat, ekuinoks tanggal itu)
  // dan jarak (km). Suku-suku terbesar Meeus bab 47, ketelitian bujur sekitar 0,05 derajat.
  function moonPosition(jd) {
    var d = jd - J2000;
    var Lp = 218.3164477 + 13.17639648 * d;          // bujur rata-rata Bulan
    var D = (297.8501921 + 12.19074912 * d) * DEG;   // elongasi rata-rata
    var M = (357.5291092 + 0.98560028 * d) * DEG;    // anomali rata-rata Matahari
    var Mp = (134.9633964 + 13.06499295 * d) * DEG;  // anomali rata-rata Bulan
    var F = (93.2720950 + 13.22935024 * d) * DEG;    // argumen lintang Bulan
    var sin = Math.sin, cos = Math.cos;
    var lon = Lp +
      6.288774 * sin(Mp) +
      1.274027 * sin(2 * D - Mp) +
      0.658314 * sin(2 * D) +
      0.213618 * sin(2 * Mp) -
      0.185116 * sin(M) -
      0.114332 * sin(2 * F) +
      0.058793 * sin(2 * D - 2 * Mp) +
      0.057066 * sin(2 * D - M - Mp) +
      0.053322 * sin(2 * D + Mp) +
      0.045758 * sin(2 * D - M) -
      0.040923 * sin(M - Mp) -
      0.034720 * sin(D) -
      0.030383 * sin(M + Mp);
    var lat =
      5.128122 * sin(F) +
      0.280602 * sin(Mp + F) +
      0.277693 * sin(Mp - F) +
      0.173237 * sin(2 * D - F) +
      0.055413 * sin(2 * D - Mp + F) +
      0.046271 * sin(2 * D - Mp - F);
    // 18 suku jarak terbesar tabel 47.A; selisih dengan JPL Horizons paling besar sekitar 150 km.
    var distKm = 385000.56 -
      20905.355 * cos(Mp) -
      3699.111 * cos(2 * D - Mp) -
      2955.968 * cos(2 * D) -
      569.925 * cos(2 * Mp) +
      246.158 * cos(2 * D - 2 * Mp) -
      204.586 * cos(2 * D - M) -
      170.733 * cos(2 * D + Mp) -
      152.138 * cos(2 * D - M - Mp) -
      129.620 * cos(M - Mp) +
      108.743 * cos(D) +
      104.755 * cos(M + Mp) +
      79.661 * cos(Mp - 2 * F) +
      48.888 * cos(M) -
      34.782 * cos(4 * D - Mp) +
      30.824 * cos(2 * D + M) +
      24.208 * cos(2 * D + M - Mp) -
      23.210 * cos(3 * Mp) -
      21.636 * cos(4 * D - 2 * Mp);
    return { lon: norm360(lon), lat: lat, distKm: distKm };
  }

  // Nama fase dari elongasi (0 = Bulan baru, 90 = kuartal pertama, 180 = purnama, 270 = kuartal akhir).
  // Fase utama diberi rentang 24 derajat, sekitar satu hari di sekitar saat tepatnya.
  function phaseKey(elongation) {
    var e = norm360(elongation);
    if (e < 12 || e >= 348) return 'new';
    if (e < 78) return 'waxing-crescent';
    if (e < 102) return 'first-quarter';
    if (e < 168) return 'waxing-gibbous';
    if (e < 192) return 'full';
    if (e < 258) return 'waning-gibbous';
    if (e < 282) return 'last-quarter';
    return 'waning-crescent';
  }

  function elongationAt(jd) {
    return norm360(moonPosition(jd).lon - sunLongitude(jd));
  }

  // Cari saat elongasi Bulan tepat sama dengan target (derajat), mulai dari tebakan jd0.
  function refinePhase(jd0, target) {
    var jd = jd0;
    for (var k = 0; k < 12; k++) {
      var diff = norm180(elongationAt(jd) - target);
      jd -= diff / SYNODIC_RATE;
      if (Math.abs(diff) < 1e-6) break;
    }
    return jd;
  }

  // Keadaan Bulan pada jd: elongasi, bagian yang tersinari (0-1), umur sejak Bulan baru (hari),
  // nama fase, dan apakah sedang membesar.
  function moonPhase(jd) {
    var m = moonPosition(jd);
    var sunLon = sunLongitude(jd);
    var elong = norm360(m.lon - sunLon);
    // Sudut Bulan-Matahari dilihat dari Bumi; fraksi tersinari = (1 - cos sudut) / 2.
    var psi = Math.acos(Math.cos(m.lat * DEG) * Math.cos(elong * DEG));
    // Tepat di saat Bulan baru elongasi bisa 359,99999...; jangan mundur satu bulan penuh.
    var lastNew = refinePhase(jd - (elong > 359.99 ? elong - 360 : elong) / SYNODIC_RATE, 0);
    return {
      elongation: elong,
      illumination: (1 - Math.cos(psi)) / 2,
      ageDays: Math.max(0, jd - lastNew),
      key: phaseKey(elong),
      waxing: elong < 180,
      moon: m,
      sunLon: sunLon
    };
  }

  var PRIMARY_PHASES = ['new', 'first-quarter', 'full', 'last-quarter'];

  // count fase utama berikutnya setelah jd: [{key, jd}].
  function nextPhases(jd, count) {
    var e = elongationAt(jd);
    var q = Math.floor(e / 90) + 1;
    var list = [];
    while (list.length < count) {
      var t = refinePhase(jd + (q * 90 - e) / SYNODIC_RATE, (q % 4) * 90);
      if (t > jd) list.push({ key: PRIMARY_PHASES[q % 4], jd: t });
      q++;
    }
    return list;
  }

  // Hukum Kepler III untuk benda yang mengelilingi Matahari: periode (tahun) dari sumbu semi-mayor (SA).
  function periodYears(aAU) {
    return Math.pow(aAU, 1.5);
  }

  var Astro = {
    DEG: DEG,
    J2000: J2000,
    AU_KM: AU_KM,
    C_KM_S: C_KM_S,
    MIN_DATE: MIN_DATE,
    MAX_DATE: MAX_DATE,
    norm360: norm360,
    norm180: norm180,
    jdFromDate: jdFromDate,
    dateFromJd: dateFromJd,
    solveKepler: solveKepler,
    elementsAt: elementsAt,
    helioPosition: helioPosition,
    orbitPath: orbitPath,
    lonLat: lonLat,
    fromEarth: fromEarth,
    visibility: visibility,
    sunLongitude: sunLongitude,
    moonPosition: moonPosition,
    moonPhase: moonPhase,
    phaseKey: phaseKey,
    nextPhases: nextPhases,
    periodYears: periodYears
  };

  if (typeof module === 'object' && module.exports) module.exports = Astro;
  else root.Astro = Astro;
})(this);
