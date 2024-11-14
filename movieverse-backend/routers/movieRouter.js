import { Router } from "express";
import { getHomeMovies } from "../controllers/tmdbControllers/tmdbHome.js";
import { getMovieDetails } from "../controllers/tmdbControllers/tmdbMovieDetail.js";


const router = Router();

router.get("/movies-homepage", getHomeMovies);
router.get("/movies-moviedetail/:id", getMovieDetails); // Add route for movie details by ID


export default router;
