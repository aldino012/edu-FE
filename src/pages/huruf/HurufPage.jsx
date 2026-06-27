import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useHurufData from "./hooks/useHurufData";
import useHurufAudio from "./hooks/useHurufAudio";

import HurufCard from "./components/HurufCard";

// IMPORT KOMPONEN & HOOK GLOBAL
import usePagination from "../../hooks/usePagination";
import BackButton from "../../components/BackButton";
import Pagination from "../../components/Pagination";

// URL Supabase untuk mengarah ke folder 'images' di dalam bucket 'assets-fe'
const SUPABASE_BUCKET_URL =
  "https://ruvbopxooqgscpwadipr.supabase.co/storage/v1/object/public/assets-fe/images";

const HurufPage = ({ onBack }) => {
  const navigate = useNavigate();

  // ================= DATA =================
  const { hurufList, loading } = useHurufData();

  // ================= AUDIO + FLIP =================
  const { flippedCard, handleFlip, stopAudio, cleanupAudio } = useHurufAudio();

  // ================= PAGINATION GLOBAL =================
  // PERUBAHAN: Hapus parameter itemsPerPage (sudah diatur di dalam hook)
  const { currentPage, totalPages, currentItems, nextPage, prevPage } =
    usePagination(hurufList); // ← itemsPerPage = 10 sudah dihapus

  // Wrapper pagination untuk memastikan audio berhenti saat ganti halaman
  const handleNextPage = () => {
    stopAudio();
    nextPage();
  };

  const handlePrevPage = () => {
    stopAudio();
    prevPage();
  };

  // ================= RESET EFFECT =================
  useEffect(() => {
    stopAudio();
  }, [currentPage]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#7BD3FA] overflow-hidden font-['Fredoka',_'Comic_Sans_MS',_sans-serif] text-slate-800 flex flex-col justify-between">
      {/* ================= BACK BUTTON GLOBAL ================= */}
      <BackButton onClick={() => (onBack ? onBack() : navigate("/"))} />

      {/* ================= DECORATIONS ================= */}
      <img
        src={`${SUPABASE_BUCKET_URL}/tengger.png`}
        alt="Burung Toucan"
        className="fixed top-[-10px] left-[-15px] md:top-[-20px] md:left-[-30px] w-32 md:w-56 z-0 pointer-events-none drop-shadow-md"
      />

      <div className="fixed top-[-10px] right-[-15px] md:top-[-20px] md:right-[-30px] w-48 md:w-72 h-64 z-0 pointer-events-none">
        <img
          src={`${SUPABASE_BUCKET_URL}/sarang.png`}
          alt="Sarang Lebah"
          className="absolute top-0 right-0 w-28 md:w-44 drop-shadow-md"
        />
        <img
          src={`${SUPABASE_BUCKET_URL}/lebah.webp`}
          className="absolute top-6 right-32 md:right-48 w-10 md:w-14"
          alt="Lebah 1"
        />
        <img
          src={`${SUPABASE_BUCKET_URL}/lebah.webp`}
          className="absolute top-20 right-40 md:right-56 w-8 md:w-10"
          alt="Lebah 2"
        />
        <img
          src={`${SUPABASE_BUCKET_URL}/lebah.webp`}
          className="absolute top-32 right-28 md:right-40 w-12 md:w-16"
          alt="Lebah 3"
        />
      </div>

      <img
        src={`${SUPABASE_BUCKET_URL}/rumput2.png`}
        alt="Padang Rumput"
        className="fixed bottom-0 left-0 w-full h-auto min-h-[30vh] md:min-h-[40vh] object-cover object-top z-0 pointer-events-none"
      />

      <div className="fixed bottom-[-20px] md:bottom-[-40px] left-0 w-full px-5 md:px-16 flex justify-between items-end z-0 pointer-events-none">
        <img
          src={`${SUPABASE_BUCKET_URL}/beruang.webp`}
          className="w-32 md:w-48"
          alt="Beruang"
        />
        <img
          src={`${SUPABASE_BUCKET_URL}/rubah.webp`}
          className="w-28 md:w-44"
          alt="Rubah"
        />
        <img
          src={`${SUPABASE_BUCKET_URL}/landak.webp`}
          className="w-20 md:w-32"
          alt="Landak"
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 p-6 md:p-10 pt-20 md:pt-24 flex-grow flex flex-col items-center">
        {/* TITLE webp */}
        <div className="flex justify-center items-center mt-2 mb-8">
          <img
            src={`${SUPABASE_BUCKET_URL}/A.webp`}
            className="w-10 md:w-14"
            alt="Huruf A"
          />
          <img
            src={`${SUPABASE_BUCKET_URL}/B.webp`}
            className="w-10 md:w-14"
            alt="Huruf B"
          />
          <img
            src={`${SUPABASE_BUCKET_URL}/C.webp`}
            className="w-10 md:w-14"
            alt="Huruf C"
          />
          <img
            src={`${SUPABASE_BUCKET_URL}/D.webp`}
            className="w-10 md:w-14"
            alt="Huruf D"
          />
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 flex-grow">
            <div className="w-12 h-12 border-4 border-white/50 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white font-bold text-xl">Memuat data...</p>
          </div>
        ) : (
          <>
            {/* GRID CARD */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto w-full">
              {currentItems.map((item) => (
                <HurufCard
                  key={item.id}
                  item={item}
                  flippedCard={flippedCard}
                  onFlip={handleFlip}
                />
              ))}
            </div>

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
    </div>
  );
};

export default HurufPage;