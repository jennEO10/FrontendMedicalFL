import { FC } from 'react';
import { ConfirmarIteracionModalProps } from '../../models/iteracion';

const ConfirmarIteracionModal: FC<ConfirmarIteracionModalProps> = ({
  isEditMode,
  idIteracion,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-[1000001] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg max-w-sm text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{ isEditMode ? "¡Iteración editada!" : "¡Iteración creada!" }</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          { isEditMode ? "La iteración fue editada con éxito." : "La iteración fue creada con éxito." } ID asignado: <strong>{idIteracion ?? "Desconocido"}</strong>
        </p>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ConfirmarIteracionModal;
