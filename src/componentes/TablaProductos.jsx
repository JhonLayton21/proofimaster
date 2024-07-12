import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../credenciales";
import ModalAgregarProducto from "./ModalAgregarProducto";
import ModalEditarProducto from "./ModalEditarProducto";

// Función para formatear Timestamps de Firestore a una cadena legible
const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString(); // Puedes ajustar el formato según tus necesidades
};

const TablaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [newProduct, setNewProduct] = useState({ nombreProducto: "", cantidadProducto: "", valorUnitarioProducto: "", valorTotalProducto: "", proveedorId:'' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedProductId, setExpandedProductId] = useState(null);

    // Recuperar productos y proveedores
    useEffect(() => {
        const productsRef = collection(db, 'productos');
        const proveedoresRef = collection(db, 'proveedores');

        const unsubscribeProducts = onSnapshot(productsRef, (productsSnapshot) => {
            const fetchedProducts = [];
            productsSnapshot.forEach((doc) => {
                fetchedProducts.push({ id: doc.id, ...doc.data() });
            });
            setProductos(fetchedProducts);
        });

        const unsubscribeProveedores = onSnapshot(proveedoresRef, (proveedoresSnapshot) => {
            const fetchedProveedores = [];
            proveedoresSnapshot.forEach((doc) => {
                fetchedProveedores.push({ id: doc.id, ...doc.data() });
            });
            setProveedores(fetchedProveedores);
        });

        return () => {
            unsubscribeProducts();
            unsubscribeProveedores();
        };
    }, []);

    const agregarProducto = async (e) => {
        e.preventDefault();
        const productsRef = collection(db, 'productos');
        await addDoc(productsRef, newProduct);
        setNewProduct({ nombreProducto: "", cantidadProducto: "", valorUnitarioProducto: "", valorTotalProducto: "", proveedorId: '' });
        setIsAddModalOpen(false);  // Ocultar modal después de agregar
    };

    const editarProducto = async (e) => {
        e.preventDefault();
        const productDoc = doc(db, 'productos', editingProduct.id);
        await updateDoc(productDoc, editingProduct);
        setEditingProduct(null);
        setIsEditModalOpen(false);  // Ocultar modal después de editar
    };

    const eliminarProducto = async (id) => {
        const productDoc = doc(db, 'productos', id);
        await deleteDoc(productDoc);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct({ ...editingProduct, [name]: value });
    };

    // Obtener el nombre del proveedor por su ID
    const getProveedorNombre = (proveedorId) => {
        const proveedor = proveedores.find((prov) => prov.id === proveedorId);
        return proveedor ? proveedor.nombreProveedor : 'Desconocido';
    };

    return (
        <div className="relative overflow-x-auto rounded-lg pt-8">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-slate-50 dark:text-sl uppercase bg-[#f97316]">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nombre</th>
                        <th scope="col" className="px-6 py-3">Descripcion</th>
                        <th scope="col" className="px-6 py-3">Stock</th>
                        <th scope="col" className="px-6 py-3">Fecha entrada</th>
                        <th scope="col" className="px-6 py-3">Marca</th>
                        <th scope="col" className="px-6 py-3">Precio compra</th>
                        <th scope="col" className="px-6 py-3">Precio venta</th>
                        <th scope="col" className="px-6 py-3">Proveedor</th>
                        <th scope="col" className="px-6 py-3">Imagen</th>
                        <th scope="col" className="px-2 py-3 text-right">
                            <button
                                className="text-neutral-100 font-bold bg-green-600 hover:bg-green-800 cursor-pointer"
                                onClick={() => setIsAddModalOpen(true)}>
                                Agregar producto
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <React.Fragment key={producto.id}>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <button
                                        onClick={() => setExpandedProductId(expandedProductId === producto.id ? null : producto.id)}
                                        className="focus:outline-none"
                                    >
                                        {expandedProductId === producto.id ? '↓' : '→'}
                                    </button>
                                    {producto.nombreProducto}
                                </th>
                                <td className="px-6 py-4">{producto.descripcionProducto}</td>
                                <td className="px-6 py-4">{producto.stock}</td>
                                <td className="px-6 py-4">{producto.fechaEntradaProducto ? formatTimestamp(producto.fechaEntradaProducto) : ''}</td>
                                <td className="px-6 py-4">{producto.marcaProducto}</td>
                                <td className="px-6 py-4">{producto.precioCompraProducto}</td>
                                <td className="px-6 py-4">{producto.precioVentaProducto}</td>
                                <td className="px-6 py-4">{getProveedorNombre(producto.proveedorId)}</td>
                                <td className="px-6 py-4">{producto.imagenProducto}</td>
                                <td className="px-6 py-4 text-right">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                                        onClick={() => {
                                            setEditingProduct(producto);
                                            setIsEditModalOpen(true);
                                        }}>
                                        Editar
                                    </a>
                                    <a
                                        href="#"
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                        onClick={() => eliminarProducto(producto.id)}>
                                        Eliminar
                                    </a>
                                </td>
                            </tr>
                            {expandedProductId === producto.id && (
                                <tr className="bg-gray-50 dark:bg-gray-700">
                                    <td colSpan="10" className="px-6 py-4">
                                        <div className="p-4">
                                            <p><strong>Descripción: </strong>{producto.descripcionProducto}</p>
                                            <p><strong>Stock: </strong>{producto.stock}</p>
                                            <p><strong>Fecha de entrada: </strong>{producto.fechaEntradaProducto ? formatTimestamp(producto.fechaEntradaProducto) : ''}</p>
                                            <p><strong>Marca: </strong>{producto.marcaProducto}</p>
                                            <p><strong>Precio de compra: </strong>{producto.precioCompraProducto}</p>
                                            <p><strong>Precio de venta: </strong>{producto.precioVentaProducto}</p>
                                            <p><strong>Proveedor: </strong>{getProveedorNombre(producto.proveedorId)}</p>
                                            <p><strong>Imagen: </strong>{producto.imagenProducto}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <ModalAgregarProducto 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSubmit={agregarProducto} 
                newProduct={newProduct} 
                handleInputChange={handleInputChange} 
                proveedores={proveedores} // Pasar proveedores al modal de agregar
            />

            <ModalEditarProducto 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                onSubmit={editarProducto} 
                editingProduct={editingProduct} 
                handleEditInputChange={handleEditInputChange} 
                proveedores={proveedores} // Pasar proveedores al modal de editar
            />
        </div>
    );
};

export default TablaProductos;





