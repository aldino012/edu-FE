import React from "react";
import Text from "../../components/Text";
import { useQuiz } from "./hooks/useQuiz";
import QuizBackground from "./components/QuizBackground";
import QuizBoard from "./components/QuizBoard";
import QuizResult from "./components/QuizResult";

const QuizPage = ({ onBack }) => {
  // 1. Panggil semua state dan actions dari Custom Hook
  const {
    questions,
    currentIndex,
    score,
    selectedKey,
    isCorrect,
    showResult,
    loading,
    currentQuiz,
    isPerfect,
    handleBack,
    handleAnswer,
    nextQuestion,
    resetQuiz,
  } = useQuiz(onBack);

  // 2. Handle Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#a2dff5] flex items-center justify-center">
        <Text
          textKey="Loading..."
          className="text-slate-800 text-3xl font-black animate-pulse"
        />
      </div>
    );
  }

  // 3. Render UI Utama
  return (
    <div className="relative min-h-screen bg-[#a2dff5] p-6 flex flex-col items-center overflow-hidden">
      {/* Background Partikel Lucu */}
      <QuizBackground />

      {/* Conditional Rendering: Jika showResult true tampilkan Hasil, jika false tampilkan Kuis */}
      {showResult ? (
        <QuizResult
          score={score}
          isPerfect={isPerfect}
          onPlayAgain={resetQuiz}
          onBack={handleBack}
        />
      ) : (
        <QuizBoard
          currentQuiz={currentQuiz}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          selectedKey={selectedKey}
          isCorrect={isCorrect}
          onAnswer={handleAnswer}
          onNext={nextQuestion}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default QuizPage;
