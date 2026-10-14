/*
 * planets.js: membuat benda langit 3D (bola bertekstur, atmosfer, awan, cincin, cahaya Matahari)
 * dan menempatkannya setiap bingkai sesuai tanggal.
 *
 * Skala tampilan: ukuran planet sebanding satu sama lain (1 satuan = jari-jari Bumi), Matahari
 * diperkecil, dan jarak dipadatkan (jarak dalam SA dipangkatkan 0,6) supaya semuanya muat di layar.
 */
import * as THREE from 'three';

const DEG = Math.PI / 180;
const AU_SCALE = 300;     // jarak tampilan = AU_SCALE x (jarak dalam SA)^0,6
const AU_POWER = 0.6;
const EARTH_KM = 6371;    // 1 satuan tampilan = jari-jari Bumi
const SUN_R = 42;         // aslinya 109 kali Bumi; diperkecil supaya planet dalam tidak tertelan
const MOON_DIST = 20;     // aslinya sekitar 60 kali jari-jari Bumi
const OBLIQUITY = 23.4392911 * DEG;
const TEX = 'assets/textures/';

export const BODY_IDS = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

// Lapisan tekstur tiap benda dan resolusi yang tersedia (1 = 1024 px, 2 = 2048 px, 4 = 4096 px).
const LAYERS = {
  sun: { map: ['sun', [1, 2, 4]] },
  mercury: { map: ['mercury', [1, 2, 4]], bump: true },
  venus: { map: ['venus', [1, 2, 4]] },
  earth: {
    map: ['earth_day', [1, 2, 4]], night: ['earth_night', [1, 2, 4]], clouds: ['earth_clouds', [1, 2, 4]],
    normal: ['earth_normal', [2, 4]], roughness: ['earth_roughness', [2, 4]]
  },
  moon: { map: ['moon', [1, 2, 4]], bump: true },
  mars: { map: ['mars', [1, 2, 4]], bump: true },
  jupiter: { map: ['jupiter', [1, 2, 4]] },
  saturn: { map: ['saturn', [1, 2, 4]] },
  uranus: { map: ['uranus', [1, 2]] },
  neptune: { map: ['neptune', [1, 2]] },
  pluto: { map: ['pluto', [1, 2, 4]], bump: true }
};

// Warna cahaya atmosfer di tepi planet: [warna, kekuatan, ketajaman]. Tanpa entri = tanpa atmosfer.
const ATMOSPHERE = {
  earth: [0x5aa8ff, 1.35, 3.2],
  venus: [0xffd9a0, 0.9, 2.6],
  mars: [0xff9a6a, 0.45, 4.0],
  jupiter: [0xffe2c0, 0.45, 3.5],
  saturn: [0xfff0c8, 0.45, 3.5],
  uranus: [0x9fe8ff, 0.7, 3.0],
  neptune: [0x6f9dff, 0.75, 3.0]
};

/* ---------- Koordinat ---------- */

// Ekliptika (z ke kutub utara ekliptika) ke adegan three.js (y ke atas).
function eclToScene(x, y, z, out) {
  return out.set(x, z, -y);
}

// Posisi heliosentris (SA) ke adegan: arah tetap, jarak dipadatkan.
export function helioToScene(p, out) {
  const r = Math.hypot(p.x, p.y, p.z);
  const s = r > 0 ? AU_SCALE * Math.pow(r, AU_POWER) / r : 0;
  return eclToScene(p.x * s, p.y * s, p.z * s, out);
}

function equatorialToScene(raDeg, decDeg, out) {
  const ra = raDeg * DEG, dec = decDeg * DEG;
  const x = Math.cos(dec) * Math.cos(ra), y = Math.cos(dec) * Math.sin(ra), z = Math.sin(dec);
  // Ekuator langit ke ekliptika: putar sebesar kemiringan sumbu Bumi.
  return eclToScene(x, y * Math.cos(OBLIQUITY) + z * Math.sin(OBLIQUITY), -y * Math.sin(OBLIQUITY) + z * Math.cos(OBLIQUITY), out);
}

