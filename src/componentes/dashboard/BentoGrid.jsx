import React, { useEffect, useState } from "react";
import MenuPrincipal from "../MenuPrincipal";
import ProductosDestacados from "../bentoComponentes/ProductosDestacados";
import DatosPrincipales from "../bentoComponentes/DatosPrincipales";
import AlertasStock from "../bentoComponentes/AlertasStock";
import Proveedores from "../bentoComponentes/Proveedores";
import Informes from "../bentoComponentes/Informes";
import Clientes from "../bentoComponentes/Clientes";
import Usuarios from "../bentoComponentes/Usuarios";
import Documentacion from "../bentoComponentes/Documentacion";
import Configuracion from "../bentoComponentes/Configuracion";
import GraficoStock from "../bentoComponentes/GraficoStock";
import GraficoTotalInventario from "../bentoComponentes/GraficoTotalInventario";
import GraficoStockPorMarca from "../bentoComponentes/GraficoStockPorMarca";
import VentasPorEstado from "../bentoComponentes/VentasPorEstado";
import VentasPorMetodoPago from "../bentoComponentes/VentasPorMetodoPago";
import VentasPorMetodoEnvio from "../bentoComponentes/VentasPorMetodoEnvio";
import VentasPorCliente from "../bentoComponentes/VentasPorCliente";
import ProductosPorProveedor from "../bentoComponentes/ProductosPorProveedor";
import VentasPorFecha from "../bentoComponentes/VentasPorFecha";
import { supabase } from '../../../supabase';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const BentoGrid = ({ correoUsuario }) => {
    const [productosConAlertas, setProductosConAlertas] = useState([]);
    const [productosPrincipales, setProductosPrincipales] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [totalProductos, setTotalProductos] = useState(0);
    const [displayedTotal, setDisplayedTotal] = useState(0);
    const [isAnimatingTotal, setIsAnimatingTotal] = useState(false);
    const [totalVentas, setTotalVentas] = useState(0);
    const [displayedTotalVentas, setDisplayedTotalVentas] = useState(0);
    const [isAnimatingTotalVentas, setIsAnimatingTotalVentas] = useState(false);
    const [valorStock, setValorStock] = useState(0);
    const [displayedStockValue, setDisplayedStockValue] = useState(0);
    const [isAnimatingStock, setIsAnimatingStock] = useState(false);
    const [cantidadVentas, setCantidadVentas] = useState(0);
    const [displayedCantidadVentas, setDisplayedCantidadVentas] = useState(0);
    const [isAnimatingCantidadVentas, setIsAnimatingCantidadVentas] = useState(false);
    const [usuariosActivos, setUsuariosActivos] = useState([]);

    useEffect(() => {

        // Consulta para productos con alertas
        const fetchProductosStock = async () => {
            const { data, error } = await supabase
                .from('productos')
                .select('*');

            if (error) {
                console.error("Error mostrando productos");
                return;
            }

            let totalStock = 0;
            const productos = [];

            data.forEach(producto => {
                const stock = Number(producto.stock);
                totalStock += stock;

                const nivelMinimoStock = Number(producto.nivel_minimo_stock);
                if (stock < nivelMinimoStock) {
                    productos.push(producto);
                }
            });

            setProductosConAlertas(productos);
            setTotalProductos(totalStock);
        };

        fetchProductosStock();

        // Consulta para proveedores
        const fetchProveedores = async () => {
            const { data, error } = await supabase
                .from('proveedores')
                .select('*')
                .limit(3);

            if (error) {
                console.error("Error mostrando proveedores");
            } else {
                setProveedores(data);
            }
        };

        fetchProveedores();

        // Consulta para clientes
        const fetchClientes = async () => {
            const { data, error } = await supabase
                .from('clientes')
                .select('*')
                .limit(3);

            if (error) {
                console.error("Error mostrando clientes");
            } else {
                setClientes(data);
            }
        };

        fetchClientes();

        // Consulta para los últimos productos agregados
        const fetchProductos = async () => {
            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .order('fecha_entrada', { ascending: false })
                .limit(3);

            if (error) {
                console.error("Error mostrando productos");
            } else {
                setProductosPrincipales(data);
            }
        };

        fetchProductos();

        // Consulta total ventas y cantidad ventas
        const fetchDatosVentas = async () => {
            const { data, error } = await supabase
                .from('ventas')
                .select('*');
            if (error) {
                console.error("Error mostrando ventas");
                return;
            }

            let total = 0;
            let count = 0;

            data.forEach(venta => {
                total += Number(venta.total);
                count += 1;
            });

            setTotalVentas(total);
            setCantidadVentas(count);
        };

        fetchDatosVentas();

        // Consulta para la suma de todos los precios de compra de los productos
        const fetchDatosProductos = async () => {
            const { data, error } = await supabase
                .from('productos')
                .select('*');

            if (error) {
                console.error("Error mostrando productos");
                return;
            }

            let totalValorStock = 0;

            data.forEach(producto => {
                const precioCompra = Number(producto.precio_compra);
                const cantidad = Number(producto.stock);
                totalValorStock += precioCompra * cantidad;
            });

            setValorStock(totalValorStock);
        };

        fetchDatosProductos();
    }, []);

    useEffect(() => {
        if (totalProductos > 0 && !isAnimatingTotal) {
            setIsAnimatingTotal(true);
        }
    }, [totalProductos]);

    useEffect(() => {
        if (!isAnimatingTotal) return;

        let start = 0;
        const end = totalProductos;
        const duration = 1000; // Duración en milisegundos (1 segundo)
        const stepTime = 100; // Intervalo entre actualizaciones en milisegundos (100 ms)
        const steps = Math.ceil(duration / stepTime);
        const stepValue = end / steps;

        const timer = setInterval(() => {
            start += stepValue;
            if (start >= end) {
                clearInterval(timer);
                start = end;
                setIsAnimatingTotal(false); // Termina la animación
            }
            setDisplayedTotal(Math.floor(start));
        }, stepTime);

        return () => clearInterval(timer);
    }, [isAnimatingTotal, totalProductos]);

    // Animación para Valor Stock
    useEffect(() => {
        if (valorStock > 0 && !isAnimatingStock) {
            setIsAnimatingStock(true);
        }
    }, [valorStock]);

    useEffect(() => {
        if (!isAnimatingStock) return;

        let start = 0;
        const end = valorStock;
        const duration = 1000; // Duración en milisegundos (1 segundo)
        const stepTime = 100; // Intervalo entre actualizaciones en milisegundos (100 ms)
        const steps = Math.ceil(duration / stepTime);
        const stepValue = end / steps;

        const timer = setInterval(() => {
            start += stepValue;
            if (start >= end) {
                clearInterval(timer);
                start = end;
                setIsAnimatingStock(false); // Termina la animación
            }

            // Formatear el valor para que tenga separadores de miles y 3 decimales
            const formattedValue = start.toLocaleString('es-ES', {
                minimumFractionDigits: 0, // Muestra 3 decimales
                maximumFractionDigits: 0
            });

            setDisplayedStockValue(formattedValue);
        }, stepTime);


        return () => clearInterval(timer);
    }, [isAnimatingStock, valorStock]);

    useEffect(() => {
        if (cantidadVentas > 0 && !isAnimatingCantidadVentas) {
            setIsAnimatingCantidadVentas(true);
        }
    }, [cantidadVentas]);

    useEffect(() => {
        if (totalVentas > 0 && !isAnimatingTotalVentas) {
            setIsAnimatingTotalVentas(true);
        }
    }, [totalVentas]);

    useEffect(() => {
        if (!isAnimatingTotalVentas) return;

        let start = 0;
        const end = totalVentas;
        const duration = 1000; // Duración en milisegundos (1 segundo)
        const stepTime = 100; // Intervalo entre actualizaciones en milisegundos (100 ms)
        const steps = Math.ceil(duration / stepTime);
        const stepValue = end / steps;

        const timer = setInterval(() => {
            start += stepValue;
            if (start >= end) {
                clearInterval(timer);
                start = end;
                setIsAnimatingTotalVentas(false); // Termina la animación
            }

            // Formatear el valor para que tenga separadores de miles y 3 decimales
            const formattedValue = start.toLocaleString('es-ES', {
                minimumFractionDigits: 0, // Muestra 3 decimales
                maximumFractionDigits: 0
            });

            setDisplayedTotalVentas(formattedValue);
        }, stepTime);

        return () => clearInterval(timer);
    }, [isAnimatingTotalVentas, totalVentas]);

    useEffect(() => {
        if (!isAnimatingCantidadVentas) return;

        let start = 0;
        const end = cantidadVentas;
        const duration = 1000; // Duración en milisegundos (1 segundo)
        const stepTime = 100; // Intervalo entre actualizaciones en milisegundos (100 ms)
        const steps = Math.ceil(duration / stepTime);
        const stepValue = end / steps;

        const timer = setInterval(() => {
            start += stepValue;
            if (start >= end) {
                clearInterval(timer);
                start = end;
                setIsAnimatingCantidadVentas(false); // Termina la animación
            }
            setDisplayedCantidadVentas(Math.floor(start));
        }, stepTime);

        return () => clearInterval(timer);
    }, [isAnimatingCantidadVentas, cantidadVentas]);

    const generatePDF = async () => {
        const pdf = new jsPDF("p", "pt", "a4", true);
        const elementosGraficos = document.querySelectorAll('.grafico'); // Clase para identificar los gráficos

        for (let i = 0; i < elementosGraficos.length; i++) {
            const grafico = elementosGraficos[i];

            // Capturar el elemento como una imagen
            const canvas = await html2canvas(grafico);
            const imgData = canvas.toDataURL('image/png');

            // Añadir la imagen al PDF
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            if (i > 0) {
                pdf.addPage();
            }

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        // Generar el nombre del archivo
        const nombreArchivo = `InformeGráficas_${new Date().toISOString().slice(0, 10)}_${new Date().toLocaleTimeString().replace(/:/g, '-')}.pdf`;

        pdf.save(nombreArchivo);
    };



    return (
        <MenuPrincipal correoUsuario={correoUsuario} titulo={"MENÚ PRINCIPAL"} subtitulo={"Ingresa rápidamente al contenido en Proofimaster"}>
            <div className="flex flex-col justify-end items-end space-y-2">
                <button
                    onClick={generatePDF}
                    className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-white hover:text-orange-500 group transition duration-300 ease-in-out">
                    <FontAwesomeIcon
                        icon={faSquarePollVertical}
                        className="text-white group-hover:text-orange-500 mx-2 transition duration-300 ease-in-out" />
                    Generar informe gráficas
                </button>

                <Link
                    to="/historial"
                    className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-white hover:text-orange-500 group transition duration-300 ease-in-out">
                    <FontAwesomeIcon
                        icon={faClockRotateLeft}
                        className="text-white group-hover:text-orange-500 mx-2 transition duration-300 ease-in-out" />
                    Visualizar historial modificaciones
                </Link>
            </div>

            <div className="grid grid-cols-12 grid-rows-6 gap-2 mt-8 px-2 md:px-0 grafico">
                <DatosPrincipales displayedCantidadVentas={displayedCantidadVentas} displayedTotalVentas={displayedTotalVentas} displayedStockValue={displayedStockValue} displayedTotal={displayedTotal} />
                <ProductosDestacados productosPrincipales={productosPrincipales} />
                <AlertasStock productosConAlertas={productosConAlertas} />
                <GraficoStock />
                <GraficoTotalInventario />
                <GraficoStockPorMarca />
                <VentasPorEstado />
                <VentasPorMetodoPago />
                <VentasPorMetodoEnvio />
                <VentasPorCliente />
                <ProductosPorProveedor />
                <VentasPorFecha />
                <Proveedores proveedores={proveedores} />
                <Clientes clientes={clientes} />
                <Documentacion />
                <Configuracion />
            </div>
        </MenuPrincipal>
    );

}

export default BentoGrid;






