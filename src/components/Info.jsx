import React from "react";
import Card from "./Card";
import Button from "./Button";
import Text from "./Text";
import { FaDatabase, FaSync, FaCheckCircle, FaChartLine } from "react-icons/fa";

const Info = ({ 
  syncData = null,  // Data dari API (angka, huruf, warna)
  onSyncClick = null, // Handler untuk tombol sinkronisasi
  className = "" 
}) => {
  // Hitung statistik dari data yang disinkronkan
  const getStatistics = () => {
    if (!syncData) return null;

    const statistics = {
      angka: 0,
      huruf: 0,
      warna: 0,
      total: 0
    };

    if (syncData.angka && Array.isArray(syncData.angka)) {
      statistics.angka = syncData.angka.length;
      statistics.total += statistics.angka;
    }

    if (syncData.huruf && Array.isArray(syncData.huruf)) {
      statistics.huruf = syncData.huruf.length;
      statistics.total += statistics.huruf;
    }

    if (syncData.warna && Array.isArray(syncData.warna)) {
      statistics.warna = syncData.warna.length;
      statistics.total += statistics.warna;
    }

    return statistics;
  };

  const stats = getStatistics();

  return (
    <Card variant="info" className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-2xl">
            <FaDatabase className="text-blue-600 text-2xl" />
          </div>
          <div>
            <Text 
              textKey="sync_info_title" 
              variant="info_title"
              className="text-slate-800"
            />
            <Text 
              textKey="sync_info_description" 
              variant="caption"
              className="text-slate-500 mt-1"
            />
          </div>
        </div>

        {/* Statistik Data */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Total Data */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
              <FaChartLine className="text-blue-500 text-2xl mx-auto mb-2" />
              <div className="text-3xl font-black text-blue-600">{stats.total}</div>
              <Text textKey="sync_total_data" variant="caption" className="text-slate-600" />
            </div>

            {/* Angka */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-green-600">{stats.angka}</div>
              <Text textKey="sync_category_angka" variant="caption" className="text-slate-600" />
            </div>

            {/* Huruf */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-purple-600">{stats.huruf}</div>
              <Text textKey="sync_category_huruf" variant="caption" className="text-slate-600" />
            </div>

            {/* Warna */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-orange-600">{stats.warna}</div>
              <Text textKey="sync_category_warna" variant="caption" className="text-slate-600" />
            </div>
          </div>
        )}

        {/* Daftar Data yang Akan Disinkronkan */}
        <div className="mb-6">
          <Text variant="subtitle" className="text-slate-700 mb-4 text-lg">
            Data yang akan disinkronkan:
          </Text>
          
          <div className="space-y-4">
            {/* Data Angka */}
            {syncData?.angka && syncData.angka.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-green-500 text-sm" />
                  <Text textKey="sync_category_angka" variant="label" className="text-slate-700" />
                  <span className="text-xs text-slate-400">({stats.angka} data)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {syncData.angka.slice(0, 10).map((item) => (
                    <span 
                      key={item.id} 
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium"
                    >
                      {item.value} - {item.label}
                    </span>
                  ))}
                  {stats.angka > 10 && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-sm">
                      +{stats.angka - 10} lainnya
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Data Huruf */}
            {syncData?.huruf && syncData.huruf.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-purple-500 text-sm" />
                  <Text textKey="sync_category_huruf" variant="label" className="text-slate-700" />
                  <span className="text-xs text-slate-400">({stats.huruf} data)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {syncData.huruf.slice(0, 10).map((item) => (
                    <span 
                      key={item.id} 
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium"
                    >
                      {item.value} - {item.label}
                    </span>
                  ))}
                  {stats.huruf > 10 && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-sm">
                      +{stats.huruf - 10} lainnya
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Data Warna */}
            {syncData?.warna && syncData.warna.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-orange-500 text-sm" />
                  <Text textKey="sync_category_warna" variant="label" className="text-slate-700" />
                  <span className="text-xs text-slate-400">({stats.warna} data)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {syncData.warna.slice(0, 10).map((item) => (
                    <span 
                      key={item.id} 
                      className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <span 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.value }}
                      />
                      {item.label}
                    </span>
                  ))}
                  {stats.warna > 10 && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-sm">
                      +{stats.warna - 10} lainnya
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tombol Sinkronisasi */}
        {onSyncClick && (
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              onClick={onSyncClick}
              variant="primary"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all"
            >
              <FaSync className="text-sm" />
              <span>Sinkronkan Sekarang</span>
            </Button>
          </div>
        )}

        {/* Pesan jika tidak ada data */}
        {(!syncData || stats?.total === 0) && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaDatabase className="text-slate-400 text-2xl" />
            </div>
            <Text variant="body" className="text-slate-500">
              Belum ada data yang tersedia untuk disinkronkan
            </Text>
            <Text variant="caption" className="text-slate-400 mt-2">
              Klik tombol sinkronisasi untuk mengambil data dari server
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Info;