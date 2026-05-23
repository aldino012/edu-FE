import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const LayoutAngka = () => {
  const location = useLocation();

  // Jika user hanya mengakses "/admin/angka", otomatis arahkan (redirect) ke "/admin/angka/table"
  if (
    location.pathname === "/admin/angka" ||
    location.pathname === "/admin/angka/"
  ) {
    return <Navigate to="/admin/angka/table" replace />;
  }

  return (
    <div className="w-full">
      {/* 
        <Outlet /> adalah tempat di mana komponen Add, Edit, atau Table 
        dari folder angka akan dimunculkan oleh React Router.
      */}
      <Outlet />
    </div>
  );
};

export default LayoutAngka;