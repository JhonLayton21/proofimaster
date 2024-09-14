const ModalActions = ({ onClose }) => (
    <div className="flex justify-between mt-4">
      <button type="submit" className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none">
        Guardar cambios
      </button>
      <button
        className="text-white bg-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none"
        onClick={onClose}
        type="button"
      >
        Cancelar
      </button>
    </div>
  );
  
  export default ModalActions;
  