import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../credenciales";
import ModalAgregarProducto from "./ModalAgregarProducto";
import ModalEditarProducto from "./ModalEditarProducto";


const TablaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [newProduct, setNewProduct] = useState({ nombreProducto: "", cantidadProducto: "", valorUnitarioProducto: "", valorTotalProducto: "" });
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const productsRef = collection(db, 'productos');

        const unsubscribe = onSnapshot(productsRef, (snapshot) => {
            const fetchedProducts = [];
            snapshot.forEach((doc) => {
                fetchedProducts.push({ id: doc.id, ...doc.data() });
            });
            setProductos(fetchedProducts);
        });

        return unsubscribe;
    }, []);

    const agregarProducto = async (e) => {
        e.preventDefault();
        const productsRef = collection(db, 'productos');
        await addDoc(productsRef, newProduct);
        setNewProduct({ nombreProducto: "", cantidadProducto: "", valorUnitarioProducto: "", valorTotalProducto: "" });
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

    return (
        <div className="relative overflow-x-auto rounded-lg pt-8">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-slate-50 dark:text-sl uppercase bg-[#f97316]">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nombre Producto</th>
                        <th scope="col" className="px-6 py-3">Cantidad</th>
                        <th scope="col" className="px-6 py-3">Valor unitario</th>
                        <th scope="col" className="px-6 py-3">Valor total</th>
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
                        <tr key={producto.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {producto.nombreProducto}
                            </th>
                            <td className="px-6 py-4">{producto.cantidadProducto}</td>
                            <td className="px-6 py-4">{producto.valorUnitarioProducto}</td>
                            <td className="px-6 py-4">{producto.valorTotalProducto}</td>
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
                handleEditInputChange={handleEditInputChange} 
            />
        </div>
    );
};

export default TablaProductos;



