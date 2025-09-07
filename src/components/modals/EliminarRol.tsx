import { FC } from "react";
import { ModalEliminarRolProps } from "../../models/rules";

const ModalEliminarRol: FC<ModalEliminarRolProps> = ({
  open,
  onClose,
  onConfirm,
  nombreRol,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-10 w-[90%] max-w-sm bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-gray-800 dark:text-white animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-gray-400 dark:text-gray-300 hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>

        <p className="mb-6">
          ¿Está seguro que desea eliminar el rol{" "}
          <span className="font-semibold">{nombreRol}</span>?
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarRol;
