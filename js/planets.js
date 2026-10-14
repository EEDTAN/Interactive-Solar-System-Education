/*
 * planets.js: membuat benda langit 3D (bola bertekstur, atmosfer, awan, cincin, cahaya Matahari,
 * satelit) dan menempatkannya setiap bingkai sesuai tanggal.
 *
 * Skala tampilan: ukuran planet dan satelit sebanding satu sama lain (1 satuan = jari-jari Bumi),
 * Matahari diperkecil, jarak dari Matahari dipadatkan (jarak dalam SA dipangkatkan 0,6), dan jarak
 * satelit ke planetnya juga dipadatkan supaya semuanya muat di layar.
 */
import * as THREE from 'three';

const DEG = Math.PI / 180;
const AU_SCALE = 300;     // jarak tampilan = AU_SCALE x (jarak dalam SA)^0,6
const AU_POWER = 0.6;
const EARTH_KM = 6371;    // 1 satuan tampilan = jari-jari Bumi
const SUN_R = 42;         // aslinya 109 kali Bumi; diperkecil supaya planet dalam tidak tertelan
const OBLIQUITY = 23.4392911 * DEG;
const TEX = 'assets/textures/';

// Peta cincin Saturnus mencakup 69.647 sampai 140.971 km dari pusat. Angka ini dicocokkan dari letak tepi
// luar cincin B (117.580 km), celah Encke (133.589 km), dan tepi luar cincin A (136.775 km) pada peta;
// ketiganya meleset kurang dari 50 km.
const SATURN_RING = [69647 / 60268, 140971 / 60268];
// Cincin Uranus 6, 5, 4, alfa, beta, eta, gama, delta, lambda, epsilon: jari-jari dan lebar dalam km dari
// NASA NSSDCA Uranian Rings Fact Sheet (lebar yang berupa rentang diambil nilai tengahnya). Aslinya cincin
// ini sangat gelap (albedo sekitar 0,015) dan jauh lebih tipis dari satu piksel layar; di sini tiap cincin
// digambar minimal setebal 1 piksel dan lebih terang supaya terlihat.
const URANUS_RINGS = [[41837, 1.5], [42234, 2], [42571, 2], [44718, 7], [45661, 8], [47176, 1.6], [47627, 2.5], [48300, 5], [50024, 2], [51149, 58]];
const URANUS_KM = 25559;

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

// Satelit yang punya peta permukaan asli di assets/textures/moons/ (sumbernya di CREDITS.md di sana).
const MOON_TEXTURES = new Set(['phobos', 'deimos', 'io', 'europa', 'ganymede', 'callisto', 'mimas', 'enceladus',
  'tethys', 'dione', 'rhea', 'titan', 'iapetus', 'miranda', 'ariel', 'umbriel', 'titania', 'oberon', 'triton', 'charon']);

