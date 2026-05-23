import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const LayoutHuruf = () => {
  const location = useLocation();

  // Jika user hanya mengakses "/admin/huruf", otomatis arahkan (redirect) ke "/admin/huruf/table"
  if (
    location.pathname === "/admin/huruf" ||
    location.pathname === "/admin/huruf/"
  ) {
    return <Navigate to="/admin/huruf/table" replace />;
  }

  return (
    <div className="w-full">
      {/* 
        <Outlet /> adalah tempat di mana komponen Add, Edit, atau Table 
        akan dimunculkan (di-render) oleh React Router.
      */}
      <Outlet />
    </div>
  );
};

export default LayoutHuruf;
