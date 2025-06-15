import { FC, useEffect, useState } from 'react';
import { CrearEditarIteracionProps } from '../../models/iteracion';
import organizationService from '../../services/organizationService';
import { User } from '../../models/user';

const CrearEditarIteracion: FC<CrearEditarIteracionProps> = ({
  open,
  onClose,
  iteracion,
  setIteracion,
  isEditMode,
  onSubmit,
  organizaciones,
}) => {
  const [usuarios, setUsuarios] = useState<User[]>([]);

  useEffect(() => {
    if (!open) {
      setUsuarios([])
      return
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    
    if (!iteracion.startDate) {
      const fecha = getLocalDateTime();
      setIteracion((prev: any) => ({ ...prev, startDate: fecha }));
    }

    if (iteracion.organizacionId) {
      obtenerUsuariosPorOrganizacion(iteracion.organizacionId);
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

  const obtenerUsuariosPorOrganizacion = async (orgId: number) => {
    try {
      const response = await organizationService.getUsersForOrganization(orgId);
      setUsuarios(response);
    } catch (error) {
      console.error('Error al obtener usuarios por organización', error);
    }
  };

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIteracion({ ...iteracion, [name]: value });
  };

  const handleSelectUsuarios = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
    setIteracion({ ...iteracion, userIds: selectedOptions });
  };

  const handleOrganizacionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = Number(e.target.value);
    setIteracion({ ...iteracion, organizacionId: orgId });
    await obtenerUsuariosPorOrganizacion(orgId);
  };

  const preGrabado = () => {
    const fecha = getLocalDateTime()
    setIteracion({...iteracion, startDate: fecha})
    onSubmit()
  }

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
          <div className="col-span-full">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Organización</label>
            <select value={iteracion.organizacionId || ""} onChange={handleOrganizacionChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">Seleccione una organización</option>
              {organizaciones.map((org: any) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          <div className="col-span-full">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Usuarios Participantes</label>
            <select multiple value={iteracion.userIds.map(String)} onChange={handleSelectUsuarios} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
              {usuarios.map((user: any) => (
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
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearEditarIteracion;
