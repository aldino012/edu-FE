import React from "react";
import Button from "./Button";
import { FaEdit, FaTrash } from "react-icons/fa";

const Table = ({
  columns = [], // Array untuk konfigurasi kolom
  data = [], // Array dari backend (data tabel)
  onEdit, // Fungsi saat tombol edit diklik
  onDelete, // Fungsi saat tombol hapus diklik
  currentPage = 1, // Halaman saat ini untuk nomor urut
  itemsPerPage = 10, // Jumlah item per halaman
  // Custom className untuk override styling
  tableClassName = "",
  theadClassName = "",
  tbodyClassName = "",
  thClassName = "",
  tdClassName = "",
  actionButtonsClassName = "",
  editButtonClassName = "",
  deleteButtonClassName = "",
}) => {
  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto pb-4">
        <table className={`w-full text-left border-collapse ${tableClassName}`}>
          {/* ================= HEADER TABEL ================= */}
          <thead className={`bg-slate-50/80 border-b border-slate-200 sticky top-0 ${theadClassName}`}>
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap ${col.headerClassName || ""} ${thClassName}`}
                  style={col.headerStyle || {}}
                >
                  {col.header || col.accessor}
                </th>
              ))}

              {/* Kolom statis untuk Aksi (Edit/Hapus) */}
              {(onEdit || onDelete) && (
                <th className={`px-6 py-5 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-center ${thClassName}`}>
                  Aksi
                </th>
              )}
            </tr>
          </thead>

          {/* ================= ISI TABEL (BODY) ================= */}
          <tbody className={`divide-y divide-slate-100 ${tbodyClassName}`}>
            {data.length > 0 ? (
              data.map((row, rowIndex) => {
                // Hitung nomor urut
                const rowNumber = (currentPage - 1) * itemsPerPage + rowIndex + 1;
                
                return (
                  <tr
                    key={row.id || rowIndex}
                    className="hover:bg-slate-50 transition-colors duration-200 group"
                  >
                    {columns.map((col, colIndex) => {
                      // Cek apakah kolom ini memiliki custom render function
                      let content;
                      if (col.render) {
                        // Jika ada render function, gunakan itu
                        content = col.render(row, rowIndex, currentPage, rowNumber);
                      } else if (col.accessor === 'no') {
                        // Khusus untuk kolom nomor
                        content = rowNumber;
                      } else {
                        // Default: ambil dari row[accessor]
                        content = row[col.accessor];
                      }
                      
                      return (
                        <td 
                          key={colIndex} 
                          className={`px-6 py-4 ${col.cellClassName || ""} ${tdClassName}`}
                          style={col.cellStyle || {}}
                        >
                          {content}
                        </td>
                      );
                    })}

                    {/* Tombol Aksi (Edit & Hapus) */}
                    {(onEdit || onDelete) && (
                      <td className={`px-6 py-4 ${actionButtonsClassName}`}>
                        <div className="flex justify-center items-center gap-3">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className={`p-3 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 ${editButtonClassName}`}
                              title="Edit"
                            >
                              <FaEdit size={16} />
                            </button>
                          )}

                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className={`p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 ${deleteButtonClassName}`}
                              title="Hapus"
                            >
                              <FaTrash size={16} />
                            </button>
                          )}
                        </div>
                       </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-slate-100 rounded-full">
                      <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-slate-400 font-bold text-lg">
                      Tidak ada data ditemukan
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;