import { useEffect, useState } from "react";

const API_URL = "/api";

export const useEditQuiz = (id) => {
  const [dataContents, setDataContents] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    question_text: "",
    opt_a: "",
    opt_b: "",
    opt_c: "",
    opt_d: "",
    answer_key: "A",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ======================
  // FETCH DATA EDIT
  // ======================
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const authData = JSON.parse(localStorage.getItem("admin_auth"));
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.token}`,
        };

        const [quizRes, contentRes] = await Promise.all([
          fetch(`${API_URL}/quizzes/${id}`, { headers }),
          fetch(`${API_URL}/contents`, { headers }),
        ]);

        const quizResult = await quizRes.json();
        const contentResult = await contentRes.json();

        if (!contentRes.ok || !contentResult.success) {
          throw new Error("Failed load contents");
        }

        setDataContents(contentResult.data);

        if (quizRes.ok && quizResult.success) {
          const quiz = quizResult.data;

          const findId = (label) => {
            const found = contentResult.data.find((c) => c.label === label);
            return found ? found.id : "";
          };

          setFormData({
            category_id: quiz.category?.id || quiz.category_id,
            question_text: quiz.question_text,
            opt_a: findId(quiz.option_a),
            opt_b: findId(quiz.option_b),
            opt_c: findId(quiz.option_c),
            opt_d: findId(quiz.option_d),
            answer_key: quiz.answer_key,
          });
        } else {
          throw new Error("Quiz not found");
        }
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil data quiz");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // ======================
  // UPDATE QUIZ
  // ======================
  const updateQuiz = async (navigate) => {
    const authData = JSON.parse(localStorage.getItem("admin_auth"));

    const contentA = dataContents.find((c) => c.id === +formData.opt_a);
    const contentB = dataContents.find((c) => c.id === +formData.opt_b);
    const contentC = dataContents.find((c) => c.id === +formData.opt_c);
    const contentD = dataContents.find((c) => c.id === +formData.opt_d);

    let correctId = null;

    if (formData.answer_key === "A") correctId = +formData.opt_a;
    if (formData.answer_key === "B") correctId = +formData.opt_b;
    if (formData.answer_key === "C") correctId = +formData.opt_c;
    if (formData.answer_key === "D") correctId = +formData.opt_d;

    const payload = {
      category_id: +formData.category_id,
      question_text: formData.question_text,
      option_a: contentA?.label || "",
      option_b: contentB?.label || "",
      option_c: contentC?.label || "",
      option_d: contentD?.label || "",
      correct_id: correctId,
    };

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/quizzes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Quiz berhasil diupdate");
        navigate("/admin/quiz/table");
      } else {
        alert(result.message || "Gagal update quiz");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    dataContents,
    isLoading,
    isSubmitting,
    updateQuiz,
  };
};
