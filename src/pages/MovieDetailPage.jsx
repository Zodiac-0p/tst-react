import { useEffect, useState, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const API_BASE = "http://localhost:8000";

export default function MovieDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ prevent saving multiple times
  const savedOnceRef = useRef(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErr("");

      try {
        const res = await fetch(`${API_BASE}/api/movies/${id}/`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setErr("Movie not found or server error.");
          setMovie(null);
          return;
        }

        const data = await res.json();
        if (alive) setMovie(data);
      } catch (e) {
        if (alive) {
          setErr("Network error. Check Django server.");
          setMovie(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    savedOnceRef.current = false;

    return () => {
      alive = false;
    };
  }, [id]);

  const saveWatchHistory = () => {
    if (!movie) return;
    if (savedOnceRef.current) return;

    const userKey = user?.id ? `watch_history_${user.id}` : "watch_history_guest";
    const previous = JSON.parse(localStorage.getItem(userKey) || "[]");

    const filtered = previous.filter((x) => String(x.id) !== String(movie.id));

    const newEntry = {
      id: movie.id,
      title: movie.title,
      thumbnail_url: movie.thumbnail_url || null,
      watchedAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...filtered].slice(0, 50);
    localStorage.setItem(userKey, JSON.stringify(updated));

    savedOnceRef.current = true;

    // ✅ debug
    console.log("✅ Watch history saved:", userKey, newEntry);
  };

  const handleWatchNow = () => {
    saveWatchHistory(); // ✅ save even before play
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Loading movie...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container py-5">
        <Link to="/movies" className="btn btn-outline-secondary mb-3">
          ← Back to Movies
        </Link>
        <div className="alert alert-danger">{err}</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5">
        <Link to="/movies" className="btn btn-outline-secondary mb-3">
          ← Back to Movies
        </Link>
        <p>Movie not available.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Link to="/movies" className="btn btn-outline-secondary mb-3">
        ← Back to Movies
      </Link>

      <div className="d-flex flex-column flex-lg-row gap-4">
        {/* Left: Thumbnail + info */}
        <div style={{ maxWidth: 360 }}>
          {movie.thumbnail_url ? (
            <img
              src={movie.thumbnail_url}
              alt={movie.title}
              style={{
                width: "100%",
                borderRadius: 12,
                objectFit: "cover",
                marginBottom: 12,
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 200,
                borderRadius: 12,
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              No Thumbnail
            </div>
          )}

          <h2 className="mb-2">{movie.title}</h2>
          <p className="text-muted mb-2">{movie.description}</p>

          {typeof movie.view_count !== "undefined" && (
            <span className="badge bg-secondary">Views: {movie.view_count}</span>
          )}

          {/* ✅ optional button */}
          {movie.video_url && (
            <button className="btn btn-dark mt-3 w-100" onClick={handleWatchNow}>
              Watch Now
            </button>
          )}
        </div>

        {/* Right: Video */}
        <div style={{ flex: 1 }}>
          {movie.video_url ? (
            <video
              ref={videoRef}
              className="w-100"
              controls
              preload="metadata"
              src={movie.video_url}
              style={{ borderRadius: 12, background: "#000", maxHeight: "70vh" }}
              onPlay={saveWatchHistory}
              onLoadedMetadata={saveWatchHistory}  // ✅ fallback to ensure saving
            />
          ) : (
            <div className="alert alert-warning">
              No video uploaded for this movie.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
