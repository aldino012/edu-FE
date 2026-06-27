import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Text from "../../components/Text";

// IMPORT KOMPONEN & HOOK GLOBAL
import BackButton from "../../components/BackButton";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";

import { useAngkaData } from "./hooks/useAngkaData";
import { useAngkaAudio } from "./hooks/useAngkaAudio";

import AngkaGrid from "./components/AngkaGrid";
import { mathPattern } from "./constants/angkaConstants";

// URL Supabase untuk folder 'images' di dalam bucket 'assets-fe'
const SUPABASE_BUCKET_URL =
  "https://ruvbopxooqgscpwadipr.supabase.co/storage/v1/object/public/assets-fe/images";

const AngkaPage = ({ onBack }) => {
  const navigate = useNavigate();

  // DATA
  const { fullAngkaList, loading } = useAngkaData();

  // PAGINATION GLOBAL
  // PERUBAHAN: Hapus parameter itemsPerPage (sudah diatur di dalam hook usePagination)
  // Kita alias-kan currentItems menjadi currentCards agar sesuai dengan props AngkaGrid
  const {
    currentPage,
    totalPages,
    currentItems: currentCards,
    nextPage,
    prevPage,
  } = usePagination(fullAngkaList); // ← Hapus ", 6"

  // AUDIO
  const { playAudio, stopAudio, cleanupAudio } = useAngkaAudio();

  // STATE UI
  const [flippedCard, setFlippedCard] = useState(null);

  // FLIP HANDLER
  const handleFlip = (item) => {
    if (flippedCard === item.id) {
      setFlippedCard(null);
      stopAudio();
    } else {
      setFlippedCard(item.id);
      playAudio(item.audio_url);
    }
  };

  // PAGINATION WRAPPER (untuk mereset audio & flip saat pindah halaman)
  const handleNextPage = () => {
    stopAudio();
    setFlippedCard(null);
    nextPage();
  };

  const handlePrevPage = () => {
    stopAudio();
    setFlippedCard(null);
    prevPage();
  };

  // CLEANUP AUDIO
  useEffect(() => {
    return () => cleanupAudio();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] relative overflow-hidden flex flex-col">
      {/* OVERLAY TULISAN MATEMATIKA */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {mathPattern.map((item) => (
          <span
            key={item.id}
            className={`absolute font-black text-emerald-800/10 ${item.size}`}
            style={{
              top: item.top,
              left: item.left,
              transform: `rotate(${item.rotate})`,
            }}
          >
            {item.char}
          </span>
        ))}
      </div>

      {/* BACK BUTTON GLOBAL */}
      <BackButton onClick={() => (onBack ? onBack() : navigate("/"))} />

      {/* CONTENT */}
      {/* Menggunakan pt-20 agar konten tidak tertutup oleh tombol back yang fixed */}
      <div className="relative z-30 flex-1 flex flex-col items-center px-4 pt-20 md:pt-24">
        {loading ? (
          <div className="flex justify-center p-20">
            <Text
              textKey="loading"
              className="text-emerald-800 font-bold animate-bounce text-xl"
            />
          </div>
        ) : (
          <>
            {/* GRID */}
            <AngkaGrid
              items={currentCards}
              flippedCard={flippedCard}
              onFlip={handleFlip}
            />

            {/* PAGINATION GLOBAL */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
            />
          </>
        )}
      </div>

      {/* DECORATION BOTTOM */}
      <div className="absolute bottom-[6vh] left-0 w-full px-[4%] flex items-end justify-between z-20 pointer-events-none">
        <img
          src={`${SUPABASE_BUCKET_URL}/guru.png`}
          className="h-[35vh]"
          alt="Guru"
        />

        <div className="flex items-end gap-2 md:gap-6 lg:gap-10">
          <img
            src={`${SUPABASE_BUCKET_URL}/anak-1.png`}
            className="h-[22vh]"
            alt="Anak 1"
          />
          <img
            src={`${SUPABASE_BUCKET_URL}/anak-2.png`}
            className="h-[23vh]"
            alt="Anak 2"
          />
          <img
            src={`${SUPABASE_BUCKET_URL}/anak-3.png`}
            className="h-[21vh]"
            alt="Anak 3"
          />
        </div>

        <div className="flex items-end gap-2 md:gap-4">
          <img
            src={`${SUPABASE_BUCKET_URL}/buku-1.png`}
            className="h-[10vh]"
            alt="Buku 1"
          />
          <img
            src={`${SUPABASE_BUCKET_URL}/buku-2.png`}
            className="h-[13vh]"
            alt="Buku 2"
          />
          <img
            src={`${SUPABASE_BUCKET_URL}/buku-3.png`}
            className="h-[9vh]"
            alt="Buku 3"
          />
        </div>
      </div>

      {/* FLOOR */}
      {/* Perhatikan penulisan background-image yang menggunakan template literal backtick */}
      <div
        className="absolute bottom-0 left-0 w-full h-[24vh] bg-cover bg-bottom bg-no-repeat z-10 pointer-events-none"
        style={{ backgroundImage: `url('${SUPABASE_BUCKET_URL}/lantai.png')` }}
      />
    </div>
  );
};

export default AngkaPage;