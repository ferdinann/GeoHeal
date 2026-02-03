import gradio as gr
import tensorflow as tf
import numpy as np
import pandas as pd
from datetime import datetime
from PIL import Image

# --- KONFIGURASI GLOBAL ---
IMG_SIZE = (224, 224)
MODEL_PATH = 'model.h5'
class_names = ['Aluvial', 'Andosol', 'Entisol', 'Humus', 'Inceptisol', 'Laterit', 'Kapur', 'Pasir']
num_classes = len(class_names)
history_data = []

# --- LOAD MODEL ---
try:
    best_model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully")
except Exception as e:
    best_model = None
    print(f"❌ Error loading model: {e}")

incident_descriptions = {
    'Aluvial': ("🌾 **Aluvial (Tanah Endapan Sungai)**\n\n**Karakteristik:** Sangat subur karena membawa mineral dari hulu sungai.\n**Rekomendasi Tanaman:** Padi, jagung, kedelai, atau tebu.\n**Langkah Pemulihan:**\n1. **Bersihkan Lumpur Pekat:** Buang lapisan lumpur keras agar akar bisa bernapas.\n2. **Cek Saluran Air:** Pastikan air tidak menggenang (becek).\n3. **Gemburkan Ulang:** Cangkul ringan agar oksigen masuk ke tanah."),
    'Andosol': ("🌋 **Andosol (Tanah Vulkanik)**\n\n**Karakteristik:** Tanah hitam sangat kaya nutrisi abu gunung berapi.\n**Rekomendasi Tanaman:** Sayuran, kopi, atau teh.\n**Langkah Pemulihan:**\n1. **Terasering:** Buat gundukan bertingkat pada lahan miring.\n2. **Lindungi dari Angin:** Tanam pohon pelindung di pinggir lahan.\n3. **Siram Teratur:** Tanah ini cepat kering jika terpapar matahari langsung."),
    'Entisol': ("🌱 **Entisol (Tanah Muda)**\n\n**Karakteristik:** Tanah baru terbentuk, agak kasar dan belum matang.\n**Rekomendasi Tanaman:** Rumput pakan, ubi kayu, atau kacang tanah.\n**Langkah Pemulihan:**\n1. **Beri 'Makan' Tanah:** Campur pupuk kandang/kompos sebanyak mungkin.\n2. **Tanam Kacang-kacangan:** Membantu tanah mengambil nitrogen alami dari udara.\n3. **Hindari Bahan Kimia:** Gunakan pupuk alami agar struktur tanah tidak rusak."),
    'Humus': ("🍂 **Humus (Tanah Organik)**\n\n**Karakteristik:** Tanah paling subur dari pembusukan vegetasi alami.\n**Rekomendasi Tanaman:** Semua jenis tanaman pangan dan sayuran.\n**Langkah Pemulihan:**\n1. **Selimut Tanah (Mulsa):** Tutupi tanah dengan jerami/daun kering.\n2. **Jangan Dibakar:** Hindari membakar sampah di atas tanah ini.\n3. **Jaga Kelembapan:** Cukup siram secukupnya, jangan berlebihan."),
    'Inceptisol': ("🌳 **Inceptisol (Tanah Perkebunan)**\n\n**Karakteristik:** Tanah perkebunan yang nutrisinya mulai berkurang.\n**Rekomendasi Tanaman:** Kelapa sawit, karet, atau buah-buahan.\n**Langkah Pemulihan:**\n1. **Pupuk Berkala:** Gunakan pupuk NPK sesuai dosis rutin.\n2. **Bersihkan Gulma:** Cabut rumput liar di sekitar batang pohon.\n3. **Cangkul Melingkar:** Cangkul di sekitar pohon agar pupuk meresap ke akar."),
    'Laterit': ("🔴 **Laterit (Tanah Merah/Asam)**\n\n**Karakteristik:** Tanah tua kemerahan dan terasa masam.\n**Rekomendasi Tanaman:** Cengkeh, jambu mete, atau karet.\n**Langkah Pemulihan:**\n1. **Tabur Kapur (Dolomit):** Gunakan kapur putih untuk menetralkan asam.\n2. **Tambah Pupuk Organik:** Campurkan pupuk kandang untuk memperbaiki warna.\n3. **Hindari Genangan:** Jangan biarkan air mengendap agar tanah tidak memadat."),
    'Kapur': ("⚪ **Kapur (Tanah Mediteran)**\n\n**Karakteristik:** Berbatu putih, gersang, dan cepat kering.\n**Rekomendasi Tanaman:** Pohon jati, mahoni, atau srikaya.\n**Langkah Pemulihan:**\n1. **Tanam Pohon Keras:** Pilih pohon dengan akar kuat penembus batu.\n2. **Pupuk Hijau:** Tanam tumbuhan merambat sebagai penutup tanah.\n3. **Lubang Tanam Besar:** Isi lubang tanam dengan banyak kompos."),
    'Pasir': ("🏖️ **Pasir (Tanah Berpori)**\n\n**Karakteristik:** Butiran kasar, tidak simpan air, cepat panas.\n**Rekomendasi Tanaman:** Kelapa, buah naga, atau ubi jalar.\n**Langkah Pemulihan:**\n1. **Ikat Tanah:** Campur pupuk kandang dalam jumlah besar.\n2. **Siram Sore Hari:** Siram saat matahari tidak terik agar air tidak menguap.\n3. **Pupuk Sedikit tapi Sering:** Beri dosis kecil secara rutin.")
}

