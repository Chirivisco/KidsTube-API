import express from 'express';
import {
    createPlaylist,
    getPlaylists,
    updatePlaylist,
    deletePlaylist,
    getPlaylistById,
} from '../controllers/playlistController.js';

const router = express.Router();

router.post('/playlists', createPlaylist);
router.get('/playlists/profile/:profileId', getPlaylists);
router.patch('/playlists/:playlistId', updatePlaylist);
router.delete('/playlists/:playlistId', deletePlaylist);
router.get('/playlists/:playlistId', getPlaylistById);

export default router;