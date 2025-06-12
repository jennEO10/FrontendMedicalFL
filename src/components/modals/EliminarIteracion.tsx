import { FC, useEffect } from 'react';
import { EliminarIteracionModalProps } from '../../models/iteracion';

const EliminarIteracionModal: FC<EliminarIteracionModalProps> = ({
  open,
  iterationName,
  onClose,
  onConfirm
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000000] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-xl shadow-2xl p-6 animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Confirmar eliminación
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          ¿Estás seguro de que deseas eliminar la iteración{' '}
          <span className="font-semibold text-red-600 dark:text-red-400">
            {iterationName || 'Sin nombre'}
          </span>
          ?
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
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarIteracionModal;
