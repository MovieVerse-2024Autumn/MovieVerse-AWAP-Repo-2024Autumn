import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const API_KEY = "159c3b0b72b70b61f703169a3153283a"; //TMDB API key

const url = 'http://localhost:3001/api';
const sortings = [
  {
    sortBy: 'Popularity',
    sortValue: 'popularity.desc',
  },
  {
    sortBy: 'Rating',
    sortValue: 'vote_average.desc',
  },
  {
    sortBy: 'Latest',
    sortValue: 'primary_release_date.desc',
  },
  {
    sortBy: 'Movie Title',
    sortValue: 'title.asc',
  },
];

export default function MoviePage() {
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedSorting, setselectedSorting] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch genres
        const genreData = await fetch(`${url}/genre-list`);
        const genreList = await genreData.json();
        setGenres(genreList.genres || []);

        // Fetch countries
        const countriesData = await fetch(`${url}/country-list`);
        const CountryList = await countriesData.json();
        setCountries(CountryList || []);

        // Fetch initial movies
        const moviesResponse = await fetch(
          // `https://api.themoviedb.org/3/discover/movie?api_key=159c3b0b72b70b61f703169a3153283a&with_origin_country=NP&with_genres=28`
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
        sort_by: selectedSorting || 'popularity.desc', // Default sorting if none selected
      });
      let searchUrl =  `https://api.themoviedb.org/3/discover/movie?${queryParams.toString()}`;
      if(selectedSorting ==='vote_average.desc'){
        searchUrl += '&vote_count.gte=100'; //so that rating is based on more votes as well. Eliminate cases like: 1 vote 10 rating.
      }
      if(selectedSorting==='primary_release_date.desc'){
        const now = new Date();
        searchUrl+= `&primary_release_date.lte=${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        //for movies released latest today.
      }
      const response = await fetch(searchUrl);
      const data = await response.json();
      const filteredMovies = data.results.filter(item => item.poster_path !== null); //filter out movies with no poster image
      setMovies(filteredMovies || []);
    } catch (error) {
      console.error('Error fetching filtered movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
    );
  }

  return (
    <>
    <Navbar />
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Select Movies
      </h1>

      {/* Filters Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          justifyContent: 'space-between',
        }}
      >
        {/* Genre Dropdown */}
        <select
          style={dropdownStyle}
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

        {/* Country Dropdown */}
        <select
          style={dropdownStyle}
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

        {/* Top Rated Dropdown */}
        <select
          style={dropdownStyle}
          value={selectedSorting}
          onChange={(e) => setselectedSorting(e.target.value)}
        >
          {sortings.map((sort, index) => (
            <option key={index} value={sort.sortValue}>
              {sort.sortBy}
            </option>
          ))}
        </select>

        {/* Search Button */}
        <button style={buttonStyle} onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Movie List */}
      <MovieList movies={movies} />
    </div>
    <Footer/>
    </>
    
  );
}

// Inline CSS for dropdown and button styling
const dropdownStyle = {
  padding: '10px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  backgroundColor: '#fff',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  width: '150px',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  color: '#fff',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease',
};

buttonStyle['&:hover'] = { backgroundColor: '#0056b3' };
