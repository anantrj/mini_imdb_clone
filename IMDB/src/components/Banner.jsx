import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Banner() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [movies, setMovies] = useState([]);
  const [curr, setCurr] = useState(0);
  const navigate = useNavigate();
  const intervalRef = useRef();

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
      )
      .then((res) => setMovies(res.data.results.slice(0, 5)));
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurr((prev) => (prev + 1) % movies.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [movies]);

  if (movies.length === 0) {
    return (
      <div className="h-[20vh] md:h-[75vh] flex items-center justify-center bg-gray-900 text-white text-2xl">
        Loading...
      </div>
    );
  }

  const movie = movies[curr];

  return (
    <div
      className="h-[20vh] md:h-[75vh] bg-cover bg-center bg-no-repeat flex items-end cursor-pointer transition-all duration-700 relative"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
      }}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="text-2xl md:text-4xl w-full text-center bg-gray-900/60 p-4 text-white font-bold">
        {movie.title}
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {movies.map((_, idx) => (
          <span
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurr(idx);
            }}
            className={`inline-block w-3 h-3 rounded-full border-2 border-white cursor-pointer ${
              curr === idx ? "bg-white" : "bg-gray-500"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Banner;