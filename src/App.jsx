import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useContext } from "react";

import RegisterPage from "./pages/Register";
import HomePage from "./pages/homepage";
import WatchHistory from "./pages/watch_history";
import ChangePassword from "./pages/change_pasword";
import Login from "./pages/login";
import NotFound from "./pages/NotFound";

import MoviesList from "./pages/MoviesList";
import MovieDetailPage from "./pages/MovieDetailPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./AuthProvider";

import "./App.css";

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="landing-page">
      <nav className="navbar">
        <h1 className="logo">Flickify</h1>

        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>

          {user === null && <li style={{ color: "white" }}>Checking session...</li>}

          {user && (
            <>
              <li>
                <Link to="/movies">Movies</Link>
              </li>
              <li>
                <Link to="/watch-history">Watch History</Link>
              </li>
              <li>
                <Link to="/change-password">Change Password</Link>
              </li>
              <li>
                <button className="btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

          {user === false && (
            <>
              <li>
                <Link to="/login">
                  <button className="btn-outline">Login</button>
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <button className="btn-outline">Register</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {location.pathname === "/" && (
        <div className="hero">
          <h1>Flickify</h1>
          <h3>OTT Platform</h3>
          <p>
            Success is not final, failure is not fatal, it is the courage to
            continue that counts.
          </p>
        </div>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />

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

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
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
