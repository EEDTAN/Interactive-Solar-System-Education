// Dibuat otomatis oleh tools/build_data.py dari folder data/. Jangan diedit langsung.
var SOLAR_DATA = {
 "generated": "2026-10-14",
 "sources": [
  {
   "name": "NASA NSSDCA Planetary Fact Sheet (metrik)",
   "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/"
  },
  {
   "name": "NASA NSSDCA fact sheet Matahari, Bulan, Pluto, dan benda kecil",
   "url": "https://nssdc.gsfc.nasa.gov/planetary/planetfact.html"
  },
  {
   "name": "JPL Approximate Positions of the Planets",
   "url": "https://ssd.jpl.nasa.gov/planets/approx_pos.html"
  },
  {
   "name": "JPL Horizons",
   "url": "https://ssd.jpl.nasa.gov/horizons/"
  },
  {
   "name": "JPL Small-Body Database",
   "url": "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html"
  },
  {
   "name": "JPL Planetary Satellites",
   "url": "https://ssd.jpl.nasa.gov/sats/"
  },
  {
   "name": "NASA Science: Moons",
   "url": "https://science.nasa.gov/solar-system/moons/"
  },
  {
   "name": "IAU, Resolusi B5 dan B6 (2006)",
   "url": "https://www.iau.org/Iau/Publications/List-of-Resolutions"
  },
  {
   "name": "Jean Meeus, Astronomical Algorithms, edisi ke-2 (1998), rumus posisi Bulan dan Matahari",
   "url": null
  }
 ],
 "constants": {
  "AU_KM": 149597870.7,
  "C_KM_S": 299792.458,
  "LY_KM": 9460730472580.8,
  "PROXIMA_LY": 4.2465,
  "SUN_AGE_GYR": 4.6,
  "SIDEREAL_YEAR_DAYS": 365.256,
  "SIDEREAL_DAY_H": 23.9345,
  "SYNODIC_MONTH_DAYS": 29.53059,
  "SIDEREAL_MONTH_DAYS": 27.32166,
  "MOON_DISTANCE_KM": 384400,
  "ASTEROID_BELT_AU": [
   2.0,
   3.2
  ],
  "KUIPER_BELT_AU": [
   30,
   50
  ],
  "OORT_CLOUD_AU": [
   2000,
   100000
  ],
  "MOONS_TOTAL": 461,
  "MOONS_AS_OF": "2026-10-14"
 },
 "bodies": [
  {
   "id": "sun",
   "name": "Matahari",
   "parent": "",
   "type": "star",
   "diameter_km": 1391400,
   "mass_1e24_kg": 1988400,
   "density_kg_m3": 1408,
   "gravity_m_s2": 274.0,
   "escape_velocity_km_s": 617.6,
   "rotation_period_h": 609.12,
   "day_length_h": null,
   "distance_million_km": null,
   "perihelion_million_km": null,
   "aphelion_million_km": null,
   "orbital_period_days": null,
   "orbital_velocity_km_s": null,
   "orbital_inclination_deg": null,
   "orbital_eccentricity": null,
   "axial_tilt_deg": 7.25,
   "mean_temperature_c": 5499,
   "surface_pressure_bar": null,
   "moons": null,
   "moons_as_of": null,
   "rings": null,
   "magnetic_field": "yes",
   "category": "Bintang",
   "color": "#ffcc4d",
   "orbit": null,
   "tagline": "Bintang katai kuning di pusat tata surya, sumber cahaya dan panas bagi Bumi",
   "summary": "Matahari adalah bola plasma panas yang sebagian besar tersusun atas hidrogen dan helium. Massanya mencakup sekitar 99,8% massa tata surya, dan gravitasinya menahan planet, asteroid, serta komet di orbitnya. Cahayanya tiba di Bumi sekitar 8 menit setelah meninggalkan permukaannya.",
   "description": [
    "Matahari terbentuk sekitar 4,6 miliar tahun lalu dari awan gas dan debu raksasa yang runtuh oleh gravitasinya sendiri. Sebagian besar materi awan itu terkumpul di pusat dan menjadi Matahari, sementara sebagian sisanya membentuk planet dan benda lain yang kini mengorbitnya. Para astronom menggolongkan Matahari sebagai bintang katai kuning bertipe G2 V. Diameternya sekitar 1,4 juta km, kira-kira 109 kali diameter Bumi, dan massanya sekitar 333.000 kali massa Bumi. Meski begitu, ukurannya tergolong sedang di antara bintang-bintang. Bintang terdekat berikutnya, Proxima Centauri, berjarak sekitar 4,2 tahun cahaya.",
    "Suhu di inti Matahari sekitar 15 juta °C. Di sana, fusi nuklir melebur hidrogen menjadi helium dan melepaskan energi, dan setiap detik lebih dari 4 juta ton massa Matahari berubah menjadi energi. Energi itu merambat keluar melalui zona radiasi lalu zona konveksi; perjalanan dari inti sampai puncak zona konveksi memakan waktu sekitar 170.000 tahun. Lapisan yang kita lihat dari Bumi adalah fotosfer, yang suhunya sekitar 5.500 °C. Di atasnya terdapat kromosfer dan korona. Korona mencapai sekitar 2 juta °C, jauh lebih panas daripada fotosfer, dan penyebabnya masih menjadi teka-teki besar fisika Matahari.",
    "Karena tidak padat, bagian-bagian Matahari berputar dengan kecepatan berbeda. Daerah khatulistiwanya berotasi sekali dalam sekitar 25 hari, sedangkan daerah kutubnya sekitar 36 hari. Aktivitas Matahari naik turun dalam siklus sekitar 11 tahun, dan dalam setiap siklus kutub magnet utara dan selatannya bertukar tempat. Saat aktivitas memuncak, bintik Matahari, suar, dan lontaran massa korona lebih sering muncul. Partikel yang terlempar ke arah Bumi dapat memicu aurora serta mengganggu satelit, sinyal GPS, dan jaringan listrik. Badai geomagnetik terkuat yang pernah tercatat dipicu oleh suar yang diamati Richard Carrington pada 1 September 1859.",
    "Korona biasanya kalah terang oleh fotosfer dan baru tampak jelas saat gerhana Matahari total, ketika Bulan menutupi seluruh piringan Matahari. Jalur gerhana Matahari total 9 Maret 2016 melintasi Sumatera, Kalimantan, Sulawesi, dan Halmahera, termasuk Kota Palembang. Jangan pernah menatap Matahari secara langsung tanpa pelindung mata yang aman. Para ilmuwan memperkirakan Matahari belum melewati separuh masa hidupnya. Kelak ia akan mengembang menjadi raksasa merah yang menelan Merkurius, Venus, dan mungkin juga Bumi, lalu berakhir sebagai katai putih kira-kira 5 miliar tahun lagi."
   ],
   "facts": [
    "Matahari menyumbang sekitar 99,8% massa seluruh tata surya.",
    "Cahaya Matahari memerlukan sekitar 8 menit untuk menempuh jarak rata-rata sekitar 150 juta km ke Bumi.",
    "Gravitasi di permukaan Matahari sekitar 28 kali gravitasi di permukaan Bumi.",
    "Matahari mengelilingi pusat galaksi Bima Sakti sekali dalam sekitar 230 juta tahun.",
    "Angin Matahari membentuk gelembung raksasa bernama heliosfer yang membentang melewati orbit semua planet, sehingga Bumi sebenarnya berada di dalam atmosfer Matahari."
   ],
   "composition": "Fotosfer (berdasarkan jumlah atom): hidrogen sekitar 91% dan helium sekitar 8,9%; sisanya oksigen, karbon, neon, nitrogen, besi, dan unsur lain dalam jumlah sangat kecil.",
   "missions": [
    {
     "name": "SOHO",
     "agency": "ESA/NASA",
     "years": "1995-sekarang",
     "note": "Mengamati Matahari dari sekitar titik L1, kira-kira 1,5 juta km dari Bumi, dan tercatat sebagai penemu komet terbanyak dalam sejarah astronomi."
    },
    {
     "name": "Solar Dynamics Observatory (SDO)",
     "agency": "NASA",
     "years": "2010-sekarang",
     "note": "Memantau bagian dalam, atmosfer, medan magnet, dan keluaran energi Matahari untuk mempelajari asal aktivitas Matahari dan cuaca antariksa."
    },
    {
     "name": "Parker Solar Probe",
     "agency": "NASA",
     "years": "2018-sekarang",
     "note": "Wahana pertama yang terbang menembus korona; pada 24 Desember 2024 ia melintas sekitar 6,1 juta km dari permukaan Matahari dengan kecepatan sekitar 692.000 km per jam."
    },
    {
     "name": "Solar Orbiter",
     "agency": "ESA/NASA",
     "years": "2020-sekarang",
     "note": "Pada 2025 menghasilkan citra pertama kutub Matahari setelah orbitnya dimiringkan keluar dari bidang ekliptika."
    },
    {
     "name": "Aditya-L1",
     "agency": "ISRO",
     "years": "2023-sekarang",
     "note": "Observatorium Matahari pertama India di antariksa yang sejak Januari 2024 mengorbit titik L1 untuk mengamati fotosfer, kromosfer, dan korona serta mengukur partikel angin Matahari."
    }
   ],
   "moonList": [],
   "image": {
    "src": "img/sun.jpg",
    "title": "Matahari dalam cahaya tampak, dipotret SDO pada 23 Oktober 2014; bercak gelap besar itu bintik Matahari AR 12192",
    "credit": "Courtesy of NASA/SDO and the AIA, EVE, and HMI science teams",
    "source_page": "https://images.nasa.gov/details/GSFC_20171208_Archive_e000923"
   }
  },
  {
   "id": "mercury",
   "name": "Merkurius",
   "parent": "sun",
   "type": "terrestrial",
   "diameter_km": 4879,
   "mass_1e24_kg": 0.33,
   "density_kg_m3": 5429,
   "gravity_m_s2": 3.7,
   "escape_velocity_km_s": 4.3,
   "rotation_period_h": 1407.6,
   "day_length_h": 4222.6,
   "distance_million_km": 57.9,
   "perihelion_million_km": 46.0,
   "aphelion_million_km": 69.8,
   "orbital_period_days": 87.969,
   "orbital_velocity_km_s": 47.4,
   "orbital_inclination_deg": 7.0,
   "orbital_eccentricity": 0.206,
   "axial_tilt_deg": 0.034,
   "mean_temperature_c": 167,
   "surface_pressure_bar": 0,
   "moons": 0,
   "moons_as_of": "2026-10-14",
   "rings": false,
   "magnetic_field": "yes",
   "category": "Planet kebumian",
   "color": "#9c9a97",
   "orbit": {
    "a_au": 0.38709927,
    "a_rate": 3.7e-07,
    "e": 0.20563593,
    "e_rate": 1.906e-05,
    "i_deg": 7.00497902,
    "i_rate": -0.00594749,
    "L_deg": 252.2503235,
    "L_rate": 149472.67411175,
    "peri_deg": 77.45779628,
    "peri_rate": 0.16047689,
    "node_deg": 48.33076593,
    "node_rate": -0.12534081
   },
   "tagline": "Planet terkecil dan terdekat ke Matahari, mengitarinya hanya dalam 88 hari",
   "summary": "Merkurius adalah planet terkecil dan paling dekat dengan Matahari, hanya sedikit lebih besar daripada Bulan. Planet ini mengitari Matahari setiap 88 hari, tercepat di antara semua planet. Tanpa atmosfer yang berarti, suhu permukaannya berayun dari sekitar 430 °C pada siang hari ke minus 180 °C pada malam hari.",
   "description": [
    "Merkurius berjarak rata-rata sekitar 58 juta km dari Matahari, atau 0,4 satuan astronomi (SA), sehingga cahaya Matahari tiba di sana dalam 3,2 menit. Orbitnya cukup lonjong: jarak terdekatnya ke Matahari sekitar 46 juta km dan jarak terjauhnya sekitar 70 juta km. Dengan kecepatan sekitar 47 km per detik, Merkurius melaju lebih cepat daripada planet lain. Namanya diambil dari Merkurius, dewa Romawi yang dikenal paling gesit. Dari permukaannya, Matahari akan tampak lebih dari tiga kali lebih besar daripada jika dilihat dari Bumi.",
    "Merkurius berputar tiga kali pada porosnya setiap dua kali mengelilingi Matahari, sehingga satu rotasinya memakan waktu sekitar 59 hari Bumi. Gabungan rotasi lambat dan orbit cepat itu membuat satu hari Matahari di Merkurius, dari siang ke siang berikutnya, berlangsung 176 hari Bumi. Sumbu rotasinya hampir tegak, jadi planet ini tidak mengalami musim. Walaupun paling dekat dengan Matahari, Merkurius tidak sepanas Venus, yang atmosfernya tebal dan memerangkap panas. Tanpa selimut udara, panas siang hari di Merkurius cepat lepas ke antariksa ketika malam tiba.",
    "Permukaan Merkurius penuh kawah, mirip permukaan Bulan. Caloris, salah satu cekungan tumbukan terbesar di tata surya, bergaris tengah sekitar 1.550 km. Di banyak tempat terdapat tebing curam yang panjangnya ratusan kilometer; tebing itu terangkat ketika bagian dalam planet mendingin dan menyusut selama miliaran tahun. Merkurius adalah planet terpadat kedua setelah Bumi dan memiliki inti logam besar yang jari-jarinya sekitar 85% jari-jari planet. Di dasar kawah kutub yang tidak pernah terkena sinar Matahari, wahana MESSENGER memastikan adanya endapan yang sebagian besar berupa es air.",
    "Merkurius tidak memiliki atmosfer seperti Bumi. Yang ada hanya eksosfer sangat tipis berisi atom yang terlepas dari permukaan akibat angin Matahari dan hantaman meteoroid. Medan magnetnya hanya sekitar 1% kekuatan medan magnet Bumi, tetapi cukup untuk berinteraksi dengan angin Matahari. Karena selalu tampak dekat Matahari di langit, Merkurius sulit diamati dari Bumi. Planet ini biasanya hanya bisa dilihat saat fajar atau senja, ketika cahaya Matahari tidak terlalu menyilaukan."
   ],
   "facts": [
    "Diameter Merkurius sekitar 4.879 km, sedikit lebih dari sepertiga diameter Bumi.",
    "Merkurius tidak memiliki satelit alami maupun cincin.",
    "Dari permukaan Merkurius, cahaya Matahari bisa tampak hingga tujuh kali lebih terang daripada di Bumi.",
    "Kawah di Merkurius dinamai menurut seniman, musisi, dan penulis terkenal yang sudah meninggal, sedangkan tebing curamnya dinamai menurut kapal penjelajah dan kapal ekspedisi ilmiah.",
    "Pola tiga rotasi untuk setiap dua kali revolusi pertama kali dijelaskan oleh Giuseppe (Bepi) Colombo, yang namanya kini dipakai untuk misi BepiColombo.",
    "Setelah bahan bakarnya habis, wahana MESSENGER menabrak permukaan Merkurius pada 30 April 2015, sesuai perkiraan tim misinya."
   ],
   "composition": "Eksosfer sangat tipis berisi oksigen, natrium, hidrogen, helium, dan kalium; bagian dalam planet didominasi inti logam yang besar, diselimuti mantel batuan dan kerak padat.",
   "missions": [
    {
     "name": "Mariner 10",
     "agency": "NASA",
     "years": "1973-1975",
     "note": "Wahana pertama yang mengunjungi Merkurius; tiga kali terbang lintas pada 1974 dan 1975 dan mengirim foto jarak dekat pertama planet ini."
    },
    {
     "name": "MESSENGER",
     "agency": "NASA",
     "years": "2004-2015",
     "note": "Wahana pertama yang mengorbit Merkurius (2011 sampai 2015); memetakan seluruh permukaannya dan memastikan endapan di kutubnya sebagian besar berupa es air."
    },
    {
     "name": "BepiColombo",
     "agency": "ESA/JAXA",
     "years": "2018-sekarang",
     "note": "Membawa dua pengorbit: MPO milik ESA untuk mempelajari permukaan dan bagian dalam planet, serta Mio milik JAXA untuk mempelajari magnetosfernya."
    }
   ],
   "moonList": [],
   "image": {
    "src": "img/mercury.jpg",
    "title": "Merkurius dalam warna yang mendekati aslinya, dari wahana MESSENGER",
    "credit": "NASA/Johns Hopkins University Applied Physics Laboratory/Arizona State University/Carnegie Institution of Washington",
    "source_page": "https://science.nasa.gov/photojournal/mercurys-true-color-is-in-the-eye-of-the-beholder/"
   }
  },
  {
   "id": "venus",
   "name": "Venus",
   "parent": "sun",
   "type": "terrestrial",
   "diameter_km": 12104,
   "mass_1e24_kg": 4.87,
   "density_kg_m3": 5243,
   "gravity_m_s2": 8.9,
   "escape_velocity_km_s": 10.4,
   "rotation_period_h": -5832.5,
   "day_length_h": 2802.0,
   "distance_million_km": 108.2,
   "perihelion_million_km": 107.5,
   "aphelion_million_km": 108.9,
   "orbital_period_days": 224.701,
   "orbital_velocity_km_s": 35.0,
   "orbital_inclination_deg": 3.4,
   "orbital_eccentricity": 0.007,
   "axial_tilt_deg": 177.4,
   "mean_temperature_c": 464,
   "surface_pressure_bar": 92,
   "moons": 0,
   "moons_as_of": "2026-10-14",
   "rings": false,
   "magnetic_field": "no",
   "category": "Planet kebumian",
   "color": "#e6d3a3",
   "orbit": {
    "a_au": 0.72333566,
    "a_rate": 3.9e-06,
    "e": 0.00677672,
    "e_rate": -4.107e-05,
    "i_deg": 3.39467605,
    "i_rate": -0.0007889,
    "L_deg": 181.9790995,
    "L_rate": 58517.81538729,
    "peri_deg": 131.60246718,
    "peri_rate": 0.00268329,
    "node_deg": 76.67984255,
    "node_rate": -0.27769418
   },
   "tagline": "Planet terpanas berselimut awan asam sulfat, dikenal sebagai bintang kejora",
   "summary": "Venus adalah planet kedua dari Matahari dan ukurannya hampir sama dengan Bumi. Atmosfernya yang tebal dan kaya karbon dioksida memerangkap panas sehingga suhu permukaannya lebih dari 460 °C, tertinggi di antara semua planet. Dari Bumi, Venus adalah benda paling terang di langit malam setelah Bulan.",
   "description": [
    "Orbit Venus berada di sebelah dalam orbit Bumi, sehingga dari sudut pandang kita planet ini tidak pernah tampak jauh dari Matahari. Venus terlihat terang di langit timur menjelang fajar atau di langit barat setelah Matahari terbenam. Dalam bahasa Indonesia, Venus yang tampak menjelang pagi disebut bintang kejora, bintang timur, atau bintang fajar. Saat tampak pada petang hari, Venus disebut bintang barat atau bintang senja. Melalui teleskop, Venus memperlihatkan fase seperti Bulan. Galileo mengamati fase itu, dan pengamatannya menjadi bukti penting bahwa planet-planet mengelilingi Matahari.",
    "Diameter Venus sekitar 12.100 km, sedikit lebih kecil daripada Bumi yang sekitar 12.760 km, dan susunan bagian dalam kedua planet juga mirip. Atmosfer Venus jauh lebih tebal, sekitar 96,5% berupa karbon dioksida, dengan lapisan awan tebal dari asam sulfat. Gas itu memerangkap panas lewat efek rumah kaca yang tak terkendali, sehingga suhu permukaan lebih dari 460 °C, cukup panas untuk melelehkan timbal. Tekanan udaranya sekitar 90 kali tekanan di permukaan laut Bumi, setara dengan tekanan air di kedalaman lebih dari 900 meter.",
    "Venus berotasi sangat lambat dan arahnya berlawanan dengan sebagian besar planet. Satu rotasinya butuh 243 hari Bumi, lebih lama daripada satu tahunnya yang 225 hari Bumi, dan di sana Matahari terbit di barat lalu terbenam di timur. Permukaannya dipenuhi gunung api, dan wahana Magellan menemukan bahwa sedikitnya 85% permukaan Venus tertutup aliran lava. Salah satu gunungnya menjulang sekitar 11 km, lebih tinggi daripada Gunung Everest. Kawah tumbukannya paling sedikit di antara planet berbatu selain Bumi, dan umur rata-rata permukaannya mungkin hanya sekitar 150 juta tahun.",
    "Antara 1961 dan 1984, Uni Soviet mengirim rangkaian wahana ke Venus, sebagian besar dalam program Venera. Sepuluh pendaratnya berhasil mengirim data dari permukaan, dan yang paling lama bertahan hanya bekerja sekitar dua jam sebelum rusak akibat panas. Venus tidak memiliki satelit alami. Planet ini ditemani satelit semu, sebuah asteroid kecil bernama Zoozve yang mengitari Matahari sambil tetap berada di dekat Venus. Transit Venus, yaitu saat Venus melintas di depan piringan Matahari, terakhir terjadi pada Juni 2012, dan transit berikutnya baru akan terjadi pada Desember 2117."
   ],
   "facts": [
    "Venus adalah satu-satunya planet yang dinamai menurut dewi, yaitu dewi cinta dan kecantikan bangsa Romawi, dan sebagian besar fitur permukaannya diberi nama perempuan.",
    "Kemiringan sumbu Venus tercatat 177,4 derajat karena planet ini berotasi terbalik, sehingga sumbunya hanya sekitar 3 derajat dari garis tegak lurus bidang orbit. Kemiringan sekecil itu tidak menimbulkan musim yang terasa.",
    "Pada jarak terdekatnya, Venus berada sekitar 38 juta km dari Bumi.",
    "Venus tidak memiliki medan magnet sendiri; medan magnetnya yang lemah terbentuk dari interaksi angin Matahari dengan lapisan atas atmosfernya.",
    "Di ketinggian sekitar 50 km, suhu atmosfer Venus berkisar 30 sampai 70 °C dan tekanannya mirip tekanan udara di permukaan Bumi.",
    "Angin di puncak awan Venus pernah terukur hingga sekitar 360 km per jam."
   ],
   "composition": "Atmosfer: karbon dioksida 96,5% dan nitrogen 3,5%, dengan lapisan awan asam sulfat; bagian dalamnya terdiri atas inti besi, mantel batuan panas, dan kerak batuan yang tipis.",
   "missions": [
    {
     "name": "Mariner 2",
     "agency": "NASA",
     "years": "1962-1963",
     "note": "Wahana pertama yang berhasil terbang melintasi planet lain; ia melewati Venus pada 14 Desember 1962."
    },
    {
     "name": "Venera 7",
     "agency": "Uni Soviet",
     "years": "1970",
     "note": "Mendarat di Venus pada 15 Desember 1970 dan menjadi wahana pertama yang mengirim data dari permukaan planet lain."
    },
    {
     "name": "Magellan",
     "agency": "NASA",
     "years": "1989-1994",
     "note": "Memetakan sekitar 98% permukaan Venus dengan radar dari orbit."
    },
    {
     "name": "Venus Express",
     "agency": "ESA",
     "years": "2005-2014",
     "note": "Pengorbit Venus pertama milik Eropa; menemukan pusaran ganda raksasa di atmosfer kutub selatan dan petunjuk bahwa Venus dulu mungkin memiliki lautan."
    },
    {
     "name": "Akatsuki",
     "agency": "JAXA",
     "years": "2010-2025",
     "note": "Pengorbit planet pertama Jepang yang berhasil; mengamati cuaca dan awan Venus sejak Desember 2015 sampai kontak terputus pada April 2024."
    }
   ],
   "moonList": [],
   "image": {
    "src": "img/venus.jpg",
    "title": "Venus dari Mariner 10 (warna semu, diproses ulang); yang tampak adalah lapisan awan tebalnya",
    "credit": "NASA/JPL-Caltech",
    "source_page": "https://science.nasa.gov/photojournal/venus-from-mariner-10/"
   }
  },
  {
   "id": "earth",
   "name": "Bumi",
   "parent": "sun",
   "type": "terrestrial",
   "diameter_km": 12756,
   "mass_1e24_kg": 5.97,
   "density_kg_m3": 5514,
   "gravity_m_s2": 9.8,
   "escape_velocity_km_s": 11.2,
   "rotation_period_h": 23.9,
   "day_length_h": 24.0,
   "distance_million_km": 149.6,
   "perihelion_million_km": 147.1,
   "aphelion_million_km": 152.1,
   "orbital_period_days": 365.256,
   "orbital_velocity_km_s": 29.8,
   "orbital_inclination_deg": 0.0,
   "orbital_eccentricity": 0.017,
   "axial_tilt_deg": 23.4,
   "mean_temperature_c": 15,
   "surface_pressure_bar": 1,
   "moons": 1,
   "moons_as_of": "2026-10-14",
   "rings": false,
   "magnetic_field": "yes",
   "category": "Planet kebumian",
   "color": "#4b8bd6",
   "orbit": {
    "a_au": 1.00000261,
    "a_rate": 5.62e-06,
    "e": 0.01671123,
    "e_rate": -4.392e-05,
    "i_deg": -1.531e-05,
    "i_rate": -0.01294668,
    "L_deg": 100.46457166,
    "L_rate": 35999.37244981,
    "peri_deg": 102.93768193,
    "peri_rate": 0.32327364,
    "node_deg": 0.0,
    "node_rate": 0.0
   },
   "tagline": "Planet ketiga dari Matahari, satu-satunya dunia yang diketahui dihuni kehidupan",
   "summary": "Bumi adalah planet ketiga dari Matahari dan planet kebumian terbesar. Sekitar 71% permukaannya tertutup lautan, dan sejauh yang diketahui Bumi adalah satu-satunya planet yang memiliki air cair di permukaan serta dihuni makhluk hidup. Atmosfernya didominasi nitrogen dan oksigen.",
   "description": [
    "Bumi terbentuk sekitar 4,5 miliar tahun lalu ketika gravitasi mengumpulkan gas dan debu yang berputar di sekitar Matahari. Planet ini adalah yang terbesar kelima di tata surya dan terbesar di antara empat planet kebumian. Jarak rata-ratanya ke Matahari sekitar 150 juta km, dan jarak inilah yang menjadi dasar satuan astronomi (SA). Bumi berotasi sekali dalam 23,9 jam dan mengelilingi Matahari sekali dalam sekitar 365,26 hari jika diukur terhadap bintang-bintang. Kalender mengikuti siklus musim yang sedikit lebih pendek, sekitar 365,24 hari, dan kelebihan hampir seperempat hari itulah alasan adanya tahun kabisat: setiap empat tahun, kalender ditambah satu hari.",
    "Sumbu rotasi Bumi miring sekitar 23,4 derajat dari garis tegak lurus bidang orbitnya. Kemiringan inilah yang menimbulkan pergantian musim, karena belahan Bumi yang condong ke arah Matahari menerima pemanasan lebih besar daripada belahan lainnya. Indonesia, yang dilintasi garis khatulistiwa, mengenal musim hujan dan musim kemarau. Menurut BMKG, musim hujan berkaitan dengan angin monsun baratan dari arah Asia, sedangkan musim kemarau berkaitan dengan angin monsun timuran atau tenggara dari arah Australia yang membawa udara kering. Letak Indonesia di antara Benua Asia dan Australia serta Samudra Pasifik dan Hindia membuat cuaca dan iklimnya sangat beragam.",
    "Bagian dalam Bumi berlapis-lapis. Inti dalamnya berupa bola padat besi dan nikel berjari-jari sekitar 1.221 km dengan suhu hingga sekitar 5.400 °C. Di luarnya ada inti luar dari logam cair setebal sekitar 2.300 km, lalu mantel setebal sekitar 2.900 km. Kerak paling luar rata-rata setebal 30 km di daratan dan hanya sekitar 5 km di dasar laut. Kerak dan mantel atas terpecah menjadi lempeng-lempeng yang terus bergerak. Indonesia berada di pertemuan tiga lempeng besar, yaitu Eurasia, Indo-Australia, dan Pasifik, sehingga rawan gempa bumi.",
    "Lautan Bumi rata-rata sedalam sekitar 3,7 km dan menyimpan 97% air di planet ini. Hampir semua gunung api Bumi tersembunyi di bawah laut. Atmosfer melindungi permukaan dari sebagian besar radiasi berbahaya Matahari, dan kebanyakan meteoroid terbakar di dalamnya sebelum mencapai tanah. Inti besi-nikel yang cair dan rotasi Bumi yang cepat menghasilkan medan magnet. Ketika partikel angin Matahari terperangkap medan ini dan menabrak molekul udara di atas daerah kutub, langit berpendar sebagai aurora."
   ],
   "facts": [
    "Bumi adalah planet terpadat di tata surya, dengan massa jenis rata-rata sekitar 5.500 kg/m³.",
    "Menurut NASA, lautan Bumi menjadi tempat kehidupan bermula sekitar 3,8 miliar tahun lalu.",
    "Pegunungan terpanjang di Bumi berada di dasar Samudra Arktik dan Atlantik, dan panjangnya empat kali gabungan Pegunungan Andes, Rocky, dan Himalaya.",
    "Jika diukur dari dasar sampai puncak, Mauna Kea di Hawaii lebih tinggi daripada Gunung Everest, tetapi sebagian besar tubuhnya berada di bawah laut.",
    "Kutub magnet Bumi bisa berbalik arah. Catatan geologi menunjukkan pembalikan terjadi rata-rata sekitar setiap 300.000 tahun, dengan selang waktu yang sangat tidak teratur.",
    "Bumi mengitari Matahari dengan kecepatan rata-rata sekitar 29,8 km per detik."
   ],
   "composition": "Atmosfer (udara kering, berdasarkan volume): nitrogen 78,08%, oksigen 20,95%, argon 0,934%, dan karbon dioksida sekitar 0,042%; kadar uap air berubah-ubah, umumnya sekitar 1%.",
   "missions": [
    {
     "name": "Landsat 1",
     "agency": "NASA",
     "years": "1972-1978",
     "note": "Satelit pertama program Landsat, yang sejak 1972 membangun rekaman citra daratan Bumi dari antariksa terpanjang tanpa putus."
    },
    {
     "name": "LAPAN-A2",
     "agency": "LAPAN (kini BRIN)",
     "years": "2015-sekarang",
     "note": "Satelit mikro buatan Indonesia di orbit dekat khatulistiwa yang memotret Bumi, memantau kapal lewat sinyal AIS, dan mendukung komunikasi radio amatir untuk mitigasi bencana."
    },
    {
     "name": "Himawari-9",
     "agency": "JMA (Jepang)",
     "years": "2016-sekarang",
     "note": "Satelit cuaca geostasioner di atas 140,7° Bujur Timur yang citranya dipakai BMKG untuk memantau awan dan potensi hujan di Indonesia."
    },
    {
     "name": "NISAR",
     "agency": "NASA/ISRO",
     "years": "2025-sekarang",
     "note": "Satelit radar hasil kerja sama NASA dan ISRO yang memantau pergerakan permukaan tanah, lapisan es, dan vegetasi di seluruh Bumi setiap 12 hari."
    }
   ],
   "moonList": [
    {
     "name": "Bulan",
     "radius_km": 1737.4,
     "distance_km": 384400,
     "period_days": 27.322,
     "discovered": null,
     "discoverer": null,
     "retrograde": false,
     "note": "Satu-satunya satelit alami Bumi dan satelit terbesar kelima di tata surya; gravitasinya menimbulkan pasang surut air laut dan meredam goyangan sumbu rotasi Bumi."
    }
   ],
   "image": {
    "src": "img/earth.jpg",
    "title": "Bumi dari Apollo 17 tahun 1972, foto yang dikenal sebagai Blue Marble",
    "credit": "NASA Johnson Space Center",
    "source_page": "https://science.nasa.gov/resource/the-blue-marble/"
   }
  },
  {
   "id": "moon",
   "name": "Bulan",
   "parent": "earth",
   "type": "moon",
   "diameter_km": 3475,
   "mass_1e24_kg": 0.073,
   "density_kg_m3": 3340,
   "gravity_m_s2": 1.6,
   "escape_velocity_km_s": 2.4,
   "rotation_period_h": 655.7,
   "day_length_h": 708.7,
   "distance_million_km": 0.384,
   "perihelion_million_km": 0.363,
   "aphelion_million_km": 0.406,
   "orbital_period_days": 27.3,
   "orbital_velocity_km_s": 1.0,
   "orbital_inclination_deg": 5.1,
   "orbital_eccentricity": 0.055,
   "axial_tilt_deg": 6.7,
   "mean_temperature_c": -20,
   "surface_pressure_bar": 0,
   "moons": null,
   "moons_as_of": null,
   "rings": false,
   "magnetic_field": "no",
   "category": "Satelit alami",
   "color": "#b9b9b4",
   "orbit": null,
   "tagline": "Satelit alami Bumi, satu-satunya benda langit lain yang pernah dikunjungi manusia",
   "summary": "Bulan adalah satu-satunya satelit alami Bumi dan beredar pada jarak rata-rata sekitar 384.400 km. Diameternya sekitar 3.475 km, sedikit lebih dari seperempat diameter Bumi. Rotasinya sama lama dengan waktu edarnya mengelilingi Bumi, sehingga sisi yang sama selalu menghadap ke kita.",
   "description": [
    "Bulan kemungkinan terbentuk setelah sebuah benda seukuran Mars bertabrakan dengan Bumi muda. Puing dari tabrakan itu berkumpul menjadi Bulan, yang mula-mula berupa bola cair. Dalam sekitar 100 juta tahun, sebagian besar lautan magma itu membeku, dan batuan yang lebih ringan mengapung membentuk kerak. Kini Bulan memiliki inti besi padat berjari-jari sekitar 240 km yang diselubungi lapisan besi cair. Di atasnya terdapat mantel dan kerak. Tebal keraknya sekitar 40 km di sisi yang menghadap Bumi dan bisa mencapai 60 km di sisi jauh.",
    "Bagian Bulan yang terang disebut dataran tinggi, sedangkan bercak gelapnya disebut maria, dari bahasa Latin yang berarti laut. Maria sebenarnya cekungan tumbukan yang terisi lava 4,2 sampai 1,2 miliar tahun lalu. Atmosfer Bulan terlalu tipis untuk menahan hantaman, sehingga asteroid, meteoroid, dan komet terus meninggalkan kawah. Selama miliaran tahun, hantaman itu menggerus permukaan menjadi lapisan debu dan pecahan batu yang disebut regolit. Suhu permukaan mencapai sekitar 127 °C saat terkena sinar Matahari penuh dan turun hingga minus 173 °C dalam gelap. Gravitasinya hanya sekitar seperenam gravitasi Bumi.",
    "Bulan mengelilingi Bumi sekali dalam 27,3 hari dan berotasi dalam waktu yang sama. Karena Bumi juga bergerak mengelilingi Matahari, siklus fase dari Bulan baru ke Bulan baru berikutnya berlangsung sekitar 29,5 hari. Itu sebabnya bulan dalam kalender Hijriah berumur 29 atau 30 hari. Di Indonesia, awal Ramadan, Syawal, dan Zulhijah ditetapkan Kementerian Agama lewat sidang isbat yang memadukan hisab (perhitungan) dan rukyat (pengamatan hilal). Gravitasi Bulan juga menimbulkan pasang surut air laut, dan kebanyakan pantai mengalami dua kali pasang naik setiap hari.",
    "Wahana Soviet Luna 3 memotret sisi jauh Bulan untuk pertama kalinya pada 1959, dan Luna 9 melakukan pendaratan lunak pertama pada 1966. Antara 1969 dan 1972, dua belas astronaut Amerika Serikat berjalan di permukaan Bulan dalam program Apollo dan membawa pulang 382 kg batuan serta tanah. Misi-misi berikutnya menemukan konsentrasi es air di kawah-kawah kutub yang tidak pernah terkena sinar Matahari. Pada April 2026, empat astronaut misi Artemis II terbang mengitari Bulan, termasuk melintasi sisi jauhnya, lalu kembali dengan selamat ke Bumi."
   ],
   "facts": [
    "Bulan perlahan menjauh dari Bumi sekitar 3,8 cm per tahun.",
    "Karena orbitnya berbentuk elips, jarak Bumi ke Bulan berubah-ubah, rata-rata sekitar 363.000 km di titik terdekat (perige) dan 406.000 km di titik terjauh (apoge). Orbit itu sendiri juga berubah sepanjang tahun, sehingga jaraknya bisa berkisar dari sekitar 357.000 sampai 407.000 km.",
    "Sekitar 30 planet seukuran Bumi bisa dijajarkan di ruang antara Bumi dan Bulan.",
    "Bulan adalah satelit alami terbesar kelima di tata surya, setelah Ganymede, Titan, Callisto, dan Io.",
    "Pada 2008, wahana Chandrayaan-1 milik India mendeteksi molekul hidroksil yang tersebar di permukaan Bulan dan terkumpul di daerah kutub. Menurut NASA, itulah penemuan pasti pertama tentang air di Bulan.",
    "Medan magnet Bumi ribuan kali lebih kuat daripada medan magnet Bulan."
   ],
   "composition": "Eksosfer sangat tipis dan tidak bisa dihirup (perkiraan isinya helium, neon, hidrogen, dan argon); kerak tersusun terutama atas oksigen, silikon, magnesium, besi, kalsium, dan aluminium.",
   "missions": [
    {
     "name": "Luna 3",
     "agency": "Uni Soviet",
     "years": "1959",
     "note": "Memotret sisi jauh Bulan untuk pertama kalinya pada Oktober 1959."
    },
    {
     "name": "Apollo 11",
     "agency": "NASA",
     "years": "1969",
     "note": "Neil Armstrong dan Buzz Aldrin menjadi manusia pertama yang mendarat di Bulan pada 20 Juli 1969, di Laut Ketenangan (Mare Tranquillitatis)."
    },
    {
     "name": "Chandrayaan-1",
     "agency": "ISRO",
     "years": "2008-2009",
     "note": "Misi Bulan pertama India; instrumen M3 milik NASA yang dibawanya membantu memastikan adanya air yang terikat dalam mineral di permukaan Bulan."
    },
    {
     "name": "Chang'e 6",
     "agency": "CNSA",
     "years": "2024",
     "note": "Membawa pulang 1.935,3 gram sampel dari Cekungan Kutub Selatan-Aitken, sampel pertama dari sisi jauh Bulan."
    },
    {
     "name": "Artemis II",
     "agency": "NASA",
     "years": "2026",
     "note": "Empat astronaut terbang mengitari Bulan pada April 2026 dan mencapai jarak 406.771 km dari Bumi, rekor terjauh penerbangan manusia."
    }
   ],
   "moonList": [],
   "image": {
    "src": "img/moon.jpg",
    "title": "Bulan dipotret kru Artemis II pada 4 April 2026",
    "credit": "NASA",
    "source_page": "https://images.nasa.gov/details/art002e009057"
   }
  },
  {
   "id": "mars",
   "name": "Mars",
   "parent": "sun",
   "type": "terrestrial",
   "diameter_km": 6792,
   "mass_1e24_kg": 0.642,
   "density_kg_m3": 3934,
   "gravity_m_s2": 3.7,
   "escape_velocity_km_s": 5.0,
   "rotation_period_h": 24.6,
   "day_length_h": 24.7,
   "distance_million_km": 228.0,
   "perihelion_million_km": 206.7,
   "aphelion_million_km": 249.3,
   "orbital_period_days": 686.98,
   "orbital_velocity_km_s": 24.1,
   "orbital_inclination_deg": 1.8,
   "orbital_eccentricity": 0.094,
   "axial_tilt_deg": 25.2,
   "mean_temperature_c": -65,
   "surface_pressure_bar": 0.0064,
   "moons": 2,
   "moons_as_of": "2026-10-14",
   "rings": false,
   "magnetic_field": "no",
   "category": "Planet kebumian",
   "color": "#c8603a",
   "orbit": {
    "a_au": 1.52371034,
    "a_rate": 1.847e-05,
    "e": 0.0933941,
    "e_rate": 7.882e-05,
    "i_deg": 1.84969142,
    "i_rate": -0.00813131,
    "L_deg": -4.55343205,
    "L_rate": 19140.30268499,
    "peri_deg": -23.94362959,
    "peri_rate": 0.44441088,
    "node_deg": 49.55953891,
    "node_rate": -0.29257343
   },
   "tagline": "Planet merah berdebu dengan gunung api dan ngarai terbesar di tata surya",
   "summary": "Mars adalah planet keempat dari Matahari dengan diameter sekitar 6.790 km, kira-kira setengah diameter Bumi. Debu yang kaya oksida besi membuat permukaannya tampak kemerahan. Planet gurun yang dingin ini beratmosfer tipis dan menyimpan es air di daerah kutubnya.",
   "description": [
    "Mars berjarak rata-rata sekitar 228 juta km dari Matahari, atau 1,5 satuan astronomi (SA), sehingga cahaya Matahari tiba di sana dalam 13 menit. Planet ini berotasi sekali dalam sekitar 24,6 jam, dan satu hari Matahari di sana, yang disebut sol, lamanya sekitar 24,7 jam, hanya sedikit lebih panjang daripada sehari di Bumi. Satu tahunnya berlangsung 687 hari Bumi. Sumbu rotasinya miring sekitar 25 derajat, mirip Bumi, sehingga Mars juga mengalami musim. Karena orbitnya lonjong, panjang tiap musim di sana berbeda-beda. Bangsa Romawi menamai planet ini menurut dewa perang mereka karena warnanya yang kemerahan mengingatkan pada darah.",
    "Warna merah Mars berasal dari mineral besi dalam batuan, regolit, dan debunya yang teroksidasi atau berkarat. Luas permukaan Mars hampir sama dengan luas seluruh daratan Bumi. Di sana berdiri Olympus Mons, gunung api terbesar di tata surya, yang jauh lebih tinggi daripada Gunung Everest. Ada pula Valles Marineris, sistem ngarai terbesar di tata surya, dengan panjang sekitar 3.870 km dan kedalaman hingga sekitar 9,3 km. Lembah sungai purba, delta, dan bekas dasar danau menunjukkan bahwa air cair pernah mengalir di permukaan Mars miliaran tahun lalu.",
    "Atmosfer Mars sangat tipis dan sebagian besar berupa karbon dioksida. Tekanannya kurang dari 1% tekanan udara di permukaan Bumi, terlalu rendah bagi air cair untuk bertahan lama di permukaan. Suhu di Mars bisa mencapai sekitar 20 °C dan turun hingga sekitar minus 153 °C. Badai debu kadang menyelimuti sebagian besar planet, dan debunya baru mengendap setelah berbulan-bulan. Kini air di Mars ditemukan sebagai es tepat di bawah permukaan di daerah kutub. Mars tidak lagi memiliki medan magnet global, tetapi kerak di belahan selatannya masih menyimpan jejak magnet dari sekitar 4 miliar tahun lalu.",
    "Mars termasuk benda langit yang paling banyak diteliti wahana antariksa dan merupakan satu-satunya planet tempat robot penjelajah beroda pernah bekerja. Mariner 4 mengirim foto jarak dekat pertama Mars pada 1965, dan pendarat Viking 1 bekerja di permukaannya dari 1976 sampai 1982. Pada 2014, Mars Orbiter Mission milik India mencapai orbit Mars pada percobaan pertamanya. Penjelajah Curiosity dan Perseverance milik NASA meneliti batuan di Kawah Gale dan Kawah Jezero untuk mencari tanda bahwa Mars pernah layak dihuni. Misi MMX milik JAXA dirancang untuk mengambil sampel dari Phobos dan membawanya ke Bumi."
   ],
   "facts": [
    "Gravitasi di permukaan Mars sekitar 3,7 m/s², kurang dari 40% gravitasi Bumi.",
    "Bangsa Mesir kuno menyebut Mars Her Desher, yang berarti si merah.",
    "Valles Marineris lebarnya mencapai sekitar 600 km dan lebih dari sepuluh kali lebih panjang serta lebih lebar daripada Grand Canyon di Bumi.",
    "Musim terpanjang di Mars adalah musim semi di belahan utara, yang berlangsung 194 sol.",
    "Kira-kira setiap 26 bulan, Mars berada di oposisi, yaitu di sisi yang berseberangan dengan Matahari jika dilihat dari Bumi.",
    "Helikopter Ingenuity yang dibawa Perseverance melakukan penerbangan bertenaga dan terkendali pertama di planet lain pada 19 April 2021."
   ],
   "composition": "Atmosfer: karbon dioksida 95,1%, nitrogen 2,59%, argon 1,94%, oksigen 0,16%, dan karbon monoksida 0,06%; intinya tersusun atas besi, nikel, dan belerang.",
   "missions": [
    {
     "name": "Mariner 4",
     "agency": "NASA",
     "years": "1964-1967",
     "note": "Wahana pertama yang berhasil terbang melintasi Mars; pada Juli 1965 ia mengirim foto jarak dekat pertama Mars."
    },
    {
     "name": "Viking 1",
     "agency": "NASA",
     "years": "1975-1982",
     "note": "Pendaratnya turun di Chryse Planitia pada 20 Juli 1976 dan mengirim foto serta data dari permukaan Mars sampai November 1982."
    },
    {
     "name": "Mars Orbiter Mission (Mangalyaan)",
     "agency": "ISRO",
     "years": "2013-2022",
     "note": "Misi antarplanet pertama India yang mencapai orbit Mars pada September 2014 dalam percobaan pertama dan bekerja jauh melampaui rencana enam bulan."
    },
    {
     "name": "Curiosity",
     "agency": "NASA",
     "years": "2011-sekarang",
     "note": "Penjelajah yang mendarat di Kawah Gale pada Agustus 2012 dan menemukan bukti bahwa kawah itu pernah berisi danau dengan bahan kimia utama yang dibutuhkan kehidupan."
    },
    {
     "name": "Perseverance",
     "agency": "NASA",
     "years": "2020-sekarang",
     "note": "Mendarat di Kawah Jezero pada Februari 2021 untuk mencari jejak kehidupan mikroba purba dan mengumpulkan sampel batuan."
    }
   ],
   "moonList": [
    {
     "name": "Phobos",
     "radius_km": 11.08,
     "distance_km": 9375,
     "period_days": 0.3187,
     "discovered": 1877,
     "discoverer": "A. Hall",
     "retrograde": false,
     "note": "Satelit Mars yang lebih besar (sekitar 27 × 22 × 18 km) ini mengorbit hanya sekitar 6.000 km di atas permukaan, mengelilingi Mars tiga kali sehari, dan perlahan mendekat sehingga dalam sekitar 50 juta tahun akan menabrak Mars atau hancur menjadi cincin."
    },
    {
     "name": "Deimos",
     "radius_km": 6.2,
     "distance_km": 23457,
     "period_days": 1.2625,
     "discovered": 1877,
     "discoverer": "A. Hall",
     "retrograde": false,
     "note": "Satelit yang lebih kecil (sekitar 15 × 12 × 11 km) ini mengelilingi Mars sekali dalam sekitar 30 jam, dan permukaannya tampak lebih mulus karena sebagian kawahnya tertimbun regolit."
    }
   ],
   "image": {
    "src": "img/mars.jpg",
    "title": "Mosaik global Mars dari wahana Viking",
    "credit": "NASA/JPL/USGS",
    "source_page": "https://science.nasa.gov/photojournal/global-color-views-of-mars/"
   }
  },
  {
   "id": "ceres",
   "name": "Ceres",
   "parent": "sun",
   "type": "dwarf",
   "diameter_km": 939.4,
   "mass_1e24_kg": 0.000938,
   "density_kg_m3": 2162,
   "gravity_m_s2": 0.26,
   "escape_velocity_km_s": 0.5,
   "rotation_period_h": 9.07417,
   "day_length_h": null,
   "distance_million_km": 413.72,
   "perihelion_million_km": 380.75,
   "aphelion_million_km": 446.69,
   "orbital_period_days": 1679.9,
   "orbital_velocity_km_s": 17.9,
   "orbital_inclination_deg": 10.588,
   "orbital_eccentricity": 0.0797,
   "axial_tilt_deg": 4,
   "mean_temperature_c": -105,
   "surface_pressure_bar": null,
   "moons": 0,
   "moons_as_of": "2026-10-14",
   "rings": false,
   "magnetic_field": "unknown",
   "category": "Planet kerdil",
   "color": "#8f8a84",
   "orbit": {
    "from_jd": null,
    "to_jd": null,
    "epoch_jd": 2451544.5,
    "a_au": 2.766494285499959,
    "a_rate": 0.0,
    "e": 0.0783750551358662,
    "e_rate": 0.0,
    "i_deg": 10.58336067353508,
    "i_rate": 0.0,
    "L_deg": 160.59387214259849,
    "L_rate": 7823.473796502376,
    "peri_deg": 154.41715228573062,
    "peri_rate": 0.0,
    "node_deg": 80.49436497098499,
    "node_rate": 0.0,
    "segments": [
     {
      "from_jd": null,
      "to_jd": 2380322.5,
      "epoch_jd": 2378496.5,
      "a_au": 2.765623582105682,
      "a_rate": 0.0,
      "e": 0.08030660169979692,
      "e_rate": 0.0,
      "i_deg": 10.63254518753741,
      "i_rate": 0.0,
      "L_deg": 176.06491441836442,
      "L_rate": 7827.168692667845,
      "peri_deg": 149.43992694126464,
      "peri_rate": 0.0,
      "node_deg": 83.62984782016511,
      "node_rate": 0.0
     },
     {
      "from_jd": 2380322.5,
      "to_jd": 2383974.5,
      "epoch_jd": 2382148.5,
      "a_au": 2.768793560179885,
      "a_rate": 0.0,
      "e": 0.07667879557061746,
      "e_rate": 0.0,
      "i_deg": 10.62745165622437,
      "i_rate": 0.0,
      "L_deg": 149.72180339044644,
      "L_rate": 7813.7306106259675,
      "peri_deg": 149.86976354345825,
      "peri_rate": 0.0,
      "node_deg": 83.29224809304905,
      "node_rate": 0.0
     },
     {
      "from_jd": 2383974.5,
      "to_jd": 2387627.0,
      "epoch_jd": 2385800.5,
      "a_au": 2.767362052739457,
      "a_rate": 0.0,
      "e": 0.07881760148955347,
      "e_rate": 0.0,
      "i_deg": 10.63672120606834,
      "i_rate": 0.0,
      "L_deg": 161.196574747888,
      "L_rate": 7819.794251562463,
      "peri_deg": 150.281940067903,
      "peri_rate": 0.0,
      "node_deg": 83.22830824813956,
      "node_rate": 0.0
     },
     {
      "from_jd": 2387627.0,
      "to_jd": 2391279.5,
      "epoch_jd": 2389453.5,
      "a_au": 2.766547256513551,
      "a_rate": 0.0,
      "e": 0.07725584331078789,
      "e_rate": 0.0,
      "i_deg": 10.63099093484832,
      "i_rate": 0.0,
      "L_deg": 167.12381741150057,
      "L_rate": 7823.249103781809,
      "peri_deg": 148.7004444244629,
      "peri_rate": 0.0,
      "node_deg": 83.1636659181274,
      "node_rate": 0.0
     },
     {
      "from_jd": 2391279.5,
      "to_jd": 2394932.0,
      "epoch_jd": 2393105.5,
      "a_au": 2.766331621977744,
      "a_rate": 0.0,
      "e": 0.07990482943432874,
      "e_rate": 0.0,
      "i_deg": 10.61940737943845,
      "i_rate": 0.0,
      "L_deg": 167.99850820277243,
      "L_rate": 7824.16385070678,
      "peri_deg": 151.51347586577177,
      "peri_rate": 0.0,
      "node_deg": 82.84588620598227,
      "node_rate": 0.0
     },
     {
      "from_jd": 2394932.0,
      "to_jd": 2398584.5,
      "epoch_jd": 2396758.5,
      "a_au": 2.767772355976275,
      "a_rate": 0.0,
      "e": 0.07684441216927697,
      "e_rate": 0.0,
      "i_deg": 10.61926981987393,
      "i_rate": 0.0,
      "L_deg": 158.61063750845642,
      "L_rate": 7818.055469844868,
      "peri_deg": 149.70224486554227,
      "peri_rate": 0.0,
      "node_deg": 82.79706759563126,
      "node_rate": 0.0
     },
     {
      "from_jd": 2398584.5,
      "to_jd": 2402237.0,
      "epoch_jd": 2400410.5,
      "a_au": 2.765747337731872,
      "a_rate": 0.0,
      "e": 0.08036188185169524,
      "e_rate": 0.0,
      "i_deg": 10.60852749683284,
      "i_rate": 0.0,
      "L_deg": 170.66352806991563,
      "L_rate": 7826.643348949495,
      "peri_deg": 151.41731899396427,
      "peri_rate": 0.0,
      "node_deg": 82.68484398321394,
      "node_rate": 0.0
     },
     {
      "from_jd": 2402237.0,
      "to_jd": 2405889.5,
      "epoch_jd": 2404063.5,
      "a_au": 2.769744337586537,
      "a_rate": 0.0,
      "e": 0.07693991038334883,
      "e_rate": 0.0,
      "i_deg": 10.61750427820385,
      "i_rate": 0.0,
      "L_deg": 148.16193570339237,
      "L_rate": 7809.707596207791,
      "peri_deg": 150.01209373939804,
      "peri_rate": 0.0,
      "node_deg": 82.44985665091666,
      "node_rate": 0.0
     },
     {
      "from_jd": 2405889.5,
      "to_jd": 2409542.0,
      "epoch_jd": 2407715.5,
      "a_au": 2.767186169871125,
      "a_rate": 0.0,
      "e": 0.07896843527986115,
      "e_rate": 0.0,
      "i_deg": 10.62049815241471,
      "i_rate": 0.0,
      "L_deg": 162.0105076370237,
      "L_rate": 7820.539804777566,
      "peri_deg": 151.1310103257913,
      "peri_rate": 0.0,
      "node_deg": 82.39971024035556,
      "node_rate": 0.0
     },
     {
      "from_jd": 2409542.0,
      "to_jd": 2413194.5,
      "epoch_jd": 2411368.5,
      "a_au": 2.766121791096287,
      "a_rate": 0.0,
      "e": 0.07841560303124846,
      "e_rate": 0.0,
      "i_deg": 10.61525887378989,
      "i_rate": 0.0,
      "L_deg": 167.0875138024312,
      "L_rate": 7825.054148995761,
      "peri_deg": 149.54148460040852,
      "peri_rate": 0.0,
      "node_deg": 82.31383770031006,
      "node_rate": 0.0
     },
     {
      "from_jd": 2413194.5,
      "to_jd": 2416846.5,
      "epoch_jd": 2415020.5,
      "a_au": 2.767265015154087,
      "a_rate": 0.0,
      "e": 0.07828775645690905,
      "e_rate": 0.0,
      "i_deg": 10.6224732623675,
      "i_rate": 0.0,
      "L_deg": 161.28791751021618,
      "L_rate": 7820.205571367539,
      "peri_deg": 152.63573214755513,
      "peri_rate": 0.0,
      "node_deg": 81.9691856021915,
      "node_rate": 0.0
     },
     {
      "from_jd": 2416846.5,
      "to_jd": 2420498.5,
      "epoch_jd": 2418672.5,
      "a_au": 2.767442420606602,
      "a_rate": 0.0,
      "e": 0.07723120313273323,
      "e_rate": 0.0,
      "i_deg": 10.61485125008869,
      "i_rate": 0.0,
      "L_deg": 160.77773521638846,
      "L_rate": 7819.453618121578,
      "peri_deg": 150.1982346678958,
      "peri_rate": 0.0,
      "node_deg": 81.92284753651037,
      "node_rate": 0.0
     },
     {
      "from_jd": 2420498.5,
      "to_jd": 2424151.0,
      "epoch_jd": 2422324.5,
      "a_au": 2.766187257760635,
      "a_rate": 0.0,
      "e": 0.0791191250151663,
      "e_rate": 0.0,
      "i_deg": 10.59783433437211,
      "i_rate": 0.0,
      "L_deg": 164.81208830482774,
      "L_rate": 7824.776360230181,
      "peri_deg": 153.38169356875184,
      "peri_rate": 0.0,
      "node_deg": 81.69594876216273,
      "node_rate": 0.0
     },
     {
      "from_jd": 2424151.0,
      "to_jd": 2427803.5,
      "epoch_jd": 2425977.5,
      "a_au": 2.769729897646323,
      "a_rate": 0.0,
      "e": 0.0775192811078042,
      "e_rate": 0.0,
      "i_deg": 10.60793297788383,
      "i_rate": 0.0,
      "L_deg": 154.10798981776406,
      "L_rate": 7809.768669956099,
      "peri_deg": 150.77689270283324,
      "peri_rate": 0.0,
      "node_deg": 81.56905354618367,
      "node_rate": 0.0
     },
     {
      "from_jd": 2427803.5,
      "to_jd": 2431456.0,
      "epoch_jd": 2429629.5,
      "a_au": 2.766658967701659,
      "a_rate": 0.0,
      "e": 0.07913745627918789,
      "e_rate": 0.0,
      "i_deg": 10.59674927880016,
      "i_rate": 0.0,
      "L_deg": 162.7053904591803,
      "L_rate": 7822.775281940864,
      "peri_deg": 152.63674370884948,
      "peri_rate": 0.0,
      "node_deg": 81.48079644008172,
      "node_rate": 0.0
     },
     {
      "from_jd": 2431456.0,
      "to_jd": 2435108.5,
      "epoch_jd": 2433282.5,
      "a_au": 2.765672693253679,
      "a_rate": 0.0,
      "e": 0.07936340552242631,
      "e_rate": 0.0,
      "i_deg": 10.59524887547772,
      "i_rate": 0.0,
      "L_deg": 164.81687424248412,
      "L_rate": 7826.9602083805485,
      "peri_deg": 151.15793643472801,
      "peri_rate": 0.0,
      "node_deg": 81.3803863322911,
      "node_rate": 0.0
     },
     {
      "from_jd": 2435108.5,
      "to_jd": 2438761.0,
      "epoch_jd": 2436934.5,
      "a_au": 2.768243286903707,
      "a_rate": 0.0,
      "e": 0.07735718537159755,
      "e_rate": 0.0,
      "i_deg": 10.61287427279502,
      "i_rate": 0.0,
      "L_deg": 159.2963514084804,
      "L_rate": 7816.06055440072,
      "peri_deg": 153.27343416024354,
      "peri_rate": 0.0,
      "node_deg": 81.15729112739439,
      "node_rate": 0.0
     },
     {
      "from_jd": 2438761.0,
      "to_jd": 2442413.5,
      "epoch_jd": 2440587.5,
      "a_au": 2.766995343111107,
      "a_rate": 0.0,
      "e": 0.07822776180212938,
      "e_rate": 0.0,
      "i_deg": 10.60352025277683,
      "i_rate": 0.0,
      "L_deg": 161.493403906632,
      "L_rate": 7821.348837944023,
      "peri_deg": 150.95308235025414,
      "peri_rate": 0.0,
      "node_deg": 81.07837024485464,
      "node_rate": 0.0
     },
     {
      "from_jd": 2442413.5,
      "to_jd": 2446066.0,
      "epoch_jd": 2444239.5,
      "a_au": 2.767018975462276,
      "a_rate": 0.0,
      "e": 0.07711398528770594,
      "e_rate": 0.0,
      "i_deg": 10.59825917616089,
      "i_rate": 0.0,
      "L_deg": 160.96193398660785,
      "L_rate": 7821.248638160784,
      "peri_deg": 154.50395651846094,
      "peri_rate": 0.0,
      "node_deg": 80.76965152947278,
      "node_rate": 0.0
     },
     {
      "from_jd": 2446066.0,
      "to_jd": 2449718.5,
      "epoch_jd": 2447892.5,
      "a_au": 2.769235705287219,
      "a_rate": 0.0,
      "e": 0.07785972211177161,
      "e_rate": 0.0,
      "i_deg": 10.60556526111535,
      "i_rate": 0.0,
      "L_deg": 160.0788337326419,
      "L_rate": 7811.859337165201,
      "peri_deg": 151.7226986896637,
      "peri_rate": 0.0,
      "node_deg": 80.7020470760779,
      "node_rate": 0.0
     },
     {
      "from_jd": 2449718.5,
      "to_jd": 2453371.0,
      "epoch_jd": 2451544.5,
      "a_au": 2.766494285499959,
      "a_rate": 0.0,
      "e": 0.0783750551358662,
      "e_rate": 0.0,
      "i_deg": 10.58336067353508,
      "i_rate": 0.0,
      "L_deg": 160.59387214259849,
      "L_rate": 7823.473796502376,
      "peri_deg": 154.41715228573062,
      "peri_rate": 0.0,
      "node_deg": 80.49436497098499,
      "node_rate": 0.0
     },
     {
      "from_jd": 2453371.0,
      "to_jd": 2457023.5,
      "epoch_jd": 2455197.5,
      "a_au": 2.765732286727023,
      "a_rate": 0.0,
      "e": 0.07922331085189828,
      "e_rate": 0.0,
      "i_deg": 10.58624463444593,
      "i_rate": 0.0,
      "L_deg": 160.20690712277803,
      "L_rate": 7826.707237458059,
      "peri_deg": 153.088686549101,
      "peri_rate": 0.0,
      "node_deg": 80.39388750965466,
      "node_rate": 0.0
     },
     {
      "from_jd": 2457023.5,
      "to_jd": 2460676.0,
      "epoch_jd": 2458849.5,
      "a_au": 2.769289292154467,
      "a_rate": 0.0,
      "e": 0.07687465023986607,
      "e_rate": 0.0,
      "i_deg": 10.59127767083801,
      "i_rate": 0.0,
      "L_deg": 162.20654359445257,
      "L_rate": 7811.6325943081,
      "peri_deg": 154.1101582691718,
      "peri_rate": 0.0,
      "node_deg": 80.30119019174782,
      "node_rate": 0.0
     },
     {
      "from_jd": 2460676.0,
      "to_jd": 2464328.5,
      "epoch_jd": 2462502.5,
      "a_au": 2.766342291371093,
      "a_rate": 0.0,
      "e": 0.07941098417099222,
      "e_rate": 0.0,
      "i_deg": 10.58389196289204,
      "i_rate": 0.0,
      "L_deg": 159.59329808150005,
      "L_rate": 7824.118585700249,
      "peri_deg": 152.46879812076105,
      "peri_rate": 0.0,
      "node_deg": 80.1740351186271,
      "node_rate": 0.0
     },
     {
      "from_jd": 2464328.5,
      "to_jd": 2467981.0,
      "epoch_jd": 2466154.5,
      "a_au": 2.767609725222551,
      "a_rate": 0.0,
      "e": 0.07568270253940448,
      "e_rate": 0.0,
      "i_deg": 10.5938954818333,
      "i_rate": 0.0,
      "L_deg": 161.0065375222066,
      "L_rate": 7818.744588827395,
      "peri_deg": 154.7803834465039,
      "peri_rate": 0.0,
      "node_deg": 79.92477311293078,
      "node_rate": 0.0
     },
     {
      "from_jd": 2467981.0,
      "to_jd": null,
      "epoch_jd": 2469807.5,
      "a_au": 2.768371594179886,
      "a_rate": 0.0,
      "e": 0.07843275191877068,
      "e_rate": 0.0,
      "i_deg": 10.59704340454486,
      "i_rate": 0.0,
      "L_deg": 162.80411106195788,
      "L_rate": 7815.517177661373,
      "peri_deg": 152.70425314449614,
      "peri_rate": 0.0,
      "node_deg": 79.88204722235629,
      "node_rate": 0.0
     }
    ]
   },
   "tagline": "Planet kerdil di sabuk asteroid, benda terbesar di antara Mars dan Jupiter",
   "summary": "Ceres adalah benda terbesar di sabuk asteroid antara Mars dan Jupiter serta satu-satunya planet kerdil di bagian dalam tata surya. Diameternya sekitar 940 km. Pada 2015, wahana Dawn milik NASA menjadikan Ceres planet kerdil pertama yang dikunjungi wahana antariksa.",
   "description": [
    "Giuseppe Piazzi menemukan Ceres dari Palermo, Italia, pada 1 Januari 1801, dan Ceres pun menjadi anggota sabuk asteroid pertama yang ditemukan. Selama bertahun-tahun benda ini digolongkan sebagai asteroid. Pada 2006, para ilmuwan menggolongkannya sebagai planet kerdil karena ukurannya jauh lebih besar dan sifatnya berbeda dari asteroid di sekitarnya. Massa Ceres sekitar 25% massa seluruh sabuk asteroid, tetapi Pluto masih 14 kali lebih masif daripada Ceres. Namanya berasal dari dewi biji-bijian dan panen bangsa Romawi, nama yang juga menjadi asal kata cereal dalam bahasa Inggris.",
    "Ceres mengorbit Matahari pada jarak rata-rata sekitar 413 juta km, atau 2,8 satuan astronomi (SA), dan butuh 4,6 tahun untuk satu putaran. Satu rotasinya hanya sekitar 9 jam, salah satu hari terpendek di tata surya. Bagian dalamnya berlapis meskipun batas antarlapisannya tidak setegas pada planet kebumian. Ceres kemungkinan memiliki inti padat dan mantel es air, dan hingga 25% penyusunnya mungkin berupa air. Jika perkiraan itu benar, Ceres menyimpan lebih banyak air daripada Bumi. Keraknya berbatu dan berdebu dengan endapan garam seperti magnesium sulfat.",
    "Wahana Dawn mengorbit Ceres dari 2015 sampai 2018 dan memetakan permukaannya. Permukaannya dipenuhi kawah kecil yang masih muda, dan tidak satu pun kawahnya bergaris tengah lebih dari 280 km. Bintik terang di Kawah Occator ternyata endapan natrium karbonat, sisa air asin yang naik dari bawah permukaan. Data gravitasi Dawn menunjukkan adanya cadangan air asin yang luas jauh di bawah kawah tersebut. Ahuna Mons, gunung setinggi sekitar 4 km, kemungkinan adalah gunung api es yang dulu memuntahkan lumpur asin. Karena memiliki air, Ceres termasuk tempat yang ingin diselidiki ilmuwan untuk mencari tanda kehidupan."
   ],
   "facts": [
    "Ceres adalah satu-satunya planet kerdil di bagian dalam tata surya.",
    "Cahaya Matahari butuh sekitar 23 menit untuk mencapai Ceres.",
    "Kemiringan sumbu Ceres hanya sekitar 4 derajat, sehingga Ceres hampir tidak mengalami musim.",
    "Ceres memiliki atmosfer yang sangat tipis, dan ada petunjuk bahwa atmosfer itu mengandung uap air.",
    "Ceres tidak memiliki satelit alami maupun cincin.",
    "Sebelum tiba di Ceres, wahana Dawn mengorbit asteroid Vesta dari 2011 sampai 2012."
   ],
   "composition": "Campuran batuan dan es air dengan inti padat; kerak berdebu mengandung garam seperti magnesium sulfat dan natrium karbonat; atmosfer sangat tipis dengan petunjuk adanya uap air.",
   "missions": [
    {
     "name": "Dawn",
     "agency": "NASA",
     "years": "2007-2018",
     "note": "Mengorbit asteroid Vesta pada 2011 sampai 2012, lalu mengorbit Ceres sejak Maret 2015 hingga bahan bakar hidrazinnya habis dan misinya dinyatakan berakhir pada 1 November 2018."
    }
   ],
   "moonList": [],
   "image": {
    "src": "img/ceres.jpg",
    "title": "Ceres dari wahana Dawn",
    "credit": "NASA/JPL-Caltech/UCLA/MPS/DLR/IDA",
    "source_page": "https://science.nasa.gov/photojournal/ceres-in-color/"
   }
  },
  {
   "id": "jupiter",
   "name": "Jupiter",
   "parent": "sun",
   "type": "gas_giant",
   "diameter_km": 142984,
   "mass_1e24_kg": 1898,
   "density_kg_m3": 1326,
   "gravity_m_s2": 23.1,
   "escape_velocity_km_s": 59.5,
   "rotation_period_h": 9.9,
   "day_length_h": 9.9,
   "distance_million_km": 778.5,
   "perihelion_million_km": 740.6,
   "aphelion_million_km": 816.4,
   "orbital_period_days": 4332.589,
   "orbital_velocity_km_s": 13.1,
   "orbital_inclination_deg": 1.3,
   "orbital_eccentricity": 0.049,
   "axial_tilt_deg": 3.1,
   "mean_temperature_c": -110,
   "surface_pressure_bar": null,
   "moons": 115,
   "moons_as_of": "2026-10-14",
   "rings": true,
   "magnetic_field": "yes",
   "category": "Raksasa gas",
   "color": "#d6b48a",
   "orbit": {
    "a_au": 5.202887,
    "a_rate": -0.00011607,
    "e": 0.04838624,
    "e_rate": -0.00013253,
    "i_deg": 1.30439695,
    "i_rate": -0.00183714,
    "L_deg": 34.39644051,
    "L_rate": 3034.74612775,
    "peri_deg": 14.72847983,
    "peri_rate": 0.21252668,
    "node_deg": 100.47390909,
    "node_rate": 0.20469106
   },
   "tagline": "Planet terbesar di tata surya dan yang paling cepat berotasi",
   "summary": "Jupiter adalah planet kelima dari Matahari dan raksasa gas terbesar di tata surya, dengan diameter sekitar 143.000 km. Planet ini sebagian besar tersusun dari hidrogen dan helium dan berotasi sekali dalam sekitar 9,9 jam. Bintik Merah Raksasa di atmosfernya adalah badai yang lebih lebar daripada Bumi.",
   "description": [
    "Jupiter adalah planet kelima dari Matahari dan planet terbesar di tata surya. Diameternya di khatulistiwa sekitar 143.000 km, kira-kira 11 kali diameter Bumi, dan massanya lebih dari dua kali gabungan massa semua planet lain. Jarak rata-ratanya ke Matahari sekitar 778 juta km atau 5,2 satuan astronomi (SA), sehingga cahaya Matahari butuh sekitar 43 menit untuk sampai ke sana. Jupiter berotasi sekali dalam sekitar 9,9 jam, hari terpendek di antara semua planet, dan mengelilingi Matahari sekali dalam hampir 12 tahun Bumi.",
    "Komposisi Jupiter mirip Matahari, yaitu sebagian besar hidrogen dan helium, dan planet ini tidak memiliki permukaan padat. Makin ke dalam, tekanan dan suhu meningkat dan memampatkan gas hidrogen menjadi cairan. Kira-kira di tengah jalan menuju pusat planet, tekanannya diduga cukup besar untuk membuat hidrogen cair menghantarkan listrik seperti logam. Rotasi Jupiter yang cepat diduga menggerakkan arus listrik di lapisan ini dan menghasilkan medan magnet yang 16 sampai 54 kali lebih kuat daripada medan magnet Bumi. Data gravitasi dari wahana Juno menunjukkan inti Jupiter lebih besar dari perkiraan dan sebagian larut ke dalam hidrogen logam di sekitarnya.",
    "Pita-pita khas Jupiter adalah awan amonia dan air yang dingin, mengapung di atmosfer hidrogen dan helium. Pita gelap berwarna jingga disebut sabuk, pita yang lebih terang disebut zona, dan angin di pita-pita yang bersebelahan bertiup ke arah berlawanan, ke timur atau ke barat. Bintik Merah Raksasa adalah badai yang lebih lebar daripada Bumi dan sudah tercatat setidaknya sejak 1831. Pengukuran gravitasi oleh Juno menunjukkan badai ini menjangkau kedalaman sekitar 500 km di bawah puncak awan.",
    "Cincin Jupiter yang tipis dan gelap ditemukan Voyager 1 pada 1979. Partikelnya diduga berasal dari debu yang terlempar ketika meteoroid menghantam bulan-bulan kecil di bagian dalam. Empat bulan terbesarnya, Io, Europa, Ganymede, dan Callisto, disebut satelit Galileo karena ditemukan Galileo Galilei pada 1610. Europa menjadi sasaran misi Europa Clipper milik NASA, sedangkan misi Juice milik ESA akan mempelajari Ganymede, Callisto, dan Europa sebelum mengorbit Ganymede."
   ],
   "facts": [
    "Volume Jupiter cukup untuk menampung lebih dari 1.000 planet seukuran Bumi.",
    "Pada 16 sampai 22 Juli 1994, pecahan-pecahan komet Shoemaker-Levy 9 menghantam Jupiter, dan wahana Galileo yang sedang dalam perjalanan merekam tumbukan itu secara langsung.",
    "Ekor magnetosfer Jupiter menjulur lebih dari 1 miliar km di belakang planet, sampai ke orbit Saturnus.",
    "Sumbu rotasi Jupiter hanya miring sekitar 3 derajat, sehingga perubahan musimnya tidak sekuat di planet lain.",
    "Pioneer 10 menjadi wahana pertama yang melintasi Jupiter, dengan jarak terdekat pada Desember 1973.",
    "Angin di sekitar khatulistiwa Jupiter dapat mencapai sekitar 540 km/jam."
   ],
   "composition": "Atmosfer: hidrogen molekuler sekitar 89,8% dan helium sekitar 10,2%, dengan sedikit metana, amonia, hidrogen deuterida, etana, dan air.",
   "missions": [
    {
     "name": "Voyager 1",
     "agency": "NASA",
     "years": "1979",
     "note": "Melintas pada Maret 1979 dan menemukan cincin tipis Jupiter, dua bulan baru, serta gunung api aktif di Io."
    },
    {
     "name": "Galileo",
     "agency": "NASA",
     "years": "1995-2003",
     "note": "Wahana pertama yang mengorbit planet luar; wahana kecil yang dilepasnya masuk ke atmosfer Jupiter pada 7 Desember 1995, dan misinya berakhir dengan terjun ke Jupiter pada 21 September 2003."
    },
    {
     "name": "Juno",
     "agency": "NASA",
     "years": "2016-sekarang",
     "note": "Mengorbit Jupiter sejak 4 Juli 2016 dan memetakan medan gravitasi serta medan magnetnya untuk mempelajari bagian dalam planet."
    },
    {
     "name": "Juice",
     "agency": "ESA",
     "years": "2023-sekarang",
     "note": "Diluncurkan pada April 2023, terbang lintas Bumi pada 28 September 2026, dan dijadwalkan tiba di Jupiter pada 2031 sebelum mengorbit Ganymede."
    },
    {
     "name": "Europa Clipper",
     "agency": "NASA",
     "years": "2024-sekarang",
     "note": "Diluncurkan pada 14 Oktober 2024 dan dijadwalkan tiba pada April 2030 untuk melakukan 49 terbang lintas dekat Europa."
    }
   ],
   "moonList": [
    {
     "name": "Io",
     "radius_km": 1821.49,
     "distance_km": 421800,
     "period_days": 1.769138,
     "discovered": 1610,
     "discoverer": "Galileo",
     "retrograde": false,
     "note": "Benda dengan aktivitas gunung api tertinggi di tata surya; sebagian dari ratusan gunung apinya memancurkan lava setinggi puluhan kilometer."
    },
    {
     "name": "Europa",
     "radius_km": 1560.8,
     "distance_km": 671100,
     "period_days": 3.551181,
     "discovered": 1610,
     "discoverer": "Galileo",
     "retrograde": false,
     "note": "Di bawah kerak esnya diduga ada lautan air asin yang volumenya sekitar dua kali seluruh air laut di Bumi."
    },
    {
     "name": "Ganymede",
     "radius_km": 2631.2,
     "distance_km": 1070400,
     "period_days": 7.154553,
     "discovered": 1610,
     "discoverer": "Galileo",
     "retrograde": false,
     "note": "Bulan terbesar di tata surya, lebih besar daripada Merkurius, dan satu-satunya bulan yang diketahui memiliki medan magnet sendiri."
    },
    {
     "name": "Callisto",
     "radius_km": 2410.3,
     "distance_km": 1882700,
     "period_days": 16.689017,
     "discovered": 1610,
     "discoverer": "Galileo",
     "retrograde": false,
     "note": "Benda dengan kawah terbanyak di tata surya; data wahana Galileo mengisyaratkan adanya lautan asin di bawah permukaannya."
    }
   ],
   "image": {
    "src": "img/jupiter.jpg",
    "title": "Jupiter dipotret Teleskop Antariksa Hubble pada 21 April 2014",
    "credit": "NASA/ESA",
    "source_page": "https://images.nasa.gov/details/GSFC_20171208_Archive_e001094"
   }
  },
  {
   "id": "saturn",
   "name": "Saturnus",
   "parent": "sun",
   "type": "gas_giant",
   "diameter_km": 120536,
   "mass_1e24_kg": 568,
   "density_kg_m3": 687,
   "gravity_m_s2": 9.0,
   "escape_velocity_km_s": 35.5,
   "rotation_period_h": 10.7,
   "day_length_h": 10.7,
   "distance_million_km": 1432.0,
   "perihelion_million_km": 1357.6,
   "aphelion_million_km": 1506.5,
   "orbital_period_days": 10755.699,
   "orbital_velocity_km_s": 9.7,
   "orbital_inclination_deg": 2.5,
   "orbital_eccentricity": 0.052,
   "axial_tilt_deg": 26.7,
   "mean_temperature_c": -140,
   "surface_pressure_bar": null,
   "moons": 293,
   "moons_as_of": "2026-10-14",
   "rings": true,
   "magnetic_field": "yes",
   "category": "Raksasa gas",
   "color": "#e2cf96",
   "orbit": {
    "a_au": 9.53667594,
    "a_rate": -0.0012506,
    "e": 0.05386179,
    "e_rate": -0.00050991,
    "i_deg": 2.48599187,
    "i_rate": 0.00193609,
    "L_deg": 49.95424423,
    "L_rate": 1222.49362201,
    "peri_deg": 92.59887831,
    "peri_rate": -0.41897216,
    "node_deg": 113.66242448,
    "node_rate": -0.28867794
   },
   "tagline": "Raksasa gas bercincin terang yang massa jenisnya lebih kecil daripada air",
   "summary": "Saturnus adalah planet keenam dari Matahari dan planet terbesar kedua di tata surya, dengan diameter sekitar 120.500 km. Cincinnya tersusun dari bongkahan es dan batuan, dari butiran sehalus debu sampai sebesar rumah. Saturnus adalah satu-satunya planet yang massa jenis rata-ratanya lebih kecil daripada air.",
   "description": [
    "Saturnus adalah planet keenam dari Matahari dan planet terbesar kedua setelah Jupiter. Diameternya di khatulistiwa sekitar 120.500 km, kira-kira 9 kali diameter Bumi. Jarak rata-ratanya ke Matahari sekitar 1,4 miliar km atau 9,5 satuan astronomi (SA), sehingga cahaya Matahari butuh sekitar 80 menit untuk tiba. Satu hari di Saturnus hanya sekitar 10,7 jam, sedangkan satu tahunnya setara dengan sekitar 29,4 tahun Bumi. Sumbunya miring sekitar 26,7 derajat, mirip kemiringan sumbu Bumi, sehingga Saturnus juga mengalami musim.",
    "Seperti Jupiter, Saturnus sebagian besar tersusun dari hidrogen dan helium dan tidak memiliki permukaan padat. Pusatnya diduga berupa inti logam seperti besi dan nikel yang dikelilingi batuan, lalu diselubungi hidrogen logam cair dan lapisan hidrogen cair. Massa jenis rata-ratanya lebih kecil daripada air, satu-satunya planet di tata surya dengan sifat ini. Di atmosfer atas, angin di sekitar khatulistiwa dapat bertiup sampai 500 meter per detik, sedangkan angin badai terkuat di Bumi hanya sekitar 110 meter per detik.",
    "Cincin Saturnus terdiri atas miliaran bongkahan es dan batuan yang dilapisi debu, dan beberapa di antaranya sebesar gunung. Sistem cincinnya menjangkau hingga sekitar 282.000 km dari planet, tetapi tebal cincin utamanya umumnya hanya sekitar 10 meter. Cincin-cincin itu dinamai menurut huruf sesuai urutan penemuannya, dan Celah Cassini selebar sekitar 4.700 km memisahkan cincin A dan cincin B. Galileo Galilei sudah melihat cincin Saturnus dengan teleskop pada 1610, tetapi mengira Saturnus adalah planet rangkap tiga, dan baru pada 1655 Christiaan Huygens mengenali bentuk itu sebagai cincin.",
    "Di kutub utara Saturnus terdapat aliran jet berbentuk segi enam yang lebarnya sekitar 30.000 km, dengan badai besar yang berputar di tengahnya. Pola ini pertama kali terlihat dalam citra wahana Voyager pada awal 1980-an, lalu diamati lebih rinci oleh Cassini. Pada September 2026, tim peneliti yang memakai Teleskop Antariksa Hubble melaporkan gelombang atmosfer bersisi sepuluh di sekitar kutub selatan. Ini pertama kalinya pola jet bersisi teratur berukuran besar terlihat di belahan selatan Saturnus."
   ],
   "facts": [
    "Saturnus adalah planet terjauh yang sudah dikenal sejak zaman kuno, sebelum teleskop ditemukan.",
    "Pada 23 Maret 2025, cincin Saturnus hampir tidak terlihat dari Bumi karena bidang cincinnya sejajar dengan arah pandang kita; peristiwa ini berulang setiap 13 sampai 16 tahun.",
    "Cincin Phoebe yang sangat redup berada jauh di luar cincin utama, di jalur orbit bulan Phoebe.",
    "Medan magnet Saturnus lebih lemah daripada medan magnet Jupiter, tetapi sekitar 578 kali lebih kuat daripada medan magnet Bumi.",
    "Cassini mengakhiri misinya pada 15 September 2017 dengan sengaja terjun ke atmosfer Saturnus.",
    "Nama Saturnus diambil dari dewa pertanian dan kekayaan dalam mitologi Romawi, yang juga ayah Jupiter."
   ],
   "composition": "Atmosfer: hidrogen molekuler sekitar 96,3% dan helium sekitar 3,25%, dengan sedikit metana, amonia, hidrogen deuterida, dan etana.",
   "missions": [
    {
     "name": "Pioneer 11",
     "agency": "NASA",
     "years": "1979",
     "note": "Wahana pertama yang mencapai Saturnus pada 1 September 1979; temuannya termasuk cincin F dan satu bulan baru."
    },
    {
     "name": "Voyager 1 dan Voyager 2",
     "agency": "NASA",
     "years": "1980-1981",
     "note": "Voyager 1 memperlihatkan bahwa cincin Saturnus terdiri atas ribuan cincin kecil, dan Voyager 2 menunjukkan bahwa sebagian cincin itu sangat tipis."
    },
    {
     "name": "Cassini-Huygens",
     "agency": "NASA/ESA/ASI",
     "years": "2004-2017",
     "note": "Cassini mengorbit Saturnus selama 13 tahun sejak 2004, dan wahana Huygens mendarat di Titan pada 14 Januari 2005."
    },
    {
     "name": "Dragonfly",
     "agency": "NASA",
     "years": "2028 (rencana)",
     "note": "Pesawat rotor yang dijadwalkan meluncur paling cepat Juli 2028 dan tiba di Titan pada akhir 2034 untuk mendarat di banyak lokasi berbeda."
    }
   ],
   "moonList": [
    {
     "name": "Mimas",
     "radius_km": 198.2,
     "distance_km": 186000,
     "period_days": 0.942422,
     "discovered": 1789,
     "discoverer": "W. Herschel",
     "retrograde": false,
     "note": "Kawah Herschel di permukaannya selebar sekitar 130 km, kira-kira sepertiga diameter Mimas."
    },
    {
     "name": "Enceladus",
     "radius_km": 252.1,
     "distance_km": 238400,
     "period_days": 1.370218,
     "discovered": 1789,
     "discoverer": "W. Herschel",
     "retrograde": false,
     "note": "Pada 2005 Cassini menemukan semburan butiran es dan gas dari retakan di kutub selatannya, yang dipasok lautan global di bawah kerak es."
    },
    {
     "name": "Tethys",
     "radius_km": 531.1,
     "distance_km": 295000,
     "period_days": 1.887802,
     "discovered": 1684,
     "discoverer": "G.D. Cassini",
     "retrograde": false,
     "note": "Massa jenisnya hampir sama dengan air karena hampir seluruhnya tersusun dari es air; lembah Ithaca Chasma di permukaannya panjangnya sekitar 2.000 km."
    },
    {
     "name": "Dione",
     "radius_km": 561.4,
     "distance_km": 377700,
     "period_days": 2.736916,
     "discovered": 1684,
     "discoverer": "G.D. Cassini",
     "retrograde": false,
     "note": "Cassini memperlihatkan bahwa garis-garis terang di permukaannya adalah dinding ngarai es, sebagian setinggi ratusan meter."
    },
    {
     "name": "Rhea",
     "radius_km": 763.5,
     "distance_km": 527200,
     "period_days": 4.517503,
     "discovered": 1672,
     "discoverer": "G.D. Cassini",
     "retrograde": false,
     "note": "Bulan terbesar kedua Saturnus; Cassini mendeteksi lapisan gas yang sangat tipis berisi oksigen dan karbon dioksida di sekitarnya."
    },
    {
     "name": "Titan",
     "radius_km": 2574.76,
     "distance_km": 1221900,
     "period_days": 15.945448,
     "discovered": 1655,
     "discoverer": "C. Huygens",
     "retrograde": false,
     "note": "Bulan terbesar Saturnus dan satu-satunya bulan beratmosfer tebal; permukaannya memiliki danau dan laut metana serta etana cair."
    },
    {
     "name": "Iapetus",
     "radius_km": 734.3,
     "distance_km": 3561700,
     "period_days": 79.331002,
     "discovered": 1671,
     "discoverer": "G.D. Cassini",
     "retrograde": false,
     "note": "Sisi depannya segelap batu bara, sisi belakangnya jauh lebih terang, dan deretan gunung setinggi sekitar 10 km melingkari khatulistiwanya."
    }
   ],
   "image": {
    "src": "img/saturn.jpg",
    "title": "Saturnus dan cincinnya dari wahana Cassini",
    "credit": "NASA/JPL/Space Science Institute",
    "source_page": "https://science.nasa.gov/photojournal/saturn-four-years-on/"
   }
  },
  {
   "id": "uranus",
   "name": "Uranus",
   "parent": "sun",
   "type": "ice_giant",
   "diameter_km": 51118,
   "mass_1e24_kg": 86.8,
   "density_kg_m3": 1270,
   "gravity_m_s2": 8.7,
   "escape_velocity_km_s": 21.3,
   "rotation_period_h": -17.2,
   "day_length_h": 17.2,
   "distance_million_km": 2867.0,
   "perihelion_million_km": 2732.7,
   "aphelion_million_km": 3001.4,
   "orbital_period_days": 30685.4,
   "orbital_velocity_km_s": 6.8,
   "orbital_inclination_deg": 0.8,
   "orbital_eccentricity": 0.047,
   "axial_tilt_deg": 97.8,
   "mean_temperature_c": -195,
   "surface_pressure_bar": null,
   "moons": 29,
   "moons_as_of": "2026-10-14",
   "rings": true,
   "magnetic_field": "yes",
   "category": "Raksasa es",
   "color": "#9fd8de",
   "orbit": {
    "a_au": 19.18916464,
    "a_rate": -0.00196176,
    "e": 0.04725744,
    "e_rate": -4.397e-05,
    "i_deg": 0.77263783,
    "i_rate": -0.00242939,
    "L_deg": 313.23810451,
    "L_rate": 428.48202785,
    "peri_deg": 170.9542763,
    "peri_rate": 0.40805281,
    "node_deg": 74.01692503,
    "node_rate": 0.04240589
   },
   "tagline": "Raksasa es yang sumbunya miring hampir 98 derajat, seolah berguling mengitari Matahari",
   "summary": "Uranus adalah planet ketujuh dari Matahari dan raksasa es dengan diameter sekitar 51.100 km. Sumbu rotasinya miring hampir 98 derajat, sehingga planet ini seolah berguling saat mengelilingi Matahari. Warna biru kehijauannya berasal dari gas metana yang menyerap cahaya merah.",
   "description": [
    "Uranus adalah planet ketujuh dari Matahari dan planet pertama yang ditemukan dengan bantuan teleskop. William Herschel menemukannya pada 1781 dan semula mengira benda itu komet atau bintang. Herschel ingin menamainya Georgium Sidus untuk menghormati Raja George III, tetapi nama yang akhirnya dipakai adalah Uranus, dewa langit dalam mitologi Yunani, sesuai usulan Johann Bode. Diameter Uranus di khatulistiwa sekitar 51.100 km, kira-kira empat kali diameter Bumi, dan jarak rata-ratanya ke Matahari sekitar 2,9 miliar km atau 19 satuan astronomi (SA).",
    "Sumbu Uranus miring sekitar 97,8 derajat, sehingga khatulistiwanya hampir tegak lurus terhadap bidang orbit. Kemiringan ini mungkin akibat tabrakan dengan benda seukuran Bumi pada masa lalu. Satu tahun Uranus setara dengan sekitar 84 tahun Bumi. Selama hampir seperempat tahun itu, Matahari bersinar hampir tepat di atas salah satu kutub, sementara belahan lainnya mengalami musim dingin yang gelap selama 21 tahun. Uranus juga berotasi berlawanan arah dengan sebagian besar planet, sama seperti Venus.",
    "Sebanyak 80% atau lebih massa Uranus berupa fluida panas dari bahan-bahan es, yaitu air, metana, dan amonia, yang menyelimuti inti berbatu kecil. Di dekat inti, suhunya diperkirakan hampir 5.000 °C. Atmosfernya sebagian besar hidrogen dan helium dengan sedikit metana. Metana menyerap bagian merah cahaya Matahari, sehingga Uranus tampak biru kehijauan. Suhu terendah atmosfernya sekitar -224 °C, sehingga di beberapa tempat Uranus lebih dingin daripada Neptunus. Angin di planet ini dapat mencapai 900 km/jam.",
    "Uranus memiliki 13 cincin redup. Cincin bagian dalamnya umumnya sempit dan berwarna abu-abu gelap, sedangkan dua cincin terluarnya berbeda warna: yang lebih dalam kemerahan dan yang paling luar kebiruan. Cincin pertamanya ditemukan pada 1977 ketika Uranus melintas di depan sebuah bintang. Bulan-bulannya dinamai menurut tokoh dalam karya William Shakespeare dan Alexander Pope. Pada 2025, tim peneliti memakai pengamatan aurora oleh Teleskop Antariksa Hubble untuk menghitung ulang lama rotasinya: 17 jam 14 menit 52 detik, sekitar 28 detik lebih lama daripada perkiraan dari data Voyager 2."
   ],
   "facts": [
    "Sumbu magnet Uranus miring hampir 60 derajat dari sumbu rotasinya, dan pusat medan magnetnya bergeser sekitar sepertiga jari-jari planet dari pusat Uranus.",
    "Karena medan magnetnya miring, aurora di Uranus tidak sejajar dengan kutub-kutubnya.",
    "Diameter Uranus sedikit lebih besar daripada Neptunus, tetapi massanya lebih kecil.",
    "Setelah Saturnus, Uranus adalah planet dengan massa jenis rata-rata terendah.",
    "Di khatulistiwa Uranus angin bertiup berlawanan dengan arah rotasi planet, sedangkan di dekat kutub angin bertiup searah rotasi.",
    "Cahaya Matahari butuh sekitar 2 jam 40 menit untuk mencapai Uranus."
   ],
   "composition": "Atmosfer: hidrogen molekuler sekitar 82,5%, helium sekitar 15,2%, dan metana sekitar 2,3%; bagian dalamnya berupa fluida panas berisi air, metana, dan amonia di atas inti berbatu.",
   "missions": [
    {
     "name": "Voyager 2",
     "agency": "NASA",
     "years": "1986",
     "note": "Satu-satunya wahana yang pernah mengunjungi Uranus; pada 24 Januari 1986 melintas sekitar 81.500 km dari puncak awannya dan menemukan 10 bulan baru serta 2 cincin baru."
    }
   ],
   "moonList": [
    {
     "name": "Miranda",
     "radius_km": 235.8,
     "distance_km": 129846,
     "period_days": 1.413479,
     "discovered": 1948,
     "discoverer": "G. Kuiper",
     "retrograde": false,
     "note": "Permukaannya tampak seperti tambal sulam, dengan ngarai patahan yang kedalamannya bisa mencapai 12 kali Grand Canyon."
    },
    {
     "name": "Ariel",
     "radius_km": 578.9,
     "distance_km": 190929,
     "period_days": 2.520379,
     "discovered": 1851,
     "discoverer": "W. Lassell",
     "retrograde": false,
     "note": "Permukaannya paling terang di antara lima bulan besar Uranus dan tampak paling muda di antara bulan-bulan Uranus."
    },
    {
     "name": "Umbriel",
     "radius_km": 584.7,
     "distance_km": 265986,
     "period_days": 4.144177,
     "discovered": 1851,
     "discoverer": "W. Lassell",
     "retrograde": false,
     "note": "Bulan besar Uranus yang paling gelap; citra Voyager 2 memperlihatkan cincin terang berdiameter sekitar 140 km di permukaannya."
    },
    {
     "name": "Titania",
     "radius_km": 788.9,
     "distance_km": 436298,
     "period_days": 8.705869,
     "discovered": 1787,
     "discoverer": "W. Herschel",
     "retrograde": false,
     "note": "Bulan terbesar Uranus; sebagian lembah patahan di permukaannya panjangnya sekitar 1.600 km, hampir sama dengan diameter Titania sendiri."
    },
    {
     "name": "Oberon",
     "radius_km": 761.4,
     "distance_km": 583511,
     "period_days": 13.463237,
     "discovered": 1787,
     "discoverer": "W. Herschel",
     "retrograde": false,
     "note": "Bulan terbesar kedua Uranus; permukaannya penuh kawah dan memiliki setidaknya satu gunung setinggi sekitar 6 km."
    }
   ],
   "image": {
    "src": "img/uranus.jpg",
    "title": "Uranus dari Voyager 2 pada 1986",
    "credit": "NASA/JPL-Caltech",
    "source_page": "https://science.nasa.gov/photojournal/uranus-as-seen-by-nasas-voyager-2/"
   }
  },
  {
   "id": "neptune",
   "name": "Neptunus",
   "parent": "sun",
   "type": "ice_giant",
   "diameter_km": 49528,
   "mass_1e24_kg": 102,
   "density_kg_m3": 1638,
   "gravity_m_s2": 11.0,
   "escape_velocity_km_s": 23.5,
   "rotation_period_h": 16.1,
   "day_length_h": 16.1,
   "distance_million_km": 4515.0,
   "perihelion_million_km": 4471.1,
   "aphelion_million_km": 4558.9,
   "orbital_period_days": 60189.018,
   "orbital_velocity_km_s": 5.4,
   "orbital_inclination_deg": 1.8,
   "orbital_eccentricity": 0.01,
   "axial_tilt_deg": 28.3,
   "mean_temperature_c": -200,
   "surface_pressure_bar": null,
   "moons": 16,
   "moons_as_of": "2026-10-14",
   "rings": true,
   "magnetic_field": "yes",
   "category": "Raksasa es",
   "color": "#4f74d9",
   "orbit": {
    "a_au": 30.06992276,
    "a_rate": 0.00026291,
    "e": 0.00859048,
    "e_rate": 5.105e-05,
    "i_deg": 1.77004347,
    "i_rate": 0.00035372,
    "L_deg": -55.12002969,
    "L_rate": 218.45945325,
    "peri_deg": 44.96476227,
    "peri_rate": -0.32241464,
    "node_deg": 131.78422574,
    "node_rate": -0.00508664
   },
   "tagline": "Planet terjauh dari Matahari, dengan angin terkencang di tata surya",
   "summary": "Neptunus adalah planet kedelapan dan terjauh dari Matahari, sekitar 30 kali jarak Bumi ke Matahari. Raksasa es ini memiliki angin terkencang di tata surya, lebih dari 2.000 km/jam. Neptunus juga planet pertama yang ditemukan lewat perhitungan matematika, yaitu pada 1846.",
   "description": [
    "Neptunus adalah planet kedelapan dan terjauh dari Matahari. Jarak rata-ratanya sekitar 4,5 miliar km atau 30 satuan astronomi (SA), sehingga cahaya Matahari butuh sekitar 4 jam untuk sampai ke sana. Cahaya Matahari di Bumi kira-kira 900 kali lebih terang daripada di Neptunus. Diameternya sekitar 49.500 km, hampir empat kali diameter Bumi. Di antara delapan planet, hanya Neptunus yang tidak dapat dilihat dengan mata telanjang.",
    "Penemuan Neptunus berawal dari perhitungan matematika. Gerak Uranus tidak persis seperti yang diperkirakan, sehingga matematikawan Prancis Urbain Le Verrier menghitung posisi dan massa planet tak dikenal yang mungkin memengaruhinya. Johann Gottfried Galle dari Observatorium Berlin menerima perhitungan itu dan menemukan Neptunus pada malam pertama pencariannya pada 1846. Satu kali mengelilingi Matahari butuh sekitar 165 tahun Bumi, sehingga baru pada 2011 Neptunus menyelesaikan orbit penuh pertamanya sejak ditemukan.",
    "Seperti Uranus, 80% atau lebih massa Neptunus berupa fluida panas dari air, metana, dan amonia di atas inti berbatu kecil. Atmosfernya sebagian besar hidrogen dan helium dengan sedikit metana yang memberi warna biru. Angin di Neptunus mendorong awan metana beku dengan kecepatan lebih dari 2.000 km/jam, kira-kira tiga kali lebih kencang daripada angin di Jupiter. Pada 1989, Voyager 2 memotret Bintik Gelap Raksasa, badai lonjong yang cukup besar untuk memuat Bumi. Badai itu kemudian menghilang, dan badai-badai baru muncul di bagian lain planet.",
    "Sumbu Neptunus miring sekitar 28 derajat, sehingga planet ini punya musim, dan setiap musim berlangsung lebih dari 40 tahun. Lima cincin utamanya bernama Galle, Leverrier, Lassell, Arago, dan Adams. Cincin terluar, Adams, memuat gumpalan debu berbentuk busur yang diduga tetap rapat karena gravitasi bulan Galatea. Pada Maret 2025, NASA mengumumkan bahwa Teleskop Antariksa James Webb untuk pertama kalinya menangkap citra aurora di Neptunus."
   ],
   "facts": [
    "Di antara keempat planet raksasa, Neptunus memiliki massa jenis rata-rata tertinggi.",
    "Medan magnet Neptunus sekitar 27 kali lebih kuat daripada medan magnet Bumi, dan sumbunya miring sekitar 47 derajat dari sumbu rotasi.",
    "Galileo Galilei sudah mencatat Neptunus pada 1612 dan 1613, tetapi mengiranya bintang tetap.",
    "Triton, bulan terbesar Neptunus, ditemukan William Lassell pada 10 Oktober 1846, hanya 17 hari setelah Neptunus ditemukan.",
    "Studi yang terbit pada akhir 2023 menunjukkan bahwa warna Neptunus dan Uranus jauh lebih mirip daripada yang lama dikira, dan menjelaskan cara mengolah citra Voyager 2 agar warnanya mendekati warna asli.",
    "Para ilmuwan menduga ada lautan air yang sangat panas di bawah awan Neptunus yang dingin, dan tekanan yang sangat tinggi mencegah air itu mendidih."
   ],
   "composition": "Atmosfer: hidrogen molekuler sekitar 80%, helium sekitar 19%, dan metana sekitar 1,5%; 80% atau lebih massanya berupa fluida panas berisi air, metana, dan amonia di atas inti berbatu.",
   "missions": [
    {
     "name": "Voyager 2",
     "agency": "NASA",
     "years": "1989",
     "note": "Satu-satunya wahana yang pernah mengunjungi Neptunus; melintas paling dekat pada 25 Agustus 1989 dan menemukan geiser aktif di Triton."
    }
   ],
   "moonList": [
    {
     "name": "Triton",
     "radius_km": 1352.6,
     "distance_km": 354800,
     "period_days": 5.876994,
     "discovered": 1846,
     "discoverer": "W. Lassell",
     "retrograde": true,
     "note": "Satu-satunya bulan besar di tata surya yang mengorbit berlawanan arah rotasi planetnya; Voyager 2 menemukan geiser aktif di permukaannya yang bersuhu sekitar -235 °C."
    },
    {
     "name": "Nereid",
     "radius_km": 170,
     "distance_km": 5513900,
     "period_days": 360.133039,
     "discovered": 1949,
     "discoverer": "G.P. Kuiper",
     "retrograde": false,
     "note": "Orbitnya termasuk yang paling lonjong di antara bulan-bulan di tata surya, dengan satu putaran mengelilingi Neptunus selama sekitar 360 hari."
    }
   ],
   "image": {
    "src": "img/neptune.jpg",
    "title": "Neptunus dari Voyager 2 pada 1989",
    "credit": "NASA/JPL",
    "source_page": "https://science.nasa.gov/photojournal/neptune-full-disk-view/"
   }
  },
  {
   "id": "pluto",
   "name": "Pluto",
   "parent": "sun",
   "type": "dwarf",
   "diameter_km": 2376,
   "mass_1e24_kg": 0.013,
   "density_kg_m3": 1850,
   "gravity_m_s2": 0.62,
   "escape_velocity_km_s": 1.21,
   "rotation_period_h": -153.3,
   "day_length_h": 153.3,
   "distance_million_km": 5906.4,
   "perihelion_million_km": 4436.8,
   "aphelion_million_km": 7375.9,
   "orbital_period_days": 90560,
   "orbital_velocity_km_s": 4.7,
   "orbital_inclination_deg": 17.2,
   "orbital_eccentricity": 0.2488,
   "axial_tilt_deg": 119.5,
   "mean_temperature_c": -225,
   "surface_pressure_bar": 1e-05,
   "moons": 5,
   "moons_as_of": "2026-10-14",
   "rings": false,
   "magnetic_field": "unknown",
   "category": "Planet kerdil",
   "color": "#c9b09a",
   "orbit": {
    "a_au": 39.48211675,
    "a_rate": -0.00031596,
    "e": 0.2488273,
    "e_rate": 5.17e-05,
    "i_deg": 17.14001206,
    "i_rate": 4.818e-05,
    "L_deg": 238.92903833,
    "L_rate": 145.20780515,
    "peri_deg": 224.06891629,
    "peri_rate": -0.04062942,
    "node_deg": 110.30393684,
    "node_rate": -0.01183482
   },
   "tagline": "Planet kerdil di Sabuk Kuiper dengan gletser nitrogen di wilayah berbentuk hati",
   "summary": "Pluto adalah planet kerdil di Sabuk Kuiper dengan diameter sekitar 2.380 km, kira-kira dua pertiga diameter Bulan. Pluto ditemukan pada 1930 dan dianggap planet kesembilan sampai 2006. Wahana New Horizons memotretnya dari dekat pada 14 Juli 2015.",
   "description": [
    "Clyde Tombaugh menemukan Pluto di Observatorium Lowell, Amerika Serikat, pada 18 Februari 1930. Nama Pluto diusulkan Venetia Burney, siswi berusia 11 tahun dari Oxford, Inggris. Selama 76 tahun Pluto dianggap planet kesembilan. Pada 2006, Persatuan Astronomi Internasional (IAU) menetapkan bahwa sebuah planet harus sudah membersihkan wilayah di sekitar orbitnya dari benda-benda lain. Pluto berbagi wilayah orbitnya dengan banyak benda Sabuk Kuiper, sehingga kini digolongkan sebagai planet kerdil.",
    "Diameter Pluto sekitar 2.380 km, kira-kira dua pertiga diameter Bulan, dan massanya hanya sekitar seperenam massa Bulan. Jarak rata-ratanya ke Matahari sekitar 5,9 miliar km atau 39 satuan astronomi (SA). Orbitnya lonjong dan miring sekitar 17 derajat terhadap bidang orbit Bumi; jaraknya ke Matahari berubah dari sekitar 30 SA sampai 49 SA, dan satu putaran mengelilingi Matahari butuh sekitar 248 tahun. Satu hari di Pluto berlangsung sekitar 153 jam. Pluto berotasi dari timur ke barat, sama seperti Venus dan Uranus.",
    "Citra New Horizons memperlihatkan bagian terang berbentuk hati di permukaan Pluto. Belahan barat hati itu adalah Sputnik Planitia, gletser es nitrogen yang sangat luas dan tidak memiliki kawah. Pegunungan Pluto berupa bongkah es air, kadang berlapis gas beku seperti metana, dan sebagian puncaknya mencapai 2 sampai 3 km. Studi yang terbit pada 2026 menafsirkan sebagian pola gelap di tepi utara Sputnik Planitia sebagai tanda bahwa nitrogen cair sesekali naik ke permukaan melalui retakan.",
    "Pluto memiliki atmosfer tipis yang sebagian besar berupa nitrogen, dengan sedikit metana dan karbon monoksida. Atmosfer ini mengembang saat Pluto mendekati Matahari dan dapat membeku lalu jatuh sebagai salju saat Pluto menjauh. Bulan terbesarnya, Charon, berukuran sekitar setengah Pluto. Pluto dan Charon saling mengunci pasang surut, sehingga sisi yang sama dari keduanya selalu saling berhadapan."
   ],
   "facts": [
    "Orbit Pluto beresonansi 3:2 dengan Neptunus: setiap kali Neptunus mengelilingi Matahari tiga kali, Pluto mengelilinginya dua kali, sehingga keduanya tidak pernah berpapasan dekat.",
    "Walaupun sebagian orbitnya berada di dalam orbit Neptunus, Pluto tidak pernah mendekati Neptunus sedekat ia mendekati Uranus.",
    "Karena orbitnya lonjong, Pluto berada lebih dekat ke Matahari daripada Neptunus selama sekitar 20 tahun dalam setiap 248 tahun; terakhir kali pada 1979 sampai 1999.",
    "New Horizons diluncurkan pada 19 Januari 2006, beberapa bulan sebelum Pluto digolongkan ulang sebagai planet kerdil.",
    "Pluto adalah benda terbesar di Sabuk Kuiper, meskipun Eris yang ukurannya hampir sama memiliki massa sekitar 27% lebih besar.",
    "Suhu rata-rata di permukaan Pluto lebih dingin daripada -220 °C."
   ],
   "composition": "Atmosfer tipis: nitrogen sekitar 99%, metana sekitar 0,5%, dan karbon monoksida sekitar 0,05%; dataran luasnya berupa es nitrogen dan pegunungannya berupa bongkah es air.",
   "missions": [
    {
     "name": "New Horizons",
     "agency": "NASA",
     "years": "2015",
     "note": "Wahana pertama yang menjelajahi Pluto dari dekat; melintas pada 14 Juli 2015, lalu melintasi Arrokoth di Sabuk Kuiper pada 1 Januari 2019."
    }
   ],
   "moonList": [
    {
     "name": "Charon",
     "radius_km": 606,
     "distance_km": 19600,
     "period_days": 6.387222,
     "discovered": 1978,
     "discoverer": "J.W. Christy",
     "retrograde": false,
     "note": "Bulan terbesar Pluto, berdiameter sekitar 1.200 km atau kira-kira setengah Pluto; ditemukan James Christy dan Robert Harrington pada 1978."
    }
   ],
   "image": {
    "src": "img/pluto.jpg",
    "title": "Pluto dari wahana New Horizons pada 2015",
    "credit": "NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute",
    "source_page": "https://science.nasa.gov/photojournal/pluto-in-true-color/"
   }
  },
  {
   "id": "haumea",
   "name": "Haumea",
   "parent": "sun",
   "type": "dwarf",
   "diameter_km": 1740,
   "mass_1e24_kg": 0.004006,
   "density_kg_m3": null,
   "gravity_m_s2": null,
   "escape_velocity_km_s": null,
   "rotation_period_h": 3.9154,
   "day_length_h": null,
   "distance_million_km": 6441.73,
   "perihelion_million_km": 5189.18,
   "aphelion_million_km": 7694.28,
   "orbital_period_days": 103208.1,
   "orbital_velocity_km_s": null,
   "orbital_inclination_deg": 28.208,
   "orbital_eccentricity": 0.1944,
   "axial_tilt_deg": null,
   "mean_temperature_c": null,
   "surface_pressure_bar": null,
   "moons": 2,
   "moons_as_of": "2026-10-14",
   "rings": true,
   "magnetic_field": "unknown",
   "category": "Planet kerdil",
   "color": "#d8d4cf",
   "orbit": null,
   "tagline": "Planet kerdil lonjong yang berotasi sekitar 4 jam sekali dan memiliki cincin",
   "summary": "Haumea adalah planet kerdil di Sabuk Kuiper, sekitar 43 satuan astronomi (SA) dari Matahari. Rotasinya sangat cepat, sekali dalam sekitar 4 jam, sehingga bentuknya lonjong seperti bola rugbi. Haumea adalah benda Sabuk Kuiper pertama yang diketahui memiliki cincin.",
   "description": [
    "Haumea beredar di Sabuk Kuiper dengan jarak rata-rata sekitar 43 satuan astronomi (SA) dari Matahari, dan satu putarannya mengelilingi Matahari butuh lebih dari 280 tahun. Rotasinya hanya sekitar 4 jam, salah satu yang tercepat di antara benda besar di tata surya. Putaran secepat itu membuat bentuk Haumea memanjang seperti bola rugbi. Pengamatan okultasi pada 2017, yaitu saat Haumea melintas di depan sebuah bintang, menunjukkan sumbu terpanjangnya sedikitnya 2.322 km.",
    "Dua tim mengklaim penemuan Haumea berdasarkan pengamatan tahun 2003 dan 2004. Daftar tata nama planet milik Persatuan Astronomi Internasional (IAU) mencatat lokasi penemuannya di Observatorium Sierra Nevada, Spanyol, pada 7 Maret 2003, tanpa mencantumkan penemu resmi. Benda ini mula-mula bernama sementara 2003 EL61, dan salah satu tim penemu menjulukinya Santa. Pada 17 September 2008, IAU menetapkannya sebagai planet kerdil kelima dan menamainya Haumea, dewi kesuburan dan kelahiran dalam mitologi Hawaii.",
    "Haumea diduga tersusun dari batuan yang dilapisi es, dan es air kristalin terdeteksi di lebih dari separuh permukaannya. Pengamatan okultasi 2017 juga menemukan cincin selebar sekitar 70 km yang mengelilingi Haumea. Hi'iaka dan Namaka, bulan-bulan Haumea, sama-sama ditemukan pada 2005. Para ilmuwan menduga tabrakan besar miliaran tahun lalu membuat Haumea berputar cepat dan menghasilkan bulan-bulannya."
   ],
   "facts": [
    "Pengamatan okultasi pada 2017 tidak menemukan atmosfer global di Haumea.",
    "Cincin Haumea berjari-jari sekitar 2.287 km, dan partikelnya mengorbit kira-kira sekali setiap Haumea berotasi tiga kali.",
    "Hi'iaka dan Namaka dinamai menurut putri-putri Haumea dalam mitologi Hawaii.",
    "Orbit Hi'iaka dan Namaka dipakai untuk menghitung massa Haumea.",
    "Pada jarak rata-ratanya, cahaya Matahari butuh sekitar 6 jam untuk mencapai Haumea."
   ],
   "composition": "Diduga batuan yang dilapisi es; es air kristalin terdeteksi di lebih dari separuh permukaannya.",
   "missions": [],
   "moonList": [
    {
     "name": "Hi'iaka",
     "radius_km": null,
     "distance_km": null,
     "period_days": null,
     "discovered": null,
     "discoverer": null,
     "retrograde": false,
     "note": "Bulan Haumea yang lebih terang daripada Namaka dan beredar lebih jauh dari Haumea, ditemukan pada 2005; namanya diambil dari dewi pelindung Pulau Hawaii dan para penari hula."
    },
    {
     "name": "Namaka",
     "radius_km": null,
     "distance_km": null,
     "period_days": null,
     "discovered": null,
     "discoverer": null,
     "retrograde": false,
     "note": "Bulan Haumea yang lebih redup daripada Hi'iaka dan beredar lebih dekat ke Haumea, ditemukan pada 2005; namanya diambil dari roh air dalam mitologi Hawaii."
    }
   ],
   "image": null
  },
  {
   "id": "makemake",
   "name": "Makemake",
   "parent": "sun",
   "type": "dwarf",
   "diameter_km": 1430,
   "mass_1e24_kg": null,
   "density_kg_m3": null,
   "gravity_m_s2": null,
   "escape_velocity_km_s": null,
   "rotation_period_h": 22.8266,
   "day_length_h": null,
   "distance_million_km": 6817.31,
   "perihelion_million_km": 5734.12,
   "aphelion_million_km": 7900.51,
   "orbital_period_days": 112364.8,
   "orbital_velocity_km_s": null,
   "orbital_inclination_deg": 29.028,
   "orbital_eccentricity": 0.1589,
   "axial_tilt_deg": null,
   "mean_temperature_c": null,
   "surface_pressure_bar": null,
   "moons": 1,
   "moons_as_of": "2026-10-14",
   "rings": false,
   "magnetic_field": "unknown",
   "category": "Planet kerdil",
   "color": "#c99a7a",
   "orbit": null,
   "tagline": "Planet kerdil kemerahan, benda paling terang kedua di Sabuk Kuiper setelah Pluto",
   "summary": "Makemake adalah planet kerdil di Sabuk Kuiper dengan diameter sekitar 1.430 km. Dilihat dari Bumi, Makemake adalah benda paling terang kedua di Sabuk Kuiper setelah Pluto. Permukaannya cokelat kemerahan dan mengandung es metana serta etana.",
   "description": [
    "Makemake pertama kali teramati pada Maret 2005 oleh Mike Brown, Chad Trujillo, dan David Rabinowitz di Observatorium Palomar, California. Tim penemu menjulukinya Easterbunny karena benda ini ditemukan beberapa hari setelah Paskah, dan nama sementaranya 2005 FY9. Bersama Eris, penemuan Makemake mendorong Persatuan Astronomi Internasional (IAU) meninjau ulang definisi planet dan membentuk golongan planet kerdil. Pada Juli 2008, IAU menetapkannya sebagai planet kerdil keempat dan menamainya Makemake, dewa kesuburan dalam kepercayaan masyarakat Rapa Nui di Pulau Paskah.",
    "Makemake beredar di Sabuk Kuiper dengan jarak rata-rata sekitar 46 satuan astronomi (SA) dari Matahari, dan satu putarannya mengelilingi Matahari butuh lebih dari 300 tahun. Jari-jarinya sekitar 715 km, kira-kira sepersembilan jari-jari Bumi. Satu hari di Makemake kira-kira sama panjangnya dengan sehari di Bumi. Permukaannya berwarna cokelat kemerahan seperti Pluto, dengan metana dan etana beku. Butiran metana beku selebar sekitar 1 cm mungkin tersebar di permukaannya.",
    "Pada April 2015, Teleskop Antariksa Hubble memotret bulan kecil yang gelap di dekat Makemake, dan penemuannya diumumkan pada 2016. Bulan itu bernama sementara S/2015 (136472) 1 dan dijuluki MK2. Pada 2025, tim yang dipimpin Southwest Research Institute melaporkan gas metana di Makemake dari data Teleskop Antariksa James Webb. Gas itu bisa berasal dari atmosfer yang sangat tipis atau dari semburan sesaat, dan para peneliti memerlukan pengamatan lanjutan untuk memastikannya."
   ],
   "facts": [
    "Makemake adalah benda trans-Neptunus kedua setelah Pluto yang terbukti memiliki gas.",
    "MK2 lebih dari 1.300 kali lebih redup daripada Makemake dan teramati pada jarak sekitar 21.000 km dari planet kerdil itu.",
    "Makemake mungkin membentuk atmosfer nitrogen yang sangat tipis ketika berada di titik terdekatnya dengan Matahari.",
    "Pada jarak rata-ratanya, cahaya Matahari butuh sekitar 6 jam 20 menit untuk mencapai Makemake.",
    "Rasio deuterium terhadap hidrogen pada metana di permukaan Makemake, yang diukur Teleskop Antariksa James Webb, menunjukkan metana itu kemungkinan terbentuk di bagian dalam yang hangat."
   ],
   "composition": "Permukaan cokelat kemerahan dengan es metana dan etana; Teleskop Antariksa James Webb mendeteksi gas metana yang mungkin berasal dari atmosfer sangat tipis atau semburan.",
   "missions": [],
   "moonList": [
    {
     "name": "S/2015 (136472) 1",
     "radius_km": null,
     "distance_km": null,
     "period_days": null,
     "discovered": null,
     "discoverer": null,
     "retrograde": false,
     "note": "Bulan kecil dan gelap yang dijuluki MK2, terlihat oleh Hubble pada April 2015; jari-jarinya diperkirakan sekitar 80 km dan belum punya nama resmi."
    }
   ],
   "image": null
  },
  {
   "id": "eris",
   "name": "Eris",
   "parent": "sun",
   "type": "dwarf",
   "diameter_km": 2326,
   "mass_1e24_kg": 0.016466,
   "density_kg_m3": 2430,
   "gravity_m_s2": 0.81,
   "escape_velocity_km_s": 1.37,
   "rotation_period_h": 378.5,
   "day_length_h": null,
   "distance_million_km": 10162.77,
   "perihelion_million_km": 5709.05,
   "aphelion_million_km": 14616.49,
   "orbital_period_days": 204516.7,
   "orbital_velocity_km_s": null,
   "orbital_inclination_deg": 43.926,
   "orbital_eccentricity": 0.4382,
   "axial_tilt_deg": null,
   "mean_temperature_c": null,
   "surface_pressure_bar": null,
   "moons": 1,
   "moons_as_of": "2026-10-14",
   "rings": false,
   "magnetic_field": "unknown",
   "category": "Planet kerdil",
   "color": "#e3e1dc",
   "orbit": null,
   "tagline": "Planet kerdil paling masif yang diketahui, pemicu perdebatan definisi planet",
   "summary": "Eris adalah planet kerdil di piringan tersebar, bagian terluar Sabuk Kuiper, dengan jarak rata-rata sekitar 68 satuan astronomi (SA) dari Matahari. Ukurannya hampir sama dengan Pluto, tetapi massanya sekitar 27% lebih besar. Penemuannya pada 2005 ikut memicu lahirnya definisi planet yang baru pada 2006.",
   "description": [
    "Eris ditemukan pada 5 Januari 2005 dari citra yang diambil pada 21 Oktober 2003 di Observatorium Palomar oleh Mike Brown, Chad Trujillo, dan David Rabinowitz. Nama sementaranya 2003 UB313, dan tim penemu menjulukinya Xena. Penemuan benda seukuran Pluto ini memicu perdebatan tentang definisi planet. Pada Agustus 2006, Persatuan Astronomi Internasional (IAU) menggolongkan Pluto, Ceres, dan benda baru ini sebagai planet kerdil. Sebulan kemudian, benda itu dinamai Eris, dewi perselisihan dalam mitologi Yunani.",
    "Orbit Eris sangat lonjong dan miring sekitar 44 derajat terhadap bidang orbit Bumi. Jarak rata-ratanya ke Matahari sekitar 68 satuan astronomi (SA), tetapi jarak sebenarnya berubah dari sekitar 38 SA sampai hampir 98 SA. Satu kali mengelilingi Matahari butuh sekitar 560 tahun, dan pada jarak rata-ratanya cahaya Matahari butuh lebih dari sembilan jam untuk mencapai Eris. Eris adalah anggota terbesar yang diketahui dari piringan tersebar, wilayah di luar bagian utama Sabuk Kuiper yang berisi benda-benda yang terlempar ke orbit lonjong oleh gravitasi Neptunus.",
    "Pengamatan saat Eris melintas di depan sebuah bintang pada November 2010 menunjukkan diameternya sekitar 2.330 km, sedikit lebih kecil daripada Pluto. Albedo atau daya pantul permukaannya sekitar 0,96, salah satu yang tertinggi di tata surya. Permukaan yang sangat terang ini mungkin berasal dari atmosfer yang membeku dan jatuh sebagai salju ketika Eris jauh dari Matahari. Data Teleskop Antariksa James Webb memperlihatkan permukaan yang kaya es metana, dengan tanda-tanda es nitrogen.",
    "Dysnomia, bulan Eris yang ditemukan pada 2005, mengorbit sekali dalam sekitar 16 hari. Dari gerak Dysnomia, para astronom menghitung massa Eris sekitar 27% lebih besar daripada massa Pluto. Perkiraan lama menyebut satu hari di Eris sekitar 26 jam, tetapi pengamatan yang terbit pada 2023 menunjukkan Eris berotasi sekali dalam sekitar 15,8 hari, sama dengan waktu edar Dysnomia."
   ],
   "facts": [
    "Massa jenis rata-rata Eris sekitar 2.430 kg/m³, kira-kira 2,4 kali massa jenis air.",
    "Pengamatan okultasi pada 2010 tidak menemukan atmosfer global di Eris; kalaupun ada, tekanannya kurang dari sekitar 1 nanobar.",
    "Nama bulan Eris, Dysnomia, diambil dari putri Eris dalam mitologi Yunani, dewi pelanggaran hukum.",
    "Eris baru akan mencapai titik terdekatnya dengan Matahari sekitar pertengahan abad ke-23.",
    "Rasio deuterium terhadap hidrogen pada metana di permukaan Eris, yang diukur Teleskop Antariksa James Webb, menunjukkan bagian dalamnya kemungkinan cukup hangat untuk membentuk metana."
   ],
   "composition": "Permukaan sangat terang yang kaya es metana, dengan tanda-tanda es nitrogen; massa jenis rata-ratanya sekitar 2.430 kg/m³.",
   "missions": [],
   "moonList": [
    {
     "name": "Dysnomia",
     "radius_km": 350,
     "distance_km": 37273,
     "period_days": 15.785899,
     "discovered": 2005,
     "discoverer": "M.E. Brown dkk.",
     "retrograde": false,
     "note": "Bulan Eris yang ditemukan pada 2005; orbitnya hampir melingkar dengan periode sekitar 16 hari, dan geraknya dipakai untuk menghitung massa Eris."
    }
   ],
   "image": null
  },
  {
   "id": "halley",
   "name": "Komet Halley",
   "parent": "sun",
   "type": "comet",
   "diameter_km": null,
   "mass_1e24_kg": null,
   "density_kg_m3": null,
   "gravity_m_s2": null,
   "escape_velocity_km_s": null,
   "rotation_period_h": null,
   "day_length_h": null,
   "distance_million_km": 2684.25,
   "perihelion_million_km": 87.83,
   "aphelion_million_km": 5280.66,
   "orbital_period_days": 27761,
   "orbital_velocity_km_s": null,
   "orbital_inclination_deg": 162.242,
   "orbital_eccentricity": 0.9673,
   "axial_tilt_deg": null,
   "mean_temperature_c": null,
   "surface_pressure_bar": null,
   "moons": null,
   "moons_as_of": null,
   "rings": null,
   "magnetic_field": null,
   "category": "Komet",
   "color": "#cfe3f2",
   "orbit": {
    "from_jd": null,
    "to_jd": null,
    "epoch_jd": 2446469.973616,
    "a_au": 17.94298778981276,
    "a_rate": 0.0,
    "e": 0.9672795046746536,
    "e_rate": 0.0,
    "i_deg": 162.2422258357997,
    "i_rate": 0.0,
    "L_deg": 236.5239486363787,
    "L_rate": 473.6441264718248,
    "peri_deg": 170.72546170191345,
    "peri_rate": 0.0,
    "node_deg": 58.85992200312693,
    "node_rate": 0.0,
    "segments": [
     {
      "from_jd": null,
      "to_jd": 2385047.7198,
      "epoch_jd": 2378496.5,
      "a_au": 18.04999777185908,
      "a_rate": 0.0,
      "e": 0.968661042630768,
      "e_rate": 0.0,
      "i_deg": 162.2908248146359,
      "i_rate": 0.0,
      "L_deg": 219.58873809991883,
      "L_rate": 469.4383541777292,
      "peri_deg": 169.36204728552966,
      "peri_rate": 0.0,
      "node_deg": 58.00896669800864,
      "node_rate": 0.0
     },
     {
      "from_jd": 2385047.7198,
      "to_jd": 2398379.2198,
      "epoch_jd": 2391598.9396,
      "a_au": 17.98987732054265,
      "a_rate": 0.0,
      "e": 0.9673947605116375,
      "e_rate": 0.0,
      "i_deg": 162.2587304770348,
      "i_rate": 0.0,
      "L_deg": 222.54605521879967,
      "L_rate": 471.79354634594023,
      "peri_deg": 168.22259627919655,
      "peri_rate": 0.0,
      "node_deg": 57.51837224915766,
      "node_rate": 0.0
     },
     {
      "from_jd": 2398379.2198,
      "to_jd": 2411970.58925,
      "epoch_jd": 2405159.5,
      "a_au": 17.69641865223537,
      "a_rate": 0.0,
      "e": 0.9673596340329981,
      "e_rate": 0.0,
      "i_deg": 162.2766177451767,
      "i_rate": 0.0,
      "L_deg": 243.73326710740162,
      "L_rate": 483.5776522348081,
      "peri_deg": 169.89822380801758,
      "peri_rate": 0.0,
      "node_deg": 58.35695763439687,
      "node_rate": 0.0
     },
     {
      "from_jd": 2411970.58925,
      "to_jd": 2425666.58925,
      "epoch_jd": 2418781.6785,
      "a_au": 17.9553231272158,
      "a_rate": 0.0,
      "e": 0.9672960467694861,
      "e_rate": 0.0,
      "i_deg": 162.2187983010267,
      "i_rate": 0.0,
      "L_deg": 234.72495423825478,
      "L_rate": 473.1561188355509,
      "peri_deg": 170.29877816758483,
      "peri_rate": 0.0,
      "node_deg": 58.56208352808085,
      "node_rate": 0.0
     },
     {
      "from_jd": 2425666.58925,
      "to_jd": 2439510.736808,
      "epoch_jd": 2432551.5,
      "a_au": 17.92298270078741,
      "a_rate": 0.0,
      "e": 0.9670316859881236,
      "e_rate": 0.0,
      "i_deg": 162.2976729760087,
      "i_rate": 0.0,
      "L_deg": 235.6853816031247,
      "L_rate": 474.4373484978289,
      "peri_deg": 169.6406559910932,
      "peri_rate": 0.0,
      "node_deg": 58.26827436192372,
      "node_rate": 0.0
     },
     {
      "from_jd": 2439510.736808,
      "to_jd": 2453390.236808,
      "epoch_jd": 2446469.973616,
      "a_au": 17.94298778981276,
      "a_rate": 0.0,
      "e": 0.9672795046746536,
      "e_rate": 0.0,
      "i_deg": 162.2422258357997,
      "i_rate": 0.0,
      "L_deg": 236.5239486363787,
      "L_rate": 473.6441264718248,
      "peri_deg": 170.72546170191345,
      "peri_rate": 0.0,
      "node_deg": 58.85992200312693,
      "node_rate": 0.0
     },
     {
      "from_jd": 2453390.236808,
      "to_jd": 2465241.5,
      "epoch_jd": 2460310.5,
      "a_au": 17.8647468781032,
      "a_rate": 0.0,
      "e": 0.9671963238103395,
      "e_rate": 0.0,
      "i_deg": 162.143294502328,
      "i_rate": 0.0,
      "L_deg": 238.05928362261582,
      "L_rate": 476.75910714234755,
      "peri_deg": 172.16864687720607,
      "peri_rate": 0.0,
      "node_deg": 59.63182258371236,
      "node_rate": 0.0
     },
     {
      "from_jd": 2465241.5,
      "to_jd": null,
      "epoch_jd": 2470172.5,
      "a_au": 17.89454887081282,
      "a_rate": 0.0,
      "e": 0.9677160275648616,
      "e_rate": 0.0,
      "i_deg": 162.2298509265422,
      "i_rate": 0.0,
      "L_deg": 238.04136608103042,
      "L_rate": 475.5685948116594,
      "peri_deg": 170.81764745005083,
      "peri_rate": 0.0,
      "node_deg": 58.93899665442182,
      "node_rate": 0.0
     }
    ]
   },
   "tagline": "Komet periodik paling terkenal, kembali ke dekat Matahari kira-kira setiap 76 tahun",
   "summary": "Komet Halley adalah komet berperiode pendek yang mendekati Matahari kira-kira setiap 76 tahun. Kunjungan terakhirnya pada 1986 disambut sejumlah wahana antariksa, dan perihelion berikutnya jatuh pada 28 Juli 2061. Debunya memicu hujan meteor Eta Aquariid setiap Mei dan Orionid setiap Oktober.",
   "description": [
    "Sebelum masa astronom Inggris Edmond Halley, komet dianggap hanya sekali melintas di tata surya. Pada 1705, Halley memakai teori gravitasi Isaac Newton untuk menghitung orbit sejumlah komet. Ia melihat kemiripan orbit komet terang yang tercatat pada 1531, 1607, dan 1682, lalu mengusulkan bahwa ketiganya adalah satu komet yang datang berulang kali. Ramalannya bahwa komet itu akan kembali pada 1758 terbukti benar, dan komet tersebut kemudian dinamai untuk menghormatinya. Kini catatan pengamatannya terlacak hingga lebih dari 2.000 tahun lalu, termasuk gambarnya pada Permadani Bayeux tentang Pertempuran Hastings tahun 1066.",
    "Inti Halley berbentuk seperti kacang tanah, panjangnya sekitar 15 km dan lebarnya sekitar 8 km. Permukaannya termasuk yang paling gelap di tata surya karena hanya memantulkan sekitar 3% cahaya yang mengenainya. Saat mendekati Matahari, es di intinya menguap dan menyemburkan gas serta debu yang membentuk koma dan ekor. Wahana Giotto mendapati bahwa sekitar 80% volume materi yang dilepaskan berupa uap air dan sekitar 10% berupa karbon monoksida. Setiap kali mengitari Matahari, komet sebesar Halley diperkirakan kehilangan lapisan permukaan setebal 1 sampai 3 meter.",
    "Orbit Halley sangat lonjong. Titik terdekatnya ke Matahari sekitar 0,6 satuan astronomi (SA), di dalam orbit Venus, sedangkan titik terjauhnya sekitar 35 SA, melewati orbit Neptunus. Arah geraknya mengelilingi Matahari berlawanan dengan arah gerak planet, sesuatu yang jarang dijumpai pada komet berperiode pendek. Periodenya rata-rata 76 tahun, tetapi berubah dari satu kunjungan ke kunjungan lain akibat tarikan gravitasi planet; dalam catatan sejarah, periodenya berkisar dari 74,42 sampai 79,25 tahun. Halley mencapai titik terjauhnya pada Desember 2023 dan sejak itu bergerak kembali menuju Matahari.",
    "Pada kunjungan 1986, Halley mencapai perihelion pada 9 Februari dan didatangi armada wahana antariksa, di antaranya Giotto milik ESA, Vega 1 dan Vega 2 milik Uni Soviet, serta Suisei dan Sakigake milik Jepang. Perihelion berikutnya jatuh pada 28 Juli 2061. Sambil menunggu, kita bisa menyaksikan serpihan debunya sebagai hujan meteor. Eta Aquariid memuncak pada awal Mei dan paling baik diamati dari belahan Bumi selatan, sedangkan Orionid memuncak pada pertengahan Oktober dan terlihat dari kedua belahan Bumi setelah tengah malam."
   ],
   "facts": [
    "Nama resmi komet ini adalah 1P/Halley; huruf P menandakan komet periodik, yaitu komet dengan periode orbit kurang dari 200 tahun.",
    "Halley adalah komet periodik pertama yang dikenali dalam sejarah.",
    "Pada perihelion 9 Februari 1986, Halley melaju sekitar 54,6 km per detik.",
    "Pada kunjungan 1986, jarak terdekat Halley ke Bumi sekitar 62 juta km (0,42 SA).",
    "Pendekatan terdekat Halley ke Bumi yang tercatat terjadi pada 10 April 837, pada jarak sekitar 5 juta km.",
    "Halley sudah berada di orbitnya yang sekarang setidaknya selama 16.000 tahun."
   ],
   "composition": "Inti berupa campuran es dan debu yang sangat gelap; gas yang dilepaskannya sekitar 80% uap air dan 10% karbon monoksida (berdasarkan volume), ditambah karbon dioksida, metana, dan amonia.",
   "missions": [
    {
     "name": "Giotto",
     "agency": "ESA",
     "years": "1985-1992",
     "note": "Misi antariksa jauh pertama Eropa; pada Maret 1986 melintas sekitar 600 km dari inti Halley dan mengirim sekitar 2.000 citra."
    },
    {
     "name": "Vega 1",
     "agency": "Uni Soviet",
     "years": "1984-1986",
     "note": "Setelah menjatuhkan pendarat dan balon di Venus pada Juni 1985, wahana ini melintas sekitar 8.890 km dari inti Halley pada 6 Maret 1986."
    },
    {
     "name": "Vega 2",
     "agency": "Uni Soviet",
     "years": "1984-1986",
     "note": "Melintas sekitar 8.030 km dari inti Halley pada 9 Maret 1986, tiga hari setelah Vega 1."
    }
   ],
   "moonList": [],
   "image": {
    "src": "img/halley.jpg",
    "title": "Komet Halley pada 8 Maret 1986, dipotret W. Liller dari Pulau Paskah",
    "credit": "W. Liller, International Halley Watch Large Scale Phenomena Network; NASA/NSSDCA",
    "source_page": "https://nssdc.gsfc.nasa.gov/photo_gallery/photogallery-comets.html#halley"
   }
  }
 ],
 "regions": [
  {
   "id": "asteroid-belt",
   "name": "Sabuk asteroid",
   "tagline": "Wilayah bebatuan sisa pembentukan tata surya di antara orbit Mars dan Jupiter",
   "summary": "Sabuk asteroid adalah wilayah di antara orbit Mars dan Jupiter, sekitar 2,0 sampai 3,2 satuan astronomi (SA) dari Matahari, tempat sebagian besar asteroid beredar. Benda terbesarnya adalah planet kerdil Ceres. Massa seluruh asteroid digabung masih lebih kecil daripada massa Bulan.",
   "description": [
    "Sebagian besar asteroid di tata surya beredar di sabuk asteroid, wilayah antara orbit Mars dan Jupiter yang berjarak sekitar 2,0 sampai 3,2 satuan astronomi (SA) dari Matahari. Asteroid adalah sisa bahan berbatu dari masa pembentukan tata surya sekitar 4,6 miliar tahun lalu. Gravitasi Jupiter yang baru terbentuk menghentikan pembentukan planet di wilayah ini dan membuat benda-benda kecilnya saling bertabrakan hingga pecah. Sabuk ini diperkirakan berisi 1,1 sampai 1,9 juta asteroid yang lebarnya lebih dari 1 km, ditambah jutaan asteroid yang lebih kecil.",
    "Benda terbesar di sabuk ini adalah planet kerdil Ceres, yang menyumbang sekitar 25% massa seluruh sabuk. Asteroid terbesar adalah Vesta, dengan diameter sekitar 530 km, sekaligus benda paling masif kedua di sabuk ini setelah Ceres. Walaupun jumlahnya sangat banyak, total massa semua asteroid masih lebih kecil daripada massa Bulan. Pioneer 10 menjadi wahana pertama yang melintasi sabuk ini, dalam perjalanannya menuju Jupiter.",
    "Galileo milik NASA menjadi wahana pertama yang terbang lintas dekat sebuah asteroid, yaitu Gaspra pada 1991. Dawn kemudian mengorbit Vesta pada 2011 sampai 2012, lalu Ceres sejak 2015 sampai misinya berakhir pada 2018. Pada 2023 dan April 2025, wahana Lucy melintas dekat asteroid Dinkinesh dan Donaldjohanson dalam perjalanan menuju asteroid Troya Jupiter. Psyche memanfaatkan gravitasi Mars pada Mei 2026 dan dijadwalkan tiba di asteroid kaya logam Psyche pada Agustus 2029."
   ],
   "facts": [
    "Ceres, benda terbesar di sabuk asteroid, ditemukan Giuseppe Piazzi pada 1801 dan sejak 2006 digolongkan sebagai planet kerdil.",
    "Asteroid jenis C, yang gelap dan diduga tersusun dari lempung serta batuan silikat, adalah jenis yang paling umum.",
    "Asteroid jenis M tersusun dari logam, terutama nikel dan besi.",
    "Di jarak-jarak tertentu terdapat celah yang hampir kosong, disebut celah Kirkwood, karena tarikan gravitasi Jupiter yang berulang membuat orbit asteroid di sana tidak stabil.",
    "Citra asteroid Ida yang diambil wahana Galileo pada 1993 memperlihatkan Dactyl, bulan asteroid pertama yang ditemukan."
   ]
  },
  {
   "id": "kuiper-belt",
   "name": "Sabuk Kuiper",
   "tagline": "Wilayah benda es di luar orbit Neptunus, tempat Pluto dan planet kerdil lain beredar",
   "summary": "Sabuk Kuiper adalah wilayah berbentuk seperti donat tebal di luar orbit Neptunus, sekitar 30 sampai 50 satuan astronomi (SA) dari Matahari. Isinya benda-benda es sisa pembentukan tata surya, termasuk planet kerdil Pluto, Haumea, dan Makemake.",
   "description": [
    "Sabuk Kuiper dimulai di sekitar orbit Neptunus, kira-kira 30 satuan astronomi (SA) dari Matahari, dan bagian utamanya berakhir sekitar 50 SA. Bentuknya lebih mirip donat tebal daripada sabuk tipis. Bagian luarnya tumpang tindih dengan piringan tersebar yang menjangkau hampir 1.000 SA, tempat orbit benda-bendanya lebih lonjong dan miring. Para astronom memperkirakan ada ratusan ribu benda di wilayah ini yang lebarnya lebih dari 100 km, tetapi total massanya diperkirakan tidak lebih dari sekitar 10% massa Bumi.",
    "Nama sabuk ini diambil dari astronom Gerard Kuiper, yang pada 1951 menerbitkan makalah tentang kemungkinan adanya benda di luar Pluto. Kenneth Edgeworth juga membahas benda di luar Pluto dalam makalahnya pada 1940-an, sehingga wilayah ini kadang disebut Sabuk Edgeworth-Kuiper. Pluto, yang ditemukan pada 1930, adalah benda Sabuk Kuiper pertama yang dikenal. Setelah Pluto dan bulannya, Charon, benda Sabuk Kuiper berikutnya baru ditemukan pada 1992, yaitu 1992 QB1 (kini bernama Albion), oleh David Jewitt dan Jane Luu.",
    "Benda-benda Sabuk Kuiper tersusun dari batuan, es air, dan senyawa beku lain seperti amonia dan metana. Wilayah ini diduga berisi sisa bahan yang gagal bergabung menjadi planet karena gravitasi Neptunus terus mengaduknya. Sebagian benda terkunci dalam resonansi dengan Neptunus; Pluto, misalnya, mengelilingi Matahari dua kali setiap Neptunus mengelilinginya tiga kali. New Horizons melintasi Pluto pada 2015 dan Arrokoth pada 1 Januari 2019, benda terjauh yang pernah dijelajahi wahana antariksa dari dekat."
   ],
   "facts": [
    "Komet berperiode pendek, yaitu komet yang mengelilingi Matahari dalam waktu kurang dari 200 tahun, umumnya berasal dari Sabuk Kuiper.",
    "Benda yang orbitnya beresonansi 3:2 dengan Neptunus, seperti Pluto, disebut plutino.",
    "Pada benda klasik dingin, kata dingin merujuk pada orbitnya yang hampir melingkar, tidak banyak miring, dan jarang terganggu Neptunus.",
    "Sedna termasuk benda terlepas, yaitu benda yang orbitnya tidak pernah lebih dekat dari sekitar 40 SA ke Matahari; jarak terdekat Sedna ke Matahari sekitar 76 SA.",
    "Arrokoth, yang dilintasi New Horizons dari jarak sekitar 3.500 km, terdiri atas dua bongkah yang menempel sehingga mirip manusia salju merah yang agak pipih."
   ]
  },
  {
   "id": "oort-cloud",
   "name": "Awan Oort",
   "tagline": "Cangkang raksasa berisi benda es di tepi tata surya, asal komet berperiode panjang",
   "summary": "Awan Oort adalah kumpulan benda es yang diduga menyelubungi tata surya seperti cangkang tebal, jauh di luar Sabuk Kuiper. Tepi dalamnya diperkirakan 2.000 sampai 5.000 satuan astronomi (SA) dari Matahari. Awan ini terlalu jauh untuk dipotret langsung, tetapi keberadaannya menjelaskan asal komet berperiode panjang.",
   "description": [
    "Pada 1950, astronom Belanda Jan Oort mengusulkan bahwa sebagian komet berasal dari cangkang raksasa berisi benda es yang mengelilingi tata surya. Gagasan itu menjelaskan mengapa komet berperiode panjang datang dari segala arah di langit. Benda-benda di Awan Oort tidak beredar dalam satu bidang yang sama; orbitnya bisa miring ke segala arah, sehingga wilayah ini disebut awan. Jumlahnya mungkin mencapai ratusan miliar sampai triliunan benda.",
    "Tepi dalam Awan Oort diperkirakan berada 2.000 sampai 5.000 satuan astronomi (SA) dari Matahari, sedangkan tepi luarnya antara 10.000 dan 100.000 SA. Awan Oort mungkin membentang seperempat sampai separuh jalan menuju bintang terdekat. Dengan kecepatannya sekarang, Voyager 1 baru akan memasuki Awan Oort sekitar 300 tahun lagi dan mungkin butuh sekitar 30.000 tahun untuk keluar dari tepi luarnya.",
    "Menurut gagasan yang paling banyak diterima, benda-benda Awan Oort terbentuk lebih dekat ke Matahari bersama planet-planet sekitar 4,6 miliar tahun lalu. Gravitasi planet, terutama Jupiter, melontarkan sebagian di antaranya ke orbit yang sangat jauh. Gaya pasang surut galaksi Bima Sakti kemudian diduga membuat mereka menetap di pinggiran tata surya, jauh dari pengaruh planet. Sesekali gangguan gravitasi membuat salah satu benda jatuh ke arah Matahari dan menjadi komet."
   ],
   "facts": [
    "Komet berperiode panjang, yaitu komet yang butuh lebih dari 200 tahun untuk sekali mengelilingi Matahari, diduga berasal dari Awan Oort.",
    "Dari Awan Oort, Matahari hanya akan tampak seperti bintang yang sangat terang.",
    "Komet C/2013 A1 (Siding Spring), yang melintas sangat dekat dengan Mars pada 2014, diperkirakan baru kembali sekitar 740.000 tahun lagi.",
    "Cahaya Matahari diperkirakan butuh sampai sekitar satu setengah tahun untuk melewati tepi luar Awan Oort.",
    "Awan Oort mungkin juga menangkap benda yang terbentuk di luar tata surya."
   ]
  },
  {
   "id": "heliosphere",
   "name": "Heliosfer",
   "tagline": "Gelembung raksasa yang dibentuk angin Matahari di sekeliling tata surya",
   "summary": "Heliosfer adalah gelembung raksasa yang terbentuk karena angin Matahari mendesak materi antarbintang. Gelembung ini menyelubungi semua planet dan menahan sebagian sinar kosmik dari galaksi. Voyager 1 keluar dari heliosfer pada 2012, disusul Voyager 2 pada 2018.",
   "description": [
    "Matahari terus melepaskan aliran partikel bermuatan yang disebut angin Matahari, dengan kecepatan umumnya sekitar 400 km per detik. Aliran ini melaju melewati semua planet dan membentuk gelembung raksasa bernama heliosfer, yang menjangkau kira-kira tiga kali jarak Pluto sebelum tertahan oleh materi antarbintang. Heliosfer adalah perisai yang melindungi planet-planet dari sebagian sinar kosmik galaksi. Bumi masih punya perisai tambahan berupa magnetosfer, sedangkan Mars dan Venus tidak memiliki medan magnet pelindung seperti itu.",
    "Batas pertama heliosfer adalah kejut terminasi (termination shock), tempat angin Matahari melambat tiba-tiba dari kecepatan supersonik menjadi subsonik. Lapisan di luarnya, heliosheath, masih dikuasai angin dan medan magnet Matahari. Tepi terluarnya disebut heliopause, dan di baliknya terbentang ruang antarbintang. Voyager 1 melewati kejut terminasi pada Desember 2004 di jarak 94 satuan astronomi (SA) dan menembus heliopause pada 25 Agustus 2012 di jarak sekitar 122 SA. Voyager 2 melewati kejut terminasi pada Agustus 2007 di jarak 84 SA dan menembus heliopause pada 5 November 2018.",
    "Bentuk heliosfer masih diteliti karena baru Voyager 1 dan Voyager 2 yang pernah melintasi batas-batasnya. Satelit IBEX milik NASA, yang diluncurkan pada Oktober 2008, memetakan batas heliosfer dari dekat Bumi dengan menangkap atom netral berenergi yang datang dari sana. Misi IMAP diluncurkan pada 24 September 2025 dan tiba di orbitnya di sekitar titik Lagrange L1, sekitar 1,5 juta km dari Bumi ke arah Matahari, pada 10 Januari 2026. Misi sains utamanya, yang direncanakan berlangsung dua tahun, dimulai pada 1 Februari 2026 untuk memetakan batas heliosfer dengan lebih rinci."
   ],
   "facts": [
    "Cahaya Matahari butuh sekitar 17 jam untuk mencapai heliopause.",
    "Di kejut terminasi, medan magnet Matahari juga menguat dan berubah arah.",
    "Pada 2009, IBEX menemukan pita terang atom netral berenergi yang melintang di langit, dan asal-usulnya masih diteliti.",
    "Model yang diterbitkan pada 2020 oleh tim Merav Opher mengusulkan bentuk heliosfer seperti croissant kempis, berbeda dari gambaran lama berupa bola dengan ekor panjang seperti komet.",
    "Menurut data orbit dari JPL NASA, Voyager 1 akan menjadi benda buatan manusia pertama yang berjarak satu hari cahaya dari Bumi, sekitar 25,9 miliar km, pada 19 November 2026."
   ]
  }
 ],
 "glossary": [
  {
   "term": "Angin Matahari",
   "definition": "Angin Matahari (disebut juga angin surya) adalah aliran partikel bermuatan listrik, terutama proton dan elektron, yang terus keluar dari korona Matahari dengan kecepatan rata-rata sekitar 400 km per detik. Aliran ini, bersama medan magnet Matahari, membentuk heliosfer dan ikut mendorong ekor komet menjauhi Matahari. Sebagian partikelnya terperangkap medan magnet Bumi, lalu masuk ke atmosfer atas dan memicu aurora.",
   "see": [
    "heliosfer",
    "komet"
   ],
   "slug": "angin-matahari"
  },
  {
   "term": "Aphelion",
   "definition": "Aphelion adalah titik pada orbit planet, komet, atau benda lain yang paling jauh dari Matahari. Bumi mencapai aphelion setiap awal Juli pada jarak sekitar 152 juta km, saat belahan Bumi utara sedang mengalami musim panas.",
   "see": [
    "perihelion",
    "eksentrisitas",
    "kemiringan-sumbu"
   ],
   "slug": "aphelion"
  },
  {
   "term": "Asteroid",
   "definition": "Asteroid adalah benda berbatu tanpa atmosfer yang mengorbit Matahari, berukuran lebih dari sekitar 1 meter tetapi jauh lebih kecil daripada planet. Sebagian besar asteroid, yang merupakan sisa pembentukan tata surya, beredar di sabuk asteroid antara Mars dan Jupiter. Asteroid terbesar adalah Vesta dengan diameter sekitar 530 km, sedangkan Ceres yang lebih besar kini digolongkan sebagai planet kerdil.",
   "see": [
    "sabuk-asteroid",
    "meteoroid",
    "planet-kerdil"
   ],
   "slug": "asteroid"
  },
  {
   "term": "Awan Oort",
   "definition": "Awan Oort adalah cangkang bulat raksasa berisi benda-benda es yang diperkirakan menyelimuti tata surya, jauh di luar Sabuk Kuiper. Tepi dalamnya diperkirakan berjarak 2.000 sampai 5.000 SA dari Matahari, sedangkan tepi luarnya 10.000 sampai 100.000 SA. Jan Oort mengusulkan keberadaannya pada 1950 untuk menjelaskan asal komet berperiode panjang, dan karena letaknya terlalu jauh, wilayah ini belum pernah dipotret secara langsung.",
   "see": [
    "komet",
    "sabuk-kuiper",
    "tata-surya"
   ],
   "slug": "awan-oort"
  },
  {
   "term": "Berat",
   "definition": "Berat adalah gaya tarik gravitasi yang bekerja pada sebuah benda, diukur dalam newton (N). Berbeda dengan massa, berat bergantung pada tempat: benda bermassa 60 kg memiliki berat sekitar 590 N di Bumi, tetapi hanya sekitar 97 N di Bulan. Berat badan yang sehari-hari disebut dalam kilogram sebenarnya adalah massa.",
   "see": [
    "massa",
    "gravitasi"
   ],
   "slug": "berat"
  },
  {
   "term": "Bintik Matahari",
   "definition": "Bintik Matahari adalah daerah gelap di fotosfer, lapisan yang tampak sebagai permukaan Matahari, yang terbentuk karena garis-garis medan magnet terpusat di sana. Suhunya sekitar 3.300 °C, lebih dingin daripada fotosfer di sekitarnya yang sekitar 5.500 °C, sehingga tampak gelap. Jumlah bintik Matahari naik turun mengikuti siklus Matahari yang lamanya sekitar 11 tahun.",
   "see": [
    "angin-matahari",
    "fusi-nuklir"
   ],
   "slug": "bintik-matahari"
  },
  {
   "term": "Ekliptika",
   "definition": "Ekliptika adalah lintasan semu tahunan Matahari di langit dengan latar bintang-bintang, dan bidangnya sama dengan bidang orbit Bumi. Orbit planet-planet hampir sebidang, sehingga planet dan Bulan selalu tampak tidak jauh dari garis ini. Nama ekliptika merujuk pada gerhana, karena gerhana hanya dapat terjadi ketika Bulan berada di dekat lintasan tersebut.",
   "see": [
    "inklinasi-orbit",
    "orbit",
    "gerhana-matahari"
   ],
   "slug": "ekliptika"
  },
  {
   "term": "Eksentrisitas",
   "definition": "Eksentrisitas adalah ukuran seberapa lonjong sebuah orbit: nilai 0 berarti lingkaran sempurna, dan makin mendekati 1, makin lonjong elipsnya. Orbit Bumi hampir bulat dengan eksentrisitas sekitar 0,017, sedangkan Merkurius memiliki eksentrisitas terbesar di antara planet, sekitar 0,21.",
   "see": [
    "orbit",
    "perihelion",
    "aphelion",
    "hukum-kepler"
   ],
   "slug": "eksentrisitas"
  },
  {
   "term": "Elongasi",
   "definition": "Elongasi adalah jarak sudut antara sebuah benda langit dan Matahari jika dilihat dari Bumi. Elongasi Merkurius paling besar sekitar 28 derajat dan Venus sekitar 47 derajat, sehingga di langit malam keduanya hanya terlihat tidak lama setelah Matahari terbenam atau sebelum Matahari terbit. Dalam penentuan awal bulan Hijriah, elongasi Bulan menjadi salah satu syarat hilal dapat teramati.",
   "see": [
    "planet-inferior",
    "konjungsi",
    "hilal"
   ],
   "slug": "elongasi"
  },
  {
   "term": "Fase Bulan",
   "definition": "Fase Bulan adalah perubahan bentuk bagian Bulan yang tampak terang dari Bumi, dari Bulan baru, sabit, kuartal, cembung, sampai purnama, lalu kembali lagi. Separuh Bulan selalu disinari Matahari, dan bagian terang yang terlihat dari Bumi berubah karena Bulan beredar mengelilingi Bumi. Satu siklus fase, dari Bulan baru ke Bulan baru berikutnya, berlangsung sekitar 29,5 hari.",
   "see": [
    "periode-sinodis",
    "hilal",
    "gerhana-bulan"
   ],
   "slug": "fase-bulan"
  },
  {
   "term": "Fusi nuklir",
   "definition": "Fusi nuklir adalah reaksi ketika inti-inti atom ringan bergabung menjadi inti yang lebih berat sambil melepaskan energi yang sangat besar. Di inti Matahari, yang suhunya sekitar 15 juta °C, inti hidrogen bergabung membentuk helium. Energi dari reaksi ini akhirnya dipancarkan Matahari sebagai cahaya dan panas.",
   "see": [
    "bintik-matahari"
   ],
   "slug": "fusi-nuklir"
  },
  {
   "term": "Gerak retrograd",
   "definition": "Gerak retrograd adalah gerak yang arahnya berlawanan dengan arah gerak yang umum. Istilah ini dipakai untuk gerak semu planet yang untuk sementara tampak mundur ke arah barat terhadap bintang-bintang latar; pada Mars, gerak ini terlihat di sekitar oposisi karena Bumi yang bergerak lebih cepat sedang menyalip Mars. Istilah yang sama dipakai untuk rotasi atau orbit yang berlawanan arah dengan kebanyakan benda di tata surya, seperti rotasi Venus dan Uranus serta orbit Triton mengelilingi Neptunus.",
   "see": [
    "oposisi",
    "planet-superior",
    "rotasi"
   ],
   "slug": "gerak-retrograd"
  },
  {
   "term": "Gerhana Bulan",
   "definition": "Gerhana Bulan terjadi ketika Bumi berada tepat di antara Matahari dan Bulan sehingga Bulan masuk ke bayangan Bumi, dan karena itu hanya dapat terjadi saat purnama. Pada gerhana total, Bulan biasanya tampak merah atau jingga karena cahaya Matahari yang tersaring atmosfer Bumi masih sampai ke permukaannya. Semua jenis gerhana Bulan, baik total, sebagian, maupun penumbra, aman diamati dengan mata telanjang, tetapi gerhana penumbra sering sulit dikenali karena Bulan hanya sedikit meredup.",
   "see": [
    "gerhana-matahari",
    "fase-bulan",
    "inklinasi-orbit"
   ],
   "slug": "gerhana-bulan"
  },
  {
   "term": "Gerhana Matahari",
   "definition": "Gerhana Matahari terjadi ketika Bulan melintas di antara Matahari dan Bumi sehingga bayangan Bulan jatuh ke permukaan Bumi, dan karena itu hanya dapat terjadi saat Bulan baru. Bergantung pada jarak Bulan dan posisi pengamat, gerhana dapat berupa gerhana total, cincin, sebagian, atau hibrida. Kecuali pada fase total yang singkat, Matahari hanya aman dilihat dengan kacamata gerhana atau penyaring khusus, sedangkan kacamata hitam biasa tidak aman.",
   "see": [
    "gerhana-bulan",
    "fase-bulan",
    "inklinasi-orbit"
   ],
   "slug": "gerhana-matahari"
  },
  {
   "term": "Gravitasi",
   "definition": "Gravitasi adalah gaya tarik-menarik antara benda-benda yang bermassa. Gaya ini makin kuat jika massa benda makin besar dan makin lemah jika jarak antarbenda makin jauh. Gravitasi Matahari menahan planet-planet di orbitnya, sedangkan di permukaan Bumi gravitasi memberi percepatan sekitar 9,8 m/s² pada benda yang jatuh.",
   "see": [
    "massa",
    "berat",
    "kecepatan-lepas",
    "orbit"
   ],
   "slug": "gravitasi"
  },
  {
   "term": "Heliosfer",
   "definition": "Heliosfer adalah gelembung raksasa di sekitar Matahari yang terbentuk oleh medan magnet dan angin Matahari, dan membentang jauh melewati orbit planet-planet. Batas luarnya disebut heliopause. Voyager 1 melewati batas ini pada 25 Agustus 2012 di jarak sekitar 122 SA dari Matahari, disusul Voyager 2 pada 5 November 2018.",
   "see": [
    "angin-matahari",
    "satuan-astronomi-sa"
   ],
   "slug": "heliosfer"
  },
  {
   "term": "Hilal",
   "definition": "Hilal adalah Bulan sabit muda pertama setelah ijtimak (konjungsi Bulan dan Matahari), yang diamati di langit barat sesaat setelah Matahari terbenam. Kementerian Agama menetapkan awal bulan Hijriah, seperti Ramadan dan Syawal, dalam sidang isbat berdasarkan hisab (perhitungan astronomi) dan rukyat (pengamatan) hilal. Sejak 2022 Indonesia memakai kriteria MABIMS yang disepakati bersama Brunei Darussalam, Malaysia, dan Singapura: tinggi hilal minimal 3 derajat dan elongasi minimal 6,4 derajat.",
   "see": [
    "konjungsi",
    "elongasi",
    "fase-bulan"
   ],
   "slug": "hilal"
  },
  {
   "term": "Hujan meteor",
   "definition": "Hujan meteor adalah peristiwa ketika jumlah meteor yang terlihat per jam meningkat tajam, biasanya saat Bumi melintasi jejak debu yang ditinggalkan komet. Hujan meteor Perseid setiap Agustus berasal dari serpihan Komet Swift-Tuttle, sedangkan hujan meteor Eta Aquariid pada Mei dan Orionid pada Oktober berasal dari serpihan Komet Halley.",
   "see": [
    "meteor",
    "komet"
   ],
   "slug": "hujan-meteor"
  },
  {
   "term": "Hukum Kepler",
   "definition": "Hukum Kepler adalah tiga hukum gerak planet yang diterbitkan Johannes Kepler pada 1609 dan 1619. Hukum pertama menyatakan bahwa orbit planet berbentuk elips dengan Matahari di salah satu titik fokusnya, dan hukum kedua menyatakan bahwa garis yang menghubungkan planet dengan Matahari menyapu luas yang sama dalam selang waktu yang sama, sehingga planet bergerak lebih cepat ketika dekat dengan Matahari. Hukum ketiga menyatakan bahwa kuadrat periode orbit planet sebanding dengan pangkat tiga jarak rata-ratanya ke Matahari.",
   "see": [
    "orbit",
    "eksentrisitas",
    "perihelion"
   ],
   "slug": "hukum-kepler"
  },
  {
   "term": "Inklinasi orbit",
   "definition": "Inklinasi orbit adalah sudut kemiringan bidang orbit sebuah benda terhadap bidang acuan, biasanya ekliptika. Di antara planet, orbit Merkurius paling miring, sekitar 7 derajat, sedangkan orbit planet kerdil Pluto miring sekitar 17 derajat. Orbit Bulan miring sekitar 5 derajat terhadap ekliptika, sehingga gerhana tidak terjadi setiap bulan.",
   "see": [
    "ekliptika",
    "orbit",
    "gerhana-matahari"
   ],
   "slug": "inklinasi-orbit"
  },
  {
   "term": "Kecepatan lepas",
   "definition": "Kecepatan lepas adalah kecepatan minimum yang dibutuhkan sebuah benda untuk lepas dari tarikan gravitasi sebuah planet atau satelit, diukur dari permukaannya, tanpa dorongan tambahan. Kecepatan lepas Bumi sekitar 11,2 km per detik, sedangkan Bulan hanya sekitar 2,4 km per detik karena gravitasinya jauh lebih lemah.",
   "see": [
    "gravitasi"
   ],
   "slug": "kecepatan-lepas"
  },
  {
   "term": "Kemiringan sumbu",
   "definition": "Kemiringan sumbu adalah sudut antara sumbu rotasi sebuah planet dan garis yang tegak lurus bidang orbitnya. Sumbu Bumi miring sekitar 23,4 derajat, sehingga belahan Bumi utara dan selatan bergantian menerima lebih banyak sinar Matahari sepanjang tahun, dan inilah penyebab pergantian musim. Uranus miring sekitar 98 derajat sehingga berotasi dalam posisi hampir rebah, sedangkan Venus miring sekitar 177 derajat dan berotasi terbalik.",
   "see": [
    "rotasi",
    "revolusi",
    "gerak-retrograd"
   ],
   "slug": "kemiringan-sumbu"
  },
  {
   "term": "Komet",
   "definition": "Komet adalah bongkahan gas beku, batuan, dan debu yang mengorbit Matahari; dalam keadaan beku ukurannya kira-kira sebesar kota kecil. Ketika mendekati Matahari, komet memanas dan melepaskan gas serta debu yang membentuk kepala bercahaya (koma) dan ekor yang memanjang menjauhi Matahari. Komet Halley kembali rata-rata setiap 76 tahun; kemunculan terakhirnya pada 1986 dan berikutnya pada 2061.",
   "see": [
    "sabuk-kuiper",
    "awan-oort",
    "hujan-meteor"
   ],
   "slug": "komet"
  },
  {
   "term": "Konjungsi",
   "definition": "Konjungsi adalah saat dua benda langit tampak berada pada arah yang hampir sama di langit jika dilihat dari Bumi. Merkurius dan Venus mengalami konjungsi inferior saat berada di antara Bumi dan Matahari, dan konjungsi superior saat berada di balik Matahari. Konjungsi antara Bulan dan Matahari disebut ijtimak dan menandai fase Bulan baru.",
   "see": [
    "oposisi",
    "elongasi",
    "hilal",
    "planet-inferior"
   ],
   "slug": "konjungsi"
  },
  {
   "term": "Massa",
   "definition": "Massa adalah ukuran banyaknya materi dalam suatu benda, dinyatakan dalam kilogram (kg). Massa sebuah benda tetap sama di mana pun benda itu berada, baik di Bumi maupun di Bulan. Massa Matahari sekitar 333.000 kali massa Bumi.",
   "see": [
    "berat",
    "massa-jenis",
    "gravitasi"
   ],
   "slug": "massa"
  },
  {
   "term": "Massa jenis",
   "definition": "Massa jenis adalah massa benda dibagi volumenya, biasanya dinyatakan dalam kg/m³. Bumi adalah planet dengan massa jenis rata-rata terbesar, sekitar 5.500 kg/m³. Saturnus hanya sekitar 690 kg/m³, lebih kecil daripada massa jenis air yang 1.000 kg/m³.",
   "see": [
    "massa",
    "planet-kebumian",
    "raksasa-gas"
   ],
   "slug": "massa-jenis"
  },
  {
   "term": "Meteor",
   "definition": "Meteor adalah kilatan cahaya yang muncul ketika meteoroid memasuki atmosfer Bumi, atau atmosfer planet lain, dengan kecepatan tinggi lalu terbakar. Orang sering menyebutnya bintang jatuh. Meteor yang lebih terang daripada planet Venus disebut bola api (fireball).",
   "see": [
    "meteoroid",
    "meteorit",
    "hujan-meteor"
   ],
   "slug": "meteor"
  },
  {
   "term": "Meteorit",
   "definition": "Meteorit adalah meteoroid yang tidak habis terbakar saat melewati atmosfer dan jatuh sampai ke permukaan Bumi. Para ilmuwan memperkirakan sekitar 44 ton material meteorit jatuh ke Bumi setiap hari.",
   "see": [
    "meteoroid",
    "meteor"
   ],
   "slug": "meteorit"
  },
  {
   "term": "Meteoroid",
   "definition": "Meteoroid adalah batuan kecil di antariksa yang ukurannya mulai dari butiran debu sampai seukuran asteroid kecil. Ketika meteoroid terbakar di atmosfer, kilatan cahayanya disebut meteor, dan sisa yang sampai ke permukaan tanah disebut meteorit.",
   "see": [
    "meteor",
    "meteorit",
    "asteroid"
   ],
   "slug": "meteoroid"
  },
  {
   "term": "Oposisi",
   "definition": "Oposisi adalah posisi ketika sebuah planet berada di seberang Matahari jika dilihat dari Bumi, sehingga Matahari, Bumi, dan planet itu hampir segaris. Di antara planet, hanya planet superior yang dapat mengalami oposisi; saat itu planet tampak sepanjang malam dan berada paling tinggi di langit sekitar tengah malam. Mars mengalami oposisi kira-kira setiap 26 bulan.",
   "see": [
    "konjungsi",
    "planet-superior",
    "gerak-retrograd"
   ],
   "slug": "oposisi"
  },
  {
   "term": "Orbit",
   "definition": "Orbit adalah lintasan yang ditempuh sebuah benda ketika beredar mengelilingi benda lain karena pengaruh gravitasi, misalnya Bumi mengelilingi Matahari atau Bulan mengelilingi Bumi. Orbit planet berbentuk elips, tetapi sebagian besar hampir menyerupai lingkaran.",
   "see": [
    "revolusi",
    "hukum-kepler",
    "eksentrisitas"
   ],
   "slug": "orbit"
  },
  {
   "term": "Pasang surut",
   "definition": "Pasang surut adalah naik turunnya permukaan air laut secara berkala akibat tarikan gravitasi Bulan dan Matahari; gaya pasang dari Matahari sedikit kurang dari separuh gaya pasang dari Bulan. Kebanyakan pantai mengalami dua kali pasang dan dua kali surut setiap hari, dengan selang antara dua pasang sedikit lebih dari 12 jam. Pasang purnama, dengan selisih pasang dan surut terbesar, terjadi saat Bulan baru dan purnama, sedangkan pasang perbani yang selisihnya terkecil terjadi sekitar kuartal pertama dan kuartal akhir.",
   "see": [
    "gravitasi",
    "fase-bulan"
   ],
   "slug": "pasang-surut"
  },
  {
   "term": "Perihelion",
   "definition": "Perihelion adalah titik pada orbit planet, komet, atau benda lain yang paling dekat dengan Matahari. Bumi mencapai perihelion setiap awal Januari pada jarak sekitar 147 juta km, sekitar 5 juta km lebih dekat daripada saat aphelion.",
   "see": [
    "aphelion",
    "eksentrisitas"
   ],
   "slug": "perihelion"
  },
  {
   "term": "Periode sideris",
   "definition": "Periode sideris adalah waktu yang dibutuhkan sebuah benda untuk menyelesaikan satu kali orbit atau rotasi, diukur terhadap bintang-bintang yang jauh. Periode sideris Bulan sekitar 27,3 hari, lebih pendek daripada periode sinodisnya (29,5 hari) karena selama Bulan mengorbit, Bumi juga bergerak mengelilingi Matahari.",
   "see": [
    "periode-sinodis",
    "revolusi"
   ],
   "slug": "periode-sideris"
  },
  {
   "term": "Periode sinodis",
   "definition": "Periode sinodis adalah waktu yang dibutuhkan sebuah benda langit untuk kembali ke posisi yang sama terhadap Matahari jika dilihat dari Bumi. Periode sinodis Bulan, misalnya dari Bulan baru ke Bulan baru berikutnya, sekitar 29,5 hari. Periode sinodis Mars sekitar 780 hari, sehingga oposisi Mars berulang kira-kira setiap 26 bulan.",
   "see": [
    "periode-sideris",
    "fase-bulan",
    "oposisi"
   ],
   "slug": "periode-sinodis"
  },
  {
   "term": "Planet",
   "definition": "Planet adalah benda langit yang mengorbit Matahari, cukup masif sehingga gravitasinya membentuk tubuhnya hampir bulat, dan telah membersihkan lingkungan di sekitar orbitnya. Definisi ini ditetapkan Persatuan Astronomi Internasional (IAU) pada 2006. Menurut definisi tersebut, tata surya memiliki delapan planet: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, dan Neptunus.",
   "see": [
    "planet-kerdil",
    "tata-surya"
   ],
   "slug": "planet"
  },
  {
   "term": "Planet dalam",
   "definition": "Planet dalam adalah planet yang orbitnya berada di sebelah dalam sabuk asteroid, yaitu Merkurius, Venus, Bumi, dan Mars. Keempatnya termasuk planet kebumian. Pengelompokan ini berbeda dengan planet inferior, yang hanya mencakup Merkurius dan Venus.",
   "see": [
    "planet-luar",
    "planet-inferior",
    "planet-kebumian",
    "sabuk-asteroid"
   ],
   "slug": "planet-dalam"
  },
  {
   "term": "Planet inferior",
   "definition": "Planet inferior adalah planet yang orbitnya berada di antara Matahari dan orbit Bumi, yaitu Merkurius dan Venus. Dari Bumi, keduanya selalu tampak tidak jauh dari Matahari dan, jika diamati dengan teleskop, memperlihatkan fase seperti Bulan.",
   "see": [
    "planet-superior",
    "planet-dalam",
    "elongasi",
    "konjungsi"
   ],
   "slug": "planet-inferior"
  },
  {
   "term": "Planet kebumian",
   "definition": "Planet kebumian atau planet terestrial adalah planet berbatu dengan permukaan padat dan inti yang kaya besi, yaitu Merkurius, Venus, Bumi, dan Mars. Dibandingkan planet raksasa, ukurannya jauh lebih kecil, tetapi massa jenisnya lebih besar.",
   "see": [
    "planet-dalam",
    "raksasa-gas",
    "raksasa-es",
    "massa-jenis"
   ],
   "slug": "planet-kebumian"
  },
  {
   "term": "Planet kerdil",
   "definition": "Planet kerdil adalah benda yang mengorbit Matahari dan cukup masif untuk berbentuk hampir bulat, tetapi belum membersihkan lingkungan di sekitar orbitnya dan bukan satelit. Contohnya Ceres di sabuk asteroid serta Pluto, Haumea, Makemake, dan Eris di luar orbit Neptunus. Pluto digolongkan sebagai planet kerdil sejak keputusan IAU pada 2006.",
   "see": [
    "planet",
    "sabuk-asteroid",
    "sabuk-kuiper"
   ],
   "slug": "planet-kerdil"
  },
  {
   "term": "Planet luar",
   "definition": "Planet luar adalah planet yang orbitnya berada di sebelah luar sabuk asteroid, yaitu Jupiter, Saturnus, Uranus, dan Neptunus. Keempatnya adalah planet raksasa tanpa permukaan padat, dan semuanya memiliki sistem cincin. Pengelompokan ini berbeda dengan planet superior, yang juga mencakup Mars.",
   "see": [
    "planet-dalam",
    "planet-superior",
    "raksasa-gas",
    "raksasa-es"
   ],
   "slug": "planet-luar"
  },
  {
   "term": "Planet superior",
   "definition": "Planet superior adalah planet yang orbitnya berada di luar orbit Bumi, yaitu Mars, Jupiter, Saturnus, Uranus, dan Neptunus. Planet-planet ini dapat mencapai oposisi, saat planet tampak sepanjang malam, dan di sekitar waktu itu terlihat melakukan gerak retrograd.",
   "see": [
    "planet-inferior",
    "planet-luar",
    "oposisi",
    "gerak-retrograd"
   ],
   "slug": "planet-superior"
  },
  {
   "term": "Raksasa es",
   "definition": "Raksasa es adalah planet besar yang sebagian besar massanya berupa fluida panas yang rapat dari bahan-bahan yang digolongkan sebagai es, yaitu air, metana, dan amonia, di atas inti berbatu yang kecil. Uranus dan Neptunus termasuk raksasa es; keduanya lebih kecil daripada raksasa gas dan tampak kebiruan karena metana di atmosfernya menyerap cahaya merah.",
   "see": [
    "raksasa-gas",
    "planet-luar"
   ],
   "slug": "raksasa-es"
  },
  {
   "term": "Raksasa gas",
   "definition": "Raksasa gas adalah planet besar tanpa permukaan padat yang terutama tersusun atas hidrogen dan helium, yaitu Jupiter dan Saturnus. Jupiter, planet terbesar di tata surya, berdiameter sekitar 143.000 km, lebih dari 11 kali diameter Bumi.",
   "see": [
    "raksasa-es",
    "planet-luar",
    "massa-jenis"
   ],
   "slug": "raksasa-gas"
  },
  {
   "term": "Revolusi",
   "definition": "Revolusi adalah gerak sebuah benda langit mengelilingi benda lain, misalnya planet mengelilingi Matahari atau Bulan mengelilingi Bumi. Bumi menyelesaikan satu kali revolusi terhadap bintang-bintang dalam sekitar 365,26 hari dengan kecepatan rata-rata sekitar 30 km per detik.",
   "see": [
    "rotasi",
    "orbit",
    "periode-sideris"
   ],
   "slug": "revolusi"
  },
  {
   "term": "Rotasi",
   "definition": "Rotasi adalah perputaran sebuah benda pada sumbunya. Bumi berotasi dari barat ke timur sekali dalam sekitar 23 jam 56 menit terhadap bintang-bintang (satu hari Matahari lamanya 24 jam), dan rotasi inilah yang menyebabkan pergantian siang dan malam. Venus dan Uranus berotasi dengan arah sebaliknya, dari timur ke barat.",
   "see": [
    "revolusi",
    "rotasi-sinkron",
    "gerak-retrograd",
    "kemiringan-sumbu"
   ],
   "slug": "rotasi"
  },
  {
   "term": "Rotasi sinkron",
   "definition": "Rotasi sinkron terjadi ketika waktu yang dibutuhkan sebuah satelit untuk berotasi sekali sama dengan waktu revolusinya, sehingga sisi yang sama selalu menghadap planetnya. Bulan berotasi sinkron dengan Bumi, jadi dari Bumi kita selalu melihat sisi dekat yang sama. Semua satelit besar di tata surya terkunci dengan cara ini terhadap planetnya, sedangkan Pluto dan Charon saling terkunci sehingga keduanya selalu memperlihatkan sisi yang sama satu sama lain.",
   "see": [
    "rotasi",
    "revolusi",
    "pasang-surut"
   ],
   "slug": "rotasi-sinkron"
  },
  {
   "term": "Sabuk asteroid",
   "definition": "Sabuk asteroid adalah wilayah di antara orbit Mars dan Jupiter tempat sebagian besar asteroid beredar, dengan jarak rata-rata sekitar 2,0 sampai 3,2 SA dari Matahari. Jika digabungkan, massa seluruh asteroid masih lebih kecil daripada massa Bulan. Benda terbesar di wilayah ini adalah planet kerdil Ceres.",
   "see": [
    "asteroid",
    "planet-kerdil",
    "sabuk-kuiper"
   ],
   "slug": "sabuk-asteroid"
  },
  {
   "term": "Sabuk Kuiper",
   "definition": "Sabuk Kuiper adalah wilayah berbentuk seperti donat di luar orbit Neptunus, mulai sekitar 30 SA dari Matahari, dengan bagian utama yang berakhir sekitar 50 SA. Wilayah ini berisi banyak benda es, termasuk Pluto, dan menjadi asal sebagian komet berperiode pendek. Wahana New Horizons melintas dekat Pluto pada Juli 2015 dan dekat Arrokoth, salah satu benda Sabuk Kuiper, pada 1 Januari 2019.",
   "see": [
    "planet-kerdil",
    "komet",
    "awan-oort"
   ],
   "slug": "sabuk-kuiper"
  },
  {
   "term": "Satelit alami",
   "definition": "Satelit alami adalah benda alami yang mengorbit planet, planet kerdil, atau asteroid. Bulan adalah satu-satunya satelit alami Bumi, sedangkan Merkurius dan Venus tidak memiliki satelit. Satelit alami terbesar di tata surya adalah Ganymede milik Jupiter, yang berdiameter sekitar 5.260 km dan lebih besar daripada planet Merkurius.",
   "see": [
    "planet",
    "rotasi-sinkron"
   ],
   "slug": "satelit-alami"
  },
  {
   "term": "Satuan astronomi (SA)",
   "definition": "Satuan astronomi (SA) adalah satuan jarak yang kira-kira sama dengan jarak rata-rata Bumi ke Matahari, yaitu sekitar 150 juta km. Sejak 2012, Persatuan Astronomi Internasional (IAU) menetapkan nilainya tepat 149.597.870,7 km. Jupiter, misalnya, berjarak sekitar 5,2 SA dari Matahari, dan cahaya Matahari menempuh 1 SA dalam sekitar 8 menit 20 detik.",
   "see": [
    "tahun-cahaya",
    "heliosfer"
   ],
   "slug": "satuan-astronomi-sa"
  },
  {
   "term": "Tahun cahaya",
   "definition": "Meskipun memakai kata tahun, tahun cahaya adalah satuan jarak, yaitu jarak yang ditempuh cahaya di ruang hampa selama satu tahun, sekitar 9,46 triliun km. Bintang terdekat setelah Matahari, Proxima Centauri, berjarak sekitar 4,2 tahun cahaya dari Bumi.",
   "see": [
    "satuan-astronomi-sa"
   ],
   "slug": "tahun-cahaya"
  },
  {
   "term": "Tata surya",
   "definition": "Tata surya adalah Matahari beserta semua benda yang terikat oleh gravitasinya, yaitu planet, planet kerdil, satelit alami, asteroid, komet, serta benda-benda di Sabuk Kuiper dan Awan Oort. Tata surya terbentuk sekitar 4,6 miliar tahun lalu dari awan gas dan debu yang runtuh. Matahari sendiri menyimpan sekitar 99,8% massa tata surya.",
   "see": [
    "planet",
    "planet-kerdil",
    "sabuk-kuiper",
    "awan-oort"
   ],
   "slug": "tata-surya"
  },
  {
   "term": "Zona layak huni",
   "definition": "Zona layak huni adalah rentang jarak dari sebuah bintang tempat air dapat tetap cair di permukaan planet, asalkan planet itu memiliki atmosfer yang sesuai. Bumi berada di dalam zona layak huni Matahari. Pada bintang yang lebih kecil dan lebih dingin daripada Matahari, zona ini letaknya lebih dekat ke bintang.",
   "see": [
    "planet-kebumian"
   ],
   "slug": "zona-layak-huni"
  }
 ],
 "quiz": [
  {
   "topic": "planet",
   "difficulty": "mudah",
   "question": "Planet manakah yang paling dekat dengan Matahari?",
   "options": [
    "Venus",
    "Merkurius",
    "Mars",
    "Bumi"
   ],
   "answer": 1,
   "explanation": "Merkurius mengorbit Matahari pada jarak rata-rata sekitar 58 juta km. Venus menyusul di urutan kedua dengan jarak rata-rata sekitar 108 juta km."
  },
  {
   "topic": "planet",
   "difficulty": "mudah",
   "question": "Planet manakah yang paling besar di tata surya?",
   "options": [
    "Saturnus",
    "Neptunus",
    "Uranus",
    "Jupiter"
   ],
   "answer": 3,
   "explanation": "Diameter Jupiter sekitar 143.000 km, kira-kira 11 kali diameter Bumi. Saturnus berada di urutan kedua dengan diameter sekitar 120.500 km."
  },
  {
   "topic": "planet",
   "difficulty": "mudah",
   "question": "Mengapa Mars tampak berwarna kemerahan?",
   "options": [
    "Besi di batuan dan debunya berkarat",
    "Atmosfernya penuh awan asam",
    "Permukaannya tertutup lava pijar",
    "Cahaya Matahari di sana berwarna merah"
   ],
   "answer": 0,
   "explanation": "Besi di batuan, tanah, dan debu Mars mengalami oksidasi atau berkarat, sehingga permukaannya tampak kemerahan. Warna inilah yang membuat Mars dijuluki Planet Merah."
  },
  {
   "topic": "planet",
   "difficulty": "mudah",
   "question": "Planet manakah yang suhu rata-rata permukaannya paling tinggi?",
   "options": [
    "Merkurius",
    "Mars",
    "Venus",
    "Jupiter"
   ],
   "answer": 2,
   "explanation": "Suhu rata-rata permukaan Venus sekitar 460 °C, lebih panas daripada Merkurius yang lebih dekat ke Matahari. Atmosfernya yang tebal dan sebagian besar berupa karbon dioksida memerangkap panas melalui efek rumah kaca."
  },
  {
   "topic": "planet",
   "difficulty": "mudah",
   "question": "Planet manakah yang memiliki sistem cincin paling kompleks di tata surya?",
   "options": [
    "Jupiter",
    "Saturnus",
    "Uranus",
    "Neptunus"
   ],
   "answer": 1,
   "explanation": "Cincin Saturnus tersusun dari miliaran bongkahan es dan batuan, mulai dari butiran seukuran debu hingga bongkahan sebesar rumah. Planet raksasa lain juga bercincin, tetapi tidak ada yang serumit cincin Saturnus."
  },
  {
   "topic": "planet",
   "difficulty": "mudah",
   "question": "Planet manakah yang orbitnya paling jauh dari Matahari?",
   "options": [
    "Uranus",
    "Saturnus",
    "Jupiter",
    "Neptunus"
   ],
   "answer": 3,
   "explanation": "Neptunus mengorbit Matahari pada jarak rata-rata sekitar 4,5 miliar km, atau sekitar 30 SA. Jarak rata-rata Pluto memang lebih jauh, tetapi sejak 2006 Pluto digolongkan sebagai planet kerdil."
  },
  {
   "topic": "planet",
   "difficulty": "mudah",
   "question": "Menurut ketetapan Persatuan Astronomi Internasional (IAU), berapa jumlah planet di tata surya?",
   "options": [
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan"
   ],
   "answer": 2,
   "explanation": "Kedelapan planet itu adalah Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, dan Neptunus. Pluto dulu dianggap planet kesembilan, tetapi sejak 2006 IAU menggolongkannya sebagai planet kerdil."
  },
  {
   "topic": "planet",
   "difficulty": "mudah",
   "question": "Di antara planet-planet di tata surya, ciri apa yang hanya dimiliki Bumi?",
   "options": [
    "Air cair di permukaan",
    "Lapisan atmosfer",
    "Satelit alami",
    "Medan magnet global"
   ],
   "answer": 0,
   "explanation": "Bumi adalah satu-satunya planet di tata surya yang memiliki air cair di permukaannya. Ciri lainnya juga dimiliki planet lain, misalnya Venus yang beratmosfer, Mars yang memiliki dua satelit, dan Jupiter yang memiliki medan magnet global."
  },
  {
   "topic": "planet",
   "difficulty": "sedang",
   "question": "Planet manakah yang membutuhkan waktu lebih lama untuk berotasi satu kali daripada untuk mengelilingi Matahari satu kali?",
   "options": [
    "Mars",
    "Venus",
    "Jupiter",
    "Uranus"
   ],
   "answer": 1,
   "explanation": "Venus berotasi sekali dalam sekitar 243 hari Bumi, sedangkan satu revolusinya hanya sekitar 225 hari Bumi. Arah rotasinya juga berlawanan dengan kebanyakan planet, sehingga di Venus Matahari terbit di barat."
  },
  {
   "topic": "planet",
   "difficulty": "sedang",
   "question": "Planet manakah yang massa jenis rata-ratanya lebih kecil daripada massa jenis air?",
   "options": [
    "Jupiter",
    "Uranus",
    "Saturnus",
    "Neptunus"
   ],
   "answer": 2,
   "explanation": "Massa jenis rata-rata Saturnus sekitar 690 kg/m³, lebih kecil daripada air yang sekitar 1.000 kg/m³. Planet ini sebagian besar tersusun dari hidrogen dan helium, dua unsur yang paling ringan."
  },
  {
   "topic": "planet",
   "difficulty": "sedang",
   "question": "Planet manakah yang sumbu rotasinya miring sekitar 98°, sehingga tampak berputar sambil menggelinding di sepanjang orbitnya?",
   "options": [
    "Uranus",
    "Neptunus",
    "Saturnus",
    "Jupiter"
   ],
   "answer": 0,
   "explanation": "Sumbu rotasi Uranus miring sekitar 98°, sehingga khatulistiwanya hampir tegak lurus terhadap bidang orbit. Kemiringan ini membuat Uranus mengalami musim paling ekstrem di tata surya."
  },
  {
   "topic": "planet",
   "difficulty": "sedang",
   "question": "Di planet manakah tercatat angin paling kencang di tata surya, dengan kecepatan lebih dari 2.000 km/jam?",
   "options": [
    "Jupiter",
    "Saturnus",
    "Venus",
    "Neptunus"
   ],
   "answer": 3,
   "explanation": "Angin di Neptunus meniup awan metana beku dengan kecepatan lebih dari 2.000 km/jam. Sebagai perbandingan, angin terkuat di Bumi hanya sekitar 400 km/jam."
  },
  {
   "topic": "planet",
   "difficulty": "sedang",
   "question": "Di planet manakah Olympus Mons, gunung api terbesar di tata surya, berada?",
   "options": [
    "Mars",
    "Venus",
    "Bumi",
    "Merkurius"
   ],
   "answer": 0,
   "explanation": "Olympus Mons berada di Mars dan tingginya jauh melampaui Gunung Everest, puncak tertinggi di Bumi yang tingginya 8.848 m. Luas dasarnya kira-kira sama dengan luas negara bagian Arizona di Amerika Serikat."
  },
  {
   "topic": "planet",
   "difficulty": "sedang",
   "question": "Satelit manakah yang memiliki atmosfer tebal serta danau metana dan etana cair di permukaannya?",
   "options": [
    "Europa",
    "Triton",
    "Io",
    "Titan"
   ],
   "answer": 3,
   "explanation": "Titan, satelit terbesar Saturnus, adalah satu-satunya satelit di tata surya yang memiliki atmosfer tebal. Selain Bumi, hanya Titan yang diketahui memiliki cairan di permukaannya."
  },
  {
   "topic": "planet",
   "difficulty": "sedang",
   "question": "Dua planet manakah yang digolongkan sebagai raksasa es?",
   "options": [
    "Jupiter dan Saturnus",
    "Uranus dan Neptunus",
    "Saturnus dan Uranus",
    "Mars dan Neptunus"
   ],
   "answer": 1,
   "explanation": "Sedikitnya 80% massa Uranus dan Neptunus berupa fluida panas yang rapat dari bahan es, yaitu air, metana, dan amonia, yang menyelimuti inti batuan kecil. Jupiter dan Saturnus disebut raksasa gas karena sebagian besar tersusun dari hidrogen dan helium."
  },
  {
   "topic": "planet",
   "difficulty": "sedang",
   "question": "Mengapa suhu malam di Merkurius dapat turun hingga sekitar -180 °C, padahal planet ini paling dekat dengan Matahari?",
   "options": [
    "Merkurius tidak berotasi pada porosnya",
    "Permukaannya memantulkan semua cahaya",
    "Merkurius tidak memiliki atmosfer tebal",
    "Intinya terbuat dari es yang dingin"
   ],
   "answer": 2,
   "explanation": "Merkurius hampir tidak memiliki atmosfer yang dapat menahan panas, sehingga panas siang hari yang mencapai sekitar 430 °C cepat lepas ke antariksa saat malam. Akibatnya, perbedaan suhu siang dan malam di Merkurius sangat besar."
  },
  {
   "topic": "planet",
   "difficulty": "sulit",
   "question": "Bagaimana massa Jupiter jika dibandingkan dengan gabungan massa tujuh planet lainnya?",
   "options": [
    "Sekitar setengahnya",
    "Hampir sama besar",
    "Lebih dari dua kali lipat",
    "Sekitar seratus kali lipat"
   ],
   "answer": 2,
   "explanation": "Massa Jupiter sekitar 1.900 × 10²⁴ kg, kira-kira 2,5 kali gabungan massa tujuh planet lain yang sekitar 770 × 10²⁴ kg. Jupiter menyerap sebagian besar materi yang tersisa setelah Matahari terbentuk."
  },
  {
   "topic": "planet",
   "difficulty": "sulit",
   "question": "Apa keunikan Triton, satelit terbesar Neptunus?",
   "options": [
    "Mengorbit berlawanan arah rotasi planetnya",
    "Lebih besar daripada planet Merkurius",
    "Memiliki danau metana di permukaannya",
    "Paling aktif secara vulkanik di tata surya"
   ],
   "answer": 0,
   "explanation": "Triton adalah satu-satunya satelit besar di tata surya yang mengorbit berlawanan arah dengan rotasi planetnya (orbit retrograd). Hal ini menunjukkan Triton mungkin dulunya benda mandiri yang kemudian ditangkap gravitasi Neptunus."
  },
  {
   "topic": "planet",
   "difficulty": "sulit",
   "question": "Planet manakah yang memiliki massa jenis rata-rata paling besar?",
   "options": [
    "Merkurius",
    "Jupiter",
    "Venus",
    "Bumi"
   ],
   "answer": 3,
   "explanation": "Massa jenis rata-rata Bumi sekitar 5.500 kg/m³, sedikit di atas Merkurius yang sekitar 5.400 kg/m³. Jupiter memang bermassa paling besar, tetapi karena sebagian besar tersusun dari hidrogen dan helium, massa jenisnya hanya sekitar 1.300 kg/m³."
  },
  {
   "topic": "planet",
   "difficulty": "sulit",
   "question": "Satelit manakah yang terbesar di tata surya, bahkan lebih besar daripada planet Merkurius?",
   "options": [
    "Titan",
    "Ganymede",
    "Callisto",
    "Bulan"
   ],
   "answer": 1,
   "explanation": "Ganymede, satelit Jupiter, adalah satelit terbesar di tata surya dan ukurannya melebihi Merkurius. Urutan berikutnya adalah Titan, Callisto, Io, lalu Bulan."
  },
  {
   "topic": "matahari-bulan",
   "difficulty": "mudah",
   "question": "Dari mana Matahari memperoleh energinya?",
   "options": [
    "Fusi nuklir hidrogen menjadi helium",
    "Pembakaran batu bara di intinya",
    "Pantulan cahaya dari bintang lain",
    "Letusan gunung api di permukaannya"
   ],
   "answer": 0,
   "explanation": "Di inti Matahari, yang suhunya sekitar 15 juta °C, hidrogen bergabung membentuk helium melalui fusi nuklir. Reaksi ini menghasilkan energi yang kita terima di Bumi sebagai cahaya dan panas."
  },
  {
   "topic": "matahari-bulan",
   "difficulty": "mudah",
   "question": "Berapa lama kira-kira cahaya Matahari menempuh perjalanan sampai ke Bumi?",
   "options": [
    "Sekitar 8 detik",
    "Sekitar 8 menit",
    "Sekitar 8 jam",
    "Sekitar 8 hari"
   ],
   "answer": 1,
   "explanation": "Cahaya menempuh jarak rata-rata Bumi ke Matahari, sekitar 150 juta km, dalam kira-kira 8 menit. Artinya, cahaya Matahari yang kita lihat sudah dipancarkan sekitar 8 menit sebelumnya."
  },
  {
   "topic": "matahari-bulan",
   "difficulty": "mudah",
   "question": "Mengapa dari Bumi kita selalu melihat sisi Bulan yang sama?",
   "options": [
    "Bulan sama sekali tidak berotasi",
    "Sisi jauh Bulan tidak pernah tersinari",
    "Rotasi dan revolusi Bulan sama lamanya",
    "Sisi lain Bulan tertutup awan tebal"
   ],
   "answer": 2,
   "explanation": "Bulan berotasi satu kali dalam waktu yang sama dengan satu kali mengelilingi Bumi, sekitar 27 hari, sehingga sisi yang sama selalu menghadap Bumi. Sisi jauhnya tetap mendapat cahaya Matahari secara bergantian, hanya saja sisi itu selalu membelakangi Bumi."
  },
  {
   "topic": "matahari-bulan",
   "difficulty": "mudah",
   "question": "Bagaimana posisi Matahari, Bumi, dan Bulan saat terjadi gerhana Matahari?",
   "options": [
    "Bumi berada di antara Matahari dan Bulan",
    "Ketiganya membentuk sudut siku-siku",
    "Matahari berada di antara Bumi dan Bulan",
    "Bulan berada di antara Matahari dan Bumi"
   ],
   "answer": 3,
   "explanation": "Saat gerhana Matahari, Bulan lewat di antara Matahari dan Bumi sehingga bayangannya jatuh ke permukaan Bumi. Karena itu gerhana Matahari hanya dapat terjadi pada fase Bulan baru."
  },
  {
   "topic": "matahari-bulan",
   "difficulty": "sedang",
   "question": "Apa nama lapisan Matahari yang kita lihat sebagai permukaannya?",
   "options": [
    "Fotosfer",
    "Korona",
    "Kromosfer",
    "Inti"
   ],
   "answer": 0,
   "explanation": "Fotosfer memancarkan sebagian besar cahaya tampak Matahari dan suhunya sekitar 5.500 °C. Matahari tidak memiliki permukaan padat karena seluruhnya tersusun dari plasma."
  },
  {
   "topic": "matahari-bulan",
   "difficulty": "sedang",
   "question": "Gravitasi di permukaan Bulan kira-kira berapa bagian dari gravitasi di permukaan Bumi?",
   "options": [
    "Setengahnya",
    "Sepertiganya",
    "Seperenamnya",
    "Sepersepuluhnya"
   ],
   "answer": 2,
   "explanation": "Percepatan gravitasi di permukaan Bulan sekitar 1,6 m/s², sedangkan di Bumi sekitar 9,8 m/s². Karena itu para astronaut Apollo tampak melompat-lompat ringan ketika berjalan di Bulan."
  },
  {
   "topic": "matahari-bulan",
   "difficulty": "sedang",
   "question": "Pada fase Bulan apa pasang naik air laut paling tinggi?",
   "options": [
    "Sabit awal dan sabit akhir",
    "Bulan baru dan purnama",
    "Kuartal pertama dan kuartal akhir",
    "Cembung awal dan cembung akhir"
   ],
   "answer": 1,
   "explanation": "Pada Bulan baru dan purnama, Matahari, Bumi, dan Bulan hampir segaris sehingga tarikan gravitasi Matahari memperkuat tarikan Bulan dan terjadilah pasang purnama. Saat Bulan tampak separuh, yaitu pada kuartal pertama dan kuartal akhir, tarikan Matahari dan Bulan membentuk sudut siku-siku dan sebagian saling meniadakan, sehingga terjadi pasang perbani yang lebih lemah."
  },
  {
   "topic": "matahari-bulan",
   "difficulty": "sedang",
   "question": "Menurut teori yang paling banyak diterima, dari apa Bulan terbentuk?",
   "options": [
    "Pecahan Matahari yang terlempar keluar",
    "Asteroid yang tertangkap gravitasi Bumi",
    "Puing tabrakan benda besar dengan Bumi",
    "Gumpalan es yang datang dari Sabuk Kuiper"
   ],
   "answer": 2,
   "explanation": "Bulan kemungkinan besar terbentuk dari puing yang terlontar ketika sebuah benda seukuran Mars menabrak Bumi muda. Puing dari Bumi dan benda penabrak itu lalu berkumpul membentuk Bulan."
  },
  {
   "topic": "matahari-bulan",
   "difficulty": "sulit",
   "question": "Fotosfer Matahari bersuhu sekitar 5.500 °C. Bagian Matahari manakah yang letaknya lebih jauh dari inti, tetapi suhunya dapat mencapai sekitar 2 juta °C?",
   "options": [
    "Korona",
    "Kromosfer",
    "Bintik Matahari",
    "Prominensa"
   ],
   "answer": 0,
   "explanation": "Korona adalah lapisan atmosfer terluar Matahari, dan suhunya dapat mencapai sekitar 2 juta °C. Penyebab korona jauh lebih panas daripada lapisan di bawahnya masih menjadi teka-teki besar dalam penelitian Matahari."
  },
  {
   "topic": "matahari-bulan",
   "difficulty": "sulit",
   "question": "Mengapa gerhana Matahari tidak terjadi pada setiap fase Bulan baru?",
   "options": [
    "Bulan terlalu kecil untuk menutupi Matahari",
    "Matahari terlalu terang untuk tertutupi",
    "Cahaya Matahari dibelokkan atmosfer Bumi",
    "Orbit Bulan miring terhadap orbit Bumi"
   ],
   "answer": 3,
   "explanation": "Bidang orbit Bulan miring sekitar 5° terhadap bidang orbit Bumi, sehingga pada sebagian besar Bulan baru bayangan Bulan lewat di atas atau di bawah Bumi. Gerhana hanya terjadi bila Bulan baru jatuh di dekat titik potong kedua bidang orbit itu."
  },
  {
   "topic": "gerak-orbit",
   "difficulty": "mudah",
   "question": "Apa akibat dari rotasi Bumi pada porosnya?",
   "options": [
    "Pergantian musim",
    "Pergantian siang dan malam",
    "Terjadinya tahun kabisat",
    "Perubahan fase Bulan"
   ],
   "answer": 1,
   "explanation": "Bumi berotasi sekali dalam sekitar 24 jam. Bagian Bumi yang menghadap Matahari mengalami siang, sedangkan bagian yang membelakanginya mengalami malam."
  },
  {
   "topic": "gerak-orbit",
   "difficulty": "mudah",
   "question": "Berapa lama Bumi menyelesaikan satu kali revolusi mengelilingi Matahari?",
   "options": [
    "Sekitar 24 jam",
    "Sekitar 29,5 hari",
    "Sekitar 365,26 hari",
    "Sekitar 687 hari"
   ],
   "answer": 2,
   "explanation": "Diukur terhadap bintang-bintang, satu revolusi Bumi berlangsung sekitar 365,26 hari. Kalender mengikuti siklus musim yang panjangnya sekitar 365,24 hari, dan kelebihan hampir seperempat hari itu dikumpulkan menjadi satu hari tambahan setiap empat tahun, yaitu pada tahun kabisat."
  },
  {
   "topic": "gerak-orbit",
   "difficulty": "mudah",
   "question": "Gaya apa yang membuat planet-planet tetap beredar mengelilingi Matahari?",
   "options": [
    "Gaya magnet Bumi",
    "Tekanan angin Matahari",
    "Gaya gesek di antariksa",
    "Gaya gravitasi Matahari"
   ],
   "answer": 3,
   "explanation": "Matahari mencakup sekitar 99,8% massa tata surya. Gravitasinya menahan planet, asteroid, komet, dan benda kecil lain tetap pada orbitnya."
  },
  {
   "topic": "gerak-orbit",
   "difficulty": "mudah",
   "question": "Satu satuan astronomi (SA) kira-kira sama dengan jarak rata-rata antara dua benda langit apa?",
   "options": [
    "Bumi dan Matahari",
    "Bumi dan Bulan",
    "Matahari dan Neptunus",
    "Matahari dan bintang terdekat"
   ],
   "answer": 0,
   "explanation": "Satu SA kira-kira sama dengan jarak rata-rata Bumi ke Matahari, sekitar 150 juta km. Dengan satuan ini, jarak Neptunus dari Matahari cukup ditulis sekitar 30 SA."
  },
  {
   "topic": "gerak-orbit",
   "difficulty": "sedang",
   "question": "Apa penyebab utama pergantian musim panas dan musim dingin di Bumi?",
   "options": [
    "Jarak Bumi ke Matahari berubah",
    "Sumbu rotasi Bumi miring",
    "Kecepatan rotasi Bumi berubah",
    "Pancaran panas Matahari berubah"
   ],
   "answer": 1,
   "explanation": "Sumbu rotasi Bumi miring sekitar 23,4° terhadap bidang orbitnya. Selama sebagian tahun belahan utara condong ke arah Matahari dan menerima sinar lebih langsung, lalu keadaan itu berbalik untuk belahan selatan."
  },
  {
   "topic": "gerak-orbit",
   "difficulty": "sedang",
   "question": "Menurut Hukum Kepler I, bagaimana bentuk orbit planet mengelilingi Matahari?",
   "options": [
    "Lingkaran sempurna dengan Matahari di pusatnya",
    "Spiral yang makin lama makin mendekati Matahari",
    "Garis lurus yang bolak-balik melewati Matahari",
    "Elips dengan Matahari di salah satu titik fokusnya"
   ],
   "answer": 3,
   "explanation": "Johannes Kepler menyimpulkan dari data pengamatan Tycho Brahe bahwa orbit planet berbentuk elips, dengan Matahari di salah satu titik fokusnya. Karena itu jarak planet ke Matahari berubah-ubah sepanjang orbitnya."
  },
  {
   "topic": "gerak-orbit",
   "difficulty": "sedang",
   "question": "Menurut Hukum Kepler II, kapan sebuah planet bergerak paling cepat pada orbitnya?",
   "options": [
    "Saat paling dekat dengan Matahari",
    "Saat paling jauh dari Matahari",
    "Saat sejajar dengan planet lain",
    "Saat berada di belakang Matahari"
   ],
   "answer": 0,
   "explanation": "Hukum Kepler II menyatakan bahwa garis khayal dari planet ke Matahari menyapu luas yang sama dalam selang waktu yang sama. Agar luasnya sama, planet harus bergerak lebih cepat ketika dekat dengan Matahari dan lebih lambat ketika jauh."
  },
  {
   "topic": "gerak-orbit",
   "difficulty": "sedang",
   "question": "Kecepatan orbit rata-rata Merkurius sekitar 47 km/s. Berapa kira-kira kecepatan orbit rata-rata Neptunus?",
   "options": [
    "Sekitar 470 km/s",
    "Sekitar 120 km/s",
    "Sekitar 47 km/s",
    "Sekitar 5 km/s"
   ],
   "answer": 3,
   "explanation": "Makin jauh dari Matahari, makin lemah tarikan gravitasi Matahari, sehingga planet bergerak makin lambat pada orbitnya. Kecepatan orbit rata-rata Bumi sekitar 30 km/s, sedangkan Neptunus hanya sekitar 5 km/s."
  },
  {
   "topic": "gerak-orbit",
   "difficulty": "sulit",
   "question": "Bumi berada paling dekat dengan Matahari pada bulan Januari. Musim apa yang sedang berlangsung di belahan Bumi utara pada saat itu?",
   "options": [
    "Musim panas",
    "Musim dingin",
    "Musim semi",
    "Musim gugur"
   ],
   "answer": 1,
   "explanation": "Pada bulan Januari belahan utara condong menjauhi Matahari sehingga mengalami musim dingin, meskipun Bumi sedang berada di titik terdekatnya dengan Matahari. Musim di Bumi ditentukan oleh kemiringan sumbunya, bukan oleh jaraknya ke Matahari."
  },
  {
   "topic": "gerak-orbit",
   "difficulty": "sulit",
   "question": "Menurut Hukum Kepler III, kuadrat periode orbit sebanding dengan pangkat tiga sumbu semimayor (setengah sumbu panjang elips). Jika sebuah asteroid mengorbit Matahari dengan sumbu semimayor 4 SA, berapa periode orbitnya?",
   "options": [
    "2 tahun",
    "4 tahun",
    "8 tahun",
    "16 tahun"
   ],
   "answer": 2,
   "explanation": "Untuk benda yang mengorbit Matahari, bila periode (T) dinyatakan dalam tahun dan sumbu semimayor (a) dalam SA, berlaku T² = a³. Dengan a = 4 SA, a³ = 64, sehingga T = √64 = 8 tahun."
  },
  {
   "topic": "benda-kecil",
   "difficulty": "mudah",
   "question": "Di manakah letak sabuk asteroid utama?",
   "options": [
    "Di antara Mars dan Jupiter",
    "Di antara Bumi dan Mars",
    "Di antara Jupiter dan Saturnus",
    "Di luar orbit Neptunus"
   ],
   "answer": 0,
   "explanation": "Sebagian besar asteroid mengorbit Matahari di sabuk asteroid utama, di antara orbit Mars dan Jupiter. Pada awal sejarah tata surya, gravitasi Jupiter mencegah benda-benda di wilayah ini bergabung menjadi planet."
  },
  {
   "topic": "benda-kecil",
   "difficulty": "mudah",
   "question": "Apa sebutan untuk batuan antariksa yang berhasil melewati atmosfer dan jatuh sampai ke permukaan Bumi?",
   "options": [
    "Meteor",
    "Meteoroid",
    "Komet",
    "Meteorit"
   ],
   "answer": 3,
   "explanation": "Batuan antariksa berukuran butiran debu sampai asteroid kecil disebut meteoroid, dan cahaya saat ia terbakar di atmosfer disebut meteor. Bila sisanya selamat sampai ke tanah, batuan itu disebut meteorit."
  },
  {
   "topic": "benda-kecil",
   "difficulty": "mudah",
   "question": "Mengapa komet membentuk koma dan ekor saat mendekati Matahari?",
   "options": [
    "Komet bertabrakan dengan asteroid lain",
    "Panas Matahari mengubah esnya menjadi gas",
    "Inti komet terbakar seperti batu bara",
    "Komet memancarkan cahaya sendiri"
   ],
   "answer": 1,
   "explanation": "Saat komet yang tersusun dari es, gas beku, dan debu mendekati Matahari, esnya berubah menjadi gas dan membentuk koma. Cahaya Matahari dan angin Matahari lalu mendorong gas dan debu itu menjadi ekor yang mengarah menjauhi Matahari."
  },
  {
   "topic": "benda-kecil",
   "difficulty": "mudah",
   "question": "Komet Halley dapat terlihat dari Bumi kira-kira setiap berapa tahun?",
   "options": [
    "Sekitar 7 tahun",
    "Sekitar 25 tahun",
    "Sekitar 76 tahun",
    "Sekitar 250 tahun"
   ],
   "answer": 2,
   "explanation": "Komet Halley mengelilingi Matahari kira-kira sekali dalam 76 tahun. Komet ini terakhir tampak di langit Bumi pada 1986 dan akan kembali pada 2061."
  },
  {
   "topic": "benda-kecil",
   "difficulty": "sedang",
   "question": "Apa nama benda terbesar di sabuk asteroid yang kini digolongkan sebagai planet kerdil?",
   "options": [
    "Ceres",
    "Vesta",
    "Eris",
    "Phobos"
   ],
   "answer": 0,
   "explanation": "Ceres adalah benda terbesar di sabuk asteroid dan satu-satunya planet kerdil di tata surya bagian dalam. Ceres ditemukan Giuseppe Piazzi pada 1801 dan digolongkan sebagai planet kerdil pada 2006."
  },
  {
   "topic": "benda-kecil",
   "difficulty": "sedang",
   "question": "Di manakah letak Sabuk Kuiper?",
   "options": [
    "Di antara Mars dan Jupiter",
    "Di sekitar orbit Saturnus",
    "Di antara Bumi dan Venus",
    "Di luar orbit Neptunus"
   ],
   "answer": 3,
   "explanation": "Sabuk Kuiper adalah wilayah berbentuk seperti donat yang berisi benda-benda es, mulai dari orbit Neptunus di sekitar 30 SA hingga kira-kira 50 SA dari Matahari. Planet kerdil Pluto, Haumea, dan Makemake berada di wilayah ini."
  },
  {
   "topic": "benda-kecil",
   "difficulty": "sedang",
   "question": "Apa penyebab sebagian besar hujan meteor?",
   "options": [
    "Bulan memantulkan cahaya asteroid",
    "Bumi melintasi jejak debu komet",
    "Bintang-bintang jatuh ke Bumi",
    "Satelit buatan terbakar bersamaan"
   ],
   "answer": 1,
   "explanation": "Komet meninggalkan jejak debu di sepanjang orbitnya, dan saat Bumi melintasinya, butiran debu itu terbakar di atmosfer sebagai meteor. Contohnya, hujan meteor Perseid berasal dari debu Komet Swift-Tuttle."
  },
  {
   "topic": "benda-kecil",
   "difficulty": "sedang",
   "question": "Apa keistimewaan Komet 3I/ATLAS yang ditemukan pada 1 Juli 2025?",
   "options": [
    "Menjadi satelit kedua Bumi",
    "Merupakan satelit baru Jupiter",
    "Kembali setiap 76 tahun",
    "Berasal dari luar tata surya"
   ],
   "answer": 3,
   "explanation": "3I/ATLAS adalah benda antarbintang ketiga yang teridentifikasi melintasi tata surya, setelah 1I/ʻOumuamua pada 2017 dan 2I/Borisov pada 2019. Komet ini mencapai titik terdekatnya ke Matahari sekitar 30 Oktober 2025 pada jarak sekitar 1,4 SA dan tidak membahayakan Bumi."
  },
  {
   "topic": "benda-kecil",
   "difficulty": "sulit",
   "question": "Syarat planet menurut Persatuan Astronomi Internasional (IAU) manakah yang tidak dipenuhi Pluto?",
   "options": [
    "Telah membersihkan lingkungan orbitnya",
    "Beredar mengelilingi Matahari",
    "Massanya cukup untuk berbentuk bulat",
    "Memiliki setidaknya satu satelit alami"
   ],
   "answer": 0,
   "explanation": "Pada 2006 IAU menetapkan bahwa planet harus mengorbit Matahari, massanya cukup besar sehingga bentuknya hampir bulat, dan telah membersihkan lingkungan di sekitar orbitnya. Pluto berbagi wilayah orbit dengan banyak benda lain di Sabuk Kuiper, sehingga digolongkan sebagai planet kerdil."
  },
  {
   "topic": "benda-kecil",
   "difficulty": "sulit",
   "question": "Mengapa komet berperiode panjang dapat datang dari segala arah langit?",
   "options": [
    "Dilontarkan oleh letusan di permukaan Matahari",
    "Berasal dari sabuk asteroid yang miring",
    "Berasal dari Awan Oort yang berbentuk bola",
    "Dibelokkan oleh medan magnet Bumi"
   ],
   "answer": 2,
   "explanation": "Pada 1950 Jan Oort mengusulkan bahwa komet berperiode panjang berasal dari Awan Oort, kumpulan benda es berbentuk cangkang bola yang diperkirakan mengelilingi tata surya hingga sekitar 100.000 SA. Karena bentuknya membulat, komet dari wilayah itu dapat datang dari arah mana pun."
  },
  {
   "topic": "sejarah",
   "difficulty": "mudah",
   "question": "Siapa manusia pertama yang menjejakkan kaki di Bulan?",
   "options": [
    "Yuri Gagarin",
    "Buzz Aldrin",
    "Neil Armstrong",
    "Michael Collins"
   ],
   "answer": 2,
   "explanation": "Modul pendarat Apollo 11 mendarat di Bulan pada 20 Juli 1969, lalu Neil Armstrong keluar dan menjejakkan kaki di permukaan Bulan, disusul Buzz Aldrin. Michael Collins tetap mengorbit Bulan di dalam modul komando Columbia."
  },
  {
   "topic": "sejarah",
   "difficulty": "mudah",
   "question": "Siapa ilmuwan yang mengemukakan model heliosentris, yaitu Matahari sebagai pusat tata surya, dalam buku yang terbit pada 1543?",
   "options": [
    "Claudius Ptolemaeus",
    "Nicolaus Copernicus",
    "Isaac Newton",
    "Johannes Kepler"
   ],
   "answer": 1,
   "explanation": "Nicolaus Copernicus menerbitkan teorinya pada 1543, tidak lama sebelum ia wafat. Dalam model ini Bumi adalah salah satu planet yang beredar mengelilingi Matahari."
  },
  {
   "topic": "sejarah",
   "difficulty": "mudah",
   "question": "Pada 1610, Galileo Galilei mengamati empat satelit besar yang mengorbit sebuah planet melalui teleskop. Planet apakah itu?",
   "options": [
    "Jupiter",
    "Mars",
    "Saturnus",
    "Venus"
   ],
   "answer": 0,
   "explanation": "Keempat satelit itu adalah Io, Europa, Ganymede, dan Callisto, yang kini disebut satelit Galileo. Penemuan ini menjadi bukti yang mendukung teori heliosentris Copernicus."
  },
  {
   "topic": "sejarah",
   "difficulty": "mudah",
   "question": "Apa nama satelit buatan pertama di dunia yang diluncurkan Uni Soviet pada 4 Oktober 1957?",
   "options": [
    "Explorer 1",
    "Vostok 1",
    "Apollo 1",
    "Sputnik 1"
   ],
   "answer": 3,
   "explanation": "Peluncuran Sputnik 1 menandai dimulainya zaman antariksa. Satelit seukuran bola pantai ini mengelilingi Bumi sekali dalam sekitar 98 menit."
  },
  {
   "topic": "sejarah",
   "difficulty": "sedang",
   "question": "Planet manakah yang ditemukan William Herschel pada 1781 dan menjadi planet pertama yang ditemukan dengan bantuan teleskop?",
   "options": [
    "Saturnus",
    "Uranus",
    "Neptunus",
    "Mars"
   ],
   "answer": 1,
   "explanation": "Herschel menemukan Uranus pada 13 Maret 1781 dan awalnya mengira benda itu komet atau bintang. Merkurius, Venus, Mars, Jupiter, dan Saturnus sudah dikenal sejak zaman kuno karena dapat dilihat dengan mata telanjang."
  },
  {
   "topic": "sejarah",
   "difficulty": "sedang",
   "question": "Neptunus ditemukan pada 1846 dengan cara yang berbeda dari planet lain. Bagaimana caranya?",
   "options": [
    "Terlihat dengan mata telanjang",
    "Diramalkan lewat perhitungan matematika",
    "Terpotret oleh wahana antariksa",
    "Ditemukan tanpa sengaja saat gerhana"
   ],
   "answer": 1,
   "explanation": "Urbain Le Verrier menghitung posisi sebuah planet yang belum dikenal dari penyimpangan gerak Uranus, lalu Johann Galle menemukan Neptunus di Observatorium Berlin pada malam pertama pencariannya. Neptunus menjadi planet pertama yang ditemukan melalui ramalan matematika."
  },
  {
   "topic": "sejarah",
   "difficulty": "sedang",
   "question": "Pada April 2026, misi Artemis II membawa empat astronaut ke Bulan. Apa yang mereka lakukan?",
   "options": [
    "Mendarat di kutub selatan Bulan",
    "Membangun pangkalan di orbit Bulan",
    "Terbang mengitari Bulan lalu pulang",
    "Mengambil sampel batuan Bulan"
   ],
   "answer": 2,
   "explanation": "Artemis II diluncurkan pada 1 April 2026, terbang mengitari Bulan tanpa turun ke permukaannya, lalu mendarat di Samudra Pasifik setelah hampir 10 hari. Keempat awaknya menjadi manusia pertama yang pergi ke Bulan dalam lebih dari setengah abad."
  },
  {
   "topic": "sejarah",
   "difficulty": "sedang",
   "question": "Pada 23 Agustus 2023, India menjadi negara pertama yang mendaratkan wahana di dekat wilayah kutub selatan Bulan. Apa nama misinya?",
   "options": [
    "Chandrayaan-3",
    "Chandrayaan-1",
    "Chang'e 4",
    "SLIM"
   ],
   "answer": 0,
   "explanation": "Pendarat Vikram dari misi Chandrayaan-3 milik badan antariksa India (ISRO) mendarat dengan selamat, lalu menurunkan robot penjelajah Pragyan. Dengan pendaratan ini India menjadi negara keempat yang berhasil mendarat di Bulan."
  },
  {
   "topic": "sejarah",
   "difficulty": "sulit",
   "question": "Edmond Halley menggunakan teori gravitasi Newton untuk meramalkan kembalinya sebuah komet. Pada tahun berapa komet itu diramalkan kembali?",
   "options": [
    "1682",
    "1705",
    "1758",
    "1910"
   ],
   "answer": 2,
   "explanation": "Pada 1705 Halley menyimpulkan bahwa komet yang terlihat pada 1531, 1607, dan 1682 adalah komet yang sama, lalu meramalkan komet itu kembali pada 1758. Ramalannya terbukti, sehingga komet tersebut dinamai Komet Halley."
  },
  {
   "topic": "sejarah",
   "difficulty": "sulit",
   "question": "Wahana antariksa manakah yang menjadi benda buatan manusia pertama yang memasuki ruang antarbintang, pada Agustus 2012?",
   "options": [
    "Pioneer 10",
    "Voyager 2",
    "New Horizons",
    "Voyager 1"
   ],
   "answer": 3,
   "explanation": "Voyager 1 diluncurkan pada 5 September 1977 dan keluar dari heliosfer, gelembung raksasa yang dibentuk angin Matahari, pada 25 Agustus 2012. Di luar heliosfer itulah ruang antarbintang dimulai."
  }
 ],
 "timeline": [
  {
   "date": "-240",
   "year": -240,
   "category": "pengamatan",
   "title": "Catatan tertua Komet Halley",
   "detail": "Catatan astronom Tiongkok tentang sebuah komet pada 240 SM adalah pengamatan Komet Halley tertua yang sudah dipastikan. Komet ini mendekati Matahari rata-rata setiap 76 tahun, dan kemunculan berikutnya diperkirakan pada 2061."
  },
  {
   "date": "1543",
   "year": 1543,
   "category": "teori",
   "title": "Model heliosentris Copernicus",
   "detail": "Nicolaus Copernicus menerbitkan De revolutionibus orbium coelestium pada 1543, tak lama sebelum ia wafat. Di dalamnya ia menyatakan bahwa Bumi adalah planet seperti Venus atau Saturnus dan semua planet beredar mengelilingi Matahari, sedangkan pandangan yang dianut selama berabad-abad menempatkan Bumi diam di pusat alam semesta."
  },
  {
   "date": "1609",
   "year": 1609,
   "category": "teori",
   "title": "Hukum gerak planet Kepler",
   "detail": "Dalam Astronomia nova (1609) Johannes Kepler menunjukkan bahwa orbit planet berbentuk elips dengan Matahari di salah satu titik fokusnya, dan bahwa planet bergerak lebih cepat ketika dekat dengan Matahari. Hukum ketiganya, yang menghubungkan periode orbit dengan jarak rata-rata planet dari Matahari, terbit dalam Harmonices mundi pada 1619."
  },
  {
   "date": "1610-01-07",
   "year": 1610,
   "category": "penemuan",
   "title": "Galileo menemukan bulan-bulan Jupiter",
   "detail": "Pada 7 Januari 1610 Galileo Galilei melihat tiga titik cahaya di dekat Jupiter melalui teleskopnya, lalu titik keempat beberapa malam kemudian. Ia menyimpulkan bahwa keempatnya adalah bulan yang mengitari Jupiter (kini disebut Io, Europa, Ganymede, dan Callisto), bukti bahwa tidak semua benda langit beredar mengelilingi Bumi."
  },
  {
   "date": "1687-07-05",
   "year": 1687,
   "category": "teori",
   "title": "Newton menerbitkan Principia",
   "detail": "Philosophiae Naturalis Principia Mathematica karya Isaac Newton selesai dicetak pada 5 Juli 1687 dengan biaya dari Edmond Halley, yang juga mengawasi pencetakannya. Hukum gerak dan hukum gravitasi universal di dalamnya menjelaskan mengapa planet bergerak mengikuti hukum Kepler."
  },
  {
   "date": "1781-03-13",
   "year": 1781,
   "category": "penemuan",
   "title": "Herschel menemukan Uranus",
   "detail": "William Herschel melihat Uranus pada 13 Maret 1781 melalui teleskop buatannya sendiri di halaman belakang rumahnya di Bath, Inggris, dan semula mengira benda itu komet. Uranus menjadi planet pertama yang ditemukan dengan bantuan teleskop."
  },
  {
   "date": "1801-01-01",
   "year": 1801,
   "category": "penemuan",
   "title": "Piazzi menemukan Ceres",
   "detail": "Giuseppe Piazzi menemukan Ceres pada 1 Januari 1801 dari Observatorium Palermo di Sisilia. Ceres adalah anggota sabuk asteroid pertama yang ditemukan, dan sejak 2006 digolongkan sebagai planet kerdil."
  },
  {
   "date": "1846-09-23",
   "year": 1846,
   "category": "penemuan",
   "title": "Neptunus ditemukan lewat perhitungan",
   "detail": "Urbain Le Verrier menghitung letak sebuah planet tak dikenal yang dapat menjelaskan penyimpangan orbit Uranus. Pada 23 September 1846 Johann Galle dan Heinrich d'Arrest di Observatorium Berlin menemukannya sekitar 1 derajat dari posisi hitungan itu, sehingga Neptunus menjadi planet pertama yang ditemukan lewat perhitungan matematika."
  },
  {
   "date": "1923-01-01",
   "year": 1923,
   "category": "indonesia",
   "title": "Observatorium Bosscha diresmikan",
   "detail": "Observatorium Bosscha di Lembang, Jawa Barat, diresmikan pada 1 Januari 1923 atas prakarsa Karel Albert Rudolf Bosscha bersama Perhimpunan Astronomi Hindia Belanda (NISV). Pembangunan fasilitasnya berlanjut sampai 1928, ketika teleskop utamanya, refraktor ganda Zeiss, dipasang. Pada 17 Oktober 1951 observatorium ini diserahkan kepada pemerintah Indonesia, dan kini dikelola Institut Teknologi Bandung (ITB)."
  },
  {
   "date": "1930-02-18",
   "year": 1930,
   "category": "penemuan",
   "title": "Tombaugh menemukan Pluto",
   "detail": "Clyde Tombaugh menemukan Pluto pada 18 Februari 1930 di Observatorium Lowell, Flagstaff, Arizona, Amerika Serikat. Ia membandingkan pasangan pelat foto langit yang dipotret pada malam berbeda dengan alat blink comparator untuk mencari titik cahaya yang berpindah tempat."
  },
  {
   "date": "1957-10-04",
   "year": 1957,
   "category": "misi",
   "title": "Sputnik 1 mengorbit Bumi",
   "detail": "Uni Soviet meluncurkan Sputnik 1, satelit buatan pertama, pada 4 Oktober 1957. Peluncuran bola logam berdiameter 58 cm dan bermassa 83,6 kg ini memulai perlombaan antariksa antara Uni Soviet dan Amerika Serikat."
  },
  {
   "date": "1961-04-12",
   "year": 1961,
   "category": "misi",
   "title": "Yuri Gagarin, manusia pertama di antariksa",
   "detail": "Pada 12 April 1961 kosmonaut Uni Soviet Yuri Gagarin mengorbit Bumi dengan wahana Vostok 1 pada kecepatan sekitar 27.400 km/jam. Penerbangan pertama manusia ke antariksa itu berlangsung selama 108 menit."
  },
  {
   "date": "1963-11-27",
   "year": 1963,
   "category": "indonesia",
   "title": "LAPAN dibentuk",
   "detail": "Lembaga Penerbangan dan Antariksa Nasional (LAPAN) dibentuk pada 27 November 1963 melalui Keputusan Presiden Nomor 236 Tahun 1963, dengan nama awal Lembaga Penerbangan dan Angkasaluar Nasional. Pada 2021 LAPAN dilebur ke dalam Badan Riset dan Inovasi Nasional (BRIN)."
  },
  {
   "date": "1969-07-20",
   "year": 1969,
   "category": "misi",
   "title": "Apollo 11 mendarat di Bulan",
   "detail": "Neil Armstrong dan Buzz Aldrin mendaratkan modul Eagle di Laut Ketenangan (Mare Tranquillitatis) pada 20 Juli 1969, sementara Michael Collins tetap mengorbit Bulan. Armstrong menjadi manusia pertama yang berjalan di Bulan, dan misi ini membawa pulang sekitar 21,5 kg batuan serta tanah Bulan."
  },
  {
   "date": "1976-07-08",
   "year": 1976,
   "category": "indonesia",
   "title": "Satelit Palapa A1 diluncurkan",
   "detail": "Palapa A1, satelit pertama milik Indonesia, diluncurkan dengan roket Delta dari Cape Canaveral, Amerika Serikat, pada 8 Juli 1976 waktu setempat atau 9 Juli pagi waktu Indonesia. Satelit buatan Hughes Aircraft Company ini menjadi inti Sistem Komunikasi Satelit Domestik (SKSD) Palapa, yang diresmikan Presiden Soeharto pada 16 Agustus 1976 untuk menghubungkan telepon dan siaran televisi antarpulau."
  },
  {
   "date": "1977-08-20",
   "year": 1977,
   "category": "misi",
   "title": "Voyager 1 dan 2 diluncurkan",
   "detail": "Voyager 2 diluncurkan pada 20 Agustus 1977, disusul Voyager 1 pada 5 September 1977 dengan lintasan yang lebih cepat. Misi ini dirancang untuk memanfaatkan susunan Jupiter, Saturnus, Uranus, dan Neptunus yang terjadi sekitar 175 tahun sekali, sehingga wahana dapat berpindah dari satu planet ke planet berikutnya dengan bantuan gravitasi."
  },
  {
   "date": "1986-01-24",
   "year": 1986,
   "category": "misi",
   "title": "Voyager 2 melintasi Uranus",
   "detail": "Voyager 2 melintas sekitar 81.500 km dari puncak awan Uranus pada 24 Januari 1986. Dalam kunjungan itu wahana ini menemukan sepuluh bulan dan dua cincin yang sebelumnya belum diketahui."
  },
  {
   "date": "1986-03-14",
   "year": 1986,
   "category": "misi",
   "title": "Giotto mendekati Komet Halley",
   "detail": "Wahana Giotto milik Badan Antariksa Eropa (ESA) melintas sekitar 596 km dari inti Komet Halley pada 14 Maret 1986, jauh lebih dekat daripada Vega 1 dan Vega 2 milik Uni Soviet yang beberapa hari sebelumnya lewat sekitar 8.000 sampai 8.900 km dari inti. Foto-foto Giotto memperlihatkan inti yang sangat gelap dengan semburan gas dan debu."
  },
  {
   "date": "1989-08-25",
   "year": 1989,
   "category": "misi",
   "title": "Voyager 2 melintasi Neptunus",
   "detail": "Voyager 2 melintas kurang dari 5.000 km di atas puncak awan Neptunus pada 25 Agustus 1989, lalu sekitar 40.000 km dari Triton, bulan terbesarnya. Hingga kini belum ada wahana lain yang mengunjungi Uranus dan Neptunus."
  },
  {
   "date": "1990-04-24",
   "year": 1990,
   "category": "misi",
   "title": "Teleskop Antariksa Hubble diluncurkan",
   "detail": "Hubble, kerja sama NASA dan ESA, diluncurkan dengan pesawat ulang-alik Discovery pada 24 April 1990 dan dilepas ke orbit keesokan harinya. Di tata surya, Hubble antara lain menemukan empat bulan kecil Pluto pada 2005 sampai 2012."
  },
  {
   "date": "1994-07-16",
   "year": 1994,
   "category": "pengamatan",
   "title": "Komet Shoemaker-Levy 9 menabrak Jupiter",
   "detail": "Komet Shoemaker-Levy 9, yang sudah terpecah menjadi lebih dari 20 keping, menghantam Jupiter pada 16 sampai 22 Juli 1994 dan meninggalkan noda gelap besar di atmosfernya. Peristiwa ini adalah tabrakan dua benda tata surya pertama yang pernah diamati, antara lain oleh Teleskop Antariksa Hubble dan wahana Galileo."
  },
  {
   "date": "1997-10-15",
   "year": 1997,
   "category": "misi",
   "title": "Cassini-Huygens berangkat ke Saturnus",
   "detail": "Wahana Cassini-Huygens, kerja sama NASA, ESA, dan Badan Antariksa Italia, diluncurkan pada 15 Oktober 1997. Setelah hampir 7 tahun perjalanan, Cassini menjadi wahana pertama yang mengorbit Saturnus pada 1 Juli 2004."
  },
  {
   "date": "2005-01-14",
   "year": 2005,
   "category": "misi",
   "title": "Huygens mendarat di Titan",
   "detail": "Wahana pendarat Huygens buatan ESA turun selama 2 jam 27 menit menembus atmosfer Titan dan menyentuh permukaannya pada 14 Januari 2005. Huygens menjadi wahana pertama yang mendarat di benda langit di tata surya bagian luar, lalu masih mengirim data selama 72 menit dari permukaan."
  },
  {
   "date": "2006-08-24",
   "year": 2006,
   "category": "teori",
   "title": "IAU menetapkan definisi planet",
   "detail": "Sidang Umum Persatuan Astronomi Internasional (IAU) di Praha pada 24 Agustus 2006 menetapkan bahwa planet harus mengorbit Matahari, cukup masif sehingga bentuknya hampir bulat, dan sudah membersihkan lingkungan di sekitar orbitnya. Pluto tidak memenuhi syarat terakhir sehingga digolongkan sebagai planet kerdil, dan tata surya kini memiliki delapan planet."
  },
  {
   "date": "2012-08-25",
   "year": 2012,
   "category": "misi",
   "title": "Voyager 1 memasuki ruang antarbintang",
   "detail": "Pada 25 Agustus 2012 Voyager 1 keluar dari heliosfer, gelembung partikel berenergi dan medan magnet yang berasal dari Matahari. Wahana ini menjadi benda buatan manusia pertama di ruang antarbintang, dan Voyager 2 menyusul pada 2018."
  },
  {
   "date": "2015-07-14",
   "year": 2015,
   "category": "misi",
   "title": "New Horizons melintasi Pluto",
   "detail": "Diluncurkan pada 19 Januari 2006, New Horizons melintas dekat Pluto pada 14 Juli 2015 dan menjadi wahana pertama yang menjelajahi planet kerdil itu dari dekat. Foto-fotonya memperlihatkan Sputnik Planitia, hamparan es nitrogen yang luas di bagian barat wilayah berbentuk hati di permukaan Pluto."
  },
  {
   "date": "2016-03-09",
   "year": 2016,
   "category": "indonesia",
   "title": "Gerhana Matahari total melintasi Indonesia",
   "detail": "Jalur gerhana Matahari total pada 9 Maret 2016 melintasi Sumatera, Kalimantan, Sulawesi, dan Halmahera, termasuk kota Palembang, Palangka Raya, Palu, dan Ternate. Menurut LAPAN, totalitas terlama di Indonesia berlangsung sekitar 3 menit 17 detik di Maba, Maluku Utara."
  },
  {
   "date": "2016-07-05",
   "year": 2016,
   "category": "misi",
   "title": "Juno tiba di Jupiter",
   "detail": "Juno masuk orbit Jupiter pada 5 Juli 2016, atau 4 Juli waktu Amerika Serikat, hampir 5 tahun setelah diluncurkan. Wahana bertenaga surya pertama yang beroperasi di Jupiter ini juga yang pertama terbang melintasi kedua kutub planet itu dari dekat."
  },
  {
   "date": "2017-09-15",
   "year": 2017,
   "category": "misi",
   "title": "Akhir misi Cassini",
   "detail": "Setelah 13 tahun di sistem Saturnus, Cassini sengaja diterjunkan ke atmosfer Saturnus pada 15 September 2017 sambil terus mengirim data sampai akhir. Langkah ini mencegah mikroba yang mungkin terbawa wahana dari Bumi mencemari bulan-bulan Saturnus, termasuk Enceladus yang memiliki lautan air di bawah permukaannya."
  },
  {
   "date": "2018-08-12",
   "year": 2018,
   "category": "misi",
   "title": "Parker Solar Probe menuju Matahari",
   "detail": "Parker Solar Probe diluncurkan pada 12 Agustus 2018 dan pada 2021 menjadi wahana pertama yang terbang menembus korona, lapisan terluar atmosfer Matahari. Pada 24 Desember 2024 wahana ini melintas sekitar 6,1 juta km dari permukaan Matahari dengan kecepatan sekitar 692.000 km/jam, jarak terdekat dan kecepatan tertinggi yang pernah dicapai benda buatan manusia."
  },
  {
   "date": "2021-12-25",
   "year": 2021,
   "category": "misi",
   "title": "Teleskop Antariksa James Webb diluncurkan",
   "detail": "Webb, teleskop inframerah hasil kerja sama NASA, ESA, dan Badan Antariksa Kanada, diluncurkan dengan roket Ariane 5 dari Kourou, Guyana Prancis, pada 25 Desember 2021. Pada 2022 Webb menghasilkan citra cincin Neptunus paling jelas dalam lebih dari 30 tahun."
  },
  {
   "date": "2022-09-26",
   "year": 2022,
   "category": "misi",
   "title": "DART menabrak asteroid Dimorphos",
   "detail": "Wahana DART milik NASA sengaja ditabrakkan ke Dimorphos, asteroid kecil yang mengorbit asteroid Didymos, pada 26 September 2022. Tumbukan itu memperpendek periode orbit Dimorphos dari 11 jam 55 menit menjadi 11 jam 23 menit, perubahan gerak benda langit pertama yang sengaja dibuat manusia."
  },
  {
   "date": "2023-08-23",
   "year": 2023,
   "category": "misi",
   "title": "Chandrayaan-3 mendarat dekat kutub selatan Bulan",
   "detail": "Pendarat Vikram dari misi Chandrayaan-3 milik Organisasi Riset Antariksa India (ISRO) mendarat lunak pada 23 Agustus 2023 di sekitar 69,4° lintang selatan. India menjadi negara pertama yang mendarat di dekat kutub selatan Bulan dan negara keempat yang berhasil mendarat lunak di Bulan, setelah Uni Soviet, Amerika Serikat, dan Tiongkok."
  },
  {
   "date": "2024-10-14",
   "year": 2024,
   "category": "misi",
   "title": "Europa Clipper diluncurkan",
   "detail": "Wahana NASA ini berangkat dengan roket Falcon Heavy pada 14 Oktober 2024 dan dijadwalkan tiba di Jupiter pada April 2030. Dalam 49 kali terbang lintas dekat, Europa Clipper akan menyelidiki apakah lautan air asin di bawah kerak es Europa memiliki kondisi yang dapat mendukung kehidupan."
  },
  {
   "date": "2026-03-27",
   "year": 2026,
   "category": "indonesia",
   "title": "Uji cahaya pertama teleskop Timau",
   "detail": "Teleskop optik berdiameter 3,8 meter di Observatorium Nasional Timau, Kabupaten Kupang, Nusa Tenggara Timur, menjalani uji cahaya pertama teknis (engineering first light) pada 24 sampai 30 Maret 2026. Pada 27 Maret tim ITB dan BRIN memasang kamera Trioptika, lalu mengarahkan teleskop ke Bulan dan Jupiter."
  },
  {
   "date": "2026-04-01",
   "year": 2026,
   "category": "misi",
   "title": "Artemis II terbang mengitari Bulan",
   "detail": "Reid Wiseman, Victor Glover, dan Christina Koch dari NASA bersama Jeremy Hansen dari Badan Antariksa Kanada meluncur dengan wahana Orion pada 1 April 2026, penerbangan berawak pertama ke sekitar Bulan sejak Apollo 17 pada 1972. Pada 6 April mereka melintas sekitar 6.500 km dari permukaan Bulan dan mencapai sekitar 406.800 km dari Bumi, rekor jarak terjauh bagi manusia, sebelum mendarat di Samudra Pasifik pada 10 April."
  }
 ],
 "moonPhases": [
  {
   "key": "new",
   "name": "Bulan baru",
   "description": "Bulan berada di antara Bumi dan Matahari, sehingga sisi Bulan yang disinari Matahari membelakangi Bumi dan yang menghadap kita adalah sisi yang sedang mengalami malam. Pada fase ini Bulan tidak dapat dilihat, dan waktu terbit serta terbenamnya hampir bersamaan dengan Matahari. Gerhana Matahari hanya dapat terjadi pada fase ini."
  },
  {
   "key": "waxing-crescent",
   "name": "Sabit awal",
   "description": "Bagian terang Bulan berupa sabit tipis yang makin tebal dari malam ke malam, dengan sisi terang menghadap ke arah Matahari terbenam. Pada fase ini Bulan telah menempuh kurang dari seperempat orbitnya sejak Bulan baru, sehingga di langit letaknya tidak jauh di sebelah timur Matahari. Sabit awal terbit pada pagi hari setelah Matahari terbit dan terbenam pada malam hari setelah Matahari terbenam, jadi paling mudah dilihat di langit barat saat senja."
  },
  {
   "key": "first-quarter",
   "name": "Kuartal pertama",
   "description": "Separuh piringan Bulan tampak terang, dengan sisi terang menghadap ke barat, ke arah Matahari. Fase ini terjadi sekitar satu minggu setelah Bulan baru, ketika Bulan telah menempuh seperempat orbitnya sehingga arah Bulan dan arah Matahari, dilihat dari Bumi, membentuk sudut sekitar 90 derajat. Bulan kuartal pertama terbit sekitar tengah hari, berada tinggi di langit saat senja, dan terbenam sekitar tengah malam."
  },
  {
   "key": "waxing-gibbous",
   "name": "Cembung awal",
   "description": "Lebih dari separuh piringan Bulan tampak terang, dan bagian terangnya terus bertambah menuju purnama. Bulan berada di antara posisi kuartal pertama dan posisi berseberangan dengan Matahari. Bulan cembung awal terbit pada sore hari sebelum Matahari terbenam dan terbenam pada dini hari sebelum Matahari terbit, sehingga terlihat pada sebagian besar malam."
  },
  {
   "key": "full",
   "name": "Purnama",
   "description": "Seluruh piringan Bulan yang menghadap Bumi tampak terang. Bulan berada di sisi Bumi yang berseberangan dengan Matahari, sekitar dua minggu setelah Bulan baru, dan gerhana Bulan hanya dapat terjadi pada fase ini. Purnama terbit sekitar waktu Matahari terbenam dan terbenam sekitar waktu Matahari terbit, sehingga terlihat sepanjang malam."
  },
  {
   "key": "waning-gibbous",
   "name": "Cembung akhir",
   "description": "Lebih dari separuh piringan Bulan masih terang, tetapi bagian terangnya berkurang dari malam ke malam. Bulan sudah melewati posisi berseberangan dengan Matahari dan bergerak menuju posisi kuartal akhir. Bulan cembung akhir terbit pada malam hari setelah Matahari terbenam dan terbenam pada pagi hari setelah Matahari terbit, sehingga masih terlihat di langit barat pada pagi hari."
  },
  {
   "key": "last-quarter",
   "name": "Kuartal akhir",
   "description": "Separuh piringan Bulan kembali tampak terang, kali ini dengan sisi terang menghadap ke timur, ke arah Matahari terbit. Fase ini terjadi sekitar tiga minggu setelah Bulan baru, ketika Bulan telah menempuh tiga perempat orbitnya dan kembali membentuk sudut sekitar 90 derajat dengan arah Matahari. Bulan kuartal akhir terbit sekitar tengah malam dan terbenam sekitar tengah hari, jadi mudah diamati pada pagi hari."
  },
  {
   "key": "waning-crescent",
   "name": "Sabit akhir",
   "description": "Bagian terang Bulan tinggal sabit tipis yang menghadap ke arah Matahari terbit dan makin menipis menjelang Bulan baru. Bulan hampir kembali ke posisi di antara Bumi dan Matahari. Sabit akhir terbit pada dini hari sebelum Matahari terbit dan terbenam pada sore hari sebelum Matahari terbenam, jadi paling mudah dilihat di langit timur menjelang fajar."
  }
 ],
 "moonPhaseNote": "Di dekat khatulistiwa, termasuk Indonesia, Bulan dan Matahari terbit dan terbenam dengan lintasan yang hampir tegak lurus cakrawala. Karena sisi terang Bulan selalu menghadap Matahari, Bulan sabit di sini sering tampak telentang seperti perahu, sedangkan di lintang tinggi lintasannya lebih landai dan sabit lebih sering tampak miring dengan sisi terang di samping."
};
if (typeof module === 'object' && module.exports) module.exports = SOLAR_DATA;
