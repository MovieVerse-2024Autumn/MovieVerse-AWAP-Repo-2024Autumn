import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";

import Home from "./pages/Home";
import MoreReviews from "./pages/MoreReviews";
import Select from "./pages/Select";
import MovieDetail from "./pages/MovieDetail"; // Import the MovieDetail component
import ReviewDetail from "./pages/ReviewDetail";
import ShowTime from "./pages/ShowTime";
import SearchResults from "./pages/SearchResults";
import Favorites from "./pages/Favorites";
import Groups from "./pages/Groups";
import SharedFavorites from "./components/SharedFavorites";
import Authentication from "./pages/Authentication";
import GroupDetails from "./pages/GroupDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import DeleteAccountFlow from "./pages/delete-account";
function App() {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/show-time" element={<ShowTime />} />
          <Route path="/more-reviews" element={<MoreReviews />} />
          <Route path="/select-movies" element={<Select />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/reviews/:reviewId" element={<ReviewDetail />} />
          <Route
            path="/favorites/shared/:account_id"
            element={<SharedFavorites />}
          />
          <Route path="/groups" element={<Groups />} />
          <Route path="/group/:id" element={<GroupDetails />} />

          <Route path="/delete-account" element={<DeleteAccountFlow />} />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />

          {/* Dynamic url */}
          <Route path="/:profileUrl" element={<Home />} />

          {/* Protected Routes */}
          <Route
            path="/:profileUrl/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:profileUrl/groups"
            element={
              <ProtectedRoute>
                <Groups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:profileUrl/delete-account"
            element={
              <ProtectedRoute>
                <DeleteAccountFlow />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
