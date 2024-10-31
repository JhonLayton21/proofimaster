import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../supabase";

const ModalAgregar = ({ isOpen, onClose, onSubmit, titulo, campos, disabledFields, endpoint }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const { data, error } = await supabase.from(`${endpoint}`).insert(formData);

            if (error) {
                console.error('Error al agregar el nuevo item:', error);
                throw new Error('Error al agregar el nuevo item');
            }

            onSubmit(data);
            onClose();
        } catch (error) {
            console.error("Error: ", error.message);
        }
    };

    const modalRef = useRef(null); // Referencia para el contenedor del modal

    // Manejar cierre al hacer clic fuera del modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose(); // Cierra el modal si el clic es fuera del contenedor del modal
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        // Limpia el event listener cuando el modal se desmonte
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);


    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div ref={modalRef} className="relative w-auto my-6 mx-auto max-w-3xl">
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
                                        <div key={campo.name} className="field-container m-4">
                                            <label htmlFor={campo.name} className="block text-sm font-medium text-slate-700 dark:text-white">
                                                {campo.label}
                                                {campo.required && <span className="text-orange-600"> *</span>}
                                            </label>
                                            <div className="flex items-center bg-slate-100 dark:bg-[#292929] text-slate-700 dark:text-white w-full rounded-md focus-within:ring focus-within:ring-orange-500">
                                                {campo.type === 'select' ? (
                                                    <select
                                                        id={campo.name}
                                                        name={campo.name}
                                                        value={formData[campo.name] || ""}
                                                        onChange={handleChange}
                                                        disabled={disabledFields.includes(campo.name)}
                                                        className="bg-transparent border-none text-sm px-4 py-2.5 w-full focus:outline-none text-[#757575]"
                                                        required={campo.required} 
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
                                                        id={campo.name}
                                                        type={campo.type}
                                                        name={campo.name}
                                                        placeholder={campo.placeholder}
                                                        value={formData[campo.name] || ""}
                                                        onChange={handleChange}
                                                        disabled={disabledFields.includes(campo.name)}
                                                        className="bg-transparent border-none text-sm px-4 py-2.5 w-full focus:outline-none text-[#757575]"
                                                        required={campo.required} 
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>



                                <button
                                    type="submit"
                                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-4 mt-2 ease-linear transition-all duration-150"
                                >
                                    Agregar
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

export default ModalAgregar;

