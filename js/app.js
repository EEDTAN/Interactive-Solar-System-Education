/*
 * app.js: tata surya 3D satu layar. Mengatur kamera (terbang ke benda, mengikuti benda yang didekati,
 * memutar, memperbesar), waktu, label di dalam adegan, deretan benda, kartu info, dan panduan.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SolarSystem, BODY_IDS } from './planets.js';

const DATA = window.SOLAR_DATA;
const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ORIGIN = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

/* ---------- Format angka dan waktu (bahasa Indonesia) ---------- */

const numberFormats = {};
function fmt(n, max = 1, min = 0) {
  if (n === null || n === undefined || !isFinite(n)) return null;
  const key = max + ':' + min;
  numberFormats[key] = numberFormats[key] || new Intl.NumberFormat('id-ID', { maximumFractionDigits: max, minimumFractionDigits: Math.min(min, max) });
  const s = numberFormats[key].format(n);
  return /^-0(,0+)?$/.test(s) ? s.slice(1) : s;
}

function fmtDuration(seconds) {
  const s = Math.max(0, seconds);
  if (s < 59.5) return fmt(s, s < 10 ? 1 : 0) + ' detik';
  if (s < 3599.5) {
    const m = Math.floor(s / 60), sec = Math.round(s % 60);
    return m + ' menit' + (sec ? ' ' + sec + ' detik' : '');
  }
  if (s < 86370) {
    const h = Math.floor(s / 3600), mi = Math.round((s % 3600) / 60);
    return h + ' jam' + (mi ? ' ' + mi + ' menit' : '');
  }
  return fmt(s / 86400, 1) + ' hari';
}

function fmtDays(d) {
  if (d < 1) return fmt(d * 24, 1) + ' jam';
  if (d >= 730) return fmt(d / DATA.constants.SIDEREAL_YEAR_DAYS, 1) + ' tahun Bumi';
  return fmt(d, d < 100 ? 1 : 0) + ' hari';
}

const dateFormat = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
const shortDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- Keadaan galat ---------- */

function fatal(html) {
  $('loader').hidden = true;
  $('timebar').hidden = true;
  $('dock').hidden = true;
  const box = $('error');
  box.innerHTML = html;
  box.hidden = false;
}

function toast(text, ms) {
  const t = $('toast');
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.hidden = true; }, ms || 4500);
}

/* ---------- Waktu ---------- */

const SPEEDS = [
  [1, 'waktu nyata'],
  [60, '1 menit per detik'],
  [3600, '1 jam per detik'],
  [86400, '1 hari per detik'],
  [604800, '1 minggu per detik'],
  [2629746, '1 bulan per detik'],
  [31556952, '1 tahun per detik']
];

// Kurva pelan di awal dan di akhir (kecepatan dan percepatan nol di kedua ujung).
function smootherstep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function bezier(p0, p1, p2, p3, e, out) {
  const u = 1 - e;
  return out.set(0, 0, 0)
    .addScaledVector(p0, u * u * u)
    .addScaledVector(p1, 3 * u * u * e)
    .addScaledVector(p2, 3 * u * e * e)
    .addScaledVector(p3, e * e * e);
}

