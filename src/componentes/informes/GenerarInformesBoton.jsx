const IconComponent = ({ Icon }) => {
    return Icon ? <Icon className="w-6 h-6 text-orange-500" /> : null;
};

const GenerarInformesBoton = ({ titulo, Icon, onClick }) => {
    return (
        <div
            onClick={onClick} 
            className="bg-white dark:bg-[#292929] rounded-lg shadow-lg hover:border hover:border-orange-400 cursor-pointer"
        >
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-sm font-semibold text-[#757575] dark:text-slate-50">{titulo}</h2>
                <IconComponent Icon={Icon} />
            </div>
        </div>
    );
};

export default GenerarInformesBoton;
