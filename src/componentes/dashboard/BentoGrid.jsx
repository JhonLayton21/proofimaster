import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
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
        const db = getFirestore();

        // Referencias
        const productosRef = collection(db, 'productos');
        const proveedoresRef = collection(db, 'proveedores');
        const clientesRef = collection(db, 'clientes');
        const ventasRef = collection(db, 'ventas');

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
                totalValorStock += precioCompra;
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
            setDisplayedStockValue(start.toFixed(3));
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
            setDisplayedTotalVentas(start.toFixed(3));
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


    return (
        <MenuPrincipal correoUsuario={correoUsuario} titulo={"MENÚ PRINCIPAL"} subtitulo={"Ingresa rápidamente al contenido en Proofimaster"}>
            <div className="grid grid-cols-12 grid-rows-6 gap-2 mt-8 px-2 md:px-0">

                <DatosPrincipales displayedCantidadVentas={displayedCantidadVentas} displayedTotalVentas={displayedTotalVentas}  displayedStockValue={displayedStockValue} displayedTotal={displayedTotal} />

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






