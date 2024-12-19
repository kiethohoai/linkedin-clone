import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { getPublicProfile, getSuggestedConnections } from '../controllers/user.controller';

const router = express.Router();

/* GET SUGGESTED CONNECTIONS */
router.get('/suggestions', protectRoute, getSuggestedConnections);

/* GET PUBLIC PROFILE */
router.get('/:username', protectRoute, getPublicProfile);

export default router;
