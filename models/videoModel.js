import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(v);
            },
            message: props => `${props.value} is not a valid YouTube URL!`
        }
    },
    description: {
        type: String,
        required: true,
    },
    playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist',
        required: true,
    },
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
export default Video;