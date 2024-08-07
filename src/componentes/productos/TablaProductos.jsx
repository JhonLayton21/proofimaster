import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "../../credenciales";
import ModalAgregarProducto from "./ModalAgregarProducto";
import ModalEditarProducto from "./ModalEditarProducto";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const convertirTimestamp = (timestamp) => {
    const fecha = timestamp.toDate();
    return fecha.toLocaleDateString();
}

const TablaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [referencias, setReferencias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [newProduct, setNewProduct] = useState({
        nombreProducto: "",
        descripcionProducto: "",
        referenciaProducto: "",
        marcaProducto: "",
        precioCompraProducto: "",
        precioVentaProducto: "",
        stock: "",
        nivelMinimoStock: "",
        proveedorId: "",
        fechaEntradaProducto: "",
        imagenProducto: null
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedProductId, setExpandedProductId] = useState(null);

    useEffect(() => {
        /* Referencia y obtención productos en tiempo real */
        const unsubscribeProductos = onSnapshot(collection(db, "productos"), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProductos(data);
        }, (error) => {
            console.error("Error al mostrar productos: ", error);
        });

        /* Referencia y obtención marcas en tiempo real */
        const unsubscribeMarcas = onSnapshot(collection(db, "marcaProductos"), (snapshot) => {
            const tiposData = snapshot.docs.map(doc => doc.data().nombreProducto);
            setMarcas(tiposData);
        }, (error) => {
            console.error("Error al mostrar marca de productos: ", error);
        });

        /* Referencia y obtención referencias en tiempo real */
        const unsubscribeReferencias = onSnapshot(collection(db, "referenciaProductos"), (snapshot) => {
            const tiposData = snapshot.docs.map(doc => doc.data().nombreReferencia);
            setReferencias(tiposData);
        }, (error) => {
            console.error("Error al mostrar referencia de productos: ", error);
        });

        /* Referencia y obtención proveedores en tiempo real */
        const unsubscribeProveedores = onSnapshot(collection(db, "proveedores"), (snapshot) => {
            const tiposData = snapshot.docs.map(doc => doc.data().nombreProveedor);
            setProveedores(tiposData);
        }, (error) => {
            console.error("Error al mostrar proveedor de productos: ", error);
        });

        // Cleanup subscriptions on unmount
        return () => {
            unsubscribeProductos();
            unsubscribeMarcas();
            unsubscribeReferencias();
            unsubscribeProveedores();
        };
    }, []);

    const agregarProducto = async (e) => {
        e.preventDefault();
        const productsRef = collection(db, 'productos');

        // convertir fechaEntradaProducto a Timestamp antes de guardar
        const fecha = new Date(newProduct.fechaEntradaProducto);
        const fechaUTC = new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate());

        const productoTimestamp = {
            ...newProduct,
            fechaEntradaProducto: Timestamp.fromDate(fechaUTC)
        };

        await addDoc(productsRef, productoTimestamp);

        setNewProduct({
            nombreProducto: "",
            descripcionProducto: "",
            referenciaProducto: "",
            marcaProducto: "",
            precioCompraProducto: "",
            precioVentaProducto: "",
            stock: "",
            nivelMinimoStock: "",
            proveedorId: "",
            fechaEntradaProducto: "",
            imagenProducto: null
        });
        setIsAddModalOpen(false);
    };

    const editarProducto = async (e) => {
        e.preventDefault();
        const productDoc = doc(db, 'productos', editingProduct.id);

        // Convertir fechaEntradaProducto a Timestamp antes de actualizar
        const fecha = new Date(editingProduct.fechaEntradaProducto);
        const fechaUTC = new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate());
        const productoActualizado = {
            ...editingProduct,
            fechaEntradaProducto: Timestamp.fromDate(fechaUTC)
        };

        await updateDoc(productDoc, productoActualizado);

        setEditingProduct(null);
        setIsEditModalOpen(false);
    };

    const eliminarProducto = async (id) => {
        const productDoc = doc(db, 'productos', id);
        await deleteDoc(productDoc);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'fechaEntradaProducto') {
            setNewProduct({ ...newProduct, [name]: value });
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'fechaEntradaProducto') {
            setEditingProduct({ ...editingProduct, [name]: value });
        } else {
            setEditingProduct({ ...editingProduct, [name]: value });
        }
    };

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
                                    {producto.nombreProducto}
                                </th>
                                <td className="px-6 py-4">{producto.stock}</td>
                                <td className="px-6 py-4">{producto.fechaEntradaProducto ? convertirTimestamp(producto.fechaEntradaProducto) : ""}</td>
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
                                            <p><strong>Nombre: </strong>{producto.nombreProducto}</p>
                                            <p><strong>Descripción: </strong>{producto.descripcionProducto}</p>
                                            <p><strong>Referencia: </strong>{producto.referenciaProducto}</p>
                                            <p><strong>Marca: </strong>{producto.marcaProducto}</p>
                                            <p><strong>Precio de compra: </strong>{producto.precioCompraProducto}</p>
                                            <p><strong>Precio de venta: </strong>{producto.precioVentaProducto}</p>
                                            <p><strong>Stock: </strong>{producto.stock}</p>
                                            <p><strong>Nivel minimo Stock: </strong>{producto.nivelMinimoStock}</p>
                                            <p><strong>Proveedor: </strong>{producto.proveedorId}</p>
                                            <p><strong>Fecha de entrada: </strong>{producto.fechaEntradaProducto ? convertirTimestamp(producto.fechaEntradaProducto) : ""}</p>
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
                referencias={referencias}
                marcas={marcas}
                proveedores={proveedores}
            />

            <ModalEditarProducto
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={editarProducto}
                editingProduct={editingProduct}
                handleEditInputChange={handleEditInputChange}
                referencias={referencias}
                marcas={marcas}
                proveedores={proveedores}
            />
        </div>
    );
};

export default TablaProductos;
