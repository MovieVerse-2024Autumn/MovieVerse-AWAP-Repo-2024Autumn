const getSearchMovies = async (req, res) => {
    const { query, page } = req.query;
    const API_URL = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`;
    try {
        const response = await fetch(API_URL, {
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NWRkMWQwZmRkZjA5NTg4NTM0N2Y4MjBjMTQxY2JjYyIsIm5iZiI6MTczMTY4MjgzMS40OTg5MTksInN1YiI6IjY3Mzc1ZjJiZmZlMzg3OGU5ZTlmYzJlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._5pzbMCzy-1Fsl462b_pIMtvVHkCA14KYWMzIGDjH9g",
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        res.json({
            movies: data.results || [],
            totalPages: data.total_pages || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch movies" });
    }
};

export { getSearchMovies };