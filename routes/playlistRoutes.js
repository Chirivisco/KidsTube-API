import express from 'express';
import {
    createPlaylist,
    getPlaylists,
    updatePlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistsByUser,
} from '../controllers/playlistController.js';

const router = express.Router();

router.post('/playlists', createPlaylist);
router.get('/playlists/profile/:profileId', getPlaylists);
router.patch('/playlists/:playlistId', updatePlaylist);
router.delete('/playlists/:playlistId', deletePlaylist);
router.get('/playlists/:playlistId', getPlaylistById);
router.get('/playlists/user/:userId', getPlaylistsByUser);

export default router;