import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import Table from "../../../../components/Table"; // IMPORT TABLE GLOBAL

// IMPORT HOOK DAN KOMPONEN PAGINATION GLOBAL
import usePagination from "../../../../hooks/usePagination";
import Pagination from "../../../../components/Pagination";
import Search from "../../../../components/Search";

import { useQuizTable } from "../hook/useQuizTable";
import { FaPlus, FaSpinner, FaEdit, FaTrash, FaListAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const TableQuiz = () => {
  const navigate = useNavigate();
  const { dataQuiz, isLoading, deleteQuiz } = useQuizTable();

  // STATE UNTUK MENAMPUNG HASIL PENCARIAN
  const [filteredData, setFilteredData] = useState(dataQuiz);

  // MENGGUNAKAN PAGINATION GLOBAL DENGAN DATA YANG SUDAH DI FILTER
  const { currentPage, totalPages, currentItems, nextPage, prevPage } =
    usePagination(filteredData);

  // Update filteredData ketika dataQuiz berubah
  useEffect(() => {
    setFilteredData(dataQuiz);
  }, [dataQuiz]);

  // Handler untuk hasil pencarian
  const handleSearchResults = (results) => {
    setFilteredData(results);
  };

  // Handler untuk edit
  const handleEdit = (row) => {
    navigate(`/admin/quiz/edit/${row.id}`);
  };

  // Handler untuk delete dengan konfirmasi
  const handleDeleteItem = (row) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kuis "${row.question_text.substring(0, 50)}..."?`)) {
      deleteQuiz(row.id);
    }
  };

  // DEFINISI KOLOM - MEMPERTAHANKAN TAMPILAN ASLI
  const columns = [
    {
      header: "No",
      accessor: "no",
      headerClassName: "text-left",
      cellClassName: "text-slate-400 font-bold text-sm",
      render: (row, index, currentPage, rowNumber) => rowNumber,
    },
    {
      header: "Kategori",
      accessor: "category",
      render: (row) => (
        <span className="inline-block px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-blue-100">
          {row.category?.name || "Tanpa Kategori"}
        </span>
      ),
    },
    {
      header: "Pertanyaan",
      accessor: "question_text",
      cellClassName: "text-slate-700 font-medium",
      render: (row) => (
        <div
          className="max-w-md truncate"
          title={row.question_text}
        >
          {row.question_text}
        </div>
      ),
    },
    {
      header: "Kunci Jawaban",
      accessor: "answer_key",
      render: (row) => (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg">
          <span className="font-black bg-white px-2 py-0.5 rounded shadow-sm text-xs">
            {row.answer_key}
          </span>
          <span className="text-sm font-bold">
            {row.correctContent?.label || "-"}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 gap-4">
        <div>
          <Text
            variant="subtitle"
            className="text-slate-800 font-black text-xl flex items-center gap-2"
          >
            <div className="p-2 bg-blue-100 rounded-xl">
              <FaListAlt className="text-blue-500 text-sm" />
            </div>
            Data Kuis
          </Text>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Total:{" "}
            <span className="text-blue-600 font-bold">{dataQuiz.length}</span>{" "}
            Soal terdaftar
            {filteredData.length !== dataQuiz.length && (
              <span className="text-green-600 ml-2">
                (Menampilkan {filteredData.length} hasil)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Button
            onClick={() => navigate("/admin/quiz/add")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex-1 sm:flex-none"
          >
            <FaPlus className="text-sm" />
            <span className="font-bold">Tambah Soal</span>
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-end">
        <Search
          data={dataQuiz}
          onSearchResults={handleSearchResults}
          searchFields={['question_text', 'category.name', 'correctContent.label', 'answer_key']}
          placeholder="Cari berdasarkan pertanyaan, kategori, atau jawaban..."
          className="w-full sm:w-80 md:w-96"
        />
      </div>

      {/* TABLE CONTAINER - MENGGUNAKAN TABLE GLOBAL */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <div className="relative">
              <FaSpinner className="animate-spin text-5xl text-blue-400 mb-4" />
              <div className="absolute inset-0 animate-ping bg-blue-400 rounded-full opacity-20"></div>
            </div>
            <Text className="text-slate-500 font-bold animate-pulse mt-4">
              Memuat Data Kuis...
            </Text>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-slate-100 rounded-full">
                <IoSearch className="text-4xl text-slate-300" />
              </div>
              <Text className="text-slate-400 font-bold text-lg">
                {dataQuiz.length === 0 
                  ? "Belum ada soal kuis yang terdaftar."
                  : "Tidak ada hasil yang sesuai dengan pencarian."}
              </Text>
              {dataQuiz.length > 0 && (
                <Button
                  onClick={() => setFilteredData(dataQuiz)}
                  variant="secondary"
                  className="mt-2 px-6 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  Tampilkan Semua Data
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              data={currentItems}
              onEdit={handleEdit}
              onDelete={handleDeleteItem}
              currentPage={currentPage}
              itemsPerPage={10}
            />
            
            {/* PAGINATION */}
            {filteredData.length > 0 && (
              <div className="w-full pt-4 pb-2 border-t border-slate-100 bg-white/50 flex justify-center">
                <div className="transform scale-90 -mt-6 md:-mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrev={prevPage}
                    onNext={nextPage}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TableQuiz;