# 🌍 GeoHeal: Soil Restoration & Agricultural Recovery AI

**GeoHeal** adalah asisten cerdas berbasis AI yang dirancang untuk membantu pemulihan sektor pertanian pasca-bencana. Aplikasi ini menggunakan teknologi *Computer Vision* untuk mengidentifikasi jenis tanah dan memberikan rekomendasi teknis rehabilitasi lahan secara instan.

---

## 📌 Problem Statement
Pasca bencana alam, proses penilaian kondisi tanah sering kali terhambat akibat rusaknya ekosistem dan terbatasnya tenaga ahli di lapangan. Hal ini menyebabkan petani kesulitan menentukan langkah pemulihan yang tepat. Tanpa informasi akurat, risiko kegagalan tanam meningkat, menghambat rehabilitasi ekonomi dan mengancam ketahanan pangan lokal.

## 🚀 Deskripsi Produk
HomeCheck adalah aplikasi berbasis web yang berfungsi sebagai asisten cerdas untuk inspeksi visual struktur tanah. Menggunakan arsitektur **MobileNet**, aplikasi ini mampu mengklasifikasikan 8 jenis kategori tanah secara otomatis berdasarkan foto yang diunggah pengguna untuk mendukung keputusan pemulihan lahan.

---

## 🛠️ Fitur Utama
* **Klasifikasi 8 Jenis Tanah**: Deteksi akurat untuk Aluvial, Andosol, Entisol, Humus, Inceptisol, Laterit, Kapur, dan Pasir.
* **Rekomendasi Pemulihan Detail**: Panduan langkah demi langkah yang mudah dipahami oleh masyarakat awam.
* **Database Riwayat**: Menyimpan log laporan kondisi tanah beserta lokasi untuk pemetaan area terdampak.
* **Aksesibilitas Tinggi**: Ringan (*low-latency*) dan dapat diakses melalui browser ponsel di area dengan sinyal terbatas.

## 💻 Teknologi yang Digunakan
* **Language**: Python
* **Framework**: TensorFlow, Keras, Gradio
* **Model**: MobileNetV2 (Convolutional Neural Network)
* **Deployment**: Docker, Hugging Face Spaces
* **Dataset**: Dataset Jenis Tanah (Kaggle)

---

## 📖 Cara Penggunaan
1. **Akses Aplikasi**: Buka tautan prototipe [GeoHeal di Hugging Face](https://huggingface.co/spaces/Ferdinann/GeoHeal).
2. **Unggah Gambar**: Ambil foto sampel tanah langsung di lokasi atau unggah dari galeri.
3. **Analisis**: Tunggu beberapa detik hingga sistem menampilkan jenis tanah dan probabilitasnya.
4. **Tindakan**: Ikuti langkah **Langkah Pemulihan** yang muncul (seperti pengapuran, pemberian mulsa, atau normalisasi irigasi).
5. **Laporkan**: Klik **"Laporkan Kondisi"** untuk menyimpan data ke database riwayat.

---

## 📈 Data Understanding
Dataset yang digunakan mencakup 8 kategori tanah yang masing-masing memiliki karakteristik visual unik:
* **Aluvial**: Endapan sungai yang subur.
* **Andosol**: Tanah vulkanik hitam kaya nutrisi.
* **Humus**: Tanah organik dari pembusukan vegetasi.
* **Lainnya**: Entisol, Inceptisol, Laterit, Kapur, dan Pasir.



---

## 🔮 Rencana Pengembangan
* **Integrasi GPS Otomatis**: Menambahkan koordinat lokasi secara otomatis pada setiap laporan.
* **Deteksi Unsur Hara**: Mengembangkan model untuk mendeteksi estimasi kadar pH secara visual.
* **Versi Mobile Native**: Konversi ke aplikasi Android APK untuk penggunaan offline.

---

## 👥 Tim Pengembang
* **Ferdinan** - *Developer & AI Engineer*
* Linkedin: [Ferdinanta Ginting](https://www.linkedin.com/in/ferdinanta)
* Prototipe: [Hugging Face Space](https://huggingface.co/spaces/Ferdinann/GeoHeal)

---
© 2026 GeoHeal Project - Solusi Teknologi untuk Ketahanan Pangan Pasca Bencana.
