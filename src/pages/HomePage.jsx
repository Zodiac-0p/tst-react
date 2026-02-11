import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import "./HomePage.css";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function HomePage() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // later you can set from API: setIsProUser(!!data.is_pro_user)
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

  const onUnlockPro = () => navigate("/plans");

  return (
    <div className="home-page">
      <div className="page-wrap">
        {/* ✅ Top Glass Bar */}
        <div className="glass-bar home-topbar">
          <div className="brand">
            <span className="brand-dot" />
            <span className="brand-name">Flickify</span>
            <span className="badge-pro">PRO</span>
          </div>

          <div className="home-topbar-right">
            {isProUser ? (
              <span className="pro-active-pill">PRO Active</span>
            ) : (
              <button className="btn pro-btn" onClick={onUnlockPro} title="Unlock PRO">
             <span className="pro-icon" aria-hidden="true">👑</span>
            <span>Unlock PRO</span>
         </button>
            )}
          </div>
        </div>
        {/* ✅ TOP AUTO SCROLL ROW */}
{!loading && movies.length > 0 && (
  <section className="top-strip">
    <h2 className="top-strip-title">Top Shows</h2>

    <div className="auto-slider">
      <div className="auto-track">
        {movies.concat(movies).map((movie, index) => (
          <div className="top-card" key={index}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  </section>
)}


        {/* ✅ PRO Hero Card */}
        <section className="home-hero-pro">
          <h1 className="home-hero-title">
            Premium Movies. No Ads. Better Quality.
          </h1>
          <p className="home-hero-subtitle">
            Unlock PRO to watch exclusive content and download movies.
          </p>

          {!isProUser && (
            <button className="btn home-hero-btn" onClick={onUnlockPro}>
              Get PRO
            </button>
          )}
        </section>

        {/* ✅ Featured Movies */}
        <section className="section">
          <h2 className="section-title">Featured Movies</h2>
          <p className="section-subtitle">Top picks picked for you</p>

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
        </section>

        {/* ✅ PRO Movies */}
        <section className="section">
          <div className="pro-title-row">
            <div>
              <h2 className="section-title">PRO Movies</h2>
              <p className="section-subtitle">Exclusive for PRO members</p>
            </div>
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
                    <button className="lock-overlay" onClick={onUnlockPro}>
                      <span className="lock-pill">🔒 Unlock PRO</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}
