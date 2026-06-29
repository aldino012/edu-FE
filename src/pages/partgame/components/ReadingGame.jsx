import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrophy,
  FaRedo,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import BackButton from "../../../components/BackButton";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import SyllableCard from "./SyllableCard";
import SyllableGrid from "./SyllableGrid";

import usePartgameData from "../hooks/usePartgameData";
import useSyllableGame from "../hooks/useSyllableGame";
import usePartgameAudio from "../hooks/usePartgameAudio";

const ReadingGame = () => {
  const { data, loading, error, refetch } = usePartgameData();
  const {
    currentWord,
    correctSyllables,
    options,
    status,
    feedback,
    score,
    selectedSyllables,
    currentIndex,
    totalWords,
    handleSyllableSelect,
    resetGame,
  } = useSyllableGame(data);

  const { playWord, isPlaying, cleanupAudio } = usePartgameAudio();

  const handlePlayWordAudio = (url) => {
    if (url) playWord(url);
  };

  const handleSyllableAudio = (syllable) => {
    console.log("Audio suku kata:", syllable);
  };

  const handleBack = () => {
    // Cleanup audio sebelum pindah halaman
    cleanupAudio();
    window.history.back();
  };

  const handleRestart = () => {
    resetGame();
  };

  // State: Loading
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <FaSpinner className="text-6xl text-white animate-spin drop-shadow-lg" />
          <h2 className="text-2xl font-bold text-white drop-shadow-md">
            Memuat Kata-kata...
          </h2>
        </motion.div>
      </div>
    );
  }

  // State: Error
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={handleBack}>
              Kembali
            </Button>
            <Button variant="primary" onClick={refetch}>
              Coba Lagi
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // State: Game Completed
  if (status === "completed") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-full max-w-lg"
        >
          <Card className="p-8 text-center bg-white bg-opacity-95 shadow-2xl">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mb-6"
            >
              <FaTrophy className="text-8xl text-yellow-400 mx-auto drop-shadow-lg" />
            </motion.div>

            <h1 className="text-4xl font-bold text-gray-800 mb-2">Hebat!</h1>
            <p className="text-xl text-gray-600 mb-6">
              Kamu berhasil menyelesaikan semua kata!
            </p>

            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-1">
                Skor Akhir
              </p>
              <p className="text-5xl font-bold text-blue-700">{score}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="secondary"
                onClick={handleBack}
                className="flex-1"
              >
                Kembali ke Menu
              </Button>
              <Button
                variant="primary"
                onClick={handleRestart}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <FaRedo />
                Main Lagi
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // State: Playing Game (Default)
  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <BackButton onClick={handleBack} />

        <div className="flex items-center gap-4">
          {/* Score Badge */}
          <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <FaTrophy className="text-yellow-500 text-lg" />
            <span className="font-bold text-gray-800 text-lg">{score}</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          Ayo Membaca
        </h1>
        <p className="text-white text-opacity-90 mt-2 text-sm sm:text-base">
          Susun suku kata menjadi kata yang benar!
        </p>
      </div>

      {/* Main Game Area */}
      <AnimatePresence mode="wait">
        {/* Kartu Kata (Atas) */}
        <motion.div
          key={`card-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <SyllableCard
            currentWord={currentWord}
            selectedSyllables={selectedSyllables}
            correctSyllables={correctSyllables}
            status={status}
            onPlayAudio={handlePlayWordAudio}
            currentIndex={currentIndex}
            totalWords={totalWords}
          />
        </motion.div>

        {/* Grid Opsi Suku Kata (Bawah) */}
        <motion.div
          key={`grid-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <SyllableGrid
            options={options}
            correctSyllables={correctSyllables}
            selectedSyllables={selectedSyllables}
            status={status}
            onSelect={handleSyllableSelect}
            onPlayAudio={handleSyllableAudio}
            disabled={isPlaying}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ReadingGame;
