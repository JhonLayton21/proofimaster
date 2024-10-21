import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

const Paginacion = ({
  currentPage, 
  setCurrentPage, 
  totalItems, 
  setTotalItems, 
  itemsPerPage, 
  tableName,      // Nueva prop para la tabla
  columns = '*',  // Nueva prop para las columnas a seleccionar
  processData = (data) => data // Nueva prop para procesar los datos antes de mostrarlos
}) => {
  const [data, setData] = useState([]); // Estado para almacenar los datos
  const [nextPageData, setNextPageData] = useState(null); // Estado para almacenar los datos de la siguiente página
  const [loading, setLoading] = useState(false); // Estado de carga

  // Determinar número total de páginas
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Función para ir a la siguiente página
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      if (nextPageData) {
        setData(nextPageData); // Si los datos de la siguiente página ya están cargados, los usamos
      }
    }
  };

  // Función para ir a la página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para obtener los datos desde Supabase
  const fetchData = async (page) => {
    setLoading(true); // Iniciar estado de carga
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    const { data, error, count } = await supabase
      .from(tableName)   // Usar la tabla pasada como prop
      .select(columns, { count: 'exact' }) // Usar las columnas pasadas como prop
      .range(start, end); // Solicitar los registros del rango actual

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(processData(data)); // Procesar los datos con la función pasada como prop
      setTotalItems(count); // Actualizar el número total de elementos
    }
    setLoading(false); // Finalizar estado de carga
  };

  // Función para prefetch de la siguiente página
  const prefetchNextPage = async (page) => {
    if (page < totalPages) {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage - 1;

      const { data, error } = await supabase
        .from(tableName)
        .select(columns)
        .range(start, end);

      if (error) {
        console.error('Error fetching next page data:', error);
      } else {
        setNextPageData(data);
      }
    }
  };

  // Efecto para llamar a la función de fetchData y prefetchNextPage cuando la página cambie
  useEffect(() => {
    fetchData(currentPage);
    prefetchNextPage(currentPage);
  }, [currentPage]);

  // Calcular los elementos que se están mostrando en la página actual
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div>
      <div className="flex flex-col items-center p-1">
        {loading ? (
          <div>Cargando...</div> // Mostrar loader mientras se cargan los datos
        ) : (
          <>
            {/* Texto de ayuda visual */}
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Mostrando <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> a <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> de <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> entradas
            </span>
            {/* Botones de paginación */}
            <div className="inline-flex mt-2 xs:mt-0">
              <button onClick={prevPage} disabled={currentPage === 1} className="flex items-center justify-center px-3 m-2 h-8 text-sm font-medium bg-orange-500 text-white hover:border-white">
                Anterior
              </button>
              <button onClick={nextPage} disabled={currentPage === totalPages} className="flex items-center justify-center px-3 m-2 h-8 text-sm font-medium bg-orange-500 text-white hover:border-white">
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Paginacion;



