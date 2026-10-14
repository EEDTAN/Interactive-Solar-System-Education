# Data

Semua angka dan teks di aplikasi berasal dari berkas di folder ini. Setelah mengubah salah satunya, jalankan:

```
python tools/build_data.py
```

Skrip itu memeriksa data lebih dulu (kolom, angka, rujukan antarberkas, dan kecocokan dengan rumus fisika dasar), lalu menulis `js/data.js`. Kalau ada yang salah, `js/data.js` tidak ditulis.

| Berkas | Isi | Sumber utama |
|---|---|---|
| `bodies.csv` | Data fisik, orbit ringkas, arah sumbu, dan rotasi 11 benda: Matahari, 8 planet, Bulan, Pluto | [NASA NSSDCA Planetary Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) (versi 18 Maret 2025) dan fact sheet tiap planet; [IAU WGCCRE](https://doi.org/10.1007/s10569-017-9805-5) untuk sumbu dan rotasi |
| `orbits.csv` | Elemen orbit Kepler planet dan Pluto pada J2000, plus lajunya per abad | [JPL, Approximate Positions of the Planets](https://ssd.jpl.nasa.gov/planets/approx_pos.html), Tabel 1 (berlaku 1800 sampai 2050) |
| `moons.csv` | 22 satelit utama: jari-jari, jarak rata-rata dari planetnya, periode orbit, tahun dan penemu, serta elemen orbit rata-rata untuk menghitung letaknya | [JPL Planetary Satellites](https://ssd.jpl.nasa.gov/sats/), [JPL Planetary Satellite Mean Elements](https://ssd.jpl.nasa.gov/sats/elem/), NASA NSSDCA |
| `content.json` | Teks berbahasa Indonesia untuk kartu info tiap benda dan warna labelnya | Ditulis untuk proyek ini, lalu dicek fakta dengan halaman NASA, JPL, ESA, IAU, dan lembaga lain |

## Kolom `bodies.csv`

| Kolom | Arti | Satuan |
|---|---|---|
| `id` | kode benda | |
| `name_id` | nama dalam bahasa Indonesia | |
| `parent` | benda yang dikelilingi (`sun` atau `earth`) | |
| `type` | `star`, `terrestrial`, `gas_giant`, `ice_giant`, `dwarf`, `moon` | |
| `diameter_km` | diameter | km |
| `mass_1e24_kg` | massa | 10²⁴ kg |
| `density_kg_m3` | massa jenis rata-rata | kg/m³ |
| `gravity_m_s2` | percepatan gravitasi di khatulistiwa, sudah termasuk efek rotasi | m/s² |
| `escape_velocity_km_s` | kecepatan lepas | km/s |
| `rotation_period_h` | periode rotasi terhadap bintang; nilai negatif berarti berputar terbalik (retrograd) | jam |
| `day_length_h` | panjang satu hari Matahari, dari tengah hari ke tengah hari berikutnya | jam |
| `distance_million_km` | jarak rata-rata (sumbu semi-mayor) | juta km |
| `perihelion_million_km`, `aphelion_million_km` | jarak terdekat dan terjauh | juta km |
| `orbital_period_days` | waktu satu kali mengelilingi (periode sideris) | hari |
| `orbital_velocity_km_s` | kecepatan orbit rata-rata | km/s |
| `orbital_inclination_deg` | kemiringan bidang orbit terhadap ekliptika | derajat |
| `orbital_eccentricity` | eksentrisitas, ukuran kelonjongan orbit (0 = lingkaran) | |
| `axial_tilt_deg` | kemiringan sumbu rotasi terhadap orbitnya | derajat |
| `mean_temperature_c` | suhu rata-rata | °C |
| `surface_pressure_bar` | tekanan atmosfer di permukaan | bar |
| `moons` | jumlah satelit yang diketahui | |
| `moons_as_of` | tanggal jumlah satelit itu dicek | |
| `rings` | punya sistem cincin | `yes` / `no` |
| `magnetic_field` | punya medan magnet global | `yes` / `no` / `unknown` |
| `pole_ra_deg`, `pole_dec_deg` | arah kutub utara sumbu rotasi (asensio rekta dan deklinasi, J2000) | derajat |
| `w0_deg`, `w_rate_deg_day` | letak meridian nol pada J2000 dan lajunya; negatif = rotasi terbalik | derajat, derajat per hari |

Sel kosong berarti belum ada sumber tepercaya untuk nilai itu, dan aplikasi tidak menampilkannya.

## Kolom `moons.csv`

| Kolom | Arti | Satuan |
|---|---|---|
| `name`, `parent` | nama satelit dan kode planet yang dikelilinginya | |
| `radius_km` | jari-jari rata-rata | km |
| `distance_km` | jarak rata-rata dari pusat planet (sumbu semi-mayor) | km |
| `period_days` | periode orbit sideris | hari |
| `discovered`, `discoverer` | tahun ditemukan dan penemunya | |
| `retrograde` | beredar berlawanan dengan arah putaran planetnya | `yes` / `no` |
| `frame` | bidang acuan elemen orbit: `laplace` (bidang Laplace setempat), `equatorial` (ekuator planet), `ecliptic` (Bulan, letaknya dihitung dengan teori Meeus di `js/astro.js`), kosong (tidak digambar) | |
| `pole_ra_deg`, `pole_dec_deg` | arah kutub bidang acuan (asensio rekta dan deklinasi, ICRF) | derajat |
| `inc_deg` | inklinasi orbit terhadap bidang acuan | derajat |
| `node_deg` | bujur simpul naik, diukur dari simpul naik bidang acuan pada ekuator ICRF | derajat |
| `argp_deg`, `mean_anomaly_deg` | argumen periapsis dan anomali rata-rata pada epoch | derajat |
| `epoch_jd` | epoch elemen, 2451545,0 = 1 Januari 2000 pukul 12.00 TDB | hari Julian |

## Catatan dan keputusan

- Jumlah satelit terus bertambah karena penemuan baru. Angka di sini dicek pada 14 Oktober 2026; saat itu NASA dan JPL mencatat 461 satelit resmi di seluruh tata surya (Jupiter 115, Saturnus 293, Uranus 29, Neptunus 16).
- Periode orbit planet adalah periode sideris (satu putaran terhadap bintang) dari fact sheet masing-masing planet. Tabel ringkasan NASA mencantumkan periode tropis (dari ekuinoks ke ekuinoks), yang untuk Neptunus sekitar 390 hari lebih pendek.
- Eksentrisitas Pluto 0,2488 diambil dari elemen rata-rata JPL, cocok dengan jarak perihelion dan aphelion di tabel yang sama. Fact sheet Pluto mencantumkan 0,2444 (nilai sesaat).
- Untuk Bulan, kolom jarak, periode, kecepatan, dan inklinasi diukur terhadap Bumi.
- Planet raksasa tidak punya permukaan padat. Gravitasi dan suhunya diukur pada ketinggian bertekanan 1 bar, dan tekanan permukaannya dikosongkan.
- Suhu Matahari adalah suhu efektif fotosfer, 5.772 K atau sekitar 5.499 °C.
- Pluto: gravitasi 0,62 m/s² dan kecepatan lepas 1,21 km/s diambil dari Pluto Fact Sheet. Tabel ringkasan NASA mencantumkan 0,7 dan 1,3, yang tidak cocok dengan massa dan diameter Pluto di tabel yang sama.
- Periode orbit Io, Europa, Ganymede, dan Callisto memakai periode sideris NSSDCA. Kolom periode di tabel elemen rata-rata JPL untuk keempatnya berisi periode anomalistik.
- Elemen orbit Pluto berasal dari tabel yang sama milik JPL (Standish dan Williams); halaman JPL yang sekarang tidak lagi memuat baris Pluto.
- Elemen orbit satelit berasal dari tabel elemen rata-rata JPL (epoch 1 Januari 2000). Untuk satelit Uranus dan Charon, JPL memakai ekuator planet sebagai bidang acuan; kutubnya diambil dari kutub rotasi IAU, dengan kutub Uranus dibalik (asensio rekta 77,311 derajat, deklinasi +15,175 derajat) karena Uranus berputar terbalik sedangkan satelitnya beredar searah putaran itu. Nereid tidak digambar karena orbitnya sangat lonjong (eksentrisitas 0,75 menurut NSSDCA), tidak cocok dengan perhitungan orbit lingkaran di sini.
- Di layar, jarak satelit ke planetnya dipadatkan menjadi jari-jari planet x (1,6 + 1,6 x akar(jarak / jari-jari planet)), supaya urutannya tetap benar tetapi satelit jauh seperti Callisto dan Iapetus tidak menyeberang ke orbit planet lain. Ukuran satelit tetap sebanding dengan planetnya.
- Arah sumbu dan meridian nol mengikuti laporan IAU WGCCRE (Archinal dkk., 2018), tanpa suku periodik kecilnya. Karena itu Uranus tampak "terguling", Venus dan Uranus berputar terbalik, dan sisi siang serta malam Bumi di layar sesuai jam yang ditampilkan.

## Ketelitian

`tests/test_astro.js` membandingkan perhitungan aplikasi dengan JPL Horizons:

- Posisi planet dan Pluto pada 1800, 1900, 1950, 2000, 2026, 2049, dan akhir 2050 meleset paling banyak sekitar 0,15 derajat (Saturnus), sesuai ketelitian resmi tabel JPL.
- Posisi Bulan meleset kurang dari 0,15 derajat dan jaraknya kurang dari sekitar 150 km.
- Titik di Bumi yang tepat di bawah Matahari pada 15 Oktober 2026 pukul 05.00 UTC jatuh di sekitar 101,5 derajat bujur timur, sesuai perhitungan dari jam dan perata waktu.
- Satelit selain Bulan dianggap beredar pada orbit lingkaran (eksentrisitas terbesar di sini 0,029, milik Titan) tanpa presesi, jadi letaknya di orbit bisa meleset sampai sekitar 3 derajat. Semua satelit yang digambar terkunci pasang surut, jadi bujur 0 derajatnya selalu menghadap planet.

Jalankan ujinya dengan `node tests/test_astro.js`.
