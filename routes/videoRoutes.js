import express from 'express';
import {
    createVideo,
    getVideos,
    updateVideo,
    deleteVideo,
    getVideoById,
} from '../controllers/videoController.js';

const router = express.Router();

router.post('/playlists/:playlistId/videos', createVideo);
router.get('/playlists/:playlistId/videos', getVideos);
router.patch('/videos/:videoId', updateVideo);
router.delete('/videos/:videoId', deleteVideo);
router.get('/videos/:videoId', getVideoById);

export default router;