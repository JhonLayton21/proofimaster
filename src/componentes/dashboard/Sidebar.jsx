import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faList, faCartShopping, faChartSimple, faHouse, faMoneyCheckDollar, faRightFromBracket, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Accordion, AccordionHeader, AccordionBody, List, ListItem, ListItemPrefix, Drawer, Card, Typography } from "@material-tailwind/react";
import { getAuth } from 'firebase/auth';
import appFirebase from '../../credenciales';
import { supabase } from '../../../supabase';

const Sidebar = ({ isDrawerOpen, closeDrawer, open, handleOpen, isActive }) => {
    const auth = getAuth(appFirebase);
    const navigate = useNavigate();

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log(error);
        }
        navigate("/login");
    };

    return (
        <Drawer open={isDrawerOpen} onClose={closeDrawer} className="z-10 bg-[#ff6f00] drawer-open overflow-auto rounded-xl">
            <Card
                color="transparent"
                shadow={false}
                className="h-[calc(100vh-2rem)] w-full p-4"
            >
                {/* HEADER */}
                <div className="mb-2 block p-4 border-b border-solid">
                    <h1 className="text-left text-slate-100 hover:text-orange-800 md:text-xl lg:text-2xl font-bold whitespace-nowrap overflow-hidden">
                        <Link to="/">PROOFIMASTER</Link>
                    </h1>
                    <h2 className="text-left text-[#242424] font-semibold text-base pt-2">Proofisillas LTDA.</h2>
                    <h3 className="text-left text-[#242424] font-semibold text-base">NIT: 900.255.452-5</h3>
                </div>

                {/* MENU */}
                <div className="flex items-center justify-start flex-grow">
                    <ul className="list-none">
                        <Link to="/">
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/')}`}>
                                <FontAwesomeIcon icon={faHouse} className="fa-1x mr-4" />
                                Dashboard
                            </li>
                        </Link>
                        <Link to="/productos">
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/productos')}`}>
                                <FontAwesomeIcon icon={faCartShopping} className="fa-1x mr-4" />
                                Productos
                            </li>
                        </Link>
                        <Link to="/ventas">
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/ventas')}`}>
                                <FontAwesomeIcon icon={faMoneyCheckDollar} className="fa-1x mr-4" />
                                Ventas
                            </li>
                        </Link>
                        <Link to="/proveedores">
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/proveedores')}`}>
                                <FontAwesomeIcon icon={faTruckFast} className="fa-1x mr-4" />
                                Proveedores
                            </li>
                        </Link>
                        <Link to="/clientes">
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/clientes')}`}>
                                <FontAwesomeIcon icon={faAddressBook} className="fa-1x mr-4" />
                                Clientes
                            </li>
                        </Link>
                        <Accordion
                            open={open === 1}
                            icon={
                                <ChevronDownIcon
                                    strokeWidth={2.5}
                                    className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
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
                                <List className="p-0 text-slate-100">
                                    <Link to="/metodos-pago">
                                        <ListItem className="sub-item">
                                            <ListItemPrefix>
                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                            </ListItemPrefix>
                                            Métodos de pago
                                        </ListItem>
                                    </Link>
                                    <Link to="/marca-productos">
                                        <ListItem className="sub-item">
                                            <ListItemPrefix>
                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                            </ListItemPrefix>
                                            Marca productos
                                        </ListItem>
                                    </Link>
                                    <Link to="/referencia-productos">
                                        <ListItem className="sub-item">
                                            <ListItemPrefix>
                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                            </ListItemPrefix>
                                            Referencia productos
                                        </ListItem>
                                    </Link>
                                    <Link to="/tipo-clientes">
                                        <ListItem className="sub-item">
                                            <ListItemPrefix>
                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                            </ListItemPrefix>
                                            Tipo clientes
                                        </ListItem>
                                    </Link>
                                    <Link to="/estados-venta">
                                        <ListItem className="sub-item">
                                            <ListItemPrefix>
                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                            </ListItemPrefix>
                                            Estados venta
                                        </ListItem>
                                    </Link>
                                    <Link to="/metodo-envio-venta">
                                        <ListItem className="sub-item">
                                            <ListItemPrefix>
                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                            </ListItemPrefix>
                                            Metodo envio venta
                                        </ListItem>
                                    </Link>
                                </List>
                            </AccordionBody>
                        </Accordion>
                        <Link to="/informes">
                            <li className={`menu-item text-left font-normal text-2xl ${isActive('/informes')}`}>
                                <FontAwesomeIcon icon={faChartSimple} className="fa-1x mr-4" />
                                Informes
                            </li>
                        </Link>
                    </ul>
                </div>

                {/* FOOTER */}
                <div className="flex justify-start border-t border-solid mt-auto p-4">
                    <button className="btn-primary font-semibold text-xl text-left" onClick={logout}>
                        <FontAwesomeIcon icon={faRightFromBracket} className="fa-1x mx-2" />
                        Cerrar sesión
                    </button>
                </div>
            </Card>
        </Drawer>
    );
};

export default Sidebar;
