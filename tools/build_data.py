"""Bangun js/data.js dari isi folder data/.

Pemakaian (dari folder proyek):
    python tools/build_data.py           periksa data lalu tulis js/data.js
    python tools/build_data.py --check   hanya periksa; gagal bila js/data.js belum diperbarui

Sumber:
    data/bodies.csv    data fisik tiap benda (NASA Planetary Fact Sheet dan sumber lain)
    data/orbits.csv    elemen orbit Kepler J2000 planet dan Pluto (JPL, berlaku 1800-2050)
    data/orbits_small_bodies.csv  beberapa set elemen Ceres dan Halley (JPL Horizons, lihat
                       tools/fetch_small_bodies.py)
    data/moons.csv     data satelit utama (JPL Planetary Satellite)
    data/content.json  teks pelajaran berbahasa Indonesia, warna tampilan, kuis, glosarium, linimasa

Skrip berhenti dengan kode 1 bila ada kesalahan struktur. Peringatan fisika (misalnya gravitasi
yang tidak cocok dengan massa dan diameter) hanya dicetak, karena angka sumber sudah dibulatkan.
"""
import csv
import json
import math
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OUT = ROOT / "js" / "data.js"

G = 6.674e-11            # konstanta gravitasi, m^3 kg^-1 s^-2
AU_KM = 149597870.7
GAUSS_DEG_PER_CENTURY = 35999.37  # gerak rata-rata benda pada a = 1 SA (hukum Kepler III)

BODY_TYPES = {"star", "terrestrial", "gas_giant", "ice_giant", "dwarf", "moon", "comet"}
TEXT_COLUMNS = {"id", "name_id", "parent", "type", "rings", "magnetic_field", "moons_as_of"}
QUIZ_TOPICS = {"planet", "matahari-bulan", "gerak-orbit", "benda-kecil", "sejarah"}
QUIZ_LEVELS = {"mudah", "sedang", "sulit"}
TIMELINE_CATEGORIES = {"pengamatan", "teori", "penemuan", "misi", "indonesia"}
PHASE_KEYS = ["new", "waxing-crescent", "first-quarter", "waxing-gibbous",
              "full", "waning-gibbous", "last-quarter", "waning-crescent"]
BANNED_CHARACTERS = {"\u2014": "tanda pisah panjang (em dash)", "\u2013": "tanda pisah (en dash)"}
REQUIRED_CONSTANTS = {"AU_KM", "C_KM_S", "LY_KM", "PROXIMA_LY", "SUN_AGE_GYR", "SIDEREAL_YEAR_DAYS", "SIDEREAL_DAY_H",
                      "SYNODIC_MONTH_DAYS", "SIDEREAL_MONTH_DAYS", "MOON_DISTANCE_KM", "ASTEROID_BELT_AU",
                      "KUIPER_BELT_AU", "OORT_CLOUD_AU", "MOONS_TOTAL", "MOONS_AS_OF"}

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


def slugify(text):
    ascii_text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_text.lower()).strip("-")


def close(actual, expected, tolerance):
    return abs(actual - expected) <= tolerance * abs(expected)


def load_bodies():
    rows = read_csv("bodies.csv")
    bodies = {}
    for row in rows:
        body_id = row["id"]
        if body_id in bodies:
            errors.append(f"bodies.csv: id ganda '{body_id}'")
        body = {"id": body_id, "name": row["name_id"], "parent": row["parent"], "type": row["type"]}
        if row["type"] not in BODY_TYPES:
            errors.append(f"bodies.csv: jenis tidak dikenal '{row['type']}' pada {body_id}")
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
        if body["parent"] and body["parent"] not in bodies:
            errors.append(f"bodies.csv: {body['id']}.parent '{body['parent']}' tidak ada")
        if body["moons_as_of"] and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", body["moons_as_of"]):
            errors.append(f"bodies.csv: {body['id']}.moons_as_of harus YYYY-MM-DD: '{body['moons_as_of']}'")
        for column in ("diameter_km", "mass_1e24_kg", "density_kg_m3", "orbital_period_days"):
            if isinstance(body.get(column), (int, float)) and body[column] <= 0:
                errors.append(f"bodies.csv: {body['id']}.{column} harus lebih dari 0")
    return bodies


def check_physics(b):
    """Bandingkan angka sumber dengan rumus fisika dasar (hanya peringatan)."""
    mass = b.get("mass_1e24_kg")
    diameter = b.get("diameter_km")
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


