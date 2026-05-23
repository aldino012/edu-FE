import { useEffect, useState } from "react";

// IMPORT FILE AXIOS KITA DI SINI
import api from "../.././../../api/axios";

const useTableHuruf = () => {
  const [dataHuruf, setDataHuruf] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const authData = JSON.parse(localStorage.getItem("admin_auth"));

  // =========================
  // GET DATA
  // =========================
  const fetchHuruf = async () => {
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
        const filtered = result.data.filter((item) => item.category_id === 2);
        setDataHuruf(filtered);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // BULK IMPORT
  // =========================
  const handleBulkImport = async () => {
    const confirm = window.confirm("Yakin ingin sinkronkan data sample?");

    if (!confirm) return;

    setIsSyncing(true);

    try {
      // --- PERUBAHAN: Gunakan api.post ---
      const response = await api.post(
        "/contents/bulk-import",
        { category_id: 2 }, // Body JSON langsung dikirim
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        },
      );

      const result = response.data;

      if (result.success) {
        alert(result.message);
        fetchHuruf();
      } else {
        alert(result.message || "Gagal sync data");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Server error saat sync";
      alert(errMsg);
    } finally {
      setIsSyncing(false);
    }
  };

  // =========================
  // DELETE DATA
  // =========================
  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin ingin hapus data ini?");

    if (!confirm) return;

    try {
      // --- PERUBAHAN: Gunakan api.delete ---
      const response = await api.delete(`/contents/${id}`, {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = response.data;

      if (result.success) {
        alert("Berhasil dihapus");
        fetchHuruf();
      } else {
        alert(result.message || "Gagal hapus data");
      }
    } catch (error) {
      console.error(error);
      const errMsg =
        error.response?.data?.message || "Server error saat delete";
      alert(errMsg);
    }
  };

  // INIT LOAD
  useEffect(() => {
    fetchHuruf();
  }, []);

  return {
    dataHuruf,
    isLoading,
    isSyncing,

    fetchHuruf,
    handleBulkImport,
    handleDelete,
  };
};

export default useTableHuruf;