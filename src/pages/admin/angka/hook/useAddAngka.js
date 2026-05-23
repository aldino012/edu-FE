import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch("/api/contents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
        body: submitData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Data angka berhasil disimpan!");
        navigate("/admin/angka/table");
      } else {
        alert(result.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error submit:", error);
      alert("Terjadi kesalahan server.");
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