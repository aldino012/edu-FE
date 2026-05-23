import { useEffect, useState } from "react";
import api from "../../../api/axios";

const useHurufData = () => {
  const [hurufList, setHurufList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await api.get("/contents");
        const allData = res.data.data || [];

        const filtered = allData.filter(
          (item) => item.category?.name?.toLowerCase() === "huruf",
        );

        setHurufList(filtered);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    hurufList,
    loading,
    error,
    setHurufList, // optional kalau nanti butuh refresh manual
  };
};

export default useHurufData;