import React, { useState, useRef } from 'react';
import Webcam from "react-webcam";
import { Client } from "@gradio/client";
import EXIF from 'exif-js';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState("analisis");
  const [mode, setMode] = useState("gallery"); 
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [location, setLocation] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [facingMode] = useState("environment");
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- LOGIKA LOKASI & API ---
  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.display_name.split(',').slice(0, 3).join(',');
    } catch (error) {
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  const getLiveLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject("GPS tidak didukung");
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const addr = await fetchAddress(pos.coords.latitude, pos.coords.longitude);
        resolve(addr);
      }, (err) => reject(err));
    });
  };

  const getExifLocation = (file) => {
    return new Promise((resolve) => {
      EXIF.getData(file, function() {
        const lat = EXIF.getTag(this, "GPSLatitude");
        const lon = EXIF.getTag(this, "GPSLongitude");
        if (lat && lon) {
          const toDecimal = (gps, ref) => {
            let d = gps[0].numerator / gps[0].denominator;
            let m = gps[1].numerator / gps[1].denominator;
            let s = gps[2].numerator / gps[2].denominator;
            let dec = d + m / 60 + s / 3600;
            return ref === "S" || ref === "W" ? dec * -1 : dec;
          };
          resolve({ lat: toDecimal(lat, "N"), lon: toDecimal(lon, "E") });
        } else { resolve(null); }
      });
    });
  };

  const runPrediction = async (fileBlob) => {
    setLoading(true);
    setPrediction(null);
    try {
      const client = await Client.connect("https://ferdinann-geoheal.hf.space/");
      const result = await client.predict("/predict_only", { img: fileBlob });
      setPrediction(result.data); 
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;
      setImage(imageSrc);
      setLocation("Mendeteksi lokasi...");
      try {
        const addr = await getLiveLocation();
        setLocation(addr);
      } catch { setLocation("Lokasi tidak terdeteksi"); }
      const blob = await fetch(imageSrc).then(r => r.blob());
      runPrediction(blob);
    }
  };

  const saveToHistory = () => {
    if (!prediction) return;
    const label = prediction[0].label || "Terdeteksi";
    const newEntry = {
      id: Date.now(),
      waktu: new Date().toLocaleString('id-ID'),
      status: label,
      lokasi: location || "Lokasi tidak ditentukan"
    };
    setHistory([newEntry, ...history]);
    alert("Laporan GeoHeal berhasil disimpan!");
  };

  return (
    <div className="min-h-screen bg-[#0F171A] text-slate-200 font-sans antialiased">
      {/* Glossy Header - Responsive Updated */}
      <nav className="sticky top-0 z-50 bg-[#0F171A]/80 backdrop-blur-md border-b border-white/5 px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">🌍</div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase">
              GeoHeal<span className="text-emerald-500">AI</span>
            </h1>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab("analisis")} 
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "analisis" ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500"}`}
            >
              Analisis
            </button>
            <button 
              onClick={() => setActiveTab("riwayat")} 
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "riwayat" ? "bg-white shadow-md text-emerald-800" : "text-slate-500"}`}
            >
              Riwayat
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {activeTab === "analisis" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Sisi Kiri: Input */}
            <section className="lg:col-span-5 space-y-6">
              <div className="relative group aspect-square lg:aspect-video rounded-[2.5rem] bg-[#1A2428] overflow-hidden shadow-2xl border border-white/5 transition-all">
                <div className="absolute top-5 right-5 z-20 flex bg-[#0F171A]/90 backdrop-blur-md p-1 rounded-xl gap-1 border border-white/10">
                  <button onClick={() => setMode("camera")} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg ${mode === "camera" ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400"}`}>CAM</button>
                  <button onClick={() => setMode("gallery")} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg ${mode === "gallery" ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400"}`}>FILE</button>
                </div>

                {mode === "camera" ? (
                  <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode }} className="w-full h-full object-cover" />
                ) : (
                  <div onClick={() => fileInputRef.current.click()} className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                    {image ? <img src={image} className="w-full h-full object-cover animate-in fade-in duration-500" alt="Visual" /> : 
                      <div className="text-center group">
                        <div className="text-slate-700 text-6xl mb-4 group-hover:text-emerald-500/50 transition-colors">🌱</div>
                        <div className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Unggah Foto Tanah</div>
                      </div>
                    }
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setImage(ev.target.result);
                    reader.readAsDataURL(file);
                    setLocation("Menganalisis metadata...");
                    const coords = await getExifLocation(file);
                    if (coords) {
                      const addr = await fetchAddress(coords.lat, coords.lon);
                      setLocation(addr);
                    } else { setLocation("Lokasi tidak ditemukan di file"); }
                    runPrediction(file);
                  }
                }} className="hidden" accept="image/*" />
              </div>

              {mode === "camera" && (
                <button onClick={handleCapture} className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:bg-emerald-400 transition-all active:scale-[0.98]">
                  Ambil & Analisis
                </button>
              )}

              <div className="p-6 bg-[#1A2428] rounded-[2rem] border border-white/5 space-y-3 shadow-xl">
                <label className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest ml-1">Titik Lokasi Geospasial</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lokasi otomatis muncul di sini..." className="w-full bg-[#0F171A] border border-white/5 focus:border-emerald-500/50 rounded-xl px-5 py-4 text-sm font-medium transition-all outline-none" />
              </div>
            </section>

            {/* Sisi Kanan: Output */}
            <section className="lg:col-span-7 flex flex-col h-full">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-[#1A2428] rounded-[3rem] border border-white/5">
                  <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                  <p className="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500 animate-pulse">Deep Learning Analysis...</p>
                </div>
              ) : prediction ? (
                <div className="flex flex-col gap-6 h-full animate-in slide-in-from-bottom-10 duration-700">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-200/80 mb-4 block">Hasil Prediksi Tanah</span>
                    <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-none mb-4">
                      {prediction[0].label}
                    </h2>
                    <div className="inline-flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/10">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Akurasi Sistem Terverifikasi</span>
                    </div>
                  </div>

                  <div className="bg-[#1A2428] p-10 rounded-[3rem] border border-white/5 flex-grow">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px flex-grow bg-white/5"></div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Panduan Pemulihan Lahan</span>
                      <div className="h-px flex-grow bg-white/5"></div>
                    </div>
                    <div className="text-slate-300 font-medium leading-relaxed text-sm prose prose-invert max-w-none italic">
                      {prediction[1].toString().replace(/###|#|\*\*|---/g, '')}
                    </div>
                    <button onClick={saveToHistory} className="mt-10 w-full bg-white text-[#0F171A] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-500 hover:text-white transition-all">
                      💾 Arsipkan Laporan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3.5rem] p-12 text-center group">
                  <div className="w-20 h-20 bg-[#1A2428] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">🛰️</div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.5em] max-w-xs leading-loose">Menunggu Unggahan Citra Satelit atau Foto Lahan</p>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* Riwayat Dashboard */
          <div className="bg-[#1A2428] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl animate-in fade-in duration-700">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-emerald-500">Timestamp</th>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-emerald-500">Jenis Tanah</th>
                    <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-emerald-500">Koordinat / Lokasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.length > 0 ? history.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-10 py-7 font-bold text-slate-400 text-sm whitespace-nowrap">{item.waktu}</td>
                      <td className="px-10 py-7">
                        <span className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-10 py-7 text-slate-500 font-medium italic text-sm group-hover:text-slate-300">{item.lokasi}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="px-10 py-40 text-center text-slate-600 font-bold uppercase tracking-[0.5em] text-xs">Belum ada data laporan geospasial</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full py-12 text-center opacity-30">
        <p className="text-[9px] font-bold uppercase tracking-[0.8em]">GeoHeal Intelligent Systems • © 2026</p>
      </footer>
    </div>
  );
}

export default App;