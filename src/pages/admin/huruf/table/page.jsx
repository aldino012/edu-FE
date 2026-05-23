import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import Table from "../../../../components/Table"; // IMPORT TABLE GLOBAL

// IMPORT HOOK DAN KOMPONEN PAGINATION GLOBAL
import usePagination from "../../../../hooks/usePagination";
import Pagination from "../../../../components/Pagination";
import Search from "../../../../components/Search";

import useTableHuruf from "../hook/useTableHuruf";
import {
  FaPlus,
  FaSync,
  FaEdit,
  FaTrash,
  FaImage,
  FaInfoCircle,
  FaSortAlphaUpAlt,
} from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const TableHuruf = () => {
  const navigate = useNavigate();

  const { dataHuruf, isLoading, isSyncing, handleBulkImport, handleDelete } =
    useTableHuruf();

  // STATE UNTUK MENAMPUNG HASIL PENCARIAN
  const [filteredData, setFilteredData] = useState(dataHuruf);
  
  // STATE UNTUK MENAMPILKAN POPUP INFO
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // REF UNTUK MODAL CONTENT
  const modalContentRef = useRef(null);
  
  // REF UNTUK MENYIMPAN SCROLL POSITION
  const scrollPositionRef = useRef(0);

  // MENGGUNAKAN PAGINATION GLOBAL DENGAN DATA YANG SUDAH DI FILTER
  const { currentPage, totalPages, currentItems, nextPage, prevPage } =
    usePagination(filteredData);

  // Update filteredData ketika dataHuruf berubah
  useEffect(() => {
    setFilteredData(dataHuruf);
  }, [dataHuruf]);

  // Handler untuk hasil pencarian
  const handleSearchResults = (results) => {
    setFilteredData(results);
  };

  // Handler untuk edit
  const handleEdit = (row) => {
    navigate(`/admin/huruf/edit/${row.id}`);
  };

  // Handler untuk delete dengan konfirmasi
  const handleDeleteItem = (row) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus huruf "${row.label}"?`)) {
      handleDelete(row.id);
    }
  };

  // Toggle popup info
  const toggleInfoPopup = () => {
    setShowInfoPopup(!showInfoPopup);
  };

  // Handler untuk klik di luar modal
  const handleOutsideClick = (e) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
      toggleInfoPopup();
    }
  };

  // Handler untuk tombol ESC
  const handleEscKey = (e) => {
    if (e.key === 'Escape' && showInfoPopup) {
      toggleInfoPopup();
    }
  };

  // Lock body scroll ketika modal terbuka
  useEffect(() => {
    if (showInfoPopup) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollPositionRef.current);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showInfoPopup]);

  // DEFINISI KOLOM
  const columns = [
    {
      header: "No",
      accessor: "no",
      headerClassName: "text-center",
      cellClassName: "text-slate-400 font-bold text-sm",
      render: (row, index, currentPage, rowNumber) => rowNumber,
    },
    {
      header: "Huruf",
      accessor: "value",
      headerClassName: "text-center",
      cellClassName: "text-center",
      render: (row) => (
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl border-2 border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:scale-110">
          <span className="font-black text-2xl uppercase">
            {row.value}
          </span>
        </div>
      ),
    },
    {
      header: "Label Nama",
      accessor: "label",
      cellClassName: "font-black text-slate-700 uppercase tracking-wide",
      render: (row) => row.label,
    },
    {
      header: "Gambar",
      accessor: "image_url",
      headerClassName: "text-center",
      cellClassName: "text-center",
      render: (row) => (
        row.image_url ? (
          <div className="flex justify-center">
            <img
              src={row.image_url}
              alt={row.label}
              className="w-14 h-14 object-contain rounded-xl border border-slate-200 bg-white shadow-sm hover:scale-110 transition-transform"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300">
            <FaImage size={24} className="mb-1 opacity-50" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Kosong
            </span>
          </div>
        )
      ),
    },
    {
      header: "Audio Suara",
      accessor: "audio_url",
      render: (row) => (
        row.audio_url ? (
          <audio
            src={row.audio_url}
            controls
            className="h-10 w-48 outline-none rounded-full grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100"
            preload="metadata"
          />
        ) : (
          <span className="text-xs font-bold text-slate-400 italic bg-slate-100 px-3 py-1.5 rounded-lg">
            Tidak ada audio
          </span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* POPUP INFO */}
      {showInfoPopup && (
        <div 
          className="fixed inset-0 z-[9999] overflow-y-auto"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div ref={modalContentRef} className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <FaSync className="text-blue-600 text-sm" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">Info Sinkronisasi Data</h3>
                  </div>
                  <button onClick={toggleInfoPopup} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100" title="Tutup (ESC)">✕</button>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Tombol <strong className="text-blue-600">Sinkronkan</strong> berfungsi untuk mengambil dan memperbarui data huruf dari server secara otomatis.
                  </p>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-700">Total Data Huruf:</span>
                      <span className="text-2xl font-black text-blue-600">{dataHuruf.length}</span>
                    </div>
                    <div className="border-t border-blue-100 pt-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">📋 Daftar Huruf:</p>
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {dataHuruf.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 text-sm p-1 rounded-lg hover:bg-white/50 transition-colors">
                            <span className="font-black text-blue-600 w-6 uppercase">{item.value}</span>
                            <span className="text-slate-600">-</span>
                            <span className="text-slate-700 flex-1 truncate uppercase">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">ESC</kbd>
                      <span>atau klik di luar</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 gap-4">
        <div>
          {/* PERBAIKAN: Pisahkan Icon dari komponen <Text> menggunakan flex wrapper */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <FaSortAlphaUpAlt className="text-blue-600 text-sm" />
            </div>
            <Text
              textKey="admin_huruf_title"
              variant="subtitle"
              className="text-slate-800 font-black text-2xl"
            >
              Data Huruf
            </Text>
          </div>

          <p className="text-slate-500 text-sm mt-2 font-medium">
            Total:{" "}
            <span className="text-blue-600 font-bold">{dataHuruf.length}</span>{" "}
            Huruf terdaftar
            {filteredData.length !== dataHuruf.length && (
              <span className="text-green-600 ml-2">
                (Menampilkan {filteredData.length} hasil)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* SYNC BUTTON */}
          <div className="relative inline-block flex-1 sm:flex-none">
            <Button
              onClick={handleBulkImport}
              disabled={isSyncing}
              variant="secondary"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 shadow-sm transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSync className={`${isSyncing ? "animate-spin" : ""} text-sm`} />
              <span className="font-bold">
                {isSyncing ? "Menyinkronkan..." : "Sinkronkan"}
              </span>
            </Button>
            
            {/* Icon Info */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfoPopup();
              }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg border border-slate-200 text-slate-400 hover:text-green-500 transition-all z-10 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Info Sinkronisasi (Klik untuk detail)"
            >
              <FaInfoCircle size={16} />
            </button>
          </div>

          {/* ADD BUTTON */}
          <Button
            onClick={() => navigate("/admin/huruf/add")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex-1 sm:flex-none"
          >
            <FaPlus className="text-sm" />
            <span className="font-bold">Tambah Baru</span>
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-end">
        <Search
          data={dataHuruf}
          onSearchResults={handleSearchResults}
          searchFields={['label', 'value']}
          placeholder="Cari huruf berdasarkan nama atau huruf..."
          className="w-full sm:w-80 md:w-96"
        />
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <div className="relative">
              <FaSync className="animate-spin text-5xl text-blue-400 mb-4" />
              <div className="absolute inset-0 animate-ping bg-blue-400 rounded-full opacity-20"></div>
            </div>
            <Text className="text-slate-500 font-bold animate-pulse mt-4">
              Memuat Data...
            </Text>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-slate-100 rounded-full">
                <IoSearch className="text-4xl text-slate-300" />
              </div>
              <Text className="text-slate-400 font-bold text-lg">
                {dataHuruf.length === 0 
                  ? "Belum ada data huruf terdaftar."
                  : "Tidak ada hasil yang sesuai dengan pencarian."}
              </Text>
              {dataHuruf.length > 0 && (
                <Button
                  onClick={() => setFilteredData(dataHuruf)}
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

      {/* CUSTOM SCROLLBAR */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default TableHuruf;