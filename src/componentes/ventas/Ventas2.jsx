import React, { useEffect, useState } from "react";
import TablaGenerica from "../categorias/TablaGenerica";
import MenuPrincipal from "../MenuPrincipal";
import ModalAgregarVenta from "./ModalAgregarVenta";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import Alert from "../categorias/Alert";

const auth = getAuth(appFirebase);

const Ventas2 = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/ventas');
            const data = await response.json();
            setColumnas(Object.keys(data[0]));
            setDatos(data);
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
        }
    };

    const showAlert = (message, type = 'info') => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(''), 3000);
    };

    const handleAdd = () => setIsAddModalOpen(true);

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/ventas/${id}`, { method: 'DELETE' });
            fetchData();
            showAlert('Venta eliminada exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar la venta:', error);
            showAlert('Error al eliminar la venta', 'error');
        }
    };

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    titulo={"Ventas"}
                    subtitulo={"Seguimiento y control de transacciones"}
                >
                    <Alert message={alertMessage.message} type={alertMessage.type} />
                    <TablaGenerica
                        columnas={columnas}
                        datos={datos}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAlert={showAlert}
                    />
                </MenuPrincipal>
            </div>
            {isAddModalOpen && (
                <ModalAgregarVenta
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={() => showAlert('Venta agregada exitosamente', 'add')}
                />
            )}
        </div>
    );
};

export default Ventas2;