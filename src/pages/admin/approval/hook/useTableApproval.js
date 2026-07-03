import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "../../../../api/axios";

// ✅ Helper function untuk mendapatkan token dari localStorage
const getAuthToken = () => {
  const authData = localStorage.getItem("admin_auth");
  if (!authData) return null;

  try {
    const parsed = JSON.parse(authData);
    // Cek apakah token masih valid
    if (parsed.token && parsed.expiry > Date.now()) {
      return parsed.token;
    }
    return null;
  } catch (err) {
    console.error("Error parsing auth data:", err);
    return null;
  }
};

const useTableApproval = () => {
  // State untuk pending admins
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);

  // State untuk approved admins
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [loadingApproved, setLoadingApproved] = useState(true);

  // Unified loading state (true jika salah satu masih loading)
  const loading = loadingPending || loadingApproved;

  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Ref untuk abort controller
  const abortControllerRef = useRef(null);

  // Fetch semua pending admins
  const fetchPendingAdmins = useCallback(async (signal) => {
    try {
      setLoadingPending(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login ulang.");
      }

      const response = await axiosInstance.get("/auth/pending-admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal, // ✅ Support untuk abort
      });

      if (response.data.success) {
        setPendingAdmins(response.data.data || []);
      } else {
        throw new Error(
          response.data.message || "Gagal memuat data pending admin",
        );
      }
    } catch (err) {
      // Jangan set error jika request di-abort
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        console.log("Fetch pending admins cancelled");
        return;
      }

      console.error("Fetch pending admins error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat memuat data pending admin",
      );
    } finally {
      setLoadingPending(false);
    }
  }, []);

  // Fetch semua approved admins
  const fetchApprovedAdmins = useCallback(async (signal) => {
    try {
      setLoadingApproved(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login ulang.");
      }

      const response = await axiosInstance.get("/auth/approved-admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal, // ✅ Support untuk abort
      });

      if (response.data.success) {
        setApprovedAdmins(response.data.data || []);
      } else {
        throw new Error(
          response.data.message || "Gagal memuat data approved admin",
        );
      }
    } catch (err) {
      // Jangan set error jika request di-abort
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        console.log("Fetch approved admins cancelled");
        return;
      }

      console.error("Fetch approved admins error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat memuat data approved admin",
      );
    } finally {
      setLoadingApproved(false);
    }
  }, []);

  // Approve admin
  const approveAdmin = useCallback(
    async (userId, userName) => {
      try {
        setActionLoading(userId);
        setError(null);

        const token = getAuthToken();
        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login ulang.");
        }

        const response = await axiosInstance.put(
          `/auth/approve-admin/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          // ✅ Refresh kedua data: pending dan approved
          await Promise.all([fetchPendingAdmins(), fetchApprovedAdmins()]);
          return { success: true, message: response.data.message };
        } else {
          throw new Error(response.data.message || "Gagal approve admin");
        }
      } catch (err) {
        console.error("Approve admin error:", err);
        const errorMessage =
          err.response?.data?.message || err.message || "Gagal approve admin";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setActionLoading(null);
      }
    },
    [fetchPendingAdmins, fetchApprovedAdmins],
  );

  // Reject admin dengan alasan
  const rejectAdmin = useCallback(
    async (userId, reason, userName) => {
      try {
        setActionLoading(userId);
        setError(null);

        const token = getAuthToken();
        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login ulang.");
        }

        const response = await axiosInstance.put(
          `/auth/reject-admin/${userId}`,
          {
            reason: reason || "Tidak ada alasan",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          await fetchPendingAdmins();
          return { success: true, message: response.data.message };
        } else {
          throw new Error(response.data.message || "Gagal reject admin");
        }
      } catch (err) {
        console.error("Reject admin error:", err);
        const errorMessage =
          err.response?.data?.message || err.message || "Gagal reject admin";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setActionLoading(null);
      }
    },
    [fetchPendingAdmins],
  );

  // Delete admin
  const deleteAdmin = useCallback(
    async (userId, userName) => {
      try {
        setActionLoading(userId);
        setError(null);

        const token = getAuthToken();
        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login ulang.");
        }

        const response = await axiosInstance.delete(
          `/auth/delete-admin/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          // ✅ Refresh data approved admins setelah delete
          await fetchApprovedAdmins();
          return { success: true, message: response.data.message };
        } else {
          throw new Error(response.data.message || "Gagal menghapus admin");
        }
      } catch (err) {
        console.error("Delete admin error:", err);
        const errorMessage =
          err.response?.data?.message || err.message || "Gagal menghapus admin";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setActionLoading(null);
      }
    },
    [fetchApprovedAdmins],
  );

  // Fetch data saat component mount dengan cleanup
  useEffect(() => {
    // Buat abort controller baru
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    // Fetch kedua data secara paralel
    Promise.all([
      fetchPendingAdmins(signal),
      fetchApprovedAdmins(signal),
    ]).catch((err) => {
      console.error("Error fetching initial data:", err);
    });

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        console.log("🧹 Cleanup: Abort pending requests");
      }
    };
  }, [fetchPendingAdmins, fetchApprovedAdmins]);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    await Promise.all([fetchPendingAdmins(), fetchApprovedAdmins()]);
  }, [fetchPendingAdmins, fetchApprovedAdmins]);

  return {
    // Pending admins
    pendingAdmins,
    loadingPending,

    // Approved admins
    approvedAdmins,
    loadingApproved,

    // Unified loading state
    loading,

    // Shared states
    error,
    actionLoading,

    // Actions (memoized dengan useCallback)
    approveAdmin,
    rejectAdmin,
    deleteAdmin,

    // Refresh functions
    refreshPendingData: fetchPendingAdmins,
    refreshApprovedData: fetchApprovedAdmins,
    refreshAllData,
  };
};

export default useTableApproval;