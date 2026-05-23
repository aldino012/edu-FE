import { useEffect, useState } from "react";

const API = "/api/contents";

export const useWarnaTable = () => {
  const [dataWarna, setDataWarna] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const authData = JSON.parse(localStorage.getItem("admin_auth"));

  // === GET DATA ===
  const fetchWarna = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(API, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
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
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      if (res.ok) {
        alert("Berhasil dihapus");
        fetchWarna();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // === BULK IMPORT ===
  const handleBulkImport = async () => {
    const confirm = window.confirm("Sinkronisasi data warna?");
    if (!confirm) return;

    setIsSyncing(true);

    try {
      const res = await fetch(`${API}/bulk-import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.token}`,
        },
        body: JSON.stringify({ category_id: 3 }),
      });

      const result = await res.json();

      if (result.success) {
        alert(result.message);
        fetchWarna();
      }
    } catch (err) {
      console.error(err);
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
