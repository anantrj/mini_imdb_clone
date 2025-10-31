const WatchList = require('../models/movies');

const addWatchlist = async (req, res) => {
  try {
    const movie = new WatchList(req.body);
    await movie.save();
    return res.status(201).json({ message: 'Movie added to watchlist', movie });
  } catch (error) {
    console.error('Create watchlist item error:', error);
    return res.status(400).json({ error: error.message });
  }
};

const getWatchlist = async (req, res) => {
  try {
    const movies = await WatchList.find({});
    return res.status(200).json(movies);
  } catch (error) {
    console.error('Get watchlist error:', error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteWatchlist = async (req, res) => {
  try {
    const param = req.params.id || req.params.tmdb_id;
    // Try delete by Mongo _id first
    let deleted = null;
    if (param) {
      deleted = await WatchList.findByIdAndDelete(param);
      if (!deleted) {
        // fallback: delete by tmdb_id (numeric)
        const numeric = Number(param);
        if (!Number.isNaN(numeric)) {
          deleted = await WatchList.findOneAndDelete({ tmdb_id: numeric });
        }
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    return res.status(200).json({ message: 'Movie removed from watchlist', movie: deleted });
  } catch (error) {
    console.error('Delete watchlist item error:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addWatchlist,
  getWatchlist,
  deleteWatchlist,
};