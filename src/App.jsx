/*
## feat: Count rating decisions before adding to watched list

**User story:**
As a product owner, I want to track how many times a user
changed their rating before committing, so I can analyse
decision confidence — without showing this counter in the UI.

**Acceptance criteria:**
- [ ] Each time the user selects a different star rating, the count increments
- [ ] Count is NOT displayed anywhere in the UI
- [ ] Count does NOT cause a re-render when updated
- [ ] Count resets when a new movie is opened (component remounts)
- [ ] Count is saved onto the watched movie object when added to list
- [ ] Count is 0 if the user rated only once (no changes)

**Flowchart:**
```
MovieDetails mounts
    │
    ▼
countRef = { current: 0 }   ← useRef(0), persists across renders

User clicks a star rating
    │
    ▼
userRating state updates → component re-renders
    │
    ▼
useEffect([userRating]) runs
    │
    ▼
Is userRating truthy? (not empty string)
    ├── No  → skip (effect ran on mount, rating not set yet)
    └── Yes → countRef.current++   ← mutate directly, no re-render
                   │
                   ▼
               UI does NOT re-render ✅ (ref update is silent)

User clicks "Add to list"
    │
    ▼
handleAdd() runs
    │
    ▼
newWatchedMovie = {
  ...movieData,
  countRatingDecisions: countRef.current  ← read final count
}
    │
    ▼
onAddWatched(newWatchedMovie) → saved to watched state ✅


Why NOT a regular variable?
    │
    ▼
let count = 0  ← resets to 0 on every re-render
    │
    ▼
Each click: count goes 0→1, then resets→0→1 again
Final value is always 1 ❌ (only remembers the last click)
```

**Why a ref and not state?**
- We don't want to show this in the UI → state would cause unnecessary re-renders
- We need it to survive re-renders → regular variable resets every render
- Ref = persistent + silent = perfect fit

**Why update the ref in useEffect and not directly?**
- Mutating ref.current in render logic is a side effect
- useEffect runs after render — safe place to do imperative updates
- Dep array [userRating] means it runs exactly when the rating changes

**Why the `if (userRating)` guard?**
- useEffect also runs on mount (initial render)
- On mount, userRating is "" (empty string) — falsy
- Without the guard, count starts at 1 before the user has done anything

**Implementation:**
- create ref starts at 0, persists across renders
- increment whenever userRating changes (but not on mount)
- read final count when adding to watched list


TODO: Project is getting bigger , split into files => one component per file

*/

import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";

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
  const [movies, setMovies] = useState([]);
  const [watchedMovies, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return storedValue ? JSON.parse(storedValue) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem("watched", JSON.stringify([...watchedMovies, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    // localStorage.setItem("watched", JSON.stringify(watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal },
          );
          if (!res.ok) throw new Error("Something went wrong");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setError("");
        } catch (e) {
          if (e.name !== "AbortError") setError(e.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }
      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query],
  );

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watchedMovies));
    },
    [watchedMovies],
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <FetchError message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watchedMovies={watchedMovies}
            />
          ) : (
            <>
              <WatchedSummary watchedMovies={watchedMovies} />
              <WatchedMovieList
                watchedMovies={watchedMovies}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function FetchError({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
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

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [setQuery],
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return <p>Found {movies.length} results</p>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <button onClick={() => setIsOpen((p) => !p)}>{isOpen ? "-" : "+"}</button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul>
      {movies.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li
      onClick={() => {
        onSelectMovie(movie.imdbID);
      }}
    >
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

function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watchedMovies,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  const isWatched = watchedMovies
    .map((movie) => movie.imdbID)
    .includes(selectedId);
  const watchedUserRating = watchedMovies.find(
    (movie) => movie.imdbID === selectedId,
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating: imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      if (userRating) {
        countRef.current = countRef.current + 1;
      }
    },
    [userRating],
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
          );
          if (!res.ok) throw new Error("Something went wrong!");
          const data = await res.json();
          setMovie(data);
        } catch (e) {
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId],
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title],
  );

  useEffect(
    function () {
      function closeMovieDetails(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", closeMovieDetails);

      return function () {
        document.removeEventListener("keydown", closeMovieDetails);
      };
    },
    [onCloseMovie],
  );

  return (
    <div className="details">
      {isLoading && <Loader />}
      {!error && !isLoading && (
        <>
          <div>
            <button onClick={onCloseMovie}>&larr;</button>
            <img src={poster} alt={`Poster of ${title}`} />
            <h2>{title}</h2>
            <p>
              {released} &bull; {runtime}
            </p>
            <p>{genre}</p>
            <p>
              <span>⭐</span>
              {imdbRating} IMDB rating
            </p>
          </div>
          <div>
            {isWatched ? (
              <p>
                You rated movie with {watchedUserRating} <span>⭐</span>
              </p>
            ) : (
              <>
                <StarRating
                  maxRating={10}
                  size={24}
                  onSetMovieRating={setUserRating}
                />
                {userRating > 0 && (
                  <button onClick={handleAdd}>+ Add to list</button>
                )}
              </>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </div>
        </>
      )}
      {error && <FetchError message={error} />}
    </div>
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
        <span>#️⃣ </span>
        <span>{watchedMovies.length} movies</span>
      </p>
      <p>
        <span>⭐</span>
        <span>
          {Number.isNaN(avgIMDBRating) ? " 0" : avgIMDBRating.toFixed(2)}
        </span>
      </p>
      <p>
        <span>🌟</span>
        <span>
          {Number.isNaN(avgUserRating) ? " 0" : avgUserRating.toFixed(2)}
        </span>
      </p>
      <p>
        <span>⌛</span>
        <span>{Number.isNaN(avgRuntime) ? " 0" : avgRuntime}</span>
      </p>
    </div>
  );
}

function WatchedMovieList({ watchedMovies, onDeleteWatched }) {
  return (
    <ul>
      {watchedMovies.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
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
        <span>{movie.runtime} min</span>
      </p>
      <button onClick={() => onDeleteWatched(movie.imdbID)}>x</button>
    </li>
  );
}

export default App;
