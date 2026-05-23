import React from "react";
import Text from "../../../components/Text"; // Sesuaikan path relative
import Card from "../../../components/Card";
import Button from "../../../components/Button";

// Menggunakan BackButton Global
import BackButton from "../../../components/BackButton";

const QuizBoard = ({
  currentQuiz,
  currentIndex,
  totalQuestions,
  selectedKey,
  isCorrect,
  onAnswer,
  onNext,
  onBack,
}) => {
  // Mengekstrak pilihan jawaban menjadi array agar mudah di-map
  const optionsEntries = currentQuiz?.options
    ? Object.entries(currentQuiz.options)
    : [];

  return (
    <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
      {/* HEADER NAV */}
      {/* Layout diubah menjadi justify-center karena tombol Back sudah fix/floating */}
      <div className="w-full flex items-center justify-center mb-6 pt-4">
        
        {/* Memanggil Komponen Global */}
        <BackButton onClick={onBack} />
        
        <div className="bg-white/40 px-6 py-3 rounded-full shadow-sm backdrop-blur-sm border-2 border-white/50">
          <Text className="text-slate-700 font-black text-xl tracking-wider uppercase">
            Soal {currentIndex + 1} / {totalQuestions}
          </Text>
        </div>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* CARD PERTANYAAN & FEEDBACK GIF */}
        <div className="relative w-full mb-10 flex justify-center">
          {selectedKey !== null && (
            <div
              className={`absolute -top-28 z-20 ${
                isCorrect ? "animate-bounce" : "animate-pulse"
              }`}
            >
              <img
                src={isCorrect ? "/images/senang.gif" : "/images/sedih.gif"}
                alt={isCorrect ? "Benar" : "Salah"}
                className="w-40 h-40 object-contain drop-shadow-2xl"
              />
            </div>
          )}

          <Card
            className={`w-full p-10 flex flex-col items-center border-[6px] rounded-[40px] transition-all duration-300 ${
              selectedKey !== null
                ? isCorrect
                  ? "border-green-400 bg-green-50"
                  : "border-red-400 bg-red-50"
                : "border-white bg-white"
            } shadow-xl`}
          >
            <Text
              variant="subtitle"
              align="center"
              className={`uppercase leading-tight font-black text-3xl ${
                selectedKey !== null
                  ? isCorrect
                    ? "text-green-600"
                    : "text-red-500"
                  : "text-slate-700"
              }`}
            >
              {selectedKey !== null
                ? isCorrect
                  ? "WAAH BENAR! 🎉"
                  : "YAHH, SALAH... 😢"
                : currentQuiz?.question_text}
            </Text>
          </Card>
        </div>

        {/* LIST PILIHAN JAWABAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-h-[300px]">
          {optionsEntries.map(([key, val]) => {
            if (!val) return null;
            const isThisSelected = selectedKey === key;
            const isThisCorrect =
              key.toUpperCase() === currentQuiz.answer_key.toUpperCase();

            // Logika styling tombol berdasarkan status jawaban
            let btnStyle =
              "bg-white text-slate-700 border-white hover:border-blue-300 hover:scale-[1.02] shadow-[0_8px_0_#cbd5e1]";
            if (selectedKey !== null) {
              if (isThisCorrect) {
                btnStyle =
                  "bg-green-400 border-green-400 text-white scale-105 z-10 shadow-[0_8px_0_#15803d]";
              } else if (isThisSelected) {
                btnStyle =
                  "bg-red-400 border-red-400 text-white shadow-none translate-y-2 opacity-90";
              } else {
                btnStyle =
                  "bg-white text-slate-300 border-slate-100 shadow-none opacity-50 grayscale";
              }
            }

            // Logika rendering visual (Gambar, Warna, atau Teks Angka/Huruf)
            let displayVisual = null;
            if (val.image_url && val.image_url.trim() !== "") {
              displayVisual = (
                <img
                  src={val.image_url}
                  alt={val.label}
                  className="w-28 h-28 object-contain mb-2 pointer-events-none drop-shadow-md"
                />
              );
            } else if (val.value && String(val.value).startsWith("#")) {
              displayVisual = (
                <div
                  className="w-24 h-24 rounded-full border-[6px] border-slate-100 shadow-inner mb-2"
                  style={{ backgroundColor: val.value }}
                ></div>
              );
            } else {
              displayVisual = (
                <div className="w-24 h-24 flex items-center justify-center mb-2">
                  <span className="text-6xl font-black text-slate-400 drop-shadow-sm">
                    {val.value || "?"}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={key}
                disabled={selectedKey !== null}
                onClick={() => onAnswer(key, val)}
                className={`p-6 rounded-[2.5rem] border-[4px] transition-all duration-200 flex flex-col items-center gap-2 active:translate-y-2 active:shadow-none ${btnStyle}`}
              >
                {displayVisual}
                <Text className="font-black text-2xl pointer-events-none uppercase tracking-wide">
                  {val.label}
                </Text>
              </button>
            );
          })}
        </div>

        {/* TOMBOL LANJUT */}
        <div className="h-24 mt-8 flex justify-center w-full">
          {selectedKey !== null && (
            <div className="animate-bounce w-full md:w-2/3">
              <Button
                onClick={onNext}
                variant="primary"
                className="w-full py-6 rounded-full text-2xl font-black uppercase shadow-[0_8px_0_#1e40af] active:translate-y-2 active:shadow-none transition-all"
              >
                <Text
                  textKey={
                    currentIndex === totalQuestions - 1
                      ? "Selesai & Lihat Nilai!"
                      : "Soal Selanjutnya"
                  }
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizBoard;