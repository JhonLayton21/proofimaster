import React, { useEffect, useState } from "react";

const ModalEditarCliente = ({ isOpen, onClose, refreshClientes, editingClient, onSuccess }) => {
    const [tiposCliente, setTiposCliente] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Fetch para obtener los métodos de pago
        const fetchTiposCliente = async () => {
            try {
                const response = await fetch("http://localhost:5000/tipo_clientes");
                const data = await response.json();
                setTiposCliente(data);
            } catch (error) {
                console.error("Error al obtener los tipos de cliente:", error);
            }
        };

        fetchTiposCliente();
    }, []);

    useEffect(() => {
        if (isOpen && editingClient) {
            // Establecer los datos del cliente en el estado del formulario
            setFormData({
                nombreCliente: editingClient.nombre_cliente || "",
                emailCliente: editingClient.email_cliente || "",
                telefonoCliente: editingClient.telefono_cliente || "",
                direccionCliente: editingClient.direccion_cliente || "",
                tipoCliente: editingClient.tipo_cliente_id || "",
            });
        }
    }, [isOpen, editingClient]);

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { nombreCliente, emailCliente, telefonoCliente, direccionCliente, tipoCliente } = formData;

        try {
            const response = await fetch(`http://localhost:5000/clientes/${editingClient.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre_cliente: nombreCliente,
                    email_cliente: emailCliente,
                    telefono_cliente: telefonoCliente,
                    direccion_cliente: direccionCliente,
                    tipo_cliente_id: tipoCliente,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Cliente actualizado:", data);
                refreshClientes();
                onClose();
                onSuccess();
            } else {
                console.error("Error al actualizar el cliente");
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
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424]">
                            <h3 className="text-3xl font-semibold text-[#f97316]">
                                Editar Cliente
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
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="nombreCliente"
                                        placeholder="Nombre Cliente"
                                        value={formData.nombreCliente || ""}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="email"
                                        name="emailCliente"
                                        placeholder="Email Cliente"
                                        value={formData.emailCliente || ""}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        name="telefonoCliente"
                                        placeholder="Telefono Cliente"
                                        value={formData.telefonoCliente || ""}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="text"
                                        name="direccionCliente"
                                        placeholder="Direccion Cliente"
                                        value={formData.direccionCliente || ""}
                                        onChange={handleEditInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <select
                                        name="tipoCliente"
                                        value={formData.tipoCliente || ""}
                                        onChange={handleEditInputChange}
                                    >
                                        <option value="" disabled>Seleccione tipo cliente</option>
                                        {tiposCliente.map((tipo) => (
                                            <option key={tipo.id} value={tipo.id}>
                                                {tipo.tipo}
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
                        {/*footer*/}
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default ModalEditarCliente;