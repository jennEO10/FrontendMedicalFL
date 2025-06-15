import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Iteracion } from '../../models/iteracion';
import iteracionService from '../../services/iteracionService';
import CrearEditarIteracionModal from '../../components/modals/CrearEditarIteracion';
import EliminarIteracionModal from '../../components/modals/EliminarIteracion';
import { Organization } from '../../models/organization';
import organizationService from '../../services/organizationService';
import userService from '../../services/usersService';

export default function IteracionesView() {
  const [organizaciones, setOrganizaciones] = useState<Organization[]>([]);
  const [iteraciones, setIteraciones] = useState<Iteracion[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClose, setModalClose] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [iteracion, setIteracion] = useState<Iteracion>({
    id: 0,
    iterationName: '',
    iterationNumber: '',
    startDate: '',
    finishDate: '',
    duration: '',
    metrics: '',
    state: 'Procesando',
    participantsQuantity: '',
    userIds: [],
    organizacionId: 0
  });

  const obtenerOrganizaciones = async () => {
    try {
      const response = await organizationService.fetchAll();
      setOrganizaciones(response);
    } catch (error) {
      console.error('Error al obtener organizaciones', error);
    }
  };

  const obtenerIteraciones = async () => {
    try {
      const listIteraciones = await iteracionService.getAllIteraciones();
      console.log("Lista de iteraciones: ", listIteraciones);

      const iteracionForOrganization = await Promise.all(
        listIteraciones.map(async (iteracion) => {
        if (iteracion.userIds.length === 0) return iteracion;

        try {
          const primerUserId = iteracion.userIds[0];
          const usuario = await userService.getUser(primerUserId);

          return {
            ...iteracion,
            organizacionId: usuario?.organizationId ?? 0
          };
        } catch (error) {
          console.error(`Error obteniendo usuario ${iteracion.userIds[0]}`, error);
          return iteracion;
        }
      })      
      );

      console.log("Iteraciones alteradas: ", iteracionForOrganization)
      setIteraciones(iteracionForOrganization);
    } catch (error) {
      console.error('Error al cargar las iteraciones:', error);
    }
  };

  useEffect(() => {
    obtenerIteraciones();
    obtenerOrganizaciones();
  }, []);

  const reiniciarFormulario = () => {
    setModalOpen(false)
    setModalClose(false)
    setEditMode(false)
    setIteracion({
      id: 0,
      iterationName: '',
      iterationNumber: '',
      startDate: '',
      finishDate: '',
      duration: '',
      metrics: '',
      state: 'Procesando',
      participantsQuantity: '',
      userIds: [],
      organizacionId: 0
    })
  }

  const handleGuardarIteracion = async () => {
    console.log("Recibir datos de la iteración a crear:", iteracion)
    try {
      const response = await iteracionService.addIteracion(iteracion);
      reiniciarFormulario()
      obtenerIteraciones()
      console.log("Iteración guardada:", response)
    } catch (error) {
      console.error('Error al guardar la iteración:', error);
    }
  };

  const clickEditar = (iteracion: Iteracion) => {
    console.log("Se carga la iteración seleccionada: ", iteracion)
    setEditMode(true);
    setIteracion(iteracion);
    setModalOpen(true);
  };

  const editarIteracion = async () => {
    console.log("Recibir datos de la iteración a editar:", iteracion)
    try {
      const response = await iteracionService.updIteracion(iteracion.id, iteracion);
      reiniciarFormulario();
      obtenerIteraciones();
      console.log("Iteración editada:", response)
    } catch (error) {
      console.error('Error al editar la iteración:', error);
    }
  }

  const clickEliminar = (iteracion: Iteracion) => {
    setModalClose(true);
    setIteracion(iteracion);
  }

  const eliminarIteracion = async () => {
    console.log("Iteración a eliminar:", iteracion);

    try {
      const response = await iteracionService.delIteracion(iteracion.id);
      reiniciarFormulario();
      obtenerIteraciones();
      console.log("Iteración eliminada:", response)
    } catch (error: any) {
      console.error('Error al eliminar la iteración:', error);
      alert('Error: ' + error.message);
    }
  }

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-2">Gestión de Iteraciones</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Administra las iteraciones del modelo de aprendizaje federado
      </p>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-3 text-left font-semibold">Iteración</th>
              <th className="px-4 py-3 text-left font-semibold">Estado</th>
              <th className="px-4 py-3 text-left font-semibold">Progreso</th>
              <th className="px-4 py-3 text-left font-semibold">Duración</th>
              <th className="px-4 py-3 text-left font-semibold">Participantes</th>
              <th className="px-4 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {iteraciones.map((iteracion) => (
              <tr key={iteracion.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3">#{iteracion.id}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    iteracion.state === 'Procesando'
                      ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'
                      : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {iteracion.state}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${iteracion.iterationNumber}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{iteracion.iterationNumber}%</span>
                </td>
                <td className="px-4 py-3">{iteracion.duration}</td>
                <td className="px-4 py-3">{iteracion.participantsQuantity}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <button
                    className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700"
                    title="Ver Métricas"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white"
                    title="Editar"
                    onClick={() => clickEditar(iteracion)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                    title="Eliminar"
                    onClick={() => clickEliminar(iteracion)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6 gap-4">
        <button
          className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white"
          onClick={() => setModalOpen(true)}
        >
          Crear Iteración
        </button>
      </div>

      <CrearEditarIteracionModal
        open={modalOpen}
        onClose={reiniciarFormulario}
        isEditMode={editMode}
        iteracion={iteracion}
        setIteracion={setIteracion}
        onSubmit={editMode ? editarIteracion : handleGuardarIteracion}
        organizaciones={organizaciones}
      />

      <EliminarIteracionModal
        open={modalClose}
        iterationName={iteracion.iterationName}
        onClose={reiniciarFormulario}
        onConfirm={eliminarIteracion}
      />
    </div>
  );
}
