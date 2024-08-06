import React, { useState, useEffect } from "react";
import { faCircleUser, faFileLines, faBell, faEnvelope, faGear, faImagePortrait } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ModalAgregarVenta = ({ isOpen, onClose, onSubmit, newSale, handleInputChange, productos, clientes, estadoVentas, metodoPago, metodoEnvio }) => {
    const [productosSeleccionados, setProductosSeleccionados] = useState({});
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    /* CALCULO TOTAL VENTA */
    useEffect(() => {
        const calcularSubtotal = () => {
            let total = 0;
            Object.values(productosSeleccionados).forEach(producto => {
                if (producto) {
                    total += producto.precioVentaProducto * producto.cantidad;
                }
            });

            const envioSeleccionado = metodoEnvio.find(envio => envio.id === newSale.metodoEnvio);
            if (envioSeleccionado) {
                total += envioSeleccionado.precio;
            }

            setSubtotal(total);
        };

        calcularSubtotal();
    }, [productosSeleccionados, newSale.metodoEnvio, metodoEnvio]);

    /* CALCULO TO */
    useEffect(() => {
        const calcularTotal = () => {
            const descuento = (newSale.descuentoVenta / 100) * subtotal;
            const total = subtotal - descuento;
            setTotal(total);
        };

        calcularTotal();
    }, [subtotal, newSale.descuentoVenta]);

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

        onSubmit({ ...newSale, productos: productosFiltrados, cliente: clienteSeleccionado, subTotal: subtotal.toFixed(3), total: total.toFixed(3) });
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
                                                <label htmlFor={producto.id} className="text-left flex-grow text-[#757575] dark:text-[#757575]">{producto.nombreProducto} - {producto.precioVentaProducto} COP</label>
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
                                            <option key={cliente.id} value={cliente.id}>{cliente.nombreCliente}</option>
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
                                                    value={clienteSeleccionado.nombreCliente}
                                                    disabled
                                                    className="w-full md:w-1/2 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Correo"
                                                value={clienteSeleccionado.emailCliente}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Teléfono"
                                                value={clienteSeleccionado.telefonoCliente}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Dirección"
                                                value={clienteSeleccionado.direccionCliente}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Método de pago"
                                                value={clienteSeleccionado.tipoCliente}
                                                disabled
                                                className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* DATOS VENTA */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Venta</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Fecha venta</label>
                                            <input
                                                name="fechaVenta"
                                                value={newSale.fechaVenta}
                                                onChange={handleInputChange}
                                                type="date"
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Estado de venta</label>
                                            <select
                                                name="estadoVenta"
                                                value={newSale.estadoVenta}
                                                onChange={handleInputChange}
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            >
                                                <option value="" disabled>Seleccione estado venta</option>
                                                {estadoVentas.map((estado, index) => (
                                                    <option key={index} value={estado}>
                                                        {estado}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Método de pago</label>
                                            <select
                                                name="metodoPago"
                                                value={newSale.metodoPago}
                                                onChange={handleInputChange}
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            >
                                                <option value="" disabled>Seleccione metodo de pago</option>
                                                {metodoPago.map((metodo, index) => (
                                                    <option key={index} value={metodo}>
                                                        {metodo}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Descuento (si aplica)</label>
                                            <input
                                                type="number"
                                                name="descuentoVenta"
                                                value={newSale.descuentoVenta}
                                                onChange={handleInputChange}
                                                min={0}
                                                max={100}
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* DATOS PEDIDO */}
                                <div className="bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl font-semibold text-[#f97316] mb-2">Datos Pedido</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Nota (si aplica)</label>
                                            <textarea
                                                name="notaVenta"
                                                placeholder="Nota Venta"
                                                value={newSale.notaVenta}
                                                onChange={handleInputChange}
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Método de envío</label>
                                            <select
                                                name="metodoEnvio"
                                                value={newSale.metodoEnvio}
                                                onChange={handleInputChange}
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            >
                                                <option value="" disabled>Seleccione metodo de envío</option>
                                                {metodoEnvio.map((metodo, index) => (
                                                    <option key={index} value={metodo.id}>
                                                        {metodo.nombre} ({metodo.precio.toFixed(3)} COP)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Subtotal</label>
                                            <input
                                                type="text"
                                                value={subtotal.toFixed(3)}
                                                disabled
                                                className="w-2/3 p-2 border rounded-md text-[#757575] bg-gray-200 dark:bg-gray-600"
                                            />
                                        </div>
                                    </div>
                                    <hr className="my-4 border-t-2 border-orange-500" />
                                    <div className="flex items-center">
                                        <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">TOTAL</label>
                                        <input
                                            type="text"
                                            value={total.toFixed(3)}
                                            disabled
                                            className="w-2/3 p-2 border rounded-md text-[#757575] bg-gray-200 dark:bg-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4">
                                    <button type="submit" className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none">
                                        Agregar Venta
                                    </button>
                                    <button
                                        type="button"
                                        className="text-slate-50 bg-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none"
                                        onClick={onClose}
                                    >
                                        Cancelar
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




