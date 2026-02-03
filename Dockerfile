# Gunakan image Python resmi yang ringan
FROM python:3.10-slim

# Set lingkungan kerja di dalam container
WORKDIR /app

# Salin requirements dan instal library
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Salin seluruh isi folder proyek ke dalam container
COPY . .

# Berikan izin akses folder (untuk Hugging Face)
RUN chmod -R 777 /app

# Port yang digunakan Gradio
EXPOSE 7860

# Jalankan aplikasi
CMD ["python", "app.py"]