import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import MenuPrincipal from "./MenuPrincipal";

const BentoGrid = ({ correoUsuario }) => {
    const [productosConAlertas, setProductosConAlertas] = useState([]);
    const [productosPrincipales, setProductosPrincipales] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [clientes, setClientes] = useState([]);

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
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const stock = Number(data.stock);
                const nivelMinimoStock = Number(data.nivelMinimoStock);
                if (stock < nivelMinimoStock) {
                    productos.push({ id: doc.id, ...data });
                }
            });
            setProductosConAlertas(productos);
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
        const productosPrincipalesQuery = query(productosRef, orderBy("fechaEntradaProducto", "desc"), limit(3));
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

    return (
        <MenuPrincipal correoUsuario={correoUsuario} titulo={"MENÚ PRINCIPAL"} subtitulo={"Ingresa rápidamente al contenido en Proofimaster"}>
            {/* DIV PADRE */}
            <div className="grid grid-cols-12 grid-rows-6 gap-2 mt-8 px-2 md:px-0">

                {/* PRODUCTOS DESTCADOS */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2">
                    <h2 className="text-lg font-bold mb-4">Productos destacados</h2>
                    <ol className="list-decimal list-inside mb-4 px-4">
                        {productosPrincipales.length === 0 ? (
                            <li>No hay productos recientes</li>
                        ) : (
                            productosPrincipales.map((producto) => (
                                <li key={producto.id} className="py-1 border-b border-gray-300 font-light">
                                    {producto.nombreProducto}
                                </li>
                            ))
                        )}
                    </ol>
                </div>

                {/* PRODUCTOS TOTAL */}
                <div className="bentoItem col-span-6 lg:col-span-2 row-span-1 lg:row-span-2">
                    <h2 className="text-lg font-bold mb-4">Total de productos</h2>
                </div>



                {/* TOTAL DE VENTAS */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2">Total de ventas</div>

                {/* ALERTAS STOCK */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2">
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
                </div>

                {/* PROVEEDORES */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2">
                    <h2 className="text-lg font-bold mb-4">Proveedores</h2>
                    <ul className="list-disc list-inside mb-4 px-4">
                        {proveedores.length === 0 ? (
                            <li>No hay proveedores disponibles</li>
                        ) : (
                            proveedores.map((proveedor) => (
                                <li key={proveedor.id}>
                                    {proveedor.nombreProveedor}
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* INFORMES */}
                <div className="bentoItem col-span-6 lg:col-span-6  row-span-1 lg:row-span-2">Informes generados</div>

                {/* CLIENTES */}
                <div className="bentoItem col-span-6 lg:col-span-3 row-span-1 lg:row-span-2">
                    <h2 className="text-lg font-bold mb-4">Clientes activos</h2>
                    <ul className="list-disc list-inside mb-4 px-4">
                        {clientes.length === 0 ? (
                            <li>No hay clientes disponibles</li>
                        ) : (
                            clientes.map((cliente) => (
                                <li key={cliente.id}>
                                    {cliente.nombreCliente}
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* USUARIOS ACTIVOS */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2">Usuarios activos</div>

                {/* DOCUMENTACIÓN */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2">Documentación</div>

                {/* CONFIGURACIÓN */}
                <div className="bentoItem col-span-6 lg:col-span-4 row-span-1 lg:row-span-2">Configuración cuenta</div>
            </div>
        </MenuPrincipal>
    );
}

export default BentoGrid;



