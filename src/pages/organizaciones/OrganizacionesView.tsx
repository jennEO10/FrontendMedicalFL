import { useState, useEffect } from "react";
import { FaEdit, FaSearch, FaTimes } from "react-icons/fa";
import organizationService from '../../services/organizationService';
import { Organization } from "../../models/organization";
import Organizacion from "../../components/modals/OrganizacionModal";
import { Alerta } from "../../models/aletas";
import { getLocalDateTime } from "../../utils/dateUtils";
import alertaService from "../../services/alertaService";
import { alertaEmitter } from "../../utils/alertaEvents";

const OrganizacionesView = () => {
  const [busqueda, setBusqueda] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [organizaciones, setOrganizaciones] = useState<Organization[]>([]);

  const [org, setNueva] = useState({ id: 0, name: "", descripcion: "", contacto: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);


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

  const reiniciarFormulario = () => {
    setNueva({ id: 0, name: "", descripcion: "", contacto: "" });
    setMostrarModal(false)
    setModoEdicion(false);
    setMostrarModalDelete(false);
  }

  const guardarOrganizacion = async () => {
    try {
      console.log("Guardando organización:", org);

      const response = await organizationService.saveOrganization(org)

      const alerta: Alerta = {
        id: 0,
        tipo: "🏢",
        mensaje: `Organización creada: ID<${response.id}> - "${org.name}" por ${sessionStorage.getItem("userEmail")}`,
        timestamp: getLocalDateTime()
      };
      const alertaResponse = await alertaService.nuevaAlerta(alerta);
      console.log("Alerta registrada:", alertaResponse);
      // 🟠 Emitir evento para notificaciones en tiempo real
      alertaEmitter.emit('alertaCreada');

      reiniciarFormulario();
      fetchData();
      console.log("Organización guardada:", response);
    } catch (error) {
      console.error("Error al guardar organización:", error);
    }
  }

  const clickEditar = (org: Organization) => {
    console.log("Obtener datos para editar:", org);
    setNueva(org);
    setModoEdicion(true);
    setMostrarModal(true);
  }

  const editarOrganizacion = async () => {
    try {
      console.log("Editando datos de la organización:", org);

      const response = await organizationService.actualizarOrganization(org.id, org)

      const alerta: Alerta = {
        id: 0,
        tipo: "✏️",
        mensaje: `Organización editada: ID<${org.id}> - "${org.name}" por ${sessionStorage.getItem("userEmail")}`,
        timestamp: getLocalDateTime()
      };
      const alertaResponse = await alertaService.nuevaAlerta(alerta);
      console.log("Alerta registrada:", alertaResponse);
      // 🟠 Emitir evento para notificaciones en tiempo real
      alertaEmitter.emit('alertaCreada');

      reiniciarFormulario();
      fetchData();
      console.log("Organización editada:", response);
    } catch (error) {
      console.error("Error al guardar organización:", error);
    }
  }

  const clickEliminar = (org: Organization) => {
    console.log("Obtener datos para eliminar:", org);
    setNueva(org);
    setMostrarModalDelete(true);
  }

  const eliminarOrganizacion = async () => {
    try {
      console.log("Eliminando organización:", org);

      const response = await organizationService.delOrganization(org.id);

      const alerta: Alerta = {
        id: 0,
        tipo: "🗑️",
        mensaje: `Organización eliminada: ID<${org.id}> - "${org.name}" por ${sessionStorage.getItem("userEmail")}`,
        timestamp: getLocalDateTime()
      };
      const alertaResponse = await alertaService.nuevaAlerta(alerta);
      console.log("Alerta registrada:", alertaResponse);
      // 🟠 Emitir evento para notificaciones en tiempo real
      alertaEmitter.emit('alertaCreada');

      reiniciarFormulario();
      fetchData();
      console.log("Organización eliminada:", response);
    } catch (error) {
      console.error("Error al eliminar organización:", error);
    }
  }

  const handleSearch = (value: string) => {
    setBusqueda(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(async () => {
      if (value.trim() === "") {
        await fetchData(); // muestra todo
        return;
      }

      try {
        const result = await organizationService.searchOrganization(value);
        setOrganizaciones(result);
      } catch (error) {
        console.error("Error al buscar organización:", error);
        setOrganizaciones([]);
      }
    }, 600); // 600ms debounce

    setDebounceTimeout(timeout);
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto dark:text-white">
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
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setMostrarModal(true)}
          className="w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Nueva Organización
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm text-left bg-white dark:bg-gray-900">
          <thead className="bg-gray-100 dark:bg-gray-800">
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
                <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full" onClick={() => clickEditar(org)}>
                    <FaEdit />
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full" onClick={() => clickEliminar(org)}>
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Organizacion.CrearEditarOrganizacion
        open={mostrarModal}
        onClose={reiniciarFormulario}
        org={org}
        setNueva={setNueva}
        onSubmit={modoEdicion? editarOrganizacion: guardarOrganizacion }
        modoEdicion={modoEdicion}
      />

      <Organizacion.EliminarOrganizacion
        open={mostrarModalDelete}
        nombre={org.name}
        onClose={reiniciarFormulario}
        onConfirm={eliminarOrganizacion}
      />
    </div>
  );
};

export default OrganizacionesView;
