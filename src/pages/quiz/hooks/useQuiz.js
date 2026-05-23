import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios"; // Sesuaikan path jika berbeda

export const useQuiz = (onBack) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Memuat data saat komponen pertama kali di-mount
  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await api.get("/quizzes/play");
      setQuestions(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Gagal memuat kuis:", err);
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) onBack();
    else navigate("/");
  };

  const handleAnswer = (key, optionData) => {
    if (selectedKey !== null) return; // Mencegah klik ganda

    setSelectedKey(key);
    const currentQuiz = questions[currentIndex];
    const correct = key.toUpperCase() === currentQuiz.answer_key.toUpperCase();
    setIsCorrect(correct);

    // Putar suara apapun jawabannya
    if (optionData && optionData.audio_url) {
      const audio = new Audio(optionData.audio_url);
      audio.play().catch((err) => console.log("Gagal memutar audio:", err));
    }

    // Tambah skor HANYA jika jawaban benar
    if (correct) {
      setScore((prev) => prev + 20);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedKey(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  // Fungsi untuk mereset kuis (Diekstrak dari tombol Main Lagi)
  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedKey(null);
    setIsCorrect(null);
    setShowResult(false);
    fetchQuiz();
  };

  // Membuat partikel background lucu
  const particles = useMemo(() => {
    const items = [];
    const types = ["star", "dot", "dot"];
    for (let i = 0; i < 30; i++) {
      items.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        top: `${Math.floor(Math.random() * 100)}%`,
        left: `${Math.floor(Math.random() * 100)}%`,
        size: Math.floor(Math.random() * 20) + 15,
        rotate: `${Math.floor(Math.random() * 360)}deg`,
        opacity: (Math.random() * 0.15 + 0.05).toFixed(2),
      });
    }
    return items;
  }, []);

  // Variabel turunan untuk mempermudah akses di komponen UI
  const currentQuiz = questions[currentIndex];
  const isPerfect = score >= 60; // Anggap benar 3 dari 5 adalah skor bagus

  return {
    // State & Data
    questions,
    currentIndex,
    score,
    selectedKey,
    isCorrect,
    showResult,
    loading,
    particles,
    currentQuiz,
    isPerfect,

    // Actions
    handleBack,
    handleAnswer,
    nextQuestion,
    resetQuiz,
  };
};
