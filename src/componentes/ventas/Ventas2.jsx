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

const auth = getAuth(appFirebase);

const Ventas2 = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    // Info base de datos
    const fetchData = async () => {
        try {
            const { data, error } = await supabase
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
                `);

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
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
        }
    };

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

    // Formateo fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return ''; // Si no es una fecha válida, devolver una cadena vacía o manejarlo de otra manera
        }
        return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
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
            {isAddModalOpen && (
                <ModalAgregarVenta
                    isOpen={isAddModalOpen}
                    onClose={() => { setIsAddModalOpen(false); fetchData(); }}
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
                    tipoClientes={tipoClientes} // Los tipos de clientes que le pasas como prop
                    estadoVentas={estadoVentas} // Los estados de ventas que le pasas como prop
                    metodoPago={metodoPago} // Los métodos de pago que le pasas como prop
                    metodoEnvio={metodoEnvio} // Los métodos de envío que le pasas como prop
                />
            )}
        </div>
    );
};

export default Ventas2;

