import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// IMPORT FILE AXIOS KITA DI SINI
import api from "../.././../../api/axios";

const useEditHuruf = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // FORM STATE
  const [formData, setFormData] = useState({
    value: "",
    label: "",
  });

  // FILE STATE
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  // LOADING
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // FETCH DETAIL
  useEffect(() => {
    const fetchDetailHuruf = async () => {
      const authData = JSON.parse(localStorage.getItem("admin_auth"));

      try {
        // --- PERUBAHAN: Menggunakan api.get ---
        const response = await api.get(`/contents/${id}`, {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        });

        const result = response.data;

        if (result.success) {
          setFormData({
            value: result.data.value,
            label: result.data.label,
          });
        } else {
          alert("Gagal mengambil data.");
          navigate("/admin/huruf/table");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        const errMsg =
          error.response?.data?.message || "Terjadi kesalahan pada server.";
        alert(errMsg);
        navigate("/admin/huruf/table");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchDetailHuruf();
    }
  }, [id, navigate]);

  // SUBMIT UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

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
      // --- PERUBAHAN: Menggunakan api.put ---
      const response = await api.put(`/contents/${id}`, submitData, {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
          // Content-Type multipart otomatis ditangani Axios
        },
      });

      const result = response.data;

      if (result.success) {
        alert("Data berhasil diupdate!");
        navigate("/admin/huruf/table");
      } else {
        alert(result.message || "Gagal update data");
      }
    } catch (error) {
      console.error("Update error:", error);
      const errMsg =
        error.response?.data?.message ||
        "Terjadi kesalahan server saat update.";
      alert(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    imageFile,
    audioFile,

    isFetching,
    isSubmitting,

    setImageFile,
    setAudioFile,

    handleChange,
    handleSubmit,

    navigate,
  };
};

export default useEditHuruf;