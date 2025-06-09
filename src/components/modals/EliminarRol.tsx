import { FC } from 'react';
import { ModalEliminarRolProps } from '../../models/rules';

const ModalEliminarRol: FC<ModalEliminarRolProps> = ({
  open,
  onClose,
  onConfirm,
  nombreRol,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative z-10 w-[90%] max-w-md p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-xl shadow-xl animate-fade-in">
        <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>

        <p className="mb-6">
          ¿Está seguro que desea eliminar el rol <span className="font-semibold">{nombreRol}</span>?
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
