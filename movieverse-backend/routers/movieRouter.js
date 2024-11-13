import { Router } from "express";
import { getHomeMovies } from "../controllers/tmdbControllers/tmdbHome.js";

const router = Router();

router.get("/movies-homepage", getHomeMovies);

export default router;
