import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "/api";

export const useAddQuiz = () => {
  const navigate = useNavigate();

  // === STATE ===
  const [dataContents, setDataContents] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category_id: "",
    question_text: "",
    opt_a: "",
    opt_b: "",
    opt_c: "",
    opt_d: "",
    answer_key: "A",
  });

  const authData = JSON.parse(localStorage.getItem("admin_auth"));

  // === FETCH CONTENTS ===
  const fetchContents = async () => {
    setIsLoadingData(true);

    try {
      const res = await fetch(`${API}/contents`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setDataContents(result.data);
      }
    } catch (err) {
      console.error("Fetch contents error:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // === FILTER CONTENT BY CATEGORY ===
  const availableContents = dataContents.filter(
    (item) => item.category_id === parseInt(formData.category_id),
  );

  // === HANDLE CHANGE ===
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // === SUBMIT QUIZ ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.opt_a ||
      !formData.opt_b ||
      !formData.opt_c ||
      !formData.opt_d
    ) {
      alert("Lengkapi semua opsi jawaban!");
      return;
    }

    setIsSubmitting(true);

    try {
      const getContent = (id) =>
        dataContents.find((c) => c.id === parseInt(id));

      const optionA = getContent(formData.opt_a);
      const optionB = getContent(formData.opt_b);
      const optionC = getContent(formData.opt_c);
      const optionD = getContent(formData.opt_d);

      let correct_id = null;

      if (formData.answer_key === "A") correct_id = parseInt(formData.opt_a);
      if (formData.answer_key === "B") correct_id = parseInt(formData.opt_b);
      if (formData.answer_key === "C") correct_id = parseInt(formData.opt_c);
      if (formData.answer_key === "D") correct_id = parseInt(formData.opt_d);

      const payload = {
        category_id: parseInt(formData.category_id),
        question_text: formData.question_text,
        option_a: optionA?.label || "",
        option_b: optionB?.label || "",
        option_c: optionC?.label || "",
        option_d: optionD?.label || "",
        correct_id,
      };

      const res = await fetch(`${API}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Quiz berhasil ditambahkan!");
        navigate("/admin/quiz/table");
      } else {
        alert(result.message || "Gagal menyimpan quiz");
      }
    } catch (err) {
      console.error("Submit quiz error:", err);
      alert("Terjadi kesalahan server");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  return {
    formData,
    handleChange,

    dataContents,
    availableContents,

    isLoadingData,
    isSubmitting,

    handleSubmit,
  };
};
