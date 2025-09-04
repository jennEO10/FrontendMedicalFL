import { FC, useState, useEffect } from "react";
import { User } from "../../models/user";

interface CambiarContraseñaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newPassword: string) => void;
  usuario: User;
}

const CambiarContraseña: FC<CambiarContraseñaProps> = ({
  open,
  onClose,
  onSubmit,
  usuario,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  // Función para validar un campo específico
  const validateField = (field: string, value: string) => {
    switch (field) {
      case "newPassword":
        if (!value || value.trim() === "")
          return "La nueva contraseña es obligatoria";
        if (value.length < 6)
          return "La contraseña debe tener al menos 6 caracteres";
        return "";
      case "confirmPassword":
        if (!value || value.trim() === "")
          return "Debe confirmar la contraseña";
        if (value !== newPassword) return "Las contraseñas no coinciden";
        return "";
      default:
        return "";
    }
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    const hasNewPassword =
      newPassword && newPassword.trim() !== "" && newPassword.length >= 6;
    const hasConfirmPassword =
      confirmPassword &&
      confirmPassword.trim() !== "" &&
      confirmPassword === newPassword;
    return hasNewPassword && hasConfirmPassword;
  };

  // Manejar cambios en los campos
  const handleFieldChange = (field: string, value: string) => {
    if (field === "newPassword") {
      setNewPassword(value);
    } else if (field === "confirmPassword") {
      setConfirmPassword(value);
    }

    // Validar el campo específico
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Manejar blur (cuando el usuario sale del campo)
  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === "newPassword" ? newPassword : confirmPassword;
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setNewPassword("");
      setConfirmPassword("");
      setErrors({
        newPassword: "",
        confirmPassword: "",
      });
      setTouched({
        newPassword: false,
        confirmPassword: false,
      });
    }
  }, [open]);

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit(newPassword);
    }
  };

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

        <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>

        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Usuario:</strong> {usuario.username}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Email:</strong> {usuario.mail}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nueva Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.newPassword && errors.newPassword
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
              value={newPassword}
              onChange={(e) => handleFieldChange("newPassword", e.target.value)}
              onBlur={() => handleFieldBlur("newPassword")}
              placeholder="Ingrese la nueva contraseña"
            />
            {touched.newPassword && errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Confirmar Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.confirmPassword && errors.confirmPassword
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
              value={confirmPassword}
              onChange={(e) =>
                handleFieldChange("confirmPassword", e.target.value)
              }
              onBlur={() => handleFieldBlur("confirmPassword")}
              placeholder="Confirme la nueva contraseña"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`flex-1 py-2 rounded-md text-white font-semibold ${
              isFormValid()
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Cambiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CambiarContraseña;
