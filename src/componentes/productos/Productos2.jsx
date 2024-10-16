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

const Productos2 = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [referenciasProductos, setReferenciasProductos] = useState([]);
    const [marcasProductos, setMarcasProductos] = useState([]);
    const [proveedorProductos, setProveedorProductos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);  // Página actual
    const [totalItems, setTotalItems] = useState(0);  // Total de elementos
    const itemsPerPage = 1;  // Número de elementos por página

    const fetchReferenciasProductos = async () => {
        try {
            const { data, error } = await supabase
                .from('referencias_productos')  
                .select('*');  

            if (error) {
                throw error;
            }
            setReferenciasProductos(data);
        } catch (error) {
            console.error('Error al obtener las referencias de los productos:', error);
        }
    };

    const fetchMarcasProductos = async () => {
        try {
            const { data, error } = await supabase
                .from('marcas_productos')  
                .select('*');  

            if (error) {
                throw error;
            }
            setMarcasProductos(data);
        } catch (error) {
            console.error('Error al obtener las marcas de los productos:', error);
        }
    };

    const fetchProveedorProductos = async () => {
        try {
            const { data, error } = await supabase
                .from('proveedores')  
                .select('*');  

            if (error) {
                throw error;
            }
            setProveedorProductos(data);
        } catch (error) {
            console.error('Error al obtener el proveedor del producto:', error);
        }
    };

    const fetchData = async () => {
        try {
            const { data, error, count } = await supabase
                .from('productos')  
                .select(`
                    id,
                    nombre,
                    descripcion,
                    fecha_entrada,
                    nivel_minimo_stock,
                    precio_compra,
                    precio_venta,
                    stock,
                    marcas_productos( id, nombre ),
                    proveedores( id, nombre_proveedor ),
                    referencias_productos( id,codigo )
                `, { count: 'exact' })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);  // Paginación 

            if (error) {
                throw error;
            }

            const referenciasProductos = data.map(({ marcas_productos, proveedores, referencias_productos, ...resto }) => ({
                ...resto,
                marca_id: marcas_productos.id,
                marca: marcas_productos.nombre,
                proveedor_id: proveedores.id,
                proveedor: proveedores.nombre_proveedor,
                referencia_id: referencias_productos.id,
                referencia: referencias_productos.codigo
            }));

            setColumnas(Object.keys(referenciasProductos[0]));
            setDatos(referenciasProductos);
            setTotalItems(count);  // Actualizar total de elementos
            console.log("PRODUCTOS")
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    // Actualizaciones en tiempo real
    useEffect(() => {
        fetchData();
        fetchReferenciasProductos();
        fetchMarcasProductos();
        fetchProveedorProductos();

        const channel = supabase
            .channel('custom-all-channel') 
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'productos' }, 
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

    const handleAdd = () => setIsAddModalOpen(true);

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('productos')  
                .delete()
                .eq('id', id);  

            if (error) {
                throw error;
            }

            fetchData();  
            showAlert('Producto eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            showAlert('Error al eliminar el producto', 'error');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return ''; // Si no es una fecha válida, devolver una cadena vacía o manejarlo de otra manera
        }
        return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    };

    const handleSearchResults = (resultados) => {
        setDatos(resultados); // Actualizar los datos con los resultados de la búsqueda
    };
    

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    titulo={"Productos"}
                    subtitulo={"Gestiona los Productos y sus características"}
                >
                    <Alert message={alertMessage.message} type={alertMessage.type} />
                    <SearchBar
                        placeholder="Buscar productos..."
                        rpcFunctionAll="obtener_productos"
                        rpcFunctionSearch="buscar_productos"
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
                        tableName="productos" // Nombre de la tabla en Supabase
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
                    onSubmit={(nuevoProducto) => {
                        showAlert('Producto agregado exitosamente', 'add');
                    }}
                    titulo="Agregar producto"
                    campos={[
                        { name: 'id', label: 'Id', type: 'number', placeholder: 'Id automático' },
                        { name: 'nombre', label: 'Nombre producto', type: 'text', placeholder: 'Ingrese el nombre del producto' },
                        { name: 'descripcion', label: 'Descripción', type: 'text', placeholder: 'Ingrese la descripción del producto' },
                        {
                            name: 'fecha_entrada',
                            label: 'Fecha de entrada',
                            type: 'date',
                            placeholder: 'Seleccione la fecha de entrada del producto',
                            value: formatDate(editingItem?.fecha_entrada)
                        },                        
                        {
                            name: 'marca_id',
                            label: 'Marca',
                            type: 'select',
                            options: marcasProductos.map(marca => ({ value: marca.id, label: marca.nombre })),
                            placeholder: 'Seleccione la marca del producto'
                        },
                        { name: 'nivel_minimo_stock', label: 'Nivel mínimo de stock', type: 'number', placeholder: 'Ingrese el nivel mínimo de stock' },
                        { name: 'precio_compra', label: 'Precio de compra', type: 'number', placeholder: 'Ingrese el precio de compra' },
                        { name: 'precio_venta', label: 'Precio de venta', type: 'number', placeholder: 'Ingrese el precio de venta' },
                        {
                            name: 'proveedor_id',
                            label: 'Proveedor',
                            type: 'select',
                            options: proveedorProductos.map(proveedor => ({ value: proveedor.id, label: proveedor.nombre_proveedor })),
                            placeholder: 'Seleccione el proveedor del producto'
                        },
                        {
                            name: 'referencia_id',
                            label: 'Referencia',
                            type: 'select',
                            options: referenciasProductos.map(referencia => ({ value: referencia.id, label: referencia.codigo })),
                            placeholder: 'Seleccione la referencia del producto'
                        },
                        { name: 'stock', label: 'Stock', type: 'number', placeholder: 'Ingrese la cantidad en stock' },
                    ]}
                    endpoint="productos"
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
                    titulo="Editar producto"
                    campos={[
                        { name: 'id', label: 'Id', type: 'number', placeholder: 'Id automático' },
                        { name: 'nombre', label: 'Nombre producto', type: 'text', placeholder: 'Ingrese el nombre del producto' },
                        { name: 'descripcion', label: 'Descripción', type: 'text', placeholder: 'Ingrese la descripción del producto' },
                        {
                            name: 'fecha_entrada',
                            label: 'Fecha de entrada',
                            type: 'date',
                            placeholder: 'Seleccione la fecha de entrada del producto',
                            value: formatDate(editingItem?.fecha_entrada)
                        },                        
                        {
                            name: 'marca_id',
                            label: 'Marca',
                            type: 'select',
                            options: marcasProductos.map(marca => ({ value: marca.id, label: marca.nombre })),
                            placeholder: 'Seleccione la marca del producto'
                        },
                        { name: 'nivel_minimo_stock', label: 'Nivel mínimo de stock', type: 'number', placeholder: 'Ingrese el nivel mínimo de stock' },
                        { name: 'precio_compra', label: 'Precio de compra', type: 'number', placeholder: 'Ingrese el precio de compra' },
                        { name: 'precio_venta', label: 'Precio de venta', type: 'number', placeholder: 'Ingrese el precio de venta' },
                        {
                            name: 'proveedor_id',
                            label: 'Proveedor',
                            type: 'select',
                            options: proveedorProductos.map(proveedor => ({ value: proveedor.id, label: proveedor.nombre_proveedor })),
                            placeholder: 'Seleccione el proveedor del producto'
                        },
                        {
                            name: 'referencia_id',
                            label: 'Referencia',
                            type: 'select',
                            options: referenciasProductos.map(referencia => ({ value: referencia.id, label: referencia.codigo })),
                            placeholder: 'Seleccione la referencia del producto'
                        },
                        { name: 'stock', label: 'Stock', type: 'number', placeholder: 'Ingrese la cantidad en stock' },
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        showAlert('producto editado exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint={"productos"}
                />
            )}
        </div>
    );
};

export default Productos2;