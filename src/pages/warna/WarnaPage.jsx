import React from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../components/Text";

// Import Global Components & Hooks
import BackButton from "../../components/BackButton";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";

// Import Custom Hooks
import useWarnaData from "./hooks/useWarnaData";
import useAudio from "./hooks/useAudio";

// Import Sub-Components
import ColorCard from "./components/ColorCard";
import BackgroundDecorations from "./components/BackgroundDecorations";

const WarnaPage = ({ onBack }) => {
  const navigate = useNavigate();

  // Memanggil Custom Hooks
  const { warnaList, loading } = useWarnaData();
  const { playAudio, stopAudio } = useAudio();

  // Memanggil Global Pagination (misal 10 item per halaman)
  const { 
    currentPage, 
    totalPages, 
    currentItems, 
    nextPage, 
    prevPage 
  } = usePagination(warnaList);

  const handleBack = () => {
    stopAudio();
    if (onBack) {
      onBack();
    } else {
      navigate("/");
    }
  };

  // Wrapper untuk menghentikan audio saat user berpindah halaman
  const handleNextPage = () => {
    stopAudio();
    nextPage();
  };

  const handlePrevPage = () => {
    stopAudio();
    prevPage();
  };

  return (
    // Background biru langit pastel cerah
    <div className="relative min-h-screen bg-[#a2dff5] overflow-hidden">
      {/* Komponen Dekorasi Background */}
      <BackgroundDecorations />

      {/* TOMBOL KEMBALI GLOBAL (Z-50) */}
      <BackButton onClick={handleBack} />

      {/* KONTEN UTAMA - GRID KARTU (Z-40) */}
      <div className="relative z-40 flex flex-col items-center justify-center min-h-screen p-8 pt-24 pb-32 md:pb-48">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Text
              textKey="Loading..."
              className="text-slate-800 text-2xl font-bold animate-pulse"
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto w-full">
              {currentItems.length > 0 ? (
                // Lakukan mapping pada currentItems, bukan lagi warnaList
                currentItems.map((item) => (
                  <ColorCard
                    key={item.id}
                    item={item}
                    onClick={() => playAudio(item.audio_url)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center p-10 bg-white/50 rounded-2xl shadow-sm">
                  <Text className="text-slate-700 text-xl font-bold">
                    Data warna belum tersedia.
                  </Text>
                </div>
              )}
            </div>

            {/* PAGINATION GLOBAL */}
            {currentItems.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WarnaPage;