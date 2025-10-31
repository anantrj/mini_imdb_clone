const express=require('express')
const router= express.Router();
const {addWatchlist,getWatchlist,deleteWatchlist} = require('../controllers/items');

router.route('/').get(getWatchlist).post(addWatchlist);
router.route('/:tmdb_id').delete(deleteWatchlist);

module.exports = router;