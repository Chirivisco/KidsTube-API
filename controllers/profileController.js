import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage: storage });

/**
 * Controlador de perfiles
 * Maneja todas las operaciones relacionadas con perfiles de usuario:
 * - Creación de perfiles
 * - Obtención de perfiles
 * - Actualización de perfiles
 * - Eliminación de perfiles
 * - Selección de perfiles
 */

/**
 * Crea un nuevo perfil para un usuario
 * @param {Object} req - Request object
 * @param {Object} req.body - Datos del perfil
 * @param {string} req.body.fullName - Nombre completo del perfil
 * @param {string} req.body.pin - PIN de acceso
 * @param {string} req.body.avatar - URL del avatar
 * @param {Object} res - Response object
 * @returns {Object} Perfil creado
 */
export const createProfile = async (req, res) => {
  const { fullName, pin, userId, avatar } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    let avatarPath = avatar;

    if (req.file) {
      avatarPath = `/Images/${req.file.filename}`;
    } else if (!avatar || (!req.file && !avatar.startsWith("http"))) {
      return res.status(400).json({ error: "Debes proporcionar un avatar válido." });
    }

    const profile = new Profile({
      fullName,
      pin,
      avatar: avatarPath,
      user: userId,
      role: user.profiles.length === 0 ? "main" : "restricted",
    });

    await profile.save();
    user.profiles.push(profile._id);
    await user.save();

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el perfil" });
  }
};

/**
 * Obtiene todos los perfiles de un usuario
 * @param {Object} req - Request object
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.userId - ID del usuario
 * @param {Object} res - Response object
 * @returns {Array} Lista de perfiles del usuario
 */
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ user: req.params.userId });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los perfiles" });
  }
};

/**
 * Actualiza un perfil existente
 * @param {Object} req - Request object
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del perfil
 * @param {Object} req.body - Datos a actualizar
 * @param {Object} res - Response object
 * @returns {Object} Perfil actualizado
 */
export const updateProfile = async (req, res) => {
  const { fullName, pin, avatar } = req.body;

  try {
    let avatarPath = avatar;

    if (req.file) {
      avatarPath = `/Images/${req.file.filename}`;
    }

    const profile = await Profile.findByIdAndUpdate(
      req.params.profileId,
      { fullName, pin, avatar: avatarPath },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
}

/**
 * Elimina un perfil
 * @param {Object} req - Request object
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del perfil
 * @param {Object} res - Response object
 * @returns {Object} Mensaje de éxito
 */
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.profileId);

    if (!profile) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }

    const user = await User.findById(profile.user);
    user.profiles.pull(profile._id);
    await user.save();

    res.status(200).json({ message: "Perfil eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el perfil" });
  }
};

/**
 * Obtiene un perfil por ID
 *
 * @param {*} req - La solicitud HTTP
 * @param {*} res - La respuesta HTTP
 */
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.profileId);
    if (!profile) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
};

/**
 * Selecciona un perfil para el usuario actual
 * @param {Object} req - Request object
 * @param {Object} req.body - Datos de selección
 * @param {string} req.body.profileId - ID del perfil a seleccionar
 * @param {Object} res - Response object
 * @returns {Object} Token de perfil
 */
export const selectProfile = async (req, res) => {
  const { profileId } = req.body;
  const userId = req.user.id; // Extraído del token del usuario autenticado

  try {
    const profile = await Profile.findById(profileId);
    if (!profile || profile.user.toString() !== userId) {
      return res.status(404).json({ error: "Perfil no encontrado o no autorizado" });
    }

    // Generar el segundo token con el rol del perfil
    const token_profile = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        profileId: profile._id,
        role: profile.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: Date.now() + 60 * 1000 } // Expira en 1 minuto
    );

    res.json({
      message: "Perfil seleccionado",
      token_profile,  // Cambié 'token' por 'token_profile' para que sea consistente
      profile: { id: profile._id, fullName: profile.fullName, role: profile.role },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al seleccionar el perfil" });
  }
};
