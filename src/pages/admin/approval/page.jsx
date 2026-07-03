import React, { useState } from "react";
import useTableApproval from "./hook/useTableApproval";
import {
  FaCheck,
  FaTimes,
  FaUserClock,
  FaEnvelope,
  FaCalendarAlt,
  FaBan,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

const ApprovalPage = () => {
  const {
    pendingAdmins,
    approvedAdmins,
    loading,
    error,
    actionLoading,
    approveAdmin,
    rejectAdmin,
    deleteAdmin,
  } = useTableApproval();

  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    userId: null,
    userName: "",
    reason: "",
  });

  // ✅ Gabungkan semua users (pending + approved) dengan status flag
  const allUsers = [
    ...pendingAdmins.map((user) => ({ ...user, status: "pending" })),
    ...approvedAdmins.map((user) => ({ ...user, status: "approved" })),
  ];

  // Sort by created_at (terbaru di atas)
  allUsers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // ✅ Hitung statistik
  const pendingCount = pendingAdmins.filter((p) => !p.rejection_reason).length;
  const rejectedCount = pendingAdmins.filter((p) => p.rejection_reason).length;
  const approvedCount = approvedAdmins.length;

  const handleApprove = async (userId, userName) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menyetujui ${userName} sebagai admin?`,
      )
    ) {
      return;
    }

    const result = await approveAdmin(userId, userName);
    if (result.success) {
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ Error: ${result.message}`);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (
      !window.confirm(
        `⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus ${userName}?\n\nTindakan ini akan menghapus akun secara permanen dan TIDAK DAPAT dibatalkan!`,
      )
    ) {
      return;
    }

    const result = await deleteAdmin(userId, userName);
    if (result.success) {
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ Error: ${result.message}`);
    }
  };

  const openRejectModal = (userId, userName) => {
    setRejectModal({
      isOpen: true,
      userId,
      userName,
      reason: "",
    });
  };

  const closeRejectModal = () => {
    setRejectModal({
      isOpen: false,
      userId: null,
      userName: "",
      reason: "",
    });
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal.reason.trim()) {
      alert("⚠️ Alasan penolakan wajib diisi!");
      return;
    }

    const result = await rejectAdmin(
      rejectModal.userId,
      rejectModal.reason,
      rejectModal.userName,
    );

    if (result.success) {
      alert(`✅ ${result.message}`);
      closeRejectModal();
    } else {
      alert(`❌ Error: ${result.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ Helper: Cek apakah user sudah di-reject
  const isRejected = (user) => {
    return user.rejection_reason && user.rejection_reason.trim() !== "";
  };

  // ✅ Render status badge berdasarkan status user
  const renderStatusBadge = (user) => {
    if (user.status === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
          <FaCheck className="text-[10px]" />
          Active Admin
        </span>
      );
    } else if (isRejected(user)) {
      return (
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
            <FaBan className="text-[10px]" />
            Rejected
          </span>
          <p className="text-xs text-rose-600 italic">
            "{user.rejection_reason}"
          </p>
        </div>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
          <FaUserClock className="text-[10px]" />
          Pending
        </span>
      );
    }
  };

  // ✅ Render action buttons berdasarkan status
  const renderActions = (user) => {
    if (user.status === "approved") {
      // ✅ Admin aktif → tombol Delete
      return (
        <button
          onClick={() => handleDelete(user.id, user.full_name)}
          disabled={actionLoading === user.id}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-rose-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
        >
          <FaTrash />
          {actionLoading === user.id ? "Menghapus..." : "Hapus"}
        </button>
      );
    } else if (isRejected(user)) {
      // ❌ Rejected → tidak ada aksi (akan auto-delete)
      return (
        <span className="text-xs text-slate-400 italic">
          Akan dihapus otomatis
        </span>
      );
    } else {
      // ⏳ Pending → tombol Approve & Reject
      return (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleApprove(user.id, user.full_name)}
            disabled={actionLoading === user.id}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaCheck />
            {actionLoading === user.id ? "Memproses..." : "Approve"}
          </button>
          <button
            onClick={() => openRejectModal(user.id, user.full_name)}
            disabled={actionLoading === user.id}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-rose-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaTimes />
            {actionLoading === user.id ? "Memproses..." : "Reject"}
          </button>
        </div>
      );
    }
  };

  // ✅ Helper untuk styling berdasarkan status
  const getAvatarColor = (user) => {
    if (user.status === "approved") {
      return "bg-gradient-to-tr from-emerald-500 to-teal-500";
    } else if (isRejected(user)) {
      return "bg-gradient-to-tr from-rose-400 to-pink-400";
    } else {
      return "bg-gradient-to-tr from-blue-500 to-cyan-500";
    }
  };

  const getRowBackground = (user) => {
    if (user.status === "approved") {
      return "bg-emerald-50/20";
    } else if (isRejected(user)) {
      return "bg-rose-50/30";
    }
    return "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-400/30">
            <FaUsers className="text-white text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              Manajemen Admin
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Kelola pendaftaran, persetujuan, dan admin aktif
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4">
          <p className="text-rose-600 font-bold text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-center gap-3">
            <FaUserClock className="text-amber-500 text-2xl" />
            <div>
              <p className="text-2xl font-black text-amber-700">
                {pendingCount}
              </p>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                Pending
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200">
          <div className="flex items-center gap-3">
            <FaBan className="text-rose-500 text-2xl" />
            <div>
              <p className="text-2xl font-black text-rose-700">
                {rejectedCount}
              </p>
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                Rejected
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-center gap-3">
            <FaCheck className="text-emerald-500 text-2xl" />
            <div>
              <p className="text-2xl font-black text-emerald-700">
                {approvedCount}
              </p>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                Active Admins
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* UNIFIED TABLE - Semua Users */}
      {/* ============================================ */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <FaUsers className="text-slate-600 text-2xl" />
            <h2 className="text-xl font-bold text-slate-800">
              Daftar Semua User ({allUsers.length})
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1 ml-9">
            Semua permintaan pendaftaran, penolakan, dan admin aktif
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-slate-500 mt-4 font-medium">Memuat data...</p>
          </div>
        ) : allUsers.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Belum ada data user</p>
            <p className="text-slate-400 text-sm mt-2">
              User yang mendaftar akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-slate-50 transition-colors ${getRowBackground(user)}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 ${getAvatarColor(user)} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
                        >
                          {user.full_name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div>
                          <p
                            className={`font-bold ${isRejected(user) ? "text-slate-500" : "text-slate-800"}`}
                          >
                            {user.full_name || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FaEnvelope className="text-slate-400 text-sm" />
                        <span className="text-sm">{user.email || "-"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FaCalendarAlt className="text-slate-400 text-sm" />
                        <span className="text-sm">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{renderStatusBadge(user)}</td>
                    <td className="px-6 py-4 text-right">
                      {renderActions(user)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-2xl font-black text-slate-800">
                Tolak Pendaftaran
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Anda akan menolak <strong>{rejectModal.userName}</strong>
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Alasan Penolakan <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={rejectModal.reason}
                onChange={(e) =>
                  setRejectModal({ ...rejectModal, reason: e.target.value })
                }
                placeholder="Jelaskan alasan penolakan..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/20 outline-none transition-all resize-none"
                autoFocus
              />
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={closeRejectModal}
                className="flex-1 px-6 py-3 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleRejectConfirm}
                className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold hover:shadow-lg hover:shadow-rose-500/30 transition-all"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalPage;