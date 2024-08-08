import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../credenciales";
import ModalAgregarCliente from "./ModalAgregarCliente";
import ModalEditarCliente from "./ModalEditarCliente";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const TablaClientes = () => {
    const [newClient, setNewClient] = useState({ nombreCliente: "", emailCliente: "", telefonoCliente: "", direccionCliente: "", tipoCliente: '' });
    const [editingClient, setEditingClient] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedClientId, setExpandedClientId] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [tipoClientes, setTipoClientes] = useState([]);

    useEffect(() => {
        const clientesRef = collection(db, "clientes");
        const unsubscribeClientes = onSnapshot(clientesRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setClientes(data);
        });

        const tipoClientesRef = collection(db, "tipoClientes");
        const unsubscribeTipoClientes = onSnapshot(tipoClientesRef, (snapshot) => {
            const tiposData = snapshot.docs.map(doc => doc.data().tipo);
            setTipoClientes(tiposData);
        });

        // Limpieza del efecto al desmontar el componente
        return () => {
            unsubscribeClientes();
            unsubscribeTipoClientes();
        };
    }, []);

    const agregarCliente = async (e) => {
        e.preventDefault();
        const ClientsRef = collection(db, 'clientes');

        await addDoc(ClientsRef, newClient);

        setNewClient({ nombreCliente: "", emailCliente: "", telefonoCliente: "", direccionCliente: "", tipoCliente: '' });
        setIsAddModalOpen(false);
    };

    const editarCliente = async (e) => {
        e.preventDefault();
        const ClientDoc = doc(db, 'clientes', editingClient.id);

        await updateDoc(ClientDoc, editingClient);

        setEditingClient(null);
        setIsEditModalOpen(false);
    };

    const eliminarCliente = async (id) => {
        const ClientDoc = doc(db, 'clientes', id);

        await deleteDoc(ClientDoc);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient({ ...newClient, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingClient({ ...editingClient, [name]: value });
    };

    return (
        <div className="relative overflow-x-auto rounded-lg pt-8">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-slate-50 dark:text-sl uppercase bg-[#f97316]">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nombre</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Telefono</th>
                        <th scope="col" className="px-6 py-3">Dirección</th>
                        <th scope="col" className="px-6 py-3">Tipo</th>
                        <th scope="col" className="px-2 py-3 text-right">
                            <button
                                className="text-neutral-100 font-bold bg-green-600 hover:bg-green-800 cursor-pointer"
                                onClick={() => setIsAddModalOpen(true)}>
                                <FontAwesomeIcon icon={faPlus} className="fa-xl mr-6" />
                                Agregar Cliente
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <React.Fragment key={cliente.id}>
                            <tr className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                                    <button
                                        onClick={() => setExpandedClientId(expandedClientId === cliente.id ? null : cliente.id)}
                                        className="focus:outline-none"
                                    >
                                        {expandedClientId === cliente.id ? '↓' : '→'}
                                    </button>
                                    {cliente.nombreCliente}
                                </th>
                                <td className="px-6 py-4">{cliente.emailCliente}</td>
                                <td className="px-6 py-4">{cliente.telefonoCliente}</td>
                                <td className="px-6 py-4">{cliente.direccionCliente}</td>
                                <td className="px-6 py-4">{cliente.tipoCliente}</td>
                                <td className="px-6 py-4 text-right">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                                        onClick={() => {
                                            setEditingClient(cliente);
                                            setIsEditModalOpen(true);
                                        }}>
                                        Editar
                                        <FontAwesomeIcon icon={faPenToSquare} className=" ml-1" />
                                    </a>
                                    <a
                                        href="#"
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                        onClick={() => eliminarCliente(cliente.id)}>
                                        Eliminar
                                        <FontAwesomeIcon icon={faTrashCan} className=" ml-1" />
                                    </a>
                                </td>
                            </tr>
                            {expandedClientId === cliente.id && (
                                <tr className="bg-gray-50 dark:bg-[#202020]">
                                    <td colSpan="10" className="px-6 py-4">
                                        <div className="p-4">
                                            <p><strong>Nombre: </strong>{cliente.nombreCliente}</p>
                                            <p><strong>Email: </strong>{cliente.emailCliente}</p>
                                            <p><strong>Telefono: </strong>{cliente.telefonoCliente}</p>
                                            <p><strong>Dirección: </strong>{cliente.direccionCliente}</p>
                                            <p><strong>Tipo cliente: </strong>{cliente.tipoCliente}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Modal para agregar nuevo Cliente */}
            <ModalAgregarCliente
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={agregarCliente}
                newClient={newClient}
                handleInputChange={handleInputChange}
                tipoClientes={tipoClientes}
            />

            {/* Modal para editar Cliente existente */}
            <ModalEditarCliente
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={editarCliente}
                editingClient={editingClient}
                handleEditInputChange={handleEditInputChange}
                tipoClientes={tipoClientes}
            />
        </div>
    );
};

export default TablaClientes;


