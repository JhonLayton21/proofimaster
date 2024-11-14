import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { supabase } from '../../../supabase';

const GraficoTotalInventario = () => {
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

    // Calcular el valor total del inventario por producto
    const nombresProductos = productos.map((producto) => producto.nombre);
    const valorTotalInventario = productos.map(
        (producto) => producto.stock * producto.precio_compra
    );

    // Datos para el gráfico
    const data = {
        labels: nombresProductos,
        datasets: [
            {
                label: 'Valor total inventario (COP)',
                data: valorTotalInventario,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',   // Verde agua
                    'rgba(255, 159, 64, 0.2)',   // Naranja
                    'rgba(54, 162, 235, 0.2)',   // Azul
                    'rgba(153, 102, 255, 0.2)',  // Púrpura
                    'rgba(255, 206, 86, 0.2)',   // Amarillo
                    'rgba(231, 233, 237, 0.2)',  // Gris claro
                    'rgba(255, 99, 132, 0.2)',   // Rojo claro
                    'rgba(101, 204, 219, 0.2)',  // Turquesa
                    'rgba(181, 165, 213, 0.2)',  // Lavanda
                    'rgba(241, 148, 138, 0.2)'   // Salmón
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',   // Verde agua
                    'rgba(255, 159, 64, 1)',   // Naranja
                    'rgba(54, 162, 235, 1)',   // Azul
                    'rgba(153, 102, 255, 1)',  // Púrpura
                    'rgba(255, 206, 86, 1)',   // Amarillo
                    'rgba(231, 233, 237, 1)',  // Gris claro
                    'rgba(255, 99, 132, 1)',   // Rojo claro
                    'rgba(101, 204, 219, 1)',  // Turquesa
                    'rgba(181, 165, 213, 1)',  // Lavanda
                    'rgba(241, 148, 138, 1)'   // Salmón
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
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        // Formatear el eje Y en pesos colombianos (COP)
                        return `$${value.toLocaleString('es-CO')}`; // Formato con separadores de miles
                    },
                },
            },
        },
    };

    return (
        <div className="bentoItem shadow-lg col-span-12 lg:col-span-4 flex flex-col lg:flex-row items-center justify-center relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <Link to="/productos">
                {/* Título y subtítulo */}
                <div className="m-4 lg:mb-0 lg:mr-4">
                    <h2 className="pl-6 sm:pl-0 text-lg font-semibold">Total inventario por productos</h2>
                    <p className="pl-6 sm:pl-0 text-sm text-gray-600 dark:text-gray-400">Consulta el valor total en inventario por producto en COP</p>
                </div>
                {/* Gráfico de barras */}
                <div className="w-full h-64 md:h-80 lg:h-96 flex justify-center items-center">
                    <Bar data={data} options={options} />
                </div>
                {/* Icono de enlace */}
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>
    );
};

export default GraficoTotalInventario;
