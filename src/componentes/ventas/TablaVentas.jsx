import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../credenciales";
import ModalAgregarVenta from "./ModalAgregarVenta";
import ModalEditarVenta from "./ModalEditarVenta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const TablaVentas = () => {

    /* Inicialización de estados */
    const [newSale, setNewSale] = useState({ nombreCliente: "", productos: [], fechaVenta: "", estadoVenta: "", metodoPago: "", descuentoVenta: "", metodoEnvio: "", subTotal: "", total: "" });
    const [editingSale, setEditingSale] = useState(null);
    const [ventas, setVentas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [estadoVentas, setEstadoVentas] = useState([]);
    const [metodoPago, setMetodoPago] = useState([]);
    const [metodoEnvio, setMetodoEnvio] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedSaleId, setExpandedSaleId] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    // FECTCH TABLAS NECESARIAS
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch productos
                const productosRes = await fetch("http://localhost:5000/productos");
                const productosData = await productosRes.json();
                setProductos(productosData);

                // Fetch clientes
                const clientesRes = await fetch("http://localhost:5000/clientes");
                const clientesData = await clientesRes.json();
                setClientes(clientesData);

                // Fetch estados de venta
                const estadoVentasRes = await fetch("http://localhost:5000/estado_venta");
                const estadoVentasData = await estadoVentasRes.json();
                setEstadoVentas(estadoVentasData);

                // Fetch métodos de pago
                const metodoPagoRes = await fetch("http://localhost:5000/metodo_pago");
                const metodoPagoData = await metodoPagoRes.json();
                setMetodoPago(metodoPagoData);

                // Fetch métodos de envío
                const metodoEnvioRes = await fetch("http://localhost:5000/metodo_envio_venta");
                const metodoEnvioData = await metodoEnvioRes.json();
                setMetodoEnvio(metodoEnvioData);
            } catch (error) {
                console.error("Error al obtener los datos", error);
            }
        };

        fetchData();
    }, []);

    // Función para mostrar la alerta
    const showAlert = (message, type = 'info') => {
        setAlertMessage( {message, type} );
        setTimeout(() => setAlertMessage(''), 3000); 
    };

    // Función eliminación venta
    const eliminarVenta = async (id) => {
        try {
            await fetch(`http://localhost:5000/ventas/${id}`, { method: 'DELETE' });
            setVentas(ventas.filter(ventas => ventas.id !== id));
            showAlert('Venta eliminada exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar la venta:', error);
        }
    }

    // Función para refrescar lista de ventas
    const refreshVentas = async () => {
        try {
            const response = await fetch('http://localhost:5000/ventas');
            const data = await response.json();
            setVentas(data);
        } catch (err) {
            console.error('Error al refrescar las ventas:', err.message);
        }
    };

    return (
        <div className="relative overflow-x-auto rounded-lg pt-8">
            {alertMessage && (
                <div className={`mb-4 px-4 py-3 rounded relative border ${
                    alertMessage.type === 'add' ? 'text-green-600 bg-green-100 border-green-400' :
                    alertMessage.type === 'edit' ? 'text-blue-600 bg-blue-100 border-blue-400' :
                    alertMessage.type === 'delete' ? 'text-red-600 bg-red-100 border-red-400' :
                    'text-yellow-600 bg-yellow-100 border-yellow-400'
                }`}>
                    {alertMessage.message}
                </div>                
            )}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-slate-50 dark:text-sl uppercase bg-[#f97316]">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID producto</th>
                        <th scope="col" className="px-6 py-3">Productos</th>
                        <th scope="col" className="px-6 py-3">Estado</th>
                        <th scope="col" className="px-6 py-3">Cliente</th>
                        <th scope="col" className="px-6 py-3">Total</th>
                        <th scope="col" className="px-2 py-3 text-right">
                            <button
                                className="text-neutral-100 font-bold bg-green-600 hover:bg-green-800 cursor-pointer"
                                onClick={() => setIsAddModalOpen(true)}>
                                <FontAwesomeIcon icon={faPlus} className="fa-xl mr-6" />
                                Agregar Venta
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                        <React.Fragment key={venta.id}>
                            <tr className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                                    <button
                                        onClick={() => setExpandedSaleId(expandedSaleId === venta.id ? null : venta.id)}
                                        className="focus:outline-none"
                                    >
                                        {expandedSaleId === venta.id ? '↓' : '→'}
                                    </button>
                                    {venta.productos.map(p => `${p.id} (${p.cantidad})`).join(", ")}
                                </th>
                                <td className="px-6 py-4">
                                    {venta.productos.map(p => p.nombre).join(", ")}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={
                                            venta.estado_venta === "Completado"
                                                ? "text-green-500"
                                                : venta.estado_venta === "En progreso"
                                                    ? "text-blue-500"
                                                    : venta.estado_venta === "Cancelado"
                                                        ? "text-red-500"
                                                        : "text-gray-500"
                                        }
                                    >
                                        {estadoVentas.find((estado) => estado === venta.estado_venta) || "Desconocido"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {venta.cliente_id}
                                </td>
                                <td className="px-6 py-4">
                                    {venta.total}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                                        onClick={() => {
                                            setEditingSale(venta);
                                            setIsEditModalOpen(true);
                                        }}>
                                        Editar
                                        <FontAwesomeIcon icon={faPenToSquare} className="ml-1" />
                                    </a>
                                    <a
                                        href="#"
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                        onClick={() => eliminarVenta(venta.id)}>
                                        Eliminar
                                        <FontAwesomeIcon icon={faTrashCan} className="ml-1" />
                                    </a>
                                </td>
                            </tr>
                            {expandedSaleId === venta.id && (
                                <tr className="bg-gray-50 dark:bg-[#202020]">
                                    <td colSpan="10" className="px-6 py-4">
                                        <div>
                                            <strong>Fecha de Venta:</strong> {venta.fecha_venta}
                                        </div>
                                        <div>
                                            <strong>Estado de Venta:</strong> {venta.estado_venta_id}
                                        </div>
                                        <div>
                                            <strong>Método de Pago:</strong> {venta.metodo_pago_id}
                                        </div>
                                        <div>
                                            <strong>Descuento:</strong> {venta.descuento_venta}
                                        </div>
                                        <div>
                                            <strong>Método de Envío:</strong> {venta.metodo_envio_venta_id}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Modal para agregar Venta */}
            <ModalAgregarVenta
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                newSale={newSale}
                refreshVentas={refreshVentas}
                onSuccess={() => showAlert('Venta agregada exitosamente', 'add')}
            />

            {/* Modal para editar Venta */}
            {editingSale && (
                <ModalEditarVenta
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    editingSale={editingSale}
                    refreshVentas={refreshVentas}
                    onSuccess={() => showAlert('Venta editada exitosamente', 'edit')}
                />
            )}
        </div>
    );
};

export default TablaVentas;


