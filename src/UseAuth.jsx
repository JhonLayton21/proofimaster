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
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario')) || null);
  const [rol, setRol] = useState(localStorage.getItem('rol') || null);
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
        localStorage.removeItem('rol');
      } else {
        setRol(permisos.rol);
        localStorage.setItem('rol', permisos.rol);
      }
    } catch (error) {
      setRol(null);
      localStorage.removeItem('rol');
    }
  };

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUsuario(session.user);
          localStorage.setItem('usuario', JSON.stringify(session.user));
          await cargarPermisos(session.user.id);
        } else {
          setUsuario(null);
          setRol(null);
          localStorage.removeItem('usuario');
          localStorage.removeItem('rol');
        }
      } catch (error) {
        console.error("Error al verificar la sesión: ", error);
        setUsuario(null);
        setRol(null);
        localStorage.removeItem('usuario');
        localStorage.removeItem('rol');
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      if (session?.user) {
        setUsuario(session.user);
        localStorage.setItem('usuario', JSON.stringify(session.user));
        await cargarPermisos(session.user.id);
      } else {
        setUsuario(null);
        setRol(null);
        localStorage.removeItem('usuario');
        localStorage.removeItem('rol');
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, rol, loading }}>
      {children}
    </AuthContext.Provider>
  );
};