import { Router } from "express";
import { getCountryList,getGenreList } from "../controllers/tmdbControllers/tmdbSelect.js";



const router = Router();

router.get("/country-list", getCountryList)
router.get("/genre-list", getGenreList)



export default router;
