import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { getFeedPosts } from '../controllers/post.controller';

const router = express.Router();

router.get('/', protectRoute, getFeedPosts);

export default router;
