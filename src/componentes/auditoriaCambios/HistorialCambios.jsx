import React, { useState, useEffect } from 'react';
import MenuPrincipal from '../MenuPrincipal';
import { supabase } from '../../../supabase';

const HistorialCambios = () => {
    const [auditoriaCambios, setAuditoriaCambios] = useState([]);
    const [limit, setLimit] = useState(5); // Estado para el límite de registros

    // Función para obtener los datos de auditoría
    const fetchAuditoriaCambios = async (limit) => {
        try {
            const { data, error } = await supabase
                .from('auditoria_cambios')
                .select('*')
                .order('fecha', { ascending: false })
                .limit(limit);

            if (error) {
                throw error;
            } else {
                setAuditoriaCambios(data);
            }
        } catch (error) {
            alert("Error obteniendo los datos de auditoría de cambios");
        }
    };

    // Función para traducir la acción realizada
    const traducirAccion = (accion) => {
        switch (accion) {
            case 'DELETE':
                return <span className="text-white font-semibold bg-red-500 p-1 rounded-sm">Eliminación</span>;
            case 'INSERT':
                return <span className="text-white font-semibold bg-green-500 p-1 rounded-sm">Inserción</span>;
            case 'UPDATE':
                return <span className="text-white font-semibold bg-blue-500 p-1 rounded-sm">Actualización</span>;
            default:
                return <span className="text-white font-semibold bg-gray-500 p-1 rounded-sm">{accion}</span>;
        }
    };

    // Función para comparar y formatear los datos
    const formatearDatos = (datosAnteriores, datosNuevos, accion) => {
        if (!datosNuevos) return null; // Si no hay datos nuevos, no mostramos nada

        const datosFiltradosNuevos = Object.entries(datosNuevos).filter(([_, valor]) => valor !== null);

        // Si la acción es INSERT, solo mostramos los datos nuevos
        if (accion === 'INSERT') {
            return (
                <ul className="list-disc list-inside">
                    {datosFiltradosNuevos.map(([key, value], idx) => (
                        <li key={idx} className="font-normal">
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
            );
        }

        // Si no es una inserción, comparamos los datos anteriores con los nuevos
        const datosFiltradosAnteriores = Object.entries(datosAnteriores || {}).filter(([_, valor]) => valor !== null);

        if (datosFiltradosAnteriores.length === 0 && datosFiltradosNuevos.length === 0) return null;

        return (
            <ul className="list-disc list-inside">
                {datosFiltradosAnteriores.map(([key, value], idx) => {
                    // Verificar si el valor ha cambiado comparando los datos anteriores y nuevos
                    const valorNuevo = datosNuevos[key];
                    const changed = valorNuevo !== undefined && valorNuevo !== value;
                    return (
                        <li key={idx} className={changed ? 'font-bold' : 'font-normal'}>
                            <strong>{key}:</strong> {changed ? <span className="text-orange-500">{valorNuevo}</span> : value}
                        </li>
                    );
                })}
            </ul>
        );
    };

    // Obtener los datos de auditoría al cargar el componente y cuando cambie el límite
    useEffect(() => {
        fetchAuditoriaCambios(limit);

        const channel = supabase
            .channel('custom-all-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'auditoria_cambios' },
                (payload) => fetchAuditoriaCambios(limit)
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [limit]);

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    titulo="Historial de cambios"
                    subtitulo="Visualiza los cambios realizados por los distintos miembros"
                >
                    <div className="mb-4">
                        <label htmlFor="resultLimit" className="mr-2">Mostrar:</label>
                        <select
                            id="resultLimit"
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                            className="p-2 border rounded"
                        >
                            <option className="bg-orange-500" value={5}>5 resultados</option>
                            <option className="bg-orange-500" value={10}>10 resultados</option>
                            <option className="bg-orange-500" value={15}>15 resultados</option>
                            <option className="bg-orange-500" value={20}>20 resultados</option>
                        </select>
                    </div>
                    <div className="relative overflow-x-auto rounded-2xl">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-slate-50 uppercase bg-[#f97316]">
                                <tr>
                                    <th className="px-6 py-3">Acción</th>
                                    <th className="px-6 py-3">Tabla</th>
                                    <th className="px-6 py-3">Fecha</th>
                                    <th className="px-6 py-3">Registro ID</th>
                                    <th className="px-6 py-3">Datos Nuevos</th>
                                    <th className="px-6 py-3">Datos Anteriores</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditoriaCambios.map((cambio, index) => (
                                    <tr key={index} className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                                        <td className="px-6 py-4">{traducirAccion(cambio.accion)}</td>
                                        <td className="px-6 py-4">{cambio.tabla}</td>
                                        <td className="px-6 py-4">{new Date(cambio.fecha).toLocaleString()}</td>
                                        <td className="px-6 py-4">{cambio.registro_id}</td>
                                        <td className="px-6 py-4">{formatearDatos(cambio.datos_anteriores, cambio.datos_nuevos, cambio.accion)}</td>
                                        <td className="px-6 py-4">{formatearDatos(cambio.datos_nuevos, cambio.datos_anteriores, cambio.accion)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </MenuPrincipal>
            </div>
        </div>
    );
};

export default HistorialCambios;
