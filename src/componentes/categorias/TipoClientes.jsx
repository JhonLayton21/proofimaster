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

const auth = getAuth(appFirebase);

const TipoClientes = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    // DATOS TIPOS CLIENTES
    const fetchData = async () => {
        const { data, error } = await supabase
                .from('tipo_clientes')  
                .select('*');  

            if (error) {
                throw error;
            }
        setColumnas(Object.keys(data[0]));
        setDatos(data);
    };

    // Actualizaciones en tiempo real
    useEffect(() => {
        fetchData();

        const channel = supabase
            .channel('custom-all-channel') 
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'tipo_clientes' }, 
                (payload) => {
                    fetchData(); 
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel); 
        };
    }, []);

    const showAlert = (message, type = 'info') => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(''), 3000);
    };

    // Funcion Agregar
    const handleAdd = () => setIsAddModalOpen(true);

    // Funcion editar
    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    // Funcion Eliminar
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('tipo_clientes')  
                .delete()
                .eq('id', id);  

            if (error) {
                throw error;
            }
            fetchData();
            showAlert('Tipo de cliente eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el tipo de cliente:', error);
            showAlert('Error al eliminar el tipo de cliente', 'error');
        }
    };

    const handleSearchResults = (resultados) => {
        setDatos(resultados); // Actualizar los datos con los resultados de la búsqueda
    };


    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    showTablaProductos={false}
                    titulo={"Tipos de cliente"}
                    subtitulo={"Gestiona los tipos de clientes"}
                >
                    <Alert message={alertMessage.message} type={alertMessage.type} />
                    <SearchBar
                        placeholder="Buscar tipos cliente..."
                        table="tipo_clientes" // El nombre de tu tabla en Supabase
                        columns={["tipo"]} // Las columnas donde quieres realizar la búsqueda
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
                </MenuPrincipal>
            </div>
            {/* Modales agregar y editar items */}
            {isAddModalOpen && (
                <ModalAgregar
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        fetchData();
                    }}
                    onSubmit={(nuevoTipoClientes) => {
                        showAlert('Tipo de cliente agregado exitosamente', 'add');
                    }}
                    titulo="Agregar Tipo de Cliente"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'tipo', label: 'tipo', type: 'text', placeholder: 'Ingrese el tipo' },
                    ]}
                    endpoint="tipo_clientes"
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
                    titulo="Editar Tipo de Cliente"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'tipo', label: 'tipo', type: 'text', placeholder: 'Ingrese el tipo' },
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        showAlert('Método de pago editado exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint={"tipo_clientes"}
                />
            )}
        </div>
    )
}


export default TipoClientes;