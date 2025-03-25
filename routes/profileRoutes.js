// Importa el módulo `express` para crear rutas
import express from "express";

// Importa el middleware de autenticación para proteger las rutas
import authMiddleware from "../middlewares/authMiddleware.js";

// Importa los controladores de los perfiles
import {
  createProfile, // Controlador para crear un perfil
  getProfiles, // Controlador para obtener perfiles asociados a un usuario
  updateProfile, // Controlador para actualizar un perfil
  deleteProfile, // Controlador para eliminar un perfil
  getProfileById, // Controlador para obtener un perfil por su ID
  upload, // Middleware para manejar la subida de archivos (avatar)
} from "../controllers/profileController.js";

// Crea un router de Express
const router = express.Router();

/**
 * Rutas para manejar los perfiles.
 * Todas las rutas están protegidas con `authMiddleware`.
 */

// Ruta para crear un nuevo perfil
// POST /
// Incluye el middleware `upload.single("avatar")` para manejar la subida de un archivo (avatar)
router.post("/", authMiddleware, upload.single("avatar"), createProfile);

// Ruta para obtener todos los perfiles asociados a un usuario
// GET /user/:userId
router.get("/user/:userId", authMiddleware, getProfiles);

// Ruta para obtener un perfil por su ID
// GET /:profileId
router.get("/:profileId", authMiddleware, getProfileById);

// Ruta para actualizar un perfil existente
// PATCH /:profileId
// Incluye el middleware `upload.single("avatar")` para manejar la subida de un nuevo avatar
router.patch("/:profileId", authMiddleware, upload.single("avatar"), updateProfile);

// Ruta para eliminar un perfil por su ID
// DELETE /:profileId
router.delete("/:profileId", authMiddleware, deleteProfile);

// Exporta el router para que pueda ser utilizado en el servidor principal
export default router;