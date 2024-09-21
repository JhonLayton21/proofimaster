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
                    .select('*');
    
                if (error) {
                    throw error;
                }
    
                setVentas(data);
            } catch (error) {
                console.error('Error trayendo las ventas:', error);
            }
        };
    
        fetchVentas();
    }, []);

    //Datos a mostrar en el grafico
    const metodoEnvioConteo = ventas.reduce((acc, venta) => {
        acc[venta.metodo_envio] = (acc[venta.metodo_envio] || 0) + 1;
        return acc;
    }, {});

    const nombresMetodoEnvio = Object.keys(metodoEnvioConteo);
    const VentasPorMetodoEnvio = Object.values(metodoEnvioConteo);

    //Grafico
    const data = {
        labels: nombresMetodoEnvio,
        datasets: [
            {
                label: 'Métodos de Envio',
                data: VentasPorMetodoEnvio,
                backgroundColor: 'rgba(255, 0, 0, 0.2)', // Color de las barras
                borderColor: 'rgba(255, 0, 0, 1)', // Color de los bordes
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
            <Link to="/ventas">
                {/* Título y subtítulo */}
                <div className="mb-4 lg:mb-0 lg:mr-4">
                    <h2 className="text-lg font-semibold">Ventas por método de envio</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Consulta la cantidad de ventas según su método de envío</p>
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