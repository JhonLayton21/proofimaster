import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import ChartJSImage from 'chartjs-to-image';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement } from 'chart.js';

// Registrar las escalas y elementos de gráfico necesarios
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement);

let myChart;

const VisualizacionGraficas = ({ config }) => {
    const handleOpenInNewTab = async () => {
        try {
            // Crear la imagen del gráfico
            const chartImage = new ChartJSImage();
            chartImage.setConfig(config);
            const chartDataURL = chartImage.getUrl();

            // Abrir una nueva pestaña con la imagen del gráfico
            const newTab = window.open();
            newTab.document.write(`<img src="${chartDataURL}" alt="Gráfica Completa" style="width:80%; height:auto;" />`);
        } catch (error) {
            console.error('Error generando imagen de la gráfica:', error);
        }
    };

    const createChart = () => {
        const ctx = document.createElement('canvas');
        document.body.appendChild(ctx); // Agregar el canvas al DOM

        if (myChart) {
            myChart.destroy(); // Destruir el gráfico existente si hay uno
        }

        // Crear el nuevo gráfico
        myChart = new Chart(ctx, {
            type: config.type, // tipo de gráfico
            data: config.data, // datos del gráfico
            options: config.options // opciones del gráfico
        });

        return ctx; // Retorna el contexto del canvas
    };

    useEffect(() => {
        // Llamar a createChart para generar el gráfico al montar el componente
        const canvas = createChart();

        return () => {
            if (myChart) {
                myChart.destroy(); // Destruir el gráfico al desmontar el componente
            }
            document.body.removeChild(canvas); // Remover el canvas del DOM
        };
    }, [config]); // Dependencia en config para recrear el gráfico cuando cambie

    return (
        <FontAwesomeIcon 
            icon={faEye} 
            onClick={handleOpenInNewTab} 
            className="text-gray-500 hover:text-orange-500 transition-transform transform hover:scale-125 cursor-pointer" 
            title="Ver gráfica en tamaño completo" 
        />
    );
};

export default VisualizacionGraficas;




