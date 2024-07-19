import React from "react";

const ModalAgregarProveedor = ({ isOpen, onClose, onSubmit, newProvider, handleInputChange, MetodoPagoProveedores }) => {
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
                                Agregar Proveedor
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
                                        name="nombreProveedor"
                                        placeholder="Nombre Proveedor"
                                        value={newProvider.nombreProveedor}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="text"
                                        name="contactoProveedor"
                                        placeholder="Contacto Proveedor"
                                        value={newProvider.contactoProveedor}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="text"
                                        name="emailProveedor"
                                        placeholder="Email Proveedor"
                                        value={newProvider.emailProveedor}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="text"
                                        name="telefonoProveedor"
                                        placeholder="Telefono Proveedor"
                                        value={newProvider.telefonoProveedor}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="text"
                                        name="direccionProveedor"
                                        placeholder="Direccion Proveedor"
                                        value={newProvider.direccionProveedor}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <select
                                        name="metodoPago"
                                        value={newProvider.metodoPago}
                                        onChange={handleInputChange}
                                    >
                                        <option value="" disabled>Seleccione tipo Proveedor</option>
                                        {MetodoPagoProveedores.map((tipo, index) => (
                                            <option key={index} value={tipo}>
                                                {tipo}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                <button type="submit" className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-4 mt-2 ease-linear transition-all duration-150">
                                    Agregar Proveedor
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

export default ModalAgregarProveedor;