import React, { useEffect, useState } from "react";
import TablaGenerica from "../categorias/TablaGenerica";
import MenuPrincipal from "../MenuPrincipal";
import ModalAgregarVenta from "./ModalAgregarVenta";
import EditarVenta from "./EditarVenta";
import Alert from "../categorias/Alert";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import ModalEditarVenta from "./ModalEditarVenta";

const auth = getAuth(appFirebase);

const Ventas2 = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Estados para los datos de las listas desplegables
    const [tipoClientes, setTipoClientes] = useState([]);
    const [estadoVentas, setEstadoVentas] = useState([]);
    const [metodoPago, setMetodoPago] = useState([]);
    const [metodoEnvio, setMetodoEnvio] = useState([]);

    useEffect(() => {
        fetchData();
        fetchTipoClientes();
        fetchEstadoVentas();
        fetchMetodoPago();
        fetchMetodoEnvio();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/ventas');
            const data = await response.json();
            setColumnas(Object.keys(data[0]));
            setDatos(data);
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
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

    const fetchEstadoVentas = async () => {
        try {
            const response = await fetch('http://localhost:5000/estado_venta');
            const data = await response.json();
            setEstadoVentas(data);
        } catch (error) {
            console.error('Error al obtener los estados de venta:', error);
        }
    };

    const fetchMetodoPago = async () => {
        try {
            const response = await fetch('http://localhost:5000/metodo_pago');
            const data = await response.json();
            setMetodoPago(data);
        } catch (error) {
            console.error('Error al obtener los métodos de pago:', error);
        }
    };

    const fetchMetodoEnvio = async () => {
        try {
            const response = await fetch('http://localhost:5000/metodo_envio_venta');
            const data = await response.json();
            setMetodoEnvio(data);
        } catch (error) {
            console.error('Error al obtener los métodos de envío:', error);
        }
    };

    const showAlert = (message, type = 'info') => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(''), 3000);
    };

    const handleAdd = () => setIsAddModalOpen(true);

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/ventas/${id}`, { method: 'DELETE' });
            fetchData();
            showAlert('Venta eliminada exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar la venta:', error);
            showAlert('Error al eliminar la venta', 'error');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return ''; // Si no es una fecha válida, devolver una cadena vacía o manejarlo de otra manera
        }
        return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    };

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    titulo={"Ventas"}
                    subtitulo={"Seguimiento y control de transacciones"}
                >
                    <Alert message={alertMessage.message} type={alertMessage.type} />
                    <TablaGenerica
                        columnas={columnas}
                        datos={datos}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAlert={showAlert}
                    />
                </MenuPrincipal>
            </div>
            {isAddModalOpen && (
                <ModalAgregarVenta
                    isOpen={isAddModalOpen}
                    onClose={() => { setIsAddModalOpen(false); fetchData(); }}
                />
            )}
            {isEditModalOpen && (
                <ModalEditarVenta
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        fetchData();
                    }}
                    editingItem={editingItem} // El ítem que estás editando
                    tipoClientes={tipoClientes} // Los tipos de clientes que le pasas como prop
                    estadoVentas={estadoVentas} // Los estados de ventas que le pasas como prop
                    metodoPago={metodoPago} // Los métodos de pago que le pasas como prop
                    metodoEnvio={metodoEnvio} // Los métodos de envío que le pasas como prop
                />
            )}
        </div>
    );
};

export default Ventas2;

