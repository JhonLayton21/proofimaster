import React, { useEffect, useState } from "react";
import ModalHeader from './ModalHeader';
import DatosProductos from "./DatosProductos";
import DatosCliente from './DatosCliente';
import DatosVenta from "./DatosVenta";
import DatosPedido from "./DatosPedido";
import ModalActions from './ModalActions';

const ModalEditarVenta = ({ isOpen, onClose, editingItem }) => {
    const [formData, setFormData] = useState({
        precioVenta: "",
        clienteId: "",
        fechaVenta: "",
        estadoVentaId: "",
        metodoPagoId: "",
        descuentoVenta: 0,
        notaVenta: "",
        metodoEnvioVentaId: "",
        subtotal: 0,
        total: 0,
    });

    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [estadoVentas, setEstadoVentas] = useState([]);
    const [metodoPago, setMetodoPago] = useState([]);
    const [metodoEnvio, setMetodoEnvio] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState({});
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    // FETCH TABLAS NECESARIAS
    const fetchDataFromAPI = async (endpoint, setStateFunction) => {
        try {
            const response = await fetch(`http://localhost:5000/${endpoint}`);
            const data = await response.json();
            setStateFunction(data);
        } catch (error) {
            console.error(`Error al obtener los datos de ${endpoint}`, error);
        }
    };

    useEffect(() => {
        fetchDataFromAPI("productos", setProductos);
        fetchDataFromAPI("clientes", setClientes);
        fetchDataFromAPI("estado_venta", setEstadoVentas);
        fetchDataFromAPI("metodo_pago", setMetodoPago);
        fetchDataFromAPI("metodo_envio_venta", setMetodoEnvio);
    }, []);

    useEffect(() => {
        if (isOpen && editingItem) {
            // Obtener los productos seleccionados de la venta
            const fetchProductosSeleccionados = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/venta_productos/${editingItem.id}`);
                    const productosSeleccionados = await response.json();

                    // Actualiza el estado productosSeleccionados con los productos que ya están en la venta
                    const productosSeleccionadosMap = productosSeleccionados.reduce((acc, producto) => {
                        acc[producto.producto_id] = {
                            cantidad: producto.cantidad,
                            precio: producto.precio,
                        };
                        return acc;
                    }, {});

                    setProductosSeleccionados(productosSeleccionadosMap);
                } catch (error) {
                    console.error("Error al obtener productos seleccionados:", error);
                }
            };

            fetchProductosSeleccionados();

            // También puedes establecer los demás datos del formulario aquí como ya lo haces
        }
    }, [isOpen, editingItem]);



    useEffect(() => {
        console.log("editingItem:", editingItem);

        if (isOpen && editingItem) {
            const findByField = (list, field, value) => {
                const selectedItem = list.find((item) => item[field] === value);
                return selectedItem ? selectedItem.id.toString() : "";
            };

            const formatDate = (dateString) => {
                const date = new Date(dateString);
                if (isNaN(date)) {
                    return ''; // Si no es una fecha válida, devolver una cadena vacía o manejarlo de otra manera
                }
                return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            };

            const { estado, cliente, metodo_pago, metodo_envio, precio_venta, fecha_venta, descuento_venta, nota_venta, subtotal, total } = editingItem;

            setFormData({
                precioVenta: precio_venta || "",
                clienteId: findByField(clientes, "nombre_cliente", cliente),
                fechaVenta: formatDate(fecha_venta) || "",
                estadoVentaId: findByField(estadoVentas, "estado", estado),
                metodoPagoId: findByField(metodoPago, "metodo", metodo_pago),
                descuentoVenta: descuento_venta || 0,
                notaVenta: nota_venta || "",
                metodoEnvioVentaId: findByField(metodoEnvio, "metodo", metodo_envio),
                subtotal: subtotal || 0,
                total: total || 0,
            });

            // Inicializar productos seleccionados
            const productosIniciales = productos.reduce((acc, producto) => {
                acc[producto.id] = {
                    cantidad: producto.cantidad,
                    precio: producto.precio_venta,
                };
                return acc;
            }, {});

            setProductosSeleccionados(productosIniciales);
        }
    }, [isOpen, editingItem, estadoVentas, clientes, metodoPago, metodoEnvio, productos]);



    const handleEditInputChange = (e) => {
        const { name, value } = e.target;

        console.log(`Campo: ${name}, Valor: ${value}`);

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const calcularTotal = () => {
        const nuevoSubtotal = calcularSubtotal();
        const descuento = (formData.descuentoVenta / 100) * nuevoSubtotal;
        const nuevoTotal = nuevoSubtotal - descuento;

        setSubtotal(nuevoSubtotal);
        setTotal(nuevoTotal);
    };

    useEffect(() => {
        calcularTotal();
    }, [productosSeleccionados, formData.metodoEnvioVentaId, formData.descuentoVenta]);

    const manejarCambioCheckbox = (producto) => {
        setProductosSeleccionados(prevState => {
            const isSelected = !!prevState[producto.id]; // Verificar si ya está seleccionado

            if (isSelected) {
                // Eliminar producto del estado si está seleccionado
                const { [producto.id]: _, ...newState } = prevState;
                return newState;
            } else {
                // Añadir producto al estado si no está seleccionado
                return {
                    ...prevState,
                    [producto.id]: {
                        cantidad: 1, // Valor por defecto
                        precio: producto.precio_venta,
                    },
                };
            }
        });
    };

    // Manejar cambios de cantidad productos
    const manejarCambioCantidad = (productoId, cantidad) => {
        setProductosSeleccionados(prevState => ({
            ...prevState,
            [productoId]: {
                ...prevState[productoId],
                cantidad: Math.max(1, cantidad), // Asegúrate de que la cantidad sea al menos 1
            },
        }));
    };

    // Manejar cambio información cliente
    const manejarCambioCliente = (e) => {
        const clienteId = e.target.value;
        const cliente = clientes.find(cliente => cliente.id === clienteId);

        setClienteSeleccionado(cliente);

        setFormData(prevState => ({
            ...prevState,
            clienteId: clienteId
        }));
    };

    // Calcular subtotal
    const calcularSubtotal = () => {
        const subtotalProductos = Object.values(productosSeleccionados).reduce(
            (acc, producto) => acc + producto.cantidad * producto.precio,
            0
        );

        const metodoEnvioSeleccionado = metodoEnvio.find(envio => envio.id === formData.metodoEnvioVentaId);
        const precioEnvio = metodoEnvioSeleccionado ? metodoEnvioSeleccionado.precio : 0;

        return subtotalProductos + precioEnvio;
    };


    // Calcular Total
    useEffect(() => {
        const calcularTotal = () => {
            const descuento = (formData.descuentoVenta / 100) * subtotal;
            const total = subtotal - descuento;
            setTotal(total);
        };

        calcularTotal();
    }, [subtotal, formData.descuentoVenta]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productosFiltrados = Object.entries(productosSeleccionados)
            .filter(([id, detalles]) => detalles) // Solo productos seleccionados
            .map(([id, detalles]) => ({
                producto_id: id,
                cantidad: detalles.cantidad,
                precio: detalles.precio,
            }));

        try {
            const response = await fetch(`http://localhost:5000/ventas/${editingItem.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    venta: { ...formData, subtotal, total }, // Enviar datos de la venta
                    productos: productosFiltrados, // Enviar productos seleccionados
                }),
            });

            if (!response.ok) {
                throw new Error("Error al editar la venta");
            }

            const data = await response.json();
            console.log("Venta editada:", data);
            onClose(); // Cerrar modal después de la edición

        } catch (err) {
            console.error("Error en la solicitud:", err);
        }
    };


    if (!isOpen) return null;

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none min-h-screen">
                <div className="relative w-auto my-6 mx-auto max-w-3xl max-h-screen">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-y-auto">

                        {/* Encabezado del Modal */}
                        <ModalHeader title="Editar venta" onClose={onClose} />

                        {/* Contenido del Modal */}
                        <div className="relative p-6 flex-auto dark:bg-[#242424] bg-[#eeeeee]">
                            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

                                {/* DATOS PRODUCTOS */}
                                <DatosProductos
                                    productos={productos}
                                    productosSeleccionados={productosSeleccionados}
                                    manejarCambioCheckbox={manejarCambioCheckbox}
                                    manejarCambioCantidad={manejarCambioCantidad}
                                />

                                {/* DATOS CLIENTE */}
                                <DatosCliente
                                    clientes={clientes}
                                    formData={formData}
                                    manejarCambioCliente={manejarCambioCliente}
                                    clienteSeleccionado={clienteSeleccionado}
                                />

                                {/* DATOS VENTA */}
                                <DatosVenta
                                    formData={formData}
                                    handleEditInputChange={handleEditInputChange}
                                    estadoVentas={estadoVentas}
                                    metodoPago={metodoPago}
                                />

                                {/* DATOS PEDIDO */}
                                <DatosPedido
                                    formData={formData}
                                    handleEditInputChange={handleEditInputChange}
                                    metodoEnvio={metodoEnvio}
                                />

                                {/* Botones de acción */}
                                <ModalActions onClose={onClose} />

                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ModalEditarVenta;
