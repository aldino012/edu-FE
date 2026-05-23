import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Kamus otomatis untuk label huruf
const kamusHuruf = {
  A: "Ayam",
  B: "Babi",
  C: "Cicak",
  D: "Domba",
  E: "Elang",
  F: "Flaminggo",
  G: "Gajah",
  H: "Harimau", // Menambahkan H yang terlewat
  I: "Itik",
  J: "Jerapah",
  K: "Kucing",
  L: "Lebah",
  M: "Monyet",
  N: "Naga",
  O: "Orang Utan",
  P: "Pinguin",
  Q: "Quran",
  R: "Rubah",
  S: "Sapi",
  T: "T-Rex",
  U: "Ular",
  V: "Violin",
  W: "Wortel",
  X: "Xesophone",
  Y: "Yuyu",
  Z: "Zebrah",
};

const useAddHuruf = () => {
  const navigate = useNavigate();

  // STATE
  const [formData, setFormData] = useState({
    value: "",
    label: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // HANDLE INPUT DENGAN AUTO-FILL LABEL
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "value") {
      // Ambil hanya 1 karakter pertama dan jadikan huruf besar
      const char = value.charAt(0).toUpperCase();

      setFormData({
        value: char,
        label: kamusHuruf[char] || "", // Otomatis isi label berdasarkan kamus
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

    submitData.append("category_id", 2);
    submitData.append("value", formData.value);
    submitData.append("label", formData.label);

    if (imageFile) {
      submitData.append("image", imageFile);
    }

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
        alert("Data berhasil disimpan!");

        navigate("/admin/huruf/table");
      } else {
        alert(result.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error simpan data:", error);

      alert("Terjadi kesalahan pada server.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    imageFile,
    audioFile,
    isLoading,

    setImageFile,
    setAudioFile,

    handleChange,
    handleSubmit,

    navigate,
  };
};

export default useAddHuruf;