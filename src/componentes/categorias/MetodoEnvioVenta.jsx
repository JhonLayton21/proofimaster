import React, { useEffect, useState } from "react";
import TablaGenerica from "./TablaGenerica";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import ModalEditar from "./ModalEditar";
import ModalAgregar from "./ModalAgregar";
import Alert from "./Alert";

const auth = getAuth(appFirebase);

const MetodoEnvioVenta = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    // DATOS METODOS ENVIO VENTAS
    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/metodo_envio_venta');
        const data = await response.json();
        setColumnas(Object.keys(data[0]));
        setDatos(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showAlert = (message, type = 'info') => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage(''), 3000);
    };

    // Funcion agregar
    const handleAdd = () => setIsAddModalOpen(true);

    // Funcion editar
    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    // Funcion eliminar
    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/metodo_envio_venta/${id}`, { method: 'DELETE' });
            fetchData();
            showAlert('Método de pago eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el método de pago:', error);
            showAlert('Error al eliminar el método de pago', 'error');
        }
    };
    

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    showTablaProductos={false}
                    titulo={"Métodos de Envíos"}
                    subtitulo={"Gestiona los métodos de envío y sus precios"}
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
            {/* Modales agregar y editar items */}
            {isAddModalOpen && (
                <ModalAgregar
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        fetchData();
                    }}
                    onSubmit={(nuevoMetodoEnvioVenta) => {
                        setDatos([...datos, nuevoMetodoEnvioVenta]);
                        showAlert('Metodo de envio de venta agregado exitosamente', 'add');
                    }}
                    titulo="Agregar Método de Envío"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'metodo', label: 'metodo', type: 'text', placeholder: 'Ingrese el método' },
                        { name: 'precio', label: 'precio', type: 'text', placeholder: 'Ingrese el precio' }
                    ]}
                    endpoint="metodo_envio_venta"
                    disabledFields={['id']}
                />
            )}
            {isEditModalOpen && (
                <ModalEditar
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        fetchData();
                    }}
                    editingItem={editingItem}
                    titulo="Editar Método de Envío"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'metodo', label: 'metodo', type: 'text', placeholder: 'Ingrese el método' },
                        { name: 'precio', label: 'precio', type: 'text', placeholder: 'Ingrese el precio' }
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        setDatos((prevDatos) =>
                            prevDatos.map((item) => (item.id === updatedItem.id ? updatedItem : item))
                        );
                        showAlert('Método de envio de venta editado exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint={"metodo_envio_venta"}
                />
            )}
        </div>
    )
}


export default MetodoEnvioVenta;