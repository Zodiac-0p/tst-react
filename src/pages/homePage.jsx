import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import Footer from "../components/footer";
import "./HomePage.css";

const API_BASE = "http://127.0.0.1:8000"; // change if needed

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/home-movies/`);
        if (!res.ok) throw new Error("Failed to load movies");
        const data = await res.json();

        if (alive) setMovies(data.movies || []);
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

  return (
    <div className="home-page">
      <main className="main-content">
        <h2 className="featured-title">Featured Movies</h2>

        {loading ? (
          <p className="home-msg">Loading...</p>
        ) : movies.length === 0 ? (
          <p className="home-msg">No movies uploaded</p>
        ) : (
          <div className="movies-container">
            {movies.slice(0, 3).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
