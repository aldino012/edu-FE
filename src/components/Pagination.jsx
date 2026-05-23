// src/components/Pagination.jsx
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPrev, onNext }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 mt-10 md:mt-14 z-20">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white text-xl md:text-2xl transition-all shadow-md ${
          currentPage === 1
            ? "bg-slate-300 cursor-not-allowed opacity-70"
            : "bg-[#FF6B6B] hover:bg-[#ff5252] hover:scale-105 active:scale-95 border-b-4 border-[#d63031]"
        }`}
      >
        <FaChevronLeft />
      </button>

      <div className="bg-white/50 px-4 py-2 rounded-full font-bold text-slate-700">
        {currentPage} / {totalPages}
      </div>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white text-xl md:text-2xl transition-all shadow-md ${
          currentPage === totalPages
            ? "bg-slate-300 cursor-not-allowed opacity-70"
            : "bg-[#4ECDC4] hover:bg-[#45b7af] hover:scale-105 active:scale-95 border-b-4 border-[#16a085]"
        }`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;