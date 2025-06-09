import { FC, useEffect } from "react";
import { OrganizacionModalProps } from "../../models/organization";

const CrearEditarOrganizacion: FC<OrganizacionModalProps> = ({
  open,
  onClose,
  org,
  setNueva,
  onSubmit,
  modoEdicion
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo opaco desenfocado */}
      {/* <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div> */}

      {/* Modal */}
      <div className="relative z-10 w-[90%] max-w-md bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl animate-fade-in transition-all">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-gray-500 dark:text-gray-300 hover:text-red-500"
        >
          &times;
        </button>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {modoEdicion? "Editando Organización":"Nueva Organización"}
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={org.name}
            onChange={(e) => setNueva({ ...org, name: e.target.value })}
            className="w-full border px-4 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={org.descripcion}
            onChange={(e) =>
              setNueva({ ...org, descripcion: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
          <input
            type="text"
            placeholder="Contacto"
            value={org.contacto}
            onChange={(e) => setNueva({ ...org, contacto: e.target.value })}
            className="w-full border px-4 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearEditarOrganizacion;