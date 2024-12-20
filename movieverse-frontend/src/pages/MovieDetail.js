import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import styles from "../styles/MovieDetail.module.css";

const url = `${process.env.REACT_APP_BACKEND_API}api`;

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [cast, setCast] = useState([]); // Added state for cast
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({
    title: "",
    rating: "",
    text: "",
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [trailer, setTrailer] = useState(null);

  const getAccountId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.id;
    }
    return null;
  };

  const accountId = getAccountId();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch movie details
        const movieResponse = await fetch(`${url}/movies-moviedetail/${id}`);
        if (!movieResponse.ok) throw new Error("Failed to fetch movie details");
        const movieData = await movieResponse.json();
        setMovie(movieData);

        // Fetch cast details
        const castResponse = await fetch(
          `${url}/movies/${id}/cast` // Ensure this endpoint returns cast data
        );
        if (castResponse.ok) {
          const castData = await castResponse.json();
          setCast(castData || []);
        }

        // Fetch trailer details
        const trailerResponse = await fetch(`${url}/movies/${id}/trailer`);
        if (trailerResponse.ok) {
          const trailerData = await trailerResponse.json();
          const youtubeTrailer = trailerData.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          if (youtubeTrailer) {
            setTrailer(`https://www.youtube.com/embed/${youtubeTrailer.key}`);
          }
        }

        // Fetch reviews
        const reviewsResponse = await fetch(`${url}/movies/${id}/reviews`);
        if (!reviewsResponse.ok) throw new Error("Failed to fetch reviews");
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData || []);

        // Check favorite status
        if (accountId) {
          const favoritesResponse = await fetch(
            `${url}/favorites/${accountId}`
          );
          const favoritesData = await favoritesResponse.json();
          const isFav = favoritesData.some(
            (fav) => fav.movie_id === parseInt(id)
          );
          setIsFavorite(isFav);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, accountId]);

  const toggleFavorite = async () => {
    if (!accountId) {
      alert("You must be logged in to add or remove favorites.");
      return;
    }

    try {
      const method = isFavorite ? "DELETE" : "POST";
      await fetch(`${url}/favorites`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: accountId,
          movie_id: id,
        }),
      });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!accountId) {
      alert("You must be logged in to submit a review.");
      return;
    }

    if (!newReview.title || !newReview.rating || !newReview.text) {
      alert("Please provide a title, rating, and review text.");
      return;
    }

    try {
      const response = await fetch(`${url}/movies/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: accountId,
          movie_id: id,
          movie_poster_path: movie.poster_path,
          title: newReview.title,
          rating: Number(newReview.rating),
          description: newReview.text,
        }),
      });

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
            <p className={styles["rating-number"]}>
              {movie.vote_average.toFixed(1)}/10
            </p>

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

      {trailer && (
        <div className={styles["trailer-section"]}>
          <h2 style={{ color: "black" }}>Official Trailer</h2>
          <iframe
            width="100%"
            height="500px"
            src={trailer}
            frameBorder="0"
            allowFullScreen
            title="Official Trailer"
          ></iframe>
        </div>
      )}

      <div className={styles["cast-section"]}>
        <h2 style={{ color: "black" }}>Featured Cast</h2>
        <div
          className={`${styles["cast-grid"]} ${
            isExpanded ? styles["expanded"] : ""
          }`}
        >
          {cast.slice(0, isExpanded ? cast.length : 6).map((member) => (
            <div key={member.id} className={styles["cast-card"]}>
              <img
                src={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                alt={member.name}
                className={styles["cast-image"]}
              />
              <div className={styles["cast-name"]}>{member.name}</div>
              <div className={styles["cast-character"]}>
                as {member.character}
              </div>
            </div>
          ))}
        </div>
        {cast.length > 5 && (
          <button
            className={styles["show-more-button"]}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less ▲" : "Show More ▼"}
          </button>
        )}
      </div>

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

      <h2>User Reviews</h2>
      <div className={styles["movie-reviews"]}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className={styles["review"]}>
              <p>
                {review.author || "Anonymous"}{" "}
                {new Date(review.review_date).toLocaleDateString()}
              </p>
              <div className={styles["star-display"]}>
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={
                      index < review.rating
                        ? styles["star-filled"]
                        : styles["star-empty"]
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <p>
                <strong>{review.title}</strong>
              </p>
              <p>{review.description}</p>
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
