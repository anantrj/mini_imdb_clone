const mongoose = require('mongoose')

const watchlistSchema = new mongoose.Schema({
    tmdb_id: {
        type: Number,
        required: [true, 'ID must be mentioned']
    },
    title: {
        type: String,
        required: [true, 'title of movie must be mentioned']
    },
    poster_url: {
        type: String,
    },
    rating: {
        type: Number,
    },
    popularity: {
        type: Number
    },
    genre: {
        type: String
    },
    overview: {
        type: String
    },
    release_date: {
        type: String
    }
});

module.exports = mongoose.model('Item', watchlistSchema);