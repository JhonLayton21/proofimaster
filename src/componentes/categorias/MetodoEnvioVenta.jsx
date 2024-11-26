import React, { useEffect, useState } from "react";
import MenuPrincipal from "../MenuPrincipal";
import TablaGenerica from "../componentesTablasDatos/TablaGenerica";
import ModalEditar from "../componentesTablasDatos/ModalEditar";
import ModalAgregar from "../componentesTablasDatos/ModalAgregar";
import Alert from "../componentesTablasDatos/Alert";
import { supabase } from '../../../supabase';
import SearchBar from "../SearchBar";
import Paginacion from "../Busqueda_Filtrado_Paginacion/Paginacion";

const MetodoEnvioVenta = () => {
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);  // Página actual
    const [totalItems, setTotalItems] = useState(0);  // Total de elementos
    const itemsPerPage = 10;  // Número de elementos por página
    const [userEmail, setUserEmail] = useState("");

    // Obtener el correo electrónico del usuario
    useEffect(() => {
        const fetchUserEmail = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email);
            }
        };
        fetchUserEmail();
    }, []);
    
    // DATOS METODOS ENVIO VENTAS
    const fetchData = async () => {
        const { data, error, count } = await supabase
                .from('metodo_envio_venta')  
                .select('*', { count: 'exact' })
                .order('id', { ascending: false })
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
                { event: '*', schema: 'public', table: 'metodo_envio_venta' }, 
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
                .from('metodo_envio_venta')  
                .delete()
                .eq('id', id);  

            if (error) {
                throw error;
            }
            fetchData();
            showAlert('Método de pago eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el método de pago:', error);
            showAlert('Error al eliminar el método de pago', 'error');
        }
    };
    
    const handleSearchResults = (resultados) => {
        setDatos(resultados);
    }

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    showTablaProductos={false}
                    titulo={"Métodos de Envíos"}
                    subtitulo={"Gestiona los métodos de envío y sus precios"}
                >
                    <Alert message={alertMessage.message} type={alertMessage.type} />
                    <SearchBar
                        placeholder="Buscar métodos de envío..."
                        rpcFunctionAll="obtener_metodo_envio_venta"
                        rpcFunctionSearch="buscar_metodo_envio_venta"
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
                        setIsEditModalOpen={setIsEditModalOpen}
                        setEditingItem={setEditingItem}
                    />
                    <Paginacion
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalItems}
                        setTotalItems={setTotalItems}
                        itemsPerPage={itemsPerPage}
                        tableName="metodo_envio_venta" // Nombre de la tabla en Supabase
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
                    onSubmit={(nuevoMetodoEnvioVenta) => {
                        showAlert('Metodo de envio de venta agregado exitosamente', 'add');
                    }}
                    titulo="Agregar Método de Envío"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Identificador automático' },
                        { name: 'metodo', label: 'Método envío', type: 'text', placeholder: 'Ej: Envío express, estándar', required: true },
                        { name: 'precio', label: 'Precio método envío (COP)', type: 'text', placeholder: 'Ej: 30000', required: true },
                    ]}
                    endpoint="metodo_envio_venta"
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
                    titulo="Editar Método de Envío"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Identificador automático' },
                        { name: 'metodo', label: 'Método envío', type: 'text', placeholder: 'Ej: Envío express, estándar', required: true },
                        { name: 'precio', label: 'Precio método envío (COP)', type: 'text', placeholder: 'Ej: 30000', required: true },
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        showAlert('Método de envio de venta editado exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint={"metodo_envio_venta"}
                />
            )}
        </div>
    )
}


export default MetodoEnvioVenta;