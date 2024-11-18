import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import MoreReviews from "./pages/MoreReviews";
import Select from "./pages/Select";
import MovieDetail from "./pages/MovieDetail"; // Import the MovieDetail component
import ShowTime from "./pages/ShowTime";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show-time" element={<ShowTime />} />
          <Route path="/more-reviews" element={<MoreReviews />} />
          <Route path="/search" element={<Search />} />
          <Route path="/select-movies" element={<Select />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          {/* New MovieDetail route */}
          <Route path="/search-results" element={<Search />} />
        </Routes>
        <Footer /> {/* Add Footer to the bottom of the page */}
      </div>
    </BrowserRouter>
  );
}

export default App;
