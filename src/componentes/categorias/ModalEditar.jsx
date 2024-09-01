import React, { useEffect, useState } from "react";
import { format } from 'date-fns';

const ModalEditar = ({ isOpen, onClose, onSubmit, titulo, campos, initialData, disabledFields, endpoint }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (initialData) {
            // Asegúrate de que la fecha esté en el formato correcto para el campo de tipo 'date'
            setFormData({
                ...initialData,
                fecha_entrada: format(new Date(initialData.fecha_entrada), 'yyyy-MM-dd')
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { id, ...dataToUpdate } = formData;

        try {
            const response = await fetch(`http://localhost:5000/${endpoint}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el item');
            }

            const updatedItem = await response.json();
            onSubmit(updatedItem);
            onClose();
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424]">
                            <h3 className="text-3xl font-semibold text-[#f97316]">
                                {titulo || "Editar"}
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
                                    {campos.map((campo) => (
                                        campo.type === 'select' ? (
                                            <select
                                                key={campo.name}
                                                name={campo.name}
                                                value={formData[campo.name] || ""}
                                                onChange={handleChange}
                                                disabled={disabledFields.includes(campo.name)}
                                                className="select-class m-4 text-[#757575]"
                                            >
                                                <option value="" disabled>{campo.placeholder}</option>
                                                {campo.options && campo.options.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                key={campo.name}
                                                type={campo.type}
                                                name={campo.name}
                                                placeholder={campo.placeholder}
                                                value={campo.type === 'date' ? formData[campo.name] || '' : formData[campo.name] || ""}
                                                onChange={handleChange}
                                                disabled={disabledFields.includes(campo.name)}
                                                className="input-class m-4 text-[#757575]"
                                            />
                                        )
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-4 mt-2 ease-linear transition-all duration-150"
                                >
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

export default ModalEditar;

