/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import userService from "../../services/usersService";
import { User } from "../../models/user";
import iteracionService from "../../services/iteracionService";
import organizationService from "../../services/organizationService";

interface MetricasOrganizacion {
  nombre: string;
  ronda: number;
  valor: number;
  iterationId: number;
  organizationId: number;
  organizationName: string;
}

interface Organizacion {
  id: number;
  name: string;
}

export default function MetricasPorOrganizacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const iteracion = location.state?.iteracion;

  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [organizacionSeleccionada, setOrganizacionSeleccionada] = useState<
    number | null
  >(null);
  const [viewMode, setViewMode] = useState<"tabla" | "grafico">("tabla");
  const [metrics, setMetrics] = useState<MetricasOrganizacion[] | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>("accuracy");

  useEffect(() => {
    const cargarUsuariosYOrganizaciones = async () => {
      if (!iteracion?.userIds || iteracion.userIds.length === 0) return;
      try {
        const usuariosCargados = await Promise.all(
          iteracion.userIds.map(async (id: number) => {
            const res = await userService.getUser(id);
            return {
              id: res.id,
              username: res.username,
              organizationId: res.organizationId,
              organizationName: res.nameOrganization,
            };
          })
        );
        setUsuarios(usuariosCargados);

        // Extraer organizaciones únicas
        const organizacionesUnicas = usuariosCargados.reduce(
          (acc: Organizacion[], usuario) => {
            const orgExists = acc.find(
              (org) => org.id === usuario.organizationId
            );
            if (!orgExists) {
              acc.push({
                id: usuario.organizationId,
                name: `Organización ${usuario.organizationId}`, // Placeholder temporal
              });
            }
            return acc;
          },
          []
        );

        // Obtener nombres reales de las organizaciones
        const organizacionesConNombres = await Promise.all(
          organizacionesUnicas.map(async (org) => {
            try {
              const orgData = await organizationService.getOrganization(org.id);
              return {
                id: org.id,
                name: orgData.name || `Organización ${org.id}`,
              };
            } catch (error) {
              console.error(`Error obteniendo organización ${org.id}:`, error);
              return org; // Mantener el placeholder si hay error
            }
          })
        );

        setOrganizaciones(organizacionesConNombres);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };
    cargarUsuariosYOrganizaciones();
  }, [iteracion]);

  useEffect(() => {
    if (organizacionSeleccionada === null) return;

    const fetchMetrics = async () => {
      try {
        const data = await iteracionService.obtenerMetricasPorOrganizacion(
          organizacionSeleccionada,
          iteracion.id
        );
        setMetrics(data);
      } catch (error) {
        console.error("Error al obtener métricas por organización:", error);
        setMetrics([]);
      }
    };
    fetchMetrics();
  }, [organizacionSeleccionada, iteracion]);

  const handleOrganizacionChange = (organizationId: number) => {
    setOrganizacionSeleccionada(organizationId);
  };

  const formatDataForChart = (
    data: MetricasOrganizacion[],
    metricName: string
  ) => {
    const filteredData = data.filter((item) => item.nombre === metricName);
    return filteredData.map((item) => ({
      ronda: item.ronda,
      valor: (item.valor * 100).toFixed(2),
    }));
  };

  const getAvailableMetrics = (data: MetricasOrganizacion[]) => {
    // Orden fijo igual al de métricas por usuario
    const orderedMetrics = [
      "auc",
      "accuracy",
      "precision",
      "recall",
      "f1_score",
    ];
    const availableMetrics = [...new Set(data.map((item) => item.nombre))];

    // Filtrar solo las métricas disponibles y mantener el orden
    return orderedMetrics
      .filter((metric) => availableMetrics.includes(metric))
      .map((metric) => ({
        key: metric,
        label:
          metric.charAt(0).toUpperCase() + metric.slice(1).replace("_", " "),
      }));
  };

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2 sm:mb-0">
            Métricas por Organización
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Iteración <strong>#{iteracion?.id}</strong>
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Seleccione una organización:
        </label>
        <select
          className="w-full sm:w-64 px-4 py-2 rounded-md border dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          value={
            organizacionSeleccionada !== null ? organizacionSeleccionada : ""
          }
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              handleOrganizacionChange(parseInt(value));
            } else {
              setOrganizacionSeleccionada(null);
            }
          }}
        >
          <option value="">-- Seleccione --</option>
          {organizaciones.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {organizacionSeleccionada !== null &&
      metrics !== null &&
      metrics.length > 0 ? (
        <>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setViewMode("tabla")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                viewMode === "tabla"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              Tabla
            </button>
            <button
              onClick={() => setViewMode("grafico")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                viewMode === "grafico"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              Gráfico
            </button>
          </div>

          {viewMode === "tabla" ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-x-auto max-h-[400px] overflow-y-auto">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                {/* Título de la organización eliminado según solicitud del usuario */}
              </div>
              <table className="w-full text-sm text-left">
                <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3">Ronda</th>
                    <th className="px-4 py-3">AUC</th>
                    <th className="px-4 py-3">Accuracy</th>
                    <th className="px-4 py-3">Precision</th>
                    <th className="px-4 py-3">Recall</th>
                    <th className="px-4 py-3">F1 Score</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(
                    { length: Math.max(...metrics.map((m) => m.ronda)) },
                    (_, i) => i + 1
                  ).map((ronda) => (
                    <tr
                      key={ronda}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-3">#{ronda}</td>
                      {[
                        "auc",
                        "accuracy",
                        "precision",
                        "recall",
                        "f1_score",
                      ].map((metricKey) => {
                        const metric = metrics.find(
                          (m) => m.ronda === ronda && m.nombre === metricKey
                        );
                        const value = metric
                          ? (metric.valor * 100).toFixed(2)
                          : "0.00";
                        return (
                          <td className="px-4 py-3" key={metricKey}>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                              <div
                                className="bg-blue-500 h-2.5 rounded-full"
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{value}%</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <div className="mb-4 flex gap-2 flex-wrap">
                {getAvailableMetrics(metrics).map((metric) => (
                  <button
                    key={metric.key}
                    onClick={() => setSelectedMetric(metric.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedMetric === metric.key
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow">
                {/* Título de la organización eliminado según solicitud del usuario */}
                <h3 className="text-md font-medium mb-4 text-gray-600 dark:text-gray-400">
                  {
                    getAvailableMetrics(metrics).find(
                      (m) => m.key === selectedMetric
                    )?.label
                  }{" "}
                  por Ronda
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatDataForChart(metrics, selectedMetric)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ronda" />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="valor"
                      stroke="#6366F1"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </>
      ) : organizacionSeleccionada !== null &&
        metrics !== null &&
        metrics.length === 0 ? (
        <p className="text-sm text-gray-500 mt-4">
          No hay métricas disponibles para esta organización.
        </p>
      ) : null}
    </div>
  );
}
