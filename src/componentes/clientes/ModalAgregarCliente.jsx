import React, { useEffect, useState } from "react";

const ModalAgregarCliente = ({ isOpen, onClose, refreshClientes, onSuccess }) => {
    const [newClient, setNewClient] = useState({
        nombreCliente: "",
        direccionCliente: "",
        emailCliente: "",
        telefonoCliente: "",
        tipoCliente: ""
    });

    const [tiposCliente, setTiposCliente] = useState([]);

    useEffect(() => {
        // Fetch para obtener los tipos de cliente
        const fetchTiposCliente = async () => {
            try {
                const response = await fetch("http://localhost:5000/tipo_clientes");

                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                const data = await response.json();
                setTiposCliente(data);
            } catch (error) {
                console.error("Error al obtener los tipos de cliente", error);
            }
        };

        fetchTiposCliente();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient({
            ...newClient,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { nombreCliente, direccionCliente, emailCliente, telefonoCliente, tipoCliente } = newClient;

        try {
            const response = await fetch("http://localhost:5000/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre_cliente: nombreCliente,
                    direccion_cliente: direccionCliente,
                    email_cliente: emailCliente,
                    telefono_cliente: telefonoCliente,
                    tipo_cliente_id: tipoCliente,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Cliente agregado:", data);
                refreshClientes();
                onClose();
                setNewClient({
                    nombreCliente: "",
                    direccionCliente: "",
                    emailCliente: "",
                    telefonoCliente: "",
                    tipoCliente: ""
                });
                onSuccess();
            } else{
                console.error("Error al agregar el cliente:", await response.text());
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);

        }
    }


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
                                Agregar Cliente
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
                                        value={newClient.nombreCliente}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="email"
                                        name="emailCliente"
                                        placeholder="Email Cliente"
                                        value={newClient.emailCliente}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        name="telefonoCliente"
                                        placeholder="Telefono Cliente"
                                        value={newClient.telefonoCliente}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <input
                                        type="text"
                                        name="direccionCliente"
                                        placeholder="Direccion Cliente"
                                        value={newClient.direccionCliente}
                                        onChange={handleInputChange}
                                        className="input-class m-4 text-[#757575]"
                                    />
                                    <select
                                        name="tipoCliente"
                                        value={newClient.tipoCliente}
                                        onChange={handleInputChange}
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
                                    Agregar Cliente
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

export default ModalAgregarCliente;