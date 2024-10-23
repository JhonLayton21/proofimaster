import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handlePasswordUpdate = async () => {
        if (!password) {
            setError('Por favor ingresa una nueva contraseña.');
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) {
                setError('Error al actualizar la contraseña: ' + error.message);
            } else {
                setError(null);
                navigate('/login'); // Redirige al login después de actualizar la contraseña
            }
        } catch (err) {
            setError('Error inesperado al actualizar la contraseña.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-[#242424] dark:border-gray-700">
                <FontAwesomeIcon icon={faLock} className="text-slate-400 ml-4" />

                <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Actualizar contraseña</h5>
                <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
                    En el siguiente campo introduce la nueva contraseña para tu cuenta asociada al email correspondiente:
                </p>
                <label for="input-group-1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Tu nueva contraseña:
                </label>
                <div class="relative mb-6 bg-slate-100 dark:bg-[#292929] text-slate-700 dark:text-white w-full rounded-md border-solid border-1 border-slate-500 focus-within:ring focus-within:ring-orange-500">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none px-6">
                        <FontAwesomeIcon icon={faLock} className="text-slate-400 ml-4" />
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="input-group-1"
                        class="bg-transparent ml-12 border-none text-sm px-4 py-2.5 w-full focus:outline-none"
                        placeholder="Nueva contraseña"
                    />
                </div>
                <a onClick={handlePasswordUpdate} class="inline-flex font-medium items-center text-orange-600 hover:underline">
                    <Link to="/login">Actualizar contraseña</Link>
                    <svg class="w-3 h-3 ms-2.5 rtl:rotate-[270deg]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778" />
                    </svg>
                </a>
            </div>
            {error && <p>{error}</p>}
        </div>
    );
};

export default UpdatePassword;
