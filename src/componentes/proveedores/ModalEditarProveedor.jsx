import React, { useEffect, useState } from "react";

const ModalEditarProveedor = ({ isOpen, onClose, refreshProveedores, editingProvider, setEditingProvider, onSuccess }) => {
    const [metodosPago, setMetodosPago] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Fetch para obtener los métodos de pago
        const fetchMetodosPago = async () => {
            try {
                const response = await fetch("http://localhost:5000/metodo_pago");
                const data = await response.json();
                setMetodosPago(data);
            } catch (error) {
                console.error("Error al obtener los métodos de pago:", error);
            }
        };

        fetchMetodosPago();
    }, []);

    useEffect(() => {
        if (isOpen && editingProvider) {
            // Establecer los datos del proveedor en el estado del formulario
            setFormData({
                nombreProveedor: editingProvider.nombre_proveedor || "",
                contactoProveedor: editingProvider.contacto_proveedor || "",
                emailProveedor: editingProvider.email_proveedor || "",
                telefonoProveedor: editingProvider.telefono_proveedor || "",
                direccionProveedor: editingProvider.direccion_proveedor || "",
                metodoPago: editingProvider.metodo_pago_id || "",
            });
        }
    }, [isOpen, editingProvider]);

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { nombreProveedor, contactoProveedor, emailProveedor, telefonoProveedor, direccionProveedor, metodoPago } = formData;

        try {
            const response = await fetch(`http://localhost:5000/proveedores/${editingProvider.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre_proveedor: nombreProveedor,
                    contacto_proveedor: contactoProveedor,
                    email_proveedor: emailProveedor,
                    telefono_proveedor: telefonoProveedor,
                    direccion_proveedor: direccionProveedor,
                    metodo_pago_id: metodoPago,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Proveedor actualizado:", data);
                refreshProveedores();
                onClose();
                onSuccess();
            } else {
                console.error("Error al actualizar el proveedor");
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424]">
                            <h3 className="text-3xl font-semibold text-[#f97316]">
                                Editar Proveedor
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
                                        name="nombreProveedor"
                                        placeholder="Nombre Proveedor"
                                        value={formData.nombreProveedor || ""}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="text"
                                        name="contactoProveedor"
                                        placeholder="Contacto Proveedor"
                                        value={formData.contactoProveedor || ""}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="email"
                                        name="emailProveedor"
                                        placeholder="Email Proveedor"
                                        value={formData.emailProveedor || ""}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        name="telefonoProveedor"
                                        placeholder="Telefono Proveedor"
                                        value={formData.telefonoProveedor || ""}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="text"
                                        name="direccionProveedor"
                                        placeholder="Direccion Proveedor"
                                        value={formData.direccionProveedor || ""}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <select
                                        name="metodoPago"
                                        value={formData.metodoPago || ""}
                                        onChange={handleEditInputChange}
                                    >
                                        <option value="" disabled>Seleccione un método de pago</option>
                                        {metodosPago.map((metodo) => (
                                            <option key={metodo.id} value={metodo.id}>
                                                {metodo.metodo}
                                            </option>
                                        ))}
                                    </select>
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
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default ModalEditarProveedor;



