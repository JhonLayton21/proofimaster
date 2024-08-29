import React, { useEffect, useState } from "react";

const ModalEditarVenta = ({ isOpen, onClose, refreshVentas, editingSale, onSuccess }) => {
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [metodoPago, setMetodoPago] = useState([]);
    const [metodoEnvio, setMetodoEnvio] = useState([]);
    const [formData, setFormData] = useState({});

    // FETCH TABLAS NECESARIAS
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

    useEffect(() => {
        if (isOpen && editingSale) {
            // Establecer los datos de la venta en el estado del formulario
            setFormData({
                productoId: editingSale.producto_id || "",
                precioVenta: editingSale.precio_venta || "",
                clienteId: editingSale.cliente_id || "",
                fechaVenta: editingSale.fecha_venta || "",
                estadoVentaId: editingSale.estado_venta_id || "",
                metodoPagoId: editingSale.metodo_pago_id || "",
                descuentoVenta: editingSale.descuento_venta || "",
                notaVenta: editingSale.nota_venta || "",
                metodoEnvioVentaId: editingSale.metodo_envio_venta_id || "",
                subtotal: editingSale.subtotal || "",
                total: editingSale.total || "",
            });
        }
    }, [isOpen, editingSale]);

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { productoId, precioVenta, clienteId, fechaVenta, estadoVentaId, metodoPagoId, descuentoVenta, notaVenta, metodoEnvioVentaId, subtotal, total } = formData;

        try {
            const response = await fetch(`http://localhost:5000/ventas/${editingSale.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    producto_id: productoId,
                    precio_venta: precioVenta,
                    cliente_id: clienteId,
                    fecha_venta: fechaVenta,
                    estado_venta_id: estadoVentaId,
                    metodo_pago_id: metodoPagoId,
                    descuento_venta: descuentoVenta,
                    nota_venta: notaVenta,
                    metodo_envio_venta_id: metodoEnvioVentaId,
                    subtotal: subtotal,
                    total: total,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Venta actualizado:", data);
                refreshVentas();
                onClose();
                onSuccess();
            } else {
                console.error("Error al actualizar la venta");
            }
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
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424] bg-[#eeeeee]">
                            <h3 className="text-3xl font-semibold text-[#f97316]">
                                Editar Venta
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
                                                    checked={!!formData.productoId.includes(producto.id)}
                                                    onChange={() => manejarCambioCheckbox(producto)}
                                                    className="m-2"
                                                />
                                                <label htmlFor={producto.id} className="text-left flex-grow text-[#757575] dark:text-[#757575]">{producto.nombre} - {producto.precio_venta} COP</label>
                                                {formData.productoId.includes(producto.id) && (
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={formData.productoId.cantidad}
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
                                    <select 
                                        className="w-full p-2 my-4 border rounded-md text-[#757575]" 
                                        name="clienteId"
                                        value={formData.clienteId}
                                        onChange={handleEditInputChange}
                                    >
                                        <option value="">Seleccione un cliente</option>
                                        {clientes.map(cliente => (
                                            <option key={cliente.id} value={cliente.id}>{cliente.nombre_cliente}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* DATOS VENTA */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Venta</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Fecha venta</label>
                                            <input
                                                name="fechaVenta"
                                                value={formData.fechaVenta}
                                                onChange={handleEditInputChange}
                                                type="date"
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Estado de venta</label>
                                            <select
                                                name="estadoVentaId"
                                                value={formData.estadoVentaId}
                                                onChange={handleEditInputChange}
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            >
                                                <option value="" disabled>Seleccione estado venta</option>
                                                {estadoVentas.map(estado => (
                                                    <option key={estado.id} value={estado.id}>
                                                        {estado.estado}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Método de pago</label>
                                            <select
                                                name="metodoPagoId"
                                                value={formData.metodoPagoId}
                                                onChange={handleEditInputChange}
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            >
                                                <option value="" disabled>Seleccione método pago</option>
                                                {metodoPago.map(metodo => (
                                                    <option key={metodo.id} value={metodo.id}>
                                                        {metodo.metodo}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Método de envío</label>
                                            <select
                                                name="metodoEnvioVentaId"
                                                value={formData.metodoEnvioVentaId}
                                                onChange={handleEditInputChange}
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            >
                                                <option value="" disabled>Seleccione método envío</option>
                                                {metodoEnvio.map(envio => (
                                                    <option key={envio.id} value={envio.id}>
                                                        {envio.metodo} - {envio.precio} COP
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* DATOS PEDIDO */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Pedido</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Subtotal</label>
                                            <input
                                                name="subtotal"
                                                value={formData.subtotal}
                                                onChange={handleEditInputChange}
                                                type="number"
                                                min="0"
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Descuento</label>
                                            <input
                                                name="descuentoVenta"
                                                value={formData.descuentoVenta}
                                                onChange={handleEditInputChange}
                                                type="number"
                                                min="0"
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Total</label>
                                            <input
                                                name="total"
                                                value={formData.total}
                                                onChange={handleEditInputChange}
                                                type="number"
                                                min="0"
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Nota</label>
                                            <input
                                                name="notaVenta"
                                                value={formData.notaVenta}
                                                onChange={handleEditInputChange}
                                                type="text"
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={onClose}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="bg-[#f97316] text-white active:bg-[#fa7f30] font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="submit"
                                    >
                                        Guardar Cambios
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

export default ModalEditarVenta;
