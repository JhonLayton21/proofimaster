import React, { useEffect, useState } from "react";
import TablaGenerica from "./TablaGenerica";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import ModalAgregar from "./ModalAgregar";
import ModalEditar from "./ModalEditar";
import Alert from "./Alert";

const auth = getAuth(appFirebase);

const MarcaProductos = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');


    // DATOS MARCA PRODUCTOS
    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/marcas_productos');
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

    // Funcion Eliminar
    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/marcas_productos/${id}`, { method: 'DELETE' });
            fetchData();
            showAlert('Marca de producto eliminada exitosamente', 'delete');
        } catch (error) {
            console.error('Error al eliminar la marca de producto:', error);
            showAlert('Error al eliminar la marca de producto', 'error');
        }
    };


    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    showTablaProductos={false}
                    titulo={"Marcas de productos"}
                    subtitulo={"Gestiona las marcas de tus productos"}
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
                    onSubmit={(nuevaMarcaProducto) => {
                        setDatos([...datos, nuevaMarcaProducto]);
                        showAlert('Marca de producto agregada exitosamente', 'add');
                    }}
                    titulo="Agregar Marca de Producto"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'nombre', label: 'nombre', type: 'text', placeholder: 'Ingrese el nombre' },
                    ]}
                    endpoint="marcas_productos"
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
                    titulo="Editar Marca de Producto"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'nombre', label: 'nombre', type: 'text', placeholder: 'Ingrese el nombre' },
                    ]}
                    initialData={editingItem}
                    disabledFields={['id']}
                    onSubmit={(updatedItem) => {
                        setDatos((prevDatos) =>
                            prevDatos.map((item) => (item.id === updatedItem.id ? updatedItem : item))
                        );
                        showAlert('Marca de producto editado exitosamente', 'edit');
                    }}
                    endpoint={"marcas_productos"}
                />
            )}
        </div>
    )
}


export default MarcaProductos;