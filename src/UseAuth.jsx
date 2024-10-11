import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../supabase'; 

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook que proporciona el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Función para cargar permisos del usuario
  const cargarPermisos = async (userId) => {
    try {
      const { data: permisos, error: permisosError } = await supabase
        .from('permisos_usuarios')
        .select('rol')
        .eq('user_id', userId)
        .single();
      
      if (permisosError || !permisos) {
        setRol(null);
      } else {
        setRol(permisos.rol);
      }
    } catch (error) {
      setRol(null);
    }
  };

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        // Verificar si existe una sesión
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUsuario(session.user);
          await cargarPermisos(session.user.id);
        } else {
          setUsuario(null);
          setRol(null);
        }
      } catch (error) {
        console.error("Error al verificar la sesión: ", error);
        setUsuario(null);
        setRol(null);
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();

    // Detectar cambios en el estado de autenticación
    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true); // Iniciar carga en caso de cambio de sesión
      if (session?.user) {
        setUsuario(session.user);
        await cargarPermisos(session.user.id);
      } else {
        setUsuario(null);
        setRol(null);
      }
      setLoading(false);
    });

    // Al cerrar la ventana, cerrar sesión
    const handleBeforeUnload = () => {
      supabase.auth.signOut(); // Cerrar la sesión cuando la pestaña o ventana se cierre
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      subscription?.unsubscribe?.();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, rol, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

