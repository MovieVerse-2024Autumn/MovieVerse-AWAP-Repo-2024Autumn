import { Router } from "express";
import { getHomeMovies } from "../controllers/tmdbControllers/tmdbHome.js";
import { getMovieDetails,getMovieCast } from "../controllers/tmdbControllers/tmdbMovieDetail.js";
import { getSearchMovies } from "../controllers/tmdbControllers/tmdbSearch.js";


const router = Router();

router.get("/movies-homepage", getHomeMovies);
router.get("/movies-moviedetail/:id", getMovieDetails); // Add route for movie details by ID
router.get("/movies-search", getSearchMovies);
router.get("/movies/:id/cast", getMovieCast); // Add a route for movie cast



export default router;
