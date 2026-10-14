/*
 * app.js: tata surya 3D satu layar. Mengatur kamera (terbang ke benda, memutar, memperbesar),
 * waktu, label di dalam adegan, kartu info, dan panduan.
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
  if (s < 59.5) return fmt(s, 0) + ' detik';
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

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 0.9;
  controls.minDistance = 90;
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
    $('loader-text').textContent = 'Memuat tekstur planet ' + loaded + ' dari ' + total;
  };
  let loadErrors = 0;
  manager.onError = () => { loadErrors++; };

  const system = new SolarSystem(renderer, scene, DATA, manager);

  const state = {
    jd: clampJd(Astro.jdFromDate(new Date())),
    playing: !reduceMotion,
    speed: 2,
    focus: null
  };

  function clampJd(jd) {
    return Math.min(Astro.jdFromDate(Astro.MAX_DATE), Math.max(Astro.jdFromDate(Astro.MIN_DATE), jd));
  }

  /* ---------- Label ---------- */

  const labels = new Map();
  const labelBox = $('labels');
  BODY_IDS.forEach((id) => {
    const v = system.views.get(id);
    if (!v) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'label is-off';
    b.innerHTML = '<span class="label__dot" style="--c:' + esc(v.data.color || '#fff') + '"></span>' + esc(v.data.name);
    b.setAttribute('aria-label', v.data.name + ', dekati');
    b.addEventListener('click', () => focusBody(id));
    labelBox.appendChild(b);
    labels.set(id, { el: b, w: 0, h: 0 });
  });
  // Saat bertumpuk, label benda besar didahulukan.
  const LABEL_PRIORITY = ['jupiter', 'saturn', 'earth', 'mars', 'venus', 'mercury', 'uranus', 'neptune', 'pluto', 'sun', 'moon'];

  const proj = new THREE.Vector3();
  function updateLabels() {
    const W = window.innerWidth, H = window.innerHeight;
    const focalPx = H / (2 * Math.tan(camera.fov * Math.PI / 360));
    const placed = [];
    LABEL_PRIORITY.forEach((id) => {
      const L = labels.get(id);
      const v = system.views.get(id);
      if (!L || !v) return;
      let show = v.group.visible && !fly.active;
      if (state.focus) show = show && ((state.focus === 'earth' && id === 'moon') || (state.focus === 'moon' && id === 'earth'));
      if (show) {
        proj.copy(v.group.position).project(camera);
        show = proj.z < 1 && Math.abs(proj.x) < 1.05 && Math.abs(proj.y) < 1.05;
      }
      if (show) {
        if (!L.w) { L.w = L.el.offsetWidth || 80; L.h = L.el.offsetHeight || 30; }
        const dist = camera.position.distanceTo(v.group.position);
        const gap = v.radius * v.scale / dist * focalPx + 8;
        const cx = (proj.x + 1) / 2 * W, cy = (1 - proj.y) / 2 * H;
        // Coba kanan, kiri, atas, lalu bawah benda; label disembunyikan bila semuanya bertumpuk.
        const spots = [[cx + gap, cy - L.h / 2], [cx - gap - L.w, cy - L.h / 2], [cx - L.w / 2, cy - gap - L.h], [cx - L.w / 2, cy + gap]];
        let box = null;
        for (let s = 0; s < spots.length && !box; s++) {
          const c = [spots[s][0], spots[s][1], spots[s][0] + L.w, spots[s][1] + L.h];
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

  /* ---------- Kamera: terbang, ikuti, putar ---------- */

  const fly = { active: false };
  const lastTarget = new THREE.Vector3();

  function overviewOffset() {
    // Pertahankan arah pandang mendatar sekarang, dari ketinggian sekitar 24 derajat.
    const off = camera.position.clone().sub(controls.target);
    const sph = new THREE.Spherical().setFromVector3(off.lengthSq() > 0 ? off : new THREE.Vector3(0, 1, 1));
    sph.radius = small ? 3100 : 2150;
    sph.phi = THREE.MathUtils.degToRad(66);
    return new THREE.Vector3().setFromSpherical(sph);
  }

  function focusOffset(id) {
    const v = system.views.get(id);
    const P = v.group.position;
    const up = new THREE.Vector3(0, 1, 0);
    let dir;
    if (id === 'sun') {
      dir = camera.position.clone().sub(controls.target).setY(0).normalize().multiplyScalar(0.9).add(new THREE.Vector3(0, 0.42, 0)).normalize();
    } else {
      // Kamera di sisi yang terkena Matahari, agak menyamping: planet tampak cembung dan bertekstur.
      const toSun = P.clone().negate().normalize();
      const side = new THREE.Vector3().crossVectors(toSun, up).normalize();
      dir = toSun.clone().multiplyScalar(0.8).addScaledVector(side, 0.52).addScaledVector(up, 0.26).normalize();
      if (id === 'saturn') {
        const pole = new THREE.Vector3(0, 1, 0).applyQuaternion(v.spin.quaternion);
        dir.addScaledVector(pole, 0.85 * (Math.sign(pole.dot(toSun)) || 1)).normalize();
      }
    }
    return dir.multiplyScalar(frameDistance(id));
  }

  // Jarak kamera supaya benda (Saturnus beserta cincinnya) mengisi sekitar 60% dari sisi layar yang
  // paling sempit; di ponsel tegak sisi tersempit adalah lebar layar.
  function frameDistance(id) {
    const v = system.views.get(id);
    const rEff = v.radius * (id === 'saturn' ? 2.35 : id === 'sun' ? 1.25 : 1);
    const halfV = THREE.MathUtils.degToRad(camera.fov / 2);
    const halfH = Math.atan(Math.tan(halfV) * camera.aspect);
    return rEff / Math.tan(Math.min(halfV, halfH) * 0.6);
  }

  function startFlight(id, endOffset, duration) {
    fly.active = true;
    fly.id = id;
    fly.t0 = performance.now();
    fly.dur = reduceMotion ? 1 : duration;
    fly.fromPos = camera.position.clone();
    fly.fromTarget = controls.target.clone();
    fly.endOffset = endOffset;
    controls.enabled = false;
  }

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function stepFlight(now) {
    const k = Math.min(1, (now - fly.t0) / fly.dur);
    const e = easeInOut(k);
    const goalTarget = fly.id ? system.views.get(fly.id).group.position : ORIGIN;
    const goalPos = goalTarget.clone().add(fly.endOffset);
    controls.target.lerpVectors(fly.fromTarget, goalTarget, e);
    camera.position.lerpVectors(fly.fromPos, goalPos, e);
    // Lintasan sedikit melengkung ke atas supaya tidak menembus benda di tengah jalan.
    camera.position.y += Math.sin(Math.PI * e) * fly.fromPos.distanceTo(goalPos) * 0.16;
    camera.lookAt(controls.target);
    if (k >= 1) {
      fly.active = false;
      controls.enabled = true;
      setDistanceLimits();
      lastTarget.copy(controls.target);
    }
  }

  function setDistanceLimits() {
    if (state.focus) {
      const v = system.views.get(state.focus);
      controls.minDistance = v.radius * 1.12;
      controls.maxDistance = 9000;
    } else {
      controls.minDistance = 90;
      controls.maxDistance = 9000;
    }
  }

  // Saat waktu berjalan, benda yang difokuskan bergerak; kamera ikut bergeser sejauh itu.
  function followFocus() {
    if (!state.focus || fly.active) return;
    const P = system.views.get(state.focus).group.position;
    const d = P.clone().sub(lastTarget);
    if (d.lengthSq() > 0) {
      camera.position.add(d);
      controls.target.add(d);
      lastTarget.copy(P);
    }
  }

  function orbitBy(dTheta, dPhi) {
    const off = camera.position.clone().sub(controls.target);
    const sph = new THREE.Spherical().setFromVector3(off);
    sph.theta += dTheta;
    sph.phi = THREE.MathUtils.clamp(sph.phi + dPhi, 0.05, Math.PI - 0.05);
    camera.position.copy(controls.target).add(off.setFromSpherical(sph));
  }

  function zoomBy(factor) {
    const off = camera.position.clone().sub(controls.target);
    const len = THREE.MathUtils.clamp(off.length() * factor, controls.minDistance, controls.maxDistance);
    camera.position.copy(controls.target).add(off.setLength(len));
  }

  /* ---------- Fokus dan kartu ---------- */

  function focusBody(id) {
    if (!system.views.has(id)) return;
    if (state.focus === id && !fly.active) {
      // Klik lagi pada benda yang sama: kembali ke sudut pandang terbaik.
      startFlight(id, focusOffset(id), 900);
      return;
    }
    const prev = state.focus;
    state.focus = id;
    system.focusTextures(id, prev);
    startFlight(id, focusOffset(id), prev ? 1900 : 2200);
    document.body.classList.add('is-focused');
    $('home-text').textContent = 'Tata surya';
    $('home').setAttribute('aria-label', 'Kembali ke seluruh tata surya');
    showCard(id);
  }

  function goHome() {
    if (!state.focus && !fly.active) return;
    const prev = state.focus;
    state.focus = null;
    system.focusTextures(null, prev);
    startFlight(null, overviewOffset(), 2000);
    document.body.classList.remove('is-focused');
    $('home-text').textContent = 'Interactive Solar System';
    $('home').removeAttribute('aria-label');
    $('card').hidden = true;
  }

  const earthData = DATA.bodies.find((b) => b.id === 'earth');

  function cardStats(b) {
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
      const d = b.orbital_period_days;
      const label = b.id === 'moon' ? 'Mengelilingi Bumi' : 'Satu tahun';
      out.push([label, d >= 730 ? fmt(d / DATA.constants.SIDEREAL_YEAR_DAYS, 1) + ' tahun Bumi' : fmt(d, d < 100 ? 1 : 0) + ' hari', '']);
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

  function distanceStat(b) {
    const C = Astro.C_KM_S, AU = Astro.AU_KM;
    const jd = state.jd;
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

  function showCard(id) {
    const b = system.views.get(id).data;
    const stats = cardStats(b).map((s) => (s[0] === 'dist' ? distanceStat(b) : s));
    const desc = (b.description || []).map((p) => '<p>' + esc(p) + '</p>').join('');
    const facts = (b.facts || []).map((f) => '<li>' + esc(f) + '</li>').join('');
    const moons = (b.moonList || []).map((m) => m.name).filter(Boolean);
    const card = $('card');
    card.innerHTML =
      '<button class="round card__close" type="button" aria-label="Tutup, kembali ke seluruh tata surya">' +
      '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
      '<p class="card__kicker">' + esc(b.category || '') + '</p>' +
      '<h2 class="card__title" id="card-title" tabindex="-1">' + esc(b.name) + '</h2>' +
      '<p class="card__tagline">' + esc(b.tagline || '') + '</p>' +
      '<dl class="stats">' + stats.map(statHtml).join('') + '</dl>' +
      '<p class="card__summary">' + esc(b.summary || '') + '</p>' +
      '<details class="card__more"><summary>Selengkapnya</summary>' + desc +
      (facts ? '<h3>Fakta</h3><ul class="card__facts">' + facts + '</ul>' : '') +
      (moons.length ? '<h3>Satelit yang terkenal</h3><p>' + esc(moons.join(', ')) + '</p>' : '') +
      (b.composition ? '<h3>Susunan</h3><p>' + esc(b.composition) + '</p>' : '') +
      '</details>' +
      '<p class="card__source">Data: NASA NSSDCA dan JPL. Jarak dihitung untuk tanggal di bawah.</p>';
    card.hidden = false;
    card.scrollTop = 0;
    card.querySelector('.card__close').addEventListener('click', goHome);
    card.dataset.id = id;
  }

  function refreshCardDistance() {
    const card = $('card');
    if (card.hidden || !card.dataset.id) return;
    const b = system.views.get(card.dataset.id).data;
    const s = distanceStat(b);
    const cell = card.querySelector('.stats > div:nth-child(2)');
    if (cell) cell.outerHTML = statHtml(s);
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
    return hit ? hit.object.userData.bodyId : null;
  }

  canvas.addEventListener('pointerdown', (e) => {
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
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
  canvas.addEventListener('wheel', dismissHint, { passive: true });

  const ORDER = BODY_IDS.filter((id) => system.views.has(id));
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
        const i = state.focus ? ORDER.indexOf(state.focus) : (e.key === 'ArrowRight' ? -1 : 0);
        const next = ORDER[(i + (e.key === 'ArrowRight' ? 1 : -1) + ORDER.length) % ORDER.length];
        focusBody(next);
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
    if (state.focus) goHome();
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
    $('speed-label').textContent = 'Kecepatan: ' + label;
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

  function renderDate() {
    const d = Astro.dateFromJd(state.jd);
    $('date').textContent = dateFormat.format(d) + ', ' + timeFormat.format(d);
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

  /* ---------- Ukuran layar ---------- */

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    labels.forEach((L) => { L.w = 0; });
  }
  window.addEventListener('resize', resize);
  resize();

  /* ---------- Bingkai kamera: planet di tengah ruang yang tidak tertutup kartu ---------- */

  const view = { x: 0, y: 0 };
  function updateViewOffset() {
    const W = window.innerWidth, H = window.innerHeight;
    const card = $('card');
    let tx = 0, ty = 0;
    if (state.focus && !card.hidden) {
      if (W > 720) tx = (card.offsetWidth + 18) / 2;          // kartu di kanan: geser gambar ke kiri
      else ty = Math.min(card.offsetHeight, H * 0.46) / 2 + 10; // lembar bawah: geser gambar ke atas
    }
    view.x += (tx - view.x) * 0.08;
    view.y += (ty - view.y) * 0.08;
    if (!tx && !ty && Math.abs(view.x) < 0.5 && Math.abs(view.y) < 0.5) {
      view.x = view.y = 0;
      if (camera.view && camera.view.enabled) camera.clearViewOffset();
      return;
    }
    camera.setViewOffset(W, H, view.x, view.y, W, H);
  }

  /* ---------- Putaran utama ---------- */

  let lastFrame = performance.now();
  let lastHud = 0, lastCard = 0;
  const JD_MAX = Astro.jdFromDate(Astro.MAX_DATE), JD_MIN = Astro.jdFromDate(Astro.MIN_DATE);

  function frame() {
    const now = performance.now();
    const dt = Math.min((now - lastFrame) / 1000, 0.1);
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
    updateViewOffset();
    system.update(state.jd, camera, state.focus, window.innerHeight);
    if (fly.active) stepFlight(now);
    else {
      followFocus();
      controls.update();
    }
    updateLabels();
    if (now - lastHud > 200) { renderDate(); lastHud = now; }
    if (now - lastCard > 500) { refreshCardDistance(); lastCard = now; }
    composer.render();
  }

  // Tekstur awal (1K) dulu, baru adegan ditampilkan dan kamera terbang masuk.
  const started = performance.now();
  system.loadInitial().then(() => {
    const loader = $('loader');
    loader.classList.add('is-done');
    setTimeout(() => { loader.hidden = true; }, 900);
    if (loadErrors) toast('Sebagian tekstur gagal dimuat. Periksa koneksi, lalu muat ulang.', 6000);
    startFlight(null, new THREE.Vector3(0, 950, 1900).multiplyScalar(small ? 1.45 : 1), reduceMotion ? 1 : 3200);
    let seen = false;
    try { seen = localStorage.getItem('iss:hint') === '1'; localStorage.setItem('iss:hint', '1'); } catch (err) { /* abaikan */ }
    if (!seen) {
      setTimeout(() => {
        if (state.focus) return;
        hintShown = true;
        toast('Seret untuk memutar, gulir atau cubit untuk memperbesar, klik planet untuk mendekat.', 7000);
      }, reduceMotion ? 0 : 3300);
    }
  });
  renderDate();
  renderer.setAnimationLoop(frame);
  window.__iss = { state, system, camera, controls, focusBody, goHome, started }; // untuk uji otomatis
}

main();
