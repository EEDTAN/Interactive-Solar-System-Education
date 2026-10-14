// Uji js/astro.js dengan data rujukan JPL Horizons dan USNO (tests/fixtures.json).
// Jalankan dari folder proyek:  node tests/test_astro.js
'use strict';

const assert = require('node:assert/strict');
const Astro = require('../js/astro.js');
const DATA = require('../js/data.js');
const fixtures = require('./fixtures.json');

const orbits = {};
DATA.bodies.forEach((b) => { if (b.orbit) orbits[b.id] = b.orbit; });

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log('ok  ' + name);
}

function angleBetween(a, b) {
  const ra = Math.hypot(a.x, a.y, a.z), rb = Math.hypot(b.x, b.y, b.z);
  const c = (a.x * b.x + a.y * b.y + a.z * b.z) / (ra * rb);
  return Math.acos(Math.max(-1, Math.min(1, c))) / Astro.DEG;
}

// Batas galat [derajat, jarak relatif]: planet sesuai ketelitian Tabel 1 JPL (Saturnus sampai
// sekitar 0,2 derajat). Ceres dan Halley memakai beberapa set elemen dari Horizons; Ceres paling
// meleset di antara dua epoch (sekitar 0,6 derajat), Halley kurang dari 0,05 derajat.
const LIMITS = { ceres: [1, 0.005], halley: [0.2, 0.005] };
const limitFor = (id) => LIMITS[id] || [0.25, 0.003];

test('posisi heliosentris cocok dengan JPL Horizons', () => {
  for (const f of fixtures.positions) {
    const p = Astro.helioPosition(orbits[f.id], f.jd);
    const [maxDeg, maxDist] = limitFor(f.id);
    const deg = angleBetween(p, f);
    const dist = Math.abs(Math.hypot(p.x, p.y, p.z) / Math.hypot(f.x, f.y, f.z) - 1);
    assert.ok(deg < maxDeg, `${f.id} JD ${f.jd}: arah meleset ${deg.toFixed(3)} derajat`);
    assert.ok(dist < maxDist, `${f.id} JD ${f.jd}: jarak meleset ${(dist * 100).toFixed(2)}%`);
  }
});

test('elongasi dari Bumi cocok dengan geometri Horizons', () => {
  const byKey = {};
  fixtures.positions.forEach((f) => { byKey[f.id + f.jd] = f; });
  for (const f of fixtures.positions) {
    const earthRef = byKey['earth' + f.jd];
    if (f.id === 'earth' || !earthRef) continue;
    const ref = Astro.fromEarth(f, earthRef);
    const got = Astro.fromEarth(Astro.helioPosition(orbits[f.id], f.jd), Astro.helioPosition(orbits.earth, f.jd));
    const [maxDeg, maxDist] = limitFor(f.id);
    assert.ok(Math.abs(got.elongation - ref.elongation) < 0.6, `${f.id} JD ${f.jd}: elongasi ${got.elongation} vs ${ref.elongation}`);
    assert.ok(Math.abs(got.dist / ref.dist - 1) < Math.max(0.01, maxDist * 1.5), `${f.id} JD ${f.jd}: jarak dari Bumi`);
  }
});

test('persamaan Kepler terselesaikan untuk orbit hampir parabola', () => {
  for (const e of [0, 0.1, 0.5, 0.9, 0.967, 0.99]) {
    for (let k = -180; k <= 180; k += 7.5) {
      const M = k * Astro.DEG;
      const E = Astro.solveKepler(M, e);
      assert.ok(Math.abs(E - e * Math.sin(E) - M) < 1e-10, `e=${e} M=${k}`);
    }
  }
});

const PHASE_NAMES = { 'New Moon': 'new', 'First Quarter': 'first-quarter', 'Full Moon': 'full', 'Last Quarter': 'last-quarter' };

