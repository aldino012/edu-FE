import { useState, useEffect } from "react";
import axios from "../../../api/axios";

/**
 * Custom hook untuk mengambil data konten "Ayo Membaca" dari API
 * @returns {Object} - data, loading, error, refetch
 */
const usePartgameData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/partgame/read");

      if (response.data.success) {
        setData(response.data.data.contents || []);
      } else {
        throw new Error(response.data.message || "Gagal mengambil data");
      }
    } catch (err) {
      console.error("❌ Error fetching partgame data:", err);
      setError(
        err.response?.data?.message || err.message || "Terjadi kesalahan",
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default usePartgameData;
