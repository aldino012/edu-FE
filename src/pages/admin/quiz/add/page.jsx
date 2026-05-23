import React from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import { useAddQuiz } from "../hook/useAddQuiz";
import { FaArrowLeft, FaSave, FaSpinner } from "react-icons/fa";

const AddQuiz = () => {
  const navigate = useNavigate();

  const {
    formData,
    handleChange,
    availableContents,
    isLoadingData,
    isSubmitting,
    handleSubmit,
  } = useAddQuiz();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 gap-4">
        <div>
          <Text
            variant="subtitle"
            className="text-slate-800 font-black text-xl"
          >
            Tambah Kuis
          </Text>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Buat soal baru untuk melatih anak-anak.
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/quiz/table")}
          variant="secondary"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800 shadow-sm transition-all"
        >
          <FaArrowLeft />
          <span className="font-bold">Kembali</span>
        </Button>
      </div>

      {/* FORM CONTAINER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-blue-400 mb-4" />
            <Text className="text-slate-500 font-bold animate-pulse">
              Memuat Data Kuis...
            </Text>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* KATEGORI */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Kategori Kuis
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => handleChange("category_id", e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Pilih kategori...
                </option>
                <option value="1">Angka</option>
                <option value="2">Huruf</option>
                <option value="3">Warna</option>
              </select>
            </div>

            {/* PERTANYAAN */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Teks Pertanyaan
              </label>
              <textarea
                value={formData.question_text}
                onChange={(e) => handleChange("question_text", e.target.value)}
                placeholder="Masukkan pertanyaan di sini..."
                required
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium resize-none"
              />
            </div>

            {/* OPSI JAWABAN (Dibuat Grid 2x2) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                Pilihan Jawaban (A, B, C, D)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {["a", "b", "c", "d"].map((key) => (
                  <div key={key} className="flex flex-col relative">
                    <span className="absolute -top-3 left-3 bg-blue-500 text-white text-xs font-black px-2 py-0.5 rounded-md uppercase">
                      Opsi {key}
                    </span>
                    <select
                      value={formData[`opt_${key}`]}
                      onChange={(e) =>
                        handleChange(`opt_${key}`, e.target.value)
                      }
                      required
                      className="w-full bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer mt-1 shadow-sm"
                    >
                      <option value="" disabled>
                        Pilih isi opsi {key.toUpperCase()}...
                      </option>
                      {availableContents.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label} {item.value ? `(${item.value})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* KUNCI JAWABAN */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Kunci Jawaban Benar
              </label>
              <select
                value={formData.answer_key}
                onChange={(e) => handleChange("answer_key", e.target.value)}
                className="w-full md:w-1/2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-black appearance-none cursor-pointer"
              >
                <option value="A">Jawaban A</option>
                <option value="B">Jawaban B</option>
                <option value="C">Jawaban C</option>
                <option value="D">Jawaban D</option>
              </select>
            </div>

            <hr className="border-slate-100 my-6" />

            {/* BUTTON SUBMIT */}
            <div className="flex justify-end">
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
                    <span className="font-bold">Simpan Kuis</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddQuiz;