import React, { useEffect, useState } from "react";
import MenuPrincipal from "../MenuPrincipal";
import TablaGenerica from "../componentesTablasDatos/TablaGenerica";
import ModalEditar from "../componentesTablasDatos/ModalEditar";
import ModalAgregar from "../componentesTablasDatos/ModalAgregar";
import Alert from "../componentesTablasDatos/Alert";
import { supabase } from '../../../supabase';
import SearchBar from "../SearchBar";
import Paginacion from "../Busqueda_Filtrado_Paginacion/Paginacion";

const MetodosPago = () => {
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);  // Página actual
    const [totalItems, setTotalItems] = useState(0);  // Total de elementos
    const itemsPerPage = 5;  // Número de elementos por página
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
    
    // Actualizaciones en tiempo real
    useEffect(() => {
        fetchData();

        const channel = supabase
            .channel('custom-all-channel') 
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'metodo_pago' }, 
                (payload) => {
                    fetchData(); 
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel); 
        };
    }, [currentPage]);

    const fetchData = async () => {
        const { data, error, count } = await supabase
                .from('metodo_pago')  
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

    const showAlert = (message, type = 'info') => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(''), 3000);
    };

    const handleAdd = () => setIsAddModalOpen(true);

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    // Funcion eliminar
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('metodo_pago')  
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
        setDatos(resultados); // Actualizar los datos con los resultados de la búsqueda
    };

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    titulo={"Métodos de Pago"}
                    subtitulo={"Gestiona los tipos y métodos de pago de la empresa"}
                >
                    <Alert message={alertMessage.message} type={alertMessage.type} />
                    <SearchBar
                        placeholder="Buscar métodos de pago..."
                        rpcFunctionAll="obtener_metodos_pago"
                        rpcFunctionSearch="buscar_metodos_pago"
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
                        tableName="metodo_pago" // Nombre de la tabla en Supabase
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
                    onSubmit={(nuevoMetodoPago) => {
                        showAlert('Método de pago agregado exitosamente', 'add');
                    }}
                    titulo="Agregar Método de Pago"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Identificador automático' },
                        { name: 'metodo', label: 'metodo', type: 'text', placeholder: 'Ej: Crédito, débito, etc', required: true },
                    ]}
                    endpoint="metodo_pago"
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
                    titulo="Editar Método de Pago"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Identificador automático' },
                        { name: 'metodo', label: 'metodo', type: 'text', placeholder: 'Ej: Crédito, débito, etc', required: true },
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        showAlert('Método de pago editado exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint={"metodo_pago"}
                />
            )}
        </div>
    );
};


export default MetodosPago;
