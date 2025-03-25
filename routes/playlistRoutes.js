// Importa el módulo `express` para crear rutas
import express from "express";

// Importa los controladores de las playlists
import {
    createPlaylist, // Controlador para crear una playlist
    getPlaylists, // Controlador para obtener playlists asociadas a un perfil
    updatePlaylist, // Controlador para actualizar una playlist
    deletePlaylist, // Controlador para eliminar una playlist
    getPlaylistById, // Controlador para obtener una playlist por su ID
    getPlaylistsByUser, // Controlador para obtener playlists asociadas a un usuario
} from "../controllers/playlistController.js";

// Importa el middleware de autenticación para proteger las rutas
import authMiddleware from "../middlewares/authMiddleware.js";

// Crea un router de Express
const router = express.Router();

/**
 * Rutas para manejar las playlists.
 * Todas las rutas están protegidas con `authMiddleware`.
 */

// Ruta para crear una nueva playlist
// POST /playlists
router.post("/playlists", authMiddleware, createPlaylist);

// Ruta para obtener todas las playlists asociadas a un perfil
// GET /playlists/profile/:profileId
router.get("/playlists/profile/:profileId", authMiddleware, getPlaylists);

// Ruta para actualizar una playlist existente
// PATCH /playlists/:playlistId
router.patch("/playlists/:playlistId", authMiddleware, updatePlaylist);

// Ruta para eliminar una playlist
// DELETE /playlists/:playlistId
router.delete("/playlists/:playlistId", authMiddleware, deletePlaylist);

// Ruta para obtener una playlist por su ID
// GET /playlists/:playlistId
router.get("/playlists/:playlistId", authMiddleware, getPlaylistById);

// Ruta para obtener todas las playlists asociadas a un usuario
// GET /playlists/user/:userId
router.get("/playlists/user/:userId", authMiddleware, getPlaylistsByUser);

// Exporta el router para que pueda ser utilizado en el servidor principal
export default router;