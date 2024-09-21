import React, { useEffect, useState } from "react";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import TablaGenerica from "../componentesTablasDatos/TablaGenerica";
import ModalEditar from "../componentesTablasDatos/ModalEditar";
import ModalAgregar from "../componentesTablasDatos/ModalAgregar";
import Alert from "../componentesTablasDatos/Alert";
import { supabase } from '../../supabase';

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

    // Ejecuta las funciones cuando el componente se monta
    useEffect(() => {
        fetchData();
        fetchTipoClientes();
    }, []);

    // Función para obtener tipos de clientes desde Supabase
    const fetchTipoClientes = async () => {
        try {
            const { data, error } = await supabase
                .from('tipo_clientes')  // Nombre de la tabla
                .select('*');  // Selecciona todas las columnas

            if (error) {
                throw error;
            }
            setTiposClientes(data);
        } catch (error) {
            console.error('Error al obtener los tipos de cliente:', error);
        }
    };

    // Función para obtener clientes desde Supabase
    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('clientes')  // Nombre de la tabla
                .select('*');  // Selecciona todas las columnas

            if (error) {
                throw error;
            }
            setColumnas(Object.keys(data[0]));  // Asume que los datos tienen al menos una fila
            setDatos(data);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    // Función para mostrar alertas
    const showAlert = (message, type = 'info') => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(''), 3000);
    };

    // Manejador para abrir el modal de agregar
    const handleAdd = () => setIsAddModalOpen(true);

    // Manejador para abrir el modal de editar
    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    // Función para eliminar un cliente en Supabase
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('clientes')  // Nombre de la tabla
                .delete()
                .eq('id', id);  // Condición de eliminación por ID

            if (error) {
                throw error;
            }

            fetchData();  // Refresca los datos después de eliminar
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
