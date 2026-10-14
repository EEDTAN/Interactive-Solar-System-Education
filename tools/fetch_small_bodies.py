"""Ambil elemen orbit Ceres dan Komet Halley dari JPL Horizons.

Satu set elemen Kepler hanya tepat di sekitar tanggal (epoch) asalnya, karena tarikan planet
lain pelan-pelan mengubah orbit. Dengan satu set saja, Ceres meleset sampai sekitar 20 derajat
pada tahun 1800-an dan Halley tergambar di sisi Matahari yang salah saat kunjungan 1835.
Karena itu aplikasi memakai beberapa set:
    Ceres  : satu set tiap 10 tahun, 1800-2050
    Halley : delapan set dari solusi orbit JPL yang dicocokkan dengan pengamatan 1835-1994:
             saat perihelion 1835, 1910, 1986, dan di antaranya (1800, 1873, 1948, 2024, 2051)
js/astro.js menghitung posisi dari dua set yang epoch-nya mengapit tanggal yang ditampilkan, lalu
mencampur hasilnya menurut jarak waktu.

Pemakaian (butuh internet, cukup sekali):  python tools/fetch_small_bodies.py
Hasil: data/orbits_small_bodies.csv
"""
import csv
import re
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "data" / "orbits_small_bodies.csv"
API = "https://ssd.jpl.nasa.gov/api/horizons.api"
COLUMNS = ["id", "epoch_jd", "a_au", "e", "i_deg", "node_deg", "argperi_deg",
           "mean_anomaly_deg", "n_deg_day", "horizons_record"]


def horizons(command, jds):
    """Elemen oskulasi heliosentris (ekliptika J2000) dari Horizons untuk daftar JD."""
    params = {
        "COMMAND": command, "OBJ_DATA": "YES", "MAKE_EPHEM": "YES",
        "EPHEM_TYPE": "ELEMENTS", "CENTER": "500@10", "REF_PLANE": "ECLIPTIC",
        "REF_SYSTEM": "ICRF", "OUT_UNITS": "AU-D", "CSV_FORMAT": "YES",
        "TIME_TYPE": "TDB", "TLIST_TYPE": "JD",
    }
    query = "format=text&" + "&".join(f"{k}=" + urllib.parse.quote(f"'{v}'") for k, v in params.items())
    query += "&TLIST=" + urllib.parse.quote(" ".join(f"'{jd:.6f}'" for jd in jds))
    request = urllib.request.Request(f"{API}?{query}", headers={"User-Agent": "Mozilla/5.0"})
    text = urllib.request.urlopen(request, timeout=120).read().decode()
    if "$$SOE" not in text:
        raise RuntimeError("Horizons tidak mengirim tabel elemen:\n" + text[:2000])
    record = re.search(r"Rec #:\s*(\d+)", text)
    rows = []
    body = text.split("$$SOE")[1].split("$$EOE")[0]
    for line in body.strip().splitlines():
        f = [x.strip() for x in line.split(",")]
        # JDTDB, Calendar, EC, QR, IN, OM, W, Tp, N, MA, TA, A, AD, PR
        rows.append({
            "epoch_jd": f[0], "e": f[2], "i_deg": f[4], "node_deg": f[5], "argperi_deg": f[6],
            "n_deg_day": f[8], "mean_anomaly_deg": f[9], "a_au": f[11],
            "horizons_record": record.group(1) if record else "",
        })
    return rows, text


def julian_day(d):
    return d.toordinal() + 1721424.5


def perihelion_jd(text):
    return float(re.search(r"TP=\s*([\d.]+)", text).group(1))


def main():
    rows = []
    epochs = [julian_day(date(year, 1, 1)) for year in range(1800, 2051, 10)]
    for row in horizons("1;", epochs)[0]:
        rows.append({"id": "ceres", **row})

    # Saat perihelion tiap kunjungan diambil dari solusi orbit kunjungan itu; elemennya dari satu
    # solusi yang mencakup semua kunjungan (CAP<1990), supaya posisi di antara set tetap konsisten.
    halley_epochs = [julian_day(date(1800, 1, 1)), julian_day(date(1873, 1, 1)),
                     julian_day(date(1948, 1, 1)), julian_day(date(2024, 1, 1)), julian_day(date(2051, 1, 1))]
    for before in (1840, 1915, 1990):
        _, header = horizons(f"DES=1P;CAP<{before};NOFRAG", [julian_day(date(before - 5, 1, 1))])
        halley_epochs.append(perihelion_jd(header))
    for row in horizons("DES=1P;CAP<1990;NOFRAG", sorted(halley_epochs))[0]:
        rows.append({"id": "halley", **row})

    with open(OUT, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    print(f"{len(rows)} set elemen -> {OUT}")


if __name__ == "__main__":
    main()
