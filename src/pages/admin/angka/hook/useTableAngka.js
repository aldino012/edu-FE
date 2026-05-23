import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch("/api/contents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
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
      const response = await fetch(
        "/api/contents/bulk-import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData?.token}`,
          },
          body: JSON.stringify({ category_id: 1 }),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert(result.message);

        fetchAngka();
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

  // =====================
  // DELETE
  // =====================
  const handleDelete = async (id) => {
    const confirm = window.confirm("Hapus data angka ini?");

    if (!confirm) return;

    try {
      const response = await fetch(`/api/contents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      if (response.ok) {
        alert("Berhasil dihapus");

        fetchAngka();
      } else {
        const result = await response.json();

        alert(result.message || "Gagal hapus");
      }
    } catch (error) {
      console.error(error);

      alert("Server error saat hapus");
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
