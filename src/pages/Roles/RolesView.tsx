import { FaEdit, FaTrash, FaLock } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Rule } from "../../models/rules";
import rulesService from "../../services/rulesService";
import RolModal from "../../components/modals/RolModal";
import { useNavigate } from "react-router-dom";
import { Alerta } from "../../models/aletas";
import { getLocalDateTime } from "../../utils/dateUtils";
import alertaService from "../../services/alertaService";
import { alertaEmitter } from "../../utils/alertaEvents";

export default function RolesView() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Rule[]>([]);
  const [todosLosRoles, setTodosLosRoles] = useState<Rule[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [rol, setRol] = useState<Rule>({ id: 0, name: "", permissions: [] });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);

  const fetchRoles = async () => {
    try {
      const response = await rulesService.getAllRules();

      const rolesPermissions = await Promise.all(
        response.map(async (rol) => {
          const permisos = await rulesService.getPermissions(rol.id);
          return {
            ...rol,
            permissions: permisos || [], // si viene undefined, que no reviente
          };
        })
      );

      setRoles(rolesPermissions);
      setTodosLosRoles(rolesPermissions);
      console.log("Roles y Permisos cargados:", rolesPermissions);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const reiniciarFormulario = () => {
    setRol({ id: 0, name: "", permissions: [] });
    setMostrarModal(false);
    setModoEdicion(false);
    setMostrarModalDelete(false);
  };

  // Función helper para obtener información completa del rol
  const obtenerRolCompleto = async (rol: Rule) => {
    const permisos = await rulesService.getPermissions(rol.id);
    return {
      ...rol,
      permissions: permisos || [],
    };
  };

  const crearRol = async () => {
    try {
      console.log("Rol a crear:", rol);
      const response = (await rulesService.newRule(rol)) as any;

      // Obtener información completa del rol
      const rolCompleto = await obtenerRolCompleto(response.data);

      // Agregar al estado local y ordenar por ID
      const nuevosRoles = [...todosLosRoles, rolCompleto].sort(
        (a, b) => a.id - b.id
      );
      setRoles(nuevosRoles);
      setTodosLosRoles(nuevosRoles);

      const alerta: Alerta = {
        id: 0,
        tipo: "🛡️",
        mensaje: `Rol creado: ID<${response.data.id}> - "${
          rol.name
        }" por ${sessionStorage.getItem("userEmail")}`,
        timestamp: getLocalDateTime(),
      };
      const alertaResponse = await alertaService.nuevaAlerta(alerta);
      console.log("Alerta registrada:", alertaResponse);
      // 🟠 Emitir evento para notificaciones en tiempo real
      alertaEmitter.emit("alertaCreada");

      reiniciarFormulario();
      console.log("Rol creado:", response);
    } catch (error) {
      console.error("Error al crear rol:", error);
    }
  };

  const clickEditar = (rol: Rule) => {
    console.log("Editar rol:", rol);
    setRol(rol);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  const editarRol = async () => {
    try {
      console.log("Rol a editar:", rol);
      const response = await rulesService.updRule(rol.id, rol);

      // Obtener información completa del rol
      const rolCompleto = await obtenerRolCompleto(response.data as Rule);

      // Actualizar el rol en el estado local
      const rolesActualizados = todosLosRoles.map((r) =>
        r.id === rol.id ? rolCompleto : r
      );
      setRoles(rolesActualizados);
      setTodosLosRoles(rolesActualizados);

      const alerta: Alerta = {
        id: 0,
        tipo: "✏️",
        mensaje: `Rol editado: ID<${rol.id}> - "${
          rol.name
        }" por ${sessionStorage.getItem("userEmail")}`,
        timestamp: getLocalDateTime(),
      };
      const alertaResponse = await alertaService.nuevaAlerta(alerta);
      console.log("Alerta registrada:", alertaResponse);
      // 🟠 Emitir evento para notificaciones en tiempo real
      alertaEmitter.emit("alertaCreada");

      reiniciarFormulario();
      console.log("Rol editado:", response);
    } catch (error) {
      console.error("Error al editar rol:", error);
    }
  };

  const clickEliminar = (rol: Rule) => {
    console.log("Eliminar rol:", rol);
    setRol(rol);
    setMostrarModalDelete(true);
  };

  const eliminarRol = async () => {
    try {
      console.log("Rol a eliminar:", rol);
      const response = await rulesService.delRule(rol.id);

      // Remover el rol del estado local
      const rolesFiltrados = todosLosRoles.filter((r) => r.id !== rol.id);
      setRoles(rolesFiltrados);
      setTodosLosRoles(rolesFiltrados);

      const alerta: Alerta = {
        id: 0,
        tipo: "🗑️",
        mensaje: `Rol eliminado: ID<${rol.id}> - "${
          rol.name
        }" por ${sessionStorage.getItem("userEmail")}`,
        timestamp: getLocalDateTime(),
      };
      const alertaResponse = await alertaService.nuevaAlerta(alerta);
      console.log("Alerta registrada:", alertaResponse);
      // 🟠 Emitir evento para notificaciones en tiempo real
      alertaEmitter.emit("alertaCreada");

      reiniciarFormulario();
      console.log("Rol eliminado:", response);
    } catch (error: any) {
      console.error("Error al eliminar rol:", error);
      alert("Error: " + error.message);
    }
  };

  const irAVistaPermisos = (rol: Rule) => {
    navigate(`/roles/permisos/${rol.id}`, { state: { rol } });
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-2">Gestión de Roles</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Administra los roles y permisos de acceso
      </p>

      <button
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2 rounded-md shadow mb-4"
        onClick={() => setMostrarModal(true)}
      >
        Crear Rol
      </button>

      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full text-sm text-left bg-white dark:bg-gray-900">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3">Nombre del Rol</th>
              <th className="px-4 py-3">Permisos</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((rol) => (
              <tr
                key={rol.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 whitespace-nowrap">{rol.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {rol.permissions && rol.permissions.length > 0 ? (
                    <button
                      className="flex items-center gap-2 text-green-600 hover:text-green-800 font-semibold"
                      onClick={() => irAVistaPermisos(rol)}
                    >
                      <FaLock /> Ver permisos ({rol.permissions.length})
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-2 text-gray-400"
                      onClick={() => irAVistaPermisos(rol)}
                    >
                      <FaLock /> Sin permisos
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap flex gap-2">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full"
                    onClick={() => clickEditar(rol)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                    onClick={() => clickEliminar(rol)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RolModal.CrearEditarRol
        open={mostrarModal}
        onClose={reiniciarFormulario}
        onSubmit={modoEdicion ? editarRol : crearRol}
        rol={rol}
        setRol={setRol}
        modoEdicion={modoEdicion}
      />

      <RolModal.ModalEliminarRol
        open={mostrarModalDelete}
        onClose={reiniciarFormulario}
        onConfirm={eliminarRol}
        nombreRol={rol.name}
      />
    </div>
  );
}
