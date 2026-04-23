import { useState } from "react";

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

const tempWatchedData = [
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

function App() {
  const [movies, setMovies] = useState(tempMovieData);
  return (
    <>
      <NavBar movies={movies} />
      <Main movies={movies} />
    </>
  );
}

function NavBar({ movies }) {
  return (
    <nav>
      <Logo />
      <Search />
      <Numresults movies={movies} />
    </nav>
  );
}

function Logo() {
  return (
    <div>
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <input
      placeholder="Search movie..."
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}

function Numresults({ movies }) {
  return (
    <p>
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ movies }) {
  return (
    <main>
      <ListBox movies={movies} />
      <WatchedBox />
    </main>
  );
}

function ListBox({ movies }) {
  const [isOpenMovies, setIsOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setIsOpen((isOpenMovies) => !isOpenMovies)}>
        {isOpenMovies ? "-" : "+"}
      </button>
      {isOpenMovies && <MovieList movies={movies} />}
    </div>
  );
}

function MovieList({ movies }) {
  return (
    <ul>
      {movies.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt="movie.Title" />
      <h3>{movie.Title}</h3>
      <p>
        <span>🗓️</span>
        <span>{movie.Year}</span>
      </p>
    </li>
  );
}

function WatchedBox() {
  const [isOpenWatched, setIsOpenWatched] = useState(true);
  const [watchedMovies, setWatchedMovies] = useState(tempWatchedData);
  return (
    <div>
      <button
        onClick={() => setIsOpenWatched((isOpenWatched) => !isOpenWatched)}
      >
        {isOpenWatched ? "-" : "+"}
      </button>
      {isOpenWatched && (
        <div>
          <WatchedSummary watchedMovies={watchedMovies} />
          <WatchedMovieList watchedMovies={watchedMovies} />
        </div>
      )}
    </div>
  );
}

function WatchedSummary({ watchedMovies }) {
  const averageUserRating =
    watchedMovies.reduce((accu, movie) => accu + movie.userRating, 0) /
    watchedMovies.length;

  const averageIMDBRating =
    watchedMovies.reduce((accu, movie) => accu + movie.imdbRating, 0) /
    watchedMovies.length;

  const averageRuntime =
    watchedMovies.reduce((accu, movie) => accu + movie.runtime, 0) /
    watchedMovies.length;

  return (
    <div>
      <h2>Movies you watched</h2>
      <p>
        <span>#️⃣</span>
        <span>2 movies</span>
      </p>
      <p>
        <span>⭐</span>
        <span>{averageIMDBRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{averageUserRating}</span>
      </p>
      <p>
        <span>⌛</span>
        <span>{averageRuntime} min</span>
      </p>
    </div>
  );
}

function WatchedMovieList({ watchedMovies }) {
  return (
    <ul>
      {watchedMovies.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt="" />
      <p>{movie.Title}</p>
      <p>
        <span>⭐</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>⌛</span>
        <span>{movie.runtime}</span>
      </p>
    </li>
  );
}
export default App;
