import React, { useEffect, useState } from "react";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import TablaGenerica from "../componentesTablasDatos/TablaGenerica";
import ModalEditar from "../componentesTablasDatos/ModalEditar";
import ModalAgregar from "../componentesTablasDatos/ModalAgregar";
import Alert from "../componentesTablasDatos/Alert";
import { supabase } from '../../../supabase';
import SearchBar from "../SearchBar";

const auth = getAuth(appFirebase);

const ReferenciaProductos = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    // DATOS REFERENCIAS PRODUCTOS
    const fetchData = async () => {
        const { data, error } = await supabase
                .from('referencias_productos')  
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
                { event: '*', schema: 'public', table: 'referencias_productos' }, 
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

    // Funcion eliminar
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('referencias_productos')  
                .delete()
                .eq('id', id);  

            if (error) {
                throw error;
            }
            showAlert('Referencia de producto eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar la referencia de producto:', error);
            showAlert('Error al eliminar la referencia de producto', 'error');
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
                    titulo={"Referencias de Productos"}
                    subtitulo={"Gestiona las referencias"}
                >
                    <Alert message={alertMessage.message} type={alertMessage.type} />
                    <SearchBar
                        placeholder="Buscar referencias..."
                        table="referencias_productos" // El nombre de tu tabla en Supabase
                        columns={["codigo"]} // Las columnas donde quieres realizar la búsqueda
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
                    onSubmit={(nuevaReferenciaProductos) => {
                        showAlert('Referencia de producto agregada exitosamente', 'add');
                    }}
                    titulo="Agregar Referencia de Producto"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'codigo', label: 'codigo', type: 'text', placeholder: 'Ingrese el codigo' },
                    ]}
                    endpoint="referencias_productos"
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
                    titulo="Editar Referencia de Producto"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'codigo', label: 'codigo', type: 'text', placeholder: 'Ingrese el codigo' },
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        showAlert('Referencia de producto editada exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint="referencias_productos"
                />
            )}
        </div>
    )
}

export default ReferenciaProductos;
