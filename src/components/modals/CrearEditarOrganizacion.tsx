import { FC, useEffect, useState } from "react";
import { OrganizacionModalProps } from "../../models/organization";

const CrearEditarOrganizacion: FC<OrganizacionModalProps> = ({
  open,
  onClose,
  org,
  setNueva,
  onSubmit,
  modoEdicion,
}) => {
  const [errors, setErrors] = useState({
    name: "",
    descripcion: "",
    contacto: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    descripcion: false,
    contacto: false,
  });
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Función para validar un campo específico
  const validateField = (field: string, value: any) => {
    switch (field) {
      case "name":
        return !value || value.trim() === "" ? "El nombre es obligatorio" : "";
      case "descripcion":
        return !value || value.trim() === ""
          ? "La descripción es obligatoria"
          : "";
      case "contacto":
        return !value || value.trim() === ""
          ? "El contacto es obligatorio"
          : "";
      default:
        return "";
    }
  };

  // Función para validar todos los campos
  const validateAllFields = () => {
    const newErrors = {
      name: validateField("name", org.name),
      descripcion: validateField("descripcion", org.descripcion),
      contacto: validateField("contacto", org.contacto),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    const hasName = org.name && org.name.trim() !== "";
    const hasDescripcion = org.descripcion && org.descripcion.trim() !== "";
    const hasContacto = org.contacto && org.contacto.trim() !== "";

    return hasName && hasDescripcion && hasContacto;
  };

  // Manejar cambios en los campos
  const handleFieldChange = (field: string, value: any) => {
    setNueva({ ...org, [field]: value });

    // Validar el campo específico
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Manejar blur (cuando el usuario sale del campo)
  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, org[field as keyof typeof org]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Limpiar errores cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setErrors({
        name: "",
        descripcion: "",
        contacto: "",
      });
      setTouched({
        name: false,
        descripcion: false,
        contacto: false,
      });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
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

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {modoEdicion ? "Editando Organización" : "Nueva Organización"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.name && errors.name
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
              value={org.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              onBlur={() => handleFieldBlur("name")}
            />
            {touched.name && errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.descripcion && errors.descripcion
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
              value={org.descripcion}
              onChange={(e) => handleFieldChange("descripcion", e.target.value)}
              onBlur={() => handleFieldBlur("descripcion")}
            />
            {touched.descripcion && errors.descripcion && (
              <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Contacto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.contacto && errors.contacto
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
              value={org.contacto}
              onChange={(e) => handleFieldChange("contacto", e.target.value)}
              onBlur={() => handleFieldBlur("contacto")}
            />
            {touched.contacto && errors.contacto && (
              <p className="text-red-500 text-xs mt-1">{errors.contacto}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
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
            className={`px-4 py-2 rounded-md text-white ${
              isFormValid()
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {modoEdicion ? "Editar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearEditarOrganizacion;
