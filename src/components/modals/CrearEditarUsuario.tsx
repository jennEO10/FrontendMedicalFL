import { FC } from 'react';
import { ModalUsuarioProps } from '../../models/user';

const ModalUsuario: FC<ModalUsuarioProps> = ({
  open,
  onClose,
  onSubmit,
  usuario,
  setUsuario,
  roles,
  organizations,
  modoEdicion = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
        className="absolute inset-0"
        onClick={onClose}
        ></div>      

      <div className="relative z-10 w-[90%] max-w-md bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl text-gray-800 dark:text-white animate-fade-in">
        <button
        onClick={onClose}
        className="absolute top-3 right-4 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 text-xl"
        >
        &times;
        </button>
        
        <h2 className="text-xl font-bold mb-4">
          {modoEdicion ? 'Editar Usuario' : 'Crear Usuario'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-sm"
              value={usuario.username}
              onChange={(e) => setUsuario({ ...usuario, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Correo</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-sm"
              value={usuario.mail}
              onChange={(e) => setUsuario({ ...usuario, mail: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-sm"
              value={usuario.password}
              onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Organización</label>
            <select
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              value={usuario.organizationId}
              onChange={(e) => setUsuario({ ...usuario, organizationId: parseInt(e.target.value) })}
            >
              <option value="">Seleccione</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Rol</label>
            <select
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              value={usuario.rolesId[0] ?? ''}
              onChange={(e) => setUsuario({ ...usuario, rolesId: [parseInt(e.target.value)] })}
            >
              <option value="">Seleccione</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
          >
            {modoEdicion ? 'Editar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUsuario;
