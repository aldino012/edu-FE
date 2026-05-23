import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// IMPORT FILE AXIOS KITA DI SINI
import api from "../.././../../api/axios";

const useTableAngka = () => {
  const navigate = useNavigate();

  const [dataAngka, setDataAngka] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const authData = JSON.parse(localStorage.getItem("admin_auth"));

  // =====================
  // FETCH DATA
  // =====================
  const fetchAngka = async () => {
    setIsLoading(true);

    try {
      // --- PERUBAHAN: Gunakan api.get ---
      const response = await api.get("/contents", {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = response.data;

      if (result.success) {
        const filtered = result.data.filter((item) => item.category_id === 1);
        setDataAngka(filtered);
      }
    } catch (error) {
      console.error("Fetch angka error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAngka();
  }, []);

  // =====================
  // BULK IMPORT
  // =====================
  const handleBulkImport = async () => {
    const confirm = window.confirm("Yakin sinkronkan data angka?");

    if (!confirm) return;

    setIsSyncing(true);

    try {
      // --- PERUBAHAN: Gunakan api.post dan kirim payload JSON secara langsung ---
      const response = await api.post(
        "/contents/bulk-import",
        { category_id: 1 }, // Axios otomatis mengubah ini menjadi JSON stringify
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        },
      );

      const result = response.data;

      if (result.success) {
        alert(result.message);
        fetchAngka();
      } else {
        alert(result.message || "Gagal sync data");
      }
    } catch (error) {
      console.error("Bulk import error:", error);
      const errMsg = error.response?.data?.message || "Server error saat sync";
      alert(errMsg);
    } finally {
      setIsSyncing(false);
    }
  };

  // =====================
  // DELETE
  // =====================
  const handleDelete = async (id) => {
    const confirm = window.confirm("Hapus data angka ini?");

    if (!confirm) return;

    try {
      // --- PERUBAHAN: Gunakan api.delete ---
      const response = await api.delete(`/contents/${id}`, {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      // Axios akan melempar error (masuk ke catch) jika status bukan 2xx.
      // Jadi jika sampai ke baris ini, berarti berhasil.
      const result = response.data;

      if (result.success) {
        alert("Berhasil dihapus");
        fetchAngka();
      } else {
        alert(result.message || "Gagal hapus");
      }
    } catch (error) {
      console.error("Delete error:", error);
      const errMsg = error.response?.data?.message || "Server error saat hapus";
      alert(errMsg);
    }
  };

  return {
    dataAngka,

    isLoading,
    isSyncing,

    fetchAngka,

    handleBulkImport,
    handleDelete,

    navigate,
  };
};

export default useTableAngka;