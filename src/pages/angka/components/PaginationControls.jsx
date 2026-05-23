import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationControls = ({ currentPage, totalPages, onPrev, onNext }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-6 mt-8 mb-4 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
      {/* PREV */}
      <button
        onClick={onPrev}
        disabled={currentPage === 0}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          currentPage === 0
            ? "bg-emerald-100 text-emerald-300 cursor-not-allowed"
            : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:-translate-x-1"
        }`}
      >
        <FaChevronLeft className="text-lg" />
      </button>

      {/* NEXT */}
      <button
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          currentPage === totalPages - 1
            ? "bg-emerald-100 text-emerald-300 cursor-not-allowed"
            : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:translate-x-1"
        }`}
      >
        <FaChevronRight className="text-lg" />
      </button>
    </div>
  );
};

export default PaginationControls;
