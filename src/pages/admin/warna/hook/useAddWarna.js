import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch("/api/contents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
        body: submitData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Data warna berhasil disimpan!");

        navigate("/admin/warna/table");
      } else {
        alert(result.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error(error);

      alert("Server error saat simpan data");
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
