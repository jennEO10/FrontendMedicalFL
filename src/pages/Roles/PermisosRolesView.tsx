import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { ModuloPermisos, Rule } from '../../models/rules';
import { useLocation } from 'react-router';
import rulesService from '../../services/rulesService';

export default function PermisosView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rol } = location.state as { rol: Rule };

  // Ejemplo de estructura de permisos por módulo
  const [modulos, setModulos] = useState<ModuloPermisos[]>([]);

  useEffect(() => {
        const fetchPermisos = async () => {
            try {
                const permisos = await rulesService.allPermisos()
                const permisosAsociados = await rulesService.getPermissions(rol.id);

                const agrupadoPorModulo: Record<string, any[]> = {};

                permisos.forEach((permiso) => {
                  const permisoConChecked = { ...permiso, checked: false };
                  if (!agrupadoPorModulo[permiso.description]) {
                    agrupadoPorModulo[permiso.description] = [];
                  }
                  agrupadoPorModulo[permiso.description].push(permisoConChecked);
                });
                
                const modulosGenerados = Object.entries(agrupadoPorModulo).map(
                  ([nombre, permisos]) => ({
                    nombre,
                    permisos,
                  })
                );

                console.log("Permisos agrupados: ", modulosGenerados);

                console.log("Se obtiene los permisos del role seleccionado: ", permisosAsociados);

                const modulosActualizados = modulosGenerados.map((modulo) => {
                    const permisosActualizados = modulo.permisos.map((permiso) => {
                        const match = permisosAsociados.find(
                            (p) => p.id === permiso.id
                        );

                        return {
                            ...permiso,
                            checked: !!match,
                        };
                    });

                    return {...modulo, permisos: permisosActualizados};
                });

                console.log("Modulos actualizados: ", modulosActualizados);

                setModulos(modulosActualizados)
            } catch (error) {
                console.error('Error cargando permisos del rol:', error);
            }
        }

        fetchPermisos();
    }, [rol.id]);

  const togglePermiso = (moduloIndex: any, permisoIndex: any) => {
    console.log("Se recibió el objeto de Roles: ", rol)
    const copia = [...modulos];
    copia[moduloIndex].permisos[permisoIndex].checked =
      !copia[moduloIndex].permisos[permisoIndex].checked;
    setModulos(copia);
  };

  const handleGuardar = () => {
    console.log('Permisos seleccionados:', modulos);
    navigate(-1); // Vuelve a vista anterior
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Permisos para el Rol: <span className="text-indigo-600 dark:text-indigo-400">{rol?.name || '...'}</span></h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md"
          >
            <FaArrowLeft /> Volver
          </button>
        </div>

        <div className="space-y-6">
          {modulos.map((modulo, i) => (
            <div key={modulo.nombre}>
              <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-3">{modulo.nombre}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
                {modulo.permisos.map((permiso, j) => (
                  <label key={permiso.name} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-indigo-600"
                      checked={permiso.checked}
                      onChange={() => togglePermiso(i, j)}
                    />
                    <span>{permiso.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-5 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
          >
            <FaSave /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}