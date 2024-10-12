import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

const Paginacion = ({ currentPage, setCurrentPage, totalItems, setTotalItems, itemsPerPage }) => {
  const [data, setData] = useState([]); // Estado para almacenar datos
  

  // Determinar número total de páginas
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Función para ir a la siguiente página
  const nextPage = () => {
    if (currentPage < totalPages) { // Si la página actual es menor que el total de páginas
      setCurrentPage(currentPage + 1); // Incrementar la página actual
    }
  };

  // Función para ir a la página anterior
  const prevPage = () => {
    if (currentPage > 1) { // Si la página actual es mayor que 1
      setCurrentPage(currentPage - 1); // Decrementar la página actual
    }
  };

  // Función para obtener los datos desde Supabase
  const fetchData = async (page) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    const { data, error, count } = await supabase
      .from('clientes')
      .select('*', { count: 'exact' }) // Solicitar los registros con un conteo exacto
      .range(start, end); // Solicitar los registros del rango actual

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(data); // Actualizar el estado con los datos obtenidos
      setTotalItems(count); // Actualizar el número total de elementos
    }
  };

  // Efecto para llamar a la función de fetchData cuando la página cambie
  useEffect(() => {
    fetchData(currentPage); // Llamar la función pasando la página actual
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

