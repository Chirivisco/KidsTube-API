import Playlist from '../models/playlistModel.js';
import Profile from '../models/profileModel.js';

/**
 * Controlador de playlists
 * Maneja todas las operaciones relacionadas con playlists:
 * - Creación de playlists
 * - Obtención de playlists
 * - Actualización de playlists
 * - Eliminación de playlists
 * - Gestión de videos en playlists
 */

/**
 * Crea una nueva playlist
 * @param {Object} req - Request object
 * @param {Object} req.body - Datos de la playlist
 * @param {string} req.body.name - Nombre de la playlist
 * @param {Array<string>} req.body.profiles - IDs de los perfiles asociados
 * @param {Object} res - Response object
 * @returns {Object} Playlist creada
 */
export const createPlaylist = async (req, res) => {
    const { name, profiles } = req.body;
    console.log("Datos recibidos en el backend:", req.body);

    try {
        const playlist = new Playlist({ name, profiles });
        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la playlist' });
    }
};

/**
 * Obtiene todas las playlists de un perfil
 * @param {Object} req - Request object
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.profileId - ID del perfil
 * @param {Object} res - Response object
 * @returns {Array} Lista de playlists del perfil
 */
export const getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ profiles: req.params.profileId });
        res.status(200).json(playlists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las playlists' });
    }
};

/**
 * Actualiza una playlist existente
 * @param {Object} req - Request object
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID de la playlist
 * @param {Object} req.body - Datos a actualizar
 * @param {Object} res - Response object
 * @returns {Object} Playlist actualizada
 */
export const updatePlaylist = async (req, res) => {
    const { name, profiles } = req.body;

    try {
        const playlist = await Playlist.findByIdAndUpdate(
            req.params.playlistId,
            { name, profiles },
            { new: true }
        );

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist no encontrada' });
        }

        res.status(200).json(playlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la playlist' });
    }
};

/**
 * Elimina una playlist
 * @param {Object} req - Request object
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID de la playlist
 * @param {Object} res - Response object
 * @returns {Object} Mensaje de éxito
 */
export const deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findByIdAndDelete(req.params.playlistId);

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist no encontrada' });
        }

        res.status(200).json({ message: 'Playlist eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la playlist' });
    }
};

/**
 * Obtiene una playlist por ID
 *
 * @param {*} req - La solicitud HTTP
 * @param {*} res - La respuesta HTTP
 */
export const getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId).populate('videos');
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist no encontrada' });
        }
        res.status(200).json(playlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la playlist' });
    }
};

/**
 * Obtiene todas las playlists de un usuario
 * @param {Object} req - Request object
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.userId - ID del usuario
 * @param {Object} res - Response object
 * @returns {Array} Lista de playlists del usuario
 */
export const getPlaylistsByUser = async (req, res) => {
    try {
        // Obtener todos los perfiles del usuario
        const profiles = await Profile.find({ user: req.params.userId }).select('_id');

        // Extraer los IDs de los perfiles
        const profileIds = profiles.map(profile => profile._id);

        // Buscar playlists que contengan al menos uno de los perfiles del usuario
        const playlists = await Playlist.find({ profiles: { $in: profileIds } });

        res.status(200).json(playlists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las playlists del usuario' });
    }
};
