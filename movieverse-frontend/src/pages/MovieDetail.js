import Navbar from '../components/Navbar';
import Footer from "../components/Footer";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/MovieDetail.module.css";


const MovieDetail = () => {
  const { id } = useParams(); // Get movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false); // Favorite status
  const [newReview, setNewReview] = useState({
    title: "",
    rating: "",
    text: "",
  });

  // Fetch movie details and favorite status
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/movies-moviedetail/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setMovie(data);
        setReviews(data.reviews || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/favorites/1`); // Replace `1` with dynamic account_id
        const data = await response.json();
        const isFav = data.some((fav) => fav.movie_id === parseInt(id));
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    fetchMovieDetails();
    checkFavoriteStatus();
  }, [id]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        // Remove from favorites
        await fetch(`http://localhost:3001/api/favorites`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account_id: 1, // Replace with dynamic account_id
            movie_id: id,
          }),
        });
        setIsFavorite(false); // Update the button state
      } else {
        // Add to favorites
        await fetch(`http://localhost:3001/api/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account_id: 1, // Replace with dynamic account_id
            movie_id: id,
          }),
        });
        setIsFavorite(true); // Update the button state
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Handle new review input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  // Submit a new review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.title || !newReview.rating || !newReview.text) {
      alert("Please provide a title, rating, and review text.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/movies/${id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account_id: 1, // Replace with dynamic account_id
            movie_id: id,
            movie_poster_path: movie.poster_path,
            title: newReview.title,
            rating: Number(newReview.rating),
            description: newReview.text,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit review");

      const savedReview = await response.json();
      setReviews((prevReviews) => [savedReview, ...prevReviews]);
      setNewReview({ title: "", rating: "", text: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Error loading movie details</p>;

  return (
    <>
    <Navbar/>
      
    <div className={styles["movie-detail"]}>
      <div className={styles["movie-header"]}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className={styles["movie-poster"]}
        />
        <div className={styles["movie-info"]}>
          <h1>
            {movie.title}{" "}
            <span>({new Date(movie.release_date).getFullYear()})</span>
          </h1>
          <p className={styles["movie-genres"]}>
            {movie.genres.map((genre) => genre.name).join(", ")}
          </p>
          <div className={styles["movie-actions"]}>
            <button
              className={`${styles["favorite-button"]} ${
                isFavorite ? styles["favorite-active"] : ""
              }`}
              onClick={toggleFavorite}
            >
              <span role="img" aria-label="heart">
                ❤️
              </span>{" "}
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>
          <p className={styles["movie-overview"]}>{movie.overview}</p>
        </div>
      </div>
      

      {/* Add Review Section */}
      <div className={styles["add-review"]}>
        <h2>Add Your Review</h2>
        <form onSubmit={handleSubmitReview}>
          <label>
            Rating:
            <div className={styles["star-rating"]}>
              {[5, 4, 3, 2, 1].map((star) => (
                <React.Fragment key={star}>
                  <input
                    type="radio"
                    id={`star${star}`}
                    name="rating"
                    value={star}
                    checked={Number(newReview.rating) === star}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor={`star${star}`}>&#9733;</label>
                </React.Fragment>
              ))}
            </div>
          </label>

          <label>
            Title:
            <input
              type="text"
              name="title"
              value={newReview.title}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Review:
            <textarea
              name="text"
              value={newReview.text}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit" className={styles["submit-button"]}>
            Submit Review
          </button>
        </form>
      </div>

      {/* User Reviews Section */}
      <h2>User Reviews</h2>
      <div className={styles["movie-reviews"]}>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className={styles["review"]}>
              <p>
                <strong>Title:</strong> {review.title}
              </p>
              <p>
                <strong>Rating:</strong> {review.rating}/10
              </p>
              <p>{review.text}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default MovieDetail;
