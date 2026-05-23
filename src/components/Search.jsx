import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const Search = ({ 
  data = [],
  onSearchResults,
  searchFields = [],
  placeholder = "Cari...",
  className = "",
  debounceTime = 300,
  autoFocus = false,
  caseSensitive = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Ref untuk mencegah infinite loop
  const isInitialMount = useRef(true);
  const prevDataRef = useRef(data);

  // Fungsi pencarian dengan useCallback
  const performSearch = useCallback((term) => {
    if (!term.trim()) {
      onSearchResults(data);
      return;
    }

    const searchLower = caseSensitive ? term : term.toLowerCase();
    
    const filteredData = data.filter((item) => {
      return searchFields.some((field) => {
        const fieldValue = field.split('.').reduce((obj, key) => {
          return obj && obj[key] !== undefined ? obj[key] : null;
        }, item);
        
        if (!fieldValue) return false;
        
        const valueToSearch = caseSensitive 
          ? String(fieldValue) 
          : String(fieldValue).toLowerCase();
        
        return valueToSearch.includes(searchLower);
      });
    });

    onSearchResults(filteredData);
  }, [data, searchFields, onSearchResults, caseSensitive]);

  // Effect untuk pencarian saat searchTerm berubah
  useEffect(() => {
    // Skip pada mount awal
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      performSearch(searchTerm);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceTime, performSearch]);

  // Effect untuk reset saat data berubah (misal setelah sync)
  useEffect(() => {
    // Jika data berubah dan tidak ada pencarian aktif, reset hasil
    if (prevDataRef.current !== data && !searchTerm) {
      onSearchResults(data);
    }
    prevDataRef.current = data;
  }, [data, searchTerm, onSearchResults]);

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearchResults(data);
  };

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <FaSearch className="text-slate-400 text-sm md:text-base" />
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`
          w-full pl-10 pr-10 py-2.5 md:py-3
          bg-white/90 backdrop-blur-sm
          border-2 border-slate-200
          rounded-xl md:rounded-2xl
          font-['Fredoka',_'Comic_Sans_MS',_sans-serif]
          text-slate-700 placeholder:text-slate-400
          text-sm md:text-base
          transition-all duration-200
          focus:outline-none focus:border-blue-400 focus:bg-white
          hover:border-blue-300
          shadow-sm
        `}
      />

      {searchTerm && (
        <button
          onClick={handleClearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                     text-slate-400 hover:text-red-500 
                     transition-all duration-200
                     hover:scale-110 active:scale-95"
          aria-label="Clear search"
        >
          <FaTimes className="text-sm md:text-base" />
        </button>
      )}
    </div>
  );
};

export default Search;