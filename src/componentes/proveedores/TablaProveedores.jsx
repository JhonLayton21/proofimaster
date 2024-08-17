import React, { useEffect, useState } from "react";
import ModalAgregarProveedor from "./ModalAgregarProveedor";
import ModalEditarProveedor from "./ModalEditarProveedor";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const TablaProveedores = () => {
    const [newProvider, setNewProvider] = useState({ nombreProveedor: "", contactoProveedor: "", emailProveedor: "", telefonoProveedor: "", direccionProveedor: "", metodoPago: '' });
    const [editingProvider, setEditingProvider] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedProviderId, setExpandedProviderId] = useState(null);
    const [proveedores, setProveedores] = useState([]);
    const [metodoPagoProveedores, setMetodoPagoProveedores] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');

    // Fetch proveedores y métodos de pago desde el servidor
    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await fetch('http://localhost:5000/proveedores');
                const data = await response.json();
                setProveedores(data);
            } catch (err) {
                console.error('Error al obtener los proveedores:', err.message);
            }
        };

        const fetchMetodosPago = async () => {
            try {
                const response = await fetch('http://localhost:5000/metodo_pago');
                const data = await response.json();
                setMetodoPagoProveedores(data);
            } catch (error) {
                console.error('Error al obtener los métodos de pago:', error);
            }
        };

        fetchProveedores();
        fetchMetodosPago();
    }, []);

    // Función para mostrar la alerta
    const showAlert = (message, type = 'info') => {
        setAlertMessage( {message, type} );
        setTimeout(() => setAlertMessage(''), 3000); 
    };

    // Función eliminación proveedor
    const eliminarProveedor = async (id) => {
        try {
            await fetch(`http://localhost:5000/proveedores/${id}`, { method: 'DELETE' });
            setProveedores(proveedores.filter(proveedor => proveedor.id !== id));
            showAlert('Proveedor eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
        }
    };

    // Función para refrescar lista de proveedores
    const refreshProveedores = async () => {
        try {
            const response = await fetch('http://localhost:5000/proveedores');
            const data = await response.json();
            setProveedores(data);
        } catch (err) {
            console.error('Error al refrescar los proveedores:', err.message);
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
                    {proveedores.map((Proveedor) => (
                        <React.Fragment key={Proveedor.id}>
                            <tr className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                                    <button
                                        onClick={() => setExpandedProviderId(expandedProviderId === Proveedor.id ? null : Proveedor.id)}
                                        className="focus:outline-none"
                                    >
                                        {expandedProviderId === Proveedor.id ? '↓' : '→'}
                                    </button>
                                    {Proveedor.nombre_proveedor}
                                </th>
                                <td className="px-6 py-4">{Proveedor.contacto_proveedor}</td>
                                <td className="px-6 py-4">{Proveedor.email_proveedor}</td>
                                <td className="px-6 py-4">{Proveedor.telefono_proveedor}</td>
                                <td className="px-6 py-4">{Proveedor.direccion_proveedor}</td>
                                <td className="px-6 py-4">{Proveedor.metodo_pago_id}</td>
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
                                            <p><strong>Nombre: </strong>{Proveedor.nombre_proveedor}</p>
                                            <p><strong>Contacto: </strong>{Proveedor.contacto_proveedor}</p>
                                            <p><strong>Email: </strong>{Proveedor.email_proveedor}</p>
                                            <p><strong>Telefono: </strong>{Proveedor.telefono_proveedor}</p>
                                            <p><strong>Dirección: </strong>{Proveedor.direccion_proveedor}</p>
                                            <p><strong>Método de pago: </strong>{Proveedor.metodo_pago_id}</p>
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
                newProvider={newProvider}
                metodoPagoProveedores={metodoPagoProveedores}
                refreshProveedores={refreshProveedores}
                onSuccess={() => showAlert('Proveedor agregado exitosamente', 'add')}
            />

            {/* Modal para editar Proveedor existente */}
            <ModalEditarProveedor
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                editingProvider={editingProvider}
                setEditingProvider={setEditingProvider} 
                refreshProveedores={refreshProveedores} 
                onSuccess={() => showAlert('Proveedor editado exitosamente', 'edit')}
            />
        </div>
    );
};

export default TablaProveedores;


