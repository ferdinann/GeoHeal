# 🌍 GeoHeal: Soil Restoration & Agricultural Recovery AI 🚨

**GeoHeal** adalah asisten cerdas berbasis AI yang dirancang untuk mempercepat pemulihan sektor pertanian pasca-bencana. Dengan teknologi *Computer Vision*, aplikasi ini mengidentifikasi jenis tanah dan memberikan rekomendasi teknis rehabilitasi lahan secara instan untuk mendukung ketahanan pangan lokal.

---

## 📌 Problem Statement
Pasca bencana alam, penilaian kondisi tanah sering terhambat karena rusaknya ekosistem dan terbatasnya tenaga ahli di lapangan. Hal ini menyebabkan petani kesulitan menentukan langkah pemulihan yang tepat, meningkatkan risiko kegagalan tanam, dan menghambat rehabilitasi ekonomi.

## 🏗️ Arsitektur & Teknologi
Aplikasi ini menggunakan sistem **Decoupled Architecture** untuk performa maksimal:
* **Frontend**: React.js (Dideploy di **Vercel**) – Antarmuka modern yang responsif, ringan, dan menggunakan gaya desain Glassmorphism.
* **Backend AI API**: Python (**Gradio Client**) – Dihosting secara skalabel di **Hugging Face Spaces** untuk pemrosesan model AI.
* **Core Model**: **MobileNetV2** (Convolutional Neural Network) yang dioptimalkan untuk klasifikasi visual cepat dan akurat.
* **Libraries**: TensorFlow, Keras, dan Gradio untuk integrasi model ke layanan web.

---

## ✨ Fitur Utama
* **Klasifikasi 8 Jenis Tanah**: Deteksi akurat untuk tanah Aluvial, Andosol, Entisol, Humus, Inceptisol, Laterit, Kapur, dan Pasir.
* **Rekomendasi Pemulihan Instan**: Panduan teknis (seperti pengapuran, pemberian mulsa, atau irigasi) yang mudah dipahami oleh masyarakat umum.
* **Aksesibilitas Tinggi**: Dioptimalkan untuk *low-latency* sehingga tetap dapat diakses melalui browser ponsel bahkan di area dengan koneksi terbatas.
* **Database Riwayat**: Kemampuan untuk menyimpan log laporan kondisi tanah guna pemetaan area terdampak secara berkelanjutan.

---

## 📖 Cara Penggunaan
1.  **Akses Aplikasi**: Buka URL resmi **GeoHeal di Vercel**.
2.  **Unggah Gambar**: Ambil foto sampel tanah langsung di lokasi atau unggah dari galeri ponsel.
3.  **Analisis AI**: Sistem mengirimkan data ke API Hugging Face dan menampilkan jenis tanah beserta probabilitasnya dalam hitungan detik.
4.  **Tindakan**: Ikuti panduan **Langkah Pemulihan** yang muncul berdasarkan hasil analisis model.
