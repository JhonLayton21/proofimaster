import React, { useEffect, useState } from "react";
import TablaGenerica from "../categorias/TablaGenerica";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import ModalEditar from "../categorias/ModalEditar";
import ModalAgregar from "../categorias/ModalAgregar";
import Alert from "../categorias/Alert";

const auth = getAuth(appFirebase);

const Clientes = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [tiposClientes, setTiposClientes] = useState([]);

    useEffect(() => {
        fetchData();
        fetchTipoClientes();
    }, []);

    const fetchTipoClientes = async () => {
        try {
            const response = await fetch('http://localhost:5000/tipo_clientes');
            const data = await response.json();
            setTiposClientes(data);
        } catch (error) {
            console.error('Error al obtener los tipos de cliente:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/clientes');
            const data = await response.json();
            setColumnas(Object.keys(data[0]));
            setDatos(data);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
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
            await fetch(`http://localhost:5000/clientes/${id}`, { method: 'DELETE' });
            fetchData();
            showAlert('Cliente eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
            showAlert('Error al eliminar el cliente', 'error');
        }
    };

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    titulo={"Clientes"}
                    subtitulo={"Gestiona los clientes y su información básica"}
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
                <ModalAgregar
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        fetchData();
                    }}
                    onSubmit={(nuevoCliente) => {
                        setDatos([...datos, nuevoCliente]);
                        showAlert('Cliente agregado exitosamente', 'add');
                    }}
                    titulo="Agregar Cliente"
                    campos={[
                        { name: 'id', label: 'Id', type: 'number', placeholder: 'Id automático' },
                        { name: 'nombre_cliente', label: 'Nombre cliente', type: 'text', placeholder: 'Ingrese el nombre del cliente' },
                        { name: 'direccion_cliente', label: 'Dirección cliente', type: 'text', placeholder: 'Ingrese la dirección del cliente' },
                        { name: 'email_cliente', label: 'Email cliente', type: 'email', placeholder: 'Ingrese el correo del cliente' },
                        { name: 'telefono_cliente', label: 'Teléfono cliente', type: 'text', placeholder: 'Ingrese el teléfono del cliente' },
                        {
                            name: 'tipo_cliente_id',
                            label: 'Tipo cliente',
                            type: 'select',
                            options: tiposClientes.map(tipo => ({ value: tipo.id, label: tipo.tipo })),
                            placeholder: 'Seleccione el tipo de cliente'
                        },
                    ]}
                    endpoint="clientes"
                    disabledFields={['id']}
                />
            )}
            {isEditModalOpen && (
                <ModalEditar
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        fetchData();
                    }}
                    editingItem={editingItem}
                    titulo="Editar Cliente"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'nombre_cliente', label: 'Nombre cliente', type: 'text', placeholder: 'Ingrese el nombre del cliente' },
                        { name: 'direccion_cliente', label: 'Dirección cliente', type: 'text', placeholder: 'Ingrese la dirección del cliente' },
                        { name: 'email_cliente', label: 'Email cliente', type: 'email', placeholder: 'Ingrese el correo del cliente' },
                        { name: 'telefono_cliente', label: 'Teléfono cliente', type: 'text', placeholder: 'Ingrese el teléfono del cliente' },
                        {
                            name: 'tipo_cliente_id',
                            label: 'Tipo cliente',
                            type: 'select',
                            options: tiposClientes.map(tipo => ({ value: tipo.id, label: tipo.tipo })),
                            placeholder: 'Seleccione el tipo de cliente',
                        },
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        setDatos((prevDatos) =>
                            prevDatos.map((item) => (item.id === updatedItem.id ? updatedItem : item))
                        );
                        showAlert('Cliente editado exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint={"clientes"}
                />
            )}
        </div>
    );
};

export default Clientes;