import { FC } from "react";
import { EliminarUsuarioModalProps } from "../../models/user";

const EliminarUsuarioModal: FC<EliminarUsuarioModalProps> = ({
  open,
  onClose,
  onConfirm,
  nombreUsuario,
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

        <h2 className="text-lg font-bold mb-4 text-center">
          Confirmar Eliminación
        </h2>

        <p className="text-center mb-6">
          ¿Estás seguro que deseas eliminar al usuario{" "}
          <strong>{nombreUsuario}</strong>?
        </p>

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarUsuarioModal;
