import { FC } from "react";
import { EliminarOrganizacionModalProps } from "../../models/organization";

const EliminarOrganizacion: FC<EliminarOrganizacionModalProps> = ({
  open,
  nombre,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Contenedor del modal */}
      <div
        className="relative z-10 w-[90%] max-w-sm bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-gray-800 dark:text-white animate-fade-in text-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-gray-400 dark:text-gray-300 hover:text-red-500"
        >
          &times;
        </button>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          ¿Estás seguro de eliminar la organización?
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-base">
          Esta acción eliminará permanentemente a{" "}
          <span className="font-semibold text-red-600 dark:text-red-400">
            {nombre}
          </span>
          .
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarOrganizacion;
