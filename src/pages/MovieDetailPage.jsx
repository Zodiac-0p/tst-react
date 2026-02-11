import { useEffect, useState, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import "./MovieDetailPage.css";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function MovieDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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
          if (alive) {
            setErr("Movie not found or server error.");
            setMovie(null);
          }
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
    console.log("✅ Watch history saved:", userKey, newEntry);
  };

  const handleWatchNow = () => {
    saveWatchHistory();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="movie-detail-page">
        <div className="container movie-detail-container text-center">
          <p className="movie-msg">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="movie-detail-page">
        <div className="container movie-detail-container">
          <Link to="/movies" className="back-btn">
            ← Back to Movies
          </Link>
          <div className="alert alert-danger mt-3">{err}</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-detail-page">
        <div className="container movie-detail-container">
          <Link to="/movies" className="back-btn">
            ← Back to Movies
          </Link>
          <p className="movie-msg mt-3">Movie not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      <div className="container movie-detail-container">
        <Link to="/movies" className="back-btn">
          ← Back to Movies
        </Link>

        <div className="movie-detail-grid">
          {/* LEFT */}
          <div className="movie-info">
            {movie.thumbnail_url ? (
              <img
                src={movie.thumbnail_url}
                alt={movie.title}
                className="movie-poster"
              />
            ) : (
              <div className="no-thumb">No Thumbnail</div>
            )}

            <h2 className="movie-title">{movie.title}</h2>

            <p className="movie-desc">{movie.description}</p>

            {typeof movie.view_count !== "undefined" && (
              <span className="views-badge">Views: {movie.view_count}</span>
            )}

            {movie.video_url && (
              <button className="watch-btn" onClick={handleWatchNow}>
                Watch Now
              </button>
            )}
          </div>

          {/* RIGHT */}
          <div className="movie-video">
            {movie.video_url ? (
              <video
                ref={videoRef}
                className="video-player"
                controls
                preload="metadata"
                src={movie.video_url}
                onPlay={saveWatchHistory}
                onLoadedMetadata={saveWatchHistory}
              />
            ) : (
              <div className="alert alert-warning">
                No video uploaded for this movie.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
