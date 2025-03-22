import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";

/**
 * Crea un nuevo perfil
 *
 * @param {*} req - La solicitud HTTP
 * @param {*} res - La respuesta HTTP
 */
export const createProfile = async (req, res) => {
  const { fullName, pin, avatar, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const profile = new Profile({
      fullName,
      pin,
      avatar,
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
 * Obtiene todos los perfiles de un usuario específico
 *
 * @param {*} req - La solicitud HTTP
 * @param {*} res - La respuesta HTTP
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
 * Actualiza un perfil por ID
 *
 * @param {*} req - La solicitud HTTP
 * @param {*} res - La respuesta HTTP
 */
export const updateProfile = async (req, res) => {
  const { fullName, pin, avatar } = req.body;

  try {
    const profile = await Profile.findByIdAndUpdate(
      req.params.profileId,
      { fullName, pin, avatar },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
};

/**
 * Elimina un perfil por ID
 *
 * @param {*} req - La solicitud HTTP
 * @param {*} res - La respuesta HTTP
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