import { useEffect, useState } from "react";

// IMPORT FILE AXIOS
import api from "../.././../../api/axios";

export const useWarnaTable = () => {
  const [dataWarna, setDataWarna] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const authData = JSON.parse(localStorage.getItem("admin_auth"));

  // === GET DATA ===
  const fetchWarna = async () => {
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
        const filtered = result.data.filter((item) => item.category_id === 3);
        setDataWarna(filtered);
      }
    } catch (error) {
      console.error("Error fetch warna:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // === DELETE ===
  const handleDelete = async (id) => {
    const confirm = window.confirm("Hapus data warna ini?");
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
        fetchWarna();
      } else {
        alert(result.message || "Gagal hapus data");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Server error saat delete";
      alert(errMsg);
    }
  };

  // === BULK IMPORT ===
  const handleBulkImport = async () => {
    const confirm = window.confirm("Sinkronisasi data warna?");
    if (!confirm) return;

    setIsSyncing(true);

    try {
      // --- PERUBAHAN: Gunakan api.post ---
      const response = await api.post(
        "/contents/bulk-import",
        { category_id: 3 },
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        },
      );

      const result = response.data;

      if (result.success) {
        alert(result.message);
        fetchWarna();
      } else {
        alert(result.message || "Gagal sync data");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Server error saat sync";
      alert(errMsg);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchWarna();
  }, []);

  return {
    dataWarna,
    isLoading,
    isSyncing,
    fetchWarna,
    handleDelete,
    handleBulkImport,
  };
};