import React, { useEffect, useState } from "react";
import TablaGenerica from "./TablaGenerica";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';

const auth = getAuth(appFirebase);

const MetodosPago = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);

    // DATOS METODOS PAGO
    useEffect(() => {
        fetch('http://localhost:5000/metodo_pago')
            .then((response) => response.json())
            .then((data) => {
                setColumnas(Object.keys(data[0]));
                setDatos(data);
            });
    }, []);
    

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    showTablaProductos={false}
                    titulo={"Métodos de Pago"}
                    subtitulo={"Gestiona los tipos y métodos de pago de la empresa"}
                >
                    <TablaGenerica columnas={columnas} datos={datos}/>
                </MenuPrincipal>
            </div>
        </div>
    )
}


export default MetodosPago;