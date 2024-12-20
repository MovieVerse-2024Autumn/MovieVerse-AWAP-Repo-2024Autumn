import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import MovieList from "../components/MovieList";
import "../styles/Search.css";

const url = `${process.env.REACT_APP_BACKEND_API}api`;

export default function SearchResults() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    fetch(
      `${url}/movies-search?query=${encodeURIComponent(query)}&page=${page}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setMovies(data.movies);
        setPageCount(data.totalPages);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, [query, page]);

  return (
    <div>
      <div className="search-results-container">
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
          className="pagination"
          activeClassName="active"
        />
      </div>
    </div>
  );
}
