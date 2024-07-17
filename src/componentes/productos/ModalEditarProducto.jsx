import React from "react";

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
};

const ModalEditarProducto = ({ isOpen, onClose, onSubmit, editingProduct, handleEditInputChange, referencias, marcas, proveedores }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424]">
                            <h3 className="text-3xl font-semibold text-[#f97316]">
                                Editar Producto
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
                        {/*body*/}
                        <div className="relative p-6 flex-auto dark:bg-[#242424]">
                            <form onSubmit={onSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="nombreProducto"
                                        placeholder="Nombre Producto"
                                        value={editingProduct.nombreProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <textarea
                                        name="descripcionProducto"
                                        placeholder="Descripción Producto"
                                        value={editingProduct.descripcionProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <select
                                        name="referenciaProducto"
                                        value={editingProduct.referenciaProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    >
                                        <option value="" disabled>Seleccione Referencia</option>
                                        {referencias.map(referencia => (
                                            <option key={referencia.id} value={referencia.id}>
                                                {referencia.nombreReferencia}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="marcaProducto"
                                        value={editingProduct.marcaProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    >
                                        <option value="">Seleccionar Marca</option>
                                        {marcas.map(marca => (
                                            <option key={marca.id} value={marca.id}>
                                                {marca.marcaProducto}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        name="precioCompra"
                                        placeholder="Precio Compra"
                                        value={editingProduct.precioCompraProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="text"
                                        name="precioVenta"
                                        placeholder="Precio Venta"
                                        value={editingProduct.precioVentaProducto}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="number"
                                        name="stock"
                                        placeholder="Stock"
                                        value={editingProduct.stock}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="number"
                                        name="numeroMinimoStock"
                                        placeholder="Número Mínimo Stock"
                                        value={editingProduct.nivelMinimoStock}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <select
                                        name="proveedor"
                                        value={editingProduct.proveedor}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    >
                                        <option value="" disabled>Seleccione Proveedor</option>
                                        {proveedores.map(proveedor => (
                                            <option key={proveedor.id} value={proveedor.id}>
                                                {proveedor.nombreProveedor}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        name="fechaEntrada"
                                        value={editingProduct.fechaEntradaProducto ? formatTimestamp(editingProduct.fechaEntradaProducto) : ''}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="file"
                                        name="imagenProducto"
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                </div>
                                <button type="submit" className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-4 mt-2 ease-linear transition-all duration-150">
                                    Guardar Cambios
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
                        {/*footer*/}
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default ModalEditarProducto;
