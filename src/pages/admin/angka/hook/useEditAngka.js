import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// IMPORT FILE AXIOS KITA DI SINI SESUAI PATH KAMU
import api from "../.././../../api/axios";

const useEditAngka = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // STATE FORM
  const [formData, setFormData] = useState({
    value: "",
    label: "",
  });

  const [audioFile, setAudioFile] = useState(null);

  // LOADING STATE
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authData = JSON.parse(localStorage.getItem("admin_auth"));

  // =====================
  // FETCH DETAIL DATA
  // =====================
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // --- PERUBAHAN: Gunakan api.get dan hilangkan awalan /api ---
        const response = await api.get(`/contents/${id}`, {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        });

        // Axios otomatis menaruh JSON response di dalam .data
        const result = response.data;

        if (result.success) {
          setFormData({
            value: result.data.value,
            label: result.data.label,
          });
        } else {
          alert("Gagal ambil data");
          navigate("/admin/angka/table");
        }
      } catch (error) {
        console.error(error);
        // Menangkap pesan error spesifik jika ada
        const errMsg =
          error.response?.data?.message || "Server error saat fetch data";
        alert(errMsg);
        navigate("/admin/angka/table");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  // =====================
  // HANDLE SUBMIT UPDATE
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const submitData = new FormData();

    submitData.append("category_id", 1);
    submitData.append("value", formData.value);
    submitData.append("label", formData.label);

    if (audioFile) {
      submitData.append("audio", audioFile);
    }

    try {
      // --- PERUBAHAN: Gunakan api.put dan hilangkan awalan /api ---
      const response = await api.put(`/contents/${id}`, submitData, {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
          // Content-Type multipart/form-data otomatis di-handle oleh Axios
        },
      });

      const result = response.data;

      if (result.success) {
        alert("Data angka berhasil diupdate!");
        navigate("/admin/angka/table");
      } else {
        alert(result.message || "Gagal update data");
      }
    } catch (error) {
      console.error(error);
      const errMsg =
        error.response?.data?.message || "Server error saat update";
      alert(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    id,

    formData,
    setFormData,

    audioFile,
    setAudioFile,

    isFetching,
    isSubmitting,

    handleSubmit,

    navigate,
  };
};

export default useEditAngka;