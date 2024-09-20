import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Usuarios = ({ }) => {
    return (
        <div className="bentoItem shadow-lg col-span-6 lg:col-span-4 relative rounded-lg overflow-hidden border p-4 alerta-stock">
            <h2 className="text-lg font-">Usuarios activos</h2>
            <div className="flex flex-col justify-center h-full">
                <div className="flex items-center gap-3 py-3 border-b border-gray-300">
                    <div className="relative aspect-square w-10 rounded-full">
                        <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                        <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-dark"></span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">John Layton</p>
                        <p className="text-sm text-body-color text-[#757575] dark:text-dark-6 hidden md:block">johnlayton@outlook.com</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 py-3 border-b border-gray-300">
                    <div className="relative aspect-square w-10 rounded-full">
                        <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                        <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-dark"></span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">Jane Doe</p>
                        <p className="text-sm text-body-color text-[#757575] hidden md:block">janedoe@gmail.com</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 py-3">
                    <div className="relative aspect-square w-10 rounded-full">
                        <FontAwesomeIcon icon={faCircleUser} className="text-slate-800 dark:text-slate-50 fa-2xl" />
                        <span className="absolute -right-0.5 -top-0.5 block h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-dark"></span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">Michael Smith</p>
                        <p className="text-sm text-body-color text-[#757575] hidden md:block">michaelsmith@yahoo.com</p>
                    </div>
                </div>
            </div>
            <FontAwesomeIcon icon={faArrowRight} className="absolute bottom-2 right-4 text-gray-500 transform transition-transform hover:scale-125 hover:translate-x-2 cursor-pointer hover:text-orange-500" />
        </div>
    );
};

export default Usuarios;