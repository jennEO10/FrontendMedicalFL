import { FC, useEffect, useState } from 'react';
import { CrearEditarIteracionProps } from '../../models/iteracion';
import { User } from '../../models/user';
import ConfirmarIteracionModal from './ConfirmarEditarIteacion';
import ModalError from './ErrorGeneral';

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
  ultimaIteracion
}) => {
  const [idIteracion, setIdIteracion] = useState<number | void>(0);
  const [camposValidos, setCamposValidos] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeCamposInvalidos, setMensajeCamposInvalidos] = useState('');

  const validarCampos = () => {
    const { minUsuarios, rondas, tiempoLocal, userIds } = iteracion;
    const esValido =
      minUsuarios > 0 &&
      rondas > 0 &&
      tiempoLocal > 0 &&
      userIds &&
      Array.isArray(userIds) &&
      userIds.length >= 2;

    setCamposValidos(esValido);
  };

  useEffect(() => {
    validarCampos();

    const errores = [];

    if (!iteracion.minUsuarios || iteracion.minUsuarios <= 0) {
      errores.push('Mínimo de usuarios debe ser mayor a 0');
    }
    if (!iteracion.rondas || iteracion.rondas <= 0) {
      errores.push('Debe haber al menos 1 ronda');
    }
    if (!iteracion.tiempoLocal || iteracion.tiempoLocal <= 0) {
      errores.push('Tiempo local debe ser mayor a 0');
    }
    if (!iteracion.userIds || iteracion.userIds.length < 2) {
      errores.push('Se requieren al menos 2 usuarios participantes');
    }

    setMensajeCamposInvalidos(errores.join('. ') + '.');
  }, [iteracion]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    console.log("Iteracion desde el modal crear: ", iteracion)

    if (!iteracion.startDate) {
      const fecha = getLocalDateTime();
      setIteracion((prev: any) => ({ ...prev, startDate: fecha }));
      setIteracion((prev: any) => ({ ...prev, iterationNumber: ultimaIteracion }));
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
    const { minUsuarios, rondas, tiempoLocal, userIds } = iteracion;

    if (!minUsuarios || minUsuarios <= 0) {
      setMensajeError('El mínimo de usuarios debe ser mayor que 0.');
      setShowErrorModal(true);
      return;
    }

    if (!rondas || rondas <= 0) {
      setMensajeError('Las rondas deben ser mayores que 0.');
      setShowErrorModal(true);
      return;
    }

    if (!tiempoLocal || tiempoLocal <= 0) {
      setMensajeError('El tiempo local debe ser mayor que 0.');
      setShowErrorModal(true);
      return;
    }

    if (!userIds || userIds.length < 2) {
      setMensajeError('Se requieren al menos 2 usuarios participantes.');
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
          {isEditMode ? 'Editar Iteración' : 'Crear Iteración'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la Iteración</label>
            <input name="iterationName" value={iteracion.iterationName} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Número de la Iteración</label>
            <input disabled={true} name="iterationNumber" value={iteracion.iterationNumber} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed" />
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
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Iteraciones Locales</label>
            <input type="number" name="tiempoLocal" value={iteracion.tiempoLocal || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Modo de Entrenamiento</label>
            <select
              name="trainingMode"
              value={iteracion.trainingMode || ''}
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
          <button
            onClick={preGrabado}
            disabled={!camposValidos}
            title={!camposValidos ? mensajeCamposInvalidos : ''}
            className={`px-5 py-2 rounded-md text-white
              ${camposValidos
                ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                : 'bg-indigo-400 cursor-not-allowed'}
            `}
          >
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
