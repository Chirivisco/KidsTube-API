import Video from '../models/videoModel.js';
import Playlist from '../models/playlistModel.js';

/**
 * Controlador de videos
 * Maneja todas las operaciones relacionadas con videos:
 * - Creación de videos
 * - Obtención de videos
 * - Actualización de videos
 * - Eliminación de videos
 * - Asociación de videos a playlists
 */

/**
 * Crea un nuevo video en una playlist
 * @param {Object} req - Request object
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.playlistId - ID de la playlist
 * @param {Object} req.body - Datos del video
 * @param {string} req.body.name - Nombre del video
 * @param {string} req.body.url - URL del video
 * @param {string} req.body.description - Descripción del video
 * @param {Object} res - Response object
 * @returns {Object} Video creado
 */
export const createVideo = async (req, res) => {
    const { name, url, description } = req.body;
    const { playlistId } = req.params;

    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist no encontrada' });
        }

        const video = new Video({ name, url, description, playlist: playlistId });
        await video.save();

        playlist.videos.push(video._id);
        await playlist.save();

        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el video' });
    }
};

/**
 * Obtiene todos los videos de una playlist
 *
 * @param {*} req - La solicitud HTTP
 * @param {*} res - La respuesta HTTP
 */
export const getVideos = async (req, res) => {
    try {
        const videos = await Video.find({ playlist: req.params.playlistId });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los videos' });
    }
};

/**
 * Actualiza un video existente
 * @param {Object} req - Request object
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del video
 * @param {Object} req.body - Datos a actualizar
 * @param {Object} res - Response object
 * @returns {Object} Video actualizado
 */
export const updateVideo = async (req, res) => {
    const { name, url, description } = req.body;

    try {
        const video = await Video.findByIdAndUpdate(
            req.params.videoId,
            { name, url, description },
            { new: true }
        );

        if (!video) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el video' });
    }
};

/**
 * Elimina un video
 * @param {Object} req - Request object
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID del video
 * @param {Object} res - Response object
 * @returns {Object} Mensaje de éxito
 */
export const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.videoId);

        if (!video) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        const playlist = await Playlist.findById(video.playlist);
        playlist.videos.pull(video._id);
        await playlist.save();

        res.status(200).json({ message: 'Video eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el video' });
    }
};

/**
 * Obtiene un video por ID
 *
 * @param {*} req - La solicitud HTTP
 * @param {*} res - La respuesta HTTP
 */
export const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el video' });
    }
};