import express from 'express';
import authController from '../controllers/localdbControllers/authController.js';

import { deleteAccount } from "../controllers/localdbControllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js"
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticateToken, authController.logout);
router.delete('/delete', authenticateToken, deleteAccount);

export default router;
