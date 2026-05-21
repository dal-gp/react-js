import { useEffect, useState } from "react";
const tempMovieData = [
  {
    imdbID: "tt137566",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "2b26c15f";
function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watchedMovies, setWatchedMovies] = useState(tempWatchedMovieData);
  useEffect(function () {
    fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
      .then((res) => res.json())
      .then((data) => setMovies(data.Search));
  }, []);
  return (
    <>
      <NavBar>
        <Logo />
        <Search />
        <NumResults movies={movies} />
      </NavBar>
      {/* <Main>
        <Box>
          <MovieList movies={movies} />
        </Box>
        <Box>
          <WatchedSummary watchedMovies={watchedMovies} />
          <WatchedMovieList watchedMovies={watchedMovies} />
        </Box>
      </Main> */}
      <Main>
        <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watchedMovies={watchedMovies} />
              <WatchedMovieList watchedMovies={watchedMovies} />
            </>
          }
        ></Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <a href="#">
        <span role="img">🍿</span>
        <h1 className="logo">usePopcorn</h1>
      </a>
    </div>
  );
}

function Search() {
  const [query, setQuery] = useState("");
  return (
    <input
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return <p>Found {movies.length} results</p>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ element }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <button onClick={() => setIsOpen((p) => !p)}>{isOpen ? "-" : "+"}</button>
      {isOpen && element}
    </div>
  );
}

function MovieList({ movies }) {
  return (
    <ul>
      {movies.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>️<span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watchedMovies }) {
  const avgIMDBRating =
    watchedMovies.reduce((accu, movie) => accu + movie.imdbRating, 0) /
    watchedMovies.length;
  const avgUserRating =
    watchedMovies.reduce((accu, movie) => accu + movie.userRating, 0) /
    watchedMovies.length;

  const avgRuntime =
    watchedMovies.reduce((accu, movie) => accu + movie.runtime, 0) /
    watchedMovies.length;
  return (
    <div>
      <h2>Movies you watched</h2>
      <p>
        <span>#️⃣</span>
        <span>{watchedMovies.length} movies</span>
      </p>
      <p>
        <span>⭐</span>
        <span>{avgIMDBRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⌛</span>
        <span>{avgRuntime}</span>
      </p>
    </div>
  );
}

function WatchedMovieList({ watchedMovies }) {
  return (
    <ul>
      {watchedMovies.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <p>
        <span>⭐</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⌛</span>
        <span>{movie.runtime}</span>
      </p>
    </li>
  );
}

export default App;
