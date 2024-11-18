import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // Importing Router and Route
import Navbar from './components/Navbar';  // Import Navbar
import Footer from './components/Footer';  // Import Footer
import Home from './pages/Home';  // Import Home
import MoreReviews from './pages/MoreReviews';  // Import MoreReviews
import Select from './pages/Select';  // Import Select
import MovieDetail from './pages/MovieDetail';  // Import MovieDetail
import ShowTime from './pages/ShowTime';  // Import ShowTime
import Favorites from './pages/Favorites';  // Import Favorites


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
          <Route path="/select-movies" element={<Select />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>

       <Footer />  {/* Add Footer to the bottom of the page */}
      </div>
    </BrowserRouter>
  );
}

export default App;
