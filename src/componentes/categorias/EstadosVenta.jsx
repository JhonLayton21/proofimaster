import React, { useEffect, useState } from "react";
import TablaGenerica from "./TablaGenerica";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import ModalEditar from "./ModalEditar";
import ModalAgregar from "./ModalAgregar";

const auth = getAuth(appFirebase);

const EstadosVenta = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // DATOS ESTADOS VENTA
    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/estado_venta');
        const data = await response.json();
        setColumnas(Object.keys(data[0]));
        setDatos(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Funcion Agregar
    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    // Funcion editar
    const handleEdit = (item) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    // Funcion Eliminar
    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/estado_venta/${id}`, { method: 'DELETE' });
        fetchData();  
    };


    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    showTablaProductos={false}
                    titulo={"Estados de venta"}
                    subtitulo={"Gestiona los estados de venta y sus acciones"}
                >
                    <TablaGenerica
                        columnas={columnas}
                        datos={datos}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
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
                    onSubmit={(nuevoEstadoVenta) => setDatos([...datos, nuevoEstadoVenta])}
                    titulo="Agregar Estado de Venta"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'estado', label: 'estado', type: 'text', placeholder: 'Ingrese el estado' },
                    ]}
                    endpoint="estado_venta"
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
                    titulo="Editar Estado de Venta"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'estado', label: 'estado', type: 'text', placeholder: 'Ingrese el estado' },
                    ]}
                    initialData={editingItem}
                    onSubmit={(updatedItem) => {
                        setDatos((prevDatos) =>
                            prevDatos.map((item) => (item.id === updatedItem.id ? updatedItem : item))
                        );
                    }}
                    disabledFields={['id']}
                    endpoint={"estado_venta"}
                />
            )}
        </div>
    )
}


export default EstadosVenta;