function main() {
  if (location.protocol === 'file:') return; // pesan sudah ditampilkan oleh skrip di index.html
  if (!DATA || !window.Astro) {
    fatal('<strong>Data tidak termuat.</strong> Berkas js/data.js atau js/astro.js tidak ditemukan. Muat ulang halaman.');
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: $('scene'), antialias: true, logarithmicDepthBuffer: true, powerPreference: 'high-performance' });
  } catch (err) {
    fatal('<strong>Tampilan 3D tidak bisa dibuka.</strong> Peramban ini tidak menyediakan WebGL. ' +
      'Aktifkan akselerasi perangkat keras (hardware acceleration) di pengaturan peramban, lalu muat ulang, atau coba Chrome, Edge, atau Firefox versi terbaru.');
    return;
  }
  const small = Math.min(window.innerWidth, window.innerHeight) < 720;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.001, 200000);
  camera.position.set(0, 4200, 9000);

  // OrbitControls dipakai untuk memutar (seret) dan mencubit di layar sentuh. Roda mouse ditangani
  // sendiri di bawah supaya zoom berjalan halus dan bisa mengunci benda di bawah kursor.
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 1.2;
  controls.minDistance = 0.3;
  controls.maxDistance = 9000;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.85, 0.55, 0.9);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* ---------- Muat ---------- */

  const manager = new THREE.LoadingManager();
  manager.onProgress = (url, loaded, total) => {
    $('loader-fill').style.width = Math.round(loaded / total * 100) + '%';
    $('loader-text').textContent = 'Memuat tekstur ' + loaded + ' dari ' + total;
  };
  let loadErrors = 0;
  manager.onError = () => { loadErrors++; };

  const system = new SolarSystem(renderer, scene, DATA, manager);

  const state = {
    jd: clampJd(Astro.jdFromDate(new Date())),
    playing: !reduceMotion,
    speed: 2,
    focus: null, // benda yang dipilih (kartu info terbuka)
    near: null   // benda yang didekati lewat zoom (kamera mengikutinya, tanpa kartu)
  };

  function clampJd(jd) {
    return Math.min(Astro.jdFromDate(Astro.MAX_DATE), Math.max(Astro.jdFromDate(Astro.MIN_DATE), jd));
  }

  const earthData = DATA.bodies.find((b) => b.id === 'earth');

  /* ---------- Label di dalam adegan ---------- */

  const labels = new Map();
  const labelBox = $('labels');
  system.allViews().forEach((v) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'label is-off' + (v.isMoon ? ' label--moon' : '');
    const color = v.isMoon ? '#c9c4bb' : (v.data.color || '#fff');
    b.innerHTML = '<span class="label__dot" style="--c:' + esc(color) + '"></span>' + esc(v.name);
    b.setAttribute('aria-label', v.name + ', dekati');
    b.tabIndex = -1;
    b.addEventListener('click', () => focusBody(v.id));
    labelBox.appendChild(b);
    labels.set(v.id, { el: b, w: 0, h: 0 });
  });
  // Saat bertumpuk, label benda besar didahulukan; satelit paling akhir, yang besar lebih dulu.
  const PRIORITY = ['jupiter', 'saturn', 'earth', 'mars', 'venus', 'mercury', 'uranus', 'neptune', 'pluto', 'sun', 'moon'];
  const rank = (v) => (v.isMoon ? 100 - v.radius : PRIORITY.indexOf(v.id));
  const labelOrder = system.allViews().slice().sort((a, b) => rank(a) - rank(b));

  // Saat sebuah benda dilihat, labelnya sendiri tidak tampil (kartu sudah menamainya), tetapi planet
  // induk dan satelit-satelitnya tampil supaya bisa langsung dipilih.
  function labelAllowed(v) {
    const f = state.focus ? system.get(state.focus) : null;
    if (!f) return true;
    if (v === f) return false;
    const home = f.isMoon ? f.parent : f;
    if (v === home || (v.isMoon && v.parent === home)) return true;
    if (home.id === 'earth' && v.id === 'moon') return true;
    if (f.id === 'moon' && v.id === 'earth') return true;
    return false;
  }

  // Satelit yang sedang berada di belakang planetnya (dilihat dari kamera) tidak diberi label.
  const _toMoon = new THREE.Vector3(), _toParent = new THREE.Vector3();
  function behindParent(v) {
    const p = v.isMoon ? v.parent : system.get('earth');
    _toMoon.subVectors(v.group.position, camera.position);
    _toParent.subVectors(p.group.position, camera.position);
    const along = _toParent.dot(_toMoon) / _toMoon.length();
    if (along <= 0 || along >= _toMoon.length()) return false;
    const r = p.radius * p.scale;
    return _toParent.lengthSq() - along * along < r * r;
  }

  const proj = new THREE.Vector3();
  function focalPx() {
    return window.innerHeight / (2 * Math.tan(camera.fov * Math.PI / 360));
  }

  function updateLabels() {
    const W = window.innerWidth, H = window.innerHeight, F = focalPx();
    // Bilah atas, deretan benda, dan kartu dianggap sudah terisi supaya label tidak tertutup panel.
    const placed = [[0, 0, W, layout.top], [0, layout.dockTop, W, H]];
    if (layout.card) placed.push(layout.card);
    labelOrder.forEach((v) => {
      const L = labels.get(v.id);
      let show = v.group.visible && !fly.active && labelAllowed(v);
      if (show) {
        proj.copy(v.group.position).project(camera);
        show = proj.z < 1 && Math.abs(proj.x) < 1.05 && Math.abs(proj.y) < 1.05;
      }
      if (show && v.isMoon && v.px < 1.2) show = false;
      if (show && (v.isMoon || v.id === 'moon') && behindParent(v)) show = false;
      if (show) {
        if (!L.w) { L.w = L.el.offsetWidth || 80; L.h = L.el.offsetHeight || 30; }
        const dist = camera.position.distanceTo(v.group.position);
        const gap = v.radius * v.scale / dist * F + 8;
        const cx = (proj.x + 1) / 2 * W, cy = (1 - proj.y) / 2 * H;
        // Coba kanan, kiri, atas, lalu bawah benda; label disembunyikan bila semuanya bertumpuk.
        const spots = [[cx + gap, cy - L.h / 2], [cx - gap - L.w, cy - L.h / 2], [cx - L.w / 2, cy - gap - L.h], [cx - L.w / 2, cy + gap]];
        let box = null;
        for (let s = 0; s < spots.length && !box; s++) {
          const c = [spots[s][0], spots[s][1], spots[s][0] + L.w, spots[s][1] + L.h];
          if (c[0] < 4 || c[2] > W - 4) continue;
          if (!placed.some((p) => c[0] < p[2] && c[2] > p[0] && c[1] < p[3] && c[3] > p[1])) box = c;
        }
        show = !!box;
        if (show) {
          placed.push(box);
          L.el.style.transform = 'translate(' + Math.round(box[0]) + 'px,' + Math.round(box[1]) + 'px)';
        }
      }
      if (show === L.el.classList.contains('is-off')) {
        L.el.classList.toggle('is-off', !show);
        L.el.tabIndex = show ? 0 : -1;
      }
    });
  }

  /* ---------- Deretan benda (dock) ---------- */

  const dock = $('dock');
  BODY_IDS.forEach((id, i) => {
    const v = system.get(id);
    if (!v) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dock__item';
    b.dataset.id = id;
    // Gambar diambil dari assets/thumbs.webp (tools/make_thumbs.py) dengan urutan BODY_IDS.
    b.innerHTML = '<span class="dock__ball" style="--i:' + i + '" aria-hidden="true"></span><span class="dock__name">' + esc(v.name) + '</span>';
    b.setAttribute('aria-label', v.name + ', dekati');
    b.addEventListener('click', () => focusBody(id));
    dock.appendChild(b);
  });
  let dockActive = null;
  function updateDock() {
    let id = state.focus || state.near;
    const v = id ? system.get(id) : null;
    if (v && v.isMoon) id = v.parent.id; // satelit planet lain: tandai planetnya
    if (id === dockActive) return;
    dockActive = id;
    dock.querySelectorAll('.dock__item').forEach((el) => {
      const on = el.dataset.id === id;
      el.classList.toggle('is-active', on);
      if (on) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
      if (on && dock.scrollWidth > dock.clientWidth) el.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Ruang layar yang tidak tertutup panel ---------- */

  const topbarEl = document.querySelector('.topbar');
  const layout = { top: 0, dockTop: 0, cardH: 0, card: null };
  function measure() {
    layout.top = topbarEl.getBoundingClientRect().bottom;
    layout.dockTop = dock.getBoundingClientRect().top;
    const card = $('card');
    layout.cardH = card.hidden ? 0 : card.offsetHeight;
    const r = card.hidden ? null : card.getBoundingClientRect();
    layout.card = r ? [r.left, r.top, r.right, r.bottom] : null;
  }

  function freeArea(withCard) {
    const W = window.innerWidth, H = window.innerHeight;
    const a = { x0: 0, y0: layout.top + 6, x1: W, y1: layout.dockTop - 6 };
    if (withCard) {
      if (W > 720) a.x1 = W - 18 - Math.min(380, W - 36) - 6; // kartu di kanan
      else a.y1 = layout.dockTop - 8 - (layout.cardH || H * 0.4) - 6; // lembar bawah di atas deretan benda
    }
    return a;
  }

  /* ---------- Kamera: terbang, ikuti, putar, zoom ---------- */

  const fly = { active: false, vel: new THREE.Vector3(), tvel: new THREE.Vector3(), prevT: 0 };
  const lastTarget = new THREE.Vector3();
  const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _d = new THREE.Vector3();
  const SUN_CLEAR = 100; // jarak aman jalur kamera dari pusat Matahari (jari-jari tampilnya 42)
  let zoomGoal = null;   // jarak kamera ke titik putar yang sedang dituju oleh zoom halus

  function overviewOffset() {
    // Pertahankan arah pandang mendatar sekarang, dari ketinggian sekitar 24 derajat.
    const off = camera.position.clone().sub(controls.target);
    const sph = new THREE.Spherical().setFromVector3(off.lengthSq() > 0 ? off : new THREE.Vector3(0, 1, 1));
    sph.radius = small ? 3100 : 2150;
    sph.phi = THREE.MathUtils.degToRad(66);
    return new THREE.Vector3().setFromSpherical(sph);
  }

  // Jarak kamera supaya benda (Saturnus beserta cincinnya) mengisi sekitar 62% dari ruang layar yang
  // tidak tertutup kartu, bilah atas, dan deretan benda.
  function frameDistance(v) {
    const rEff = v.radius * (v.id === 'saturn' ? 2.45 : v.id === 'sun' ? 1.25 : v.id === 'uranus' ? 2.1 : 1);
    const a = freeArea(true);
    const size = Math.max(120, Math.min(a.x1 - a.x0, a.y1 - a.y0)) * 0.62;
    return rEff * focalPx() / (size / 2);
  }

  function focusOffset(v) {
    const P = v.group.position;
    let dir;
    if (v.id === 'sun') {
      dir = camera.position.clone().sub(controls.target).setY(0).normalize().multiplyScalar(0.9).add(new THREE.Vector3(0, 0.42, 0)).normalize();
    } else {
      // Kamera di sisi yang terkena Matahari, agak menyamping: benda tampak cembung dan bertekstur.
      const toSun = P.clone().negate().normalize();
      const side = new THREE.Vector3().crossVectors(toSun, UP).normalize();
      dir = toSun.clone().multiplyScalar(0.8).addScaledVector(side, 0.52).addScaledVector(UP, 0.26).normalize();
      if (v.id === 'saturn' || v.id === 'uranus') {
        // Dari sisi cincin yang terkena Matahari, 22 derajat di atas bidang cincin dan hampir searah
        // Matahari. Saat Matahari rendah (dekat ekuinoks) bayangan planet di cincin sangat panjang; dari
        // sudut ini bayangan itu tersembunyi di belakang planet.
        const N = new THREE.Vector3(0, 1, 0).applyQuaternion(v.spin.quaternion);
        if (N.dot(toSun) < 0) N.negate();
        const S = toSun.clone().addScaledVector(N, -toSun.dot(N)).normalize();
        const Q = new THREE.Vector3().crossVectors(N, S);
        const el = THREE.MathUtils.degToRad(22), az = THREE.MathUtils.degToRad(14);
        dir = S.multiplyScalar(Math.cos(el) * Math.cos(az)).addScaledVector(Q, Math.cos(el) * Math.sin(az)).addScaledVector(N, Math.sin(el));
      }
    }
    return dir.multiplyScalar(frameDistance(v));
  }

  // Jalur terbang berupa kurva Bezier kubik. Awal dan akhirnya pelan (tanpa sentakan). Bila tujuan
  // diganti di tengah perjalanan, kamera melanjutkan kecepatannya lalu berbelok ke tujuan baru.
  function startFlight(id, endOffset, durMs) {
    const now = performance.now();
    const goal = id ? system.get(id).group.position : ORIGIN;
    const P0 = camera.position.clone();
    const T0 = controls.target.clone();
    const P3 = goal.clone().add(endOffset);
    const travel = P0.distanceTo(P3);
    const dur = reduceMotion ? 1 : durMs || THREE.MathUtils.clamp(1100 + 420 * Math.log2(1 + travel / 30), 1100, 3000);
    const lift = Math.min(travel, 2500);
    const interrupted = fly.active && !reduceMotion;
    let P1, T1;
    if (interrupted) {
      P1 = P0.clone().addScaledVector(fly.vel, dur / 9);
      T1 = T0.clone().addScaledVector(fly.tvel, dur / 9);
    } else {
      // Bila mulai dari dekat sebuah benda, kamera mundur dan naik dulu sebelum berangkat.
      const startDist = P0.distanceTo(T0);
      const nearStart = 1 - THREE.MathUtils.clamp((startDist / Math.max(travel, 1e-6) - 0.05) / 0.45, 0, 1);
      const back = P0.clone().sub(T0).normalize();
      P1 = P0.clone().lerp(P3, 0.18)
        .addScaledVector(back, lift * 0.28 * nearStart)
        .addScaledVector(UP, lift * 0.2 * nearStart);
      T1 = T0.clone().lerp(goal, 0.35); // pandangan beralih ke tujuan sedikit lebih awal
    }
    // Datang ke benda dari arah pandang akhirnya, tanpa mengambil ancang-ancang di seberang Matahari.
    const reach = id ? Math.min(lift * 0.45, goal.length() * 0.5 + endOffset.length()) : lift * 0.45;
    const p2rel = endOffset.clone().addScaledVector(endOffset.clone().normalize(), reach).addScaledVector(UP, lift * 0.08);
    // Jalur tidak boleh menembus Matahari: titik kendali dinaikkan bila perlu.
    if (id !== 'sun') {
      const P2 = goal.clone().add(p2rel);
      for (let iter = 0; iter < 3; iter++) {
        let minD = Infinity;
        for (let i = 1; i < 10; i++) minD = Math.min(minD, bezier(P0, P1, P2, P3, i / 10, _a).length());
        if (minD >= SUN_CLEAR) break;
        const push = (SUN_CLEAR - minD) * 1.6;
        P2.addScaledVector(UP, push);
        p2rel.addScaledVector(UP, push);
        if (!interrupted) P1.addScaledVector(UP, push);
      }
    }
    Object.assign(fly, { active: true, id, t0: now, prevT: now, dur, P0, P1, T0, T1, p2rel, endOffset, interrupted });
    zoomGoal = null;
    steer = null;
    controls.enabled = false;
  }

  function stepFlight(now) {
    const k = Math.min(1, (now - fly.t0) / fly.dur);
    const e = fly.interrupted ? 1 - Math.pow(1 - k, 3) : smootherstep(k);
    const goal = fly.id ? system.get(fly.id).group.position : ORIGIN;
    _c.copy(goal).add(fly.p2rel);
    _d.copy(goal).add(fly.endOffset);
    _b.copy(camera.position);
    bezier(fly.P0, fly.P1, _c, _d, e, camera.position);
    bezier(fly.T0, fly.T1, goal, goal, e, _a);
    // Kecepatan (satuan per milidetik), dipakai bila tujuan diganti di tengah jalan.
    const dt = Math.max(now - fly.prevT, 1);
    fly.vel.subVectors(camera.position, _b).divideScalar(dt);
    fly.tvel.subVectors(_a, controls.target).divideScalar(dt);
    fly.prevT = now;
    controls.target.copy(_a);
    camera.lookAt(controls.target);
    if (k >= 1) {
      fly.active = false;
      controls.enabled = true;
      lastTarget.copy(goal);
      setControlsMode();
    }
  }

  // Saat ada benda yang dilihat, kamera berhenti pada jarak yang masih tajam untuk tekstur terbesarnya
  // (sekitar 2 piksel layar per piksel tekstur 4K), jadi tidak menembus permukaan dan tidak buram.
  function setControlsMode() {
    const id = state.focus || state.near;
    const v = id ? system.get(id) : null;
    controls.minDistance = v ? v.radius * (v.maxLevel >= 4 ? 1.6 : 2) : 0.3;
  }

  // Benda yang sedang dilihat bergerak saat waktu berjalan; kamera ikut bergeser sejauh itu.
  function follow(dt) {
    const id = state.focus || state.near;
    if (!id) return;
    const P = system.get(id).group.position;
    _a.copy(P).sub(lastTarget);
    camera.position.add(_a);
    controls.target.add(_a);
    lastTarget.copy(P);
    // Saat didekati lewat zoom, titik putar kamera bergeser pelan ke pusat benda.
    if (!state.focus) controls.target.lerp(P, 1 - Math.exp(-dt * 5));
  }

  // Zoom halus: roda mouse dan tombol +/- menetapkan jarak tujuan, lalu kamera menuju ke sana dalam
  // sekitar seperempat detik (dihitung dalam skala logaritmik karena jaraknya bisa berbeda ribuan kali).
  function zoomBy(factor) {
    const cur = zoomGoal === null ? camera.position.distanceTo(controls.target) : zoomGoal;
    zoomGoal = THREE.MathUtils.clamp(cur * factor, controls.minDistance, controls.maxDistance);
  }
  const _q = new THREE.Quaternion(), _qi = new THREE.Quaternion();
  function stepZoom(dt) {
    if (zoomGoal === null) return;
    const off = _a.copy(camera.position).sub(controls.target);
    const d = off.length();
    const goal = THREE.MathUtils.clamp(zoomGoal, controls.minDistance, controls.maxDistance);
    const nd = Math.exp(Math.log(d) + (Math.log(goal) - Math.log(d)) * (1 - Math.exp(-dt * 11)));
    off.setLength(nd);
    // Saat mendekat lewat roda mouse, kamera sekaligus berputar pelan ke sisi siang benda, jadi
    // pemandangan akhirnya terang dan detail seperti saat benda dipilih.
    if (steer && nd < d) {
      _b.copy(off).normalize();
      const left = Math.acos(THREE.MathUtils.clamp(_b.dot(steer.dir), -1, 1));
      if (left < 0.01) steer = null;
      else {
        _q.setFromUnitVectors(_b, steer.dir);
        off.applyQuaternion(_qi.identity().slerp(_q, Math.min(1, steer.rate * Math.log(d / nd) / left)));
      }
    }
    camera.position.copy(controls.target).add(off);
    if (Math.abs(nd - goal) < goal * 0.002) zoomGoal = null;
  }

  // Benda di bawah kursor, dengan toleransi beberapa piksel untuk benda yang tampak sebagai titik.
  function bodyAt(clientX, clientY) {
    const W = window.innerWidth, H = window.innerHeight, F = focalPx();
    let best = null, bestScore = 1;
    for (const v of system.allViews()) {
      if (!v.group.visible) continue;
      proj.copy(v.group.position).project(camera);
      if (proj.z > 1) continue;
      const sx = (proj.x + 1) / 2 * W, sy = (1 - proj.y) / 2 * H;
      const r = v.radius * v.scale / camera.position.distanceTo(v.group.position) * F * (v.id === 'saturn' ? 2.3 : 1);
      const score = Math.hypot(sx - clientX, sy - clientY) / Math.max(r + 6, 16);
      if (score < bestScore) { bestScore = score; best = v; }
    }
    return best;
  }

  // Mendekati benda lewat zoom: kamera menempel (mengikuti) benda itu tanpa membuka kartu. Titik putar
  // dipindah ke kedalaman benda di sepanjang arah pandang supaya tampilan tidak melompat, lalu bergeser
  // pelan ke pusat benda (lihat follow).
  const NEAR_IN = 7, NEAR_OUT = 20;
  const sizeOf = (v) => v.radius * (v.id === 'saturn' ? 2.3 : 1);
  let steer = null; // { dir: arah tujuan dari benda ke kamera, rate: radian per satuan log jarak }
  function setNear(v, steerToLight) {
    const dist = camera.position.distanceTo(v.group.position);
    camera.getWorldDirection(_a);
    controls.target.copy(camera.position).addScaledVector(_a, dist);
    steer = null;
    if (steerToLight && v.id !== 'sun' && dist > sizeOf(v) * 4) {
      // Putaran selesai ketika kamera tinggal sekitar 3 kali ukuran benda dari pusatnya.
      const dir = focusOffset(v).normalize();
      const angle = Math.acos(THREE.MathUtils.clamp(_b.copy(camera.position).sub(v.group.position).normalize().dot(dir), -1, 1));
      steer = { dir, rate: angle / Math.log(dist / (sizeOf(v) * 3)) };
    }
    state.near = v.id;
    state.nearMax = Math.max(NEAR_OUT * 4, dist / sizeOf(v) * 1.5);
    lastTarget.copy(v.group.position);
    setControlsMode();
    updateHome();
  }
  function releaseNear() {
    state.near = null;
    steer = null;
    setControlsMode();
    updateHome();
  }
  function nearRatio() {
    const v = system.get(state.near);
    return camera.position.distanceTo(v.group.position) / sizeOf(v);
  }
  // Kamera yang sampai sangat dekat ke sebuah benda (mis. lewat cubitan di layar sentuh) ikut menempel.
  function updateNear() {
    if (state.focus) return;
    if (state.near) {
      if (nearRatio() > state.nearMax) releaseNear();
      return;
    }
    let best = null, bestRatio = Infinity;
    for (const v of system.allViews()) {
      if (!v.group.visible) continue;
      const ratio = camera.position.distanceTo(v.group.position) / sizeOf(v);
      if (ratio < bestRatio) { bestRatio = ratio; best = v; }
    }
    if (best && bestRatio < NEAR_IN) setNear(best);
  }

  function orbitBy(dTheta, dPhi) {
    // Lewat OrbitControls supaya putarannya ikut diperhalus (damping).
    if (controls._rotateLeft && controls._rotateUp) {
      controls._rotateLeft(-dTheta);
      controls._rotateUp(-dPhi);
      return;
    }
    const off = camera.position.clone().sub(controls.target);
    const sph = new THREE.Spherical().setFromVector3(off);
    sph.theta += dTheta;
    sph.phi = THREE.MathUtils.clamp(sph.phi + dPhi, 0.05, Math.PI - 0.05);
    camera.position.copy(controls.target).add(off.setFromSpherical(sph));
  }

  /* ---------- Fokus dan kartu ---------- */

  function updateHome() {
    const away = !!(state.focus || state.near);
    document.body.classList.toggle('is-focused', away);
    $('home-text').textContent = away ? 'Tata surya' : 'Interactive Solar System';
    if (away) $('home').setAttribute('aria-label', 'Kembali ke seluruh tata surya');
    else $('home').removeAttribute('aria-label');
  }

  function focusBody(id) {
    const v = system.get(id);
    if (!v) return;
    dismissHint();
    if (state.focus === id && !fly.active) {
      startFlight(id, focusOffset(v)); // pilih lagi: kembali ke sudut pandang terbaik
      return;
    }
    state.focus = id;
    state.near = null;
    showCard(v);
    startFlight(id, focusOffset(v));
    updateHome();
  }

  function goHome() {
    if (!state.focus && !state.near && !fly.active) return;
    state.focus = null;
    state.near = null;
    startFlight(null, overviewOffset());
    updateHome();
    hideCard();
  }

  function planetStats(b) {
    const out = [];
    const ratio = (x, ref, digits) => (b.id !== 'earth' && x && ref ? fmt(x / ref, digits) + ' × Bumi' : '');
    out.push(['Diameter', fmt(b.diameter_km, 0) + ' km', ratio(b.diameter_km, earthData.diameter_km, b.id === 'sun' ? 0 : 2)]);
    out.push(['dist', '', '']); // jarak (dihitung ulang tiap setengah detik)
    if (b.id === 'sun') {
      out.push(['Rotasi', fmt(b.rotation_period_h / 24, 1) + ' hari', 'di khatulistiwanya']);
    } else if (b.day_length_h) {
      const h = b.day_length_h;
      out.push(['Satu hari', h >= 48 ? fmt(h / 24, 1) + ' hari' : fmt(h, 1) + ' jam', 'siang sampai siang lagi']);
    }
    if (b.orbital_period_days && b.id !== 'sun') {
      out.push([b.id === 'moon' ? 'Mengelilingi Bumi' : 'Satu tahun', fmtDays(b.orbital_period_days), '']);
    }
    if (b.gravity_m_s2) out.push(['Gravitasi', fmt(b.gravity_m_s2, 2, 1) + ' m/s²', ratio(b.gravity_m_s2, earthData.gravity_m_s2, 2)]);
    if (b.mean_temperature_c !== null && b.mean_temperature_c !== undefined) {
      out.push([b.id === 'sun' ? 'Suhu permukaan' : 'Suhu rata-rata', fmt(b.mean_temperature_c, 0) + ' °C', '']);
    }
    if (b.moons !== null && b.moons !== undefined && b.id !== 'sun') {
      out.push(['Satelit alami', String(b.moons), b.moons_as_of ? 'per ' + shortDate.format(new Date(b.moons_as_of + 'T12:00:00')) : '']);
    }
    return out;
  }

  function distanceStat(v) {
    const b = v.data, C = Astro.C_KM_S, AU = Astro.AU_KM, jd = state.jd;
    if (v.isMoon) {
      return ['Jarak dari ' + v.parent.name, fmt(b.distance_km, 0) + ' km', 'rata-rata'];
    }
    if (b.id === 'moon') {
      const km = Astro.moonPosition(jd).distKm;
      return ['Jarak dari Bumi', fmt(Math.round(km / 100) * 100, 0) + ' km', 'cahaya ' + fmtDuration(km / C)];
    }
    const earthPos = Astro.helioPosition(earthData.orbit, jd);
    if (b.id === 'sun') {
      const km = Math.hypot(earthPos.x, earthPos.y, earthPos.z) * AU;
      return ['Jarak dari Bumi', fmt(km / 1e6, 1) + ' juta km', 'cahaya ' + fmtDuration(km / C)];
    }
    const p = Astro.helioPosition(b.orbit, jd);
    const r = Math.hypot(p.x, p.y, p.z);
    if (b.id === 'earth') return ['Jarak dari Matahari', fmt(r * AU / 1e6, 1) + ' juta km', 'cahaya ' + fmtDuration(r * AU / C)];
    const g = Astro.fromEarth(p, earthPos);
    return ['Jarak dari Bumi', fmt(g.dist * AU / 1e6, 0) + ' juta km', fmt(r, 2) + ' SA dari Matahari, cahaya ' + fmtDuration(g.dist * AU / C)];
  }

  function statHtml(s) {
    return '<div><dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd>' + (s[2] ? '<small>' + esc(s[2]) + '</small>' : '') + '</div>';
  }

  // Tombol ke benda lain di sistem yang sama: satelit sebuah planet, atau planet induk dan satelit
  // saudaranya bila yang dilihat sebuah satelit.
  function neighbourChips(v) {
    let list, title;
    if (v.isMoon) {
      list = [v.parent].concat(system.allViews().filter((m) => m.isMoon && m.parent === v.parent && m !== v));
      title = 'Di sistem ' + v.parent.name;
    } else if (v.id === 'moon') {
      list = [system.get('earth')];
      title = 'Di sistem Bumi';
    } else {
      list = system.allViews().filter((m) => (m.isMoon && m.parent === v) || (v.id === 'earth' && m.id === 'moon'));
      title = 'Satelit yang bisa didekati';
    }
    if (!list.length) return '';
    return '<div class="card__moons"><h3>' + esc(title) + '</h3><div class="chips">' +
      list.map((m) => '<button class="chip" type="button" data-go="' + esc(m.id) + '">' + esc(m.name) + '</button>').join('') +
      '</div></div>';
  }

  const CLOSE_BTN = '<button class="round card__close" type="button" aria-label="Tutup, kembali ke seluruh tata surya">' +
    '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';

  function cardHtml(v) {
    if (v.isMoon) {
      const m = v.data;
      const stats = [
        ['Diameter', fmt(m.radius_km * 2, 0) + ' km', fmt(m.radius_km * 2 / earthData.diameter_km, 3) + ' × Bumi'],
        distanceStat(v),
        ['Mengelilingi ' + v.parent.name, fmtDays(m.period_days), m.retrograde ? 'berlawanan dengan putaran planetnya' : ''],
        ['Ditemukan', m.discovered ? String(m.discovered) : '?', m.discoverer || '']
      ];
      return CLOSE_BTN +
        '<p class="card__kicker">Satelit ' + esc(v.parent.name) + '</p>' +
        '<h2 class="card__title" id="card-title" tabindex="-1">' + esc(v.name) + '</h2>' +
        (m.note ? '<p class="card__tagline">' + esc(m.note) + '</p>' : '') +
        '<dl class="stats">' + stats.map(statHtml).join('') + '</dl>' +
        neighbourChips(v) +
        '<p class="card__source">Data: JPL Planetary Satellites dan NASA NSSDCA. Ukuran sebenarnya; di layar jarak satelit ke planetnya dipadatkan.</p>';
    }
    const b = v.data;
    const stats = planetStats(b).map((s) => (s[0] === 'dist' ? distanceStat(v) : s));
    const desc = (b.description || []).map((p) => '<p>' + esc(p) + '</p>').join('');
    const facts = (b.facts || []).map((f) => '<li>' + esc(f) + '</li>').join('');
    const moons = (b.moonList || []).map((m) => m.name).filter(Boolean);
    return CLOSE_BTN +
      '<p class="card__kicker">' + esc(b.category || '') + '</p>' +
      '<h2 class="card__title" id="card-title" tabindex="-1">' + esc(b.name) + '</h2>' +
      '<p class="card__tagline">' + esc(b.tagline || '') + '</p>' +
      '<dl class="stats">' + stats.map(statHtml).join('') + '</dl>' +
      neighbourChips(v) +
      '<p class="card__summary">' + esc(b.summary || '') + '</p>' +
      '<details class="card__more"><summary>Selengkapnya</summary>' + desc +
      (facts ? '<h3>Fakta</h3><ul class="card__facts">' + facts + '</ul>' : '') +
      (moons.length ? '<h3>Satelit yang terkenal</h3><p>' + esc(moons.join(', ')) + '</p>' : '') +
      (b.composition ? '<h3>Susunan</h3><p>' + esc(b.composition) + '</p>' : '') +
      '</details>' +
      '<p class="card__source">Data: NASA NSSDCA dan JPL. Jarak dihitung untuk tanggal di atas.</p>';
  }

  // Kartu berganti isi dengan memudar singkat supaya perpindahan antarbenda terasa menyambung.
  let cardTimer = 0;
  function showCard(v) {
    const card = $('card');
    const swap = () => {
      card.innerHTML = cardHtml(v);
      card.dataset.id = v.id;
      card.scrollTop = 0;
      card.querySelector('.card__close').addEventListener('click', goHome);
      card.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => focusBody(b.dataset.go)));
      card.classList.remove('is-swapping');
      measure();
    };
    clearTimeout(cardTimer);
    if (card.hidden) {
      card.hidden = false;
      swap();
    } else {
      card.classList.add('is-swapping');
      cardTimer = setTimeout(swap, reduceMotion ? 0 : 180);
    }
  }

  function hideCard() {
    clearTimeout(cardTimer);
    $('card').hidden = true;
    $('card').classList.remove('is-swapping');
    $('card').dataset.id = '';
    measure();
  }

  function refreshCardDistance() {
    const card = $('card');
    if (card.hidden || !card.dataset.id || card.classList.contains('is-swapping')) return;
    const v = system.get(card.dataset.id);
    if (!v || v.isMoon) return;
    const cell = card.querySelector('.stats > div:nth-child(2)');
    if (cell) cell.outerHTML = statHtml(distanceStat(v));
  }

  /* ---------- Masukan pengguna ---------- */

  const canvas = renderer.domElement;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let down = null;

  function pick(clientX, clientY) {
    ndc.set(clientX / window.innerWidth * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(system.pickables(), false)[0];
    if (hit) return hit.object.userData.bodyId;
    const v = bodyAt(clientX, clientY); // benda kecil yang tampak sebagai titik
    return v ? v.id : null;
  }

  canvas.addEventListener('pointerdown', (e) => {
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
    zoomGoal = null;
    steer = null; // pengguna memutar sendiri
    dismissHint();
  });
  canvas.addEventListener('pointerup', (e) => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    const quick = performance.now() - down.t < 450;
    down = null;
    if (moved < 6 && quick) {
      const id = pick(e.clientX, e.clientY);
      if (id) focusBody(id);
    }
  });
  let hoverQueued = false;
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || hoverQueued) return;
    hoverQueued = true;
    requestAnimationFrame(() => {
      hoverQueued = false;
      canvas.classList.toggle('is-pointer', !!pick(e.clientX, e.clientY));
    });
  });

  // Roda mouse. OrbitControls tidak menerima kejadian ini (dihentikan di tahap capture). Menggulir maju
  // di atas sebuah benda mengunci benda itu lalu mendekatinya; menggulir mundur cukup jauh melepasnya.
  // Panel yang bisa digulir (kartu, panduan, deretan benda, bilah atas) tetap memakai gulir biasa;
  // di atas kanvas dan label, roda mouse menggerakkan kamera.
  let lastWheel = null;
  window.addEventListener('wheel', (e) => {
    if (e.target !== canvas && !(e.target.closest && e.target.closest('#labels'))) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    dismissHint();
    if (fly.active) return;
    const px = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 800 : 1);
    if (!px) return;
    // Benda yang sudah dikunci baru diganti bila mouse digeser ke tempat lain.
    const moved = !lastWheel || Math.hypot(e.clientX - lastWheel.x, e.clientY - lastWheel.y) > 24;
    lastWheel = { x: e.clientX, y: e.clientY };
    if (px < 0 && !state.focus && (moved || !state.near)) {
      const v = bodyAt(e.clientX, e.clientY);
      if (v && v.id !== state.near) setNear(v, true);
    } else if (px > 0 && state.near && nearRatio() > NEAR_OUT) {
      releaseNear();
    }
    const factor = Math.pow(0.92, Math.min(Math.abs(px), 400) / 100);
    zoomBy(px < 0 ? factor : 1 / factor);
  }, { capture: true, passive: false });

  const ORDER = BODY_IDS.filter((id) => system.get(id));
  window.addEventListener('keydown', (e) => {
    if (!$('help').hidden) {
      if (e.key === 'Escape') closeHelp();
      return;
    }
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SUMMARY')) return;
    const step = Math.PI / 18;
    switch (e.key) {
      case 'Escape': goHome(); break;
      case 'ArrowRight':
      case 'ArrowLeft': {
        if (e.shiftKey) { orbitBy(e.key === 'ArrowRight' ? -step : step, 0); break; }
        let cur = state.focus || state.near;
        const cv = cur ? system.get(cur) : null;
        if (cv && cv.isMoon) cur = cv.parent.id;
        const i = cur ? ORDER.indexOf(cur) : (e.key === 'ArrowRight' ? -1 : 0);
        focusBody(ORDER[(i + (e.key === 'ArrowRight' ? 1 : -1) + ORDER.length) % ORDER.length]);
        break;
      }
      case 'ArrowUp': orbitBy(0, -step); break;
      case 'ArrowDown': orbitBy(0, step); break;
      case '+':
      case '=': zoomBy(0.8); break;
      case '-':
      case '_': zoomBy(1.25); break;
      case ' ':
        if (e.target && e.target.tagName === 'BUTTON') return; // spasi pada tombol menekan tombol itu
        togglePlay();
        break;
      case '?': openHelp(); break;
      default: return;
    }
    e.preventDefault();
    dismissHint();
  });

  $('home').addEventListener('click', () => {
    if (state.focus || state.near) goHome();
    else openHelp();
  });

  /* ---------- Waktu ---------- */

  const playBtn = $('play'), speedInput = $('speed');
  function renderPlay() {
    playBtn.setAttribute('aria-pressed', String(state.playing));
    playBtn.setAttribute('aria-label', state.playing ? 'Jeda waktu' : 'Jalankan waktu');
  }
  function togglePlay() {
    state.playing = !state.playing;
    renderPlay();
  }
  function renderSpeed() {
    const label = SPEEDS[state.speed][1];
    $('speed-label').innerHTML = '<span class="timebar__prefix">Kecepatan: </span>' + esc(label);
    speedInput.setAttribute('aria-valuetext', label);
  }
  playBtn.addEventListener('click', togglePlay);
  speedInput.addEventListener('input', () => {
    state.speed = Number(speedInput.value);
    renderSpeed();
  });
  $('now').addEventListener('click', () => {
    state.jd = clampJd(Astro.jdFromDate(new Date()));
    state.speed = 2;
    speedInput.value = '2';
    renderSpeed();
    toast('Kembali ke waktu sekarang.', 2500);
  });
  renderPlay();
  renderSpeed();

  const narrow = window.matchMedia('(max-width: 720px)');
  function renderDate() {
    const d = Astro.dateFromJd(state.jd);
    $('date').textContent = (narrow.matches ? shortDate : dateFormat).format(d) + ', ' + timeFormat.format(d);
  }

  /* ---------- Panduan ---------- */

  let helpReturn = null;
  function openHelp() {
    helpReturn = document.activeElement;
    $('help').hidden = false;
    $('help-backdrop').hidden = false;
    $('help-btn').setAttribute('aria-expanded', 'true');
    $('help').focus();
  }
  function closeHelp() {
    $('help').hidden = true;
    $('help-backdrop').hidden = true;
    $('help-btn').setAttribute('aria-expanded', 'false');
    if (helpReturn && helpReturn.focus) helpReturn.focus();
  }
  $('help-btn').addEventListener('click', openHelp);
  $('help-close').addEventListener('click', closeHelp);
  $('help-backdrop').addEventListener('click', closeHelp);

  let hintShown = false;
  function dismissHint() {
    if (hintShown) { $('toast').hidden = true; hintShown = false; }
  }

  /* ---------- Ukuran layar dan kualitas ---------- */

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    labels.forEach((L) => { L.w = 0; });
    measure();
  }
  window.addEventListener('resize', resize);
  resize();

  // Bila lebih dari separuh bingkai dalam 2 detik lebih lambat dari sekitar 40 fps, resolusi gambar
  // diturunkan sedikit demi sedikit (tidak pernah dinaikkan lagi) supaya gerakan tetap mulus.
  const perf = { frames: 0, slow: 0, since: performance.now() + 4000 };
  function adaptQuality(now, dtMs) {
    if (now < perf.since || system.loading > 0) return;
    perf.frames++;
    if (dtMs > 25) perf.slow++;
    if (now - perf.since < 2000) return;
    const pr = renderer.getPixelRatio();
    if (perf.slow > perf.frames * 0.5 && pr > 1) {
      const next = Math.max(1, pr - 0.25);
      renderer.setPixelRatio(next);
      composer.setPixelRatio(next);
      resize();
    }
    perf.frames = perf.slow = 0;
    perf.since = now;
  }

  /* ---------- Bingkai kamera: benda di tengah ruang yang tidak tertutup panel ---------- */

  const view = { x: 0, y: 0 };
  function updateViewOffset(dt) {
    const W = window.innerWidth, H = window.innerHeight;
    const a = freeArea(!!state.focus && !$('card').hidden);
    const tx = W / 2 - (a.x0 + a.x1) / 2, ty = H / 2 - (a.y0 + a.y1) / 2;
    const k = 1 - Math.exp(-dt * 5);
    view.x += (tx - view.x) * k;
    view.y += (ty - view.y) * k;
    camera.setViewOffset(W, H, view.x, view.y, W, H);
  }

  /* ---------- Putaran utama ---------- */

  let lastFrame = performance.now();
  let lastHud = 0, lastCard = 0;
  const JD_MAX = Astro.jdFromDate(Astro.MAX_DATE), JD_MIN = Astro.jdFromDate(Astro.MIN_DATE);

  function frame() {
    const now = performance.now();
    const dtMs = now - lastFrame;
    const dt = Math.min(dtMs / 1000, 0.1);
    lastFrame = now;
    if (state.playing) {
      state.jd += dt * SPEEDS[state.speed][0] / 86400;
      if (state.jd >= JD_MAX || state.jd <= JD_MIN) {
        state.jd = clampJd(state.jd);
        state.playing = false;
        renderPlay();
        toast('Data orbit JPL yang dipakai hanya berlaku dari tahun 1800 sampai 2050.');
      }
    }
    updateViewOffset(dt);
    system.update(state.jd, camera, state.focus, window.innerHeight, state.near);
    if (fly.active) {
      stepFlight(now);
    } else {
      follow(dt);
      stepZoom(dt);
      controls.update();
      updateNear();
    }
    updateLabels();
    updateDock();
    if (now - lastHud > 200) { renderDate(); lastHud = now; }
    if (now - lastCard > 500) { refreshCardDistance(); lastCard = now; }
    system.updateTextureLevels(now, fly.active);
    adaptQuality(now, dtMs);
    composer.render();
  }

  // Tekstur awal (1K) dulu. Satu bingkai dirender di balik layar muat dengan semua satelit tampak,
  // supaya semua shader sudah dikompilasi sebelum kamera terbang (kompilasi di tengah jalan membuat
  // gerakan tersendat). Setelah itu kamera terbang masuk.
  system.loadInitial().then(() => {
    system.update(state.jd, camera, null, window.innerHeight, null);
    system.allViews().forEach((v) => { v.group.visible = true; });
    composer.render();
    const loader = $('loader');
    loader.classList.add('is-done');
    setTimeout(() => { loader.hidden = true; }, 900);
    if (loadErrors) toast('Sebagian tekstur gagal dimuat. Periksa koneksi, lalu muat ulang.', 6000);
    startFlight(null, new THREE.Vector3(0, 950, 1900).multiplyScalar(small ? 1.45 : 1), 3400);
    let seen = false;
    try { seen = localStorage.getItem('iss:hint') === '1'; localStorage.setItem('iss:hint', '1'); } catch (err) { /* abaikan */ }
    if (!seen) {
      setTimeout(() => {
        if (state.focus) return;
        hintShown = true;
        toast('Seret untuk memutar, gulir ke arah planet untuk mendekat, atau pilih benda di deretan bawah.', 7000);
      }, reduceMotion ? 0 : 3500);
    }
    lastFrame = performance.now();
    renderer.setAnimationLoop(frame);
  });
  renderDate();
  window.__iss = { state, system, camera, controls, fly, focusBody, goHome, renderer }; // untuk uji otomatis
}

main();
