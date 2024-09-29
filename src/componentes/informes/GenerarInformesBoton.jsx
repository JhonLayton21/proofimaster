const IconComponent = ({ Icon }) => {
    return Icon ? <Icon className="w-6 h-6 text-orange-500" /> : null;
};

const GenerarInformesBoton = ({ titulo, Icon, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-[#292929] rounded-lg shadow-lg hover:border hover:border-orange-400 cursor-pointer w-72 h-72 flex flex-col justify-center items-center bentoItem"
        >
            <div className="flex flex-col items-center">
                <h2 className="text-4xl font-semibold text-[#757575] dark:text-slate-50 text-center">{titulo}</h2>
                <IconComponent Icon={Icon} className="text-orange-400 mt-4" />
            </div>
        </div>

    );
};

export default GenerarInformesBoton;
