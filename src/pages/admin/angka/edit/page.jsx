import React from "react";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import { FaArrowLeft, FaSave, FaSpinner, FaEdit } from "react-icons/fa";

import useEditAngka from "../hook/useEditAngka";

const EditAngka = () => {
  const {
    formData,
    setFormData,
    audioFile,
    setAudioFile,
    isFetching,
    isSubmitting,
    handleSubmit,
    navigate,
  } = useEditAngka();

  // LOADING STATE SAAT FETCHING DATA EDIT
  if (isFetching) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <FaSpinner className="animate-spin text-5xl text-blue-500" />
        <Text className="text-slate-500 font-bold animate-pulse text-lg">
          Memuat data angka...
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 gap-4">
        <div>
          <Text
            textKey="admin_menu_angka"
            variant="subtitle"
            className="text-slate-800 font-black text-xl flex items-center gap-2"
          >
            <FaEdit className="text-blue-500" />
            Edit Data Angka
          </Text>

          <p className="text-slate-500 text-sm mt-1 font-medium">
            Ubah nilai angka, nama label, atau ganti audio pengucapan.
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/angka/table")}
          variant="secondary"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800 shadow-sm transition-all"
        >
          <FaArrowLeft />
          <span className="font-bold">Kembali</span>
        </Button>
      </div>

      {/* FORM CONTAINER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* VALUE / NILAI ANGKA */}
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase">
              Nilai Angka (Numerik)
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  value: e.target.value,
                })
              }
              placeholder="Contoh: 1, 2, 3..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-black text-xl"
              required
            />
          </div>

          {/* LABEL / NAMA ANGKA */}
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase">
              Nama / Ejaan Angka
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  label: e.target.value,
                })
              }
              placeholder="Contoh: Satu, Dua, Tiga..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>

          {/* AUDIO UPLOAD */}
          <div className="flex flex-col">
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 uppercase">
              Ganti Audio Suara (.MP3 / .WAV)
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200 cursor-pointer"
            />
            {/* Note Information */}
            <div className="mt-3">
              <span className="inline-block bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold px-3 py-2 rounded-lg">
                💡 Catatan: Kosongkan form ini jika Anda tidak ingin mengganti
                audio lama.
              </span>
            </div>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* BUTTONS ACTION */}
          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="button"
              onClick={() => navigate("/admin/angka/table")}
              className="px-6 py-3 bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all"
            >
              Batal
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

export default EditAngka;