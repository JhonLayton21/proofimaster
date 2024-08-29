import React, { useState, useEffect } from "react";
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ModalAgregarVenta = ({ isOpen, onClose, onSubmit, newSale, handleInputChange }) => {
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [estadoVentas, setEstadoVentas] = useState([]);
    const [metodoPago, setMetodoPago] = useState([]);
    const [metodoEnvio, setMetodoEnvio] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState({});
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

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
                console.error("Error al obtener datos:", error);
            }
        };

        fetchData();
    }, []);

    // CALCULO SUBTOTAL
    useEffect(() => {
        const calcularSubtotal = () => {
            let total = 0;
            Object.values(productosSeleccionados).forEach(producto => {
                if (producto) {
                    total += producto.precio_venta * producto.cantidad;
                }
            });

            const envioSeleccionado = metodoEnvio.find(envio => envio.id === newSale.metodo_envio_venta_id);
            if (envioSeleccionado) {
                total += envioSeleccionado.precio;
            }

            setSubtotal(total);
        };

        calcularSubtotal();
    }, [productosSeleccionados, newSale.metodo_envio_venta_id, metodoEnvio]);


    // CALCULO TOTAL
    useEffect(() => {
        const calcularTotal = () => {
            console.log('Subtotal:', subtotal);
            console.log('Descuento:', newSale.descuento_venta);

            const descuento = (newSale.descuento_venta / 100) * subtotal;
            const total = subtotal - descuento;
            setTotal(total);
        };

        calcularTotal();
    }, [subtotal, newSale.descuento_venta]);

    const manejarCambioCheckbox = (producto) => {
        setProductosSeleccionados(prev => ({
            ...prev,
            [producto.id]: prev[producto.id] ? null : { ...producto, cantidad: 1 }
        }));
    };

    const manejarCambioCantidad = (productoId, cantidad) => {
        setProductosSeleccionados(prev => ({
            ...prev,
            [productoId]: { ...prev[productoId], cantidad: cantidad }
        }));
    };

    const manejarCambioCliente = (e) => {
        const clienteId = e.target.value;
        const cliente = clientes.find(cliente => cliente.id === clienteId);
        setClienteSeleccionado(cliente);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const productosFiltrados = Object.values(productosSeleccionados).filter(Boolean);

        onSubmit({
            ...newSale,
            productos: productosFiltrados,
            cliente: clienteSeleccionado,
            subTotal: subtotal.toFixed(3),
            total: total.toFixed(3)
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none min-h-screen">
                <div className="relative w-auto my-6 mx-auto max-w-3xl max-h-screen">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-y-auto">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424] bg-[#eeeeee]">
                            <h3 className="text-3xl font-semibold text-[#f97316]">
                                Agregar Venta
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={onClose}
                            >
                                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                </span>
                            </button>
                        </div>
                        <div className="relative p-6 flex-auto dark:bg-[#242424] bg-[#eeeeee]">
                            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

                                {/* DATOS PRODUCTOS */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929] flex flex-col">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Productos</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {productos.map(producto => (
                                            <div key={producto.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={producto.id}
                                                    checked={!!productosSeleccionados[producto.id]}
                                                    onChange={() => manejarCambioCheckbox(producto)}
                                                    className="m-2"
                                                />
                                                <label htmlFor={producto.id} className="text-left flex-grow text-[#757575] dark:text-[#757575]">{producto.nombre} - {producto.precio_venta} COP</label>
                                                {productosSeleccionados[producto.id] && (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={productosSeleccionados[producto.id].cantidad}
                                                        onChange={(e) => manejarCambioCantidad(producto.id, parseInt(e.target.value))}
                                                        className="input-class ml-6 text-[#757575]"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* DATOS CLIENTE */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Cliente</h3>
                                    <select className="w-full p-2 my-4 border rounded-md text-[#757575]" onChange={manejarCambioCliente}>
                                        <option value="">Seleccione un cliente</option>
                                        {clientes.map(cliente => (
                                            <option key={cliente.id} value={cliente.id}>{cliente.nombre_cliente}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center justify-center mb-4">
                                        <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                                    </div>
                                    {clienteSeleccionado && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="md:col-span-2 flex justify-center">
                                                <input
                                                    type="text"
                                                    placeholder="Nombre"
                                                    value={clienteSeleccionado.nombre_cliente}
                                                    disabled
                                                    className="w-full md:w-1/2 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Correo"
                                                value={clienteSeleccionado.email_cliente}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Teléfono"
                                                value={clienteSeleccionado.telefono_cliente}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Dirección"
                                                value={clienteSeleccionado.direccion_cliente}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Método de pago"
                                                value={clienteSeleccionado.tipo_cliente_id}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* DATOS VENTA */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Venta</h3>
                                    <select className="w-full p-2 my-4 border rounded-md text-[#757575]" name="estadoVenta" onChange={handleInputChange}>
                                        <option value="">Seleccione estado</option>
                                        {estadoVentas.map(estado => (
                                            <option key={estado.id} value={estado.id}>{estado.estado}</option>
                                        ))}
                                    </select>
                                    <select className="w-full p-2 my-4 border rounded-md text-[#757575]" name="metodoPago" onChange={handleInputChange}>
                                        <option value="">Seleccione método de pago</option>
                                        {metodoPago.map(pago => (
                                            <option key={pago.id} value={pago.id}>{pago.metodo}</option>
                                        ))}
                                    </select>
                                    <select className="w-full p-2 my-4 border rounded-md text-[#757575]" name="metodoEnvio" onChange={handleInputChange}>
                                        <option value="">Seleccione método de envío</option>
                                        {metodoEnvio.map(envio => (
                                            <option key={envio.id} value={envio.id}>{envio.metodo} - {envio.precio} COP</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        name="descuentoVenta"
                                        placeholder="Descuento"
                                        value={newSale.descuento_venta}
                                        onChange={handleInputChange}
                                        className="input-class w-full text-[#757575]"
                                    />
                                </div>

                                {/* DATOS PEDIDO */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Pedido</h3>
                                    <input
                                        type="number"
                                        placeholder="Subtotal"
                                        value={subtotal.toFixed(3)}
                                        disabled
                                        className="input-class w-full text-[#757575]"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Total"
                                        value={total.toFixed(3)}
                                        disabled
                                        className="input-class w-full text-[#757575]"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button className="bg-[#f97316] text-white active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150">
                                        Guardar Venta
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default ModalAgregarVenta;