import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShowTime from "./pages/ShowTime";
import MoreReviews from "./pages/MoreReviews";
import Select from "./pages/Select";


function App() {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show-time" element={<ShowTime />} />
          <Route path="/more-reviews" element={<MoreReviews />} />
          <Route path="/select-movies" element={<Select />}  />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
