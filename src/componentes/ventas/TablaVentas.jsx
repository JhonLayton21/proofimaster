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

    /* Efecto para suscribirse a las actualizaciones en tiempo real */
    useEffect(() => {
        const ventasRef = collection(db, "ventas");
        const productosRef = collection(db, "productos");
        const clientesRef = collection(db, "clientes");
        const estadoVentaRef = collection(db, "estadoVenta");
        const metodoPagoRef = collection(db, "MetodoPagoProveedores");
        const metodoEnvioRef = collection(db, "metodoEnvioVenta");

        const unsubscribeVentas = onSnapshot(ventasRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setVentas(data);
        });

        const unsubscribeProductos = onSnapshot(productosRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProductos(data);
        });

        const unsubscribeClientes = onSnapshot(clientesRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setClientes(data);
        });

        const unsubscribeEstadoVenta = onSnapshot(estadoVentaRef, (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data().estado);
            setEstadoVentas(data);
        });

        const unsubscribeMetodoPago = onSnapshot(metodoPagoRef, (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data().tipo);
            setMetodoPago(data);
        });

        const unsubscribeMetodoEnvio = onSnapshot(metodoEnvioRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMetodoEnvio(data);
        });

        // Limpiar suscripciones al desmontar el componente
        return () => {
            unsubscribeVentas();
            unsubscribeProductos();
            unsubscribeClientes();
            unsubscribeEstadoVenta();
            unsubscribeMetodoPago();
            unsubscribeMetodoEnvio();
        };
    }, []);

    const agregarVenta = async (venta) => {
        const ventasRef = collection(db, 'ventas');

        await addDoc(ventasRef, {
            ...venta,
            subTotal: venta.subTotal,
            total: venta.total
        });

        setNewSale({
            nombreCliente: "",
            productos: [],
            fechaVenta: "",
            estadoVenta: "",
            metodoPago: "",
            descuentoVenta: "",
            metodoEnvio: "",
            subTotal: "",
            total: ""
        });
        setIsAddModalOpen(false);
    };


    const editarVenta = async (e) => {
        e.preventDefault();
        const VentaDoc = doc(db, 'ventas', editingSale.id);

        await updateDoc(VentaDoc, editingSale);

        setEditingSale(null);
        setIsEditModalOpen(false);
    };

    const eliminarVenta = async (id) => {
        const VentaDoc = doc(db, 'ventas', id);
        await deleteDoc(VentaDoc);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSale({ ...newSale, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingSale({ ...editingSale, [name]: value });
    };

    return (
        <div className="relative overflow-x-auto rounded-lg pt-8">
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
                                    {venta.productos.map(p => p.nombreProducto).join(", ")}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={
                                            venta.estadoVenta === "Completado"
                                                ? "text-green-500"
                                                : venta.estadoVenta === "En progreso"
                                                    ? "text-blue-500"
                                                    : venta.estadoVenta === "Cancelado"
                                                        ? "text-red-500"
                                                        : "text-gray-500"
                                        }
                                    >
                                        {estadoVentas.find((estado) => estado === venta.estadoVenta) || "Desconocido"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {venta.cliente ? venta.cliente.nombreCliente : "Desconocido"}
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
                                            <strong>Fecha de Venta:</strong> {venta.fechaVenta}
                                        </div>
                                        <div>
                                            <strong>Estado de Venta:</strong> {venta.estadoVenta}
                                        </div>
                                        <div>
                                            <strong>Método de Pago:</strong> {venta.metodoPago}
                                        </div>
                                        <div>
                                            <strong>Descuento:</strong> {venta.descuentoVenta}
                                        </div>
                                        <div>
                                            <strong>Método de Envío:</strong> {venta.metodoEnvio}
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
                onSubmit={agregarVenta}
                newSale={newSale}
                onInputChange={handleInputChange}
                productos={productos}
                clientes={clientes}
                estadoVentas={estadoVentas}
                metodoPago={metodoPago}
                metodoEnvio={metodoEnvio}
            />

            {/* Modal para editar Venta */}
            {editingSale && (
                <ModalEditarVenta
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={editarVenta}
                    editingSale={editingSale}
                    onInputChange={handleEditInputChange}
                    productos={productos}
                    clientes={clientes}
                    estadoVentas={estadoVentas}
                    metodoPago={metodoPago}
                    metodoEnvio={metodoEnvio}
                />
            )}
        </div>
    );
};

export default TablaVentas;


