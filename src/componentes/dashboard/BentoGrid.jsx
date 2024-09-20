import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import MenuPrincipal from "../MenuPrincipal";
import ProductosDestacados from "../bentoComponentes/ProductosDestacados";
import DatosProductos from "../bentoComponentes/DatosProductos";
import DatosVentas from "../bentoComponentes/DatosVentas";
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

    useEffect(() => {
        const db = getFirestore();

        // Referencias
        const productosRef = collection(db, 'productos');
        const proveedoresRef = collection(db, 'proveedores');
        const clientesRef = collection(db, 'clientes');
        const ventasRef = collection(db, 'ventas');

        // Consulta para productos con alertas
        const productosQuery = query(productosRef);
        const unsubscribeProductos = onSnapshot(productosQuery, (querySnapshot) => {
            const productos = [];
            let totalStock = 0; // Variable para acumular el stock total
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const stock = Number(data.stock);
                totalStock += stock; // Sumar el stock al total
                const nivelMinimoStock = Number(data.nivelMinimoStock);
                if (stock < nivelMinimoStock) {
                    productos.push({ id: doc.id, ...data });
                }
            });
            setProductosConAlertas(productos); // Actualizar el estado con los productos con alertas
            setTotalProductos(totalStock); // Actualizar el estado con el stock total
        });

        // Consulta para proveedores
        const proveedoresQuery = query(proveedoresRef);
        const unsubscribeProveedores = onSnapshot(proveedoresQuery, (querySnapshot) => {
            const proveedoresList = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                proveedoresList.push({ id: doc.id, ...data });
            });
            setProveedores(proveedoresList);
        });

        // Consulta para clientes
        const clientesQuery = query(clientesRef);
        const unsubscribeClientes = onSnapshot(clientesQuery, (querySnapshot) => {
            const clientesList = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                clientesList.push({ id: doc.id, ...data });
            });
            setClientes(clientesList);
        });

        // Consulta para los últimos 3 productos agregados
        const productosPrincipalesQuery = query(productosRef, orderBy("fechaEntradaProducto", "desc"), limit(4));
        const unsubscribeProductosPrincipales = onSnapshot(productosPrincipalesQuery, (querySnapshot) => {
            const productos = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                productos.push({ id: doc.id, ...data });
            });
            setProductosPrincipales(productos);
        });

        // Consulta total ventas y cantidad ventas
        const ventasQuery = query(ventasRef);
        const unsubscribeVentas = onSnapshot(ventasQuery, (querySnapshot) => {
            let total = 0;
            let count = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                total += Number(data.total);
                count += 1;
            });
            setTotalVentas(total);
            setCantidadVentas(count);
        });

        // Consulta para la suma de todos los precios de compra de los productos
        const valorStockQuery = query(productosRef);
        const unsubscribeValorStock = onSnapshot(valorStockQuery, (querySnapshot) => {
            let totalValorStock = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const precioCompra = Number(data.precioCompraProducto);
                totalValorStock += precioCompra; // Solo sumar el precioCompraProducto
            });
            setValorStock(totalValorStock);
        });



        return () => {
            unsubscribeValorStock();
            unsubscribeProductos();
            unsubscribeProveedores();
            unsubscribeClientes();
            unsubscribeProductosPrincipales();
            unsubscribeVentas();
        };
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

                <ProductosDestacados productosPrincipales={productosPrincipales} />

                <DatosProductos displayedStockValue={displayedStockValue} displayedTotal={displayedTotal} />

                <DatosVentas displayedCantidadVentas={displayedCantidadVentas} displayedTotalVentas={displayedTotalVentas} />

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

                <Informes />

                <Clientes clientes={clientes} />

                <Usuarios />

                <Documentacion />

                <Configuracion />
            </div>
        </MenuPrincipal>
    );
}

export default BentoGrid;






