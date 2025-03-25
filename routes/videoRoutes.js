// Importa el módulo `express` para crear rutas
import express from "express";

// Importa los controladores de los videos
import {
    createVideo, // Controlador para crear un video
    getVideos, // Controlador para obtener todos los videos de una playlist
    updateVideo, // Controlador para actualizar un video
    deleteVideo, // Controlador para eliminar un video
    getVideoById, // Controlador para obtener un video por su ID
} from "../controllers/videoController.js";

// Importa el middleware de autenticación para proteger las rutas
import authMiddleware from "../middlewares/authMiddleware.js";

// Importa el middleware de roles para verificar permisos
import roleMiddleware from "../middlewares/roleMiddleware.js";

// Crea un router de Express
const router = express.Router();

/**
 * Rutas para manejar los videos.
 * Todas las rutas están protegidas con `authMiddleware`.
 */

// Ruta para crear un nuevo video en una playlist
// POST /playlists/:playlistId/videos
router.post("/playlists/:playlistId/videos", authMiddleware, roleMiddleware(["main"]), createVideo);

// Ruta para obtener todos los videos de una playlist
// GET /playlists/:playlistId/videos
router.get("/playlists/:playlistId/videos", authMiddleware, roleMiddleware(["main", "restricted"]), getVideos);

// Ruta para actualizar un video existente
// PATCH /videos/:videoId
router.patch("/videos/:videoId", authMiddleware, roleMiddleware(["main"]), updateVideo);

// Ruta para eliminar un video por su ID
// DELETE /videos/:videoId
router.delete("/videos/:videoId", authMiddleware, roleMiddleware(["main"]), deleteVideo);

// Ruta para obtener un video por su ID
// GET /videos/:videoId
router.get("/videos/:videoId", authMiddleware, roleMiddleware(["main", "restricted"]), getVideoById);

// Exporta el router para que pueda ser utilizado en el servidor principal
export default router;
