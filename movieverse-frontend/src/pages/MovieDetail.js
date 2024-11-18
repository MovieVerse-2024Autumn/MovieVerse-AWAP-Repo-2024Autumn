import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/MovieDetail.module.css";

const MovieDetail = () => {
  const { id } = useParams(); // Get movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    title: "",
    rating: "",
    text: "",
  }); // State to hold the new review data

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

    fetchMovieDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

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
            account_id: 1, // Use dynamic user_id from login in real implementation
            movie_id: id,
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
            <p className={styles["movie-rating"]}>
              {movie.vote_average.toFixed(1)}/10
            </p>
            <button className={styles["favorite-button"]}>
              <span role="img" aria-label="heart">
                ❤️
              </span>{" "}
              Add to Favourite
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
                  <label htmlFor={`star${star}`}>&#9733;</label>{" "}
                  {/* Unicode star character */}
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
  );
};

export default MovieDetail;
