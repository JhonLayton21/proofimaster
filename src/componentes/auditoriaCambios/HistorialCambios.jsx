import React, { useState, useEffect } from 'react';
import MenuPrincipal from '../MenuPrincipal';
import { supabase } from '../../../supabase';
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';

const auth = getAuth(appFirebase);

const HistorialCambios = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [auditoriaCambios, setAuditoriaCambios] = useState([]);

    const fetchAuditoriaCambios = async () => {
        try {
            const { data, error } = await supabase
                .from('auditoria_cambios')
                .select('*');

            if (error) {
                throw error;
            } else {
                setAuditoriaCambios(data);
            }
        } catch (error) {
            alert("Error obteniendo los datos de auditoría de cambios");
        }
    };

    // Traducir las acciones a español
    const traducirAccion = (accion) => {
        switch (accion) {
            case 'DELETE':
                return 'Eliminar';
            case 'INSERT':
                return 'Insertar';
            case 'UPDATE':
                return 'Actualizar';
            default:
                return accion;
        }
    };

    useEffect(() => {
        fetchAuditoriaCambios();

        const channel = supabase
            .channel('custom-all-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'auditoria_cambios' },
                (payload) => fetchAuditoriaCambios()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    titulo="Historial de cambios"
                    subtitulo="Visualiza los cambios realizados por los distintos miembros"
                >
                    <div className="relative overflow-x-auto rounded-2xl">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-slate-50 uppercase bg-[#f97316]">
                                <tr>
                                    <th className="px-6 py-3">Correo Usuario</th>
                                    <th className="px-6 py-3">Acción</th>
                                    <th className="px-6 py-3">Tabla</th>
                                    <th className="px-6 py-3">Registro ID</th>
                                    <th className="px-6 py-3">Datos Anteriores</th>
                                    <th className="px-6 py-3">Datos Nuevos</th>
                                    <th className="px-6 py-3">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditoriaCambios.map((cambio, index) => (
                                    <tr key={index} className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                                        <td className="px-6 py-4">{cambio.correo_usuario}</td>
                                        <td className="px-6 py-4">{traducirAccion(cambio.accion)}</td>
                                        <td className="px-6 py-4">{cambio.tabla}</td>
                                        <td className="px-6 py-4">{cambio.registro_id}</td>
                                        <td className="px-6 py-4">{JSON.stringify(cambio.datos_anteriores)}</td>
                                        <td className="px-6 py-4">{JSON.stringify(cambio.datos_nuevos)}</td>
                                        <td className="px-6 py-4">{new Date(cambio.fecha).toLocaleString()}</td>
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




