//importacion componentes
import './App.css'
import Home from './components/Home';
import Login from './components/Login';
import { useState } from 'react';


//importacion modulos Firebase
import appFirebase from '../src/credenciales';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
    </>
  )
}

export default App
