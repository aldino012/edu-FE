import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import Table from "../../../../components/Table"; // IMPORT TABLE GLOBAL

// IMPORT HOOK DAN KOMPONEN PAGINATION GLOBAL
import usePagination from "../../../../hooks/usePagination";
import Pagination from "../../../../components/Pagination";
import Search from "../../../../components/Search";

import { useWarnaTable } from "../hook/useWarnaTable";
import { FaPlus, FaSync, FaEdit, FaTrash, FaInfoCircle, FaPalette } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const TableWarna = () => {
  const navigate = useNavigate();

  const { dataWarna, isLoading, isSyncing, handleDelete, handleBulkImport } =
    useWarnaTable();

  // STATE UNTUK MENAMPUNG HASIL PENCARIAN
  const [filteredData, setFilteredData] = useState(dataWarna);
  
  // STATE UNTUK MENAMPILKAN POPUP INFO
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // REF UNTUK MODAL CONTENT
  const modalContentRef = useRef(null);
  
  // REF UNTUK MENYIMPAN SCROLL POSITION
  const scrollPositionRef = useRef(0);

  // MENGGUNAKAN PAGINATION GLOBAL DENGAN DATA YANG SUDAH DI FILTER
  const { currentPage, totalPages, currentItems, nextPage, prevPage } =
    usePagination(filteredData);

  // Update filteredData ketika dataWarna berubah
  useEffect(() => {
    setFilteredData(dataWarna);
  }, [dataWarna]);

  // Handler untuk hasil pencarian
  const handleSearchResults = (results) => {
    setFilteredData(results);
  };

  // Handler untuk edit
  const handleEdit = (row) => {
    navigate(`/admin/warna/edit/${row.id}`);
  };

  // Handler untuk delete dengan konfirmasi
  const handleDeleteItem = (row) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus warna "${row.label}"?`)) {
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
      // Simpan posisi scroll saat ini
      scrollPositionRef.current = window.scrollY;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      
      // Tambahkan event listener
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscKey);
    } else {
      // Unlock body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      
      // Kembalikan posisi scroll
      window.scrollTo(0, scrollPositionRef.current);
      
      // Hapus event listener
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
      header: "Visual & Kode",
      accessor: "value",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div
            style={{ backgroundColor: row.value }}
            className="w-10 h-10 rounded-full border-4 border-slate-100 shadow-sm group-hover:scale-110 transition-transform cursor-pointer"
            title={row.value}
          />
          <span className="font-mono text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider group-hover:bg-white group-hover:text-blue-600 transition-colors">
            {row.value}
          </span>
        </div>
      ),
    },
    {
      header: "Label Nama",
      accessor: "label",
      cellClassName: "font-black text-slate-700 tracking-wide",
      render: (row) => row.label,
    },
    {
      header: "Audio Suara",
      accessor: "audio_url",
      render: (row) => (
        row.audio_url ? (
          <audio
            controls
            src={row.audio_url}
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
      {/* POPUP INFO - DENGAN FITUR KLIK DI LUAR MODAL & TOMBOL ESC */}
      {showInfoPopup && (
        <div 
          className="fixed inset-0 z-[9999] overflow-y-auto"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%'
          }}
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%'
            }}
          />
          
          {/* Container flex untuk centering */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            {/* Popup Content - dengan ref untuk deteksi klik di luar */}
            <div 
              ref={modalContentRef}
              className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <FaSync className="text-blue-600 text-sm" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">Info Sinkronisasi Data</h3>
                  </div>
                  <button
                    onClick={toggleInfoPopup}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                    title="Tutup (ESC)"
                  >
                    ✕
                  </button>
                </div>

                {/* Konten Info */}
                <div className="space-y-4">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Tombol <strong className="text-blue-600">Sinkronkan</strong> berfungsi untuk mengambil dan memperbarui data warna dari server secara otomatis.
                  </p>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-700">Total Data Warna:</span>
                      <span className="text-2xl font-black text-blue-600">{dataWarna.length}</span>
                    </div>
                    
                    <div className="border-t border-blue-100 pt-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">📋 Daftar Warna:</p>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {dataWarna.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 text-sm p-1 rounded-lg hover:bg-white/50 transition-colors">
                            <div 
                              className="w-4 h-4 rounded-full border border-slate-200 shadow-sm"
                              style={{ backgroundColor: item.value }}
                            />
                            <span className="font-medium text-slate-700 flex-1 truncate">{item.label}</span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-slate-500 text-xs font-mono">{item.value}</span>
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
          <Text
            variant="subtitle"
            className="text-slate-800 font-black text-xl flex items-center gap-2"
          >
            <div className="p-2 bg-blue-100 rounded-xl">
              <FaPalette className="text-blue-500 text-sm" />
            </div>
            Data Warna
          </Text>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Total:{" "}
            <span className="text-blue-600 font-bold">{dataWarna.length}</span>{" "}
            Warna terdaftar
            {filteredData.length !== dataWarna.length && (
              <span className="text-green-600 ml-2">
                (Menampilkan {filteredData.length} hasil)
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* SYNC BUTTON DENGAN ICON INFO DI POJOK KANAN ATAS */}
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
            
            {/* Icon info di pojok kanan atas tombol */}
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
            onClick={() => navigate("/admin/warna/add")}
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
          data={dataWarna}
          onSearchResults={handleSearchResults}
          searchFields={['label', 'value']}
          placeholder="Cari warna berdasarkan nama atau kode warna..."
          className="w-full sm:w-80 md:w-96"
        />
      </div>

      {/* TABLE CONTAINER - MENGGUNAKAN TABLE GLOBAL */}
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
                {dataWarna.length === 0 
                  ? "Belum ada data warna terdaftar."
                  : "Tidak ada hasil yang sesuai dengan pencarian."}
              </Text>
              {dataWarna.length > 0 && (
                <Button
                  onClick={() => setFilteredData(dataWarna)}
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

      {/* Tambahkan CSS untuk custom scrollbar */}
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

export default TableWarna;