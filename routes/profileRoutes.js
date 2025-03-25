// Importa el módulo `express` para crear rutas
import express from "express";

// Importa el middleware de autenticación para proteger las rutas
import authMiddleware from "../middlewares/authMiddleware.js";

// Importa el middleware de roles para verificar permisos
import roleMiddleware from "../middlewares/roleMiddleware.js";

// Importa los controladores de los perfiles
import {
  createProfile, // Controlador para crear un perfil
  getProfiles, // Controlador para obtener perfiles asociados a un usuario
  updateProfile, // Controlador para actualizar un perfil
  deleteProfile, // Controlador para eliminar un perfil
  getProfileById, // Controlador para obtener un perfil por su ID
  selectProfile, // Controlador para seleccionar un perfil
  upload, // Middleware para manejar la subida de archivos (avatar)
} from "../controllers/profileController.js";

// Crea un router de Express
const router = express.Router();

/**
 * Rutas para manejar los perfiles.
 * Todas las rutas están protegidas con `authMiddleware`.
 */

// Ruta para crear un nuevo perfil
// Solo los usuarios con rol "main" pueden crear perfiles
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["main"]),
  upload.single("avatar"),
  createProfile
);

// Ruta para obtener todos los perfiles asociados a un usuario
// Solo los usuarios con rol "main" pueden acceder a esta ruta
router.get(
  "/user/:userId",
  authMiddleware,
  getProfiles
);

// Ruta para obtener un perfil por su ID
// Los usuarios con rol "main" o "restricted" pueden acceder a esta ruta
router.get(
  "/:profileId",
  authMiddleware,
  roleMiddleware(["main", "restricted"]),
  getProfileById
);

// Ruta para actualizar un perfil existente
// Solo los usuarios con rol "main" pueden actualizar perfiles
router.patch(
  "/:profileId",
  authMiddleware,
  roleMiddleware(["main"]),
  upload.single("avatar"),
  updateProfile
);

// Ruta para eliminar un perfil por su ID
// Solo los usuarios con rol "main" pueden eliminar perfiles
router.delete(
  "/:profileId",
  authMiddleware,
  roleMiddleware(["main"]),
  deleteProfile
);

// Ruta para seleccionar un perfil
// Solo los usuarios autenticados pueden seleccionar un perfil
router.post(
  "/select-profile", 
  authMiddleware, 
  selectProfile
);

// Exporta el router para que pueda ser utilizado en el servidor principal
export default router;