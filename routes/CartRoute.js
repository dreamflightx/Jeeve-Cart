import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/CartController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js'; // Assuming you have JWT authentication middleware

const router = express.Router();

router.post('/add', authenticateJWT, addToCart);
router.get('/', authenticateJWT, getCart);
router.delete('/remove', authenticateJWT, removeFromCart);

export default router;
