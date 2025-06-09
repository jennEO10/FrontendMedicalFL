import { FC } from "react";
import { ModalRolProps } from "../../models/rules";

const CrearEditarRol: FC<ModalRolProps> = ({
  open,
  onClose,
  onSubmit,
  rol,
  setRol,
  modoEdicion = false,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
            className="absolute inset-0"
            onClick={onClose}
        ></div>

        <div className="relative z-10 w-[90%] max-w-md bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl text-gray-800 dark:text-white animate-fade-in">
            <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 text-xl"
            >
            &times;
            </button>

            <h2 className="text-xl font-bold mb-4">
            {modoEdicion ? "Editar Rol" : "Crear Rol"}
            </h2>

            <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Nombre del Rol</label>
            <input
                type="text"
                value={rol.name}
                onChange={(e) => setRol({ ...rol, name: e.target.value })}
                placeholder="Ej. Administrador"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            />
            </div>

            <div className="flex justify-between gap-4 mt-6">
            <button
                onClick={onClose}
                className="flex-1 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-400 dark:hover:bg-gray-600"
            >
                Cancelar
            </button>
            <button
                onClick={onSubmit}
                className="flex-1 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
                {modoEdicion ? "Guardar Cambios" : "Crear"}
            </button>
            </div>
        </div>
        </div>
    );
};

export default CrearEditarRol;