def check_orbit(name, orbit):
    if not 0 <= orbit["e"] < 1:
        errors.append(f"{name}: e = {orbit['e']}")
    n_calc = GAUSS_DEG_PER_CENTURY / orbit["a_au"] ** 1.5
    if not close(orbit["L_rate"], n_calc, 0.01):
        warnings.append(f"{name}: L_rate {orbit['L_rate']:.2f} vs Kepler {n_calc:.2f}")


def small_body_segments(rows):
    """Elemen oskulasi Horizons -> bentuk Tabel 1 JPL (relatif J2000), satu segmen per epoch.

    Tiap segmen berlaku dari titik tengah dengan epoch sebelumnya sampai titik tengah dengan epoch
    sesudahnya; segmen pertama dan terakhir tidak dibatasi.
    """
    rows = sorted(rows, key=lambda r: float(r["epoch_jd"]))
    epochs = [float(r["epoch_jd"]) for r in rows]
    segments = []
    for k, row in enumerate(rows):
        n = float(row["n_deg_day"])
        node = float(row["node_deg"])
        peri = (node + float(row["argperi_deg"])) % 360
        L = (float(row["mean_anomaly_deg"]) + peri - n * (epochs[k] - 2451545.0)) % 360
        segments.append({
            "from_jd": (epochs[k - 1] + epochs[k]) / 2 if k > 0 else None,
            "to_jd": (epochs[k] + epochs[k + 1]) / 2 if k + 1 < len(rows) else None,
            "epoch_jd": epochs[k],
            "a_au": float(row["a_au"]), "a_rate": 0.0,
            "e": float(row["e"]), "e_rate": 0.0,
            "i_deg": float(row["i_deg"]), "i_rate": 0.0,
            "L_deg": L, "L_rate": n * 36525,
            "peri_deg": peri, "peri_rate": 0.0,
            "node_deg": node, "node_rate": 0.0,
        })
    return segments


def load_orbits(bodies):
    orbits = {}
    for row in read_csv("orbits.csv"):
        body_id = row.pop("id")
        try:
            orbit = {k: float(v) for k, v in row.items()}
        except ValueError as exc:
            errors.append(f"orbits.csv: {body_id}: {exc}")
            continue
        check_orbit(f"orbits.csv: {body_id}", orbit)
        if body_id in orbits:
            errors.append(f"orbits.csv: id ganda '{body_id}'")
        orbits[body_id] = orbit

    grouped = {}
    for row in read_csv("orbits_small_bodies.csv"):
        grouped.setdefault(row["id"], []).append(row)
    for body_id, rows in grouped.items():
        try:
            segments = small_body_segments(rows)
        except ValueError as exc:
            errors.append(f"orbits_small_bodies.csv: {body_id}: {exc}")
            continue
        for seg in segments:
            check_orbit(f"orbits_small_bodies.csv: {body_id} epoch {seg['epoch_jd']}", seg)
        # Nilai di tingkat atas = segmen yang epoch-nya paling dekat J2000 (untuk ringkasan seperti a dan e).
        nearest = min(segments, key=lambda s: abs(s["epoch_jd"] - 2451545.0))
        orbits[body_id] = {**nearest, "from_jd": None, "to_jd": None, "segments": segments}

    for body_id in orbits:
        if body_id not in bodies:
            errors.append(f"orbit untuk '{body_id}' tetapi tidak ada di bodies.csv")
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
            }
        except ValueError as exc:
            errors.append(f"moons.csv: {row['name']}: {exc}")
            continue
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
    texts = content["bodies"]
    images = content.get("images", {})
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
        # Satelit yang belum punya data angka (misalnya milik Haumea) tetap ditampilkan dengan keterangannya.
        for entry in notes.values():
            moon_list.append({"name": entry["name"], "radius_km": None, "distance_km": None, "period_days": None,
                              "discovered": None, "discoverer": None, "retrograde": False,
                              "note": entry.get("note", "")})
        image = images.get(body_id)
        if image and not all(image.get(k) for k in ("src", "title", "credit", "source_page")):
            errors.append(f"content.json: images.{body_id} harus punya src, title, credit, dan source_page")
        elif image and not (ROOT / image["src"]).is_file():
            errors.append(f"gambar {image['src']} untuk {body_id} tidak ditemukan")
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
            "missions": text.get("missions", []),
            "moonList": moon_list,
            "image": image,
        })
    for body_id in list(texts) + list(images):
        if body_id not in bodies:
            errors.append(f"content.json: teks atau gambar untuk '{body_id}' tetapi tidak ada di bodies.csv")
    return result


