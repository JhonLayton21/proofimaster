import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

const Paginacion = ({ currentPage, setCurrentPage, totalItems, setTotalItems, itemsPerPage }) => {
  const [data, setData] = useState([]); // Estado para almacenar los datos
  const [nextPageData, setNextPageData] = useState(null); // Estado para almacenar los datos de la siguiente página

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
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    const { data, error, count } = await supabase
      .from('clientes')
      .select('*', { count: 'exact' })
      .range(start, end); // Solicitar los registros del rango actual

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(data); // Actualizar el estado con los datos obtenidos
      setTotalItems(count); // Actualizar el número total de elementos
    }
  };

  // Función para prefetch de la siguiente página
  const prefetchNextPage = async (page) => {
    if (page < totalPages) { // Si no estamos en la última página
      const start = page * itemsPerPage;
      const end = start + itemsPerPage - 1;

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .range(start, end); // Obtener datos de la siguiente página

      if (error) {
        console.error('Error fetching next page data:', error);
      } else {
        setNextPageData(data); // Guardar los datos de la siguiente página
      }
    }
  };

  // Efecto para llamar a la función de fetchData y prefetchNextPage cuando la página cambie
  useEffect(() => {
    fetchData(currentPage); // Llamar a la función pasando la página actual
    prefetchNextPage(currentPage); // Prefetch de la siguiente página
  }, [currentPage]);

  // Calcular los elementos que se están mostrando en la página actual
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div>
      <div className="flex flex-col items-center p-1">
        {/* Texto de ayuda visual */}
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Mostrando <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> a <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> de <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> entradas
        </span>
        {/* Botones de paginación */}
        <div className="inline-flex mt-2 xs:mt-0">
          <button onClick={prevPage} disabled={currentPage === 1} className="flex items-center justify-center px-3 m-2 h-8 text-sm font-medium bg-orange-500 ">
            Anterior
          </button>
          <button onClick={nextPage} disabled={currentPage === totalPages} className="flex items-center justify-center px-3 m-2 h-8 text-sm font-medium bg-orange-500 ">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default Paginacion;


