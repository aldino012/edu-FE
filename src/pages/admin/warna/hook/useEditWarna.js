import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// IMPORT FILE AXIOS
import api from "../.././../../api/axios";

const useEditWarna = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // STATE FORM
  const [formData, setFormData] = useState({
    value: "#000000",
    label: "",
  });

  const [audioFile, setAudioFile] = useState(null);

  // LOADING STATE
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authData = JSON.parse(localStorage.getItem("admin_auth"));

  // =====================
  // FETCH DETAIL
  // =====================
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // --- PERUBAHAN: Gunakan api.get ---
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
          alert("Gagal ambil data");
          navigate("/admin/warna/table");
        }
      } catch (error) {
        console.error(error);
        const errMsg =
          error.response?.data?.message || "Server error saat fetch data";
        alert(errMsg);
        navigate("/admin/warna/table");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchDetail();
  }, [id, navigate]);

  // =====================
  // UPDATE DATA
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const submitData = new FormData();

    submitData.append("category_id", 3);
    submitData.append("value", formData.value);
    submitData.append("label", formData.label);

    if (audioFile) {
      submitData.append("audio", audioFile);
    }

    try {
      // --- PERUBAHAN: Gunakan api.put ---
      const response = await api.put(`/contents/${id}`, submitData, {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = response.data;

      if (result.success) {
        alert("Data warna berhasil diupdate!");
        navigate("/admin/warna/table");
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

export default useEditWarna;
