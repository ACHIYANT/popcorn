import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const KEY = "d48e4f4f";
export default function App() {
  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  // const [watchedMovies, setWatchedMovies] = useState([]);


  

  function handleSelectMovie(id) {
    if (selectedId === id) {
      setSelectedId(null);
    } else setSelectedId(id);
  }
  function handleCloseMovieDetails() {
    console.log('invoked close movie');
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatchedMovies((watchedMovies) => [...watchedMovies, movie]);

    // localStorage.setItem('watched',JSON.stringify([...watchedMovies,movie]));
  }
  function handleDeletedWatched(id) {
    setWatchedMovies((watchedMovies) =>
      watchedMovies.filter((movie) => movie.imdbId !== id)
    );
  }
  // const [query, setQuery] = useState("");
  // function handleQuery(e) {
  //   console.log(e)
  //   setQuery(e.target.value);
  // }

  //Custom hook is used to fetch movies.
  const [movies, isLoading, error] = useMovies(query, handleCloseMovieDetails);

  const [watchedMovies,setWatchedMovies] = useLocalStorageState([],"watched");

  // const [watchedMovies, setWatchedMovies] = useState(function () {
  //   const stored = localStorage.getItem("watched");
  //   if (!stored) return [];
  //   return JSON.parse(stored);
  // });

  // ?  The below is creating side effect as it is doing communication with the outside world in render logic. In cause of the side effect if we setState in the renderLogic then it create the problem of the infinite loop as it call the re-render again and again .
  // fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
  //   .then((res) => res.json())
  //   .then((data) => console.log(data));
  // .then((data) => setMovies(data.Search));
  // setMovies([]);

  // then in useEffect

  // useEffect(() => {
  //   fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=Interstellar`)
  //     .then((res) => res.json())
  //     //   .then((data) => console.log(data));
  //     .then((data) => setMovies(data.Search));
  // }, []);

  // async await in useEffect

  // useEffect(
  //   function () {
  //     const controller = new AbortController();
  //     async function fetchMovies() {
  //       try {
  //         setIsLoading(true);
  //         setError("");
  //         const res = await fetch(
  //           `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
  //           { signal: controller.signal }
  //         );
  //         if (!res.ok) {
  //           throw new Error("Something went wrong ! ");
  //         }
  //         const data = await res.json();
  //         if (data.Response === "False") {
  //           throw new Error("Movie not found");
  //         }
  //         setMovies(data.Search);
  //         setError("");
  //       } catch (err) {
  //         if (err.name !== "AbortError") setError(err.message);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //     if (query.length < 2) {
  //       setMovies([]);
  //       setError("");
  //       return;
  //     }
  //     handleCloseMovieDetails();
  //     fetchMovies();
  //     return function () {
  //       controller.abort();
  //     };
  //   },
  //   [query]
  // );
  // ? Custom hook used for local storage;
  
  // useLocalStorageState(watchedMovies);

  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify(watchedMovies));
  //   },
  //   [watchedMovies]
  // );

  /*  
  useEffect(function (){
    console.log('After initial render');
},[]);
  useEffect(function (){
    console.log('After every render')
},[]);
  useEffect(function (){
    console.log('After query change');
},[query]);
  console.log('During render');
*/
  // console.log(selectedId);
  return (
    <>
      {/* // ! using component composition to get rid of "Prop drilling" */}
      {/* <NavBar movies={movies} /> */}

      {/* Below line will work if use controlled element of search bar in the App compnonet only. */}
      {/* <NavBar onEnter={handleQuery}> */}

      <NavBar>
        {/* <NumResult movies={movies ? movies : []} /> */}
        {/* {console.log(movies)} */}
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      {/* <Main movies={movies} /> */}
      <Main>
        {/* <ListBox>
          <MovieList movies={movies} />
        </ListBox> */}

        {/* // ! In below component data is passed via children prop but we can also send it using the normal props*/}
        <Box>
          {/* <MovieList movies={movies} /> */}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>
        {/* <Box element={<MovieList movies={movies} />} /> */}

        {/* This below box is for the right side box and lifted up from Main to App because we need to display the details of selected movies in right side box so it will be easy to use here. */}
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovieDetails}
              onAddWatched={handleAddWatched}
              watchedMovies={watchedMovies}
            />
          ) : (
            <>
              <WatchedSummary watchedMovies={watchedMovies} />
              <WatchedList
                watchedMovies={watchedMovies}
                onDeleteWatched={handleDeletedWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}


function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watchedMovies,
}) {
  const [movie, setMovie] = useState({});
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // const [avgRating, setAvgRating] = useState(0);

  const isWatched = watchedMovies
    ?.map((movie) => movie.imdbId)
    .includes(selectedId);
  const watchedUserRating = watchedMovies?.find(
    (movie) => movie.imdbId === selectedId
  )?.userRating;

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      userRating: userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);

    // ? Code example to see that state update is asynchronous.

    // setAvgRating(Number(imdbRating));
    // alert(avgRating);

    // setAvgRating((avgRating)=>(avgRating+userRating)/2);

    //? Code example ends here.

    onCloseMovie();
  }
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // ? Below code is to test/check the first rule of hook i.e.. Define hooks always at global level not inside the conditionals.

  /* eslint-disable */
  // if(imdbRating > 8 )
  // {
  //   const [a,setA] = useState(0);
  // }

  // if(imdbRating>8) return <p>Hello How are you</p>;

  // ? Test/ Check code for hook rule no. 1 is ended.

  // const [isTop,setIsTop] = useState(imdbRating>8);
  // console.log(isTop);
  // useEffect(function(){
  //   setIsTop(imdbRating>8);
  // },[imdbRating])

  // const isTop = imdbRating>8;
  // console.log(isTop);

  useEffect(
    function () {
      async function fetchMovieById() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}&plot=full`
          );
          if (!res.ok) {
            throw new Error("Something went wrong");
          }
          const data = await res.json();
          if (data.Response === "False") {
            throw new Error(data.Error);
          }
          // console.log(data);
          setMovie(data);
        } catch (e) {
          console.log(e);
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovieById();
    },
    [selectedId]
  );

  //effect for changing the tab data or document title.
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "Popcorn";
      };
    },
    [title]
  );

  // ? creating custom hook for key press.

  useKey("Escape",onCloseMovie);

  //effect used to remove movie details when escape key is clicked.
  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (e.code === "Escape") {
  //         // handleCloseMovieDetails();
  //         onCloseMovie();
  //         // console.log("CLOSING");
  //       }
  //     }
  //     document.addEventListener("keydown", callback);
  //     return function () {
  //       // console.log('removed')
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [onCloseMovie]
  // );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          {/* <p>{avgRating}</p> */}
          <section>
            <div className="rating">
              {isWatched ? (
                <p>
                  {" "}
                  You rated this movie with {watchedUserRating} <span>⭐️</span>
                </p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}


function Loader() {
  return <p className="loader">Loading...</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span>
      {message}
    </p>
  );
}
// ! NavBar and Main are structural component.
// ! using component composition to get rid of "Prop drilling"
// function NavBar({ movies }) {
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      {/* // ! using component composition to get rid of "Prop drilling" */}
      {/* <Logo />
        <Search />
        <NumResult movies={movies} /> */}
      <Logo />
      {/* <Search /> */}
      {children}
    </nav>
  );
}

// ! Logo is stateless / presentational components.
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Popcorn</h1>
    </div>
  );
}

// ! Search is a statefull component.
function Search({ query, setQuery }) {
  // ! Controlled element

  // useEffect(function(){
  //   const el = document.querySelector('.search');
  //   console.log(el);
  //   el.focus();
  // },[]);

  // ? Below code is use to select the DOM element using the  useRef.
  const inputEl = useRef(null);

  // ? using useEffect for the ref because useRef select the DOM elemtent and it has been done after the DOM load. So, useEffect also work after the DOM loaded so this useEffect is perfect for this cause.


  // ? Custom hook useKey is used to implement the functionality of clicking enter key and it will make focus on search bar by clearing the already present text.
  useKey('Enter',function(){
    if (document.activeElement === inputEl.current) return;
          inputEl.current.focus();
          setQuery("");
  })

  // useEffect(
  //   function () {
  //     // inputEl.current.focus();
  //     function callback(e) {
        
  //       if (e.code === "Enter") {
  //         if (document.activeElement === inputEl.current) return;
  //         inputEl.current.focus();
  //         setQuery("");
  //       }
  //     }
  //     document.addEventListener("keydown", callback);
  //     return function () {
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [setQuery]
  // );

  // useEffect(
  //   function () {
  //     console.log("inpt");
  //     // console.log(inputEl.current);
  //     inputEl.current.focus();
  //     function callback(e) {
  //       if (document.activeElement === inputEl.current) return;
  //       console.log("added");
  //       if (e.code === "Enter") {
  //         inputEl.current.focus();
  //         setQuery("");
  //       }
  //     }
  //     console.log("before add event")
  //     document.addEventListener("keydown", callback);
  //     console.log("after");
  //     return function () {
  //       console.log("removed");
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [setQuery]
  // );

  function handleQuery(e) {
    setQuery(e.target.value);
  }
  return (
    <input
      type="text"
      className="search"
      value={query}
      onChange={(e) => handleQuery(e)}
      // onChange={(e) => onEnter(e)}
      placeholder="Search movies..."
      ref={inputEl}
    />
  );
}

// ! NumResult is stateless / presentational components.
function NumResult({ movies }) {
  return <p className="num-results">Found {movies.length} results</p>;
}

// ! Main is structural component.
// function Main({movies}){
function Main({ children }) {
  // const [watchedMovies, setWatchedMovies] = useState(tempWatchedData);
  return (
    <main className="main">
      {/* Box 1 */}
      {/* <ListBox movies={movies} /> */}
      {children}
      {/* Box 2 */}
      {/* <WatchedBox /> */}

      {/* The below is shifting to the app component ans will be used as a children in Main component because this right side box also be used to display the details for the selected movies and then it will be easy to use there. */}
      {/* <Box>
        <WatchedSummary watchedMovies={watchedMovies} />
        <WatchedList watchedMovies={watchedMovies} />
      </Box> */}

      {/* // ! Below approach is to pass data using normal props without children prop in composition component */}
      {/* <Box
        element={
          <>
            <WatchedSummary watchedMovies={watchedMovies} />
            <WatchedList watchedMovies={watchedMovies} />
          </>
        }
      /> */}
    </main>
  );
}

// ? instead of ListBox and WatchedBox we just create one component Box which is component composition .

// ! we can also send data in normal props and children props form both are demonstated below.
function Box({ children }) {
  // function Box({ element }) {
  const [isOpen, setIsOpen1] = useState(true);
  function handleToggleButton() {
    setIsOpen1(!isOpen);
  }
  return (
    <div className="box">
      <button onClick={handleToggleButton} className="btn-toggle">
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
      {/* {isOpen && element} */}
    </div>
  );
}

// ! ListBox, MovieList and WatchedBox are statefull components.

// function ListBox({ children }) {
//   const [isOpen1, setIsOpen1] = useState(true);
//   function handleToggleButton1() {
//     setIsOpen1(!isOpen1);
//   }
//   return (
//     <div className="box">
//       <button onClick={handleToggleButton1} className="btn-toggle">
//         {isOpen1 ? "-" : "+"}
//       </button>
//       {isOpen1 && children}
//     </div>
//   );
// }

// function WatchedBox() {
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watchedMovies, setWatchedMovies] = useState(tempWatchedData);

//   function handleToggleButton2() {
//     setIsOpen2(!isOpen2);
//   }
//   return (
//     <div className="box">
//       <button onClick={handleToggleButton2} className="btn-toggle">
//         {isOpen2 ? "-" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watchedMovies={watchedMovies} />
//           <WatchedList watchedMovies={watchedMovies} />
//         </>
//       )}
//     </div>
//   );
// }

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

// ! Movie is stateless / presentational components.
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// ! WatchedSummary, WatchedList and WatchedMovie are stateless / presentational components.
function WatchedSummary({ watchedMovies }) {
  //   ? Function for calculating average
  // const average = (arr) => arr.reduce((acc, curr) => acc + curr) / arr.length;
  const average = (arr) =>
    arr.reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

  //   ? Derived states
  const avgImdbRating = average(
    watchedMovies?.map((movie) => movie.imdbRating)
  );
  const avgUserRating = average(
    watchedMovies?.map((movie) => movie.userRating)
  );
  const avgTotalRuntime = average(watchedMovies?.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watchedMovies.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{Math.round(avgUserRating * 100) / 100}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.round(avgTotalRuntime * 100) / 100}</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watchedMovies, onDeleteWatched }) {
  // console.log("watched movies", watchedMovies);
  return (
    <ul className="list list-movies">
      {watchedMovies?.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbId}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({movie, onDeleteWatched }) {
  function handleDeleteWatched() {
    onDeleteWatched(movie.imdbId);
  }
  return (
    <li>
      <img src={movie.poster} alt={movie.title} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime}</span>
        </p>
      </div>
      <button className="btn-delete" onClick={handleDeleteWatched}>
        X
      </button>
    </li>
  );
}
