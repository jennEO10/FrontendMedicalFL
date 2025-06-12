import { FC, useEffect } from 'react';
import { CrearEditarIteracionProps } from '../../models/iteracion';

const CrearEditarIteracion: FC<CrearEditarIteracionProps> = ({
  open,
  onClose,
  iteracion,
  setIteracion,
  isEditMode,
  onSubmit,
}) => {

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIteracion({ ...iteracion, [name]: name === 'participantsQuantity' ? Number(value) : value });
  };

  const handleUserIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIteracion({ ...iteracion, userIds: value.split(',').map(id => Number(id.trim())) });
  };

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
            <input type="datetime-local" name="startDate" value={iteracion.startDate} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Fin de la Iteración</label>
            <input type="datetime-local" name="finishDate" value={iteracion.finishDate} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Duración</label>
            <input name="duration" value={iteracion.duration} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Métricas</label>
            <input name="metrics" value={iteracion.metrics} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
            <select name="state" value={iteracion.state} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="Procesando">Procesando</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad de Participantes</label>
            <input type="number" name="participantsQuantity" value={iteracion.participantsQuantity} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div className="col-span-full">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Usuarios (IDs separados por coma)</label>
            <input name="userIds" value={iteracion.userIds.join(',')} onChange={handleUserIdsChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="px-5 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600">
            Cancelar
          </button>
          <button onClick={onSubmit} className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearEditarIteracion;