def predict_image(image_input):
    if best_model is None:
        return {}, "Model tidak tersedia."
    
    img = image_input.resize(IMG_SIZE)
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) / 255.0

    predictions = best_model.predict(img_array)
    scores = tf.nn.softmax(predictions[0]).numpy()
    
    output_dict = {class_names[i]: float(scores[i]) for i in range(num_classes)}
    top_label = max(output_dict, key=output_dict.get)
    top_confidence = output_dict[top_label]
    
    description = incident_descriptions.get(top_label, "Deskripsi tidak tersedia.")
    
    return output_dict, f"### 📍 Prediksi: **{top_label}** ({top_confidence:.2%})\n\n{description}"

def predict_only(img):
    if img is None: return {}, "Silakan upload gambar."
    return predict_image(img)

def predict_with_metadata(img, location):
    if img is None:
        return {}, pd.DataFrame(history_data, columns=["Waktu", "Jenis Tanah", "Lokasi"]), None, "Tidak ada gambar."

    output_dict, formatted_desc = predict_image(img)
    top_label = max(output_dict, key=output_dict.get)
    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    history_data.append([now, top_label, location if location else "-"])
    history_df = pd.DataFrame(history_data, columns=["Waktu", "Jenis Tanah", "Lokasi"])

    return output_dict, history_df, None, formatted_desc

# --- UI GRADIO ---
with gr.Blocks(theme=gr.themes.Soft(primary_hue="emerald")) as demo:
    gr.Markdown("# 🌍 GeoHeal AI Dashboard")
    gr.Markdown("Deteksi jenis tanah untuk pemulihan lahan pertanian pasca bencana.")

    with gr.Tabs():
        with gr.TabItem("📸 Analisis Real-time"):
            with gr.Row():
                with gr.Column():
                    input_img = gr.Image(sources=["upload", "webcam"], type="pil", label="Foto Tanah")
                    input_loc = gr.Textbox(label="Lokasi (Opsional)", placeholder="Contoh: Medan, Sumut")
                    btn_report = gr.Button("📋 LAPORKAN KONDISI", variant="primary")
                with gr.Column():
                    output_label = gr.Label(num_top_classes=3, label="Hasil Prediksi")
                    output_desc = gr.Markdown("_Hasil akan muncul di sini_")

        with gr.TabItem("📜 Riwayat Laporan"):
            output_history = gr.Dataframe(headers=["Waktu", "Jenis Tanah", "Lokasi"], interactive=False)

    input_img.change(fn=predict_only, inputs=input_img, outputs=[output_label, output_desc])
    btn_report.click(fn=predict_with_metadata, inputs=[input_img, input_loc], outputs=[output_label, output_history, input_img, output_desc])

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)