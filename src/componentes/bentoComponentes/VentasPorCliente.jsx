import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const VentasPorCliente = ({ }) => {
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/ventas')
            .then((response) => response.json())
            .then((data) => {
                setVentas(data);
            })
            .catch((error) => console.error('Error trayendo las ventas:', error));
    }, []);

    //Datos a mostrar en el grafico
    const ventasClienteConteo = ventas.reduce((acc, venta) => {
        acc[venta.cliente] = (acc[venta.cliente] || 0) + 1;
        return acc;
    }, {});

    const nombresClientes = Object.keys(ventasClienteConteo);
    const VentasPorCliente = Object.values(ventasClienteConteo);

    //Grafico
    const data = {
        labels: nombresClientes,
        datasets: [
            {
                label: 'Clientes',
                data: VentasPorCliente,
                backgroundColor: 'rgba(255, 0, 255, 0.2)', // Color de las barras
                borderColor: 'rgba(255, 0, 255, 1)', // Color de los bordes
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
                    <h2 className="text-lg font-semibold">Ventas por cliente</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Consulta las ventas según el cliente</p>
                </div>
                {/* Gráfico de barras */}
                <div className="w-full flex justify-center items-center">
                    <Pie data={data} options={options} />
                </div>
                {/* Icono de enlace */}
                <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
            </Link>
        </div>
    );
};

export default VentasPorCliente;