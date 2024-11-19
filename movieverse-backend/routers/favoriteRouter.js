import { Router } from "express";
import { getFavorites, addFavorite, removeFavorite} from "../controllers/localdbControllers/favoriteController.js";

const router = Router();

router.get("/favorites/:account_id", getFavorites);
router.post("/favorites", addFavorite);
router.delete("/favorites", removeFavorite);


export default router;
