import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import MoviesList from "./pages/MoviesList";
import MovieDetailPage from "./pages/MovieDetailPage";
import ProPlansPage from "./pages/ProPlansPage";
import WatchHistory from "./pages/watch_history";
import ChangePassword from "./pages/change_pasword";
import Login from "./pages/login";
import RegisterPage from "./pages/Register";
import NotFound from "./pages/NotFound";

import "./App.css";

function AppLayout() {
  return (
    <div className="app-container">
      {/* ✅ Left Sidebar (Hotstar style) */}
      <Sidebar />

      {/* ✅ Right content */}
      <div className="main-content">
        <Routes>
          {/* ✅ Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ✅ Protected */}
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <MoviesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/movies/:id"
            element={
              <ProtectedRoute>
                <MovieDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/plans"
            element={
              <ProtectedRoute>
                <ProPlansPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/watch-history"
            element={
              <ProtectedRoute>
                <WatchHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* ✅ Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
