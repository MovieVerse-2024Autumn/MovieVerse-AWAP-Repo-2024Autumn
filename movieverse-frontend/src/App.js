import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MoreReviews from "./pages/MoreReviews";
import Select from "./pages/Select";
import MovieDetail from "./pages/MovieDetail"; // Import the MovieDetail component
import ReviewDetail from "./pages/ReviewDetail";
import ShowTime from "./pages/ShowTime";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show-time" element={<ShowTime />} />
          <Route path="/more-reviews" element={<MoreReviews />} />
          <Route path="/search" element={<Search />} />
          <Route path="/select-movies" element={<Select />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/reviews/:reviewId" element={<ReviewDetail />} />
          <Route path="/favorites" element={<Favorites accountId={1} />} />
          <Route path="/search-results" element={<Search />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
