import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { userCreate, userGet, userUpdate, userDelete, userLogin } from "../controllers/userController.js";

const router = express.Router();

// Crear un usuario (POST)
router.post("/", userCreate);

// Obtener usuarios (GET) - Si se pasa un ID, obtiene solo ese usuario
router.get("/", userGet);

// Actualizar parcialmente un usuario por ID (us+a PATCH)
router.patch("/:id", userUpdate);

// Eliminar un usuario por ID (DELETE)
router.delete("/:id", userDelete);

// Autenticación
router.post("/login", userLogin);

export default router; 
