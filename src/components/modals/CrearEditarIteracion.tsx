import { FC, useEffect, useState } from 'react';
import { CrearEditarIteracionProps } from '../../models/iteracion';
import { User } from '../../models/user';
import ConfirmarIteracionModal from './ConfirmarEditarIteacion';

const CrearEditarIteracion: FC<CrearEditarIteracionProps> = ({
  open,
  onClose,
  iteracion,
  setIteracion,
  isEditMode,
  onSubmit,
  usuarios,
  openConfirmacion,
  setOpenConfirmacion
}) => {
  const [idIteracion, setIdIteracion] = useState<number | void>(0);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    if (!iteracion.startDate) {
      const fecha = getLocalDateTime();
      setIteracion((prev: any) => ({ ...prev, startDate: fecha }));
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  const getLocalDateTime = (): string => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIteracion({ ...iteracion, [name]: value });
  };

  const handleSelectUsuarios = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
    setIteracion({ ...iteracion, userIds: selectedOptions });
  };

  const preGrabado = async () => {
    const fecha = getLocalDateTime();
    setIteracion({ ...iteracion, startDate: fecha });

    const id= await onSubmit()

    setIdIteracion(id);
    setOpenConfirmacion(true)
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative z-10 w-[95%] max-w-3xl bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl animate-fade-in transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-xl text-gray-500 dark:text-gray-300 hover:text-red-500"
        >
          &times;
        </button>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isEditMode ? 'Editar Iteración' : 'Crear Iteración'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la Iteración</label>
            <input name="iterationName" value={iteracion.iterationName} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Número de la Iteración</label>
            <input name="iterationNumber" value={iteracion.iterationNumber} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Inicio de la Iteración</label>
            <input type="datetime-local" name="startDate" value={iteracion.startDate} disabled className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
            <input value="Procesando" disabled className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed" />
          </div>

          {/* Inputs nuevos */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Mínimo de Usuarios</label>
            <input type="number" name="minUsuarios" value={iteracion.minUsuarios || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Rondas</label>
            <input type="number" name="rondas" value={iteracion.rondas || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Tiempo Local</label>
            <input type="number" name="tiempoLocal" value={iteracion.tiempoLocal || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>

          {/* Usuarios */}
          <div className="col-span-full">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Usuarios Participantes</label>
            <select multiple value={iteracion.userIds?.map(String) || []} onChange={handleSelectUsuarios} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
              {usuarios.map((user: User) => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="px-5 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600">
            Cancelar
          </button>
          <button onClick={preGrabado} className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            {isEditMode ? 'Editar' : 'Iniciar'}
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
    </div>
  );
};

export default CrearEditarIteracion;
