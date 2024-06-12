import React from 'react'
import appFirebase from '../credenciales'
import { getAuth, signOut } from 'firebase/auth'
const auth = getAuth(appFirebase)

const Home = ({correoUsuario}) => {
    return (
        <div>
            Bienvenido usuario {correoUsuario}
            <button className="btn btn-primary" onClick={()=> signOut(auth)}>
                Cerrar sesión
            </button>
        </div>
    )
}

export default Home