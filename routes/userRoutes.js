import express from "express";
import { userCreate, userGet, userUpdate, userDelete } from "../controllers/userController.js";

const router = express.Router();

// Crear un usuario (POST)
router.post("/", userCreate);

// Obtener usuarios (GET) - Si se pasa un ID, obtiene solo ese usuario
router.get("/", userGet);

// Actualizar parcialmente un usuario por ID (PATCH)
router.patch("/:id", userUpdate);

// Eliminar un usuario por ID (DELETE)
router.delete("/:id", userDelete);

export default router; 
