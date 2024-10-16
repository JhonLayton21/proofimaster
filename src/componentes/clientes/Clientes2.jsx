import React, { useEffect, useState } from "react";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import TablaGenerica from "../componentesTablasDatos/TablaGenerica";
import ModalEditar from "../componentesTablasDatos/ModalEditar";
import ModalAgregar from "../componentesTablasDatos/ModalAgregar";
import Alert from "../componentesTablasDatos/Alert";
import { supabase } from '../../../supabase';
import SearchBar from '../SearchBar';
import Paginacion from '../Busqueda_Filtrado_Paginacion/Paginacion';  

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
    const [currentPage, setCurrentPage] = useState(1);  // Página actual
    const [totalItems, setTotalItems] = useState(0);  // Total de elementos
    const itemsPerPage = 5;  // Número de elementos por página

    // Fetch de tipos de clientes
    const fetchTipoClientes = async () => {
        try {
            const { data, error } = await supabase
                .from('tipo_clientes')
                .select('*');

            if (error) {
                throw error;
            }
            setTiposClientes(data);
        } catch (error) {
            console.error('Error al obtener los tipos de cliente:', error);
        }
    };

    // Fetch de clientes con paginación
    const fetchData = async () => {
        try {
            const { data, error, count } = await supabase
                .from('clientes')
                .select(` 
                    id, 
                    nombre_cliente,
                    direccion_cliente,
                    email_cliente,
                    telefono_cliente,
                    tipo_clientes( id,tipo )
                `, { count: 'exact' })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);  // Paginación

            if (error) {
                throw error;
            }

            // Configurar tipo_clientes
            const clientesConTipoCliente = data.map(({ tipo_clientes, ...resto }) => ({
                ...resto,
                tipo_cliente_id: tipo_clientes.id,
                tipo_cliente: tipo_clientes.tipo
            }));

            setColumnas(Object.keys(clientesConTipoCliente[0] || {}));
            setDatos(clientesConTipoCliente);
            setTotalItems(count);  // Actualizar total de elementos
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    // Actualizaciones en tiempo real
    useEffect(() => {
        fetchData();
        fetchTipoClientes();

        const channel = supabase
            .channel('custom-all-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'clientes' },
                (payload) => {
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentPage]);  // Ejecutar fetchData al cambiar de página

    // Mostrar alertas
    const showAlert = (message, type = 'info') => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(''), 3000);
    };

    // Manejar agregar
    const handleAdd = () => setIsAddModalOpen(true);

    // Manejar editar
    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    // Manejar eliminar
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('clientes')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            fetchData();
            showAlert('Cliente eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
            showAlert('Error al eliminar el cliente', 'error');
        }
    };

    // Manejar resultados de búsqueda
    const handleSearchResults = (resultados) => {
        setDatos(resultados); // Actualizar los datos con los resultados de la búsqueda
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
                    <SearchBar
                        placeholder="Buscar clientes..."
                        table="clientes" 
                        columns={["nombre_cliente", "email_cliente", "telefono_cliente", "direccion_cliente"]} 
                        onSearchResults={handleSearchResults}
                    />
                    <TablaGenerica
                        columnas={columnas}
                        datos={datos}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAlert={showAlert}
                    />
                    <Paginacion
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalItems}
                        setTotalItems={setTotalItems}
                        itemsPerPage={itemsPerPage}
                        tableName="clientes" // Nombre de la tabla en Supabase
                        columns="*" // Columnas a seleccionar (puedes personalizar si lo deseas)
                        processData={(data) => data} // Procesar los datos (si es necesario)
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
                        showAlert('Cliente editado exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint="clientes"
                />
            )}
        </div>
    );
};

export default Clientes;


