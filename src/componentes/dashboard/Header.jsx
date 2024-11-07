import React, { useEffect, useState, useRef } from 'react';
import { IconButton } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import MenuCuenta from "./MenuCuenta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faImagePortrait, faBell, faWarning } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../supabase';

const Header = ({ isDrawerOpen, openDrawer }) => {
    const [correoUsuario, setCorreoUsuario] = useState(null);
    const [nombreUsuario, setNombreUsuario] = useState(null);
    const [rolUsuario, setRolUsuario] = useState('Cargando...');
    const [lowStock, setLowStock] = useState(false);
    const [showAlertList, setShowAlertList] = useState(false); // Estado para la visibilidad de la lista
    const [lowStockProducts, setLowStockProducts] = useState([]); // Estado para productos con stock bajo
    const alertRef = useRef(null);

    // Obtener datos del usuario
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Realiza ambas solicitudes en paralelo
                const [{ data: { user }, error: userError }, { data: userRoleData, error: roleError }] = await Promise.all([
                    supabase.auth.getUser(),
                    supabase.from('permisos_usuarios').select('rol').eq('user_id', (await supabase.auth.getUser()).data.user?.id).single()
                ]);
    
                if (userError) {
                    console.error("Error al obtener el usuario:", userError);
                    return;
                }
    
                if (user) {
                    setCorreoUsuario(user.email);
                    setNombreUsuario(user.user_metadata?.name || "Usuario");
                }
    
                if (roleError) {
                    console.error("Error al obtener el rol:", roleError);
                } else if (userRoleData) {
                    setRolUsuario(userRoleData.rol);
                }
            } catch (error) {
                console.error("Error en fetchUserInfo:", error);
            }
        };
    
        fetchUserInfo();
    
        // Configuración del listener de autenticación
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                try {
                    // Obtén el usuario y el rol en paralelo
                    const [{ data: { user }, error: userError }, { data: userRoleData, error: roleError }] = await Promise.all([
                        Promise.resolve({ data: { user: session.user }, error: null }),  // Usa el usuario de la sesión
                        supabase.from('permisos_usuarios').select('rol').eq('user_id', session.user.id).single()
                    ]);
    
                    if (userError) {
                        console.error("Error al obtener el usuario:", userError);
                        return;
                    }
    
                    setCorreoUsuario(user.email);
                    setNombreUsuario(user.user_metadata?.name || "Usuario");
    
                    if (roleError) {
                        console.error("Error al obtener el rol:", roleError);
                    } else if (userRoleData) {
                        setRolUsuario(userRoleData.rol);
                    }
                } catch (error) {
                    console.error("Error en onAuthStateChange:", error);
                }
            } else {
                // Resetear datos del usuario si no está autenticado
                setCorreoUsuario(null);
                setNombreUsuario(null);
                setRolUsuario('Cargando...');
            }
        });
    
        // Cleanup para desuscribir el listener
        return () => authListener?.unsubscribe && authListener.unsubscribe();
    }, []);
    

    // Verificar stock bajo
    useEffect(() => {
        const checkLowStock = async () => {
            try {
                const { data, error } = await supabase.rpc('alertas_stock');
                if (error) console.error("Error al verificar stock bajo:", error);
                else {
                    setLowStock(data.length > 0);
                    setLowStockProducts(data);
                }
            } catch (error) {
                console.error("Error al ejecutar la función SQL:", error.message);
            }
        };

        checkLowStock();
        const interval = setInterval(checkLowStock, 60000); // Revisión cada minuto
        return () => clearInterval(interval);
    }, []);

    // Cerrar lista al hacer clic afuera o presionar "Esc"
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (alertRef.current && !alertRef.current.contains(event.target)) {
                setShowAlertList(false);
            }
        };
        
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setShowAlertList(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    return (
        <div className="top-0 left-0 w-full z-50 flex flex-col md:flex-row items-center justify-between bg-white dark:bg-[#292929] p-4 rounded-md space-y-4 md:space-y-0 m-2 md:m-0 shadow-lg">
            <IconButton
                variant="text"
                size="lg"
                onClick={openDrawer}
                className="dark:bg-[#242424] hover:border-[#ff6f00] shadow-xl flex justify-center items-center"
            >
                {isDrawerOpen ? (
                    <XMarkIcon className="h-8 w-8 stroke-2 text-[#ff6f00]" />
                ) : (
                    <Bars3Icon className="h-8 w-8 stroke-2 text-[#ff6f00]" />
                )}
            </IconButton>

            <div className="text-[#ff6f00] font-bold text-2xl md:text-3xl text-left px-4">
                <h3>Bienvenido, {nombreUsuario}</h3>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-end space-x-0 md:space-x-8 space-y-4 md:space-y-0 w-full md:w-auto">
                <div className="relative" ref={alertRef}>
                    <FontAwesomeIcon
                        icon={faBell}
                        onClick={() => setShowAlertList(!showAlertList)}
                        className={`fa-xl cursor-pointer ${lowStock ? "animate-bounce text-[#ff6f00]" : "text-slate-800 dark:text-slate-50"}`}
                    />
                    {showAlertList && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#333] border border-gray-200 dark:border-[#444] rounded shadow-lg max-h-48 overflow-y-auto z-10">   
                            <ul className="p-4">
                            <p className="text-red-600 font-bold"><FontAwesomeIcon icon={faWarning} className="mb-2 sm:mb-0 mr-2 text-red-600" /> Alertas de Stock:</p>
                                {lowStockProducts.length > 0 ? (
                                    lowStockProducts.map((product) => (
                                        <li key={product.id} className="py-2 font-semibold border-b border-gray-200 dark:border-[#555] last:border-0">
                                            <span className=""> {product.nombre} </span> - <span className="text-red-600 font-thin"> Stock: {product.stock} </span> - <span className="text-green-600 font-thin"> Mínimo: {product.nivel_minimo_stock} </span> 
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 dark:text-gray-300">No hay alertas de stock bajo.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-2 cursor-pointer w-full md:w-auto">
                    <FontAwesomeIcon icon={faFileLines} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                    <div className="flex-grow">
                        <p className="text-slate-800 dark:text-slate-50 text-sm font-bold text-left">Documentación</p>
                        <p className="text-sm font-medium text-[#757575] dark:text-[#757575] text-left">Entiende la plataforma</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 cursor-pointer w-full md:w-auto">
                    <FontAwesomeIcon icon={faImagePortrait} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                    <div className="flex-grow pr-4">
                        <p className="text-sm text-slate-800 dark:text-slate-50 font-bold text-left">
                            {correoUsuario || "Cargando..."}
                        </p>
                        <p className="text-sm font-medium text-[#757575] dark:text-[#757575] text-left">
                            {rolUsuario || "Cargando..."}
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <MenuCuenta />
                </div>
            </div>
        </div>
    );
};

export default Header;