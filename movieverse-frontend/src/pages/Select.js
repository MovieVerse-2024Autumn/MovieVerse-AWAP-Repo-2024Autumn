import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import styles from '../styles/Select.module.css';

const API_KEY = "159c3b0b72b70b61f703169a3153283a"; // TMDB API key

const url = 'http://localhost:3001/api';
const sortings = [
  { sortBy: 'Popularity', sortValue: 'popularity.desc' },
  { sortBy: 'Rating', sortValue: 'vote_average.desc' },
  { sortBy: 'Latest', sortValue: 'primary_release_date.desc' },
  { sortBy: 'Movie Title', sortValue: 'title.asc' },
];

export default function Select() {
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSorting, setSelectedSorting] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreData = await fetch(`${url}/genre-list`);
        const genreList = await genreData.json();
        setGenres(genreList.genres || []);

        const countriesData = await fetch(`${url}/country-list`);
        const countryList = await countriesData.json();
        setCountries(countryList || []);

        const moviesResponse = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=1&sort_by=popularity.desc`
        );
        const moviesData = await moviesResponse.json();
        setMovies(moviesData.results || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        api_key: API_KEY,
        language: 'en-US',
        with_genres: selectedGenre,
        with_origin_country: selectedCountry,
        sort_by: selectedSorting || 'popularity.desc',
      });
      let searchUrl = `https://api.themoviedb.org/3/discover/movie?${queryParams.toString()}`;
      if (selectedSorting === 'vote_average.desc') {
        searchUrl += '&vote_count.gte=100';
      }
      if (selectedSorting === 'primary_release_date.desc') {
        const now = new Date();
        searchUrl += `&primary_release_date.lte=${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      }
      const response = await fetch(searchUrl);
      const data = await response.json();
      const filteredMovies = data.results.filter((item) => item.poster_path !== null);
      setMovies(filteredMovies || []);
    } catch (error) {
      console.error('Error fetching filtered movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select Movies</h1>

      <div className={styles.filters}>
        <select
          className={styles.dropdown}
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <select
          className={styles.dropdown}
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">Country</option>
          {countries.map((country, index) => (
            <option key={index} value={country.iso_3166_1}>
              {country.english_name}
            </option>
          ))}
        </select>

        <select
          className={styles.dropdown}
          value={selectedSorting}
          onChange={(e) => setSelectedSorting(e.target.value)}
        >
          {sortings.map((sort, index) => (
            <option key={index} value={sort.sortValue}>
              {sort.sortBy}
            </option>
          ))}
        </select>

        <button className={styles.button} onClick={handleSearch}>
          Search
        </button>
      </div>

      <MovieList movies={movies} />
    </div>
  );
}
