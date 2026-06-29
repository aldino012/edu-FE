import { useState, useCallback, useMemo } from "react";
import { GAME_STATUS, FEEDBACK_MESSAGES } from "../constants/partgameConstants";

/**
 * Fungsi utility untuk mengacak array (Fisher-Yates Shuffle)
 * Dipindahkan ke luar hook agar bisa di-hoist dengan benar
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Fungsi untuk mendapatkan pesan random dari array
 */
const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Custom hook untuk logika game "Ayo Membaca"
 * @param {Array} data - Array konten dari API
 * @returns {Object} - currentWord, syllables, options, status, feedback, handleAnswer, nextWord, score
 */
const useSyllableGame = (data) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState(GAME_STATUS.IDLE);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [selectedSyllables, setSelectedSyllables] = useState([]);

  // Ambil kata saat ini
  const currentWord = useMemo(() => {
    if (!data || data.length === 0) return null;
    return data[currentIndex] || null;
  }, [data, currentIndex]);

  // Ambil suku kata yang benar
  const correctSyllables = useMemo(() => {
    return currentWord?.syllables || [];
  }, [currentWord]);

  // Generate opsi jawaban (suku kata benar + distraktor)
  const options = useMemo(() => {
    if (!currentWord || correctSyllables.length === 0) return [];

    // Selalu masukkan semua suku kata yang benar
    const correct = [...correctSyllables];

    // Kumpulkan distraktor dari kata lain
    const allDistractors = new Set();
    const otherWords = data.filter((_, idx) => idx !== currentIndex);

    otherWords.forEach((word) => {
      if (word.syllables) {
        word.syllables.forEach((syllable) => {
          // Jangan masukkan suku kata yang sudah ada di correct
          if (!correct.includes(syllable)) {
            allDistractors.add(syllable);
          }
        });
      }
    });

    // Ambil maksimal 4 distraktor
    const distractors = Array.from(allDistractors).slice(0, 4);

    // Gabungkan: SEMUA suku kata benar + distraktor
    const allOptions = [...correct, ...distractors];

    // Acak dan batasi maksimal 8 opsi (agar grid tidak terlalu penuh)
    return shuffleArray(allOptions).slice(0, 8);
  }, [currentWord, correctSyllables, data, currentIndex]);

  // Handle pemilihan suku kata
  const handleSyllableSelect = useCallback(
    (syllable) => {
      if (status === GAME_STATUS.CORRECT || status === GAME_STATUS.COMPLETED)
        return;

      setStatus(GAME_STATUS.PLAYING);

      const newSelected = [...selectedSyllables, syllable];
      setSelectedSyllables(newSelected);

      // Cek apakah urutan sudah benar
      const isCorrectSoFar = newSelected.every(
        (syl, idx) => syl === correctSyllables[idx],
      );

      if (!isCorrectSoFar) {
        // Jawaban salah
        setStatus(GAME_STATUS.WRONG);
        setFeedback(getRandomMessage(FEEDBACK_MESSAGES.WRONG));

        // Reset setelah 1.5 detik
        setTimeout(() => {
          setSelectedSyllables([]);
          setStatus(GAME_STATUS.IDLE);
          setFeedback("");
        }, 1500);
      } else if (newSelected.length === correctSyllables.length) {
        // Jawaban benar dan lengkap
        setStatus(GAME_STATUS.CORRECT);
        setFeedback(getRandomMessage(FEEDBACK_MESSAGES.CORRECT));
        setScore((prev) => prev + 10);

        // Lanjut ke kata berikutnya setelah 2 detik
        setTimeout(() => {
          nextWord();
        }, 2000);
      }
    },
    [selectedSyllables, correctSyllables, status],
  );

  // Lanjut ke kata berikutnya
  const nextWord = useCallback(() => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedSyllables([]);
      setStatus(GAME_STATUS.IDLE);
      setFeedback("");
    } else {
      setStatus(GAME_STATUS.COMPLETED);
      setFeedback("🎉 Selamat! Kamu telah menyelesaikan semua kata!");
    }
  }, [currentIndex, data.length]);

  // Reset game
  const resetGame = useCallback(() => {
    setCurrentIndex(0);
    setSelectedSyllables([]);
    setStatus(GAME_STATUS.IDLE);
    setFeedback("");
    setScore(0);
  }, []);

  return {
    currentWord,
    correctSyllables,
    options,
    status,
    feedback,
    score,
    selectedSyllables,
    currentIndex,
    totalWords: data.length,
    handleSyllableSelect,
    nextWord,
    resetGame,
  };
};

export default useSyllableGame;
