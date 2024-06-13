//importacion componentes
import '../App.css';
import Home from '../componentes/Home';
import Login from '../componentes/Login';
import { useState } from 'react';


//importacion modulos Firebase
import appFirebase from '../credenciales';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Outlet } from 'react-router-dom';
const auth = getAuth(appFirebase);


function App() {

  const [usuario, setUsuario] = useState(null)

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      setUsuario(usuarioFirebase) //usuario correctamente autenticado
    } else {
      setUsuario(null) //usuario incorrectamente autenticado
    }
  });

  return (
    <>
      {usuario ? <Home correoUsuario = {usuario.email} /> : <Login/>} 
      <div id='detail'>
        <Outlet />
      </div>
    </>
  )
}

export default App
