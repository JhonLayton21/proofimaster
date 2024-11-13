// useAuth.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);

  // Función para cargar permisos del usuario
  const cargarPermisos = async (userId) => {
    try {
      const { data: permisos, error: permisosError } = await supabase
        .from('permisos_usuarios')
        .select('rol')
        .eq('user_id', userId)
        .single();

      if (permisosError || !permisos) {
        setRol(null); // Si no tiene permisos o hay error
      } else {
        setRol(permisos.rol); // Asignar el rol del usuario
      }
    } catch (error) {
      setRol(null); // En caso de error
    }
  };

  // Obtener el estado de la sesión y escuchar cambios en la sesión
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUsuario(session?.user ?? null);

      if (session?.user) {
        cargarPermisos(session.user.id); // Cargar permisos después de la autenticación
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUsuario(session?.user ?? null);
      if (session?.user) {
        cargarPermisos(session.user.id); // Cargar permisos cuando cambia la sesión
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Proveer el contexto a los componentes hijos
  return (
    <AuthContext.Provider value={{ usuario, rol }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acceder al contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}