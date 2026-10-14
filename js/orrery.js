/*
 * orrery.js: mesin gambar Jelajah 3D (dipakai js/jelajah.js).
 *
 * Proyeksi perspektif buatan sendiri di kanvas 2D, tanpa WebGL. Koordinat dunia adalah
 * ekliptika heliosentris J2000 dalam SA: sumbu x ke titik Aries, z ke kutub utara ekliptika.
 * Skala tampilan: vektor posisi dari Matahari dipendekkan menjadi panjang r^k, dengan
 * k = 0,5 (dipadatkan: panjang = akar r) atau k = 1 (sebenarnya). Peralihan skala menginterpolasi k.
 */
(function () {
  'use strict';

  var DEG = Math.PI / 180;
  var TAU = Math.PI * 2;
  var EXTENT_AU = 31;          // bingkai bawaan kamera: sedikit di luar orbit Neptunus
  var ZOOM_DEFAULT = 2.4;      // jarak kamera = zoom × panjang tampilan EXTENT_AU
  var ZOOM_MAX = 8;
  var ZOOM_MIN_PACKED = 0.004;
  var ZOOM_MIN_TRUE = 0.00005; // skala sebenarnya perlu jauh lebih dekat agar cakram planet terlihat
  var FOV = 50 * DEG;
  var PITCH_MIN = 5 * DEG;
  var PITCH_MAX = 89 * DEG;
  var SIZE_K = 0.068;          // skala dipadatkan: jari-jari px ≈ SIZE_K × diameter^0,45
  var SUN_PX = 15;
  var ORBIT_N = 240;
  var ORBIT_REFRESH_DAYS = 365.25;
  var CAMERA_MS = 700;
  var SCALE_MS = 600;
  var RING_IN = 1.24, RING_OUT = 2.27; // tepi dalam cincin C dan tepi luar cincin A, dalam jari-jari Saturnus
  var LABEL_FONT = '12px system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif';
  var LABEL_FONT_BOLD = '600 ' + LABEL_FONT;
  var ACCENT = '#ffb547';

  /* ---------- Vektor kecil ---------- */

  function vec(x, y, z) { return { x: x, y: y, z: z }; }
  function len(v) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }
  function scale(v, s) { return vec(v.x * s, v.y * s, v.z * s); }
  function add(a, b) { return vec(a.x + b.x, a.y + b.y, a.z + b.z); }
  function dot(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
  function cross(a, b) { return vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x); }
  function norm(v) { return scale(v, 1 / len(v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerp3(a, b, t) { return vec(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t)); }
  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function unitFromLonLat(lonDeg, latDeg) {
    var lon = lonDeg * DEG, lat = latDeg * DEG;
    return vec(Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat));
  }

  // Bidang cincin Saturnus tegak lurus kutubnya (bujur ekliptika 79,5°, lintang 61,9°, J2000).
  var RING_N = unitFromLonLat(79.5, 61.9);
  var RING_E1 = norm(cross(RING_N, vec(0, 0, 1)));
  var RING_E2 = cross(RING_N, RING_E1);

  /* ---------- Sabuk ilustrasi ---------- */

  // Pembangkit acak berbenih (mulberry32): titik sabuk sama setiap kali halaman dibuka.
  function seeded(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Partikel di orbit lingkaran miring. Laju sudutnya mengikuti hukum Kepler III (periode = a^1,5 tahun),
  // jadi bagian dalam sabuk berputar lebih cepat daripada bagian luarnya.
  // Per partikel: a, cos/sin simpul naik, cos/sin inklinasi, sudut awal, laju (rad/hari).
  function makeBelt(seed, count, aMin, aMax, maxInclDeg) {
    var rand = seeded(seed);
    var p = new Float64Array(count * 7);
    for (var i = 0; i < count; i++) {
      var a = lerp(aMin, aMax, rand());
      var node = rand() * TAU;
      var incl = (rand() + rand() - 1) * maxInclDeg * DEG;
      var o = i * 7;
      p[o] = a;
      p[o + 1] = Math.cos(node);
      p[o + 2] = Math.sin(node);
      p[o + 3] = Math.cos(incl);
      p[o + 4] = Math.sin(incl);
      p[o + 5] = rand() * TAU;
      p[o + 6] = TAU / (365.25 * Math.pow(a, 1.5));
    }
    return p;
  }

  /* ---------- Mesin ---------- */

  window.Orrery = function (canvas) {
    var ctx = null, W = 1, H = 1, focal = 1, sizeK = 1;
    var jd = Astro.J2000, posJd = null;
    var k = 0.5, scaleAnim = null;
    var cam = { yaw: -90 * DEG, pitch: 35 * DEG, zoom: ZOOM_DEFAULT, target: vec(0, 0, 0) };
    var camAnim = null;
    var eye, fwd, right, up, near;
    var focusId = 'sun', selectedId = null;
    var opts = { orbits: true, labels: true, asteroids: true, kuiper: true, halley: true, moon: true };
    var reduced = false;
    var drawn = [];
    var moonDir = vec(1, 0, 0), moonKm = 384400;

    var consts = (App.data && App.data.constants) || {};
    var astRange = consts.ASTEROID_BELT_AU || [2.1, 3.3];
    var kuiRange = consts.KUIPER_BELT_AU || [30, 50];
    var belts = {
      asteroids: { pts: makeBelt(1801, 1500, astRange[0], astRange[1], 15), color: 'rgba(196, 184, 160, 0.4)' },
      kuiper: { pts: makeBelt(1992, 1500, kuiRange[0], kuiRange[1], 25), color: 'rgba(150, 178, 214, 0.36)' }
    };

    // Benda di adegan: Matahari, benda berorbit (planet, Ceres, Pluto, Halley), dan Bulan.
    var scene = App.bodies(function (b) { return b.id === 'sun' || b.id === 'moon' || b.orbit; }).map(function (b) {
      return { b: b, id: b.id, real: vec(0, 0, 0), r: 0, disp: vec(0, 0, 0), orbit: null };
    });
    var byId = {};
    scene.forEach(function (s) { byId[s.id] = s; });

    function extent() { return Math.pow(EXTENT_AU, k); }
    function trueness() { return clamp((k - 0.5) * 2, 0, 1); }
    // Batas perbesaran. Pada skala sebenarnya kamera juga dijaga minimal 4 jari-jari dari pusat benda
    // yang diikutinya, supaya tidak masuk ke dalam Matahari.
    function zoomMin(kk) {
      var t = clamp((kk - 0.5) * 2, 0, 1);
      var s = byId[focusId], d = s ? s.b.diameter_km : null;
      var outside = d ? t * 4 * (d / 2 / Astro.AU_KM) / Math.pow(EXTENT_AU, kk) : 0;
      return Math.max(outside, Math.exp(lerp(Math.log(ZOOM_MIN_PACKED), Math.log(ZOOM_MIN_TRUE), t)));
    }
    function shown(s) {
      if (s.id === 'moon') return opts.moon;
      if (s.id === 'halley') return opts.halley;
      return true;
    }

    // Posisi tampilan: arah tetap, panjang r diganti r^k.
    function toDisplay(p, r) {
      return r > 0 ? scale(p, Math.pow(r, k - 1)) : vec(0, 0, 0);
    }

    /* ----- posisi ----- */

    function updatePositions() {
      if (posJd === jd) return;
      posJd = jd;
      scene.forEach(function (s) {
        if (!s.b.orbit) return;
        s.real = Astro.helioPosition(s.b.orbit, jd);
        s.r = len(s.real);
      });
      // Arah Bulan dari Bumi (ekliptika tanggal itu; selisih presesi dengan J2000 diabaikan).
      var m = Astro.moonPosition(jd);
      moonDir = unitFromLonLat(m.lon, m.lat);
      moonKm = m.distKm;
    }

    function updateDisplay() {
      scene.forEach(function (s) {
        if (s.b.orbit) s.disp = toDisplay(s.real, s.r);
      });
    }

    function focusPoint() {
      var s = byId[focusId];
      return s ? s.disp : vec(0, 0, 0);
    }

    /* ----- kamera ----- */

    function setupCamera() {
      var dist = cam.zoom * extent();
      var cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
      var cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
      var T = cam.target;
      eye = vec(T.x + dist * cp * cy, T.y + dist * cp * sy, T.z + dist * sp);
      fwd = vec(-cp * cy, -cp * sy, -sp);
      right = vec(-sy, cy, 0);
      up = vec(-sp * cy, -sp * sy, cp);
      near = dist * 0.02;
    }

    // Titik dunia ke ruang kamera: x kanan, y atas, z kedalaman (searah pandangan).
    function toCam(p, out) {
      var dx = p.x - eye.x, dy = p.y - eye.y, dz = p.z - eye.z;
      out.x = dx * right.x + dy * right.y;
      out.y = dx * up.x + dy * up.y + dz * up.z;
      out.z = dx * fwd.x + dy * fwd.y + dz * fwd.z;
      return out;
    }

    function camToScreen(c, out) {
      var s = focal / c.z;
      out.x = W / 2 + c.x * s;
      out.y = H / 2 - c.y * s;
      out.z = c.z;
      return out;
    }

    // Titik dunia ke layar. Hasil false bila titik ada di belakang kamera (tidak digambar).
    var tmpCam = {};
    function project(p, out) {
      toCam(p, tmpCam);
      if (tmpCam.z <= near) return false;
      camToScreen(tmpCam, out);
      return true;
    }

    function stepScale(now) {
      if (!scaleAnim) return;
      var u = reduced ? 1 : clamp((now - scaleAnim.t0) / SCALE_MS, 0, 1);
      k = lerp(scaleAnim.from, scaleAnim.to, ease(u));
      if (u >= 1) {
        k = scaleAnim.to;
        scaleAnim = null;
      }
      cam.zoom = clamp(cam.zoom, zoomMin(k), ZOOM_MAX);
    }

    // Bulan: arah dari Astro.moonPosition, jaraknya dilebihkan relatif terhadap ukuran Bumi di layar.
    // Pada skala sebenarnya yang diperbesar sangat dekat, jarak asli dipakai bila sudah lebih besar.
    // Bila kamera mengikuti Bulan, kedalaman Bumi kira-kira sama dengan jarak kamera.
    function placeMoon() {
      var earth = byId.earth, moon = byId.moon;
      if (!earth || !moon) return;
      var zE = focusId === 'moon' ? cam.zoom * extent() : dot(vec(earth.disp.x - eye.x, earth.disp.y - eye.y, earth.disp.z - eye.z), fwd);
      if (zE <= near) {
        moon.disp = earth.disp;
        return;
      }
      var px = radiusPx(earth, zE) * 2.2 + radiusPx(moon, zE) + 8;
      var off = Math.max(px * zE / focal, trueness() * moonKm / Astro.AU_KM);
      moon.disp = add(earth.disp, scale(moonDir, off));
    }

    function stepCamera(now) {
      var goal = focusPoint();
      if (!camAnim) {
        cam.target = goal;
        return;
      }
      var v = reduced ? 1 : clamp((now - camAnim.t0) / CAMERA_MS, 0, 1);
      var e = ease(v);
      cam.target = lerp3(camAnim.fromTarget, goal, e);
      if (camAnim.toZoom !== undefined) cam.zoom = Math.exp(lerp(Math.log(camAnim.fromZoom), Math.log(camAnim.toZoom), e));
      if (camAnim.toPitch !== undefined) cam.pitch = lerp(camAnim.fromPitch, camAnim.toPitch, e);
      if (v >= 1) camAnim = null;
    }

    function startCamera(toZoom, toPitch, instant) {
      camAnim = {
        t0: instant ? -Infinity : performance.now(),
        fromTarget: cam.target,
        fromZoom: cam.zoom,
        fromPitch: cam.pitch,
        toZoom: toZoom === undefined ? undefined : clamp(toZoom, zoomMin(scaleAnim ? scaleAnim.to : k), ZOOM_MAX),
        toPitch: toPitch
      };
    }

    /* ----- ukuran benda ----- */

    // Jari-jari dalam piksel. Dipadatkan: diameter^0,45, membesar perlahan saat kamera mendekat dan
    // mengecil di kanvas kecil (sizeK). Sebenarnya: ukuran asli yang diproyeksikan, minimal 1 px
    // (Matahari 3 px agar tetap jadi patokan). Peralihan menginterpolasi logaritma kedua ukuran.
    function radiusPx(s, z) {
      var d = s.b.diameter_km;
      var isSun = s.id === 'sun';
      var g = clamp(Math.sqrt(ZOOM_DEFAULT * extent() / z), 0.5, 3);
      var packed = isSun ? SUN_PX : (d ? SIZE_K * Math.pow(d, 0.45) : 1.6);
      packed = clamp(packed * g * sizeK, 1.5, isSun ? 60 : 48);
      var t = trueness();
      if (t <= 0) return packed;
      var real = Math.max(d ? d / 2 / Astro.AU_KM * focal / z : 0, isSun ? 3 : 1);
      if (t >= 1) return real;
      return Math.exp(lerp(Math.log(packed), Math.log(real), t));
    }

    /* ----- gambar ----- */

    function drawBelt(belt) {
      var p = belt.pts, n = p.length / 7;
      var dt = jd - Astro.J2000;
      var q = {}, w = {};
      var size = trueness() > 0.5 ? 1 : 1.4;
      ctx.beginPath();
      for (var i = 0; i < n; i++) {
        var o = i * 7, a = p[o];
        var u = p[o + 5] + p[o + 6] * dt;
        var cu = Math.cos(u), su = Math.sin(u);
        var s = Math.pow(a, k);
        w.x = s * (cu * p[o + 1] - su * p[o + 2] * p[o + 3]);
        w.y = s * (cu * p[o + 2] + su * p[o + 1] * p[o + 3]);
        w.z = s * su * p[o + 4];
        if (project(w, q)) ctx.rect(q.x, q.y, size, size);
      }
      ctx.fillStyle = belt.color;
      ctx.fill();
    }

    // Titik orbit di-cache per benda. Orbit benda yang diikuti kamera dibuat lebih rapat saat kamera
    // dekat (tali busur tidak boleh menyimpang lebih dari sekitar 0,5 px dari elips) dan dihitung ulang
    // dengan elemen tanggal ini, karena elemen orbit bergeser sedikit setiap tahun.
    function orbitPoints(s) {
      var n = s.id === 'halley' ? 720 : ORBIT_N;
      var maxAge = ORBIT_REFRESH_DAYS;
      if (s.id === focusId || (s.id === 'earth' && focusId === 'moon')) {
        var R = Math.pow(s.b.orbit.a_au, k);
        var need = Math.PI * Math.sqrt(focal * R / (cam.zoom * extent()));
        if (need > n) {
          n = Math.min(16384, Math.ceil(need / 256) * 256);
          maxAge = 0.5;
        }
      }
      var c = s.orbit;
      if (!c || c.n !== n || Math.abs(c.jd - jd) > maxAge) {
        var pts = Astro.orbitPath(s.b.orbit, jd, n);
        c = s.orbit = { jd: jd, n: n, pts: pts, r: pts.map(len), k: null, disp: null };
      }
      if (c.k !== k) {
        c.disp = c.pts.map(function (p, i) { return toDisplay(p, c.r[i]); });
        c.k = k;
      }
      return c.disp;
    }

    // Garis orbit dipotong tepat di bidang dekat kamera, supaya ruas yang melintas di samping
    // kamera tidak hilang seluruhnya.
    function strokeOrbit(s) {
      var pts = orbitPoints(s);
      var prev = {}, cur = {}, q = {}, cut = {};
      ctx.beginPath();
      for (var i = 0; i < pts.length; i++) {
        toCam(pts[i], cur);
        var curIn = cur.z > near;
        var prevIn = i > 0 && prev.z > near;
        if (i > 0 && prevIn !== curIn) {
          var t = (near - prev.z) / (cur.z - prev.z);
          cut.x = prev.x + (cur.x - prev.x) * t;
          cut.y = prev.y + (cur.y - prev.y) * t;
          cut.z = near;
          camToScreen(cut, q);
          if (prevIn) ctx.lineTo(q.x, q.y);
          else ctx.moveTo(q.x, q.y);
        }
        if (curIn) {
          camToScreen(cur, q);
          if (i === 0) ctx.moveTo(q.x, q.y);
          else ctx.lineTo(q.x, q.y);
        }
        var swap = prev;
        prev = cur;
        cur = swap;
      }
      ctx.stroke();
    }

    function drawOrbits() {
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(150, 170, 210, 0.3)';
      var sel = null;
      scene.forEach(function (s) {
        if (!s.b.orbit || !shown(s)) return;
        if (s.id === selectedId) sel = s;
        else strokeOrbit(s);
      });
      if (sel) {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = ACCENT;
        strokeOrbit(sel);
      }
    }

    // Separuh cincin sebagai pita: busur luar maju, busur dalam mundur. Kotak bb diperluas sampai
    // tepi luar cincin supaya label tidak ditulis di atas cincin.
    function fillRingHalf(c, R, from, to, bb) {
      var q = {}, n = 28, i, th, pt;
      ctx.beginPath();
      for (i = 0; i <= n; i++) {
        th = lerp(from, to, i / n);
        pt = add(c, add(scale(RING_E1, R * RING_OUT * Math.cos(th)), scale(RING_E2, R * RING_OUT * Math.sin(th))));
        if (!project(pt, q)) return;
        if (i === 0) ctx.moveTo(q.x, q.y);
        else ctx.lineTo(q.x, q.y);
        bb.x0 = Math.min(bb.x0, q.x);
        bb.y0 = Math.min(bb.y0, q.y);
        bb.x1 = Math.max(bb.x1, q.x);
        bb.y1 = Math.max(bb.y1, q.y);
      }
      for (i = n; i >= 0; i--) {
        th = lerp(from, to, i / n);
        pt = add(c, add(scale(RING_E1, R * RING_IN * Math.cos(th)), scale(RING_E2, R * RING_IN * Math.sin(th))));
        if (!project(pt, q)) return;
        ctx.lineTo(q.x, q.y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(226, 207, 150, 0.55)';
      ctx.fill();
    }

    // Ekor komet selalu menjauhi Matahari dan makin panjang saat komet makin dekat.
    // Panjangnya dilebihkan agar terlihat; ini gambar ilustrasi, bukan ukuran ekor sebenarnya.
    function drawTail(s, d) {
      if (s.r >= 4) return;
      var L = 1.2 * Math.pow(1 - s.r / 4, 1.5);
      var end = toDisplay(scale(s.real, (s.r + L) / s.r), s.r + L);
      var q = {};
      if (!project(end, q)) return;
      var dx = q.x - d.x, dy = q.y - d.y, l = Math.hypot(dx, dy);
      if (l < 2) return;
      var w = Math.max(1.5, d.r * 1.4), nx = -dy / l * w, ny = dx / l * w;
      var grad = ctx.createLinearGradient(d.x, d.y, q.x, q.y);
      grad.addColorStop(0, 'rgba(207, 227, 242, 0.55)');
      grad.addColorStop(1, 'rgba(207, 227, 242, 0)');
      ctx.beginPath();
      ctx.moveTo(d.x + nx, d.y + ny);
      ctx.lineTo(q.x, q.y);
      ctx.lineTo(d.x - nx, d.y - ny);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function drawBodies() {
      var sunScr = {};
      var sunVisible = project(vec(0, 0, 0), sunScr);
      var list = [];
      drawn = [];

      scene.forEach(function (s) {
        var q = {};
        if (!shown(s) || !project(s.disp, q)) return;
        q.r = radiusPx(s, q.z);
        q.s = s;
        list.push(q);
      });

      // Algoritma pelukis: yang terjauh dari kamera digambar lebih dulu.
      list.sort(function (a, b) { return b.z - a.z; });

      list.forEach(function (d) {
        var s = d.s, b = s.b;
        var light = Math.PI;
        if (s.id !== 'sun') {
          if (sunVisible) {
            light = Math.atan2(sunScr.y - d.y, sunScr.x - d.x);
          } else {
            // Matahari di belakang kamera: pakai arah di bidang kamera.
            var toSun = scale(s.disp, -1);
            light = Math.atan2(-dot(toSun, up), dot(toSun, right));
          }
        }
        if (s.id === 'halley') drawTail(s, d);
        var bb = { x0: d.x - d.r, y0: d.y - d.r, x1: d.x + d.r, y1: d.y + d.r };
        // Cincin: separuh belakang (searah pandangan) sebelum bola, separuh depan sesudahnya.
        var ringR = 0, phi = 0;
        if (s.id === 'saturn' && d.r >= 2.5) {
          ringR = d.r * d.z / focal;
          phi = Math.atan2(dot(RING_E2, fwd), dot(RING_E1, fwd));
          fillRingHalf(s.disp, ringR, phi - Math.PI / 2, phi + Math.PI / 2, bb);
        }
        App.drawBody(ctx, b, d.x, d.y, d.r, { light: light, ring: false });
        if (ringR) fillRingHalf(s.disp, ringR, phi + Math.PI / 2, phi + Math.PI * 1.5, bb);
        if (s.id === selectedId) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r + 5, 0, TAU);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = ACCENT;
          ctx.stroke();
        }
        drawn.push({ id: s.id, x: d.x, y: d.y, r: d.r, z: d.z, bb: bb, name: b.name, diameter: b.diameter_km || 0 });
      });
    }

    // Label nama: yang terpilih dulu, lalu Matahari dan benda besar. Label yang akan menabrak
    // label lain atau cakram benda lain dicoba di sisi lain, atau tidak ditulis.
    function drawLabels() {
      ctx.font = LABEL_FONT;
      ctx.textBaseline = 'middle';
      var boxes = drawn.map(function (d) { return { x: d.bb.x0, y: d.bb.y0, w: d.bb.x1 - d.bb.x0, h: d.bb.y1 - d.bb.y0, id: d.id }; });
      var order = drawn.slice().sort(function (a, b) {
        if (a.id === selectedId) return -1;
        if (b.id === selectedId) return 1;
        if (a.id === 'sun') return -1;
        if (b.id === 'sun') return 1;
        return b.diameter - a.diameter;
      });
      function hits(r, ownId) {
        if (r.x < 2 || r.y < 2 || r.x + r.w > W - 2 || r.y + r.h > H - 2) return true;
        for (var i = 0; i < boxes.length; i++) {
          var o = boxes[i];
          if (o.id === ownId) continue;
          if (r.x < o.x + o.w && r.x + r.w > o.x && r.y < o.y + o.h && r.y + r.h > o.y) return true;
        }
        return false;
      }
      order.forEach(function (d) {
        if (d.x + d.r < 0 || d.x - d.r > W || d.y + d.r < 0 || d.y - d.r > H) return; // benda di luar kanvas
        var isSel = d.id === selectedId;
        ctx.font = isSel ? LABEL_FONT_BOLD : LABEL_FONT;
        var w = ctx.measureText(d.name).width, h = 14;
        var gap = isSel ? 9 : 5, bb = d.bb;
        // Di atas/bawah benda, label digeser ke dalam kanvas bila benda dekat tepi.
        var xMid = clamp(d.x - w / 2, 3, W - 3 - w);
        var cands = [
          { x: bb.x1 + gap, y: d.y - h / 2 },
          { x: bb.x0 - gap - w, y: d.y - h / 2 },
          { x: xMid, y: bb.y0 - gap - h },
          { x: xMid, y: bb.y1 + gap }
        ];
        for (var i = 0; i < cands.length; i++) {
          var r = { x: cands[i].x, y: cands[i].y, w: w, h: h, id: d.id };
          if (!hits(r, d.id) || (isSel && i === cands.length - 1)) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(7, 10, 18, 0.85)';
            ctx.strokeText(d.name, r.x, r.y + h / 2);
            ctx.fillStyle = isSel ? '#e8ecf4' : '#a3afc4';
            ctx.fillText(d.name, r.x, r.y + h / 2);
            r.id = '';
            boxes.push(r);
            return;
          }
        }
      });
    }

    /* ----- API ----- */

    function resize() {
      var fit = App.fitCanvas(canvas);
      ctx = fit.ctx;
      W = fit.w;
      H = fit.h;
      focal = (Math.min(W, H) / 2) / Math.tan(FOV / 2);
      // Jarak di layar sebanding dengan ukuran kanvas; tanpa ini planet dalam saling menutupi di ponsel.
      sizeK = clamp(Math.min(W, H) / 640, 0.6, 1.2);
    }

    // Gambar satu bingkai. Hasil true bila masih ada animasi kamera atau skala yang berjalan.
    function render(now) {
      if (!ctx) resize();
      now = now || performance.now();
      updatePositions();
      stepScale(now);
      updateDisplay();
      if (focusId === 'moon') placeMoon();
      stepCamera(now);
      setupCamera();
      if (focusId !== 'moon') placeMoon();
      ctx.clearRect(0, 0, W, H);
      if (opts.asteroids) drawBelt(belts.asteroids);
      if (opts.kuiper) drawBelt(belts.kuiper);
      if (opts.orbits) drawOrbits();
      drawBodies();
      if (opts.labels) drawLabels();
      return !!(camAnim || scaleAnim);
    }

    function pick(x, y, slop) {
      var best = null, bestD = Infinity;
      drawn.forEach(function (d) {
        var dist = Math.hypot(d.x - x, d.y - y);
        if (dist > Math.max(d.r + 4, slop)) return;
        if (dist < bestD - 0.5 || (Math.abs(dist - bestD) <= 0.5 && best && d.z < best.z)) {
          best = d;
          bestD = dist;
        }
      });
      return best ? best.id : null;
    }

    return {
      resize: resize,
      render: render,
      pick: pick,
      has: function (id) { return !!byId[id]; },
      setDate: function (v) { jd = v; },
      setOptions: function (o) { Object.keys(o).forEach(function (key) { opts[key] = o[key]; }); },
      setReducedMotion: function (v) { reduced = v; },
      select: function (id) { selectedId = id; },
      // Kamera mengikuti benda ini. closer: sekaligus mendekat (klik dua kali). instant: tanpa animasi.
      focus: function (id, closer, instant) {
        if (!byId[id]) return;
        focusId = id;
        var floor = zoomMin(k);
        startCamera(closer ? cam.zoom * 0.35 : (cam.zoom < floor ? floor : undefined), undefined, instant);
      },
      centerSun: function () {
        focusId = 'sun';
        startCamera(ZOOM_DEFAULT);
      },
      topView: function () {
        startCamera(undefined, PITCH_MAX);
      },
      setTrueScale: function (on, instant) {
        scaleAnim = { t0: instant ? -Infinity : performance.now(), from: k, to: on ? 1 : 0.5 };
      },
      rotate: function (dYaw, dPitch) {
        if (camAnim) camAnim.toPitch = undefined;
        cam.yaw = (cam.yaw + dYaw) % TAU;
        cam.pitch = clamp(cam.pitch + dPitch, PITCH_MIN, PITCH_MAX);
      },
      zoomBy: function (f) {
        if (camAnim) camAnim.toZoom = undefined;
        cam.zoom = clamp(cam.zoom * f, zoomMin(k), ZOOM_MAX);
      }
    };
  };
})();
