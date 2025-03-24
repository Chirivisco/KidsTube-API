import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    profiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
    }],
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);
export default Playlist;