import React, { useEffect, useState } from "react";
import TablaGenerica from "./TablaGenerica";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import ModalEditar from "./ModalEditar";
import ModalAgregar from "./ModalAgregar";
import Alert from "./Alert";

const auth = getAuth(appFirebase);

const ReferenciaProductos = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    // DATOS REFERENCIAS PRODUCTOS
    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/referencias_productos');
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

    // Funcion Agregar
    const handleAdd = () => setIsAddModalOpen(true);


    // Funcion editar
    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    // Funcion eliminar
    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/referencias_productos/${id}`, { method: 'DELETE' });
            fetchData();
            showAlert('Referencia de producto eliminado exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar la referencia de producto:', error);
            showAlert('Error al eliminar la referencia de producto', 'error');
        }
    };


    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    showTablaProductos={false}
                    titulo={"Referencias de Productos"}
                    subtitulo={"Gestiona las referencias"}
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
                    onSubmit={(nuevaReferenciaProductos) => {
                        setDatos([...datos, nuevaReferenciaProductos]);
                        showAlert('Referencia de producto agregada exitosamente', 'add');
                    }}
                    titulo="Agregar Referencia de Producto"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'codigo', label: 'codigo', type: 'text', placeholder: 'Ingrese el codigo' },
                    ]}
                    endpoint="referencias_productos"
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
                    titulo="Editar Referencia de Producto"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'codigo', label: 'codigo', type: 'text', placeholder: 'Ingrese el codigo' },
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        setDatos((prevDatos) =>
                            prevDatos.map((item) => (item.id === updatedItem.id ? updatedItem : item))
                        );
                        showAlert('Referencia de producto editada exitosamente', 'edit');
                    }}
                    disabledFields={['id']}
                    endpoint={"referencias_productos"}
                />
            )}
        </div>
    )
}


export default ReferenciaProductos;