"""Bangun js/data.js dari isi folder data/.

Pemakaian (dari folder proyek):
    python tools/build_data.py           periksa data lalu tulis js/data.js
    python tools/build_data.py --check   hanya periksa; gagal bila js/data.js belum diperbarui

Sumber:
    data/bodies.csv    data fisik tiap benda, arah sumbu, dan rotasi (NASA, JPL, IAU)
    data/orbits.csv    elemen orbit Kepler J2000 planet dan Pluto (JPL, berlaku 1800-2050)
    data/moons.csv     satelit utama (JPL Planetary Satellites)
    data/content.json  teks berbahasa Indonesia dan warna label tiap benda

Skrip berhenti dengan kode 1 bila ada kesalahan. Peringatan fisika (misalnya gravitasi yang tidak
cocok dengan massa dan diameter) hanya dicetak, karena angka sumber sudah dibulatkan.
"""
import csv
import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OUT = ROOT / "js" / "data.js"

G = 6.674e-11                    # konstanta gravitasi, m^3 kg^-1 s^-2
AU_KM = 149597870.7
GAUSS_DEG_PER_CENTURY = 35999.37  # gerak rata-rata benda pada a = 1 SA (hukum Kepler III)

BODY_TYPES = {"star", "terrestrial", "gas_giant", "ice_giant", "dwarf", "moon"}
TEXT_COLUMNS = {"id", "name_id", "parent", "type", "rings", "magnetic_field", "moons_as_of"}
ORIENTATION = ("pole_ra_deg", "pole_dec_deg", "w0_deg", "w_rate_deg_day")
BANNED_CHARACTERS = {chr(0x2014): "tanda pisah panjang (em dash)", chr(0x2013): "tanda pisah (en dash)"}

errors = []
warnings = []


def number(text):
    """Ubah teks CSV menjadi angka; sel kosong menjadi None."""
    text = text.strip()
    if text == "":
        return None
    value = float(text)
    if value.is_integer() and re.fullmatch(r"-?\d+", text):
        return int(value)
    return value


