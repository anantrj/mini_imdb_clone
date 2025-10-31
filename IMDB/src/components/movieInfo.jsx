import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function MovieInfo({ watchlist , handleAddtoWatchList , handleRemoveFromWatchList}) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const found = watchlist.find((m) => m.id === Number(id));
    if (found) {
      setMovie(found);
    } else {
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
        )
        .then((res) => setMovie(res.data));
    }
  }, [id, watchlist]);
  if (!movie) return <div className="text-center text-xl mt-10">Loading...</div>;

  const isInWatchlist = watchlist.some((m) => m.id === movie.id);

  const handleToggleWatchlist = () => {
    if (isInWatchlist) {
      handleRemoveFromWatchList(movie);
    } else {
      handleAddtoWatchList(movie);
    }
  };
  return (
    <div className="flex flex-row m-10 bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <img
        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
        alt={movie.title}
        className="w-64 h-96 object-cover rounded-l-xl shadow-md"
      />
      <div className="flex flex-col justify-between p-8 bg-gradient-to-br from-blue-50 to-blue-100 w-full">
        <div>
          <h1 className="text-4xl font-extrabold mb-4 text-blue-900 drop-shadow">
            {movie.title || movie.original_title}
          </h1>
          <p className="mb-6 text-gray-700 text-lg">
            <span className="font-semibold text-blue-700">Plot:</span> {movie.overview}
          </p>
        </div>
        <div className="flex flex-row gap-8 mt-4 items-center">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Rating</span>
            <span className="text-2xl font-bold text-yellow-500">{movie.vote_average}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Popularity</span>
            <span className="text-2xl font-bold text-green-600">{movie.popularity}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500">Release Date</span>
            <span className="text-lg font-semibold text-blue-800">{movie.release_date}</span>
          </div>
          <button
            onClick={handleToggleWatchlist}
            className={`ml-8 px-4 py-2 rounded-lg font-medium shadow transition cursor-pointer ${
              isInWatchlist
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isInWatchlist ? "Remove" : "+ Add to Watchlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieInfo;
