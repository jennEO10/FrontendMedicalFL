// Componente: FiltroDinamico.tsx
import { FC, useState, ChangeEvent } from 'react';
import { FiltroDinamicoProps } from '../../models/user';

const FiltroDinamico: FC<FiltroDinamicoProps> = ({ filtros, setFiltros, onBuscar, rules, setFiltroElegido, reiniciarCargaDatos }) => {
  const [opcionFiltro, setOpcionFiltro] = useState<string>('');

  const handleFiltroChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const valor = e.target.value;
      setOpcionFiltro(valor);
      setFiltroElegido(valor);
      setFiltros({ nombre: '', email: '', rolName: '', estado: 0, rol: 0 });
      
      if (valor === '') {
        reiniciarCargaDatos('');
      }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros((prev: any) => ({ ...prev, [name]: value }));
  };

  const renderInput = () => {
    switch (opcionFiltro) {
      case 'nombre':
        return (
          <input
            type="text"
            name="nombre"
            placeholder="Buscar por nombre"
            className="w-full md:w-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            value={filtros.nombre}
            onChange={handleInputChange}
          />
        );
      case 'email':
        return (
          <input
            type="text"
            name="email"
            placeholder="Buscar por email"
            className="w-full md:w-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            value={filtros.email}
            onChange={handleInputChange}
          />
        );
      case 'rolName':
        return (
          <input
            type="text"
            name="rolName"
            placeholder="Buscar por rol"
            className="w-full md:w-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            value={filtros.rolName}
            onChange={handleInputChange}
          />
        );
      case 'estado':
        return (
          <select
            name="estado"
            className="w-full md:w-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            value={filtros.estado}
            onChange={handleInputChange}
          >
            <option value={0}>Todos</option>
            <option value={1}>Activo</option>
            <option value={2}>Inactivo</option>
          </select>
        );
      case 'rol':
        return (
          <select
            name="rol"
            className="w-full md:w-64 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            value={(filtros.rol)}
            onChange={handleInputChange}
          >
            <option value={0}>Todos</option>
            {rules.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.name}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <select
        value={opcionFiltro}
        onChange={handleFiltroChange}
        className="w-full md:w-52 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
      >
        <option value="">Seleccione un filtro</option>
        <option value="nombre">Nombre</option>
        <option value="email">Email</option>
        <option value="rolName">Rol Name</option>
        <option value="estado">Estado</option>
        <option value="rol">Rol</option>
      </select>

      {opcionFiltro && (
        <>
          {renderInput()}
          <button
            onClick={onBuscar}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
          >
            Buscar
          </button>
        </>
      )}
    </div>
  );
};

export default FiltroDinamico;
