import { useState, useEffect } from "react";
import api from "../../../api/axios"; // Sesuaikan path jika perlu

const useWarnaData = () => {
  const [warnaList, setWarnaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/contents");
        const allData = res.data.data || [];

        // Filter kategori 'Warna'
        const filtered = allData.filter(
          (item) =>
            item.category && item.category.name.toLowerCase() === "warna",
        );
        setWarnaList(filtered);
      } catch (err) {
        console.error("Gagal mengambil data warna:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { warnaList, loading };
};

export default useWarnaData;