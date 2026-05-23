import React from "react";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import { FaArrowLeft, FaSave, FaSpinner, FaEdit } from "react-icons/fa";

import useEditHuruf from "../hook/useEditHuruf";

const EditHuruf = () => {
  const {
    formData,
    imageFile,
    audioFile,
    isFetching,
    isSubmitting,
    setImageFile,
    setAudioFile,
    handleChange,
    handleSubmit,
    navigate,
  } = useEditHuruf();

  // Generate array huruf A sampai Z untuk pilihan dropdown
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i),
  );

  // LOADING STATE SAAT FETCHING DATA EDIT
  if (isFetching) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <FaSpinner className="animate-spin text-5xl text-blue-500" />
        <Text className="text-slate-500 font-bold animate-pulse text-lg">
          Memuat data huruf...
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 gap-4">
        <div>
          <Text
            textKey="admin_huruf_edit"
            variant="subtitle"
            className="text-slate-800 font-black text-xl flex items-center gap-2"
          >
            <FaEdit className="text-blue-500" />
            Edit Data Huruf
          </Text>

          <p className="text-slate-500 text-sm mt-1 font-medium">
            Ubah karakter huruf, nama benda, atau perbarui gambar dan audio.
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/huruf/table")}
          variant="secondary"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800 shadow-sm transition-all"
        >
          <FaArrowLeft />
          <span className="font-bold">Kembali</span>
        </Button>
      </div>

      {/* FORM SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* INPUT VALUE (HURUF) - MENGGUNAKAN SELECT */}
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase">
              Karakter Huruf
            </label>
            <select
              name="value"
              value={formData.value || ""}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-black text-xl appearance-none cursor-pointer"
              required
            >
              <option value="" disabled>
                Pilih Huruf...
              </option>
              {alphabet.map((huruf) => (
                <option key={huruf} value={huruf}>
                  {huruf}
                </option>
              ))}
            </select>
          </div>

          {/* INPUT LABEL (NAMA BENDA) */}
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase">
              Nama Benda / Hewan (Label)
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="Contoh: Apel, Bola, Cacing..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* INPUT IMAGE UPLOAD */}
            <div className="flex flex-col">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase">
                Ganti Gambar (.PNG/.JPG)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200 cursor-pointer"
              />
              <div className="mt-3">
                <span className="inline-block bg-amber-50 text-amber-600 border border-amber-200 text-[11px] font-bold px-3 py-2 rounded-lg">
                  💡 Kosongkan form jika tidak ingin mengganti gambar lama.
                </span>
              </div>
            </div>

            {/* INPUT AUDIO UPLOAD */}
            <div className="flex flex-col">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase">
                Ganti Audio (.MP3/.WAV)
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files[0])}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-emerald-100 file:text-emerald-600 hover:file:bg-emerald-200 cursor-pointer"
              />
              <div className="mt-3">
                <span className="inline-block bg-amber-50 text-amber-600 border border-amber-200 text-[11px] font-bold px-3 py-2 rounded-lg">
                  💡 Kosongkan form jika tidak ingin mengganti audio lama.
                </span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* FORM ACTIONS */}
          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="button"
              onClick={() => navigate("/admin/huruf/table")}
              className="px-6 py-3 bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all"
            >
              <Text textKey="btn_batal">Batal</Text>
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span className="font-bold">Menyimpan...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span className="font-bold">Simpan Perubahan</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHuruf;