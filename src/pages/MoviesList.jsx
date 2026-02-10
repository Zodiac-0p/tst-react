import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API = "http://127.0.0.1:8000/api/movies/";

function SkeletonCard() {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="card bg-dark border-0 shadow-sm overflow-hidden">
        <div
          className="placeholder-glow"
          style={{ height: 180, background: "#1c1f2a" }}
        >
          <span className="placeholder col-12" style={{ height: "100%" }} />
        </div>
        <div className="card-body">
          <p className="placeholder-glow mb-2">
            <span className="placeholder col-7"></span>
          </p>
          <p className="placeholder-glow mb-0">
            <span className="placeholder col-4"></span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // latest | az | za

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr("");
        setLoading(true);

        const res = await fetch(API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (alive) setMovies(Array.isArray(data) ? data : []);
      } catch (e) {
        console.log("MoviesList fetch error:", e);
        if (alive) {
          setErr("Could not load movies. Check Django server.");
          setMovies([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => (alive = false);
  }, []);

  const filtered = useMemo(() => {
    let list = [...movies];

    // search
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((m) => (m.title || "").toLowerCase().includes(q));
    }

    // sort
    if (sortBy === "az") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "za") {
      list.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    } else {
      // latest: assume larger id is newer
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return list;
  }, [movies, query, sortBy]);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h2 className="mb-1 text-white">Movies</h2>
          <div className="text-secondary">
            {loading ? "Loading..." : `${filtered.length} movie(s)`}
          </div>
        </div>

        {/* Search + Sort */}
        <div className="d-flex flex-wrap gap-2">
          <div className="input-group" style={{ width: 260 }}>
            <span className="input-group-text bg-dark text-white border-secondary">
              <i className="bi bi-search"></i>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control bg-dark text-white border-secondary"
              placeholder="Search movies..."
            />
          </div>

          <select
            className="form-select bg-dark text-white border-secondary"
            style={{ width: 180 }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Sort: Latest</option>
            <option value="az">Sort: A → Z</option>
            <option value="za">Sort: Z → A</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {err}
        </div>
      )}

      {/* Grid */}
      <div className="row g-4">
        {loading &&
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

        {!loading &&
          !err &&
          filtered.map((m) => (
            <div key={m.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <Link to={`/movies/${m.id}`} style={{ textDecoration: "none" }}>
                <div className="pro-card">
                  {m.thumbnail_url ? (
                    <img
                      src={m.thumbnail_url}
                      alt={m.title}
                      className="pro-card-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="pro-card-noimg">No Thumbnail</div>
                  )}

                  {/* Hover Overlay */}
                  <div className="pro-card-overlay">
                    <div className="pro-card-title">{m.title}</div>
                    <div className="pro-card-cta">
                      <span className="badge text-bg-info">
                        <i className="bi bi-play-fill me-1"></i> Watch
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}

        {!loading && !err && filtered.length === 0 && (
          <div className="col-12">
            <div className="empty-box">
              <div className="empty-icon">
                <i className="bi bi-film"></i>
              </div>
              <h5 className="text-white mb-1">No movies found</h5>
              <div className="text-secondary">
                {movies.length === 0
                  ? "No movies uploaded yet."
                  : "Try a different search keyword."}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Page background feel */}
      <style>{`
        body { background:#05070f; }
        .pro-card{
          position:relative;
          border-radius:14px;
          overflow:hidden;
          background:#141725;
          box-shadow: 0 10px 25px rgba(0,0,0,.35);
          transform: translateY(0);
          transition: transform .18s ease, box-shadow .18s ease;
          height: 180px;
        }
        .pro-card:hover{
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,.5);
        }
        .pro-card-img{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          filter: saturate(1.05);
          transform: scale(1);
          transition: transform .22s ease;
        }
        .pro-card:hover .pro-card-img{
          transform: scale(1.06);
        }
        .pro-card-noimg{
          height:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          color: rgba(255,255,255,.75);
          background: #1c1f2a;
        }
        .pro-card-overlay{
          position:absolute;
          inset:0;
          display:flex;
          flex-direction:column;
          justify-content:flex-end;
          padding:12px;
          background: linear-gradient(to top,
            rgba(0,0,0,.9) 0%,
            rgba(0,0,0,.35) 60%,
            rgba(0,0,0,.10) 100%);
          opacity: 0.95;
        }
        .pro-card-title{
          color:#fff;
          font-weight:800;
          font-size:14px;
          text-shadow: 0 8px 20px rgba(0,0,0,.6);
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        .pro-card-cta{ margin-top:6px; }
        .empty-box{
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(20,23,37,.6);
          border-radius: 18px;
          padding: 28px;
          text-align:center;
        }
        .empty-icon{
          width:54px;height:54px;
          margin:0 auto 12px auto;
          border-radius:14px;
          background: rgba(255,255,255,.06);
          display:flex;
          align-items:center;
          justify-content:center;
          color:#fff;
          font-size:24px;
        }
      `}</style>
    </div>
  );
}
