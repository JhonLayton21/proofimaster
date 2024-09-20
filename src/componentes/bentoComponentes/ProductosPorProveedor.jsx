import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ProductosPorProveedor = ({ }) => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/productos')
            .then((response) => response.json())
            .then((data) => {
                setProductos(data);
            })
            .catch((error) => console.error('Error trayendo los productos:', error));
    }, []);

    //Datos a mostrar en el grafico
    const productosProveedorConteo = productos.reduce((acc, producto) => {
        acc[producto.proveedor] = (acc[producto.proveedor] || 0) + 1;
        return acc;
    }, {});

    const nombresProveedores = Object.keys(productosProveedorConteo);
    const ProductosPorProveedor = Object.values(productosProveedorConteo);

    //Grafico
    const data = {
        labels: nombresProveedores,
        datasets: [
            {
                label: 'Proveedores',
                data: ProductosPorProveedor,
                backgroundColor: 'rgba(255, 60, 130, 0.2)', // Color de las barras
                borderColor: 'rgba(255, 60, 130, 1)', // Color de los bordes
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
                    <h2 className="text-lg font-semibold">Productos por Proveedor</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Consulta los proveedores principales</p>
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

export default ProductosPorProveedor;