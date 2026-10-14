// Uji js/astro.js dan data orientasi dengan data rujukan JPL Horizons (tests/fixtures.json).
// Jalankan dari folder proyek:  node tests/test_astro.js
'use strict';

const assert = require('node:assert/strict');
const Astro = require('../js/astro.js');
const DATA = require('../js/data.js');
const fixtures = require('./fixtures.json');

const DEG = Astro.DEG;
const bodies = {};
DATA.bodies.forEach((b) => { bodies[b.id] = b; });

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log('ok  ' + name);
}

function angleBetween(a, b) {
  const ra = Math.hypot(a.x, a.y, a.z), rb = Math.hypot(b.x, b.y, b.z);
  const c = (a.x * b.x + a.y * b.y + a.z * b.z) / (ra * rb);
  return Math.acos(Math.max(-1, Math.min(1, c))) / DEG;
}

// Ketelitian Tabel 1 JPL: Saturnus paling melenceng, sampai sekitar 0,2 derajat.
test('posisi planet dan Pluto cocok dengan JPL Horizons (1800 sampai 2050)', () => {
  for (const f of fixtures.positions) {
    const p = Astro.helioPosition(bodies[f.id].orbit, f.jd);
    const deg = angleBetween(p, f);
    const dist = Math.abs(Math.hypot(p.x, p.y, p.z) / Math.hypot(f.x, f.y, f.z) - 1);
    assert.ok(deg < 0.25, `${f.id} JD ${f.jd}: arah meleset ${deg.toFixed(3)} derajat`);
    assert.ok(dist < 0.003, `${f.id} JD ${f.jd}: jarak meleset ${(dist * 100).toFixed(2)}%`);
  }
});

test('jarak dan elongasi dari Bumi cocok dengan geometri Horizons', () => {
  const byKey = {};
  fixtures.positions.forEach((f) => { byKey[f.id + f.jd] = f; });
  for (const f of fixtures.positions) {
    const earthRef = byKey['earth' + f.jd];
    if (f.id === 'earth' || !earthRef) continue;
    const ref = Astro.fromEarth(f, earthRef);
    const got = Astro.fromEarth(Astro.helioPosition(bodies[f.id].orbit, f.jd), Astro.helioPosition(bodies.earth.orbit, f.jd));
    assert.ok(Math.abs(got.elongation - ref.elongation) < 0.6, `${f.id} JD ${f.jd}: elongasi`);
    assert.ok(Math.abs(got.dist / ref.dist - 1) < 0.01, `${f.id} JD ${f.jd}: jarak dari Bumi`);
  }
});

test('persamaan Kepler terselesaikan sampai orbit hampir parabola', () => {
  for (const e of [0, 0.1, 0.5, 0.9, 0.99]) {
    for (let k = -180; k <= 180; k += 7.5) {
      const M = k * DEG;
      const E = Astro.solveKepler(M, e);
      assert.ok(Math.abs(E - e * Math.sin(E) - M) < 1e-10, `e=${e} M=${k}`);
    }
  }
});

test('bujur dan lintang Bulan cocok dengan Horizons', () => {
  for (const r of fixtures.eclipticOfDate) {
    const m = Astro.moonPosition(Astro.jdFromDate(new Date(r.utc.replace('Z', ':00Z'))));
    assert.ok(Math.abs(Astro.norm180(m.lon - r.moon_lon)) < 0.15, `bujur Bulan ${r.utc}: ${m.lon} vs ${r.moon_lon}`);
    assert.ok(Math.abs(m.lat - r.moon_lat) < 0.1, `lintang Bulan ${r.utc}`);
    assert.ok(m.distKm > 356000 && m.distKm < 407000, `jarak Bulan ${r.utc}`);
  }
});

// Sisi siang dan malam Bumi di tampilan 3D ditentukan oleh meridian nol IAU (W) dan arah Matahari.
// Pada 15 Oktober 2026 pukul 05.00 UTC, perata waktu sekitar +14 menit, jadi Matahari tepat di atas
// bujur 15 x (12 - 5,23) = sekitar 101,5 derajat timur (Sumatra).
test('titik subsolar Bumi sesuai jam (meridian nol IAU)', () => {
  const earth = bodies.earth;
  const jd = Astro.jdFromDate(new Date(Date.UTC(2026, 9, 15, 5, 0)));
  const pe = Astro.helioPosition(earth.orbit, jd);
  const eps = 23.4392911 * DEG;
  const sy = -pe.y, sz = -pe.z;
  const raSun = Math.atan2(sy * Math.cos(eps) - sz * Math.sin(eps), -pe.x) / DEG;
  const raMeridian = earth.pole_ra_deg + 90 + earth.w0_deg + earth.w_rate_deg_day * (jd - Astro.J2000);
  const lon = Astro.norm180(raSun - raMeridian);
  assert.ok(Math.abs(lon - 101.5) < 1, `bujur subsolar ${lon.toFixed(2)}`);
});

test('setiap benda punya arah sumbu dan laju rotasi', () => {
  for (const b of DATA.bodies) {
    for (const k of ['pole_ra_deg', 'pole_dec_deg', 'w0_deg', 'w_rate_deg_day']) {
      assert.equal(typeof b[k], 'number', `${b.id}.${k}`);
    }
  }
  // Venus dan Uranus berotasi terbalik (laju negatif menurut konvensi IAU).
  assert.ok(bodies.venus.w_rate_deg_day < 0 && bodies.uranus.w_rate_deg_day < 0);
});

test('konversi tanggal', () => {
  const d = new Date(Date.UTC(2026, 9, 14, 6, 30));
  assert.equal(Astro.dateFromJd(Astro.jdFromDate(d)).getTime(), d.getTime());
  assert.equal(Astro.jdFromDate(new Date(Date.UTC(2000, 0, 1, 12))), Astro.J2000);
});

console.log(`\n${passed} uji lulus.`);
