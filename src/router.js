import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/homepage";
import Movies from "./pages/Movies";
import WatchHistory from "./pages/watch_history";
import ChangePassword from "./pages/ChangePassword";
import WatchLater from "./pages/WatchLater";
import Login from "./pages/login";
import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="landing-page">
        {/* Navbar */}
        <nav className="navbar">
          <h1 className="logo">Flickify</h1>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/watch-history">Watch History</Link></li>
            <li><Link to="/change-password">Change Password</Link></li>
            <li><Link to="/watch-later">Watch Later</Link></li>
            <li><Link to="/login"><button className="btn-outline">Login</button></Link></li>
          </ul>
        </nav>

        {/* Hero Section */}
        <div className="hero">
          <h1>Flickify</h1>
          <h3>OTT Platform</h3>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/watch-history" element={<WatchHistory />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/watch-later" element={<WatchLater />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
