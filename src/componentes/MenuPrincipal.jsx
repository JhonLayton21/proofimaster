import React, { useState, useEffect } from "react";
import { getAuth } from 'firebase/auth';
import appFirebase from '../credenciales';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faImagePortrait, faAddressBook, faList, faBars, faCar, faCartShopping, faChartSimple, faHouse, faMoneyCheckDollar, faRightFromBracket, faTruckFast, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import MenuCuenta from "./MenuCuenta";
import TablaProductos from "../componentes/productos/TablaProductos";
import TablaClientes from "../componentes/clientes/TablaClientes";
import TablaProveedores from "../componentes/proveedores/TablaProveedores";
import TablaVentas from "./ventas/TablaVentas";
import { Link, useLocation } from "react-router-dom";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import {
    ChevronRightIcon,
    ChevronDownIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { IconButton,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Alert,
    Input,
    Drawer,
    Card, } from "@material-tailwind/react";
import MetodosPago from "./categorias/MetodosPago";

const auth = getAuth(appFirebase);

const MenuPrincipal = ({ correoUsuario, showTablaProductos, showTablaClientes, showTablaProveedores, showTablaVentas, showMetodosPago, titulo, subtitulo, children }) => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserName(user.displayName || user.email); // Usa el nombre del usuario o el correo si el nombre no está disponible
        }
    }, []);

    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);

    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const [open, setOpen] = React.useState(0);
    const [openAlert, setOpenAlert] = React.useState(true);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    return (
        <>

            <Drawer open={isDrawerOpen} onClose={closeDrawer} className="z-10 bg-[#ff6f00] drawer-open overflow-auto">
                <Card
                    color="transparent"
                    shadow={false}
                    className="h-[calc(100vh-2rem)] w-full p-4"
                >
                    {/* HEADER */}
                    <div className="mb-2  block p-4 border-b border-solid">
                        <h1 className="text-left text-slate-100 hover:text-orange-800 md:text-xl lg:text-2xl font-bold whitespace-nowrap overflow-hidden">
                            <Link to="/">PROOFIMASTER</Link>
                        </h1>
                        <h2 className="text-left text-[#242424] font-semibold text-base pt-2">Proofisillas LTDA.</h2>
                        <h3 className="text-left text-[#242424] font-semibold text-base">NIT: 1234567890</h3>
                    </div>

                    {/* MENU */}
                    <div className="flex items-center justify-start flex-grow">
                        <ul className="list-none">
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/')}`}>
                                <FontAwesomeIcon icon={faHouse} className="fa-1x mr-4" />
                                <Link to="/">Dashboard</Link>
                            </li>
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/productos')}`}>
                                <FontAwesomeIcon icon={faCartShopping} className="fa-1x mr-4" />
                                <Link to="/productos">Productos</Link>
                            </li>
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/ventas')}`}>
                                <FontAwesomeIcon icon={faMoneyCheckDollar} className="fa-1x mr-4" />
                                <Link to="/ventas">Ventas</Link>
                            </li>
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/proveedores')}`}>
                                <FontAwesomeIcon icon={faTruckFast} className="fa-1x mr-4" />
                                <Link to="/proveedores">Proveedores</Link>
                            </li>
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/clientes')}`}>
                                <FontAwesomeIcon icon={faAddressBook} className="fa-1x mr-4" />
                                <Link to="/clientes">Clientes</Link>
                            </li>
                            <Accordion
                            open={open === 1}
                            icon={
                                <ChevronDownIcon
                                    strokeWidth={2.5}
                                    className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""
                                        }`}
                                />
                            }
                        >
                            <ListItem className="p-0" selected={open === 1}>
                                <AccordionHeader
                                    onClick={() => handleOpen(1)}
                                    className="border-b-0 p-3 text-slate-100 bg-transparent hover:bg-white hover:text-orange-500"
                                >
                                    <FontAwesomeIcon icon={faList} className="fa-xs mx-2 mr-3" />
                                    <Typography color="blue-gray" className="mr-auto font-normal">
                                    Categorías
                                    </Typography>
                                </AccordionHeader>
                            </ListItem>
                            <AccordionBody className="py-1">
                                <List className="p-0 text-slate-100 ">
                                    <ListItem className="sub-item">
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        <Link to="/metodos-pago">Métodos de pago</Link>
                                    </ListItem>
                                    <ListItem className="sub-item">
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        <Link to="/marca-productos">Marca productos</Link>
                                    </ListItem>
                                    <ListItem className="sub-item">
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        <Link to="/referencia-productos">Referencia productos</Link>
                                    </ListItem>
                                    <ListItem className="sub-item">
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        <Link to="/tipo-clientes">Tipo clientes</Link>
                                    </ListItem>
                                    <ListItem className="sub-item">
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        <Link to="/estados-venta">Estados venta</Link>
                                    </ListItem>
                                    <ListItem className="sub-item">
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        <Link to="/metodo-envio-venta">Metodo envio venta</Link>
                                    </ListItem>
                                </List>
                            </AccordionBody>
                        </Accordion>
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/informes')}`}>
                                <FontAwesomeIcon icon={faChartSimple} className="fa-1x mr-4" />
                                <Link to="/informes">Informes</Link>
                            </li>
                        </ul>
                    </div>


                    {/* FOOTER */}
                    <div className="flex justify-start border-t border-solid mt-auto p-4">
                        <button className="btn-primary font-semibold text-xl text-left" onClick={() => signOut(auth)}>
                            <FontAwesomeIcon icon={faRightFromBracket} className="fa-1x mx-2" />
                            Cerrar sesión
                        </button>
                    </div>
                </Card>
            </Drawer>



            <div className={`dark:bg-[#242424] bg-[#eeeeee] md:p-8 min-w-[320px] w-full min-h-screen overflow-auto transition-all duration-300 ${isDrawerOpen ? 'blurred-background' : ''}`}>
                {/* HEADER */}
                <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-[#292929] p-4 rounded-md space-y-4 md:space-y-0 m-2 md:m-0">
                    <IconButton
                        variant="text"
                        size="lg"
                        onClick={openDrawer}
                        className=" dark:bg-[#242424] hover:border-[#ff6f00] flex justify-center items-center"
                    >
                        {isDrawerOpen ? (
                            <XMarkIcon className="h-8 w-8 stroke-2 text-[#ff6f00]" />
                        ) : (
                            <Bars3Icon className="h-8 w-8 stroke-2 text-[#ff6f00]" />
                        )}
                    </IconButton>

                    <div className="text-[#ff6f00] font-bold text-2xl md:text-3xl text-left">
                        <h3>Bienvenido de nuevo, {userName || "usuario"}</h3>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-end space-x-0 md:space-x-8 space-y-4 md:space-y-0 w-full md:w-auto">
                        <div className="flex items-center space-x-2 cursor-pointer w-full md:w-auto">
                            <FontAwesomeIcon icon={faFileLines} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                            <div className="flex-grow">
                                <p className="text-slate-800 dark:text-slate-50 text-sm font-bold text-left">Documentación</p>
                                <p className="text-sm font-medium text-[#757575] dark:text-[#757575] text-left">Entiende la plataforma</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer w-full md:w-auto">
                            <FontAwesomeIcon icon={faImagePortrait} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                            <div className="flex-grow pr-4">
                                <p className="text-sm text-slate-800 dark:text-slate-50 font-bold text-left">{correoUsuario}</p>
                                <p className="text-sm font-medium text-[#757575] dark:text-[#757575] text-left">Administrador</p>
                            </div>
                        </div>
                        <div className="relative">
                            <MenuCuenta />
                        </div>
                    </div>
                </div>

                <div className="pt-8 md:pt-16">
                    <h1 className="text-left text-slate-800 dark:text-slate-50 font-bold text-xl md:text-2xl px-2 md:px-0">{titulo}</h1>
                    <h2 className="text-left text-[#757575] font-semibold text-lg md:text-xl px-2 md:px-0">{subtitulo}</h2>
                </div>

                {/* CONTENIDO PRINCIPAL  */}
                {children}

                <div className="mt-8">
                    {showTablaProductos && <TablaProductos />}
                    {showTablaClientes && <TablaClientes />}
                    {showTablaProveedores && <TablaProveedores />}
                    {showTablaVentas && <TablaVentas />}
                    {showMetodosPago && <MetodosPago />}
                </div>
            </div>
        </>
    );
}

export default MenuPrincipal;





