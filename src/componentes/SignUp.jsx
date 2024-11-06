import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Proofisillas2 from "../../public/proofisillas2.svg"; // Logo de la empresa
import SignUpImg from "../../public/signup.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faLock, faSignature } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../supabase';
import { Navigate, useNavigate } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: '' });

    const handleSignup = async () => {
        if (!email || !password || !firstName || !lastName) {
            setAlerta({
                mostrar: true,
                mensaje: 'Error, por favor rellena todos los campos.',
                tipo: 'error'
            });
            return;
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setAlerta({
                mostrar: true,
                mensaje: 'Por favor, introduce un correo electrónico válido.',
                tipo: 'error'
            });
            return;
        }
    
        if (password.length < 6) {
            setAlerta({
                mostrar: true,
                mensaje: 'La contraseña debe tener al menos 6 caracteres.',
                tipo: 'error'
            });
            return;
        }
    
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*-_]/.test(password)) {
            setAlerta({
                mostrar: true,
                mensaje: 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.',
                tipo: 'error'
            });
            return;
        }
    
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
            setAlerta({
                mostrar: true,
                mensaje: 'El nombre y el apellido solo deben contener letras.',
                tipo: 'error'
            });
            return;
        }

        if (/\s/.test(email) || /\s/.test(password)) {
            setAlerta({
                mostrar: true,
                mensaje: 'El correo y la contraseña no deben contener espacios en blanco.',
                tipo: 'error'
            });
            return;
        }        
    
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    },
                },
            });
    
            if (error) {
                let mensajeError = 'Error desconocido.';
                if (error.message.includes('Invalid email')) {
                    mensajeError = 'El correo electrónico no es válido.';
                } else if (error.message.includes('Password should be at least')) {
                    mensajeError = 'La contraseña debe tener al menos 6 caracteres.';
                } else if (error.message.includes('Email already in use')) {
                    mensajeError = 'El correo electrónico ya está registrado.';
                }
    
                setAlerta({
                    mostrar: true,
                    mensaje: mensajeError,
                    tipo: 'error'
                });
            } else {
                setAlerta({
                    mostrar: true,
                    mensaje: 'Usuario creado con éxito. Por favor, verifica tu correo electrónico.',
                    tipo: 'exito'
                });
                console.log('Usuario creado con éxito:', data);
                navigate('/login');
            }
        } catch (err) {
            setAlerta({
                mostrar: true,
                mensaje: 'Ocurrió un error al intentar crear la cuenta.',
                tipo: 'error'
            });
        } finally {
            setTimeout(() => {
                setAlerta({ mostrar: false, mensaje: '', tipo: '' });
            }, 5000);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full overflow-auto">

            {/* Lado izquierdo con el formulario de registro */}
            <div className="dark:bg-[#242424] bg-white lg:col-span-1 p-6 flex flex-col justify-center items-center lg:h-full">

                {/* Logo de la empresa */}
                <img
                    src={Proofisillas2} // Logo de la empresa
                    alt="Logo de Proofisillas"
                    className="h-auto w-auto max-w-[500px] object-contain mb-8"
                />

                <h3 className="dark:text-white text-[#292929] text-3xl font-extrabold mb-8">Crear cuenta</h3>
                {/* Alerta */}
                {alerta.mostrar && (
                    <div className={`p-4 mb-4 text-sm rounded-lg ${alerta.tipo === 'error' ? 'text-red-600 bg-red-100 border-2 border-red-600' : 'text-green-600 bg-green-100 border-2 border-green-600'}`} role="alert">
                        <span className="font-medium">{alerta.tipo === 'error' ? 'Error' : 'Éxito'}:</span> {alerta.mensaje}
                    </div>
                )}
                <div className="space-y-4 w-full">
                    <div className="bg-slate-100 dark:bg-[#292929]">
                        <div className="flex items-center bg-slate-100 dark:bg-[#292929] text-slate-700 dark:text-white w-full rounded-md border-solid border-1 border-slate-500 focus-within:ring focus-within:ring-orange-500">
                            <FontAwesomeIcon icon={faSignature} className="text-slate-400 ml-4" />
                            <input
                                name="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="bg-transparent border-none text-sm px-4 py-2.5 w-full focus:outline-none"
                                placeholder="Nombre"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-[#292929]">
                        <div className="flex items-center bg-slate-100 dark:bg-[#292929] text-slate-700 dark:text-white w-full rounded-md border-solid border-1 border-slate-500 focus-within:ring focus-within:ring-orange-500">
                            <FontAwesomeIcon icon={faSignature} className="text-slate-400 ml-4" />
                            <input
                                name="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="bg-transparent border-none text-sm px-4 py-2.5 w-full focus:outline-none"
                                placeholder="Apellido"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-[#292929]">
                        <div className="flex items-center bg-slate-100 dark:bg-[#292929] text-slate-700 dark:text-white w-full rounded-md border-solid border-1 border-slate-500 focus-within:ring focus-within:ring-orange-500">
                            <FontAwesomeIcon icon={faAt} className="text-slate-400 ml-4" />
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                className="bg-transparent border-none text-sm px-4 py-2.5 w-full focus:outline-none"
                                placeholder="Correo electrónico"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-[#292929]">
                        <div className="flex items-center bg-slate-100 dark:bg-[#292929] text-slate-700 dark:text-white w-full rounded-md border-solid border-1 border-slate-500 focus-within:ring focus-within:ring-orange-500">
                            <FontAwesomeIcon icon={faLock} className="text-slate-400 ml-4" />
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                                className="bg-transparent border-none text-sm px-4 py-2.5 w-full focus:outline-none"
                                placeholder="Contraseña"
                            />
                        </div>
                    </div>
                </div>

                <div className="!mt-8 w-full">
                    <button
                        type="button"
                        onClick={handleSignup}
                        className="w-full shadow-xl py-3 px-4 text-sm font-semibold rounded text-white bg-orange-600 hover:bg-orange-500 focus:outline-none"
                    >
                        <span className="text-xl font-bold">Registrarse</span>
                    </button>
                </div>

                <div className="text-sm py-3">
                    <span className="text-slate-400 font-normal">Tienes cuenta? </span>
                    <Link to="/login" className="text-orange-600 hover:text-orange-500 font-semibold">Inicia sesión acá</Link>
                </div>
            </div>

            {/* Lado derecho vacío, oculto en pantallas pequeñas */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-b from-yellow-500 to-orange-500 p-6 h-screen">
                <img
                    src={SignUpImg} // Logo de la empresa
                    alt="Logo de Proofisillas"
                    className="h-auto w-auto m-auto object-contain mb-8"
                />
            </div>

        </div>

    )
}

export default SignUp;