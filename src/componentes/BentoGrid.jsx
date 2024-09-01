import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { faFileLines, faArrowRight, faCog, faCircleUser, faAddressBook, faTruckFast, faDollarSign, faShoppingCart, faFileAlt, faWarning, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuPrincipal from "./MenuPrincipal";
import { Link, useLocation } from "react-router-dom";

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
            {/* DIV PADRE */}
            <div className="grid grid-cols-12 grid-rows-6 gap-2 mt-8 px-2 md:px-0">

                {/* PRODUCTOS DESTACADOS */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4 alerta-stock">
                    {/* Contenedor flexible para los dos divs */}
                    <div className="flex flex-col h-full">
                        {/* Div superior */}
                        <div className="bg-[#ff6f00] text-white p-4 flex items-center justify-center rounded-lg h-1/2">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faStar} className="ml-4 fa-2x" />
                                <h2 className="mx-4 md:text-4xl text-xl font-bold">Productos destacados</h2>
                            </div>
                        </div>
                        {/* Div inferior */}
                        <div className="p-2 h-1/2 overflow-auto">
                            <ol className="list-decimal list-inside mb-4">
                                {productosPrincipales.length === 0 ? (
                                    <li>No hay productos recientes</li>
                                ) : (
                                    productosPrincipales.map((producto) => (
                                        <li key={producto.id} className="py-3">
                                            {producto.nombreProducto}
                                        </li>
                                    ))
                                )}
                            </ol>
                        </div>
                    </div>
                    <Link to="/productos">
                        <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                    </Link>
                </div>


                {/* DATOS DE PRODUCTOS */}
                <div className="bentoItem col-span-6 lg:col-span-2 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4 alerta-stock">
                    <h2 className="text-lg font-bold mb-6">Datos de productos</h2>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="col-span-2 border border-gray-400 p-2 rounded-lg mb-4">
                            <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                                <FontAwesomeIcon icon={faDollarSign} /> Valor stock
                            </h3>
                            <p className="text-4xl lg:text-2xl font-bold text-orange-500 text-right">
                                {displayedStockValue}cop
                            </p>
                        </div>
                        <div className="col-span-2 border border-gray-400 p-2 rounded-lg">
                            <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                                <FontAwesomeIcon icon={faShoppingCart} /> Total de productos
                            </h3>
                            <p className="text-4xl font-bold text-orange-500 text-right">
                                {displayedTotal}
                            </p>
                        </div>
                    </div>
                    <Link to="/productos">
                        <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                    </Link>
                </div>


                {/* DATOS DE VENTAS */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4 alerta-stock">
                    <h2 className="text-lg font-bold mb-6">Datos de ventas</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2 border border-gray-400 p-2 rounded-lg mb-2">
                            <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                                <FontAwesomeIcon icon={faDollarSign} /> Total generado
                            </h3>
                            <p className="text-4xl font-bold text-orange-500 text-right">{displayedTotalVentas} cop</p>
                        </div>
                        <div className="col-span-2 border border-gray-400 p-2 rounded-lg">
                            <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                                <FontAwesomeIcon icon={faShoppingCart} /> Total de ventas
                            </h3>
                            <p className="text-4xl font-bold text-orange-500 text-right">{displayedCantidadVentas}</p>
                        </div>
                    </div>
                    <Link to="/ventas">
                        <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                    </Link>
                </div>

                {/* ALERTAS STOCK */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4 alerta-stock">
                    {/* Contenedor flexible para los dos divs */}
                    <div className="flex flex-col h-full">
                        {/* Div superior */}
                        <div className="bg-red-600 text-white p-4 flex items-center justify-center rounded-lg h-1/2">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faWarning} className="mr-2 fa-3x" />
                                <h2 className="mx-4 md:text-4xl text-xl font-bold">Alertas de stock</h2>
                            </div>
                        </div>
                        {/* Div inferior */}
                        <div className="p-2 h-1/2 overflow-auto">
                            <ul className="list-disc list-inside">
                                {productosConAlertas.length === 0 ? (
                                    <li>No hay alertas de stock</li>
                                ) : (
                                    productosConAlertas.map((producto) => (
                                        <li key={producto.id} className="text-red-500">
                                            {producto.nombreProducto} (Stock: {producto.stock}, Mínimo: {producto.nivelMinimoStock})
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                    <Link to="/productos">
                        <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                    </Link>
                </div>


                {/* PROVEEDORES */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4 flex flex-col items-center justify-center alerta-stock">
                    <h2 className="text-lg font-bold mb-2">Proveedores</h2>
                    {proveedores.length === 0 ? (
                        <p className="text-sm text-gray-500">No hay proveedores disponibles</p>
                    ) : (
                        proveedores.map((proveedor) => (
                            <div key={proveedor.id} className="flex items-center gap-3 px-4 py-2 border-b border-gray-300 w-full">
                                <div className="relative flex items-center justify-center aspect-square w-10 rounded-full">
                                    <FontAwesomeIcon icon={faTruckFast} className="text-slate-800 dark:text-slate-50 fa-xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{proveedor.nombreProveedor}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <Link to="/proveedores">
                        <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                    </Link>
                </div>


                {/* INFORMES */}
                <div className="bentoItem col-span-6 lg:col-span-6 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4 alerta-stock">
                    <h2 className="text-lg font-bold">Informes generados</h2>
                    <div className="flex justify-center items-center h-full pb-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Documentos visibles por defecto */}
                            <div className="flex flex-col items-center">
                                <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                                <span>Documento 1</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                                <span>Documento 2</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                                <span>Documento 3</span>
                            </div>
                            {/* Documentos adicionales ocultos por defecto */}
                            <div className="hidden sm:flex flex-col items-center">
                                <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                                <span>Documento 4</span>
                            </div>
                            <div className="hidden sm:flex flex-col items-center">
                                <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                                <span>Documento 5</span>
                            </div>
                            <div className="hidden sm:flex flex-col items-center">
                                <FontAwesomeIcon icon={faFileAlt} className="fa-2x mb-2" />
                                <span>Documento 6</span>
                            </div>
                        </div>
                    </div>
                    <Link to="/informes">
                        <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                    </Link>
                </div>

                {/* CLIENTES ACTIVOS */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4 flex flex-col items-center justify-center min-h-[400px] alerta-stock">
                    <h2 className="text-lg font-bold mb-2">Clientes activos</h2>
                    {clientes.length === 0 ? (
                        <p className="text-sm text-gray-500">No hay clientes disponibles</p>
                    ) : (
                        clientes.map((cliente) => (
                            <div key={cliente.id} className="flex items-center gap-3 px-4 py-2 border-b border-gray-300 w-full">
                                <div className="relative aspect-square w-10 rounded-full">
                                    <FontAwesomeIcon icon={faAddressBook} className="text-slate-800 dark:text-slate-50 fa-xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{cliente.nombreCliente}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <Link to="/clientes">
                        <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                    </Link>
                </div>


                {/* USUARIOS ACTIVOS */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4 alerta-stock">
                    <h2 className="text-lg font-">Usuarios activos</h2>
                    <div className="flex flex-col justify-center h-full">
                        <div className="flex items-center gap-3 py-3 border-b border-gray-300">
                            <div className="relative aspect-square w-10 rounded-full">
                                <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                                <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-dark"></span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">John Layton</p>
                                <p className="text-sm text-body-color text-[#757575] dark:text-dark-6 hidden md:block">johnlayton@outlook.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 py-3 border-b border-gray-300">
                            <div className="relative aspect-square w-10 rounded-full">
                                <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                                <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-dark"></span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">Jane Doe</p>
                                <p className="text-sm text-body-color text-[#757575] hidden md:block">janedoe@gmail.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 py-3">
                            <div className="relative aspect-square w-10 rounded-full">
                                <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                                <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-dark"></span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">Michael Smith</p>
                                <p className="text-sm text-body-color text-[#757575] hidden md:block">michaelsmith@yahoo.com</p>
                            </div>
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                </div>

                {/* DOCUMENTACIÓN */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2 flex items-center justify-center relative rounded-lg overflow-hidden border p-4 alerta-stock">
                    <FontAwesomeIcon icon={faFileLines} className="text-slate-800 dark:text-slate-50 fa-3x mr-4 mt-4" />
                    <div>
                        <h2 className="text-lg font-semibold">Documentación</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Consulta todas las funcionalidades de Proofimaster</p>
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                </div>

                {/* CONFIGURACIÓN */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2 flex items-center justify-center relative rounded-lg overflow-hidden border p-4 alerta-stock">
                    <FontAwesomeIcon icon={faCog} className="text-slate-800 dark:text-slate-50 fa-3x mr-4 mt-4" />
                    <div>
                        <h2 className="text-lg font-semibold">Configuración cuenta</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Ajusta las configuraciones de tu cuenta</p>
                    </div>
                    <Link to="/configuracion">
                        <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                    </Link>
                </div>
            </div>
        </MenuPrincipal>
    );
}


export default BentoGrid;






