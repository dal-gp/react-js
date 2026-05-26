/*
 Task: add watched movie to the list

 create watchedMovies state in App if not already
 ??? we'll create brand new object for each of these movies and pass each of these objs into watchedMovies array.

 In App, create a function handleAddWatch that takes movie object ,which adds movie to the watchedList array

 Pass it down as onAddWatched prop into MovieDetails coz there we'll have a button to add it to the watched list array.
 create a button
 Attach an event handler onClick and assign a handler function 'handleAdd' which will call the one we passed into the component as a prop. 
 coz need to do lotsa stuff inside this handlerAdd function. 
 This function we passed needs a new watched movie object so create a newWatchedMovie object - imdbID, title, year, poster, imdbRating, runtime
 then call the function passin in the new watched movie object

 close movie after adding it to the list
 - we already have  handleCloseMovie function , also it is used in MovieDetails to go back
 - call onCloseMovie as soon as the movie is added to the list

 We are missing user ratings:
 - we want to be able to get rating from the user and that should be added to 
      newWatchedMovie object. in other words, we need the state that we have in 
      StarRating outside the of the StarRating component and inside our 
      MovieDetails component.
- StarRating accepts function as a prop. So define a prop onSetMovieRating and in there
      pass in a state setter function.
- create a piece of state 'userRating' and pass in the setter fn to StarRating
- now add the state userRating to the newWatchedMovie object when adding movie

Now that we have userRating, Only allow user to add it to the list if user gave it a rating
- basically display a button if userRating is > than 0 

Prevent user from adding same movie multiple times
- check if movie is already in the list if it is then user shouldnot be allowed
    to rate. So simply display user's rating that user has already given
- Pass watched movies array into the MovieDetails so that we can check if 
    the move is part of the watched list
- calculate new piece of derived state 'isWatched'
- check if watched movies array includes currently selected movie by first 
    transforming into array of IDs (aka grabbing all movies and take out imdbID)
    and then chain includes passing in the selectedId
- now based on that display <StarRating />, button else display paragraph with
    text 'You rated movie with'

Place the current rating so that the text reads like 'You rated movie with 5 ⭐'
- we need to drive a new state from from the watched movies array
- name is watchedUserRating
- find the movie where imdbID equals selectedID
- if exists take out userRating rom that object and assign it to watchedUserRating
- use it in JSX

give user ability to remove movie from the watched list
- go to component where state lives - App
- add function handleDeleteWatched which accepts id
- filter out the one we no longer want by chceking if imdbID is different from
    the passed in id so then that movie will stay in the array and movie be gets
    filtered out if the id is the same
- pass it down to WatchedMovie
- create a button 
- use the function on click passin the imdbID

fix number displaying many digits for avgImdbRating, avgUserRating
- .toFixed(2)


 





 Project is getting bigger , split into files => one componnent per file

*/

import { useState, useEffect } from "react";
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
  const [movies, setMovies] = useState(tempMovieData);
  const [watchedMovies, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("interstellar");
  const [selectedId, setSelectedId] = useState("tt1375666");

  function handleSelectMovie(id) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          );
          if (!res.ok) throw new Error("Something went wrong");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
        } catch (e) {
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    },
    [query],
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
    };
    console.log(newWatchedMovie);
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

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
        <span>#️⃣</span>
        <span>{watchedMovies.length} movies</span>
      </p>
      <p>
        <span>⭐</span>
        <span>{avgIMDBRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>⌛</span>
        <span>{avgRuntime}</span>
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
