import React from "react";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import { Input } from "../../../../components/Form";
import { FaArrowLeft, FaSave, FaSpinner, FaEdit } from "react-icons/fa";

import useEditWarna from "../hook/useEditWarna";

const EditWarna = () => {
  const {
    formData,
    setFormData,
    audioFile,
    setAudioFile,
    isFetching,
    isSubmitting,
    handleSubmit,
    navigate,
  } = useEditWarna();

  // LOADING STATE SAAT FETCHING DATA EDIT
  if (isFetching) {
    return (
      <div className="flex flex-col justify-center items-center p-32 space-y-4">
        <FaSpinner className="animate-spin text-5xl text-blue-500" />
        <Text className="text-slate-500 font-bold animate-pulse text-lg">
          Memuat data warna...
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
            textKey="admin_menu_warna"
            variant="subtitle"
            className="text-slate-800 font-black text-xl flex items-center gap-2"
          >
            <FaEdit className="text-blue-500" />
            Edit Data Warna
          </Text>

          <p className="text-slate-500 text-sm mt-1 font-medium">
            Perbarui kode warna, nama label, atau ganti audio pengucapan.
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/warna/table")}
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
          {/* COLOR INPUT */}
          <div className="flex flex-col">
            <Input
              label="NILAI / KODE WARNA (HEX)"
              type="color"
              value={formData.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  value: e.target.value,
                })
              }
              className="w-full h-16 p-1 cursor-pointer rounded-xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all shadow-sm"
              required
            />
          </div>

          {/* LABEL INPUT */}
          <div className="flex flex-col">
            <Input
              label="NAMA WARNA"
              type="text"
              value={formData.label}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  label: e.target.value,
                })
              }
              placeholder="Contoh: Merah, Biru, Hijau..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
              required
            />
          </div>

          {/* AUDIO INPUT */}
          <div className="flex flex-col">
            <Input
              label="GANTI AUDIO SUARA (.MP3 / .WAV)"
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
              onClick={() => navigate("/admin/warna/table")}
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

export default EditWarna;