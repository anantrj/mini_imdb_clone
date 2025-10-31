import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getWatchlist, addToWatchlist, deleteFromWatchlist } from './api/watchlist';
import Navbar from "./components/Navbar";
import Movies from "./components/Movies";
import Watchlist from "./components/Watchlist";
import Banner from "./components/Banner";
import MovieInfo from "./components/movieInfo";

const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

function mapBackendMovie(m) {
  const posterPath = m.poster_url?.startsWith('http')
    ? m.poster_url
    : m.poster_url
      ? `https://image.tmdb.org/t/p/w500${m.poster_url}`
      : null;

  // build genres array (names)
  const genresArr = (() => {
    if (Array.isArray(m.genres) && m.genres.length) {
      // genres may be array of {id,name} or array of strings
      return m.genres.map(g => (typeof g === 'string' ? g : (g.name || 'Unknown')));
    }
    if (m.genre && typeof m.genre === 'string') {
      return m.genre.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (Array.isArray(m.genre_ids) && m.genre_ids.length) {
      return m.genre_ids.map(id => GENRE_MAP[id] || 'Unknown');
    }
    return [];
  })();

  // choose primary genre (first available, or "Unknown")
  const primaryGenre = genresArr.length ? genresArr[0] : (m.genre || (Array.isArray(m.genre_ids) && GENRE_MAP[m.genre_ids[0]]) || 'Unknown');

  return {
    id: m.tmdb_id ?? m._id,
    _id: m._id,
    tmdb_id: m.tmdb_id,
    title: m.title,
    poster_path: posterPath,
    poster_url: posterPath,
    vote_average: m.rating,
    popularity: m.popularity,
    overview: m.overview,
    release_date: m.release_date,
    genre: m.genre,
    genres: genresArr,
    genre_ids: m.genre_ids || [],
    primary_genre: primaryGenre
  };
}

function App() {
  const [watchlist, setWatchList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getWatchlist();
        const items = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
        
        const mapped = items.map(m => {
          const posterPath = m.poster_url?.startsWith('http') 
            ? m.poster_url 
            : m.poster_url 
              ? `https://image.tmdb.org/t/p/w500${m.poster_url}`
              : null;

          // Split genre string into array
          const genres = m.genre ? m.genre.split(", ").map(g => g.trim()) : [];

          return {
            _id: m._id,
            id: m.tmdb_id ?? m._id,
            tmdb_id: m.tmdb_id,
            title: m.title,
            original_title: m.title,
            poster_path: posterPath,
            poster_url: posterPath,
            vote_average: m.rating,
            popularity: m.popularity,
            overview: m.overview,
            release_date: m.release_date,
            genre: m.genre,
            genres: genres, // Add parsed genres array
            genre_ids: genres.map(g => {
              // Map genre names back to IDs using GENRE_MAP
              const entry = Object.entries(GENRE_MAP).find(([_, name]) => name === g);
              return entry ? Number(entry[0]) : null;
            }).filter(id => id !== null)
          };
        });

        const unique = Array.from(new Map(mapped.map(i => [i._id ?? i.id, i])).values());
        setWatchList(unique);
      } catch (err) {
        console.error("Failed to load watchlist from backend:", err);
      }
    })();
  }, []);

  const handleAddtoWatchList = async (movieObjOrId) => {
    const isId = typeof movieObjOrId === 'number' || typeof movieObjOrId === 'string';
    const tmdbId = isId ? Number(movieObjOrId) : (movieObjOrId.id || movieObjOrId.tmdb_id);
    if (!tmdbId) return;

    if (watchlist.some((m) => m.id === tmdbId)) return;

    try {
      const payload = isId ? {
        tmdb_id: tmdbId,
        title: "",
        poster_url: "",
        rating: null,
        popularity: null,
        genre: "",
        overview: "",
        release_date: ""
      } : {
        tmdb_id: tmdbId,
        title: movieObjOrId.original_title || movieObjOrId.title || movieObjOrId.name || "",
        poster_url: movieObjOrId.poster_path ? `https://image.tmdb.org/t/p/w500${movieObjOrId.poster_path}` : (movieObjOrId.poster_url || ""),
        rating: movieObjOrId.vote_average ?? movieObjOrId.rating ?? null,
        popularity: movieObjOrId.popularity ?? null,
        genre: movieObjOrId.genres
          ? movieObjOrId.genres.map(g => g.name).join(", ")
          : movieObjOrId.genre_ids
            ? movieObjOrId.genre_ids.map(id => GENRE_MAP[id] || "Unknown").join(", ")
            : movieObjOrId.genre || "Unknown",
        overview: movieObjOrId.overview || "",
        release_date: movieObjOrId.release_date || ""
      };

      const saved = await addToWatchlist(payload);
      // backend may return { movie, message } or the movie directly
      const created = saved.movie ? saved.movie : saved;
      const entry = mapBackendMovie(created);

      setWatchList(prev => [...prev, entry]);
    } catch (err) {
      console.error("handleAddtoWatchList error:", err);
    }
  };

  const handleRemoveFromWatchList = async (movieObjOrId) => {
    try {
      const isId = typeof movieObjOrId === 'number' || typeof movieObjOrId === 'string';
      const tmdbId = isId ? Number(movieObjOrId) : (movieObjOrId.id ?? movieObjOrId.tmdb_id);
      const existing = watchlist.find(m => m.id === tmdbId || m.tmdb_id === tmdbId || m._id === movieObjOrId._id);
      const backendId = (movieObjOrId && movieObjOrId._id) ? movieObjOrId._id : existing?._id;

      if (!backendId) {
        // fallback: remove locally by tmdb id
        setWatchList(prev => prev.filter(m => m.id !== tmdbId && m.tmdb_id !== tmdbId));
        return;
      }

      await deleteFromWatchlist(backendId);
      setWatchList(prev => prev.filter(m => m._id !== backendId && m.id !== tmdbId && m.tmdb_id !== tmdbId));
    } catch (err) {
      console.error("handleRemoveFromWatchList error:", err);
    }
  };

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/movie/:id" element={<MovieInfo watchlist={watchlist} handleAddtoWatchList={handleAddtoWatchList} handleRemoveFromWatchList={handleRemoveFromWatchList}/>}></Route>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <Movies
                  watchlist={watchlist}
                  handleAddtoWatchList={handleAddtoWatchList}
                  handleRemoveFromWatchList={handleRemoveFromWatchList}
                />
              </>
            }
          />
          <Route
            path="/watchlist"
            element={
              <Watchlist
                watchlist={watchlist}
                setWatchList={setWatchList}
                handleRemoveFromWatchList={handleRemoveFromWatchList}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
