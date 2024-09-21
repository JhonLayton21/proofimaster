import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { supabase } from '../../../supabase';


const GraficoStock = ({ }) => {
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
    

    //Datos a mostrar en el grafico
    const nombresProductos = productos.map((producto) => producto.nombre);
    const stockProductos = productos.map((producto) => producto.stock);


    //Grafico
    const data = {
        labels: nombresProductos,
        datasets: [
            {
                label: 'Stock',
                data: stockProductos,
                backgroundColor: 'rgba(255, 159, 64, 0.2)', // Color de las barras
                borderColor: 'rgba(255, 159, 64, 1)', // Color de los bordes
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
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };


    return (
        <div className="bentoItem shadow-lg col-span-6 lg:col-span-4 flex flex-col lg:flex-row items-center justify-center relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <Link to="/productos">
                {/* Título y subtítulo */}
                <div className="mb-4 lg:mb-0 lg:mr-4">
                    <h2 className="text-lg font-semibold">Stock por producto</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Consulta la cantidad de stock de cada producto</p>
                </div>
                {/* Gráfico de barras */}
                <div className="w-full flex justify-center items-center">
                    <Bar data={data} options={options} />
                </div>
                {/* Icono de enlace */}
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>
    );
};

export default GraficoStock;