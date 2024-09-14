import React, { useEffect, useState } from "react";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import TablaGenerica from "../componentesTablasDatos/TablaGenerica";
import ModalEditar from "../componentesTablasDatos/ModalEditar";
import ModalAgregar from "../componentesTablasDatos/ModalAgregar";
import Alert from "../componentesTablasDatos/Alert";

const auth = getAuth(appFirebase);

const Proveedores2 = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [metodosPago, setMetodosPago] = useState([]);

    useEffect(() => {
        fetchData();
        fetchMetodosPago();
    }, []);

    const fetchMetodosPago = async () => {
        try {
            const response = await fetch('http://localhost:5000/metodo_pago');
            const data = await response.json();
            setMetodosPago(data);
        } catch (error) {
            console.error('Error al obtener los metodos de pago:', error);
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/proveedores');
            const data = await response.json();
            setColumnas(Object.keys(data[0]));
            setDatos(data);
        } catch (error) {
            console.error('Error al obtener los proveedores:', error);
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
            await fetch(`http://localhost:5000/proveedores/${id}`, { method: 'DELETE' });
            fetchData();
            showAlert('Proveedor eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
            showAlert('Error al eliminar el proveedor', 'error');
        }
    };

    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    titulo={"Proveedores"}
                    subtitulo={"Gestiona los proveedores y su información básica"}
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
                <ModalAgregar
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        fetchData();
                    }}
                    onSubmit={(nuevoProveedor) => {
                        setDatos([...datos, nuevoProveedor]);
                        showAlert('Proveedor agregado exitosamente', 'add');
                    }}
                    titulo="Agregar Proveedor"
                    campos={[
                        { name: 'id', label: 'Id', type: 'number', placeholder: 'Id automático' },
                        { name: 'nombre_proveedor', label: 'Nombre proveedor', type: 'text', placeholder: 'Nombre proveedor' },
                        { name: 'contacto_proveedor', label: 'Contacto proveedor', type: 'text', placeholder: 'Ingrese el contacto del proveedor' },
                        { name: 'direccion_proveedor', label: 'Dirección proveedor', type: 'text', placeholder: 'Ingrese la dirección del proveedor' },
                        { name: 'email_proveedor', label: 'Email proveedor', type: 'email', placeholder: 'Ingrese el correo del proveedor' },
                        { name: 'telefono_proveedor', label: 'Teléfono proveedor', type: 'text', placeholder: 'Ingrese el teléfono del proveedor' },
                        {
                            name: 'metodo_pago_id',
                            label: 'Método pago proveedor',
                            type: 'select',
                            options: metodosPago.map(metodo => ({ value: metodo.id, label: metodo.metodo })),
                            placeholder: 'Seleccione el método de pago de proveedor'
                        },
                    ]}
                    endpoint="proveedores"
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
                    titulo="Editar proveedor"
                    campos={[
                        { name: 'id', label: 'Id', type: 'number', placeholder: 'Id automático' },
                        { name: 'nombre_proveedor', label: 'Nombre proveedor', type: 'text', placeholder: 'Nombre proveedor' },
                        { name: 'contacto_proveedor', label: 'Contacto proveedor', type: 'text', placeholder: 'Ingrese el contacto del proveedor' },
                        { name: 'direccion_proveedor', label: 'Dirección proveedor', type: 'text', placeholder: 'Ingrese la dirección del proveedor' },
                        { name: 'email_proveedor', label: 'Email proveedor', type: 'email', placeholder: 'Ingrese el correo del proveedor' },
                        { name: 'telefono_proveedor', label: 'Teléfono proveedor', type: 'text', placeholder: 'Ingrese el teléfono del proveedor' },
                        {
                            name: 'metodo_pago_id',
                            label: 'Método pago proveedor',
                            type: 'select',
                            options: metodosPago.map(metodo => ({ value: metodo.id, label: metodo.metodo })),
                            placeholder: 'Seleccione el método de pago de proveedor'
                        },
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        setDatos((prevDatos) =>
                            prevDatos.map((item) => (item.id === updatedItem.id ? updatedItem : item))
                        );
                        showAlert('Proveedor editado exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint={"proveedores"}
                />
            )}
        </div>
    );
};

export default Proveedores2;
