"""
make_thumbs.py: membuat gambar kecil tiap benda untuk deretan benda (dock) di bawah layar.

Tiap benda dirender sebagai bola bertekstur yang disinari dari kiri atas, memakai tekstur yang
sama dengan adegan 3D. Saturnus diberi cincin beserta bayangannya, Bumi diberi awan, dan planet
beratmosfer diberi cahaya tipis di tepinya. Hasilnya satu lembar gambar: assets/thumbs.webp.

Jalankan dari folder proyek (butuh numpy dan Pillow):
    python tools/make_thumbs.py
"""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TEX = ROOT / "assets" / "textures"
OUT = ROOT / "assets" / "thumbs.webp"

CELL_W, CELL_H = 128, 80   # 2 x ukuran tampil (64 x 40 px)
SS = 3                     # supersampling supaya tepi bola halus
LIGHT = np.array([-0.62, 0.38, 0.69])
LIGHT /= np.linalg.norm(LIGHT)

# urutan sama dengan BODY_IDS di js/planets.js
# tekstur, jari-jari (px pada ukuran 2x), u tengah peta yang menghadap kamera, kemiringan kutub ke kamera,
# putaran bidang gambar (derajat), cahaya tepi [r, g, b, kekuatan]
BODIES = [
    ("sun", "sun", 34, 0.5, 0, 0, None),
    ("mercury", "mercury", 30, 0.55, 15, 0, None),
    ("venus", "venus", 33, 0.5, 15, 0, (1.0, 0.9, 0.7, 0.5)),
    ("earth", "earth_day", 34, 0.5 + 110 / 360, 20, 23.4, (0.45, 0.7, 1.0, 0.9)),
    ("moon", "moon", 28, 0.5, 8, 0, None),
    ("mars", "mars", 31, 0.5 - 70 / 360, 18, 25, (1.0, 0.65, 0.45, 0.3)),
    ("jupiter", "jupiter", 36, 0.371, 10, 3, (1.0, 0.9, 0.8, 0.25)),
    ("saturn", "saturn", 26, 0.5, 26, 15, (1.0, 0.95, 0.8, 0.25)),
    ("uranus", "uranus", 32, 0.5, 15, 82, (0.6, 0.92, 1.0, 0.5)),
    ("neptune", "neptune", 32, 0.5, 15, 28, (0.45, 0.6, 1.0, 0.5)),
    ("pluto", "pluto", 28, 0.5, 10, 0, None),
]

# Cincin Saturnus pada peta: 69.647 sampai 140.971 km dari pusat (jari-jari Saturnus 60.268 km).
RING_IN, RING_OUT = 69647 / 60268, 140971 / 60268


def srgb_to_lin(a):
    return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(a):
    a = np.clip(a, 0, 1)
    return np.where(a <= 0.0031308, a * 12.92, 1.055 * a ** (1 / 2.4) - 0.055)


def load(name, alpha=False):
    for k in ("2k", "1k"):
        p = TEX / f"{name}_{k}.jpg"
        if p.exists():
            return srgb_to_lin(np.asarray(Image.open(p).convert("RGB"), dtype=np.float64) / 255)
    raise FileNotFoundError(name)


def sample(tex, u, v):
    h, w = tex.shape[:2]
    x = (np.mod(u, 1.0) * w).astype(int) % w
    y = np.clip((v * h).astype(int), 0, h - 1)
    return tex[y, x]


def frame(tilt_deg, roll_deg):
    """Sumbu benda (X = bujur tengah peta, Y = kutub utara, Z) dalam koordinat gambar (z ke kamera)."""
    t, r = np.radians(tilt_deg), np.radians(roll_deg)
    pole = np.array([0.0, np.cos(t), np.sin(t)])
    x_ax = np.array([1.0, 0.0, 0.0])
    rot = np.array([[np.cos(r), -np.sin(r), 0], [np.sin(r), np.cos(r), 0], [0, 0, 1]])
    pole, x_ax = rot @ pole, rot @ x_ax
    return x_ax, pole, np.cross(x_ax, pole)


