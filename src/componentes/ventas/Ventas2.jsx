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

const auth = getAuth(appFirebase);

const Ventas2 = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null)

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
    }, []);

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
                        table="ventas" // El nombre de tu tabla en Supabase
                        columns={["nota_venta"]} // Las columnas donde quieres realizar la búsqueda
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
                />
            )}
        </div>
    );
};

export default Ventas2;

