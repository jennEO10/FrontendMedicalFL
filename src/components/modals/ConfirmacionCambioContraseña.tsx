import { FC } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface ConfirmacionCambioContraseñaProps {
  open: boolean;
  onClose: () => void;
  usuario: string;
}

const ConfirmacionCambioContraseña: FC<ConfirmacionCambioContraseñaProps> = ({
  open,
  onClose,
  usuario,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-10 w-[90%] max-w-md bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl text-gray-800 dark:text-white animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 text-xl"
        >
          &times;
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <FaCheckCircle className="text-6xl text-green-500" />
          </div>

          <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
            ¡Contraseña Actualizada!
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            La contraseña del usuario <strong>{usuario}</strong> ha sido
            actualizada exitosamente.
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionCambioContraseña;
