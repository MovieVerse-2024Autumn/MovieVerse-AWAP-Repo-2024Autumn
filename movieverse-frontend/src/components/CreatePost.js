import React, { useState, useEffect } from "react";
import '../styles/GroupDetails.css';


    const PostCreationSection = ({ onAddPost }) => {
  const [postContent, setPostContent] = useState("");
  const [movieSearch, setMovieSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);


  const handlePostChange = (e) => {
    setPostContent(e.target.value);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setMovieSearch(query);

    if (query.length >= 3) {
      setShowDropdown(true);
      fetchMovies(query);
    } else {
      setShowDropdown(false);
    }
  };

  const fetchMovies = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/movies-search?query=${encodeURIComponent(
          query
        )}&page=1`
      );
      const data = await response.json();
      setMovies((data.movies || []).slice(0, 20));
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };


  const handleMovieSelect = (movieId) => {
    setSelectedMovieId(movieId);
    const selectedMovie = movies.find((movie) => movie.id === parseInt(movieId));
    setSelectedMovie(selectedMovie);
    console.log("Selected Movie:", selectedMovie);
    // You can now use `selectedMovie` for your logic
    setMovieSearch("");
    setShowDropdown(false);
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
        content: postContent,
        movie: selectedMovie,
      };
  
      // Call parent callback to add post
      onAddPost(newPost);
  
      // Clear input fields
      setPostContent("");
      setSelectedMovie(null);
      setMovies([]);


    console.log("Post Content:", postContent);
    console.log("Selected Movies:", filteredMovies);
    // Submit postContent and filteredMovies to the backend
  };

  return (
    <div className="post-creation-section">
      <h3>Create a Post</h3>
      <form onSubmit={handleSubmit} className="post-form">
        {/* Post Content Textarea */}
        <textarea
          value={postContent}
          onChange={handlePostChange}
          placeholder="Write a review or anything...."
          className="post-textarea"
          rows="4"
        ></textarea>
  
        {/* Movie Search Input */}
        <input
          type="text"
          value={movieSearch}
          onChange={handleSearchChange}
          placeholder="Search for a movie"
          className="movie-search-input"
        />
  
        {/* Movie Dropdown */}
        {showDropdown && (
          <div className="movie-dropdown-container">
            <select
              value={selectedMovieId}
              onChange={(e) => handleMovieSelect(e.target.value)}
              className="movie-select-dropdown"
            >
              <option value="" disabled>
                Select a movie
              </option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>
        )}
  
        {/* Selected Movie Preview */}
        {selectedMovie && (
          <div className="selected-movie-preview">
            <h4>Selected Movie</h4>
            <div className="movie-preview-card">
              <img
                src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="movie-preview-image"
              />
              <div className="movie-preview-details">
                <h5>{selectedMovie.title}</h5>
                <p>Release Date: {selectedMovie.release_date}</p>
                <p>Rating: {selectedMovie.vote_average} / 10</p>
              </div>
            </div>
          </div>
        )}
  
        {/* Submit Button */}
        <button type="submit" className="post-submit-btn">
          Post
        </button>
      </form>
    </div>
  );
  
};

export default PostCreationSection;
