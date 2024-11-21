import { Router } from "express";
import { getFavorites, addFavorite, removeFavorite,toggleSharing,getSharedFavorites} from "../controllers/localdbControllers/favoriteController.js";

const router = Router();

router.get("/favorites/:account_id", getFavorites);
router.post("/favorites", addFavorite);
router.delete("/favorites", removeFavorite);
router.post("/favorites/share", toggleSharing);
router.get("/favorites/shared/:account_id", getSharedFavorites);



export default router;
