import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ placeholder, table, columns, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para manejar la búsqueda
  const handleSearch = async (query) => {
    setLoading(true); // Indicar que se está cargando

    try {
      if (!query) {
        // Si no hay texto en la búsqueda, obtener todos los datos
        const { data, error } = await supabase.from(table).select("*");

        if (error) {
          console.error("Error mostrando todos los datos:", error);
        } else {
          onSearchResults(data); // Pasar todos los resultados
        }
      } else {
        // Realizar búsqueda con la consulta
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .or(columns.map(column => `${column}.ilike.%${query}%`).join(','));

        if (error) {
          console.error("Error mostrando resultados:", error);
        } else {
          onSearchResults(data); // Pasar resultados filtrados
        }
      }
    } catch (err) {
      console.error("Error ejecutando búsqueda:", err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para manejar la búsqueda cada vez que cambia searchQuery
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300); // Esperar 300ms antes de ejecutar la búsqueda

    return () => clearTimeout(debounceTimer); // Limpiar el temporizador si searchQuery cambia
  }, [searchQuery]);

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
        />
      </div>
    </div>
  );
};

export default SearchBar;



