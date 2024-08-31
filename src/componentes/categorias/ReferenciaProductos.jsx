import React, { useEffect, useState } from "react";
import TablaGenerica from "./TablaGenerica";
import MenuPrincipal from "../MenuPrincipal";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import ModalEditar from "./ModalEditar";
import ModalAgregar from "./ModalAgregar";

const auth = getAuth(appFirebase);

const ReferenciaProductos = () => {
    const userEmail = auth.currentUser ? auth.currentUser.email : '';
    const [datos, setDatos] = useState([]);
    const [columnas, setColumnas] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // DATOS METODOS PAGO
    useEffect(() => {
        fetch('http://localhost:5000/referencias_productos')
            .then((response) => response.json())
            .then((data) => {
                setColumnas(Object.keys(data[0]));
                setDatos(data);
            });
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
    const handleDelete = (id) => {
        const newData = datos.filter(item => item.id !== id);
        setDatos(newData);
    }


    return (
        <div className="grid grid-cols-12 gap-0 h-full overflow-auto">
            <div className="col-span-12">
                <MenuPrincipal
                    correoUsuario={userEmail}
                    showTablaProductos={false}
                    titulo={"Referencias de Productos"}
                    subtitulo={"Gestiona las referencias"}
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
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={(nuevaReferenciaProductos) => setDatos([...datos, nuevaReferenciaProductos])}
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
                    onClose={() => setIsEditModalOpen(false)}
                    editingItem={editingItem}
                    titulo="Editar Referencia de Producto"
                    campos={[
                        { name: 'id', label: 'id', type: 'number', placeholder: 'Id automático' },
                        { name: 'codigo', label: 'codigo', type: 'text', placeholder: 'Ingrese el codigo' },
                    ]}
                    initialData={editingItem}
                    disabledFields={['id']}
                />
            )}
        </div>
    )
}


export default ReferenciaProductos;