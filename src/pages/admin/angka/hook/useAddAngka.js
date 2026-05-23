import { useState } from "react";
import { useNavigate } from "react-router-dom";

// IMPORT FILE AXIOS KITA DI SINI
// Sesuaikan '../path/to/api' dengan lokasi file axios.js / api.js kamu di dalam folder src
import api from "../.././../../api/axios";

/**
 * Helper: Mengubah angka 0-100 menjadi teks terbilang Bahasa Indonesia
 * (Sama dengan logika di Backend agar konsisten)
 */
const getTerbilang = (n) => {
  if (n === "") return "";
  const satuan = [
    "Nol",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];
  const num = parseInt(n);

  if (isNaN(num)) return "";
  if (num <= 11) return satuan[num];
  if (num < 20) return getTerbilang(num % 10) + " Belas";
  if (num < 100) {
    const hasilPuluhan = satuan[Math.floor(num / 10)] + " Puluh";
    const sisa = num % 10;
    return sisa !== 0 ? hasilPuluhan + " " + satuan[sisa] : hasilPuluhan;
  }
  if (num === 100) return "Seratus";

  return n.toString();
};

const useAddAngka = () => {
  const navigate = useNavigate();

  // STATE
  const [formData, setFormData] = useState({
    value: "",
    label: "",
  });

  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // HANDLE INPUT DENGAN AUTO-FILL TERBILANG
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "value") {
      // Hanya izinkan angka dan batasi 0 - 100
      const num = value === "" ? "" : parseInt(value);

      if (value !== "" && (isNaN(num) || num < 0 || num > 100)) {
        return; // Jangan update jika bukan angka valid 0-100
      }

      setFormData({
        value: value,
        label: getTerbilang(value), // Otomatis isi label terbilang
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const authData = JSON.parse(localStorage.getItem("admin_auth"));

    const submitData = new FormData();

    // category_id 1 adalah Angka
    submitData.append("category_id", 1);
    submitData.append("value", formData.value);
    submitData.append("label", formData.label);

    if (audioFile) {
      submitData.append("audio", audioFile);
    }

    try {
      // --- PERUBAHAN UTAMA: MENGGUNAKAN AXIOS (api) ---
      // Kita cukup panggil "/contents" karena baseURL di api.js sudah ada "/api"
      const response = await api.post("/contents", submitData, {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
          // Axios otomatis mengenali FormData dan mengatur Content-Type multipart/form-data
        },
      });

      // Axios menyimpan hasil JSON di dalam properti .data
      const result = response.data;

      if (result.success) {
        alert("Data angka berhasil disimpan!");
        navigate("/admin/angka/table");
      } else {
        alert(result.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error submit:", error);
      // Menangkap pesan error dari backend jika statusnya 4xx atau 5xx
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan server.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    audioFile,
    isLoading,

    setAudioFile,

    handleChange,
    handleSubmit,

    navigate,
  };
};

export default useAddAngka;
