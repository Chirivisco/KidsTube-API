import express from 'express';
import { searchYouTubeVideos } from '../controllers/youtubeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/search', authMiddleware, searchYouTubeVideos);

export default router; 