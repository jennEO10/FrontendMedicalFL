// 🔧 1. Agrega este componente modal de error
import { FC } from 'react';

interface ModalErrorProps {
  mensaje: string;
  onClose: () => void;
}

const ModalError: FC<ModalErrorProps> = ({ mensaje, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000001] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Error de Validación</h2>
        <p className="text-gray-800 dark:text-gray-200 mb-6">{mensaje}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalError;
