import React, { useState } from "react";
import { supabase } from "../../supabase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTimes } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ placeholder, table, columns, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para manejar la búsqueda
  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .or(columns.map(column => `${column}.ilike.%${searchQuery}%`).join(','))

      if (error) {
        console.error("Error mostrando resultados:", error);
      } else {
        onSearchResults(data); // Pasar resultados filtrados
      }
    } catch (err) {
      console.error("Error ejecutando búsqueda:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-orange-500 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
          placeholder={placeholder || "Buscando..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-900 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>
    </div>

  );
};

export default SearchBar;

