import { useState } from "react";
import { useNavigate } from "react-router-dom";

// IMPORT FILE AXIOS
import api from "../.././../../api/axios";

const useAddWarna = () => {
  const navigate = useNavigate();

  // STATE FORM
  const [formData, setFormData] = useState({
    value: "#000000",
    label: "",
  });

  const [audioFile, setAudioFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const authData = JSON.parse(localStorage.getItem("admin_auth"));

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const submitData = new FormData();

    submitData.append("category_id", 3); // WARNA
    submitData.append("value", formData.value);
    submitData.append("label", formData.label);

    if (audioFile) {
      submitData.append("audio", audioFile);
    }

    try {
      // --- PERUBAHAN: Gunakan api.post ---
      const response = await api.post("/contents", submitData, {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = response.data;

      if (result.success) {
        alert("Data warna berhasil disimpan!");
        navigate("/admin/warna/table");
      } else {
        alert(result.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error(error);
      const errMsg =
        error.response?.data?.message || "Server error saat simpan data";
      alert(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,

    audioFile,
    setAudioFile,

    isLoading,

    handleChange,
    handleSubmit,

    navigate,
  };
};

export default useAddWarna;