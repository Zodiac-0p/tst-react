import { Link } from "react-router-dom";
import "./MovieCard.css";

export default function MovieCard({ movie }) {
  const poster =
    movie.thumbnail && movie.thumbnail.length > 0
      ? movie.thumbnail
      : "https://via.placeholder.com/300x450?text=No+Thumbnail";

  return (
    <div className="movie-card">
      <img className="movie-poster" src={poster} alt={movie.title} />

      {/* Hover Overlay */}
      <div className="movie-overlay">
        <h4 className="movie-title">{movie.title}</h4>

        {movie.description ? (
          <p className="movie-desc">{movie.description}</p>
        ) : (
          <p className="movie-desc">No description</p>
        )}

        <Link className="watch-btn" to={`/movies/${movie.id}`}>
          Watch
        </Link>
      </div>
    </div>
  );
}
