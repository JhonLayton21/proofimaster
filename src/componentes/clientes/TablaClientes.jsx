import React, { useEffect, useState } from "react";
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
    const [alertMessage, setAlertMessage] = useState('');

    // Fetch clientes y tipos de clientes desde el servidor
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await fetch('http://localhost:5000/clientes');
                const data = await response.json();
                setClientes(data);
            } catch (err) {
                console.error('Error al obtener los clientes:', err.message);
            }
        };

        const fetchTipoClientes = async () => {
            try {
                const response = await fetch('http://localhost:5000/tipo_clientes');
                const data = await response.json();
                setTipoClientes(data);
            } catch (error) {
                console.error('Error al obtener los tipos de clientes:', error);
            }
        };

        fetchClientes();
        fetchTipoClientes();
    }, []);

    // Función para mostrar la alerta
    const showAlert = (message, type = 'info') => {
        setAlertMessage( {message, type} );
        setTimeout(() => setAlertMessage(''), 3000); 
    };

    // Función eliminación cliente
    const eliminarCliente = async (id) => {
        try {
            await fetch(`http://localhost:5000/clientes/${id}`, { method: 'DELETE' });
            setClientes(clientes.filter(clientes => clientes.id !== id));
            showAlert('Cliente eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
        }
    };

    // Función para refrescar lista de clientes
    const refreshClientes = async () => {
        try {
            const response = await fetch('http://localhost:5000/clientes');
            const data = await response.json();
            setClientes(data);
        } catch (err) {
            console.error('Error al refrescar los clientes:', err.message);
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
                                    {cliente.nombre_cliente}
                                </th>
                                <td className="px-6 py-4">{cliente.email_cliente}</td>
                                <td className="px-6 py-4">{cliente.telefono_cliente}</td>
                                <td className="px-6 py-4">{cliente.direccion_cliente}</td>
                                <td className="px-6 py-4">{cliente.tipo_cliente_id}</td>
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
                                            <p><strong>Nombre: </strong>{cliente.nombre_cliente}</p>
                                            <p><strong>Email: </strong>{cliente.email_cliente}</p>
                                            <p><strong>Telefono: </strong>{cliente.telefono_cliente}</p>
                                            <p><strong>Dirección: </strong>{cliente.direccion_cliente}</p>
                                            <p><strong>Tipo cliente: </strong>{cliente.tipo_cliente_id}</p>
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
                newClient={newClient}
                tipoClientes={tipoClientes}
                refreshClientes={refreshClientes}
                onSuccess={() => showAlert('Cliente agregado exitosamente', 'add')}
            />

            {/* Modal para editar Cliente existente */}
            <ModalEditarCliente
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                editingClient={editingClient}
                tipoClientes={tipoClientes}
                refreshClientes={refreshClientes}
                onSuccess={() => showAlert('Cliente editado exitosamente', 'edit')}
            />
        </div>
    );
};

export default TablaClientes;



