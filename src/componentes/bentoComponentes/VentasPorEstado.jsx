import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { supabase } from '../../../supabase';

const VentasPorEstado = ({ }) => {
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const { data, error } = await supabase
                    .from('ventas')
                    .select('*, estado_venta (estado)');
    
                if (error) {
                    throw error;
                }
    
                const estadoVenta = data.map(({ estado_venta, ...resto }) => ({
                    ...resto,
                    estado: estado_venta.estado
                }));
                setVentas(estadoVenta);
            } catch (error) {
                console.error('Error trayendo las ventas:', error);
            }
        };
    
        fetchVentas();
    }, []);

    //Datos a mostrar en el grafico
    const estadosConteo = ventas.reduce((acc, venta) => {
        acc[venta.estado] = (acc[venta.estado] || 0) + 1;
        return acc;
    }, {});

    const nombresEstadosVenta = Object.keys(estadosConteo);
    const ventasPorEstado = Object.values(estadosConteo);

    //Grafico
const data = {
    labels: nombresEstadosVenta,
    datasets: [
        {
            label: 'Estados de Venta',
            data: ventasPorEstado,
            backgroundColor: [
                'rgba(200, 255, 64, 0.2)',   // Verde claro
                'rgba(54, 162, 235, 0.2)',   // Azul
                'rgba(255, 99, 132, 0.2)',   // Rojo claro
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
                'rgba(200, 255, 64, 1)',   // Verde claro
                'rgba(54, 162, 235, 1)',   // Azul
                'rgba(255, 99, 132, 1)',   // Rojo claro
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
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };


    return (

        <div className="bentoItem shadow-lg col-span-12 lg:col-span-4 flex flex-col lg:flex-row items-center justify-center relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <Link to="/ventas">
                {/* Título y subtítulo */}
                <div className="m-4 lg:mb-0 lg:mr-4">
                    <h2 className="pl-6 sm:pl-0 text-lg font-semibold">Ventas por estado</h2>
                    <p className="pl-6 sm:pl-0 text-sm text-gray-600 dark:text-gray-400">Consulta la cantidad de ventas según su estado</p>
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

export default VentasPorEstado;