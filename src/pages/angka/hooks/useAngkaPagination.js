import { useState, useMemo } from "react";

export const useAngkaPagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Hitung total halaman
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data, itemsPerPage]);

  // Data untuk halaman aktif
  const currentCards = useMemo(() => {
    return data.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage,
    );
  }, [data, currentPage, itemsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const resetPage = () => {
    setCurrentPage(0);
  };

  return {
    currentPage,
    totalPages,
    currentCards,
    setCurrentPage,
    handleNextPage,
    handlePrevPage,
    resetPage,
  };
};