// Arah sumbu rotasi dan meridian nol menurut IAU: W = W0 + laju x hari sejak J2000.
// Sumbu lokal bola: +Y = kutub utara, +X = bujur 0 (tengah peta tekstur), -Z = bujur 90 derajat timur.
const _pole = new THREE.Vector3(), _node = new THREE.Vector3(), _merid = new THREE.Vector3(), _z = new THREE.Vector3();
const _basis = new THREE.Matrix4();
function orientation(b, days, extraDeg, outQuat) {
  equatorialToScene(b.pole_ra_deg, b.pole_dec_deg, _pole);
  equatorialToScene(b.pole_ra_deg + 90, 0, _node); // simpul naik ekuator benda pada ekuator langit
  const W = (b.w0_deg + b.w_rate_deg_day * days + extraDeg) * DEG;
  _z.crossVectors(_pole, _node); // _pole x _node, tegak lurus keduanya
  _merid.copy(_node).multiplyScalar(Math.cos(W)).addScaledVector(_z, Math.sin(W));
  _z.crossVectors(_merid, _pole);
  _basis.makeBasis(_merid, _pole, _z);
  return outQuat.setFromRotationMatrix(_basis);
}

/* ---------- Shader kecil ---------- */

// Cahaya atmosfer: paling terang di tepi (fresnel), hanya di sisi yang terkena Matahari.
const ATMOSPHERE_VERT = `
  #include <common>
  #include <logdepthbuf_pars_vertex>
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
    #include <logdepthbuf_vertex>
  }`;
const ATMOSPHERE_FRAG = `
  #include <logdepthbuf_pars_fragment>
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    #include <logdepthbuf_fragment>
    vec3 n = normalize(vNormalW);
    vec3 viewDir = normalize(cameraPosition - vPosW);
    float rim = pow(1.0 - max(dot(n, viewDir), 0.0), uPower);
    float lit = smoothstep(-0.3, 0.45, dot(n, normalize(-vPosW)));
    float a = rim * lit * uIntensity;
    gl_FragColor = vec4(uColor * a, a);
  }`;

// Sabuk asteroid: ribuan titik di orbit melingkar miring, digerakkan di GPU menurut hukum Kepler III.
const BELT_VERT = `
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute vec4 orbit;      // a (SA), sudut awal, inklinasi, bujur simpul (radian)
  uniform float uDays;
  uniform float uScale;
  uniform float uSize;
  varying float vFade;
  void main() {
    float a = orbit.x;
    float u = orbit.y + 0.01720209895 * uDays / pow(a, 1.5) - orbit.w;
    float ci = cos(orbit.z), si = sin(orbit.z), cn = cos(orbit.w), sn = sin(orbit.w);
    vec3 e = vec3(cn * cos(u) - sn * sin(u) * ci, sn * cos(u) + cn * sin(u) * ci, sin(u) * si);
    vec3 p = vec3(e.x, e.z, -e.y) * uScale * pow(a, 0.6);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize;
    vFade = fract(orbit.y * 7.13) * 0.5 + 0.5;
    #include <logdepthbuf_vertex>
  }`;
