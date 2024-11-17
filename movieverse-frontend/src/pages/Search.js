import React, { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import MovieList from "../components/MovieList";
import '../styles/Search.css'

export default function Search() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [query, setQuery] = useState("");

  const search = () => {
    fetch(
      'https://api.themoviedb.org/3/search/movie?query='+query+'&include_adult=false&language=en-US&page='+page,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NWRkMWQwZmRkZjA5NTg4NTM0N2Y4MjBjMTQxY2JjYyIsIm5iZiI6MTczMTY4MjgzMS40OTg5MTksInN1YiI6IjY3Mzc1ZjJiZmZlMzg3OGU5ZTlmYzJlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._5pzbMCzy-1Fsl462b_pIMtvVHkCA14KYWMzIGDjH9g",
          "Content-Type": "application/json",
        },
      }
    )
      .then(response => response.json())
      .then(data => {
        setMovies(data.results);
        setPageCount(data.total_pages);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }

  useEffect(() => {
    search()
  }, [page]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          id="movie_name"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={search}>Submit</button>
      </div>
      <h2>Search results</h2>
      <hr />
      <MovieList movies={movies} />
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={(e) => setPage(e.selected + 1)}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        /> 
    </div>
  );
}
