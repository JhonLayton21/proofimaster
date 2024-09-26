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
  const [rol, setRol] = useState(null); // Nuevo estado para el rol
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUsuario(session.user);
        // Verificar permisos
        const { data: permisos, error: permisosError } = await supabase
          .from('permisos_usuarios')
          .select('rol')
          .eq('user_id', session.user.id)
          .single();

        if (permisosError || !permisos) {
          setRol(null);
        } else {
          setRol(permisos.rol);
        }
      } else {
        setUsuario(null);
        setRol(null);
      }

      setLoading(false);
    };

    verificarSesion();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUsuario(session?.user || null);
      setLoading(false); // Indicar que ya no está cargando
      if (session?.user) {
        // Verificar permisos nuevamente en caso de cambio de sesión
        const { data: permisos, error: permisosError } = await supabase
          .from('permisos_usuarios')
          .select('rol')
          .eq('user_id', session.user.id)
          .single();
          
        if (permisosError || !permisos) {
          setRol(null);
        } else {
          setRol(permisos.rol);
        }
      } else {
        setRol(null);
      }
    });

    return () => {
      // Asegúrate de que subscription sea válido antes de intentar desuscribirte
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, rol, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
