import React from "react";
import { Link } from "react-router-dom";

function MovieCard({
  movieObj,
  poster_path,
  name,
  handleAddtoWatchList,
  handleRemoveFromWatchList,
  watchlist,
}) {
  function doesContain(movieObj) {
    for (let i = 0; i < watchlist.length; i++) {
      if (watchlist[i].id == movieObj.id) {
        return true;
      }
    }
    return false;
  }
  return (
    <div
      className="w-[200px] h-[40vh] bg-cover bg-center hover:scale-110 duration-300 rounded-xl hover:cursor-pointer flex flex-col justify-between items-end"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original/${poster_path})`,
      }}
    >
      {doesContain(movieObj) ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveFromWatchList(movieObj);
          }}
          className="m-4 flex justify-center h-8 w-8 items-center rounded lg bg-gray-900/60"
        >
          &#10060;
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleAddtoWatchList(movieObj);
          }}
          className="m-4 flex justify-center h-8 w-8 items-center rounded lg bg-gray-900/60"
        >
          &#128525;
        </div>
      )}
      <Link to={`/movie/${movieObj.id}`} className="w-full h-full flex flex-col justify-end" style={{ textDecoration: "none"}}>
      <div className="text-white text-xl w-full text-center bg-gray-900/60 p-2">
        {name}
      </div>
      </Link>
    </div>
  );
}

export default MovieCard;