def read_csv(name):
    with open(DATA / name, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def close(actual, expected, tolerance):
    return abs(actual - expected) <= tolerance * abs(expected)


def load_bodies():
    bodies = {}
    for row in read_csv("bodies.csv"):
        body_id = row["id"]
        if body_id in bodies:
            errors.append(f"bodies.csv: id ganda '{body_id}'")
        if row["type"] not in BODY_TYPES:
            errors.append(f"bodies.csv: jenis tidak dikenal '{row['type']}' pada {body_id}")
        body = {"id": body_id, "name": row["name_id"], "parent": row["parent"], "type": row["type"]}
        for column, text in row.items():
            if column in TEXT_COLUMNS:
                continue
            try:
                body[column] = number(text)
            except ValueError:
                errors.append(f"bodies.csv: {body_id}.{column} bukan angka: '{text}'")
        body["moons_as_of"] = row["moons_as_of"] or None
        body["rings"] = {"yes": True, "no": False}.get(row["rings"])
        body["magnetic_field"] = row["magnetic_field"] or None
        bodies[body_id] = body
    for body in bodies.values():
        where = f"bodies.csv: {body['id']}"
        if body["parent"] and body["parent"] not in bodies:
            errors.append(f"{where}.parent '{body['parent']}' tidak ada")
        if body["moons_as_of"] and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", body["moons_as_of"]):
            errors.append(f"{where}.moons_as_of harus YYYY-MM-DD")
        for column in ("diameter_km", "mass_1e24_kg", "density_kg_m3", "orbital_period_days"):
            if isinstance(body.get(column), (int, float)) and body[column] <= 0:
                errors.append(f"{where}.{column} harus lebih dari 0")
        # Arah sumbu dan rotasi dipakai untuk memutar bola 3D; tanpa itu benda tidak bisa digambar.
        for column in ORIENTATION:
            if not isinstance(body.get(column), (int, float)):
                errors.append(f"{where}.{column} kosong")
        if isinstance(body.get("pole_dec_deg"), (int, float)) and not -90 <= body["pole_dec_deg"] <= 90:
            errors.append(f"{where}.pole_dec_deg di luar -90..90")
    return bodies


def check_physics(b):
    """Bandingkan angka sumber dengan rumus fisika dasar (hanya peringatan)."""
    mass, diameter = b.get("mass_1e24_kg"), b.get("diameter_km")
    if isinstance(mass, (int, float)) and isinstance(diameter, (int, float)) and mass > 0 and diameter > 0:
        m = mass * 1e24
        r = diameter * 500  # jari-jari dalam meter
        g_calc = G * m / r ** 2
        if b.get("rotation_period_h"):
            omega = 2 * math.pi / (abs(b["rotation_period_h"]) * 3600)
            g_calc -= omega ** 2 * r  # efek putaran di khatulistiwa
        g = b.get("gravity_m_s2")
        if g and not close(g, g_calc, 0.08) and abs(g - g_calc) > 0.06:
            warnings.append(f"{b['id']}: gravitasi {g} m/s² vs hitungan {g_calc:.2f}")
        v = b.get("escape_velocity_km_s")
        v_calc = math.sqrt(2 * G * m / r) / 1000
        if v and not close(v, v_calc, 0.06) and abs(v - v_calc) > 0.06:
            warnings.append(f"{b['id']}: kecepatan lepas {v} km/s vs hitungan {v_calc:.2f}")
    if b["parent"] == "sun" and b.get("distance_million_km") and b.get("orbital_period_days"):
        a = b["distance_million_km"] * 1e6 / AU_KM
        p_calc = 365.256 * a ** 1.5
        if not close(b["orbital_period_days"], p_calc, 0.03):
            warnings.append(f"{b['id']}: periode {b['orbital_period_days']} hari vs Kepler {p_calc:.0f}")
    e = b.get("orbital_eccentricity")
    if e is not None and not 0 <= e < 1:
        errors.append(f"{b['id']}: eksentrisitas {e} di luar 0..1")


def load_orbits(bodies):
    orbits = {}
    for row in read_csv("orbits.csv"):
        body_id = row.pop("id")
        try:
            orbit = {k: float(v) for k, v in row.items()}
        except ValueError as exc:
            errors.append(f"orbits.csv: {body_id}: {exc}")
            continue
        if body_id in orbits:
            errors.append(f"orbits.csv: id ganda '{body_id}'")
        if body_id not in bodies:
            errors.append(f"orbits.csv: '{body_id}' tidak ada di bodies.csv")
        if not 0 <= orbit["e"] < 1:
            errors.append(f"orbits.csv: {body_id} e = {orbit['e']}")
        n_calc = GAUSS_DEG_PER_CENTURY / orbit["a_au"] ** 1.5
        if not close(orbit["L_rate"], n_calc, 0.01):
            warnings.append(f"orbits.csv: {body_id} L_rate {orbit['L_rate']:.2f} vs Kepler {n_calc:.2f}")
        orbits[body_id] = orbit
    return orbits


def load_moons(bodies):
    moons = {}
    for row in read_csv("moons.csv"):
        try:
            entry = {
                "name": row["name"],
                "radius_km": number(row["radius_km"]),
                "distance_km": number(row["distance_km"]),
                "period_days": number(row["period_days"]),
                "discovered": number(row["discovered"]),
                "discoverer": row["discoverer"] or None,
                "retrograde": row["retrograde"] == "yes",
                # Elemen orbit rata-rata JPL (epoch J2000) terhadap bidang Laplace atau ekuator planet.
                "frame": row["frame"] or None,
            }
            for key in ("pole_ra_deg", "pole_dec_deg", "inc_deg", "node_deg", "argp_deg", "mean_anomaly_deg", "epoch_jd"):
                entry[key] = number(row[key])
        except ValueError as exc:
            errors.append(f"moons.csv: {row['name']}: {exc}")
            continue
        if entry["frame"] in ("laplace", "equatorial") and any(
                entry[k] is None for k in ("pole_ra_deg", "pole_dec_deg", "inc_deg", "node_deg", "argp_deg", "mean_anomaly_deg", "epoch_jd", "period_days")):
            errors.append(f"moons.csv: {row['name']}: elemen orbit belum lengkap")
        if row["parent"] not in bodies:
            errors.append(f"moons.csv: {row['name']}: induk '{row['parent']}' tidak ada di bodies.csv")
        if any(m["name"].lower() == entry["name"].lower() for m in moons.get(row["parent"], [])):
            errors.append(f"moons.csv: satelit ganda '{row['name']}'")
        moons.setdefault(row["parent"], []).append(entry)
    return moons


def check_text(value, where):
    """Cari karakter terlarang di semua teks (aturan penulisan proyek)."""
    if isinstance(value, str):
        for char, label in BANNED_CHARACTERS.items():
            if char in value:
                errors.append(f"{where}: ada {label}: {value[:60]}...")
    elif isinstance(value, list):
        for i, item in enumerate(value):
            check_text(item, f"{where}[{i}]")
    elif isinstance(value, dict):
        for key, item in value.items():
            check_text(item, f"{where}.{key}")


def merge(bodies, orbits, moons, content):
    texts = content.get("bodies", {})
    result = []
    for body_id, body in bodies.items():
        text = texts.get(body_id)
        if text is None:
            errors.append(f"content.json: tidak ada teks untuk '{body_id}'")
            continue
        for key in ("category", "color", "tagline", "summary", "description", "facts"):
            if not text.get(key):
                errors.append(f"content.json: {body_id}.{key} kosong")
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", text.get("color", "")):
            errors.append(f"content.json: {body_id}.color harus berbentuk #rrggbb")
        notes = {m["name"].lower(): m for m in text.get("moons", [])}
        moon_list = []
        for moon in moons.get(body_id, []):
            entry = notes.pop(moon["name"].lower(), None)
            if entry is None:
                warnings.append(f"{body_id}: satelit {moon['name']} tanpa keterangan di content.json")
            moon_list.append({**moon, "note": entry.get("note", "") if entry else ""})
        for entry in notes.values():
            warnings.append(f"{body_id}: satelit '{entry['name']}' di content.json tidak ada di moons.csv")
        check_physics(body)
        result.append({
            **body,
            "category": text.get("category"),
            "color": text.get("color"),
            "orbit": orbits.get(body_id),
            "tagline": text.get("tagline"),
            "summary": text.get("summary"),
            "description": text.get("description", []),
            "facts": text.get("facts", []),
            "composition": text.get("composition"),
            "moonList": moon_list,
        })
    for body_id in texts:
        if body_id not in bodies:
            errors.append(f"content.json: teks untuk '{body_id}' tetapi tidak ada di bodies.csv")
    return result


def main():
    sys.stdout.reconfigure(encoding="utf-8")  # pesan berisi teks Indonesia; konsol Windows bawaan cp1252
    check_only = "--check" in sys.argv
    try:
        content = json.loads((DATA / "content.json").read_text(encoding="utf-8"))
    except ValueError as exc:
        print("KESALAHAN: data/content.json bukan JSON yang sah:", exc)
        return 1
    bodies = load_bodies()
    orbits = load_orbits(bodies)
    moons = load_moons(bodies)
    check_text(content, "content.json")
    check_text(bodies, "bodies.csv")
    check_text(moons, "moons.csv")
    if "SIDEREAL_YEAR_DAYS" not in content.get("constants", {}):
        errors.append("content.json: constants.SIDEREAL_YEAR_DAYS tidak ada")

    data = {
        "generated": content.get("checked"),
        "sources": content.get("sources", []),
        "constants": content.get("constants", {}),
        "bodies": merge(bodies, orbits, moons, content),
    }

    for message in warnings:
        print("PERINGATAN:", message)
    if errors:
        for message in errors:
            print("KESALAHAN:", message)
        print(f"{len(errors)} kesalahan, js/data.js tidak ditulis.")
        return 1

    text = ("// Dibuat otomatis oleh tools/build_data.py dari folder data/. Jangan diedit langsung.\n"
            "var SOLAR_DATA = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
            "if (typeof module === 'object' && module.exports) module.exports = SOLAR_DATA;\n")
    if check_only:
        current = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
        if current.replace("\r\n", "\n") != text:
            print("js/data.js belum sesuai dengan folder data/. Jalankan: python tools/build_data.py")
            return 1
        print("js/data.js sudah sesuai.")
        return 0
    OUT.write_text(text, encoding="utf-8", newline="\n")
    print(f"OK: {len(data['bodies'])} benda, {sum(len(b['moonList']) for b in data['bodies'])} satelit -> js/data.js")
    return 0


if __name__ == "__main__":
    sys.exit(main())
