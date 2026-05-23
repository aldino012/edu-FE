import { useEffect, useState } from "react";

// IMPORT FILE AXIOS
import api from "../.././../../api/axios";

export const useQuizTable = () => {
  const [dataQuiz, setDataQuiz] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // =====================
  // FETCH DATA QUIZ
  // =====================
  const fetchQuiz = async () => {
    setIsLoading(true);

    try {
      const authData = JSON.parse(localStorage.getItem("admin_auth"));

      // --- PERUBAHAN: Gunakan api.get ---
      const response = await api.get("/quizzes", {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = response.data;

      if (result.success) {
        setDataQuiz(result.data);
      }
    } catch (err) {
      console.error("Fetch quiz error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  // =====================
  // DELETE QUIZ
  // =====================
  const deleteQuiz = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus soal ini?");

    if (!confirmDelete) return;

    try {
      const authData = JSON.parse(localStorage.getItem("admin_auth"));

      // --- PERUBAHAN: Gunakan api.delete ---
      const response = await api.delete(`/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = response.data;

      if (result.success) {
        alert("Quiz berhasil dihapus");
        fetchQuiz();
      } else {
        alert(result.message || "Gagal hapus quiz");
      }
    } catch (err) {
      console.error("Delete quiz error:", err);
      const errMsg = err.response?.data?.message || "Server error";
      alert(errMsg);
    }
  };

  return {
    dataQuiz,
    isLoading,
    fetchQuiz,
    deleteQuiz,
  };
};
