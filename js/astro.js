/*
 * astro.js: perhitungan astronomi untuk Interactive Solar System.
 *
 * Berkas ini tidak menyentuh DOM, jadi bisa dipakai di browser (variabel global Astro)
 * dan diuji di Node (node tests/test_astro.js).
 *
 * Posisi planet memakai elemen Kepler JPL "Approximate Positions of the Planets", Tabel 1
 * (berlaku 1800-2050). Hasilnya koordinat heliosentris pada bidang ekliptika J2000, dalam SA.
 * Posisi Bulan memakai suku-suku terbesar dari Jean Meeus, Astronomical Algorithms (bab 47).
 */
(function (root) {
  'use strict';

  var DEG = Math.PI / 180;
  var J2000 = 2451545.0; // 1 Januari 2000 pukul 12.00 TT, dalam hari Julian
  var AU_KM = 149597870.7;
  var C_KM_S = 299792.458;

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
  // Tebakan awal M + 0,85 e tanda(sin M) tetap konvergen untuk orbit yang sangat lonjong.
  function solveKepler(M, e) {
    var E = M + 0.85 * e * (Math.sin(M) >= 0 ? 1 : -1);
    for (var k = 0; k < 50; k++) {
      var dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-12) break;
    }
    return E;
  }

  // Elemen orbit pada tanggal tertentu: nilai J2000 ditambah laju per abad Julian.
  function elementsAt(orbit, jd) {
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

  // Posisi heliosentris {x, y, z} dalam SA.
  function helioPosition(orbit, jd) {
    var el = elementsAt(orbit, jd);
    var M = norm180(el.L - el.peri) * DEG; // anomali rata-rata
    var E = solveKepler(M, el.e);
    var xp = el.a * (Math.cos(E) - el.e);
    var yp = el.a * Math.sqrt(1 - el.e * el.e) * Math.sin(E);
    return toEcliptic(xp, yp, el);
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

  // Benda dilihat dari Bumi. earthPos = posisi heliosentris Bumi (barisan "earth" di orbits.csv,
  // yaitu pusat massa Bumi-Bulan; bedanya dengan pusat Bumi kurang dari 5.000 km).
  // Hasil: jarak (SA) dan elongasi dari Matahari (derajat).
  function fromEarth(bodyPos, earthPos) {
    var v = { x: bodyPos.x - earthPos.x, y: bodyPos.y - earthPos.y, z: bodyPos.z - earthPos.z };
    var dist = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    var sunDist = Math.sqrt(earthPos.x * earthPos.x + earthPos.y * earthPos.y + earthPos.z * earthPos.z);
    var cosE = -(v.x * earthPos.x + v.y * earthPos.y + v.z * earthPos.z) / (dist * sunDist);
    return { dist: dist, elongation: Math.acos(Math.max(-1, Math.min(1, cosE))) / DEG };
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
    fromEarth: fromEarth,
    moonPosition: moonPosition
  };

  if (typeof module === 'object' && module.exports) module.exports = Astro;
  else root.Astro = Astro;
})(this);
