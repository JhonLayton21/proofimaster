import React, { useState, useEffect } from "react";
import MenuPrincipal from "./MenuPrincipal";
import { supabase } from "../../supabase";

export default function Configuracion() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase
        .rpc('obtener_info_permisos_usuarios')
        .select();

      if (error) {
        console.error("Error mostrandos datos:", error);
      } else {
        setUsuarios(data);
      }
    };

    fetchUsuarios();
  }, []);

  const handleUpdatePermisos = async (userId, newRol) => {
    const { error } = await supabase
      .from('permisos_usuarios')
      .update({ rol: newRol })
      .eq('user_id', userId);

    if (!error) {
      setUsuarios(prevState =>
        prevState.map(user =>
          user.user_id === userId ? { ...user, rol: newRol } : user
        )
      );
    }
  };

  return (
    <div className="grid grid-cols-12 gap-0 h-screen overflow-hidden">
      {/* MENU LATERAL */}

      {/* MENU PRINCIPAL */}
      <div className="col-span-12 h-full overflow-y-auto">
        <MenuPrincipal titulo="CONFIGURACIÓN" subtitulo="Ajusta los permisos de los usuarios">
          <div className="p-4">

            <div className="mt-6">
              {/* Tabla datos */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs uppercase bg-[#f97316] text-white">
                    <tr>
                      <th scope="col" className="px-6 py-3">Usuario ID</th>
                      <th scope="col" className="px-6 py-3">Email</th>
                      <th scope="col" className="px-6 py-3">Rol</th>
                      <th scope="col" className="px-6 py-3">Asignar permisos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(usuario => (
                      <tr
                        key={usuario.user_id}
                        className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {usuario.user_id}
                        </th>
                        <td className="px-6 py-4">{usuario.email}</td>
                        <td className="px-6 py-4">{usuario.rol}</td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={usuario.rol}
                            onChange={(e) => handleUpdatePermisos(usuario.user_id, e.target.value)}
                            className="block w-full px-4 py-2 text-sm text-gray-900 bg-white border rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:!bg-[#292929] dark:border-orange-600 dark:!placeholder-[#202020] dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
                          >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="sin_permiso">Sin Permiso</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </MenuPrincipal>
      </div>

    </div>
  );
}







