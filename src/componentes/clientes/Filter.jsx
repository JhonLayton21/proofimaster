import React, { useState } from 'react';
import { supabase } from '../../../supabase';

const Filter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tiposClientes, setTiposClientes] = useState([]);

    // Obtener tabla tipo_clientes
    const fetchTipoClientes = async () => {
        try {
            const { data, error } = await supabase
                .from('tipo_clientes')
                .select('*');

            if (error) {
                throw error;
            }
            setTiposClientes(data);
        } catch (error) {
            console.error('Error al obtener los tipos de cliente:', error);
        }
    };

    fetchTipoClientes();

    // lógica apertura dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button 
                id="dropdownBgHoverButton" 
                onClick={toggleDropdown} 
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
                type="button"
            >
                Filtrar por tipo de cliente
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l4 4 4-4" />
                </svg>
            </button>

            {/* Agregamos la lógica de visibilidad */}
            <div id="dropdownBgHover" className={`z-10 ${isOpen ? 'block' : 'hidden'} w-48 bg-white rounded-lg shadow dark:bg-gray-700`}>
                <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownBgHoverButton">
                    {tiposClientes.map(tipos => ( 
                    <li key={tipos.id}>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <input id={tipos.id} type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                            <label htmlFor={tipos.id} className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{tipos.tipo}</label>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Filter;
