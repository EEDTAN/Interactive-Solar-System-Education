# Data

Semua angka dan teks di aplikasi berasal dari berkas di folder ini. Setelah mengubah salah satunya, jalankan:

```
python tools/build_data.py
```

Skrip itu memeriksa data lebih dulu (kolom, angka, rujukan antarberkas, dan kecocokan dengan rumus fisika dasar), lalu menulis `js/data.js`. Kalau ada yang salah, `js/data.js` tidak ditulis.

| Berkas | Isi | Sumber utama |
|---|---|---|
| `bodies.csv` | Data fisik dan orbit ringkas 16 benda: Matahari, 8 planet, Bulan, 5 planet kerdil, dan Komet Halley | [NASA NSSDCA Planetary Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) (versi 18 Maret 2025) beserta fact sheet Matahari, Bulan, Pluto, dan benda kecil; [JPL Small-Body Database](https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html) |
| `orbits.csv` | Elemen orbit Kepler planet dan Pluto pada J2000, plus lajunya per abad | [JPL, Approximate Positions of the Planets](https://ssd.jpl.nasa.gov/planets/approx_pos.html), Tabel 1 (berlaku 1800 sampai 2050) |
| `orbits_small_bodies.csv` | 26 set elemen Ceres (tiap 10 tahun) dan 8 set Komet Halley (saat perihelion 1835, 1910, 1986, dan di antaranya) | [JPL Horizons](https://ssd.jpl.nasa.gov/horizons/), diambil dengan `tools/fetch_small_bodies.py` |
| `moons.csv` | 23 satelit utama: jari-jari, jarak rata-rata dari planetnya, periode orbit, tahun dan penemu | [JPL Planetary Satellites](https://ssd.jpl.nasa.gov/sats/), NASA NSSDCA |
| `content.json` | Teks pelajaran berbahasa Indonesia, warna tampilan, kredit foto, kuis, glosarium, linimasa, dan konstanta | Ditulis untuk proyek ini, lalu dicek fakta dengan halaman NASA, JPL, ESA, IAU, dan lembaga lain |

## Kolom `bodies.csv`

| Kolom | Arti | Satuan |
|---|---|---|
| `id` | kode benda | |
| `name_id` | nama dalam bahasa Indonesia | |
| `parent` | benda yang dikelilingi (`sun` atau `earth`) | |
| `type` | `star`, `terrestrial`, `gas_giant`, `ice_giant`, `dwarf`, `moon`, `comet` | |
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

Sel kosong berarti belum ada sumber tepercaya untuk nilai itu. Aplikasi menampilkannya sebagai "tidak diketahui", bukan nol.

## Catatan dan keputusan

- Jumlah satelit terus bertambah karena penemuan baru. Angka di sini dicek pada 14 Oktober 2026; saat itu NASA dan JPL mencatat 461 satelit resmi di seluruh tata surya (Jupiter 115, Saturnus 293, Uranus 29, Neptunus 16).
- Periode orbit planet adalah periode sideris (satu putaran terhadap bintang) dari fact sheet masing-masing planet. Tabel ringkasan NASA mencantumkan periode tropis (dari ekuinoks ke ekuinoks), yang untuk Neptunus sekitar 390 hari lebih pendek.
- Eksentrisitas Pluto 0,2488 diambil dari elemen rata-rata JPL, cocok dengan jarak perihelion dan aphelion di tabel yang sama. Fact sheet Pluto mencantumkan 0,2444 (nilai sesaat).
- Untuk Bulan, kolom jarak, periode, kecepatan, dan inklinasi diukur terhadap Bumi.
- Planet raksasa tidak punya permukaan padat. Gravitasi dan suhunya diukur pada ketinggian bertekanan 1 bar, dan tekanan permukaannya dikosongkan.
- Suhu Matahari adalah suhu efektif fotosfer, 5.772 K atau sekitar 5.499 °C.
- Pluto: gravitasi 0,62 m/s² dan kecepatan lepas 1,21 km/s diambil dari Pluto Fact Sheet. Tabel ringkasan NASA mencantumkan 0,7 dan 1,3, yang tidak cocok dengan massa dan diameter Pluto di tabel yang sama.
- Ceres: diameter 939,4 km dan massanya berasal dari misi Dawn (SBDB). Gravitasi, kecepatan lepas, kecepatan orbit, dan suhunya dari NSSDCA Small Worlds Fact Sheet.
- Eris: diameter 2.326 km dari pengamatan okultasi bintang (Sicardy dkk., Nature, 2011). Massa dan massa jenisnya adalah nilai sistem Eris dan Dysnomia (Holler dkk., 2021). Periode rotasinya 378,5 jam (sekitar 15,8 hari) karena Eris terkunci pasang surut dengan Dysnomia (Bernstein dkk., 2023); angka lama 25,9 jam sudah tidak dipakai. Gravitasi dan kecepatan lepasnya dihitung dari massa dan jari-jari tersebut.
- Haumea berbentuk lonjong. Angka 1.740 km adalah perkiraan diameter dari NASA; sumbu terpanjangnya sekitar 2.300 km (okultasi bintang 2017).
- Komet Halley tidak punya satu angka diameter; intinya berukuran sekitar 15 × 8 km. Jarak, periode, dan eksentrisitasnya berasal dari elemen orbit saat perihelion 1986.
- Periode orbit Io, Europa, Ganymede, dan Callisto memakai periode sideris NSSDCA. Kolom periode di tabel elemen rata-rata JPL untuk keempatnya berisi periode anomalistik.
- Elemen orbit Pluto berasal dari tabel yang sama milik JPL (Standish dan Williams); halaman JPL yang sekarang tidak lagi memuat baris Pluto.

## Ketelitian

`tests/test_astro.js` membandingkan perhitungan aplikasi dengan JPL Horizons dan USNO:

- Posisi planet pada 1800, 1900, 1950, 2000, 2026, 2049, dan akhir 2050 meleset paling banyak sekitar 0,15 derajat (Saturnus), sesuai ketelitian resmi tabel JPL. Pemeriksaan tiap 20 hari sepanjang 1800 sampai 2050 memberi galat terbesar sekitar 0,2 derajat, juga untuk Saturnus.
- Untuk Ceres dan Halley, aplikasi menghitung posisi dari dua set elemen yang epoch-nya mengapit tanggal itu, lalu mencampur hasilnya menurut jarak waktu. Ceres meleset paling banyak sekitar 0,6 derajat (di antara dua epoch) dan Halley kurang dari 0,05 derajat. Dengan satu set saja, Ceres bisa meleset lebih dari 20 derajat pada tahun 1800-an, dan Halley tergambar di sisi Matahari yang salah saat kunjungan 1835.
- Saat fase utama Bulan sepanjang 2026 selisih paling besar 9 menit dari tabel USNO.

Jalankan ujinya dengan `node tests/test_astro.js`.
