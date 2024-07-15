import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../credenciales";
import ModalAgregarProducto from "./ModalAgregarProducto";
import ModalEditarProducto from "./ModalEditarProducto";

// Función para formatear Timestamps de Firestore a una cadena legible
const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString();
};

const TablaProductos = () => {
    // Estados para almacenar datos y controlar la interfaz
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [newProduct, setNewProduct] = useState({ nombreProducto: "", descripcionProducto: "", referenciaProducto: "", marcaProducto: "", precioCompra: '', precioVenta: '', stock: '', numeroMinimoStock: '', proveedorId: '', fechaEntrada: '', imagenProducto: '' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedProductId, setExpandedProductId] = useState(null);

    // Efecto para cargar productos desde Firestore al montar el componente
    useEffect(() => {
        const productsRef = collection(db, 'productos');

        // Suscripción a cambios en la colección de productos
        const unsubscribeProducts = onSnapshot(productsRef, async (productsSnapshot) => {
            const fetchedProducts = [];
            for (const doc of productsSnapshot.docs) {
                const productData = doc.data();
                
                // Obtener datos de la referencia del producto y del proveedor
                const referenciaDoc = await getDoc(productData.referenciaProducto);
                const proveedorDoc = await getDoc(productData.proveedorId);
                const marcaDoc = await getDoc(productData.marcaProducto);
                
                // Construir objeto de producto con datos extendidos
                fetchedProducts.push({ 
                    id: doc.id, 
                    ...productData, 
                    referenciaProducto: referenciaDoc.exists() ? referenciaDoc.data() : {},
                    proveedorId: proveedorDoc.exists() ? proveedorDoc.data() : {},
                    marcaProducto: marcaDoc.exists() ? marcaDoc.data(): {}
                });
            }
            
            // Actualizar estado con los productos obtenidos
            setProductos(fetchedProducts);
        });

        // Función de limpieza para cancelar la suscripción
        return () => unsubscribeProducts();
    }, []);

    // Función para agregar un nuevo producto
    const agregarProducto = async (e) => {
        e.preventDefault();
        const productsRef = collection(db, 'productos');
        
        // Agregar nuevo documento a la colección de productos
        await addDoc(productsRef, newProduct);
        
        // Limpiar formulario y cerrar modal de agregar
        setNewProduct({ 
            nombreProducto: "", 
            descripcionProducto: "", 
            referenciaProducto: "", 
            marcaProducto: "", 
            precioCompra: '', 
            precioVenta: '', 
            stock: '', 
            numeroMinimoStock: '', 
            proveedorId: '', 
            fechaEntrada: '', 
            imagenProducto: '' 
        });
        setIsAddModalOpen(false);
    };

    // Función para editar un producto existente
    const editarProducto = async (e) => {
        e.preventDefault();
        const productDoc = doc(db, 'productos', editingProduct.id);
        
        // Actualizar documento existente en la colección de productos
        await updateDoc(productDoc, editingProduct);
        
        // Limpiar estado de producto en edición y cerrar modal de edición
        setEditingProduct(null);
        setIsEditModalOpen(false);
    };

    // Función para eliminar un producto por su ID
    const eliminarProducto = async (id) => {
        const productDoc = doc(db, 'productos', id);
        
        // Eliminar documento de la colección de productos
        await deleteDoc(productDoc);
    };

    // Manejar cambios en el formulario de agregar producto
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    // Manejar cambios en el formulario de editar producto
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct({ ...editingProduct, [name]: value });
    };

    // Función para obtener el nombre del proveedor por su ID
    const getProveedorNombre = (proveedorId) => {
        const proveedor = proveedores.find((prov) => prov.id === proveedorId);
        return proveedor ? proveedor.nombreProveedor : 'Desconocido';
    };

    // Renderizado de la tabla de productos y modales de agregar/editar
    return (
        <div className="relative overflow-x-auto rounded-lg pt-8">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-slate-50 dark:text-sl uppercase bg-[#f97316]">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nombre</th>
                        <th scope="col" className="px-6 py-3">Stock</th>
                        <th scope="col" className="px-6 py-3">Fecha entrada</th>
                        <th scope="col" className="px-6 py-3">Precio compra</th>
                        <th scope="col" className="px-6 py-3">Precio venta</th>
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
                                <td className="px-6 py-4">{producto.stock}</td>
                                <td className="px-6 py-4">{producto.fechaEntradaProducto ? formatTimestamp(producto.fechaEntradaProducto) : ''}</td>
                                <td className="px-6 py-4">{producto.precioCompraProducto}</td>
                                <td className="px-6 py-4">{producto.precioVentaProducto}</td>
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
                                            <p><strong>Nombre: </strong>{producto.nombreProducto}</p>
                                            <p><strong>Descripción: </strong>{producto.descripcionProducto}</p>
                                            <p><strong>Referencia: </strong>{producto.referenciaProducto.nombreReferencia}</p>
                                            <p><strong>Marca: </strong>{producto.marcaProducto.nombreProducto}</p>
                                            <p><strong>Precio de compra: </strong>{producto.precioCompraProducto}</p>
                                            <p><strong>Precio de venta: </strong>{producto.precioVentaProducto}</p>
                                            <p><strong>Stock: </strong>{producto.stock}</p>
                                            <p><strong>Nivel minimo Stock: </strong>{producto.nivelMinimoStock}</p>
                                            <p><strong>Proveedor: </strong>{producto.proveedorId.nombreProveedor}</p>
                                            <p><strong>Fecha de entrada: </strong>{producto.fechaEntradaProducto ? formatTimestamp(producto.fechaEntradaProducto) : ''}</p>
                                            <p><strong>Imagen: </strong>{producto.imagenProducto}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Modal para agregar nuevo producto */}
            <ModalAgregarProducto
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={agregarProducto}
                newProduct={newProduct}
                handleInputChange={handleInputChange}
                proveedores={proveedores} // Pasar proveedores al modal de agregar
            />

            {/* Modal para editar producto existente */}
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







