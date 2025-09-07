import { FC, useState, useEffect } from "react";
import { ModalRolProps } from "../../models/rules";

const CrearEditarRol: FC<ModalRolProps> = ({
  open,
  onClose,
  onSubmit,
  rol,
  setRol,
  modoEdicion = false,
}) => {
  const [errors, setErrors] = useState({
    name: "",
  });

  const [touched, setTouched] = useState({
    name: false,
  });

  // Función para validar un campo específico
  const validateField = (field: string, value: any) => {
    switch (field) {
      case "name":
        return !value || value.trim() === ""
          ? "El nombre del rol es obligatorio"
          : "";
      default:
        return "";
    }
  };

  // Función para validar todos los campos
  const validateAllFields = () => {
    const newErrors = {
      name: validateField("name", rol.name),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    const hasName = rol.name && rol.name.trim() !== "";
    return hasName;
  };

  // Manejar cambios en los campos
  const handleFieldChange = (field: string, value: any) => {
    setRol({ ...rol, [field]: value });

    // Validar el campo específico
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Manejar blur (cuando el usuario sale del campo)
  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, rol[field as keyof typeof rol]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Limpiar errores cuando se cierra el modal y validar cuando se abre
  useEffect(() => {
    if (!open) {
      setErrors({
        name: "",
      });
      setTouched({
        name: false,
      });
    } else {
      // Cuando se abre el modal, validar el campo si está en modo edición
      if (modoEdicion) {
        const nameError = validateField("name", rol.name);
        setErrors({
          name: nameError,
        });
        setTouched({
          name: true, // Marcar como tocado para mostrar el error
        });
      }
    }
  }, [open, modoEdicion, rol.name]);

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

        <h2 className="text-xl font-bold mb-4">
          {modoEdicion ? "Editar Rol" : "Crear Rol"}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Nombre del Rol <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 rounded-md border text-sm ${
              touched.name && errors.name
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
            }`}
            value={rol.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            onBlur={() => handleFieldBlur("name")}
            placeholder="Ej. Administrador"
          />
          {touched.name && errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (validateAllFields() && onSubmit) {
                onSubmit();
              }
            }}
            disabled={!isFormValid()}
            className={`flex-1 py-2 rounded-md text-white font-semibold ${
              isFormValid()
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {modoEdicion ? "Guardar Cambios" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearEditarRol;
