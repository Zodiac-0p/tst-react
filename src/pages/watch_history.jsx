import { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

export default function WatchHistory() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [watchHistory, setWatchHistory] = useState([]);

  const loadHistory = () => {
    const userKey = user?.id ? `watch_history_${user.id}` : "watch_history_guest";
    const data = JSON.parse(localStorage.getItem(userKey) || "[]");
    setWatchHistory(data);
  };

  // ✅ reload on page open + when route changes + when user changes
  useEffect(() => {
    loadHistory();
  }, [user, location.pathname]);

  const clearHistory = () => {
    const userKey = user?.id ? `watch_history_${user.id}` : "watch_history_guest";
    localStorage.removeItem(userKey);
    setWatchHistory([]);
  };

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold text-light">Watch History</h1>
        <p className="text-secondary">Your recently watched videos</p>

        <button className="btn btn-outline-light mt-2" onClick={clearHistory}>
          Clear History
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          {watchHistory.length === 0 && (
            <p className="text-center text-light">
              No watch history yet. Play a movie first.
            </p>
          )}

          {watchHistory.map((video) => (
            <div
              key={video.id}
              className="card p-4 mb-4 border-0 shadow-lg"
              style={{
                background: "#1a1a1a",
                color: "#e0e0e0",
                borderRadius: "12px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3 align-items-center">
                  {video.thumbnail_url && (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      style={{ width: 90, height: 55, objectFit: "cover", borderRadius: 8 }}
                    />
                  )}

                  <div>
                    <h5 className="mb-1">{video.title}</h5>
                    <p className="mb-0 text-muted">
                      Watched on <em>{new Date(video.watchedAt).toLocaleString()}</em>
                    </p>
                  </div>
                </div>

                <Link to={`/movies/${video.id}`} className="btn btn-sm btn-light">
                  Watch again
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
