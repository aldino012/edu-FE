import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const LayoutWarna = () => {
  const location = useLocation();

  // Jika user hanya mengakses "/admin/warna", otomatis arahkan (redirect) ke "/admin/warna/table"
  if (
    location.pathname === "/admin/warna" ||
    location.pathname === "/admin/warna/"
  ) {
    return <Navigate to="/admin/warna/table" replace />;
  }

  return (
    <div className="w-full">
      {/* 
        <Outlet /> adalah tempat di mana komponen Add, Edit, atau Table 
        dari folder warna akan dimunculkan oleh React Router.
      */}
      <Outlet />
    </div>
  );
};

export default LayoutWarna;