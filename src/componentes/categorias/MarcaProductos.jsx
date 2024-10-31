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

const MarcaProductos = () => {
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

    // DATOS MARCA PRODUCTOS
    const fetchData = async () => {
        const { data, error, count } = await supabase
                .from('marcas_productos')  
                .select('*', { count: 'exact' })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);  // Paginación   

            if (error) {
                throw error;
            }
        setColumnas(Object.keys(data[0]));
        setDatos(data);
        setTotalItems(count);  // Actualizar total de elementos
    };

    // Actualizaciones en tiempo real
    useEffect(() => {
        fetchData();

        const channel = supabase
            .channel('custom-all-channel') 
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'marcas_productos' }, 
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
                .from('marcas_productos')  
                .delete()
                .eq('id', id);  

            if (error) {
                throw error;
            }
            fetchData();
            showAlert('Marca de producto eliminada exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar la marca de producto:', error);
            showAlert('Error al eliminar la marca de producto', 'error');
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
                    titulo={"Marcas de productos"}
                    subtitulo={"Gestiona las marcas de tus productos"}
                >
                    <Alert message={alertMessage.message} type={alertMessage.type} />
                    <SearchBar
                        placeholder="Buscar marcas..."
                        rpcFunctionAll="obtener_marcas_productos"
                        rpcFunctionSearch="buscar_marcas_productos"
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
                        tableName="marcas_productos" // Nombre de la tabla en Supabase
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
                    onSubmit={(nuevaMarcaProducto) => {
                        showAlert('Marca de producto agregada exitosamente', 'add');
                    }}
                    titulo="Agregar Marca de Producto"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Identificador automático' },
                        { name: 'nombre', label: 'Nombre marca', type: 'text', placeholder: 'Ej: Sydney, Barcelona, etc', required: true },
                    ]}
                    endpoint="marcas_productos"
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
                    titulo="Editar Marca de Producto"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Identificador automático' },
                        { name: 'nombre', label: 'Nombre marca', type: 'text', placeholder: 'Ej: Sydney, Barcelona, etc', required: true },
                    ]}
                    initialData={editingItem}
                    disabledFields={['id']}
                    onSubmit={(updatedItem) => {
                        showAlert('Marca de producto editado exitosamente', 'edit');
                    }}
                    endpoint={"marcas_productos"}
                />
            )}
        </div>
    )
}


export default MarcaProductos;