import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export const searchVideos = async (query, maxResults = 10) => {
    try {
        console.log('API Key:', YOUTUBE_API_KEY ? 'Presente' : 'No presente');
        console.log('Query:', query);
        
        const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
            params: {
                part: 'snippet',
                maxResults: maxResults,
                q: query,
                type: 'video',
                key: YOUTUBE_API_KEY
            }
        });

        return {
            success: true,
            data: response.data.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnailUrl: item.snippet.thumbnails.medium.url,
                channelTitle: item.snippet.channelTitle,
                publishedAt: item.snippet.publishedAt
            }))
        };
    } catch (error) {
        console.error('Error al buscar videos en YouTube:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message
        };
    }
}; 