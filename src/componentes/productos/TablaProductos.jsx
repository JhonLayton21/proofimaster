import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, getDocs, Timestamp } from "firebase/firestore";
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
        const fetchProductos = async () => {
            try {
                const productsRef = collection(db, 'productos');
                const snapshot = await getDocs(productsRef);
                const fetchedProducts = await Promise.all(snapshot.docs.map(async (doc) => {
                    const data = doc.data();

                    if (data.marcaProducto && data.marcaProducto instanceof doc.constructor) {
                        const marcaProductoSnapshot = await getDoc(data.marcaProducto);
                        if (marcaProductoSnapshot.exists()) {
                            data.marcaProducto = { id: marcaProductoSnapshot.id, ...marcaProductoSnapshot.data() };
                        }
                    }

                    if (data.referenciaProducto && data.referenciaProducto instanceof doc.constructor) {
                        const referenciaProductoSnapshot = await getDoc(data.referenciaProducto);
                        if (referenciaProductoSnapshot.exists()) {
                            data.referenciaProducto = { id: referenciaProductoSnapshot.id, ...referenciaProductoSnapshot.data() };
                        }
                    }

                    if (data.proveedorId && data.proveedorId instanceof doc.constructor) {
                        const proveedorIdSnapshot = await getDoc(data.proveedorId);
                        if (proveedorIdSnapshot.exists()) {
                            data.proveedorId = { id: proveedorIdSnapshot.id, ...proveedorIdSnapshot.data() };
                        }
                    }

                    return { id: doc.id, ...data };
                }));
                setProductos(fetchedProducts);
            } catch (error) {
                console.error("Error fetching products: ", error);
            }
        };

        fetchProductos();
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

        await updateDoc(productDoc);

        setEditingProduct(null);
        setIsEditModalOpen(false);
    };

    const eliminarProducto = async (id) => {
        const productDoc = doc(db, 'productos', id);
        await deleteDoc(productDoc);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        //convertir la fecha a Timestamp si el campo es fechaEntradaProducto
        if (name === 'fechaEntradaProducto') {
            setNewProduct({ ...newProduct, [name]: value});
        }else{
            setNewProduct({ ...newProduct, [name]: value});
        }

        setNewProduct({ ...newProduct, [name]: value });
    };    

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;

        setEditingProduct({ ...editingProduct, [name]: value});
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
                                <td className="px-6 py-4">{producto.fechaEntradaProducto ? convertirTimestamp(producto.fechaEntradaProducto) : "" }</td>
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
                                            <p><strong>Referencia: </strong>{producto.referenciaProducto.nombreReferencia}</p>
                                            <p><strong>Marca: </strong>{producto.marcaProducto.nombreProducto}</p>
                                            <p><strong>Precio de compra: </strong>{producto.precioCompraProducto}</p>
                                            <p><strong>Precio de venta: </strong>{producto.precioVentaProducto}</p>
                                            <p><strong>Stock: </strong>{producto.stock}</p>
                                            <p><strong>Nivel minimo Stock: </strong>{producto.nivelMinimoStock}</p>
                                            <p><strong>Proveedor: </strong>{producto.proveedorId.nombreProveedor}</p>
                                            <p><strong>Fecha de entrada: </strong>{producto.fechaEntradaProducto ? convertirTimestamp(producto.fechaEntradaProducto) : "" }</p>
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
            />

            <ModalEditarProducto
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={editarProducto}
                editingProduct={editingProduct}
                handleInputChange={handleEditInputChange}
            />
        </div>
    );
};

export default TablaProductos;