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
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
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
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="nombreCliente"
                                        placeholder="Nombre del Cliente"
                                        value={newSale.nombreCliente}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                </div>
                                <h2 className="text-xl font-semibold mt-4 text-[#f97316]">Seleccionar Productos</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {productos.map(producto => (
                                        <div key={producto.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={producto.id}
                                                checked={!!productosSeleccionados[producto.id]}
                                                onChange={() => manejarCambioCheckbox(producto)}
                                                className="m-2"
                                            />
                                            <label htmlFor={producto.id} className="flex-grow text-[#f97316]">{producto.nombreProducto} - ${producto.precioVentaProducto}</label>
                                            {productosSeleccionados[producto.id] && (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={productosSeleccionados[producto.id].cantidad}
                                                    onChange={(e) => manejarCambioCantidad(producto.id, parseInt(e.target.value))}
                                                    className="input-class ml-2 text-[#757575]"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button type="submit" className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-4 mt-2 ease-linear transition-all duration-150">
                                    Agregar Venta
                                </button>
                                <button
                                    type="button"
                                    className="text-slate-50 bg-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
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