def render(body):
    bid, tex_name, radius, u_center, tilt, roll, rim = body
    W, H = CELL_W * SS, CELL_H * SS
    R = radius * SS
    ys, xs = np.mgrid[0:H, 0:W]
    px = (xs + 0.5 - W / 2) / R
    py = (H / 2 - (ys + 0.5)) / R
    rgb = np.zeros((H, W, 3))
    alpha = np.zeros((H, W))

    d2 = px * px + py * py
    on = d2 < 1
    pz = np.sqrt(np.clip(1 - d2, 0, 1))
    n = np.stack([px, py, pz], axis=-1)
    x_ax, pole, z_ax = frame(tilt, roll)
    bx, by, bz = n @ x_ax, n @ pole, n @ z_ax
    # titik yang menghadap kamera berada 90 derajat di barat sumbu X lokal (yang di kanan gambar),
    # jadi u_center digeser seperempat putaran; timur tetap di kanan seperti di adegan 3D
    u = u_center + 0.25 + np.arctan2(-bz, bx) / (2 * np.pi)
    v = 0.5 - np.arcsin(np.clip(by, -1, 1)) / np.pi
    albedo = sample(load(tex_name), u, v)

    if bid == "sun":
        limb = 0.45 + 0.55 * pz ** 0.6
        color = albedo * 1.6 * limb[..., None]
        glow = np.clip(1 - (np.sqrt(d2) - 1) / 0.9, 0, 1) ** 2.2 * 0.55
        rgb[~on] = np.array([1.0, 0.62, 0.25]) * glow[~on, None]
        alpha[~on] = glow[~on]
        rgb[on], alpha[on] = color[on], 1
    else:
        if bid == "earth":
            clouds = sample(load("earth_clouds"), u + 0.0, v)[..., 0:1]
            albedo = albedo * (1 - clouds) + clouds * 0.95
        ndl = n @ LIGHT
        light = np.clip((ndl + 0.06) / 1.06, 0, 1) ** 1.1
        color = albedo * (0.025 + 1.05 * light)[..., None]
        if rim:
            fres = (1 - pz) ** 3 * rim[3] * np.clip(ndl + 0.35, 0, 1)
            color = color + np.array(rim[:3]) * fres[..., None]
        if bid == "saturn":
            color = color * ring_shadow(n, pole)[..., None]
        rgb[on], alpha[on] = color[on], 1
        if bid == "saturn":
            draw_ring(rgb, alpha, px, py, pz, on, pole)

    img = np.dstack([lin_to_srgb(rgb), np.clip(alpha, 0, 1)])
    im = Image.fromarray((img * 255 + 0.5).astype(np.uint8), "RGBA")
    return im.convert("RGBa").resize((CELL_W, CELL_H), Image.LANCZOS).convert("RGBA")


RING_TEX = None


def ring_at(r):
    """Warna (linear) dan kerapatan cincin pada jari-jari r (satuan jari-jari Saturnus)."""
    global RING_TEX
    if RING_TEX is None:
        a = np.asarray(Image.open(TEX / "saturn_ring_4k.png").convert("RGBA"), dtype=np.float64)[32] / 255
        RING_TEX = (srgb_to_lin(a[:, :3]), a[:, 3])
    col, al = RING_TEX
    t = (r - RING_IN) / (RING_OUT - RING_IN)
    inside = (t > 0) & (t < 1)
    i = np.clip((t * len(al)).astype(int), 0, len(al) - 1)
    return col[i], np.where(inside, al[i], 0.0)


def ring_shadow(n, pole):
    """Bayangan cincin di permukaan planet: garis ke Matahari memotong bidang cincin."""
    den = LIGHT @ pole
    t = -(n @ pole) / den
    hit = n + t[..., None] * LIGHT
    _, a = ring_at(np.linalg.norm(hit, axis=-1))
    return np.where(t > 0, 1 - 0.85 * a, 1.0)


def draw_ring(rgb, alpha, px, py, pz, on, pole):
    # titik pada bidang cincin di sepanjang garis pandang (proyeksi ortografis, kamera di +z)
    z = -(px * pole[0] + py * pole[1]) / pole[2]
    p = np.stack([px, py, z], axis=-1)
    r = np.linalg.norm(p, axis=-1)
    col, a = ring_at(r)
    # bayangan planet di cincin: garis dari titik cincin ke Matahari memotong bola
    b = p @ LIGHT
    shadow = (b < 0) & ((r * r - b * b) < 1)
    lit = 0.55 + 0.45 * np.sqrt(abs(LIGHT @ pole))
    c = col * 1.05 * lit * np.where(shadow, 0.06, 1.0)[..., None]
    front = (~on) | (z > pz)        # cincin di depan planet atau di luar piringan planet
    a = np.where(front, a, 0.0)
    rgb[:] = rgb * (1 - a[..., None]) + c * a[..., None]
    alpha[:] = alpha + a * (1 - alpha)


def main():
    sheet = Image.new("RGBA", (CELL_W * len(BODIES), CELL_H), (0, 0, 0, 0))
    for i, body in enumerate(BODIES):
        sheet.alpha_composite(render(body), (i * CELL_W, 0))
    sheet.save(OUT, "WEBP", quality=90, method=6)
    print(f"OK: {len(BODIES)} gambar -> {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
