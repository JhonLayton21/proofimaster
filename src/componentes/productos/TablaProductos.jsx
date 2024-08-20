import React, { useEffect, useState } from "react";
import ModalAgregarProducto from "./ModalAgregarProducto";
import ModalEditarProducto from "./ModalEditarProducto";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const TablaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [newProduct, setNewProduct] = useState({
        nombreProducto: "",
        descripcionProducto: "",
        fechaEntradaProducto: "",
        marcaProductoId: "",
        nivelMinimoStock: "",
        precioCompraProducto: "",
        precioVentaProducto: "",
        proveedorId: "",
        referenciaProductoId: "",
        Stock: ""
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [marcaProducto, setMarcaProducto] = useState([]);
    const [referenciaProducto, setReferenciaProducto] = useState([]);
    const [proveedorProducto, setProveedorProducto] = useState([]);

    // Fetch productos, referencias, marcas, proveedores desde el servidor
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('http://localhost:5000/productos');
                const data = await response.json();
                setProductos(data);
            } catch (err) {
                console.error('Error al obtener los productos:', err.message);
            }
        };

        const fetchReferenciasProducto = async () => {
            try {
                const response = await fetch('http://localhost:5000/referencias_productos');
                const data = await response.json();
                setReferenciaProducto(data);
            } catch (error) {
                console.error('Error al obtener las referencias del productos:', error);
            }
        };

        const fetchMarcasProducto = async () => {
            try {
                const response = await fetch('http://localhost:5000/marcas_productos');
                const data = await response.json();
                setMarcaProducto(data);
            } catch (error) {
                console.error('Error al obtener las marcas del productos:', error);
            }
        };

        const fetchProveedorProducto = async () => {
            try {
                const response = await fetch('http://localhost:5000/proveedores');
                const data = await response.json();
                setProveedorProducto(data);
            } catch (error) {
                console.error('Error al obtener el proveedor del producto:', error);
            }
        };

        fetchProductos();
        fetchReferenciasProducto();
        fetchMarcasProducto();
        fetchProveedorProducto();
    }, []);

    // Función para mostrar la alerta
    const showAlert = (message, type = 'info') => {
        setAlertMessage( {message, type} );
        setTimeout(() => setAlertMessage(''), 3000); 
    };

    // Función eliminación producto
    const eliminarProducto = async (id) => {
        try {
            await fetch(`http://localhost:5000/productos/${id}`, { method: 'DELETE' });
            setProductos(productos.filter(productos => productos.id !== id));
            showAlert('Producto eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    // Función para refrescar lista de productos
    const refreshProductos = async () => {
        try {
            const response = await fetch('http://localhost:5000/productos');
            const data = await response.json();
            setProductos(data);
        } catch (err) {
            console.error('Error al refrescar los productos:', err.message);
        }
    };

    return (
        <div className="relative overflow-x-auto rounded-lg pt-8">
            {alertMessage && (
                <div className={`mb-4 px-4 py-3 rounded relative border ${
                    alertMessage.type === 'add' ? 'text-green-600 bg-green-100 border-green-400' :
                    alertMessage.type === 'edit' ? 'text-blue-600 bg-blue-100 border-blue-400' :
                    alertMessage.type === 'delete' ? 'text-red-600 bg-red-100 border-red-400' :
                    'text-yellow-600 bg-yellow-100 border-yellow-400'
                }`}>
                    {alertMessage.message}
                </div>                
            )}
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
                                <FontAwesomeIcon icon={faPlus} className="fa-xl mr-6" />
                                Agregar producto
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <React.Fragment key={producto.id}>
                            <tr className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <button
                                        onClick={() => setExpandedProductId(expandedProductId === producto.id ? null : producto.id)}
                                        className="focus:outline-none"
                                    >
                                        {expandedProductId === producto.id ? '↓' : '→'}
                                    </button>
                                    {producto.nombre}
                                </th>
                                <td className="px-6 py-4">{producto.stock}</td>
                                <td className="px-6 py-4">{producto.fecha_entrada}</td>
                                <td className="px-6 py-4">{producto.precio_compra}</td>
                                <td className="px-6 py-4">{producto.precio_venta}</td>
                                <td className="px-6 py-4 text-right">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                                        onClick={() => {
                                            setEditingProduct(producto);
                                            setIsEditModalOpen(true);
                                        }}>
                                        Editar
                                        <FontAwesomeIcon icon={faPenToSquare} className=" ml-1" />
                                    </a>
                                    <a
                                        href="#"
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                        onClick={() => eliminarProducto(producto.id)}>
                                        Eliminar
                                        <FontAwesomeIcon icon={faTrashCan} className=" ml-1" />
                                    </a>
                                </td>
                            </tr>
                            {expandedProductId === producto.id && (
                                <tr className="bg-gray-50 dark:bg-[#202020]">
                                    <td colSpan="10" className="px-6 py-4">
                                        <div className="p-4">
                                            <p><strong>Nombre: </strong>{producto.nombre}</p>
                                            <p><strong>Descripción: </strong>{producto.descripcion}</p>
                                            <p><strong>Referencia: </strong>{producto.referencia_id}</p>
                                            <p><strong>Marca: </strong>{producto.marca_id}</p>
                                            <p><strong>Precio de compra: </strong>{producto.precio_compra}</p>
                                            <p><strong>Precio de venta: </strong>{producto.precio_venta}</p>
                                            <p><strong>Stock: </strong>{producto.stock}</p>
                                            <p><strong>Nivel minimo Stock: </strong>{producto.nivel_minimo_stock}</p>
                                            <p><strong>Proveedor: </strong>{producto.proveedor_id}</p>
                                            <p><strong>Fecha de entrada: </strong>{producto.fecha_entrada}</p>
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
                newProduct={newProduct}
                refreshProductos={refreshProductos}
                onSuccess={() => showAlert('Producto agregado exitosamente', 'add')}
            />

            <ModalEditarProducto
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                editingProduct={editingProduct}
                refreshProductos={refreshProductos}
                onSuccess={() => showAlert('Producto editado exitosamente', 'edit')}
            />
        </div>
    );
};

export default TablaProductos;
