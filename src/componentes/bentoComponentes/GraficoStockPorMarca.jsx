import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { supabase } from '../../../supabase';

const GraficoStockPorMarca = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const { data, error } = await supabase
                    .from('productos')
                    .select('*, marcas_productos (nombre)');
    
                if (error) {
                    throw error;
                }
    
                const marcaProductos = data.map(({ marcas_productos, ...resto }) => ({
                    ...resto,
                    marca: marcas_productos.nombre
                }));
                setProductos(marcaProductos);
            } catch (error) {
                console.error('Error trayendo los productos:', error);
            }
        };
    
        fetchProductos();
    }, []);

    // Agrupar stock por marca
    const stockPorMarca = {};
    productos.forEach((producto) => {
        const marca = producto.marca; // Usamos directamente el campo "marca"
        if (!stockPorMarca[marca]) {
            stockPorMarca[marca] = 0;
        }
        stockPorMarca[marca] += producto.stock;
    });

    // Nombres de las marcas y el stock asociado
    const nombresMarcas = Object.keys(stockPorMarca);
    const stockPorMarcaData = Object.values(stockPorMarca);

    // Gráfico de torta
const data = {
    labels: nombresMarcas,
    datasets: [
        {
            label: 'Stock',
            data: stockPorMarcaData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',   // Rojo claro
                'rgba(54, 162, 235, 0.2)',   // Azul
                'rgba(255, 206, 86, 0.2)',   // Amarillo
                'rgba(75, 192, 192, 0.2)',   // Verde agua
                'rgba(153, 102, 255, 0.2)',  // Púrpura
                'rgba(255, 159, 64, 0.2)',   // Naranja
                'rgba(101, 204, 219, 0.2)',  // Turquesa
                'rgba(181, 165, 213, 0.2)',  // Lavanda
                'rgba(231, 233, 237, 0.2)',  // Gris claro
                'rgba(241, 148, 138, 0.2)',  // Salmón
                'rgba(174, 214, 241, 0.2)',  // Azul cielo
                'rgba(120, 144, 156, 0.2)',  // Gris azulado
                'rgba(244, 208, 63, 0.2)',   // Oro
                'rgba(123, 239, 178, 0.2)',  // Verde lima
                'rgba(255, 87, 34, 0.2)'     // Naranja oscuro
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',   // Rojo claro
                'rgba(54, 162, 235, 1)',   // Azul
                'rgba(255, 206, 86, 1)',   // Amarillo
                'rgba(75, 192, 192, 1)',   // Verde agua
                'rgba(153, 102, 255, 1)',  // Púrpura
                'rgba(255, 159, 64, 1)',   // Naranja
                'rgba(101, 204, 219, 1)',  // Turquesa
                'rgba(181, 165, 213, 1)',  // Lavanda
                'rgba(231, 233, 237, 1)',  // Gris claro
                'rgba(241, 148, 138, 1)',  // Salmón
                'rgba(174, 214, 241, 1)',  // Azul cielo
                'rgba(120, 144, 156, 1)',  // Gris azulado
                'rgba(244, 208, 63, 1)',   // Oro
                'rgba(123, 239, 178, 1)',  // Verde lima
                'rgba(255, 87, 34, 1)'     // Naranja oscuro
            ],
            borderWidth: 1,
        },
    ],
};


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div className="bentoItem shadow-lg col-span-12 lg:col-span-4 flex flex-col lg:flex-row items-center justify-center relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <Link to="/productos">
                {/* Título y subtítulo */}
                <div className="m-4 lg:mb-0 lg:mr-4">
                    <h2 className="pl-6 sm:pl-0 text-lg font-semibold">Stock por Marca</h2>
                    <p className="pl-6 sm:pl-0 text-sm text-gray-600 dark:text-gray-400">Consulta el stock de productos según su marca</p>
                </div>
                {/* Gráfico de torta */}
                <div className="w-full flex justify-center items-center">
                    <Pie data={data} options={options} />
                </div>
                {/* Icono de enlace */}
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>
    );
};

export default GraficoStockPorMarca;
