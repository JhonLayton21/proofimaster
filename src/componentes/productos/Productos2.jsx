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
import { jsPDF } from "jspdf";
import { addFooter } from '../informes/PDFUtils';

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
    const itemsPerPage = 5;  // Número de elementos por página

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

    // Función para generar el PDF de factura
    const generatePDF = (data) => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });
    
        // Fecha y hora actual
        const fechaActual = new Date().toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    
        // Configuración de estilos
        doc.setFont("helvetica");
        doc.setFontSize(20);
        doc.setTextColor(255, 128, 0);
    
        // Título principal
        doc.setFont("helvetica", "bold");
        doc.text(`Factura ${data.nombre} ${new Date().toLocaleDateString()}`, 10, 20);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
    
        // Secciones de la factura
        doc.text("NOMBRE PRODUCTO", 10, 35);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(`${data.nombre}`, 10, 40);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 128, 0);
        doc.text("DESCRIPCIÓN PRODUCTO", 10, 45);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(`${data.descripcion}`, 10, 50);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 128, 0);
        doc.text("FECHA ENTRADA PRODUCTO", 10, 55);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(`${data.fecha_entrada}`, 10, 60);
    
        // Información adicional
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 128, 0);
        doc.text("ID FACTURA PRODUCTO", 120, 35);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text(`${data.id}`, 197, 35);
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 128, 0);
        doc.text("FECHA FACTURA", 120, 45);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text(`${fechaActual}`, 160, 45);

         // Información de la factura
         doc.setTextColor(0, 0, 0);
         doc.setFontSize(12);
         doc.setFont("helvetica", "bold");
         doc.setTextColor(255, 128, 0);
         doc.text("EMPRESA", 10, 75);
         
         doc.setFont("helvetica", "bold");
         doc.setTextColor(255, 128, 0);
         doc.text("NIT", 10, 85);
         
         doc.setFont("helvetica", "bold");
         doc.setTextColor(255, 128, 0);
         doc.text("DIRECCIÓN", 10, 95);
         
         doc.setFont("helvetica", "bold");
         doc.setTextColor(255, 128, 0);
         doc.text("NÚMERO TELEFÓNICO", 10, 105);
         
         doc.setFont("helvetica", "normal");
         doc.setTextColor(0, 0, 0);
         doc.text("Proofisilas", 10, 80);
         doc.text("1234567890", 10, 90);
         doc.text("Calle 48 A No. 28-26 Sur", 10, 100);
         doc.text("313 345 37 96", 10, 110);
    
        // Tabla de productos
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(10, 130, 200, 130);
        doc.setFont("helvetica", "bold");
        doc.text("CANT.", 10, 135);
        doc.text("MARCA", 30, 135);
        doc.text("REFERENCIA", 60, 135);
        doc.text("PROVEEDOR", 100, 135);
        doc.text("PRECIO C/U", 140, 135);
        doc.text("TOTAL", 175, 135);
        doc.line(10, 138, 200, 138);
        doc.setFont("helvetica", "normal");
    
        // Ajuste de ancho máximo para columnas
        const maxWidth = 30;
    
        // Obtener y ajustar texto en columnas
        const cantText = doc.splitTextToSize(`${data.stock}`, maxWidth);
        const marcaText = doc.splitTextToSize(`${data.marca}`, maxWidth);
        const referenciaText = doc.splitTextToSize(`${data.referencia}`, maxWidth);
        const proveedorText = doc.splitTextToSize(`${data.proveedor}`, maxWidth);
        const precioCompraText = doc.splitTextToSize(
            `${data.precio_compra.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP`,
            maxWidth
        );
        const totalText = doc.splitTextToSize(
            `${(data.stock * data.precio_compra).toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP`,
            maxWidth
        );
    
        // Añadir filas de productos
        let y = 145;
        doc.text(cantText, 10, y);
        doc.text(marcaText, 30, y);
        doc.text(referenciaText, 60, y);
        doc.text(proveedorText, 100, y);
        doc.text(precioCompraText, 140, y);
        doc.text(totalText, 175, y);

        addFooter(doc);
    
        // Guardar el archivo PDF
        doc.save(`Factura_${data.nombre}.pdf`);
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
                        generatePDF={generatePDF}
                        showDownloadButton={true}
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