def build_glossary(items):
    slugs = {}
    for item in items:
        if not item.get("term") or not item.get("definition"):
            errors.append(f"glosarium: istilah atau definisi kosong: {item}")
            item.setdefault("term", "")
        item["slug"] = slugify(item["term"])
        if item["slug"] in slugs:
            errors.append(f"glosarium: istilah ganda '{item['term']}'")
        slugs[item["slug"]] = item
    for item in items:
        item["see"] = [slugify(term) for term in item.get("see", [])]
        for target in item["see"]:
            if target not in slugs:
                errors.append(f"glosarium: '{item['term']}' merujuk istilah yang tidak ada: {target}")
    return sorted(items, key=lambda it: it["slug"])


def check_quiz(items):
    seen = set()
    for i, q in enumerate(items):
        where = f"kuis #{i + 1}"
        if q.get("topic") not in QUIZ_TOPICS:
            errors.append(f"{where}: topik '{q.get('topic')}' tidak dikenal")
        if q.get("difficulty") not in QUIZ_LEVELS:
            errors.append(f"{where}: tingkat '{q.get('difficulty')}' tidak dikenal")
        options = q.get("options", [])
        if len(options) != 4 or len(set(options)) != 4:
            errors.append(f"{where}: harus ada 4 pilihan berbeda")
        if type(q.get("answer")) is not int or not 0 <= q["answer"] <= 3:  # True juga int di Python
            errors.append(f"{where}: indeks jawaban harus 0 sampai 3")
        if not q.get("question"):
            errors.append(f"{where}: pertanyaan kosong")
        if not q.get("explanation"):
            errors.append(f"{where}: penjelasan kosong")
        if q.get("question") in seen:
            errors.append(f"{where}: pertanyaan ganda")
        seen.add(q.get("question"))


def check_timeline(items):
    for it in items:
        date, year = str(it.get("date", "")), it.get("year")
        if it.get("category") not in TIMELINE_CATEGORIES:
            errors.append(f"linimasa: kategori '{it.get('category')}' tidak dikenal ({it.get('title')})")
        if not it.get("title") or not it.get("detail"):
            errors.append(f"linimasa: judul atau rincian kosong ({date})")
        if not re.fullmatch(r"-?\d{1,4}(-\d{2}(-\d{2})?)?", date):
            errors.append(f"linimasa: format tanggal salah '{date}'")
        elif type(year) is not int or int(re.match(r"-?\d+", date).group()) != year:
            errors.append(f"linimasa: year {year!r} tidak cocok dengan date '{date}' ({it.get('title')})")
    keys = [(it.get("year") if type(it.get("year")) is int else 0, str(it.get("date", ""))) for it in items]
    if keys != sorted(keys):
        errors.append("linimasa: belum urut menurut tanggal")


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

    missing = REQUIRED_CONSTANTS - set(content.get("constants", {}))
    if missing:
        errors.append("content.json: constants tidak punya " + ", ".join(sorted(missing)))
    for key in ("sources", "regions", "glossary", "quiz", "timeline"):
        if not content.get(key):
            errors.append(f"content.json: '{key}' kosong atau tidak ada")
    phases = content.get("moon_phases", [])
    if [p.get("key") for p in phases] != PHASE_KEYS:
        errors.append("moon_phases: harus 8 fase dengan urutan kunci " + ", ".join(PHASE_KEYS))
    check_quiz(content.get("quiz", []))
    check_timeline(content.get("timeline", []))

    data = {
        "generated": content.get("checked"),
        "sources": content.get("sources", []),
        "constants": content.get("constants", {}),
        "bodies": merge(bodies, orbits, moons, content),
        "regions": content.get("regions", []),
        "glossary": build_glossary(content.get("glossary", [])),
        "quiz": content.get("quiz", []),
        "timeline": content.get("timeline", []),
        "moonPhases": phases,
        "moonPhaseNote": content.get("moon_phase_note"),
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
        if current != text:
            print("js/data.js belum sesuai dengan folder data/. Jalankan: python tools/build_data.py")
            return 1
        print("js/data.js sudah sesuai.")
        return 0
    OUT.write_text(text, encoding="utf-8", newline="\n")
    print(f"OK: {len(data['bodies'])} benda, {len(data['quiz'])} soal kuis, "
          f"{len(data['glossary'])} istilah, {len(data['timeline'])} peristiwa -> js/data.js")
    return 0


if __name__ == "__main__":
    sys.exit(main())