// Warna cahaya atmosfer di tepi planet: [warna, kekuatan, ketajaman]. Tanpa entri = tanpa atmosfer.
const ATMOSPHERE = {
  earth: [0x5aa8ff, 1.35, 3.2],
  venus: [0xffd9a0, 0.9, 2.6],
  mars: [0xff9a6a, 0.45, 4.0],
  jupiter: [0xffe2c0, 0.45, 3.5],
  saturn: [0xfff0c8, 0.45, 3.5],
  uranus: [0x9fe8ff, 0.7, 3.0],
  neptune: [0x6f9dff, 0.75, 3.0],
  titan: [0xffb560, 0.9, 2.4]
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

// Jarak satelit ke planetnya di layar: jari-jari planet x (1,6 + 1,6 x akar(a / R)). Urutan satelit
// tetap benar, tetapi satelit jauh seperti Callisto tidak sampai menyeberang ke orbit planet lain.
function moonDisplayDistance(aKm, planetKm, planetRadius) {
  return planetRadius * (1.6 + 1.6 * Math.sqrt(aKm / planetKm));
}

// Arah sumbu rotasi dan meridian nol menurut IAU: W = W0 + laju x hari sejak J2000.
// Sumbu lokal bola: +Y = kutub utara, +X = bujur 0 (tengah peta tekstur), -Z = bujur 90 derajat timur.
const _pole = new THREE.Vector3(), _node = new THREE.Vector3(), _merid = new THREE.Vector3(), _z = new THREE.Vector3();
const _basis = new THREE.Matrix4();
function orientation(b, days, extraDeg, outQuat) {
  equatorialToScene(b.pole_ra_deg, b.pole_dec_deg, _pole);
  equatorialToScene(b.pole_ra_deg + 90, 0, _node); // simpul naik ekuator benda pada ekuator langit
  const W = (b.w0_deg + b.w_rate_deg_day * days + extraDeg) * DEG;
  _z.crossVectors(_pole, _node);
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

function solidTexture(r, g, b, a) {
  const t = new THREE.DataTexture(new Uint8Array([r, g, b, a === undefined ? 255 : a]), 1, 1);
  t.needsUpdate = true;
  return t;
}

/* ---------- Tekstur bertingkat ---------- */

class TextureStore {
  constructor(renderer, manager) {
    this.renderer = renderer;
    // ImageBitmapLoader mengurai gambar di luar utas utama, jadi tampilan tidak tersendat.
    this.bitmap = typeof createImageBitmap === 'function';
    if (this.bitmap) {
      this.loader = new THREE.ImageBitmapLoader(manager);
      this.loader.setOptions({ imageOrientation: 'flipY' });
    } else {
      this.loader = new THREE.TextureLoader(manager);
    }
    this.aniso = renderer.capabilities.getMaxAnisotropy();
    this.cache = new Map(); // url -> Promise<Texture>
  }

  load(url, srgb) {
    if (!this.cache.has(url)) {
      this.cache.set(url, new Promise((resolve, reject) => {
        this.loader.load(url, (res) => {
          const t = this.bitmap ? new THREE.Texture(res) : res;
          if (this.bitmap) t.flipY = false;
          t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          t.anisotropy = this.aniso;
          t.needsUpdate = true;
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
    p.then((t) => {
      t.dispose();
      if (t.image && t.image.close) t.image.close();
    }, () => {});
  }
}

function urlFor(name, levels, want) {
  const k = levels.filter((l) => l <= want).pop() || levels[0];
  return TEX + name + '_' + k + 'k.jpg';
}

// Tingkat tekstur menurut jari-jari benda di layar (piksel), dengan jeda supaya tidak bolak-balik.
function levelForPixels(px, current) {
  const want = px > 300 ? 4 : px > 90 ? 2 : 1;
  if (want >= current) return want;
  if (current === 4 && px > 200) return 4;
  if (current === 2 && px > 55) return 2;
  return want;
}

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/* ---------- Tata surya ---------- */

export class SolarSystem {
  constructor(renderer, scene, data, manager) {
    this.scene = scene;
    this.renderer = renderer;
    this.store = new TextureStore(renderer, manager);
    this.views = new Map();   // planet, Matahari, Bulan
    this.moons = [];          // satelit planet lain
    const small = Math.min(window.screen.width, window.screen.height) < 700;
    const maxTex = renderer.capabilities.maxTextureSize;
    this.maxLevel = (small || maxTex < 4096) ? 2 : 4;
    this.ringSize = (small || maxTex < 8192) ? 4 : 8;
    this.loading = 0;

    this.sunLight = new THREE.PointLight(0xfff4e8, 3.2, 0, 0);
    scene.add(this.sunLight);
    scene.add(new THREE.AmbientLight(0x8899bb, 0.022));

    BODY_IDS.forEach((id) => {
      const b = data.bodies.find((x) => x.id === id);
      if (b) this.views.set(id, this.createView(b));
    });
    this.views.forEach((v) => {
      (v.data.moonList || []).forEach((m) => {
        if ((m.frame === 'laplace' || m.frame === 'equatorial') && m.radius_km) this.moons.push(this.createMoon(v, m));
      });
    });
    this.all = Array.from(this.views.values()).concat(this.moons);
    this.all.forEach((v) => {
      v.maxLevel = v.layers ? Math.max.apply(null, Object.values(v.layers).filter(Array.isArray).map((l) => l[1][l[1].length - 1])) : 1;
    });
    this.addStars();
    this.addBelt();
    this.orbitJd = null;
  }

  allViews() {
    return this.all;
  }

  get(id) {
    return this.views.get(id) || this.moons.find((m) => m.id === id) || null;
  }

  createView(b) {
    const id = b.id;
    const radius = id === 'sun' ? SUN_R : (b.diameter_km / 2) / EARTH_KM;
    const group = new THREE.Group(); // diposisikan dan diperbesar (skala minimum layar)
    const spin = new THREE.Group();  // diputar menurut sumbu rotasi benda
    group.add(spin);
    const geo = new THREE.SphereGeometry(radius, 128, 96);
    const v = {
      id, name: b.name, data: b, radius, group, spin, level: 0, want: 1, lowSince: 0,
      layers: LAYERS[id], textures: {}, scale: 1, px: 0
    };

    if (id === 'sun') {
      v.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.7, 1.45, 1.15) });
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true
      }));
      glow.scale.setScalar(radius * 6);
      group.add(glow);
    } else if (id === 'earth') {
      // Peta normal dan kekasaran diganti dengan tekstur 1 piksel netral sampai versi aslinya dimuat,
      // supaya shader tidak perlu dikompilasi ulang (itu yang membuat tampilan tersendat).
      v.placeholders = { normal: solidTexture(128, 128, 255), roughness: solidTexture(255, 255, 255) };
      v.material = new THREE.MeshStandardMaterial({
        roughness: 1, metalness: 0, emissive: new THREE.Color(1.0, 0.82, 0.55), emissiveIntensity: 1.6,
        normalMap: v.placeholders.normal, roughnessMap: v.placeholders.roughness,
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
        new THREE.SphereGeometry(radius * 1.009, 128, 96),
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
    this.addAtmosphere(v, ATMOSPHERE[id], id === 'earth' ? 1.035 : 1.025);
    if (id === 'saturn') this.addSaturnRing(v);
    if (id === 'uranus') this.addUranusRings(v);
    this.scene.add(group);
    if (b.orbit) v.orbitLine = this.makeOrbitLine(b.color);
    return v;
  }

  addAtmosphere(v, atm, scale) {
    if (!atm) return;
    v.atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(v.radius * scale, 64, 48),
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(atm[0]) }, uIntensity: { value: atm[1] }, uPower: { value: atm[2] } },
        vertexShader: ATMOSPHERE_VERT, fragmentShader: ATMOSPHERE_FRAG,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    v.atmosphere.renderOrder = 2;
    v.group.add(v.atmosphere);
  }

  /* Satelit: bola bertekstur (bila ada peta aslinya) yang beredar menurut elemen orbit rata-rata JPL. */
  createMoon(parent, m) {
    const id = slug(m.name);
    const radius = m.radius_km / EARTH_KM;
    const group = new THREE.Group();
    const spin = new THREE.Group();
    group.add(spin);
    const textured = MOON_TEXTURES.has(id);
    const material = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0, color: textured ? 0xffffff : 0xb9b4ac });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 48), material);
    mesh.userData.bodyId = id;
    spin.add(mesh);
    const v = {
      id, name: m.name, isMoon: true, parent, data: m, radius, group, spin, mesh, material,
      level: 0, want: 1, lowSince: 0, scale: 1, px: 0, textures: {},
      layers: textured ? { map: ['moons/' + id, [1, 2]], bump: true } : null,
      dist: moonDisplayDistance(m.distance_km, parent.data.diameter_km / 2, parent.radius)
    };
    // Bidang acuan orbit (bidang Laplace atau ekuator planet), simpul, dan kutub orbit, dihitung sekali.
    const P = equatorialToScene(m.pole_ra_deg, m.pole_dec_deg, new THREE.Vector3());
    const N = equatorialToScene(m.pole_ra_deg + 90, 0, new THREE.Vector3());
    const Y = new THREE.Vector3().crossVectors(P, N);
    const node = m.node_deg * DEG, inc = m.inc_deg * DEG;
    const nHat = N.clone().multiplyScalar(Math.cos(node)).addScaledVector(Y, Math.sin(node));
    const pole = P.clone().multiplyScalar(Math.cos(inc)).addScaledVector(new THREE.Vector3().crossVectors(nHat, P), Math.sin(inc));
    // Kutub utara benda (IAU) berlawanan dengan kutub orbit bila orbitnya retrograd (Triton).
    v.orbit = { nHat, mHat: new THREE.Vector3().crossVectors(pole, nHat), pole, north: m.retrograde ? pole.clone().negate() : pole };
    this.addAtmosphere(v, ATMOSPHERE[id], 1.04);
    this.scene.add(group);
    return v;
  }

  // Cincin Saturnus dari peta Solar System Scope (8192 px ke arah jari-jari). Cincin adalah butiran es:
  // dari sisi yang terkena Matahari terlihat terang; dari sisi gelap hanya bagian tipis yang meneruskan
  // cahaya. Bayangan planet jatuh di cincin, dan bayangan cincin jatuh di planet.
  addSaturnRing(v) {
    const inner = v.radius * SATURN_RING[0], outer = v.radius * SATURN_RING[1];
    const geo = new THREE.RingGeometry(inner, outer, 512, 1);
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i));
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    geo.rotateX(-Math.PI / 2); // bidang cincin = bidang ekuator (tegak lurus sumbu +Y lokal)
    const u = {
      center: { value: new THREE.Vector3() },
      radius: { value: v.radius },
      normal: { value: new THREE.Vector3(0, 1, 0) },
      inner: { value: inner },
      outer: { value: outer },
      tex: { value: solidTexture(0, 0, 0, 0) }
    };
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.12, 1.07, 0.98), transparent: true, side: THREE.DoubleSide, depthWrite: false });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uPlanetCenter = u.center;
      shader.uniforms.uPlanetRadius = u.radius;
      shader.uniforms.uRingNormal = u.normal;
      shader.vertexShader = 'varying vec3 vRingWorld;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>', '#include <begin_vertex>\n  vRingWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      shader.fragmentShader = 'uniform vec3 uPlanetCenter;\nuniform float uPlanetRadius;\nuniform vec3 uRingNormal;\nvarying vec3 vRingWorld;\n' +
        shader.fragmentShader.replace('#include <opaque_fragment>', [
          '  vec3 toSun = normalize(-vRingWorld);',
          '  vec3 toCam = normalize(cameraPosition - vRingWorld);',
          '  float sunSide = dot(uRingNormal, toSun);',
          '  float camSide = dot(uRingNormal, toCam);',
          '  // Dari sisi gelap: bagian padat (cincin B) gelap, bagian tipis (cincin C, celah Cassini) bercahaya.',
          '  if (sunSide * camSide < 0.0) outgoingLight *= 0.12 + 1.1 * (1.0 - diffuseColor.a);',
          '  // Sinar Matahari yang sangat landai (dekat ekuinoks Saturnus) membuat cincin lebih redup.',
          '  outgoingLight *= 0.7 + 0.3 * sqrt(abs(sunSide));',
          '  vec3 oc = vRingWorld - uPlanetCenter;',
          '  float bb = dot(oc, toSun);',
          '  float dd = sqrt(max(dot(oc, oc) - bb * bb, 0.0)) / uPlanetRadius;',
          '  if (bb < 0.0) outgoingLight *= mix(0.05, 1.0, smoothstep(0.985, 1.015, dd));',
          '#include <opaque_fragment>'].join('\n'));
    };
    v.ring = new THREE.Mesh(geo, mat);
    v.ring.renderOrder = 3;
    v.ringUniforms = u;
    v.spin.add(v.ring);

    // Bayangan cincin di permukaan Saturnus: garis dari titik permukaan ke Matahari memotong bidang
    // cincin; tingkat gelapnya mengikuti kerapatan (alfa) peta cincin di jari-jari itu.
    v.material.onBeforeCompile = (shader) => {
      shader.uniforms.uRingTex = u.tex;
      shader.uniforms.uRingIn = u.inner;
      shader.uniforms.uRingOut = u.outer;
      shader.uniforms.uRingNormal = u.normal;
      shader.uniforms.uCenter = u.center;
      shader.vertexShader = 'varying vec3 vSatWorld;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>', '#include <begin_vertex>\n  vSatWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      shader.fragmentShader = 'uniform sampler2D uRingTex;\nuniform float uRingIn;\nuniform float uRingOut;\nuniform vec3 uRingNormal;\nuniform vec3 uCenter;\nvarying vec3 vSatWorld;\n' +
        shader.fragmentShader.replace('#include <opaque_fragment>', [
          '  vec3 sunDirS = normalize(-vSatWorld);',
          '  float den = dot(sunDirS, uRingNormal);',
          '  if (abs(den) > 1e-4) {',
          '    float tt = dot(uCenter - vSatWorld, uRingNormal) / den;',
          '    if (tt > 0.0) {',
          '      float rr = length(vSatWorld + sunDirS * tt - uCenter);',
          '      float uu = (rr - uRingIn) / (uRingOut - uRingIn);',
          '      if (uu > 0.0 && uu < 1.0) outgoingLight *= 1.0 - 0.85 * texture(uRingTex, vec2(uu, 0.5)).a;',
          '    }',
          '  }',
          '#include <opaque_fragment>'].join('\n'));
    };

    this.ringReady = this.store.load(TEX + 'saturn_ring_' + this.ringSize + 'k.png', true).then((t) => {
      t.wrapS = THREE.ClampToEdgeWrapping;
      mat.map = t;
      mat.needsUpdate = true;
      u.tex.value = t;
    }, () => {});
  }

  // Cincin Uranus: sempit dan gelap, di bidang ekuator yang nyaris tegak lurus orbitnya. Tiap cincin dihitung
  // langsung di shader dari jari-jarinya (bukan dari gambar), jadi tetap tampak sebagai garis tajam.
  addUranusRings(v) {
    const inner = v.radius * 41000 / URANUS_KM, outer = v.radius * 52000 / URANUS_KM;
    const geo = new THREE.RingGeometry(inner, outer, 256, 1);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.5, 0.52, 0.56), transparent: true, side: THREE.DoubleSide, depthWrite: false
    });
    const rings = URANUS_RINGS.map(([r, w]) => new THREE.Vector2(r, w));
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uRings = { value: rings };
      shader.uniforms.uKmPerUnit = { value: URANUS_KM / v.radius };
      shader.vertexShader = 'varying vec3 vRingLocal;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>', '#include <begin_vertex>\n  vRingLocal = position;');
      shader.fragmentShader = 'uniform vec2 uRings[' + rings.length + '];\nuniform float uKmPerUnit;\nvarying vec3 vRingLocal;\n' +
        shader.fragmentShader.replace('#include <opaque_fragment>', [
          '  float rk = length(vRingLocal.xz) * uKmPerUnit;',
          '  float fw = max(fwidth(rk), 1e-3);',
          '  float cover = 0.0;',
          '  for (int i = 0; i < ' + rings.length + '; i++) {',
          '    float hw = max(uRings[i].y * 0.5, fw * 0.6);',
          '    float c = 1.0 - smoothstep(hw - fw * 0.5, hw + fw * 0.5, abs(rk - uRings[i].x));',
          '    cover = max(cover, c * (uRings[i].y > 20.0 ? 0.5 : 0.24));',
          '  }',
          '  diffuseColor.a *= cover;',
          '#include <opaque_fragment>'].join('\n'));
    };
    const ring = new THREE.Mesh(geo, mat);
    ring.renderOrder = 3;
    v.spin.add(ring);
  }

  makeOrbitLine(color) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(257 * 3), 3));
    const line = new THREE.LineLoop(geo, new THREE.LineBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.11, depthWrite: false
    }));
    line.userData.baseColor = new THREE.Color(color || '#ffffff');
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
    const k = this.maxLevel >= 4 ? 4 : 2;
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
  async setLevel(v, want) {
    if (!v.layers || v.level === want) return;
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
    this.loading++;
    await Promise.all(Object.entries(jobs).map(([key, url]) =>
      this.store.load(url, key === 'map' || key === 'night').then((t) => { loaded[key] = [t, url]; }, () => {})));
    this.loading--;
    if (v.level !== want) return; // sudah diganti tingkat lain saat memuat
    const m = v.material;
    const first = !m.map;
    const old = Object.assign({}, v.textures);
    if (loaded.map) { m.map = loaded.map[0]; if (L.bump) { m.bumpMap = loaded.map[0]; m.bumpScale = v.isMoon ? 0.45 : 0.8; } }
    if (loaded.night) m.emissiveMap = loaded.night[0];
    if (v.placeholders) {
      // Tingkat 1 tidak memakai peta normal/kekasaran: kembali ke tekstur netral sebelum yang lama dilepas.
      m.normalMap = loaded.normal ? loaded.normal[0] : v.placeholders.normal;
      m.roughnessMap = loaded.roughness ? loaded.roughness[0] : v.placeholders.roughness;
    }
    if (loaded.clouds && v.clouds) {
      if (!v.clouds.material.alphaMap) v.clouds.material.needsUpdate = true;
      v.clouds.material.alphaMap = loaded.clouds[0];
    }
    // Hanya pemuatan pertama mengubah jenis shader; pergantian resolusi cukup menukar teksturnya.
    if (first) m.needsUpdate = true;
    v.textures = {};
    Object.entries(loaded).forEach(([key, pair]) => { v.textures[key] = pair[1]; });
    Object.entries(old).forEach(([key, url]) => { if (url !== v.textures[key]) this.store.release(url); });
  }

  loadInitial() {
    return Promise.all(this.all.map((v) => this.setLevel(v, 1)).concat(this.ringReady || []));
  }

  // Ganti resolusi tekstur menurut ukuran benda di layar. Saat kamera sedang terbang (busy),
  // tekstur besar ditunda supaya perjalanan tetap mulus.
  updateTextureLevels(now, busy) {
    if (busy || this.loading > 0) return;
    for (const v of this.allViews()) {
      if (!v.layers || !v.group.visible) continue;
      const want = Math.min(levelForPixels(v.px, v.level || 1), this.maxLevel, v.maxLevel);
      if (want > v.level) { this.setLevel(v, want); return; }
      if (want < v.level) {
        if (!v.lowSince) v.lowSince = now;
        if (now - v.lowSince > 4000) { v.lowSince = 0; this.setLevel(v, want); return; }
      } else {
        v.lowSince = 0;
      }
    }
  }

  /* Tempatkan semua benda untuk tanggal jd (hari Julian). */
  update(jd, camera, focusId, viewportH, nearId) {
    const days = jd - Astro.J2000;
    if (this.orbitJd === null || Math.abs(jd - this.orbitJd) > 30) this.updateOrbits(jd);
    this.beltUniforms.uDays.value = days;

    const earth = this.views.get('earth');
    this.views.forEach((v) => {
      if (v.data.orbit) helioToScene(Astro.helioPosition(v.data.orbit, jd), v.group.position);
    });
    const moon = this.views.get('moon');
    if (moon && earth) {
      const m = Astro.moonPosition(jd);
      const lon = m.lon * DEG, lat = m.lat * DEG;
      eclToScene(Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat), moon.group.position);
      const d = moonDisplayDistance(m.distKm, earth.data.diameter_km / 2, earth.radius);
      moon.group.position.multiplyScalar(d).add(earth.group.position);
    }
    const dir = new THREE.Vector3(), toPlanet = new THREE.Vector3(), z = new THREE.Vector3(), basis = new THREE.Matrix4();
    for (const s of this.moons) {
      const o = s.orbit, m = s.data;
      const u = (m.argp_deg + m.mean_anomaly_deg + 360 * (days - (m.epoch_jd - Astro.J2000)) / m.period_days) * DEG;
      dir.copy(o.nHat).multiplyScalar(Math.cos(u)).addScaledVector(o.mHat, Math.sin(u));
      s.group.position.copy(s.parent.group.position).addScaledVector(dir, s.dist);
      // Terkunci pasang surut: bujur 0 (tengah peta) selalu menghadap planetnya.
      toPlanet.copy(dir).negate();
      z.crossVectors(toPlanet, o.north);
      basis.makeBasis(toPlanet, o.north, z);
      s.spin.quaternion.setFromRotationMatrix(basis);
    }

    const focalPx = viewportH / (2 * Math.tan(camera.fov * DEG / 2));
    const tmp = new THREE.Vector3();
    const focusView = focusId ? this.get(focusId) : null;
    const nearView = nearId ? this.get(nearId) : null;
    this.views.forEach((v) => {
      const b = v.data;
      orientation(b, days, v.id === 'pluto' ? 180 : 0, v.spin.quaternion); // peta Pluto berpusat di bujur 180
      if (v.clouds) orientation(b, days, -days * 9, v.clouds.quaternion);  // awan bergeser pelan
      if (v.sunDirView) {
        tmp.copy(v.group.position).negate().normalize().transformDirection(camera.matrixWorldInverse);
        v.sunDirView.value.copy(tmp);
      }
    });
    for (const v of this.all) {
      // Skala minimum: benda kecil yang jauh tetap tampak minimal beberapa piksel.
      const dist = camera.position.distanceTo(v.group.position);
      const px = v.radius / Math.max(dist, 1e-6) * focalPx;
      const minPx = v.id === 'sun' ? 12 : (v.isMoon || v.id === 'moon') ? 2.6 : 4.6;
      v.scale = Math.max(1, minPx / px);
      v.px = px * v.scale;
      v.group.scale.setScalar(v.scale);
      if (v.ringUniforms) {
        v.ringUniforms.center.value.copy(v.group.position);
        v.ringUniforms.radius.value = v.radius * v.scale;
        v.ringUniforms.inner.value = v.radius * SATURN_RING[0] * v.scale;
        v.ringUniforms.outer.value = v.radius * SATURN_RING[1] * v.scale;
        v.ringUniforms.normal.value.set(0, 1, 0).applyQuaternion(v.spin.quaternion);
      }
    }
    // Satelit planet lain baru tampak saat kamera cukup dekat ke planetnya; Bulan selalu ada. Satelit yang
    // di layar menempel pada planetnya (planet jauh yang diperbesar ke ukuran minimum) disembunyikan.
    const toMoon = new THREE.Vector3(), toParent = new THREE.Vector3();
    for (const v of this.all) {
      const p = v.isMoon ? v.parent : v.id === 'moon' ? earth : null;
      if (!p) continue;
      let show = !v.isMoon || camera.position.distanceTo(p.group.position) < p.radius * 60 ||
        focusView === v || focusView === p || nearView === v || nearView === p;
      if (show && p.scale > 1.01) {
        toMoon.subVectors(v.group.position, camera.position);
        toParent.subVectors(p.group.position, camera.position);
        show = toMoon.angleTo(toParent) * focalPx > p.px + v.px + 2;
      }
      v.group.visible = show;
    }
    this.views.forEach((v) => {
      if (!v.orbitLine) return;
      const on = focusView && (v === focusView || v === focusView.parent);
      v.orbitLine.material.opacity = focusView ? (on ? 0.1 : 0.02) : 0.11;
      v.orbitLine.material.color.copy(on ? v.orbitLine.userData.baseColor : new THREE.Color(0xffffff));
    });
  }

  pickables() {
    const out = [];
    this.allViews().forEach((v) => { if (v.group.visible) out.push(v.mesh); });
    return out;
  }
}
