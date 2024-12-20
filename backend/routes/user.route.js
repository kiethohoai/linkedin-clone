import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  getPublicProfile,
  getSuggestedConnections,
  updateProfile,
} from '../controllers/user.controller.js';

const router = express.Router();

/* GET SUGGESTED CONNECTIONS */
router.get('/suggestions', protectRoute, getSuggestedConnections);

/* GET PUBLIC PROFILE */
router.get('/:username', protectRoute, getPublicProfile);

/* UPDATE PROFILE */
router.put('/profile', protectRoute, updateProfile);

export default router;
