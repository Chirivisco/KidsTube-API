import express from "express";
import {
  createProfile,
  getProfiles,
  updateProfile,
  deleteProfile,
  getProfileById,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", createProfile); // crear un perfil
router.get("/user/:userId", getProfiles);  // obtener todos los perfiles de un usuario
router.get("/:profileId", getProfileById); // obtener un perfil específico
router.put("/:profileId", updateProfile); // actualizar un perfil
router.delete("/:profileId", deleteProfile); // eliminar un perfil
export default router;