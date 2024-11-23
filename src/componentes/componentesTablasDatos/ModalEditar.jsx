import React, { useEffect, useState, useRef } from "react";
import { format, parse } from 'date-fns';
import { supabase } from '../../../supabase';

const ModalEditar = ({ isOpen, onClose, onSubmit, titulo, campos, initialData, disabledFields, endpoint }) => {
    const [formData, setFormData] = useState({});
    const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: '' });

    useEffect(() => {
        if (initialData) {
            const fechaEntradaCampo = campos.find(campo => campo.name === 'fecha_entrada');

            const fechaEntrada = initialData.fecha_entrada && fechaEntradaCampo
                ? parse(initialData.fecha_entrada, 'yyyy-MM-dd', new Date())
                : null;

            const fechaEntradaFormateada = fechaEntrada
                ? format(fechaEntrada, 'yyyy-MM-dd')
                : '';

            if (fechaEntradaCampo) {
                console.log("Fecha de entrada:", fechaEntradaFormateada);
            }

            setFormData({
                ...initialData,
                ...(fechaEntradaCampo && { fecha_entrada: fechaEntradaFormateada })
            });
        }
    }, [initialData, campos]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Desestructuramos 'formData' y eliminamos 'metodo_pago' antes de la actualización
        const { id, metodo_pago, tipo_cliente, marca_productos, referencia_productos, proveedor, ...dataToUpdate } = formData;
        console.log("Datos completos del formulario:", formData); // Log de todos los datos
        console.log("Datos a actualizar (sin id):", dataToUpdate); // Log de los datos que se van a actualizar

        console.log('Datos enviados:', formData);

        // Validar la longitud del número de identificación
        if (formData.numero_identificacion && formData.numero_identificacion.length > 11) {
            setAlerta({
                mostrar: true,
                mensaje: 'El número de identificación no puede tener más de 11 caracteres.',
                tipo: 'error'
            });
            return;
        }

        // Validar que fecha_entrada no supere un año desde la fecha actual
        if (formData.fecha_entrada) {
            const fechaEntrada = new Date(formData.fecha_entrada);
            const fechaActual = new Date();
            const diferenciaEnMilisegundos = fechaActual - fechaEntrada;
            const unAñoEnMilisegundos = 365 * 24 * 60 * 60 * 1000; // Milisegundos en un año

            if (diferenciaEnMilisegundos > unAñoEnMilisegundos) {
                setAlerta({
                    mostrar: true,
                    mensaje: 'La fecha de entrada no puede ser mayor a un año desde la fecha actual.',
                    tipo: 'error'
                });
                return;
            }
        }

        // Validar que los valores no sean negativos
        const camposNumericos = ['precio_compra', 'precio_venta', 'nivel_minimo_stock', 'stock'];
        for (const campo of camposNumericos) {
            if (formData[campo] !== undefined && formData[campo] < 0) {
                setAlerta({
                    mostrar: true,
                    mensaje: `El campo ${campo.replace('_', ' ')} no puede tener valores negativos.`,
                    tipo: 'error'
                });
                return;
            }
        }

        // Validar que el número de identificación solo contenga números, punto decimal o guion medio
        const regexNumeros = /^[0-9.\-]+$/;

        if (formData.numero_identificacion && !regexNumeros.test(formData.numero_identificacion)) {
            setAlerta({
                mostrar: true,
                mensaje: 'El número de identificación solo puede contener números, punto decimal o guion medio.',
                tipo: 'error'
            });
            return; // Detener la ejecución si no cumple la condición
        }

        // Validar que nombre_cliente y ciudad no contengan números o símbolos
        const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (
            (formData.nombre_cliente && !regexSoloLetras.test(formData.nombre_cliente)) ||
            (formData.ciudad && !regexSoloLetras.test(formData.ciudad))
        ) {
            setAlerta({
                mostrar: true,
                mensaje: 'El nombre del cliente o la ciudad no pueden contener números o símbolos.',
                tipo: 'error'
            });
            return;
        }

        // Validar que contacto_proveedor no contenga números o símbolos
        if (
            (formData.contacto_proveedor && !regexSoloLetras.test(formData.contacto_proveedor))
        ) {
            setAlerta({
                mostrar: true,
                mensaje: 'El contacto del proveedor no puede contener números o símbolos.',
                tipo: 'error'
            });
            return;
        }

        // Validar la longitud del telefono
        if (formData.telefono_cliente && formData.telefono_cliente.length > 10 || formData.telefono_proveedor && formData.telefono_proveedor.length > 10) {
            setAlerta({
                mostrar: true,
                mensaje: 'El teléfono no puede tener más de 10 caracteres.',
                tipo: 'error'
            });
            return;
        }

        try {
            console.log(`Actualizando en la tabla: ${endpoint}`); // Log del endpoint al que estás actualizando
            const { data, error } = await supabase
                .from(`${endpoint}`)
                .update(dataToUpdate) // Enviar solo los datos a actualizar, sin 'id'
                .eq('id', id); // Filtro por ID para actualizar el item correcto

            // Verificar si hubo algún error en la respuesta de Supabase
            if (error) {
                console.error("Error detallado de Supabase:", error); // Log detallado del error
                throw new Error('Error al actualizar el item');
            }

            console.log("Datos recibidos tras la actualización:", data); // Log de la respuesta exitosa

            onSubmit(data);  // Ejecutar la acción que corresponda después de la actualización
            onClose();       // Cerrar el modal o formulario
        } catch (error) {
            console.error("Error: ", error.message); // Log del mensaje de error en el bloque catch
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                    <div className="relative w-full max-w-3xl mx-auto my-6">
                        <div className="bg-white dark:bg-[#242424] rounded-lg shadow-lg flex flex-col outline-none focus:outline-none">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-blueGray-200 dark:border-gray-700 rounded-t">
                                <h3 className="text-3xl font-semibold text-[#f97316]">
                                    {titulo || "Editar"}
                                </h3>
                                <button
                                    className="p-1 ml-auto bg-transparent text-black dark:text-white text-3xl font-semibold outline-none focus:outline-none"
                                    onClick={onClose}
                                >
                                    ×
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto max-h-[75vh]">
                                {/* Alerta */}
                                {alerta.mostrar && (
                                    <div
                                        className={`p-4 mb-4 text-sm rounded-lg ${alerta.tipo === "error"
                                                ? "text-red-600 bg-red-100 border-2 border-red-600"
                                                : "text-green-600 bg-green-100 border-2 border-green-600"
                                            }`}
                                        role="alert"
                                    >
                                        <span className="font-medium">
                                            {alerta.tipo === "error" ? "Error" : "Éxito"}:
                                        </span>{" "}
                                        {alerta.mensaje}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {campos.map((campo) => (
                                            <div key={campo.name} className="field-container m-4">
                                                <label
                                                    htmlFor={campo.name}
                                                    className="block text-sm font-medium text-slate-700 dark:text-white"
                                                >
                                                    {campo.label}
                                                    {campo.required && (
                                                        <span className="text-orange-600"> *</span>
                                                    )}
                                                </label>
                                                <div className="flex items-center bg-slate-100 dark:bg-[#292929] text-slate-700 dark:text-white w-full rounded-md focus-within:ring focus-within:ring-orange-500">
                                                    {campo.type === "select" ? (
                                                        <select
                                                            id={campo.name}
                                                            name={campo.name}
                                                            value={formData[campo.name] || ""}
                                                            onChange={handleChange}
                                                            disabled={disabledFields.includes(campo.name)}
                                                            className="bg-transparent border-none text-sm px-4 py-2.5 w-full focus:outline-none text-[#757575]"
                                                            required={campo.required}
                                                        >
                                                            <option value="" disabled>
                                                                {campo.placeholder}
                                                            </option>
                                                            {campo.options &&
                                                                campo.options.map((option) => (
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
                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="submit"
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 ease-linear transition-all duration-150"
                                        >
                                            Agregar
                                        </button>
                                        <button
                                            type="button"
                                            className="text-white bg-red-500 font-bold uppercase px-6 py-2 text-sm rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
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

            )}
            {isOpen && <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>}
        </>
    );
};

export default ModalEditar;


