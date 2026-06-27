import React from "react";
import Text from "../../../components/Text"; // Sesuaikan path relative Anda
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import { FaRedo } from "react-icons/fa";

// URL Supabase untuk folder 'images' di dalam bucket 'assets-fe'
const SUPABASE_BUCKET_URL =
  "https://ruvbopxooqgscpwadipr.supabase.co/storage/v1/object/public/assets-fe/images";

const QuizResult = ({ score, isPerfect, onPlayAgain, onBack }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full h-full">
      <Card className="relative z-10 max-w-md w-full bg-[#e0f2fe] text-center p-10 border-[6px] border-white rounded-[40px] shadow-2xl flex flex-col items-center">
        {/* Bagian GIF dan Pesan */}
        <div className="flex flex-col items-center mb-6 w-full">
          <img
            // PERUBAHAN: Menggunakan URL Supabase untuk kedua kondisi gambar
            src={
              isPerfect
                ? `${SUPABASE_BUCKET_URL}/k-senang.webp`
                : `${SUPABASE_BUCKET_URL}/sedih.webp`
            }
            alt={isPerfect ? "Senang" : "Sedih"}
            className="w-44 h-44 object-contain mb-6 drop-shadow-xl animate-bounce"
          />
          <Text
            className={`text-2xl font-black uppercase tracking-wider ${
              isPerfect ? "text-green-500" : "text-blue-500"
            }`}
          >
            {isPerfect ? "Hebat! Kamu Pintar!" : "Ayo Coba Lagi!"}
          </Text>
        </div>

        {/* Kotak Skor yang Presisi di Tengah */}
        <div className="bg-white rounded-[30px] w-[80%] py-6 mb-8 border-[4px] border-[#bae6fd] shadow-sm flex flex-col items-center justify-center">
          <Text className="text-slate-400 font-black mb-1 uppercase tracking-widest text-lg">
            Skor Kamu
          </Text>
          <Text className="text-7xl font-black text-blue-500 drop-shadow-md leading-none">
            {score}
          </Text>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col gap-5 w-[90%]">
          <Button
            onClick={onPlayAgain}
            variant="primary"
            className="w-full py-5 rounded-full text-xl shadow-[0_6px_0_#2563eb] active:translate-y-2 active:shadow-none transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <FaRedo />{" "}
              <Text
                className="font-black uppercase tracking-wider"
                textKey="Main Lagi"
              />
            </div>
          </Button>

          <button
            onClick={onBack}
            className="text-slate-400 font-black uppercase tracking-widest text-sm hover:text-slate-600 transition-colors mt-2"
          >
            Kembali ke Menu
          </button>
        </div>
      </Card>
    </div>
  );
};

export default QuizResult;