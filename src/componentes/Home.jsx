import React from 'react';
//CONFIGURACION FIREBASE
import appFirebase from '../credenciales';

//FUNCIONES FIREBASE A USAR 
import { getAuth, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

//INSTANCIA INICIAL AUTENTICACION
const auth = getAuth(appFirebase)

const Home = ({ correoUsuario }) => {
    return (
        <>
        <div>
            Bienvenido usuario {correoUsuario}
            <button className="btn btn-primary" onClick={() => signOut(auth)}>
                Cerrar sesión
            </button>
        </div>
        <Link to="/configuracion">Configuracion</Link>
        </>
    );
};

export default Home;