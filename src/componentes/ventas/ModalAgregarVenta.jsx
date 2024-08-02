import React, { useState } from "react";

const ModalAgregarVenta = ({ isOpen, onClose, onSubmit, newSale, handleInputChange, productos }) => {
    const [productosSeleccionados, setProductosSeleccionados] = useState({});

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

    const handleSubmit = (e) => {
        e.preventDefault();

        const productosFiltrados = Object.values(productosSeleccionados).filter(Boolean);

        onSubmit({ ...newSale, productos: productosFiltrados });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none min-h-screen">
                <div className="relative w-auto my-6 mx-auto max-w-3xl max-h-screen">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-y-auto">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424]">
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
                        <div className="relative p-6 flex-auto dark:bg-[#242424]">
                            <div className="grid grid-rows-6 grid-cols-12 gap-4">

                                {/* DATOS PRODUCTOS */}
                                <div className="row-span-3 col-span-12 md:col-span-6 bg-white rounded-lg p-4 dark:bg-[#292929] flex flex-col">
                                    <h3 className="text-xl text-left font-semibold text-[#f97316] mb-2">Datos Productos</h3>
                                    <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                                        <div className="grid grid-cols-1 gap-4 flex-grow">
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
                                    </form>
                                </div>

                                {/* DATOS CLIENTE */}
                                <div className="row-span-3 col-span-12 md:col-span-6 flex flex-col bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl text-left font-semibold text-[#f97316] mb-2">Datos Cliente</h3>
                                    <select className="w-full p-2 my-4 border rounded-md text-[#757575]">
                                        <option value="">Seleccione un cliente</option>
                                        <option value="cliente1">Cliente 1</option>
                                        <option value="cliente2">Cliente 2</option>
                                        {/* Agrega más opciones según sea necesario */}
                                    </select>
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 flex-grow">
                                        <div className="md:col-span-2 flex justify-center">
                                            <input
                                                type="text"
                                                placeholder="Nombre"
                                                disabled
                                                className="w-full md:w-1/2 p-2 border rounded-md bg-gray-200 dark:bg-gray-600"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Correo"
                                            disabled
                                            className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Teléfono"
                                            disabled
                                            className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Dirección"
                                            disabled
                                            className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Método de pago"
                                            disabled
                                            className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600"
                                        />
                                    </div>
                                </div>

                                {/* DATOS VENTA */}
                                <div className="row-span-3 col-span-12 md:col-span-6 flex flex-col bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl text-left font-semibold text-[#f97316] mb-2">Datos Venta</h3>
                                    <div className="grid grid-cols-1 gap-4 flex-grow">
                                        <div className="flex items-center justify-start">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">ID venta</label>
                                            <input
                                                type="text"
                                                className="w-2/3 p-2 border border-[#E06D00] rounded-md bg-transparent text-[#757575]"
                                            />
                                        </div>
                                        <div className="flex items-center justify-start">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Fecha venta</label>
                                            <input
                                                type="date"
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]" 
                                            />
                                        </div>
                                        <div className="flex items-center justify-start">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Estado venta</label>
                                            <input
                                                type="text"
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                        <div className="flex items-center justify-start">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Método de pago</label>
                                            <input
                                                type="text"
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                        <div className="flex items-center justify-start">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Descuento (si aplica)</label>
                                            <input
                                                type="text"
                                                className="w-2/3 p-2 border rounded-md bg-gray-200 dark:bg-gray-600 text-[#757575]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* DATOS PEDIDO */}
                                <div className="row-span-3 col-span-12 md:col-span-6 flex flex-col bg-white rounded-lg p-4 dark:bg-[#292929]">
                                    <h3 className="text-xl text-left font-semibold text-[#f97316] mb-2">Datos Pedido</h3>
                                    <div className="grid grid-cols-1 gap-4 flex-grow">
                                        <div className="flex items-center justify-start">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Nota (si aplica)</label>
                                            <input
                                                type="text"
                                                className="w-2/3 p-2 border rounded-md text-[#757575] bg-gray-200 dark:bg-gray-600"
                                            />
                                        </div>
                                        <div className="flex items-center justify-start">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Método de envío</label>
                                            <input
                                                type="text"
                                                className="w-2/3 p-2 border rounded-md text-[#757575] bg-gray-200 dark:bg-gray-600"
                                            />
                                        </div>
                                        <div className="flex items-center justify-start">
                                            <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">Subtotal</label>
                                            <input
                                                type="text"
                                                className="w-2/3 p-2 border rounded-md text-[#757575] bg-gray-200 dark:bg-gray-600"
                                            />
                                        </div>
                                    </div>
                                    <hr className="my-4 border-t-2 border-orange-500" />
                                    <div className="flex items-center justify-start">
                                        <label className="w-1/3 text-left text-[#757575] dark:text-[#757575]">TOTAL</label>
                                        <input
                                            type="text"
                                            disabled
                                            className="w-2/3 p-2 border rounded-md text-[#757575] bg-gray-200 dark:bg-gray-600"
                                        />
                                    </div>
                                </div>

                            </div>
                            <button type="submit" className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-4 mt-2 ease-linear transition-all duration-150">
                                Agregar Venta
                            </button>
                            <button
                                type="button"
                                className="text-slate-50 bg-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

        </>
    );
};

export default ModalAgregarVenta;