test('fase utama Bulan 2026 cocok dengan USNO (selisih < 30 menit)', () => {
  let worst = 0;
  for (const ph of fixtures.moonPhases) {
    const t = Astro.jdFromDate(new Date(ph.utc.replace('Z', ':00Z')));
    const found = Astro.nextPhases(t - 2, 2).find((x) => x.key === PHASE_NAMES[ph.phase]);
    assert.ok(found, `fase ${ph.phase} ${ph.utc} tidak ditemukan`);
    const minutes = Math.abs(found.jd - t) * 1440;
    worst = Math.max(worst, minutes);
    assert.ok(minutes < 30, `${ph.phase} ${ph.utc}: selisih ${minutes.toFixed(1)} menit`);
  }
  console.log('    selisih terbesar ' + worst.toFixed(1) + ' menit');
});

test('bagian Bulan yang tersinari saat purnama dan Bulan baru', () => {
  for (const ph of fixtures.moonPhases) {
    const p = Astro.moonPhase(Astro.jdFromDate(new Date(ph.utc.replace('Z', ':00Z'))));
    if (ph.phase === 'Full Moon') assert.ok(p.illumination > 0.99, `purnama ${ph.utc}: ${p.illumination}`);
    if (ph.phase === 'New Moon') assert.ok(p.illumination < 0.01 && p.key === 'new', `Bulan baru ${ph.utc}`);
    if (ph.phase === 'First Quarter') assert.equal(p.key, 'first-quarter');
  }
});

test('bujur Bulan dan Matahari cocok dengan Horizons', () => {
  for (const r of fixtures.eclipticOfDate) {
    const jd = Astro.jdFromDate(new Date(r.utc.replace('Z', ':00Z')));
    const m = Astro.moonPosition(jd);
    assert.ok(Math.abs(Astro.norm180(m.lon - r.moon_lon)) < 0.15, `bujur Bulan ${r.utc}: ${m.lon} vs ${r.moon_lon}`);
    assert.ok(Math.abs(m.lat - r.moon_lat) < 0.1, `lintang Bulan ${r.utc}`);
    assert.ok(Math.abs(Astro.norm180(Astro.sunLongitude(jd) - r.sun_lon)) < 0.02, `bujur Matahari ${r.utc}`);
  }
});

test('umur Bulan naik terus lalu kembali ke nol saat Bulan baru', () => {
  let prev = Astro.moonPhase(Astro.jdFromDate(new Date(Date.UTC(2026, 0, 1)))).ageDays;
  let resets = 0;
  for (let d = 0.5; d <= 365; d += 0.5) {
    const age = Astro.moonPhase(Astro.jdFromDate(new Date(Date.UTC(2026, 0, 1))) + d).ageDays;
    if (age < prev) resets++;
    else assert.ok(age - prev < 0.6, `lompatan umur di hari ke-${d}`);
    assert.ok(age >= 0 && age < 29.9, `umur ${age} di hari ke-${d}`);
    prev = age;
  }
  assert.ok(resets >= 12 && resets <= 13, `Bulan baru dalam setahun: ${resets}`);
});

test('hukum Kepler III dan konversi tanggal', () => {
  assert.equal(Astro.periodYears(1), 1);
  assert.ok(Math.abs(Astro.periodYears(5.2) - 11.86) < 0.01);
  const d = new Date(Date.UTC(2026, 9, 14, 6, 30));
  assert.equal(Astro.dateFromJd(Astro.jdFromDate(d)).getTime(), d.getTime());
  assert.equal(Astro.jdFromDate(new Date(Date.UTC(2000, 0, 1, 12))), Astro.J2000);
});

test('perkiraan waktu melihat planet', () => {
  assert.equal(Astro.visibility(5, true), 'sun-glare');
  assert.equal(Astro.visibility(170, false), 'all-night');
  assert.equal(Astro.visibility(60, true), 'evening');
  assert.equal(Astro.visibility(60, false), 'morning');
});

console.log(`\n${passed} uji lulus.`);
