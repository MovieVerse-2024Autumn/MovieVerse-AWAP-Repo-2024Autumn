import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
    const { id } = useParams(); // Get movie ID from the URL
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/movies-moviedetail/${id}`);
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setMovie(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!movie) return <p>Error loading movie details</p>;

    return (
        <div className="movie-detail">
            <h1>{movie.title}</h1>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Rating:</strong> {movie.vote_average}/10</p>
            <p><strong>Overview:</strong> {movie.overview}</p>
        </div>
    );
};

export default MovieDetail;
