import React, { useState, useEffect } from "react";
import { db } from '../credenciales';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import MenuLateral from "./MenuLateral";
import MenuPrincipal from "./MenuPrincipal";

export default function Configuracion() {
  const [usersWithPermissions, setUsersWithPermissions] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [userData, setUserData] = useState({
    photoURL: "",
    displayName: "",
    email: "",
    emailVerified: false,
    role: "",
    status: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setUsersWithPermissions(users.filter(user => user.hasPermission));
      setPendingUsers(users.filter(user => !user.hasPermission));
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserData({
        photoURL: user.photoURL || "",
        displayName: user.displayName || "",
        email: user.email || "",
        emailVerified: user.emailVerified,
        role: "", // Asume que tienes una forma de obtener el rol del usuario
        status: "" // Asume que tienes una forma de obtener el estado del usuario
      });
    }
  }, []);

  const grantPermission = async (uid) => {
    await updateDoc(doc(db, "users", uid), { hasPermission: true });
    setPendingUsers(pendingUsers.filter(user => user.id !== uid));
    const updatedUser = pendingUsers.find(user => user.id === uid);
    setUsersWithPermissions([...usersWithPermissions, updatedUser]);
  };

  return (
    <div className="grid grid-cols-12 gap-0 h-screen overflow-hidden">
      {/* MENU LATERAL */}

      {/* MENU PRINCIPAL */}
      <div className="col-span-12 h-full overflow-y-auto">
        <MenuPrincipal titulo="CONFIGURACION" subtitulo="Ajusta las configuraciones de tu cuenta">
          <div className="p-4">
            <div className="mt-6 border-t border-gray-300">
              <dl className="divide-y divide-gray-300">
                <h2 className="text-orange-500 text-xl font-medium">DATOS CUENTA</h2>
                <div className="flex flex-col sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 dark:text-slate-100 text-gray-900">Foto de perfil</dt>
                  <dd className="flex justify-center items-center mt-1 text-sm leading-6 text-[#757575] sm:col-span-2 sm:mt-0">
                    <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {userData.photoURL ? (
                        <img src={userData.photoURL} alt="Foto de perfil" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-500">Sin foto</div>
                      )}
                    </div>
                  </dd>
                </div>
                
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 dark:text-slate-100 text-gray-900">Nombre completo</dt>
                  <dd className="mt-1 text-sm leading-6 text-[#757575] sm:col-span-2 sm:mt-0">{userData.displayName}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 dark:text-slate-100 text-gray-900">Dirección de correo</dt>
                  <dd className="mt-1 text-sm leading-6 text-[#757575] sm:col-span-2 sm:mt-0">{userData.email}</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 dark:text-slate-100 text-gray-900">Correo electrónico verificado</dt>
                  <dd className="mt-1 text-sm leading-6 text-[#757575] sm:col-span-2 sm:mt-0">
                    {userData.emailVerified ? "Sí" : "No"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6">
              <h2 className="text-orange-500 text-xl font-medium">Gestión de Permisos</h2>

              <h3 className="text-lg font-medium mt-4 dark:text-slate-100 text-gray-900">Usuarios con Permisos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="text-slate-50 bg-[#f97316]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 uppercase tracking-wide">Correo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersWithPermissions.map(user => (
                      <tr key={user.id} className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]" >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-medium mt-4 dark:text-slate-100 text-gray-900">Usuarios Pendientes</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="text-slate-50 bg-[#f97316]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 uppercase tracking-wide">Correo</th>
                      <th className="px-6 py-3 text-xs font-medium text-slate-50 uppercase tracking-wide text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingUsers.map(user => (
                      <tr key={user.id} className="bg-white border-b dark:bg-[#292929] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#202020]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          <button 
                            onClick={() => grantPermission(user.id)} 
                            className="text-white-500 hover:text-white-700"
                          >
                            Conceder Permisos
                          </button>
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







