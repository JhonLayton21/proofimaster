import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { supabase } from '../../../supabase';

const VentasPorMetodoEnvio = ({ }) => {
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const { data, error } = await supabase
                    .from('ventas')
                    .select('*, metodo_envio_venta (metodo)');
    
                if (error) {
                    throw error;
                }
    
                const metodoEnvio = data.map(({ metodo_envio_venta, ...resto }) => ({
                    ...resto,
                    metodo: metodo_envio_venta.metodo
                }));
                setVentas(metodoEnvio);
            } catch (error) {
                console.error('Error trayendo las ventas:', error);
            }
        };
    
        fetchVentas();
    }, []);

    //Datos a mostrar en el grafico
    const metodoEnvioConteo = ventas.reduce((acc, venta) => {
        acc[venta.metodo] = (acc[venta.metodo] || 0) + 1;
        return acc;
    }, {});

    const nombresMetodoEnvio = Object.keys(metodoEnvioConteo);
    const VentasPorMetodoEnvio = Object.values(metodoEnvioConteo);

    // Grafico
const data = {
    labels: nombresMetodoEnvio,
    datasets: [
        {
            label: 'Ventas',
            data: VentasPorMetodoEnvio,
            backgroundColor: [
                'rgba(255, 0, 0, 0.2)',    // Rojo
                'rgba(54, 162, 235, 0.2)',   // Azul claro
                'rgba(255, 206, 86, 0.2)',   // Amarillo
                'rgba(75, 192, 192, 0.2)',   // Verde agua
                'rgba(153, 102, 255, 0.2)',  // Púrpura
                'rgba(255, 159, 64, 0.2)',   // Naranja
                'rgba(201, 203, 207, 0.2)',  // Gris claro
                'rgba(123, 239, 178, 0.2)',  // Verde lima
                'rgba(255, 99, 132, 0.2)',   // Rojo claro
                'rgba(174, 214, 241, 0.2)',  // Azul cielo
                'rgba(181, 165, 213, 0.2)',  // Lavanda
                'rgba(244, 208, 63, 0.2)',   // Oro
                'rgba(255, 87, 34, 0.2)',    // Naranja oscuro
                'rgba(120, 144, 156, 0.2)',  // Gris azulado
                'rgba(41, 128, 185, 0.2)',   // Azul profundo
                'rgba(142, 68, 173, 0.2)'    // Morado oscuro
            ],
            borderColor: [
                'rgba(255, 0, 0, 1)',    // Rojo
                'rgba(54, 162, 235, 1)',   // Azul claro
                'rgba(255, 206, 86, 1)',   // Amarillo
                'rgba(75, 192, 192, 1)',   // Verde agua
                'rgba(153, 102, 255, 1)',  // Púrpura
                'rgba(255, 159, 64, 1)',   // Naranja
                'rgba(201, 203, 207, 1)',  // Gris claro
                'rgba(123, 239, 178, 1)',  // Verde lima
                'rgba(255, 99, 132, 1)',   // Rojo claro
                'rgba(174, 214, 241, 1)',  // Azul cielo
                'rgba(181, 165, 213, 1)',  // Lavanda
                'rgba(244, 208, 63, 1)',   // Oro
                'rgba(255, 87, 34, 1)',    // Naranja oscuro
                'rgba(120, 144, 156, 1)',  // Gris azulado
                'rgba(41, 128, 185, 1)',   // Azul profundo
                'rgba(142, 68, 173, 1)'    // Morado oscuro
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
                    <h2 className="pl-6 sm:pl-0 text-lg font-semibold">Ventas por método de envio</h2>
                    <p className="pl-6 sm:pl-0 text-sm text-gray-600 dark:text-gray-400">Consulta la cantidad de ventas según su método de envío</p>
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

export default VentasPorMetodoEnvio;