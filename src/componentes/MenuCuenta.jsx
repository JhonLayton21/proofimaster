import React, { useEffect, useRef, useState } from "react";
import { faCircleUser, faFileLines, faBell, faEnvelope, faGear, faImagePortrait } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAuth, signOut } from 'firebase/auth';
import appFirebase from '../credenciales';
import { Link } from "react-router-dom";

const auth = getAuth(appFirebase);

export default function MenuCuenta() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <section className="bg-gray-2 dark:bg-dark">
      <div className="container">
        <div className="flex justify-center">
          <div className="relative inline-block">
            <button
              ref={trigger}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="mb-3.5 inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-stroke bg-[#ff6f00] text-slate-100 px-6 py-3 text-base font-bold text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              Mi cuenta
              <span
                className={`duration-100 ${dropdownOpen ? "-scale-y-100" : ""}`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4062 5.65625 17.6875 5.9375C17.9688 6.21875 17.9688 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1562 10.1875 14.25 10 14.25Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </button>
            <div
              ref={dropdown}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setDropdownOpen(false)}
              className={`absolute right-0 top-full w-[240px] divide-y divide-stroke overflow-hidden rounded-lg z-40 bg-white dark:divide-dark-3 dark:bg-[#292929] ${dropdownOpen ? "block" : "hidden"}`}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="relative aspect-square w-10 rounded-full">
                  <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                  <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-dark"></span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 text-dark dark:text-white">
                    Jhon Layton
                  </p>
                  <p className="text-sm text-body-color text-[#757575] dark:text-dark-6">
                    jhonlayton@outlook.com
                  </p>
                </div>
              </div>
              <div>
                <a
                  href="#0"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-[#757575] text-sm font-medium text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Ver perfil
                  <FontAwesomeIcon icon={faImagePortrait} className="text-slate-800 dark:text-slate-50 fa-lg" /> </a>
                <Link to="/configuracion"
                  href="#0"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-[#757575] text-sm font-medium text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Configuración
                  <FontAwesomeIcon icon={faGear} className="text-slate-800 dark:text-slate-50 fa-lg" /> </Link>
              </div>
              <div>
                <a
                  href="#0"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-[#757575] text-sm font-medium text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Ir al correo
                  <FontAwesomeIcon icon={faEnvelope} className="text-slate-800 dark:text-slate-50 fa-lg cursor-pointer" /> </a>
                <a
                  href="#0"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-[#757575] text-sm font-medium text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Consultar alertas
                  <FontAwesomeIcon icon={faBell} className="text-slate-800 dark:text-slate-50 fa-lg cursor-pointer" /> </a>
                <a
                  href="#0"
                  className="flex w-full items-center justify-between px-4 py-2.5 text-[#757575] text-sm font-medium text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Documentación
                  <FontAwesomeIcon icon={faFileLines} className="text-slate-800 dark:text-slate-50 fa-lg" /> </a>

              </div>
              <div>
                <button className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-dark hover:bg-gray-50 dark:text-[#ff6f00] dark:bg-[#292929] dark:hover:bg-white/5 border-none" onClick={() => signOut(auth)}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
