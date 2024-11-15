import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/MovieDetail.module.css'; // Importing CSS Module

const MovieDetail = () => {
    const { id } = useParams(); // Get movie ID from the URL
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]); // State to hold movie reviews
    const [newReview, setNewReview] = useState({
        title: '', // New field for review title
        rating: '',
        text: ''
    }); // State to hold the new review data

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/movies-moviedetail/${id}`);
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
            [name]: value
        }));
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!newReview.title || !newReview.rating || !newReview.text) {
            alert("Please provide a title, rating, and review text.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/movies/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newReview.title,
                    rating: Number(newReview.rating),
                    text: newReview.text
                })
            });

            if (!response.ok) throw new Error("Failed to submit review");

            const savedReview = await response.json();
            setReviews((prevReviews) => [savedReview, ...prevReviews]);
            setNewReview({ title: '', rating: '', text: '' }); // Clear form fields
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
                    <h1>{movie.title} <span>({new Date(movie.release_date).getFullYear()})</span></h1>
                    <p className={styles["movie-genres"]}>
                        {movie.genres.map(genre => genre.name).join(", ")}
                    </p>
                    <div className={styles["movie-actions"]}>
                        <p className={styles["movie-rating"]}>{movie.vote_average.toFixed(1)}/10</p>
                        <button className={styles["favorite-button"]}>
                            <span role="img" aria-label="heart">❤️</span> Add to Favourite
                        </button>
                    </div>
                    <p className={styles["movie-overview"]}>{movie.overview}</p>
                </div>
            </div>

            {/* Add Review Section */}
            <div className={styles["add-review"]}>
                <h2>Add Your Review</h2>

                <label>
                        Rating:
                        <input 
                            type="number" 
                            name="rating" 
                            value={newReview.rating} 
                            onChange={handleInputChange}
                            min="1" 
                            max="5" 
                            required 
                        />
                    </label>
                <form onSubmit={handleSubmitReview}>
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
                    <button type="submit" className={styles["submit-button"]}>Submit Review</button>
                </form>
            </div>

            {/* User Reviews Section */}
            <h2>User Reviews</h2>
            <div className={styles["movie-reviews"]}>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className={styles["review"]}>
                            <p><strong>Title:</strong> {review.title}</p>
                            <p><strong>Rating:</strong> {review.rating}/10</p>
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
