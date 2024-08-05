import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../credenciales";
import ModalAgregarVenta from "./ModalAgregarVenta";
import ModalEditarVenta from "./ModalEditarVenta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const TablaVentas = () => {

    /* Inicialización de estados */
    const [newSale, setNewSale] = useState({ nombreCliente: "", productos: [], estadoVenta: "", metodoPago: "", descuentoVenta: "" });
    const [editingSale, setEditingSale] = useState(null);
    const [ventas, setVentas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [estadoVentas, setEstadoVentas] = useState([]);
    const [metodoPago, setMetodoPago] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expandedSaleId, setExpandedSaleId] = useState(null);

    /* Efecto para recuperar los datos */
    useEffect(() => {

        const obtenerVentas = async () => {
            try {
                const ventasRef = collection(db, "ventas");
                const snapshot = await getDocs(ventasRef);

                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setVentas(data); // Asignar los datos obtenidos al estado
            } catch (error) {
                console.error("Error al mostrar ventas: ", error);
            }
        }

        const obtenerProductos = async () => {
            try {
                const productosRef = collection(db, "productos");
                const snapshot = await getDocs(productosRef);

                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProductos(data); // Asignar los datos obtenidos al estado
            } catch (error) {
                console.error("Error al mostrar productos: ", error);
            }
        }

        const obtenerClientes = async () => {
            try {
                const clientesRef = collection(db, "clientes");
                const snapshot = await getDocs(clientesRef);

                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setClientes(data); // Asignar los datos obtenidos al estado
            } catch (error) {
                console.error("Error al mostrar los clientes");
            }
        }

        const obtenerEstadoVenta = async () => {
            try {
                const estadoVentaRef = collection(db, "estadoVenta");
                const snapshot = await getDocs(estadoVentaRef);

                const data = snapshot.docs.map(doc => doc.data().estado);
                setEstadoVentas(data);
            } catch (error) {
                console.error("Error al mostrar los estados de venta");
            }
        }

        const obtenerMetodoPago = async () => {
            try {
                const metodoPagoRef = collection(db, "MetodoPagoProveedores");
                const snapshot = await getDocs(metodoPagoRef);

                const data = snapshot.docs.map(doc => doc.data().tipo);
                setMetodoPago(data);
            } catch (error) {
                console.error("Error al mostrar los metodos de pago");
            }
        }

        obtenerMetodoPago();
        obtenerEstadoVenta();
        obtenerClientes();
        obtenerVentas();
        obtenerProductos();
    }, []);

    const agregarVenta = async (venta) => {
        const ventasRef = collection(db, 'ventas');

        await addDoc(ventasRef, venta);

        setNewSale({
            nombreCliente: "",
            productos: [], 
            estadoVenta: "",
            metodoPago: "",
            descuentoVenta: ""
        });
        setIsAddModalOpen(false);
    };

    const editarVenta = async (e) => {
        e.preventDefault();
        const VentaDoc = doc(db, 'ventas', editingSale.id);

        /* Actualizar documento existente en ventas */
        await updateDoc(VentaDoc, editingSale);

        /* Limpiar estado de Venta en edición y cerrar modal de edición */
        setEditingSale(null);
        setIsEditModalOpen(false);
    };

    const eliminarVenta = async (id) => {
        const VentaDoc = doc(db, 'ventas', id);

        /* Eliminar documento de la colección ventas */
        await deleteDoc(VentaDoc);
    };

    /* Manejar cambios en el formulario de agregar Venta */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSale({ ...newSale, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingSale({ ...editingSale, [name]: value });
    };

    // Renderizado de la tabla de ventas y modales de agregar/editar
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
                                <td className="px-6 py-4"></td>
                                <td className="px-6 py-4"></td>
                                <td className="px-6 py-4"></td>
                                <td className="px-6 py-4"></td>
                                <td className="px-6 py-4 text-right">
                                    <a
                                        href="#"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                                        onClick={() => {
                                            setEditingSale(venta);
                                            setIsEditModalOpen(true);
                                        }}>
                                        Editar
                                        <FontAwesomeIcon icon={faPenToSquare} className=" ml-1" />
                                    </a>
                                    <a
                                        href="#"
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                        onClick={() => eliminarVenta(venta.id)}>
                                        Eliminar
                                        <FontAwesomeIcon icon={faTrashCan} className=" ml-1" />
                                    </a>
                                </td>
                            </tr>
                            {expandedSaleId === venta.id && (
                                <tr className="bg-gray-50 dark:bg-[#202020]">
                                    <td colSpan="10" className="px-6 py-4">
                                        <div className="p-4">
                                            <p><strong>Productos: </strong>{venta.productos.map(p => `${p.nombreProducto} (${p.cantidad})`).join(", ")}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/* Modal para agregar nueva Venta */}
            <ModalAgregarVenta
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={agregarVenta}
                newSale={newSale}
                handleInputChange={handleInputChange}
                productos={productos}
                clientes={clientes}
                ventas={ventas}
                estadoVentas={estadoVentas}
                metodoPago={metodoPago}
            />

            {/* Modal para editar Venta existente */}
            <ModalEditarVenta
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={editarVenta}
                editingSale={editingSale}
                handleEditInputChange={handleEditInputChange}
                productos={productos}
                clientes={clientes}
                ventas={ventas}
                estadoVentas={estadoVentas}
                metodoPago={metodoPago}
            />
        </div>
    );

}

export default TablaVentas;
