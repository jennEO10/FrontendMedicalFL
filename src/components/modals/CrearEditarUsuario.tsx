import { FC, useState, useEffect } from "react";
import { ModalUsuarioProps } from "../../models/user";

const ModalUsuario: FC<ModalUsuarioProps> = ({
  open,
  onClose,
  onSubmit,
  usuario,
  setUsuario,
  roles,
  organizations,
  modoEdicion = false,
}) => {
  const [errors, setErrors] = useState({
    username: "",
    mail: "",
    password: "",
    organizationId: "",
    rolesId: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    mail: false,
    password: false,
    organizationId: false,
    rolesId: false,
  });

  // Función para validar un campo específico
  const validateField = (field: string, value: any) => {
    switch (field) {
      case "username":
        return !value || value.trim() === "" ? "El nombre es obligatorio" : "";
      case "mail":
        if (!value || value.trim() === "") return "El correo es obligatorio";
        if (!value.includes("@")) return "El correo debe contener @";
        if (!value.includes("."))
          return "El correo debe contener un dominio válido (ejemplo.com)";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Formato de correo inválido. Use: usuario@ejemplo.com"
          : "";
      case "password":
        // En modo edición, la contraseña no es obligatoria
        if (modoEdicion) return "";
        return !value || value.trim() === ""
          ? "La contraseña es obligatoria"
          : "";
      case "organizationId":
        return !value || value === 0 ? "Debe seleccionar una organización" : "";
      case "rolesId":
        return !value || value.length === 0 || value[0] === 0 || isNaN(value[0])
          ? "Debe seleccionar un rol"
          : "";
      default:
        return "";
    }
  };

  // Función para validar todos los campos
  const validateAllFields = () => {
    const newErrors = {
      username: validateField("username", usuario.username),
      mail: validateField("mail", usuario.mail),
      password: validateField("password", usuario.password),
      organizationId: validateField("organizationId", usuario.organizationId),
      rolesId: validateField("rolesId", usuario.rolesId),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    const hasUsername = usuario.username && usuario.username.trim() !== "";
    const hasMail = usuario.mail && usuario.mail.trim() !== "";
    const hasPassword = modoEdicion
      ? true
      : usuario.password && usuario.password.trim() !== "";
    const hasOrganization =
      usuario.organizationId && usuario.organizationId !== 0;
    const hasRole =
      usuario.rolesId &&
      usuario.rolesId.length > 0 &&
      usuario.rolesId[0] !== 0 &&
      !isNaN(usuario.rolesId[0]);

    return hasUsername && hasMail && hasPassword && hasOrganization && hasRole;
  };

  // Manejar cambios en los campos
  const handleFieldChange = (field: string, value: any) => {
    setUsuario({ ...usuario, [field]: value });

    // Validar el campo específico
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Manejar blur (cuando el usuario sale del campo)
  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, usuario[field as keyof typeof usuario]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Limpiar errores cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setErrors({
        username: "",
        mail: "",
        password: "",
        organizationId: "",
        rolesId: "",
      });
      setTouched({
        username: false,
        mail: false,
        password: false,
        organizationId: false,
        rolesId: false,
      });
    }
  }, [open]);

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
          {modoEdicion ? "Editar Usuario" : "Crear Usuario"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.username && errors.username
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
              value={usuario.username}
              onChange={(e) => handleFieldChange("username", e.target.value)}
              onBlur={() => handleFieldBlur("username")}
            />
            {touched.username && errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Correo <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.mail && errors.mail
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
              value={usuario.mail}
              onChange={(e) => handleFieldChange("mail", e.target.value)}
              onBlur={() => handleFieldBlur("mail")}
            />
            {touched.mail && errors.mail && (
              <p className="text-red-500 text-xs mt-1">{errors.mail}</p>
            )}
          </div>

          {!modoEdicion && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className={`w-full px-3 py-2 rounded-md border text-sm ${
                  touched.password && errors.password
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
                }`}
                value={usuario.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                onBlur={() => handleFieldBlur("password")}
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1">
              Organización <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.organizationId && errors.organizationId
                  ? "border-red-500 bg-white dark:bg-gray-800"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              }`}
              value={usuario.organizationId}
              onChange={(e) =>
                handleFieldChange("organizationId", parseInt(e.target.value))
              }
              onBlur={() => handleFieldBlur("organizationId")}
            >
              <option value="">Seleccione</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
            {touched.organizationId && errors.organizationId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.organizationId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.rolesId && errors.rolesId
                  ? "border-red-500 bg-white dark:bg-gray-800"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              }`}
              value={usuario.rolesId[0] ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  handleFieldChange("rolesId", []);
                } else {
                  handleFieldChange("rolesId", [parseInt(value)]);
                }
              }}
              onBlur={() => handleFieldBlur("rolesId")}
            >
              <option value="">Seleccione</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.name}
                </option>
              ))}
            </select>
            {touched.rolesId && errors.rolesId && (
              <p className="text-red-500 text-xs mt-1">{errors.rolesId}</p>
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
            onClick={onSubmit}
            disabled={!isFormValid()}
            className={`flex-1 py-2 rounded-md text-white font-semibold ${
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

export default ModalUsuario;
