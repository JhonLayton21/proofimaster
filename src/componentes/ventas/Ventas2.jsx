import React, { useEffect, useState } from "react";
import MenuPrincipal from "../MenuPrincipal";
import ModalAgregarVenta from "./ModalAgregarVenta";
import EditarVenta from "./EditarVenta";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import ModalEditarVenta from "./ModalEditarVenta";
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

const Ventas2 = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);  // Página actual
    const [totalItems, setTotalItems] = useState(0);  // Total de elementos
    const itemsPerPage = 5;  // Número de elementos por página

    useEffect(() => {
        fetchData();
    }, []);

    // Info base de datos
    const fetchData = async () => {
        try {
            const { data, error, count } = await supabase
                .from('ventas')
                .select(`
                    id,
                    clientes(nombre_cliente),
                    fecha_venta,
                    estado_venta(estado),
                    metodo_pago(metodo),
                    descuento_venta,
                    nota_venta,
                    metodo_envio_venta(metodo),
                    subtotal,
                    total,
                    venta_productos (
                        productos (nombre)
                    )
                `, { count: 'exact' })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);  // Paginación

            if (error) {
                throw error;
            }

            const referenciasVentas = data.map(({ clientes, estado_venta, metodo_pago, metodo_envio_venta, venta_productos, ...resto }) => ({
                ...resto,
                cliente: clientes.nombre_cliente,
                estado_venta: estado_venta.estado,
                metodo_pago: metodo_pago.metodo,
                metodo_envio_venta: metodo_envio_venta.metodo,
                productos: venta_productos.map(vp => vp.productos.nombre).join(', ')
            }));

            setColumnas(Object.keys(referenciasVentas[0]));
            setDatos(referenciasVentas);
            setTotalItems(count);  // Actualizar total de elementos
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
        }
    };

    // Actualizaciones en tiempo real
    useEffect(() => {
        fetchData();

        const channel = supabase
            .channel('custom-all-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'ventas' },
                (payload) => {
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentPage]);

    // Alerta segun el caso
    const showAlert = (message, type = 'info') => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(''), 3000);
    };

    // Agregar
    const handleAdd = () => setIsAddModalOpen(true);

    // Editar
    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    // Eliminar
    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('ventas')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }
            fetchData();
            showAlert('Venta eliminada exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar la venta:', error);
            showAlert('Error al eliminar la venta', 'error');
        }
    };

    const handleSearchResults = (resultados) => {
        setDatos(resultados); // Actualizar los datos con los resultados de la búsqueda
    };

    // Formateo fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return ''; // Si no es una fecha válida, devolver una cadena vacía o manejarlo de otra manera
        }
        return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
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
        doc.text(`Factura venta ${fechaActual}`, 10, 20);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");

        // Secciones de la factura
        doc.text("NOTA VENTA", 10, 35);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(`${data.nota_venta}`, 10, 40);

        /*doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 128, 0);
        doc.text("DESCRIPCIÓN PRODUCTO", 10, 45);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(`${data.descripcion}`, 10, 50);*/

        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 128, 0);
        doc.text("FECHA VENTA", 10, 55);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(`${data.fecha_venta}`, 10, 60);

        // Información adicional
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 128, 0);
        doc.text("ID FACTURA VENTA", 120, 35);
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

        // Línea superior de la tabla
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(10, 130, 200, 130);
        doc.setFont("helvetica", "bold");

        // Encabezados de la tabla
        doc.text("PRODUCTOS", 10, 135);
        doc.text("CLIENTE", 50, 135);
        doc.text("ESTADO", 88, 135);
        doc.text("M. PAGO", 115, 135);
        doc.text("M. ENVÍO", 140, 135);
        doc.text("DESCUENTO", 170, 135);

        // Línea inferior de la tabla
        doc.line(10, 138, 200, 138);
        doc.setFont("helvetica", "normal");

        // Ajuste de ancho máximo para columnas según el espacio disponible
        const maxWidthProductos = 40;
        const maxWidthCliente = 35;
        const maxWidthEstado = 25;
        const maxWidthMetodoPago = 25;
        const maxWidthMetodoEnvio = 25;
        const maxWidthDescuento = 20;

        // Obtener y ajustar texto en columnas
        const productosText = doc.splitTextToSize(`${data.productos}`, maxWidthProductos);
        const clienteText = doc.splitTextToSize(`${data.cliente}`, maxWidthCliente);
        const estadoText = doc.splitTextToSize(`${data.estado_venta}`, maxWidthEstado);
        const metodoPagoText = doc.splitTextToSize(`${data.metodo_pago}`, maxWidthMetodoPago);
        const metodoEnvioText = doc.splitTextToSize(`${data.metodo_envio_venta}`, maxWidthMetodoEnvio);
        const descuentoText = doc.splitTextToSize(
            `${data.descuento_venta.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} %`,
            maxWidthDescuento
        );

        // Añadir filas de productos en las posiciones `x` correctas para cada columna
        let y = 145;
        doc.text(productosText, 10, y);
        doc.text(clienteText, 50, y);
        doc.text(estadoText, 88, y);
        doc.text(metodoPagoText, 115, y);
        doc.text(metodoEnvioText, 140, y);
        doc.text(descuentoText, 170, y);

        // Añadir cuadro de subtotal, IVA y total en la parte inferior
        y += 20; // Espacio debajo de la tabla
        doc.line(10, y, 200, y); // Línea superior del cuadro de totales

        // Subtotal
        y += 10;
        doc.text("Subtotal", 15, y);
        doc.text(`${data.subtotal.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP`, 190, y, { align: "right" });

        // Total general en cuadro resaltado
        y += 20;
        doc.setDrawColor(255, 128, 0); // Cambiar color de borde a azul para el cuadro de total
        doc.setLineWidth(0.5);
        doc.rect(10, y - 10, 190, 15); // Dibuja el cuadro de total

        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 128, 0); // Cambiar color de texto a azul
        doc.text("TOTAL", 15, y);
        doc.text(`${data.total.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP`, 190, y, { align: "right" });



        addFooter(doc);

        // Guardar el archivo PDF
        doc.save(`Factura_Venta_${data.fecha_venta}.pdf`);
    };

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    titulo={"Ventas"}
                    subtitulo={"Seguimiento y control de transacciones"}
                >
                    <Alert message={alertMessage.message} type={alertMessage.type} />
                    <SearchBar
                        placeholder="Buscar ventas..."
                        rpcFunctionAll="obtener_ventas"
                        rpcFunctionSearch="buscar_ventas"
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
                        disableEdit={true}
                        generatePDF={generatePDF}
                        showDownloadButton={true}
                    />
                    <Paginacion
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalItems}
                        setTotalItems={setTotalItems}
                        itemsPerPage={itemsPerPage}
                        tableName="ventas" // Nombre de la tabla en Supabase
                        columns="*" // Columnas a seleccionar (puedes personalizar si lo deseas)
                        processData={(data) => data} // Procesar los datos (si es necesario)
                    />
                </MenuPrincipal>
            </div>
            {isAddModalOpen && (
                <ModalAgregarVenta
                    isOpen={isAddModalOpen}
                    onClose={() => { setIsAddModalOpen(false); fetchData(); }}
                    onSubmit={() => {
                        showAlert('Venta agregada exitosamente', 'add');
                    }}
                />
            )}
            {isEditModalOpen && (
                <ModalEditarVenta
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        fetchData();
                    }}
                    editingItem={editingItem} // El ítem que estás editando
                />
            )}
        </div>
    );
};

export default Ventas2;