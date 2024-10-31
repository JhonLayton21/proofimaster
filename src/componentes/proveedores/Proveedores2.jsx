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
import Paginacion from "../Busqueda_Filtrado_Paginacion/Paginacion";

const auth = getAuth(appFirebase);

const Proveedores2 = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [metodosPago, setMetodosPago] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
    const [totalItems, setTotalItems] = useState(0); // Estado para el total de proveedores
    const itemsPerPage = 3; // Número de elementos por página



    const fetchMetodosPago = async () => {
        try {
            const { data, error } = await supabase
                .from('metodo_pago')
                .select('*');

            if (error) {
                throw error;
            }
            setMetodosPago(data);
            console.log("PROVEEDORES")
        } catch (error) {
            console.error('Error al obtener los metodos de pago:', error);
        }
    };

    const fetchData = async () => {
        try {
            const { data, error, count } = await supabase
                .from('proveedores')
                .select(`
                    id, 
                    contacto_proveedor,
                    direccion_proveedor,
                    email_proveedor,
                    nombre_proveedor,
                    telefono_proveedor,
                    metodo_pago (id, metodo)
                `, { count: 'exact' })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

            if (error) {
                throw error;
            }

            // Usamos desestructuración directamente dentro del map para aplanar el objeto 'metodo_pago'
            const proveedoresConMetodo = data.map(({ metodo_pago, ...resto }) => ({
                ...resto,
                metodo_pago_id: metodo_pago.id,
                metodo: metodo_pago.metodo
            }));

            // Actualizamos el estado con los datos ya modificados
            setColumnas(Object.keys(proveedoresConMetodo[0]));
            setDatos(proveedoresConMetodo);
            setTotalItems(count);  // Actualizar total de elementos
        } catch (error) {
            console.error('Error al obtener los proveedores:', error);
        }
    };

    // Actualizaciones en tiempo real
    useEffect(() => {
        fetchData();
        fetchMetodosPago();

        const channel = supabase
            .channel('custom-all-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'proveedores' },
                (payload) => {
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentPage]); // Ejecutar fetchData al cambiar de página


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
            const { error } = await supabase
                .from('proveedores')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            fetchData();
            showAlert('Proveedor eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
            showAlert('Error al eliminar el proveedor', 'error');
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
                    titulo={"Proveedores"}
                    subtitulo={"Gestiona los proveedores y su información básica"}
                >
                    <Alert message={alertMessage.message} type={alertMessage.type} />
                    <SearchBar
                        placeholder="Buscar proveedores..."
                        rpcFunctionAll="obtener_proveedores"
                        rpcFunctionSearch="buscar_proveedores"
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
                        tableName="proveedores" // Nombre de la tabla en Supabase
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
                    onSubmit={(nuevoProveedor) => {
                        showAlert('Proveedor agregado exitosamente', 'add');
                    }}
                    titulo="Agregar Proveedor"
                    campos={[
                        { name: 'id', label: 'Id', type: 'number', placeholder: 'Identificador automático' },
                        { name: 'nombre_proveedor', label: 'Nombre proveedor', type: 'text', placeholder: 'Ej: Proveedor ABC S.A.', required: true },
                        { name: 'contacto_proveedor', label: 'Contacto proveedor', type: 'text', placeholder: 'Ej: Carlos Gúzman', required: false },
                        { name: 'direccion_proveedor', label: 'Dirección proveedor', type: 'text', placeholder: 'Ej: Carrera 123, Calle 321', required: false },
                        { name: 'email_proveedor', label: 'Email proveedor', type: 'email', placeholder: 'Ej: proveedorabc@gmail.com', required: true },
                        { name: 'telefono_proveedor', label: 'Teléfono proveedor', type: 'text', placeholder: 'Ej: 312789654', required: true },
                        {
                            name: 'metodo_pago_id',
                            label: 'Método pago proveedor',
                            type: 'select',
                            options: metodosPago.map(metodo => ({ value: metodo.id, label: metodo.metodo })),
                            placeholder: 'Seleccione el método de pago de proveedor',
                            required: true
                        },
                    ]}
                    endpoint="proveedores"
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
                    titulo="Editar proveedor"
                    campos={[
                        { name: 'id', label: 'Id', type: 'number', placeholder: 'Identificador automático' },
                        { name: 'nombre_proveedor', label: 'Nombre proveedor', type: 'text', placeholder: 'Ej: Proveedor ABC S.A.', required: true },
                        { name: 'contacto_proveedor', label: 'Contacto proveedor', type: 'text', placeholder: 'Ej: Carlos Gúzman', required: false },
                        { name: 'direccion_proveedor', label: 'Dirección proveedor', type: 'text', placeholder: 'Ej: Carrera 123, Calle 321', required: false },
                        { name: 'email_proveedor', label: 'Email proveedor', type: 'email', placeholder: 'Ej: proveedorabc@gmail.com', required: true },
                        { name: 'telefono_proveedor', label: 'Teléfono proveedor', type: 'text', placeholder: 'Ej: 312789654', required: true },
                        {
                            name: 'metodo_pago_id',
                            label: 'Método pago proveedor',
                            type: 'select',
                            options: metodosPago.map(metodo => ({ value: metodo.id, label: metodo.metodo })),
                            placeholder: 'Seleccione el método de pago de proveedor',
                            required: true
                        },
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        showAlert('Proveedor editado exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint={"proveedores"}
                />
            )}
        </div>
    );
};

export default Proveedores2;
