import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const LayoutQuiz = () => {
  const location = useLocation();

  // Jika user hanya mengakses "/admin/quiz", otomatis arahkan (redirect) ke "/admin/quiz/table"
  if (
    location.pathname === "/admin/quiz" ||
    location.pathname === "/admin/quiz/"
  ) {
    return <Navigate to="/admin/quiz/table" replace />;
  }

  return (
    <div className="w-full">
      {/* 
        <Outlet /> adalah tempat di mana komponen Add, Edit, atau Table 
        dari folder quiz akan dimunculkan oleh React Router.
      */}
      <Outlet />
    </div>
  );
};

export default LayoutQuiz;
