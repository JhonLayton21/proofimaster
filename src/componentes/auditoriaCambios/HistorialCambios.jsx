import React, { useState, useEffect } from 'react';
import MenuPrincipal from '../MenuPrincipal';
import { supabase } from '../../../supabase';
import { useAuth } from '../../UseAuth'; // Asumiendo que tienes el hook useAuth

const HistorialCambios = () => {
    const [auditoriaCambios, setAuditoriaCambios] = useState([]);
    const [limit, setLimit] = useState(5); // Estado para el límite de registros
    const { usuario } = useAuth(); // Obtiene el usuario desde el contexto de autenticación
    const userEmail = usuario?.email || ''; // Si el usuario está autenticado, obtenemos el correo, si no, lo dejamos vacío

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
                return <span className="text-red-500 font-semibold">Eliminación</span>;
            case 'INSERT':
                return <span className="text-green-500 font-semibold">Inserción</span>;
            case 'UPDATE':
                return <span className="text-blue-500 font-semibold">Actualización</span>;
            default:
                return <span className="text-gray-500">{accion}</span>;
        }
    };

    // Función para formatear los datos
    const formatearDatos = (datos) => {
        if (!datos) return null;
        const datosFiltrados = Object.entries(datos).filter(([_, valor]) => valor !== null);
        if (datosFiltrados.length === 0) return null;
        return (
            <ul className="list-disc list-inside">
                {datosFiltrados.map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
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
                    correoUsuario={userEmail}
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
                            <option className="bg-orange-500"value={20}>20 resultados</option>
                        </select>
                    </div>
                    <div className="relative overflow-x-auto rounded-2xl">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-slate-50 uppercase bg-[#f97316]">
                                <tr>
                                    <th className="px-6 py-3">Correo Usuario</th>
                                    <th className="px-6 py-3">Acción</th>
                                    <th className="px-6 py-3">Tabla</th>
                                    <th className="px-6 py-3">Fecha</th>
                                    <th className="px-6 py-3">Registro ID</th>
                                    <th className="px-6 py-3">Datos Anteriores</th>
                                    <th className="px-6 py-3">Datos Nuevos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditoriaCambios.map((cambio, index) => (
                                    <tr key={index} className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                                        <td className="px-6 py-4">{cambio.usuario}</td>
                                        <td className="px-6 py-4">{traducirAccion(cambio.accion)}</td>
                                        <td className="px-6 py-4">{cambio.tabla}</td>
                                        <td className="px-6 py-4">{new Date(cambio.fecha).toLocaleString()}</td>
                                        <td className="px-6 py-4">{cambio.registro_id}</td>
                                        <td className="px-6 py-4">{formatearDatos(cambio.datos_anteriores)}</td>
                                        <td className="px-6 py-4">{formatearDatos(cambio.datos_nuevos)}</td>
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








