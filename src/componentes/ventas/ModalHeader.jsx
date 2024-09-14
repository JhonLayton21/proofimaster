const ModalHeader = ({ title, onClose }) => (
    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t dark:bg-[#242424] bg-[#eeeeee]">
        <h3 className="text-3xl font-semibold text-[#f97316]">{title}</h3>
        <button
            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
        >
            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
            </span>
        </button>
    </div>
);

export default ModalHeader;
