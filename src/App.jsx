import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages User
import Homepage from "./pages/Home/Homepage";
import HurufPage from "./pages/huruf/HurufPage";
import AngkaPage from "./pages/angka/AngkaPage";
import WarnaPage from "./pages/warna/WarnaPage";
import QuizPage from "./pages/quiz/QuizPage";

// Pages Admin & Auth
import AdminLogin from "./pages/admin/login";
import ProtectedRoute from "./components/ProtectedRoute";

// ============================================
// IMPORT ADMIN LAYOUTS & SUB-PAGES (MODULAR)
// ============================================
import AdminLayout from "./pages/admin/page";

// --- MODUL ANGKA ---
import AdminAngka from "./pages/admin/angka/page";
import TableAngka from "./pages/admin/angka/table/page";
import AddAngka from "./pages/admin/angka/add/page";
import EditAngka from "./pages/admin/angka/edit/page";

// --- MODUL HURUF ---
import AdminHuruf from "./pages/admin/huruf/page";
import TableHuruf from "./pages/admin/huruf/table/page";
import AddHuruf from "./pages/admin/huruf/add/page";
import EditHuruf from "./pages/admin/huruf/edit/page";

// --- MODUL WARNA ---
import AdminWarna from "./pages/admin/warna/page";
import TableWarna from "./pages/admin/warna/table/page";
import AddWarna from "./pages/admin/warna/add/page";
import EditWarna from "./pages/admin/warna/edit/page";

// --- MODUL QUIZ ---
import AdminQuiz from "./pages/admin/quiz/page";
import TableQuiz from "./pages/admin/quiz/table/page";
import AddQuiz from "./pages/admin/quiz/add/page";
import EditQuiz from "./pages/admin/quiz/edit/page";

function App() {
  return (
    <Router>
      <main className="antialiased min-h-screen bg-[#244f6f]">
        <Routes>
          {/* ================= USER ROUTES ================= */}
          <Route path="/" element={<Homepage />} />
          <Route path="/huruf" element={<HurufPage />} />
          <Route path="/angka" element={<AngkaPage />} />
          <Route path="/warna" element={<WarnaPage />} />
          <Route path="/quiz" element={<QuizPage />} />

          {/* ================= AUTH ROUTES ================= */}
          {/* Halaman login admin sebelum masuk ke dashboard */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ================= ADMIN ROUTES (Protected) ================= */}
          {/* Semua route di dalam element ProtectedRoute akan dicek tokennya */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              {/* Redirect otomatis ke menu huruf (table) saat pertama kali masuk admin */}
              <Route
                index
                element={<Navigate to="/admin/huruf/table" replace />}
              />

              {/* === MENU ADMIN ANGKA === */}
              <Route path="angka" element={<AdminAngka />}>
                <Route path="table" element={<TableAngka />} />
                <Route path="add" element={<AddAngka />} />
                <Route path="edit/:id" element={<EditAngka />} />
              </Route>

              {/* === MENU ADMIN HURUF === */}
              <Route path="huruf" element={<AdminHuruf />}>
                <Route path="table" element={<TableHuruf />} />
                <Route path="add" element={<AddHuruf />} />
                <Route path="edit/:id" element={<EditHuruf />} />
              </Route>

              {/* === MENU ADMIN WARNA === */}
              <Route path="warna" element={<AdminWarna />}>
                <Route path="table" element={<TableWarna />} />
                <Route path="add" element={<AddWarna />} />
                <Route path="edit/:id" element={<EditWarna />} />
              </Route>

              {/* === MENU ADMIN QUIZ === */}
              <Route path="quiz" element={<AdminQuiz />}>
                <Route path="table" element={<TableQuiz />} />
                <Route path="add" element={<AddQuiz />} />
                <Route path="edit/:id" element={<EditQuiz />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback jika URL tidak dikenal, lempar ke Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
