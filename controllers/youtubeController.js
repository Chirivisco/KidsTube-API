import { searchVideos } from '../services/youtubeService.js';

export const searchYouTubeVideos = async (req, res) => {
    try {
        const { query, maxResults } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
        }

        console.log('Buscando videos con query:', query);
        const result = await searchVideos(query, maxResults);
        
        if (!result.success) {
            console.error('Error en la búsqueda:', result.error);
            return res.status(500).json({ error: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        console.error('Error en el controlador de YouTube:', error);
        res.status(500).json({ error: error.message || 'Error al buscar videos' });
    }
}; 