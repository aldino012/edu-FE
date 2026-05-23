import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { terbilang } from "../constants/angkaConstants";

export const useAngkaData = () => {
  const [fullAngkaList, setFullAngkaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await api.get("/contents");
        const allData = res.data.data || [];

        const filteredDB = allData
          .filter(
            (item) =>
              item.category && item.category.name.toLowerCase() === "angka",
          )
          .sort((a, b) => parseInt(a.value) - parseInt(b.value))
          .map((item) => ({
            ...item,
            label: terbilang(parseInt(item.value)),
          }));

        setFullAngkaList(filteredDB);
      } catch (err) {
        console.error("Gagal mengambil data angka:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    fullAngkaList,
    loading,
  };
};