import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { userCreate, userGet, userUpdate, userDelete, userLogin, verifyEmail, googleAuth, verifySmsCode, resendSmsCode } from "../controllers/userController.js";

const router = express.Router();

// Crear un usuario (POST)
router.post("/", userCreate);

// Obtener usuarios (GET) - Si se pasa un ID, obtiene solo ese usuario
router.get("/", userGet);

// Actualizar un usuario por ID (PUT)
router.put("/:id", userUpdate);

// Eliminar un usuario por ID (DELETE)
router.delete("/:id", userDelete);

// Autenticación
router.post("/login", userLogin);

// Autenticación con Google
router.post("/google-auth", googleAuth);

// Verificación de email
router.get("/verify-email", verifyEmail);

// Verificación de código SMS
router.post('/verify-sms', verifySmsCode);
router.post('/resend-sms', resendSmsCode);

export default router; 
