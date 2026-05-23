import { useEffect, useState } from "react";

const API_URL = "/api";

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

      const res = await fetch(`${API_URL}/quizzes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
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

      const res = await fetch(`${API_URL}/quizzes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        alert("Quiz berhasil dihapus");
        fetchQuiz();
      } else {
        alert(result.message || "Gagal hapus quiz");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return {
    dataQuiz,
    isLoading,
    fetchQuiz,
    deleteQuiz,
  };
};
