import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
        const response = await fetch(
          `/api/contents/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData?.token}`,
            },
          },
        );

        const result = await response.json();

        if (response.ok && result.success) {
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

        alert("Server error saat fetch data");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

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
      const response = await fetch(`/api/contents/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
        body: submitData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Data warna berhasil diupdate!");

        navigate("/admin/warna/table");
      } else {
        alert(result.message || "Gagal update data");
      }
    } catch (error) {
      console.error(error);

      alert("Server error saat update");
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
