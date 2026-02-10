import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import "./HomePage.css";

const API_BASE = "http://localhost:8000";

export default function HomePage() {
  const navigate = useNavigate(); // ✅ ADD THIS

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/home-movies/`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load movies");
        const data = await res.json();

        if (alive) {
          setMovies(data.movies || []);
          // setIsProUser(!!data.is_pro_user);
        }
      } catch (err) {
        console.log(err);
        if (alive) setMovies([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const { freeMovies, proMovies } = useMemo(() => {
    const free = [];
    const pro = [];
    for (const m of movies) {
      const proFlag = !!(m.is_pro ?? m.isPro ?? m.pro);
      proFlag ? pro.push(m) : free.push(m);
    }
    return { freeMovies: free, proMovies: pro };
  }, [movies]);

  const onUnlockPro = () => {
    navigate("/plans"); // ✅ GO TO PRO PLANS PAGE
  };

  return (
    <div className="home-page">
      <div className="pro-bar">
        <div className="pro-left">
          <span className="logo-dot" />
          <span className="logo-text">Flickify</span>
          <span className="pro-badge">PRO</span>
        </div>

        <div className="pro-right">
          {isProUser ? (
            <span className="pro-active">PRO Active</span>
          ) : (
            <button className="pro-btn" onClick={onUnlockPro}>
              Unlock PRO
            </button>
          )}
        </div>
      </div>

      <div className="hero">
        <h1>Premium Movies. No Ads. Better Quality.</h1>
        <p>Unlock PRO to watch exclusive content and download movies.</p>

        {!isProUser && (
          <button className="hero-btn" onClick={onUnlockPro}>
            Get PRO
          </button>
        )}
      </div>

      <main className="main-content">
        <h2 className="section-title">Featured Movies</h2>

        {loading ? (
          <p className="home-msg">Loading...</p>
        ) : freeMovies.length === 0 ? (
          <p className="home-msg">No movies uploaded</p>
        ) : (
          <div className="movies-container">
            {freeMovies.slice(0, 8).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        <div className="pro-section">
          <div className="pro-title-row">
            <h2 className="section-title">PRO Movies</h2>
            <span className="pro-only">PRO ONLY</span>
          </div>

          {loading ? (
            <p className="home-msg">Loading...</p>
          ) : proMovies.length === 0 ? (
            <p className="home-msg">No PRO movies yet</p>
          ) : (
            <div className="movies-container">
              {proMovies.slice(0, 8).map((movie) => (
                <div key={movie.id} className="pro-card-wrap">
                  <MovieCard movie={movie} />
                  {!isProUser && (
                    <div className="lock-overlay" onClick={onUnlockPro}>
                      <span className="lock-pill">🔒 Unlock PRO</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
