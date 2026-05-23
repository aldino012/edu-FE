import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import { useEditQuiz } from "../hook/useEditQuiz";
import { FaArrowLeft, FaSave, FaSpinner, FaEdit } from "react-icons/fa";

const EditQuiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    formData,
    setFormData,
    dataContents,
    isLoading,
    isSubmitting,
    updateQuiz,
  } = useEditQuiz(id);

  // Filter konten berdasarkan kategori yang dipilih
  const availableContents = dataContents.filter(
    (item) => item.category_id === parseInt(formData.category_id),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    updateQuiz(navigate);
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <FaSpinner className="animate-spin text-5xl text-blue-500" />
        <Text className="text-slate-500 font-bold animate-pulse text-lg">
          Memuat data kuis...
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 gap-4">
        <div>
          <Text
            variant="subtitle"
            className="text-slate-800 font-black text-xl flex items-center gap-2"
          >
            <FaEdit className="text-blue-500" />
            Edit Kuis
          </Text>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Ubah data soal, pilihan jawaban, atau kunci jawaban kuis.
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
              Kategori Kuis
            </label>
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category_id: e.target.value,
                  // Reset opsi saat kategori berubah agar tidak ada ID yang nyangkut
                  opt_a: "",
                  opt_b: "",
                  opt_c: "",
                  opt_d: "",
                })
              }
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

          {/* QUESTION */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
              Teks Pertanyaan
            </label>
            <textarea
              value={formData.question_text}
              onChange={(e) =>
                setFormData({ ...formData, question_text: e.target.value })
              }
              placeholder="Masukkan pertanyaan di sini..."
              required
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium resize-none"
            />
          </div>

          {/* OPTIONS (Dibuat Grid 2x2) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
              Pilihan Jawaban (A, B, C, D)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              {["a", "b", "c", "d"].map((k) => (
                <div key={k} className="flex flex-col relative">
                  <span className="absolute -top-3 left-3 bg-blue-500 text-white text-xs font-black px-2 py-0.5 rounded-md uppercase">
                    Opsi {k}
                  </span>
                  <select
                    value={formData[`opt_${k}`]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`opt_${k}`]: e.target.value,
                      })
                    }
                    required
                    className="w-full bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer mt-1 shadow-sm"
                  >
                    <option value="" disabled>
                      Pilih isi opsi {k.toUpperCase()}...
                    </option>
                    {availableContents.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} {c.value ? `(${c.value})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* ANSWER */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
              Kunci Jawaban Benar
            </label>
            <select
              value={formData.answer_key}
              onChange={(e) =>
                setFormData({ ...formData, answer_key: e.target.value })
              }
              className="w-full md:w-1/2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-black appearance-none cursor-pointer"
            >
              <option value="A">Jawaban A</option>
              <option value="B">Jawaban B</option>
              <option value="C">Jawaban C</option>
              <option value="D">Jawaban D</option>
            </select>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* BUTTONS ACTION */}
          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="button"
              onClick={() => navigate("/admin/quiz/table")}
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

export default EditQuiz;