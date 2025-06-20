import { useState, useEffect } from 'react';
import { FaEdit, FaSearch, FaTimes, FaUserPlus } from 'react-icons/fa';
import { User } from '../../models/user';
import usersService from '../../services/usersService';
import UsuarioModal from '../../components/modals/UsuarioModal';
import rulesService from '../../services/rulesService';
import { Rule } from '../../models/rules';
import organizationService from '../../services/organizationService';
import { Organization } from '../../models/organization';
import FiltroDinamico from '../../components/filtros/UsuariosFiltro';

export default function UsuariosView() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [organizaciones, setOrganizaciones] = useState<Organization[]>([]);
  const [usuario, setUsuario] = useState({ id: 0, username: '', password: '', enabled: true, mail: '', organizationId: 0, rolesId: [0]});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
  const [mostrarModalAddUpd, setMostrarModalAddUpd] = useState(false);
  const [filtroElegido, setSetFiltroElegido] = useState<string>(''); // Para manejar el filtro seleccionado
  const [filtros, setFiltros] = useState({
    nombre: '',
    email: '',
    rolName: '',
    estado: 0,
    rol: 0
  });

  const fetchUsuarios = async () => {
    try {
      const response = await usersService.getAllUsers();
      const usuarioFormateado = await Promise.all(
      response.map(async (usuario) => {
        try {
          const [org, rol] = await Promise.all([
            organizationService.getOrganization(usuario.organizationId),
            usuario.rolesId?.[0] !== undefined
              ? rulesService.obtenerRole(usuario.rolesId[0])
              : Promise.resolve(undefined)
          ]);

          return {
            ...usuario,
            nameOrganization: org?.name || "Organización no encontrada",
            roleName: rol?.name || "Rol no encontrado",
          };
        } catch (error) {
          console.warn(`Error al obtener organización para ID ${usuario.organizationId}:`, error);
          return usuario
        }
      })).then((usuarios) =>
        usuarios.sort((a, b) => a.id - b.id)
      );

      const organizaciones = await organizationService.fetchAll(); // Asumiendo que tienes un método para obtener organizaciones
      const rules = await rulesService.getAllRules();
      setUsuarios(usuarioFormateado);
      setOrganizaciones(organizaciones);
      setRules(rules);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  useEffect(() => {
      fetchUsuarios();
  }, []);

  const reiniciarFormulario = () => {
    setUsuario({ id: 0, username: '', password: '', enabled: true, mail: '', organizationId: 0, rolesId: [0] });
    setMostrarModalAddUpd(false);
    setModoEdicion(false);
    setMostrarModalDelete(false);
  }

  // const handleInputChange = (e: any) => {
  //   const { name, value } = e.target;
  //   setFiltros({ ...filtros, [name]: value });
  // };

  const guardarUsuario = async () => {
    try {
      console.log("Guardando usuario:", usuario);
      const response = await usersService.newUser(usuario);
      reiniciarFormulario();
      fetchUsuarios();
      console.log("Usuario guardado:", response);
    } catch (error) {
      console.error("Error al guardar organización:", error);
    }
  }

  const clickEditar = (usuario: User) => {
    console.log("Obtener datos para editar:", usuario); 
    setUsuario(usuario);
    setModoEdicion(true);
    setMostrarModalAddUpd(true);
  }

  const editarUsuario = async () => {
    try {
      console.log("Editando datos del usuario:", usuario);
      const response = await usersService.updateUser(usuario.id, usuario);
      reiniciarFormulario();
      fetchUsuarios();
      console.log("Usuario editado:", response);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  }

  const clickEliminar = (usuario: User) => {
    console.log("Obtener datos para eliminar:", usuario);
    setUsuario(usuario);
    setMostrarModalDelete(true);
  }

  const eliminarUsuario = async () => {
    try {
      console.log("Eliminando usuario:", usuario);
      
      const response = await usersService.deleteUser(usuario.id);
      reiniciarFormulario();
      fetchUsuarios();
      console.log("Usuario eliminado:", response);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  }

  const reiniciarCargaDatos = async (dato:any) => {
    if (dato === '' || Number(dato) === 0) {
      try {
        fetchUsuarios();
      } catch (error) {
        console.error("Error al reiniciar carga de datos:", error);
      }
    }
  }

  const handleBuscar = async () => {
    console.log("Filtro elegido:", filtroElegido);
    console.log("Filtros aplicados:", filtros);
    // Aquí podrías aplicar los filtros al listado si es necesario
    try {
      switch (filtroElegido) {
        case 'nombre': {
          if (!filtros.nombre) {
            reiniciarCargaDatos(filtros.nombre);
            return;
          }

          const result = await usersService.buscarNombre(filtros.nombre);
          setUsuarios(result);
          break;
        }
        case 'email': {
          if (!filtros.email) {
            reiniciarCargaDatos(filtros.email);
            return;
          }

          const emailResult = await usersService.buscarEmail(filtros.email);
          setUsuarios([emailResult]);
          break;
        }
        case 'rolName': {
          if (!filtros.rolName) {
            reiniciarCargaDatos(filtros.rolName);
            return;
          }

          const rolNameResult = await usersService.buscarNombreRol(filtros.rolName);
          setUsuarios(rolNameResult);
          break;
        }
        case 'estado': {
          if (Number(filtros.estado) === 0) {
            reiniciarCargaDatos(Number(filtros.estado));
            return;
          }

          const estadoResult = await usersService.seleccionarEstado(Number(filtros.estado) === 1? true : false);
          setUsuarios(estadoResult);
          break;
        }
        case 'rol': {
          if (Number(filtros.rol) === 0) {
            reiniciarCargaDatos(filtros.rol);
            return;
          }

          const rolResult = await usersService.seleccionarRol(Number(filtros.rol));
          setUsuarios(rolResult);
          break;
        }
        default:
          // const allUsers = await usersService.getAllUsers();
          // setUsuarios(allUsers);
          break;
      }
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      const result: any[] = [];
      setUsuarios(result);
    }        
  };

  const toggleUsuarioActivo = async (usuario: User) => {
    try {
      if (usuario.enabled) {
        await usersService.desactivarUsuario(usuario.id);
      } else {
        await usersService.activarUsuario(usuario.id);
      }
      fetchUsuarios();
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto text-gray-800 dark:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Gestión de Usuarios</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Administra los usuarios que acceden a la plataforma federada
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm text-sm"
          onClick={() => setMostrarModalAddUpd(true)}
        >
          <FaUserPlus className="text-base" />
          Nuevo Usuario
        </button>
      </div>

      <FiltroDinamico
        filtros={filtros}
        setFiltros={setFiltros}
        onBuscar={handleBuscar}
        rules={rules}
        setFiltroElegido={setSetFiltroElegido}
        reiniciarCargaDatos={reiniciarCargaDatos}
      />

      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full text-sm text-left bg-white dark:bg-gray-900">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Organización</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 whitespace-nowrap">{usuario.username}</td>
                <td className="px-4 py-3 whitespace-nowrap">{usuario.mail}</td>
                <td className="px-4 py-3 whitespace-nowrap">{usuario.nameOrganization}</td>
                <td className="px-4 py-3 whitespace-nowrap">{usuario.roleName}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      usuario.enabled
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800' // rojo suave de fondo y texto oscuro
                    }`}
                  >
                    {usuario.enabled? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap flex gap-2">
                  <button className="w-8 h-8 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full flex items-center justify-center" onClick={() => clickEditar(usuario)}>
                    <FaEdit />
                  </button>
                  <button className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <FaSearch />
                  </button>
                  <button className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center" onClick={() => clickEliminar(usuario)}>
                    <FaTimes />
                  </button>
                  <button
                    className={`w-8 h-8 ${
                      usuario.enabled ? "bg-gray-500 hover:bg-gray-600" : "bg-green-500 hover:bg-green-600"
                    } text-white rounded-full flex items-center justify-center`}
                    title={usuario.enabled ? "Desactivar usuario" : "Activar usuario"}
                    onClick={() => toggleUsuarioActivo(usuario)}
                  >
                    {usuario.enabled ? "🔒" : "🔓"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UsuarioModal.ModalUsuario
        open={mostrarModalAddUpd} // Cambiar a true para mostrar el modal
        onClose={reiniciarFormulario}
        onSubmit={modoEdicion? editarUsuario : guardarUsuario}
        usuario={usuario}
        setUsuario={setUsuario}
        roles={rules} // Cargar roles desde el servicio
        organizations={organizaciones} // Cargar organizaciones desde el servicio
        modoEdicion={modoEdicion} // Cambiar a true si es modo edición
      />

      <UsuarioModal.EliminarUsuarioModal
        open={mostrarModalDelete}
        onClose={reiniciarFormulario}
        onConfirm={eliminarUsuario}
        nombreUsuario={usuario.username}
      />
    </div>
  );
}
