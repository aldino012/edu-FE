import { useEffect, useState } from "react";

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
      const response = await fetch("/api/contents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
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
      const response = await fetch(
        "/api/contents/bulk-import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.token}`,
          },
          body: JSON.stringify({ category_id: 2 }),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert(result.message);

        fetchHuruf();
      } else {
        alert(result.message || "Gagal sync data");
      }
    } catch (error) {
      console.error(error);

      alert("Server error saat sync");
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
      const response = await fetch(`/api/contents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert("Berhasil dihapus");

        fetchHuruf();
      } else {
        alert(result.message || "Gagal hapus data");
      }
    } catch (error) {
      console.error(error);

      alert("Server error saat delete");
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
