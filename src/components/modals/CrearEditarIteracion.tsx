import { FC, useEffect, useState } from "react";
import { CrearEditarIteracionProps } from "../../models/iteracion";
import { User } from "../../models/user";
import ConfirmarIteracionModal from "./ConfirmarEditarIteacion";
import ModalError from "./ErrorGeneral";

const CrearEditarIteracion: FC<CrearEditarIteracionProps> = ({
  open,
  onClose,
  iteracion,
  setIteracion,
  isEditMode,
  onSubmit,
  usuarios,
  openConfirmacion,
  setOpenConfirmacion,
  ultimaIteracion,
}) => {
  const [idIteracion, setIdIteracion] = useState<number | void>(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  // Estados para validación
  const [errors, setErrors] = useState({
    iterationName: "",
    minUsuarios: "",
    rondas: "",
    tiempoLocal: "",
    userIds: "",
  });

  const [touched, setTouched] = useState({
    iterationName: false,
    minUsuarios: false,
    rondas: false,
    tiempoLocal: false,
    userIds: false,
  });

  // Función para validar un campo específico
  const validateField = (field: string, value: any) => {
    switch (field) {
      case "iterationName":
        return !value || value.trim() === ""
          ? "El nombre de la iteración es obligatorio"
          : "";
      case "minUsuarios":
        return !value || value <= 0
          ? "El mínimo de usuarios debe ser mayor a 0"
          : "";
      case "rondas":
        return !value || value <= 0 ? "Las rondas deben ser mayor a 0" : "";
      case "tiempoLocal":
        return !value || value <= 0
          ? "Las iteraciones locales deben ser mayor a 0"
          : "";
      case "userIds":
        return !value || !Array.isArray(value) || value.length < 2
          ? "Se requieren al menos 2 usuarios participantes"
          : "";
      default:
        return "";
    }
  };

  // Función para validar todos los campos
  const validateAllFields = () => {
    const newErrors = {
      iterationName: validateField("iterationName", iteracion.iterationName),
      minUsuarios: validateField("minUsuarios", iteracion.minUsuarios),
      rondas: validateField("rondas", iteracion.rondas),
      tiempoLocal: validateField("tiempoLocal", iteracion.tiempoLocal),
      userIds: validateField("userIds", iteracion.userIds),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    const hasName =
      iteracion.iterationName && iteracion.iterationName.trim() !== "";
    const hasMinUsers = iteracion.minUsuarios && iteracion.minUsuarios > 0;
    const hasRounds = iteracion.rondas && iteracion.rondas > 0;
    const hasLocalIterations =
      iteracion.tiempoLocal && iteracion.tiempoLocal > 0;
    const hasUsers =
      iteracion.userIds &&
      Array.isArray(iteracion.userIds) &&
      iteracion.userIds.length >= 2;

    return (
      hasName && hasMinUsers && hasRounds && hasLocalIterations && hasUsers
    );
  };

  // Manejar cambios en los campos
  const handleFieldChange = (field: string, value: any) => {
    setIteracion({ ...iteracion, [field]: value });

    // Validar el campo específico
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Manejar blur (cuando el usuario sale del campo)
  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(
      field,
      iteracion[field as keyof typeof iteracion]
    );
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Limpiar errores cuando se cierra el modal y validar cuando se abre
  useEffect(() => {
    if (!open) {
      setErrors({
        iterationName: "",
        minUsuarios: "",
        rondas: "",
        tiempoLocal: "",
        userIds: "",
      });
      setTouched({
        iterationName: false,
        minUsuarios: false,
        rondas: false,
        tiempoLocal: false,
        userIds: false,
      });
    } else {
      // Cuando se abre el modal, validar los campos si está en modo edición
      if (isEditMode) {
        const newErrors = {
          iterationName: validateField(
            "iterationName",
            iteracion.iterationName
          ),
          minUsuarios: validateField("minUsuarios", iteracion.minUsuarios),
          rondas: validateField("rondas", iteracion.rondas),
          tiempoLocal: validateField("tiempoLocal", iteracion.tiempoLocal),
          userIds: validateField("userIds", iteracion.userIds),
        };
        setErrors(newErrors);
        setTouched({
          iterationName: true,
          minUsuarios: true,
          rondas: true,
          tiempoLocal: true,
          userIds: true,
        });
      }
    }
  }, [open, isEditMode, iteracion]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    if (!iteracion.startDate) {
      const fecha = getLocalDateTime();
      setIteracion((prev: any) => ({ ...prev, startDate: fecha }));
      setIteracion((prev: any) => ({
        ...prev,
        iterationNumber: ultimaIteracion,
      }));
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  const getLocalDateTime = (): string => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericValue = ["minUsuarios", "rondas", "tiempoLocal"].includes(name)
      ? Number(value)
      : value;
    handleFieldChange(name, numericValue);
  };

  const handleSelectUsuarios = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    handleFieldChange("userIds", selectedOptions);
  };

  const preGrabado = async () => {
    // Validar todos los campos antes de proceder
    if (!validateAllFields()) {
      setMensajeError(
        "Por favor, complete todos los campos obligatorios correctamente."
      );
      setShowErrorModal(true);
      return;
    }

    // ✅ Si pasa todas las validaciones
    const fecha = getLocalDateTime();
    setIteracion({ ...iteracion, startDate: fecha });

    const id = await onSubmit();
    setIdIteracion(id);
    setOpenConfirmacion(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative z-10 w-full max-w-3xl max-h-[95vh] overflow-y-auto m-4 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl animate-fade-in transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-xl text-gray-500 dark:text-gray-300 hover:text-red-500"
        >
          &times;
        </button>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditMode ? "Editar Iteración" : "Crear Iteración"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre de la Iteración <span className="text-red-500">*</span>
            </label>
            <input
              name="iterationName"
              value={iteracion.iterationName}
              onChange={handleChange}
              onBlur={() => handleFieldBlur("iterationName")}
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.iterationName && errors.iterationName
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
            />
            {touched.iterationName && errors.iterationName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.iterationName}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Número de la Iteración
            </label>
            <input
              disabled={true}
              name="iterationNumber"
              value={iteracion.iterationNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Inicio de la Iteración
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={iteracion.startDate}
              disabled
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Estado
            </label>
            <input
              value="Procesando"
              disabled
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
            />
          </div>

          {/* Inputs nuevos */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Mínimo de Usuarios <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="minUsuarios"
              value={iteracion.minUsuarios || ""}
              onChange={handleChange}
              onBlur={() => handleFieldBlur("minUsuarios")}
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.minUsuarios && errors.minUsuarios
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
            />
            {touched.minUsuarios && errors.minUsuarios && (
              <p className="text-red-500 text-xs mt-1">{errors.minUsuarios}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Rondas <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="rondas"
              value={iteracion.rondas || ""}
              onChange={handleChange}
              onBlur={() => handleFieldBlur("rondas")}
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.rondas && errors.rondas
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
            />
            {touched.rondas && errors.rondas && (
              <p className="text-red-500 text-xs mt-1">{errors.rondas}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Iteraciones Locales <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="tiempoLocal"
              value={iteracion.tiempoLocal || ""}
              onChange={handleChange}
              onBlur={() => handleFieldBlur("tiempoLocal")}
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.tiempoLocal && errors.tiempoLocal
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
            />
            {touched.tiempoLocal && errors.tiempoLocal && (
              <p className="text-red-500 text-xs mt-1">{errors.tiempoLocal}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Modo de Entrenamiento
            </label>
            <select
              name="trainingMode"
              value={iteracion.trainingMode || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Seleccione</option>
              <option value="FRESH">Entrenamiento desde cero</option>
              <option value="RETRAIN">Re-Entrenamiento</option>
            </select>
          </div>
          {/* Usuarios */}
          <div className="col-span-full">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Usuarios Participantes <span className="text-red-500">*</span>
            </label>
            <select
              multiple
              value={iteracion.userIds?.map(String) || []}
              onChange={handleSelectUsuarios}
              onBlur={() => handleFieldBlur("userIds")}
              className={`w-full px-3 py-2 rounded-md border text-sm ${
                touched.userIds && errors.userIds
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {usuarios.map((user: User) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            {touched.userIds && errors.userIds && (
              <p className="text-red-500 text-xs mt-1">{errors.userIds}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Seleccione al menos 2 usuarios (mantenga presionado Ctrl/Cmd para
              selección múltiple)
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (validateAllFields()) {
                preGrabado();
              }
            }}
            disabled={!isFormValid()}
            className={`px-5 py-2 rounded-md text-white font-semibold ${
              isFormValid()
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isEditMode ? "Editar" : "Iniciar"}
          </button>
        </div>
      </div>

      {open && openConfirmacion && (
        <ConfirmarIteracionModal
          isEditMode={isEditMode}
          idIteracion={idIteracion}
          onClose={onClose}
        />
      )}

      {showErrorModal && (
        <ModalError
          mensaje={mensajeError}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default CrearEditarIteracion;
