import { useState, useMemo } from "react";

// BATASAN PAGINATION DIATUR DISINI (GLOBAL)
const ITEMS_PER_PAGE = 10; // Ubah angka ini sesuai kebutuhan

const usePagination = (data = []) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / ITEMS_PER_PAGE);
  }, [data]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [data, currentPage]);

  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    nextPage,
    prevPage,
    setCurrentPage,
    resetPage,
  };
};

export default usePagination;