import React, { useState, useEffect } from "react";
import MenuPrincipal from "./MenuPrincipal";
import { supabase } from "../../supabase";

export default function Configuracion() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase
        .from('permisos_usuarios')
        .select('user_id, rol');

      if (!error) {
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
        <MenuPrincipal titulo="CONFIGURACION" subtitulo="Ajusta las configuraciones de tu cuenta">
          <div className="p-4">

            <div className="mt-6">
              <h2 className="text-orange-500 text-xl font-medium">Gestión de Permisos</h2>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th>Usuario ID</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => (
                    <tr key={usuario.user_id}>
                      <td>{usuario.user_id}</td>
                      <td>{usuario.rol}</td>
                      <td>
                        <select
                          value={usuario.rol}
                          onChange={(e) => handleUpdatePermisos(usuario.user_id, e.target.value)}
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
        </MenuPrincipal>
      </div>
    </div>
  );
}







