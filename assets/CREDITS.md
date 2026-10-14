# Kredit aset

## Tekstur planet (`assets/textures/`)

| Berkas | Sumber | Lisensi |
|---|---|---|
| `sun_*`, `mercury_*`, `venus_*`, `earth_day_*`, `earth_night_*`, `earth_clouds_*`, `earth_normal_*`, `moon_*`, `mars_*`, `jupiter_*`, `saturn_*`, `uranus_*`, `neptune_*`, `stars_*` | [Solar System Scope](https://www.solarsystemscope.com/textures/) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| `saturn_ring_8k.png`, `saturn_ring_4k.png` | Peta cincin Saturnus 8K (dengan kanal transparansi) dari [Solar System Scope](https://www.solarsystemscope.com/textures/), tingginya diperkecil menjadi 64 piksel karena cincin hanya berubah ke arah jari-jari. Peta ini mencakup 69.647 sampai 140.971 km dari pusat Saturnus (dicocokkan dari tepi luar cincin B, celah Encke, dan tepi luar cincin A) | CC BY 4.0 |
| `earth_roughness_*` | Dibuat dari peta specular Bumi Solar System Scope (dibalik: laut mengilap, daratan kasar) | CC BY 4.0 |
| `pluto_*` | [NASA/JHUAPL/SwRI, peta warna global Pluto dari New Horizons](https://science.nasa.gov/resource/pluto-global-color-map) | Pedoman penggunaan media NASA |
| `moons/*` | Peta 20 satelit dari mosaik Galileo, Cassini, Voyager, Viking, dan New Horizons (USGS Astrogeology, NASA/JPL, DLR, LPI, JHUAPL/SwRI). Sumber, lisensi, dan pengolahan per satelit ada di [moons/CREDITS.md](textures/moons/CREDITS.md) | Domain publik (data NASA/USGS); peta Deimos wajib mencantumkan kredit P. Stooke |

Semua tekstur planet diperkecil menjadi 1024, 2048, dan 4096 piksel (lebar), lalu disimpan ulang sebagai JPEG. Peta Pluto tidak mencakup sebagian belahan selatan yang belum pernah dipotret New Horizons; wilayah itu diisi warna rata-rata permukaan di dekatnya, tanpa detail tambahan.

Cincin Uranus tidak memakai berkas gambar. Garisnya digambar dari jari-jari dan lebar sepuluh cincin utama di [NASA NSSDCA Uranian Rings Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranringfact.html). Aslinya cincin itu sangat gelap (albedo sekitar 0,015) dan jauh lebih tipis dari satu piksel layar, jadi di sini tiap cincin digambar minimal setebal 1 piksel dan lebih terang supaya terlihat.

## Gambar deretan benda (`assets/thumbs.webp`)

Dirender oleh `tools/make_thumbs.py` dari tekstur di atas (Solar System Scope CC BY 4.0 dan peta Pluto NASA/JHUAPL/SwRI).

## Huruf (`assets/fonts/`)

Plus Jakarta Sans karya Tokotype, lisensi SIL Open Font License 1.1 (lihat `OFL.txt`).

## Pustaka (`js/vendor/three/`)

[three.js](https://threejs.org/) r186, lisensi MIT (lihat `js/vendor/three/LICENSE`). Berkas diperkecil (minify) tanpa diubah isinya.
