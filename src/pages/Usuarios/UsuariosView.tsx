import { useState, useEffect } from 'react';
import { FaEdit, FaSearch, FaTimes, FaUserPlus } from 'react-icons/fa';
import { User } from '../../models/user';
import usersService from '../../services/usersService';
import UsuarioModal from '../../components/modals/UsuarioModal';
import rulesService from '../../services/rulesService';
import { Rule } from '../../models/rules';
import organizationService from '../../services/organizationService';
import { Organization } from '../../models/organization';

export default function UsuariosView() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [organizaciones, setOrganizaciones] = useState<Organization[]>([]);
  const [usuario, setUsuario] = useState({ id: 0, username: '', password: '', enabled: true, mail: '', organizationId: 0, rolesId: [0]});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
  const [mostrarModalAddUpd, setMostrarModalAddUpd] = useState(false);

  const [filtros, setFiltros] = useState({
    nombre: '',
    email: '',
    estado: 0,
    rol: 0
  });

  const fetchUsuarios = async () => {
    try {
      const response = await usersService.getAllUsers();
      const organizaciones = await organizationService.fetchAll(); // Asumiendo que tienes un método para obtener organizaciones
      const rules = await rulesService.getAllRules();
      setUsuarios(response);
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

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

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
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm"
          onClick={() => setMostrarModalAddUpd(true)}
        >
          <FaUserPlus className="text-base" />
          Nuevo Usuario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            placeholder="Buscar por nombre"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            value={filtros.nombre}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Buscar por email"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            value={filtros.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="estado" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Estado
          </label>
          <select
            name="estado"
            id="estado"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            value={filtros.estado}
            onChange={handleInputChange}
          >
            <option value="Todos">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <div>
          <label htmlFor="rol" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Rol
          </label>
          <select
            name="rol"
            id="rol"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            value={filtros.rol}
            onChange={handleInputChange}
          >
            {[{ id: 0, name: 'Todos' }, ...rules].map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            // onClick={handleBuscar}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="min-w-full text-sm text-left bg-white dark:bg-gray-900">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Organización</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Último Acceso</th>
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
                <td className="px-4 py-3 whitespace-nowrap">Org #{usuario.organizationId}</td>
                <td className="px-4 py-3 whitespace-nowrap">Rol #{usuario.rolesId}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                    {usuario.enabled? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">--/--/----</td>
                <td className="px-4 py-3 whitespace-nowrap flex gap-2">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full" onClick={() => clickEditar(usuario)}>
                    <FaEdit />
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
                    <FaSearch />
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full" onClick={() => clickEliminar(usuario)}>
                    <FaTimes />
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
