import { useState, useEffect } from "react";
import { FaEdit, FaSearch, FaTimes } from "react-icons/fa";
import organizationService from '../../services/organizationService';
import { Organization } from "../../models/organization";

const OrganizacionesView = () => {
  const [busqueda, setBusqueda] = useState("");
  const [organizaciones, setOrganizaciones] = useState<Organization[]>([]);

  const [nueva, setNueva] = useState({ nombre: "", descripcion: "", contacto: "" });
  const [mostrarModal, setMostrarModal] = useState(false);

  const fetchData = async () => {
      try {
        const data = await organizationService.fetchAll();
        setOrganizaciones(data);
      } catch (error) {
        console.error('Error al cargar organizaciones:', error);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  // const filtrar = organizaciones.filter((org) =>
  //   org.nombre.toLowerCase().includes(busqueda.toLowerCase())
  // );

  // const guardarOrganizacion = () => {
  //   if (!nueva.nombre || !nueva.descripcion || !nueva.contacto) return;
  //   setOrganizaciones([...organizaciones, nueva]);
  //   setNueva({ nombre: "", descripcion: "", contacto: "" });
  //   setMostrarModal(false);
  // };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-1 text-gray-800 dark:text-white">
          Gestión de Organizaciones
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Administra las organizaciones participantes en el modelo federado
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <input
          type="text"
          placeholder="Buscar organización por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setMostrarModal(true)}
          className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow"
        >
          + Nueva Organización
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white dark:bg-gray-800 text-sm table-fixed">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="w-1/4 px-4 py-3 text-left">Nombre</th>
              <th className="w-1/3 px-4 py-3 text-left">Descripción</th>
              <th className="w-1/6 px-4 py-3 text-left">Contacto</th>
              <th className="w-1/4 px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {organizaciones.map((org, i) => (
              <tr key={i} className="border-t border-gray-200 dark:border-gray-800">
                <td className="px-4 py-2 text-gray-900 dark:text-white whitespace-nowrap">{org.name}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-white whitespace-nowrap">{org.descripcion}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-white whitespace-nowrap">{org.contacto}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-2 justify-start">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md flex items-center gap-1">
                      <FaEdit /> Editar
                    </button>
                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md flex items-center gap-1">
                      <FaSearch /> Ver
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1">
                      <FaTimes /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Nueva Organización
            </h3>
            <input
              type="text"
              placeholder="Nombre"
              value={nueva.nombre}
              onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })}
              className="w-full border px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={nueva.descripcion}
              onChange={(e) => setNueva({ ...nueva, descripcion: e.target.value })}
              className="w-full border px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Contacto"
              value={nueva.contacto}
              onChange={(e) => setNueva({ ...nueva, contacto: e.target.value })}
              className="w-full border px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                // onClick={guardarOrganizacion}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizacionesView;
