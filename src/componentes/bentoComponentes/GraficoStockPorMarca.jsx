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
                    .select('*');
    
                if (error) {
                    throw error;
                }
    
                setProductos(data);
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
                label: 'Stock por marca',
                data: stockPorMarcaData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
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
        <div className="bentoItem shadow-lg col-span-6 lg:col-span-4 flex flex-col lg:flex-row items-center justify-center relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <Link to="/productos">
                {/* Título y subtítulo */}
                <div className="mb-4 lg:mb-0 lg:mr-4">
                    <h2 className="text-lg font-semibold">Stock por Marca</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Consulta el stock de productos por cada marca</p>
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
