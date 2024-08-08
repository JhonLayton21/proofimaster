import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../credenciales";
import ModalAgregarProveedor from "./ModalAgregarProveedor";
import ModalEditarProveedor from "./ModalEditarProveedor";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const TablaProveedores = () => {
    // Estados para almacenar datos y controlar la interfaz
    const [newProvider, setNewProvider] = useState({ nombreProveedor: "", contactoProveedor: "", emailProveedor: "", telefonoProveedor: "", direccionProveedor: "", metodoPago: '' });
    const [editingProvider, setEditingProvider] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedProviderId, setExpandedProviderId] = useState(null);
    const [Proveedores, setProveedores] = useState([]);
    const [MetodoPagoProveedores, setMetodoPagoProveedores] = useState([]);

    // Efecto para cargar Proveedores y métodos de pago desde Firestore en tiempo real
    useEffect(() => {
        const ProveedoresRef = collection(db, "proveedores");
        const MetodoPagoProveedoresRef = collection(db, "MetodoPagoProveedores");

        const unsubscribeProveedores = onSnapshot(ProveedoresRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProveedores(data); // Asignar los datos obtenidos al estado
        });

        const unsubscribeMetodoPagoProveedores = onSnapshot(MetodoPagoProveedoresRef, (snapshot) => {
            const tiposData = snapshot.docs.map(doc => doc.data().tipo);
            setMetodoPagoProveedores(tiposData);
        });

        // Limpiar suscripciones al desmontar el componente
        return () => {
            unsubscribeProveedores();
            unsubscribeMetodoPagoProveedores();
        };
    }, []);

    // Función para agregar un nuevo Proveedor
    const agregarProveedor = async (e) => {
        e.preventDefault();
        const ProvidersRef = collection(db, 'proveedores');

        // Agregar nuevo documento a la colección de Proveedores
        await addDoc(ProvidersRef, newProvider);

        // Limpiar formulario y cerrar modal de agregar
        setNewProvider({ nombreProveedor: "", contactoProveedor: "", emailProveedor: "", telefonoProveedor: "", direccionProveedor: "", metodoPago: "" });
        setIsAddModalOpen(false);
    };

    // Función para editar un Proveedor existente
    const editarProveedor = async (e) => {
        e.preventDefault();
        const ProviderDoc = doc(db, 'proveedores', editingProvider.id);

        // Actualizar documento existente en la colección de Proveedores
        await updateDoc(ProviderDoc, editingProvider);

        // Limpiar estado de Proveedor en edición y cerrar modal de edición
        setEditingProvider(null);
        setIsEditModalOpen(false);
    };

    // Función para eliminar un Proveedor por su ID
    const eliminarProveedor = async (id) => {
        const ProviderDoc = doc(db, 'proveedores', id);

        // Eliminar documento de la colección de Proveedores
        await deleteDoc(ProviderDoc);
    };

    // Manejar cambios en el formulario de agregar Proveedor
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProvider({ ...newProvider, [name]: value });
    };

    // Manejar cambios en el formulario de editar Proveedor
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingProvider({ ...editingProvider, [name]: value });
    };

    // Renderizado de la tabla de Proveedores y modales de agregar/editar
    return (
        <div className="relative overflow-x-auto rounded-lg pt-8">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-slate-50 dark:text-sl uppercase bg-[#f97316]">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nombre</th>
                        <th scope="col" className="px-6 py-3">Contacto</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Telefono</th>
                        <th scope="col" className="px-6 py-3">Dirección</th>
                        <th scope="col" className="px-6 py-3">Método pago</th>
                        <th scope="col" className="px-2 py-3 text-right">
                            <button
                                className="text-neutral-100 font-bold bg-green-600 hover:bg-green-800 cursor-pointer"
                                onClick={() => setIsAddModalOpen(true)}>
                                <FontAwesomeIcon icon={faPlus} className="fa-xl mr-6" />
                                Agregar Proveedor
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Proveedores.map((Proveedor) => (
                        <React.Fragment key={Proveedor.id}>
                            <tr className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                                    <button
                                        onClick={() => setExpandedProviderId(expandedProviderId === Proveedor.id ? null : Proveedor.id)}
                                        className="focus:outline-none"
                                    >
                                        {expandedProviderId === Proveedor.id ? '↓' : '→'}
                                    </button>
                                    {Proveedor.nombreProveedor}
                                </th>
                                <td className="px-6 py-4">{Proveedor.contactoProveedor}</td>
                                <td className="px-6 py-4">{Proveedor.emailProveedor}</td>
                                <td className="px-6 py-4">{Proveedor.telefonoProveedor}</td>
                                <td className="px-6 py-4">{Proveedor.direccionProveedor}</td>
                                <td className="px-6 py-4">{Proveedor.metodoPago}</td>
                                <td className="px-6 py-4 text-right">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                                        onClick={() => {
                                            setEditingProvider(Proveedor);
                                            setIsEditModalOpen(true);
                                        }}>
                                        Editar
                                        <FontAwesomeIcon icon={faPenToSquare} className=" ml-1" />
                                    </a>
                                    <a
                                        href="#"
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                        onClick={() => eliminarProveedor(Proveedor.id)}>
                                        Eliminar
                                        <FontAwesomeIcon icon={faTrashCan} className=" ml-1" />
                                    </a>
                                </td>
                            </tr>
                            {expandedProviderId === Proveedor.id && (
                                <tr className="bg-gray-50 dark:bg-[#202020]">
                                    <td colSpan="10" className="px-6 py-4">
                                        <div className="p-4">
                                            <p><strong>Nombre: </strong>{Proveedor.nombreProveedor}</p>
                                            <p><strong>Contacto: </strong>{Proveedor.contactoProveedor}</p>
                                            <p><strong>Email: </strong>{Proveedor.emailProveedor}</p>
                                            <p><strong>Telefono: </strong>{Proveedor.telefonoProveedor}</p>
                                            <p><strong>Dirección: </strong>{Proveedor.direccionProveedor}</p>
                                            <p><strong>Método de pago: </strong>{Proveedor.metodoPago}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Modal para agregar nuevo Proveedor */}
            <ModalAgregarProveedor
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={agregarProveedor}
                newProvider={newProvider}
                handleInputChange={handleInputChange}
                MetodoPagoProveedores={MetodoPagoProveedores}
            />

            {/* Modal para editar Proveedor existente */}
            <ModalEditarProveedor
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={editarProveedor}
                editingProvider={editingProvider}
                handleEditInputChange={handleEditInputChange}
                MetodoPagoProveedores={MetodoPagoProveedores}
            />
        </div>
    );
};

export default TablaProveedores;
