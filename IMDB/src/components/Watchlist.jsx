import React, { useEffect, useState } from "react";
import genreids from "../Utility/genre";
import { Link } from "react-router-dom";

function Watchlist({ watchlist, setWatchList, handleRemoveFromWatchList }) {
  const [search, setSearch] = useState("");

  const [genreList, setGenreList] = useState(["All Genres"]);

  const [currGenre, setCurrGenre] = useState("All Genres");

  let handleSearch = (e) => {
    setSearch(e.target.value);
  };

  let sortIncreasing = () => {
    let sortedIncreasing = watchlist.sort((movieA, movieB) => {
      return movieA.vote_average - movieB.vote_average;
    });
    setWatchList([...sortedIncreasing]);
  };

  let sortDecreasing = () => {
    let sortedDecreasing = watchlist.sort((movieA, movieB) => {
      return movieB.vote_average - movieA.vote_average;
    });
    setWatchList([...sortedDecreasing]);
  };

  let sortIncreasingP = () => {
    let sortedIncreasingP = watchlist.sort((movieA, movieB) => {
      return movieA.popularity - movieB.popularity;
    });
    setWatchList([...sortedIncreasingP]);
  };

  let sortDecreasingP = () => {
    let sortedDecreasingP = watchlist.sort((movieA, movieB) => {
      return movieB.popularity - movieA.popularity;
    });
    setWatchList([...sortedDecreasingP]);
  };

  let handleFilter = (genre) => {
    setCurrGenre(genre);
  };
  useEffect(() => {
    let temp = watchlist
      .map((movieObj) => {
        if (movieObj.genre_ids && movieObj.genre_ids.length > 0) {
          return genreids[movieObj.genre_ids[0]];
        }
        return null;
      })
      .filter((genre) => genre !== null && genre !== undefined);
    let uniqueGenres = Array.from(new Set(temp));
    setGenreList(["All Genres", ...uniqueGenres]);
  }, [watchlist]);

  return (
    <>
      <div className="flex justify-center flex-wrap m-4">
        {genreList.map((genre) => {
          return (
            <div
              onClick={() => handleFilter(genre)}
              className={
                currGenre === genre
                  ? "bg-blue-400 flex justify-center items-center h-[3rem] w-[9rem] rounded-xl cursor-pointer text-white font-bold mx-4 "
                  : "bg-gray-400/50 flex justify-center items-center h-[3rem] w-[9rem] rounded-xl cursor-pointer text-white font-bold mx-4"
              }
              key={genre}
            >
              {genre}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center my-4">
        <input
          onChange={handleSearch}
          value={search}
          type="text"
          placeholder="Search for Movies"
          className="h-[3rem] w-[18rem] bg-gray-200 outline-none px-4"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 m-8">
        <table className="w-full text-gray-500 text-center">
          <thead>
            <tr>
              <th>Name</th>
              <th>
                <div className="flex justify-center items-center">
                  <span onClick={sortIncreasing} className="p-2 cursor-pointer">
                    <i className="fa-solid fa-arrow-up"></i>
                  </span>
                  <span className="p-2">Ratings</span>
                  <span onClick={sortDecreasing} className="p-2 cursor-pointer">
                    <i className="fa-solid fa-arrow-down"></i>
                  </span>
                </div>
              </th>
              <th>
                <div className="flex justify-center items-center">
                  <span
                    onClick={sortIncreasingP}
                    className="p-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-arrow-up"></i>
                  </span>
                  <span className="p-2">Popularity</span>
                  <span
                    onClick={sortDecreasingP}
                    className="p-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-arrow-down"></i>
                  </span>
                </div>
              </th>
              <th>Genre</th>
            </tr>
          </thead>

          <tbody>
            {watchlist
              .filter((movieObj) => {
                if (currGenre === "All Genres") return true;
                const g = movieObj.genres && movieObj.genres.length > 0 ? movieObj.genres[0] : "Unknown";
                return g === currGenre;
              })
              .filter((movieObj) => {
                const title = (movieObj.title || movieObj.original_title || movieObj.name || "").toLowerCase();
                return title.includes(search.toLowerCase());
              })
              .map((movieObj) => {
                const title = movieObj.title || movieObj.original_title || movieObj.name || "Untitled";
                // poster_path might already be full URL or a TMDB path
                const posterSrc = movieObj.poster_path
                  ? movieObj.poster_path.startsWith("http")
                    ? movieObj.poster_path
                    : `https://image.tmdb.org/t/p/original/${movieObj.poster_path}`
                  : movieObj.poster_url || ""; // fallback to backend field

                const genreDisplay =
                  movieObj.genre ||
                  (movieObj.genre_ids && movieObj.genre_ids.length > 0
                    ? genreids[movieObj.genre_ids[0]]
                    : "Unknown");

                return (
                  <tr className="border-b-2" key={movieObj._id ?? movieObj.id}>
                    <td className="flex items-center px-6 py-4">
                      {posterSrc ? (
                        <img className="h-[6rem] w-[10rem]" src={posterSrc} alt={title} />
                      ) : (
                        <div className="h-[6rem] w-[10rem] bg-gray-200 flex items-center justify-center">No Image</div>
                      )}
                      <Link to={`/movie/${movieObj.id}`}>
                        <div className="mx-10">{title}</div>
                      </Link>
                    </td>
                    <td>{movieObj.vote_average}</td>
                    <td>{movieObj.popularity}</td>
                    <td>{genreDisplay}</td>

                    <td
                      onClick={() => handleRemoveFromWatchList(movieObj)}
                      className=" cursor-pointer text-red-800"
                    >
                      Delete
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Watchlist;
