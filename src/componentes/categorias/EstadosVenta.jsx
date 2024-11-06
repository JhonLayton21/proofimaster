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
import Paginacion from '../Busqueda_Filtrado_Paginacion/Paginacion';

const auth = getAuth(appFirebase);

const EstadosVenta = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);  // Página actual
    const [totalItems, setTotalItems] = useState(0);  // Total de elementos
    const itemsPerPage = 5;  // Número de elementos por página

    // DATOS ESTADOS VENTA
    const fetchData = async () => {
        const { data, error, count } = await supabase
                .from('estado_venta')  
                .select('*', {count: 'exact' })
                .order('id', { ascending: false })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);  // Paginación   

            if (error) {
                throw error;
            }
        setColumnas(Object.keys(data[0]));
        setDatos(data);
        setTotalItems(count);  // Actualizar total de elementos
    };

    useEffect(() => {
        fetchData();

        const channel = supabase
            .channel('custom-all-channel') 
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'estado_venta' }, 
                (payload) => {
                    fetchData(); 
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel); 
        };
    }, [currentPage]);

    const showAlert = (message, type = 'info') => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(''), 3000);
    };

    // Funcion agregar
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
                .from('estado_venta')  
                .delete()
                .eq('id', id);  

            if (error) {
                throw error;
            }
            fetchData();
            showAlert('Estado de venta eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el estado de venta:', error);
            showAlert('Error al eliminar el estado de venta', 'error');
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
                    titulo={"Estados de venta"}
                    subtitulo={"Gestiona los estados de venta y sus acciones"}
                >
                    <Alert message={alertMessage.message} type={alertMessage.type} />
                    <SearchBar
                        placeholder="Buscar estados de venta..."
                        rpcFunctionAll="obtener_estado_venta"
                        rpcFunctionSearch="buscar_estado_venta"
                        searchParams="search_query"
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
                        tableName="estado_venta" // Nombre de la tabla en Supabase
                        columns="*" // Columnas a seleccionar (puedes personalizar si lo deseas)
                        processData={(data) => data} // Procesar los datos (si es necesario)
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
                    onSubmit={(nuevoEstadoVenta) => {
                        showAlert('Estado de venta agregado exitosamente', 'add');
                    }}
                    titulo="Agregar Estado de Venta"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Identificador automático' },
                        { name: 'estado', label: 'Estado venta', type: 'text', placeholder: 'Ej: Completado, en progreso', required: true },
                    ]}
                    endpoint="estado_venta"
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
                    titulo="Editar Estado de Venta"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Identificador automático' },
                        { name: 'estado', label: 'Estado venta', type: 'text', placeholder: 'Ej: Completado, en progreso', required: true },
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        showAlert('Estado de venta editado exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint={"estado_venta"}
                />
            )}
        </div>
    )
}


export default EstadosVenta;