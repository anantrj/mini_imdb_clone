import React, { useEffect, useState , useRef } from 'react'
import logo from '../images/download.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [query,setQuery] = useState("");
  const [results,setResults] = useState([]);
  const [showDropdown,setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if(value.length > 1) {
      const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${value}`);
      setResults(res.data.results.slice(0,7));
      setShowDropdown(true);
    }
    else {
      setResults([]);
      setShowDropdown(false);
    }
  };


  const handleSelect = (movie) => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    navigate(`/movie/${movie.id}`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown",handleClickOutside);
  },[]);
  return (
    <nav className='flex items-center justify-between px-8 p-4 bg-gradient-to-r from-indigo-900 via-blue-700 to-sky-500 text-white relative shadow-lg'>
        <div className='flex items-center gap-8'>
            <img src={logo} alt="Logo" className="w-8 h-8"/>
            <Link to='/' className='text-2xl font-bold tracking-wide'>IMDB</Link>
            <Link to='/' className='text-3xl ml-10 hover:underline font-bold text-sky-600'>Home</Link>
            <Link to='/watchlist' className="ml-10 text-3xl hover:underline font-bold text-sky-600 hover:cursor-pointer">WatchList</Link>
        </div>
        <div className='relative' ref={dropdownRef}>
          <input type='text' value={query} onChange={handleSearch} placeholder='Search Movies...' className='px-4 py-2 rounded-full text-black w-64 focus:outline-none' onFocus={() => query.length > 1 && setShowDropdown(true)} />
          {showDropdown && results.length > 0 && (
            <div className='absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto'>
              {results.map((movie) => (
                <div key={movie.id} className='flex items-center gap-4 px-4 py-2 hover:bg-blue-100 cursor-pointer' onClick={() => handleSelect(movie)}>
                  <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w92/${movie.poster_path}` : "https://via.placeholder.com/50x75?text=No+Image"} alt={movie.title} className='w-12 h-16 object-cover rounded'/>
                  <span className='font-medium'>{movie.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
    </nav>
  );
}

export default Navbar