const BELT_FRAG = `
  #include <logdepthbuf_pars_fragment>
  varying float vFade;
  void main() {
    #include <logdepthbuf_fragment>
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vec3(0.62, 0.57, 0.5) * vFade, (1.0 - d * 2.0) * 0.42);
  }`;

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255, 236, 200, 1)');
  grad.addColorStop(0.18, 'rgba(255, 196, 110, 0.55)');
  grad.addColorStop(0.45, 'rgba(255, 140, 50, 0.14)');
  grad.addColorStop(1, 'rgba(255, 120, 40, 0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- Tekstur bertingkat ---------- */

class TextureStore {
  constructor(renderer, manager) {
    this.loader = new THREE.TextureLoader(manager);
    this.aniso = renderer.capabilities.getMaxAnisotropy();
    this.cache = new Map(); // url -> Promise<Texture>
  }

  load(url, srgb) {
    if (!this.cache.has(url)) {
      this.cache.set(url, new Promise((resolve, reject) => {
        this.loader.load(url, (t) => {
          t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          t.anisotropy = this.aniso;
          resolve(t);
        }, undefined, reject);
      }));
    }
    return this.cache.get(url);
  }

  release(url) {
    const p = this.cache.get(url);
    if (!p) return;
    this.cache.delete(url);
    p.then((t) => t.dispose(), () => {});
  }
}

function urlFor(name, levels, want) {
  const k = levels.filter((l) => l <= want).pop() || levels[0];
  return TEX + name + '_' + k + 'k.jpg';
}

/* ---------- Tata surya ---------- */

export class SolarSystem {
  constructor(renderer, scene, data, manager) {
    this.scene = scene;
    this.store = new TextureStore(renderer, manager);
    this.views = new Map();
    this.focusLevel = (Math.min(window.screen.width, window.screen.height) < 700 || renderer.capabilities.maxTextureSize < 8192) ? 2 : 4;

    this.sunLight = new THREE.PointLight(0xfff4e8, 3.2, 0, 0);
    scene.add(this.sunLight);
    scene.add(new THREE.AmbientLight(0x8899bb, 0.022));

    BODY_IDS.forEach((id) => {
      const b = data.bodies.find((x) => x.id === id);
      if (b) this.views.set(id, this.createView(b));
    });
    this.addStars();
    this.addBelt();
    this.orbitJd = null;
  }

  createView(b) {
    const id = b.id;
    const radius = id === 'sun' ? SUN_R : (b.diameter_km / 2) / EARTH_KM;
    const group = new THREE.Group(); // diposisikan dan diperbesar (skala minimum layar)
    const spin = new THREE.Group();  // diputar menurut sumbu rotasi benda
    group.add(spin);
    const geo = new THREE.SphereGeometry(radius, 96, 64);
    const v = { id, data: b, radius, group, spin, level: 0, layers: LAYERS[id], textures: {} };

    if (id === 'sun') {
      v.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.7, 1.45, 1.15) });
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true
      }));
      glow.scale.setScalar(radius * 6);
      group.add(glow);
    } else if (id === 'earth') {
      v.material = new THREE.MeshStandardMaterial({
        roughness: 1, metalness: 0, emissive: new THREE.Color(1.0, 0.82, 0.55), emissiveIntensity: 1.6,
        normalScale: new THREE.Vector2(0.7, 0.7)
      });
      // Lampu kota hanya menyala di sisi malam (cahaya emisi dikalikan faktor malam).
      v.sunDirView = { value: new THREE.Vector3(1, 0, 0) };
      v.material.onBeforeCompile = (shader) => {
        shader.uniforms.uSunDirView = v.sunDirView;
        shader.fragmentShader = 'uniform vec3 uSunDirView;\n' + shader.fragmentShader.replace(
          '#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\n  totalEmissiveRadiance *= smoothstep(0.12, -0.22, dot(normalize(vNormal), uSunDirView));'
        );
      };
      v.clouds = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.009, 96, 64),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, depthWrite: false, roughness: 1, metalness: 0 })
      );
      v.clouds.renderOrder = 1;
      group.add(v.clouds);
    } else {
      v.material = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 });
    }

    v.mesh = new THREE.Mesh(geo, v.material);
    v.mesh.userData.bodyId = id;
    spin.add(v.mesh);

    const atm = ATMOSPHERE[id];
    if (atm) {
      v.atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius * (id === 'earth' ? 1.035 : 1.025), 64, 48),
        new THREE.ShaderMaterial({
          uniforms: { uColor: { value: new THREE.Color(atm[0]) }, uIntensity: { value: atm[1] }, uPower: { value: atm[2] } },
          vertexShader: ATMOSPHERE_VERT, fragmentShader: ATMOSPHERE_FRAG,
          transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
        })
      );
      v.atmosphere.renderOrder = 2;
      group.add(v.atmosphere);
    }

    if (id === 'saturn') this.addRing(v);
    this.scene.add(group);
    if (b.orbit) v.orbitLine = this.makeOrbitLine(b);
    return v;
  }

  // Cincin Saturnus dari sabuk C sampai tepi luar sabuk A (1,24 sampai 2,27 jari-jari Saturnus),
  // dengan bayangan planet dihitung di shader (garis dari titik cincin ke Matahari menembus planet?).
  // Cincin adalah kumpulan butiran es yang menghamburkan cahaya ke segala arah, jadi kecerahannya
  // tidak dibuat bergantung pada sudut datang sinar seperti permukaan padat.
  addRing(v) {
    const inner = v.radius * 1.239, outer = v.radius * 2.269;
    const geo = new THREE.RingGeometry(inner, outer, 256, 1);
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i));
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    geo.rotateX(-Math.PI / 2); // bidang cincin = bidang ekuator (tegak lurus sumbu +Y lokal)
    const shadow = { center: { value: new THREE.Vector3() }, radius: { value: v.radius } };
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.86, 0.82, 0.74), transparent: true, side: THREE.DoubleSide, depthWrite: false });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uPlanetCenter = shadow.center;
      shader.uniforms.uPlanetRadius = shadow.radius;
      shader.vertexShader = 'varying vec3 vRingWorld;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>', '#include <begin_vertex>\n  vRingWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      shader.fragmentShader = 'uniform vec3 uPlanetCenter;\nuniform float uPlanetRadius;\nvarying vec3 vRingWorld;\n' +
        shader.fragmentShader.replace('#include <opaque_fragment>',
          '  vec3 toSun = normalize(-vRingWorld);\n' +
          '  vec3 oc = vRingWorld - uPlanetCenter;\n' +
          '  float bb = dot(oc, toSun);\n' +
          '  float hh = bb * bb - dot(oc, oc) + uPlanetRadius * uPlanetRadius;\n' +
          '  if (hh > 0.0 && bb < 0.0) outgoingLight *= 0.08;\n' +
          '#include <opaque_fragment>');
    };
    v.ring = new THREE.Mesh(geo, mat);
    v.ring.renderOrder = 3;
    v.ringShadow = shadow;
    v.spin.add(v.ring);
    this.store.load(TEX + 'saturn_ring.png', true).then((t) => { mat.map = t; mat.needsUpdate = true; }, () => {});
  }

  makeOrbitLine(b) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(257 * 3), 3));
    const line = new THREE.LineLoop(geo, new THREE.LineBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.11, depthWrite: false
    }));
    line.userData.baseColor = new THREE.Color(b.color || '#ffffff');
    this.scene.add(line);
    return line;
  }

  updateOrbits(jd) {
    const tmp = new THREE.Vector3();
    this.views.forEach((v) => {
      if (!v.orbitLine) return;
      const pts = Astro.orbitPath(v.data.orbit, jd, 256);
      const arr = v.orbitLine.geometry.attributes.position.array;
      pts.forEach((p, i) => {
        if (i > 256) return;
        helioToScene(p, tmp);
        arr[i * 3] = tmp.x; arr[i * 3 + 1] = tmp.y; arr[i * 3 + 2] = tmp.z;
      });
      v.orbitLine.geometry.attributes.position.needsUpdate = true;
      v.orbitLine.geometry.computeBoundingSphere();
    });
    this.orbitJd = jd;
  }

  addStars() {
    // Peta Bima Sakti dalam koordinat galaksi; dicerminkan karena dilihat dari dalam bola.
    const geo = new THREE.SphereGeometry(50000, 64, 32);
    geo.scale(-1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.35, 1.35, 1.45), depthWrite: false });
    this.stars = new THREE.Mesh(geo, mat);
    // Pusat galaksi (bujur ekliptika 266,84 derajat, lintang -5,54) di tengah peta; kutub utara galaksi di atas.
    const gc = new THREE.Vector3(), gnp = new THREE.Vector3(), z = new THREE.Vector3();
    const fromEcl = (lon, lat, out) => eclToScene(Math.cos(lat * DEG) * Math.cos(lon * DEG), Math.cos(lat * DEG) * Math.sin(lon * DEG), Math.sin(lat * DEG), out);
    fromEcl(266.84, -5.54, gc);
    fromEcl(180.02, 29.81, gnp);
    gc.negate(); // setelah dicerminkan, tengah peta berada di -X lokal
    z.crossVectors(gc, gnp);
    this.stars.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(gc, gnp, z));
    this.stars.renderOrder = -1;
    this.scene.add(this.stars);
    const k = this.focusLevel >= 4 ? 4 : 2;
    this.store.load(TEX + 'stars_' + k + 'k.jpg', true).then((t) => { mat.map = t; mat.needsUpdate = true; }, () => {});
  }

  addBelt() {
    const N = 2600;
    const orbit = new Float32Array(N * 4);
    let seed = 20261015;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < N; i++) {
      orbit[i * 4] = 2.1 + rnd() * 1.2;               // 2,1 sampai 3,3 SA
      orbit[i * 4 + 1] = rnd() * Math.PI * 2;
      orbit[i * 4 + 2] = Math.abs(rnd() + rnd() - 1) * 0.3; // kebanyakan hampir datar, sampai 17 derajat
      orbit[i * 4 + 3] = rnd() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute('orbit', new THREE.BufferAttribute(orbit, 4));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), AU_SCALE * 2.2);
    this.beltUniforms = { uDays: { value: 0 }, uScale: { value: AU_SCALE }, uSize: { value: 1.25 * Math.min(window.devicePixelRatio || 1, 2) } };
    this.belt = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: this.beltUniforms, vertexShader: BELT_VERT, fragmentShader: BELT_FRAG,
      transparent: true, depthWrite: false
    }));
    this.scene.add(this.belt);
  }

  /* Muat tekstur pada tingkat tertentu untuk satu benda; tekstur tingkat lama dilepas. */
  async setLevel(id, want) {
    const v = this.views.get(id);
    if (!v || v.level === want) return;
    v.level = want;
    const L = v.layers;
    const jobs = {};
    Object.keys(L).forEach((key) => {
      if (key === 'bump') return;
      const [name, levels] = L[key];
      if (want === 1 && levels[0] > 1) return; // peta normal/kekasaran hanya untuk tampilan dekat
      jobs[key] = urlFor(name, levels, want);
    });
    const loaded = {};
    await Promise.all(Object.entries(jobs).map(([key, url]) =>
      this.store.load(url, key === 'map' || key === 'night').then((t) => { loaded[key] = [t, url]; }, () => {})));
    if (v.level !== want) return; // sudah diganti tingkat lain saat memuat
    const m = v.material;
    const old = Object.assign({}, v.textures);
    if (loaded.map) { m.map = loaded.map[0]; if (L.bump) { m.bumpMap = loaded.map[0]; m.bumpScale = 1.2; } }
    if (loaded.night) { m.emissiveMap = loaded.night[0]; }
    if (loaded.normal) { m.normalMap = loaded.normal[0]; } else if (want === 1) { m.normalMap = null; }
    if (loaded.roughness) { m.roughnessMap = loaded.roughness[0]; } else if (want === 1) { m.roughnessMap = null; }
    if (loaded.clouds && v.clouds) { v.clouds.material.alphaMap = loaded.clouds[0]; v.clouds.material.needsUpdate = true; }
    m.needsUpdate = true;
    v.textures = {};
    Object.entries(loaded).forEach(([key, pair]) => { v.textures[key] = pair[1]; });
    Object.entries(old).forEach(([key, url]) => { if (url !== v.textures[key]) this.store.release(url); });
  }

  loadInitial() {
    return Promise.all(BODY_IDS.map((id) => this.setLevel(id, 1)));
  }

  focusTextures(id, prevId) {
    if (prevId && prevId !== id) this.setLevel(prevId, 1);
    if (id) this.setLevel(id, this.focusLevel);
    // Saat Bumi didekati, Bulan ikut terlihat jelas (dan sebaliknya).
    if (id === 'earth' || id === 'moon') this.setLevel(id === 'earth' ? 'moon' : 'earth', 2);
  }

  /* Tempatkan semua benda untuk tanggal jd (hari Julian). */
  update(jd, camera, focusId, viewportH) {
    const days = jd - Astro.J2000;
    if (this.orbitJd === null || Math.abs(jd - this.orbitJd) > 30) this.updateOrbits(jd);
    this.beltUniforms.uDays.value = days;

    const earthPos = new THREE.Vector3();
    this.views.forEach((v) => {
      const b = v.data;
      if (b.orbit) helioToScene(Astro.helioPosition(b.orbit, jd), v.group.position);
      if (v.id === 'earth') earthPos.copy(v.group.position);
    });
    const moon = this.views.get('moon');
    if (moon) {
      const m = Astro.moonPosition(jd);
      const lon = m.lon * DEG, lat = m.lat * DEG;
      eclToScene(Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat), moon.group.position);
      moon.group.position.multiplyScalar(MOON_DIST).add(earthPos);
    }

    const focalPx = viewportH / (2 * Math.tan(camera.fov * DEG / 2));
    const tmp = new THREE.Vector3();
    this.views.forEach((v) => {
      const b = v.data;
      orientation(b, days, v.id === 'pluto' ? 180 : 0, v.spin.quaternion); // peta Pluto berpusat di bujur 180
      if (v.clouds) orientation(b, days, -days * 9, v.clouds.quaternion);  // awan bergeser pelan
      // Skala minimum: benda kecil yang jauh tetap tampak minimal beberapa piksel.
      const dist = camera.position.distanceTo(v.group.position);
      const px = v.radius / Math.max(dist, 1e-6) * focalPx;
      const minPx = v.id === 'sun' ? 12 : 4.6;
      v.scale = Math.max(1, minPx / px);
      v.group.scale.setScalar(v.scale);
      if (v.sunDirView) {
        tmp.copy(v.group.position).negate().normalize().transformDirection(camera.matrixWorldInverse);
        v.sunDirView.value.copy(tmp);
      }
      if (v.ringShadow) {
        v.ringShadow.center.value.copy(v.group.position);
        v.ringShadow.radius.value = v.radius * v.scale;
      }
    });
    if (moon) {
      const nearEarth = camera.position.distanceTo(earthPos) < 90 || focusId === 'moon';
      moon.group.visible = nearEarth;
    }
    this.views.forEach((v) => {
      if (!v.orbitLine) return;
      const on = v.id === focusId;
      v.orbitLine.material.opacity = focusId ? (on ? 0.1 : 0.02) : 0.11;
      v.orbitLine.material.color.copy(on ? v.orbitLine.userData.baseColor : new THREE.Color(0xffffff));
    });
  }

  pickables() {
    const out = [];
    this.views.forEach((v) => { if (v.group.visible) out.push(v.mesh); });
    return out;
  }
}
