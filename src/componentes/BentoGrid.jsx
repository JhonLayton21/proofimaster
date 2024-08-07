import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { faFileLines, faArrowRight, faCog, faCircleUser, faAddressBook, faTruckFast, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MenuPrincipal from "./MenuPrincipal";

const BentoGrid = ({ correoUsuario }) => {
    const [productosConAlertas, setProductosConAlertas] = useState([]);
    const [productosPrincipales, setProductosPrincipales] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [totalProductos, setTotalProductos] = useState(0);
    const [displayedTotal, setDisplayedTotal] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const db = getFirestore();

        // Referencias
        const productosRef = collection(db, 'productos');
        const proveedoresRef = collection(db, 'proveedores');
        const clientesRef = collection(db, 'clientes');

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

        return () => {
            unsubscribeProductos();
            unsubscribeProveedores();
            unsubscribeClientes();
            unsubscribeProductosPrincipales();
        };
    }, []);

    useEffect(() => {
        if (totalProductos > 0 && !isAnimating) {
            setIsAnimating(true);
        }
    }, [totalProductos]);

    useEffect(() => {
        if (!isAnimating) return;

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
                setIsAnimating(false); // Termina la animación
            }
            setDisplayedTotal(Math.floor(start));
        }, stepTime);

        return () => clearInterval(timer);
    }, [isAnimating, totalProductos]);

    return (
        <MenuPrincipal correoUsuario={correoUsuario} titulo={"MENÚ PRINCIPAL"} subtitulo={"Ingresa rápidamente al contenido en Proofimaster"}>
            {/* DIV PADRE */}
            <div className="grid grid-cols-12 grid-rows-6 gap-2 mt-8 px-2 md:px-0">

                {/* PRODUCTOS DESTACADOS */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4">
                    <h2 className="text-lg font-bold mb-4">Productos destacados</h2>
                    <ol className="list-decimal list-inside mb-4 px-4">
                        {productosPrincipales.length === 0 ? (
                            <li>No hay productos recientes</li>
                        ) : (
                            productosPrincipales.map((producto) => (
                                <li key={producto.id} className="py-1 font-light">
                                    {producto.nombreProducto}
                                </li>
                            ))
                        )}
                    </ol>
                    <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                </div>

                {/* PRODUCTOS TOTAL */}
                <div className="bentoItem col-span-6 lg:col-span-2 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4">
                    <h2 className="text-3xl font-bold mb-8">Total de productos</h2>
                    <div className="flex items-center justify-center text-7xl font-bold text-orange-500 gap-2">
                        <span className="flex items-center">
                            {displayedTotal}
                        </span>
                        <FontAwesomeIcon icon={faPlus} className="text-orange-500" />
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                </div>

                {/* TOTAL DE VENTAS */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4">
                    <h2 className="text-lg font-bold mb-4">Total de ventas</h2>
                    <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                </div>

                {/* ALERTAS STOCK */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4">
                    <h2 className="text-lg font-bold mb-4">Alertas de stock</h2>
                    <ul className="list-disc list-inside mb-4 px-4">
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
                    <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                </div>

                {/* PROVEEDORES */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4">
                    <h2 className="text-lg font-bold mb-2">Proveedores</h2>
                    {proveedores.length === 0 ? (
                        <p className="text-sm text-gray-500">No hay proveedores disponibles</p>
                    ) : (
                        proveedores.map((proveedor) => (
                            <div key={proveedor.id} className="flex items-center gap-3 px-4 py-2 border-b border-gray-300">
                                <div className="relative flex items-center justify-center aspect-square w-10 rounded-full">
                                    <FontAwesomeIcon icon={faTruckFast} className="text-slate-800 dark:text-slate-50 fa-xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{proveedor.nombreProveedor}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                </div>

                {/* INFORMES */}
                <div className="bentoItem col-span-6 lg:col-span-6 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4">
                    <h2 className="text-lg font-bold mb-4">Informes generados</h2>
                    <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                </div>

                {/* CLIENTES ACTIVOS */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4">
                    <h2 className="text-lg font-bold mb-2">Clientes activos</h2>
                    {clientes.length === 0 ? (
                        <p className="text-sm text-gray-500">No hay clientes disponibles</p>
                    ) : (
                        clientes.map((cliente) => (
                            <div key={cliente.id} className="flex items-center gap-3 px-4 py-2 border-b border-gray-300">
                                <div className="relative aspect-square w-10 rounded-full">
                                    <FontAwesomeIcon icon={faAddressBook} className="text-slate-800 dark:text-slate-50 fa-xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{cliente.nombreCliente}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                </div>

                {/* USUARIOS ACTIVOS */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2 relative rounded-lg overflow-hidden border p-4">
                    <h2 className="text-lg font-bold mb-4">Usuarios activos</h2>
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300">
                        <div className="relative aspect-square w-10 rounded-full">
                            <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                            <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-dark"></span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">John Layton</p>
                            <p className="text-sm text-body-color text-[#757575] dark:text-dark-6">johnlayton@outlook.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300">
                        <div className="relative aspect-square w-10 rounded-full">
                            <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                            <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-dark"></span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Jane Doe</p>
                            <p className="text-sm text-body-color text-[#757575] dark:text-dark-6">janedoe@gmail.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="relative aspect-square w-10 rounded-full">
                            <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                            <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-dark"></span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Michael Smith</p>
                            <p className="text-sm text-body-color text-[#757575] dark:text-dark-6">michaelsmith@yahoo.com</p>
                        </div>
                    </div>
                </div>

                {/* DOCUMENTACIÓN */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2 flex items-center justify-center relative rounded-lg overflow-hidden border p-4">
                    <FontAwesomeIcon icon={faFileLines} className="text-slate-800 dark:text-slate-50 fa-3x mr-4 mt-4" />
                    <div>
                        <h2 className="text-lg font-semibold">Documentación</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Consulta todas las funcionalidades de Proofimaster</p>
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                </div>

                {/* CONFIGURACIÓN */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2 flex items-center justify-center relative rounded-lg overflow-hidden border p-4">
                    <FontAwesomeIcon icon={faCog} className="text-slate-800 dark:text-slate-50 fa-3x mr-4 mt-4" />
                    <div>
                        <h2 className="text-lg font-semibold">Configuración cuenta</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Ajusta las configuraciones de tu cuenta</p>
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
                </div>
            </div>
        </MenuPrincipal>
    );
}

export default BentoGrid;






