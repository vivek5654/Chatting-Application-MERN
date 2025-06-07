import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getAllUsers, getMessage, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

// Get all users route
router.get('/users', protectRoute, getAllUsers);

// Message routes
router.get('/:id', protectRoute, getMessage);
router.post('/send/:id', protectRoute, sendMessage);

export default router;