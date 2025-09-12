import { FaUsers, FaBuilding, FaShieldAlt, FaSyncAlt } from "react-icons/fa";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useEffect, useState, useRef } from "react";
import userService from "../../services/usersService";
import organizationService from "../../services/organizationService";
import iteracionService from "../../services/iteracionService";
import { Alerta } from "../../models/aletas";
import alertaService from "../../services/alertaService";
import { useRoleGuard } from "../../hooks/useRoleGuard";
import LoadingScreen from "../../components/common/LoadingScreen";

export default function DashboardAdminView() {
  const initialized = useRef(false);
  const { isLoading, hasAccess } = useRoleGuard({ requiredRole: "admin" });

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [statsData, setStatsData] = useState([
    {
      label: "Organizaciones",
      icon: <FaBuilding className="text-indigo-500 w-6 h-6" />,
      color: "#6366f1",
      value: 0,
      change: "+0 desde el último mes",
    },
    {
      label: "Usuarios",
      icon: <FaUsers className="text-green-500 w-6 h-6" />,
      color: "#22c55e",
      value: 0,
      change: "+0 desde el último mes",
    },
    {
      label: "Alertas de Seguridad",
      icon: <FaShieldAlt className="text-red-500 w-6 h-6" />,
      color: "#ef4444",
      value: 0,
      change: "+0 desde el último mes",
    },
    {
      label: "Iteraciones",
      icon: <FaSyncAlt className="text-yellow-500 w-6 h-6" />,
      color: "#eab308",
      value: 0,
      change: "+0 desde el último mes",
    },
  ]);

  const [alerts, setAlerts] = useState<Alerta[]>([]);

  const getAllAlerts = async () => {
    try {
      // Esperar a que el token esté disponible
      const waitForToken = () => {
        return new Promise<void>((resolve) => {
          const checkToken = () => {
            const token = sessionStorage.getItem("token");
            if (token) {
              resolve();
            } else {
              setTimeout(checkToken, 100);
            }
          };
          checkToken();
        });
      };

      await waitForToken();
      const response = (await alertaService.getAllAlerts())
        .sort((a, b) => b.id - a.id)
        .slice(0, 6);

      setAlerts(response);
    } catch (error) {
      console.error("Error al obtener las alertas: ", error);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const fetchData = async () => {
      // Esperar a que el token esté disponible
      const waitForToken = () => {
        return new Promise<void>((resolve) => {
          const checkToken = () => {
            const token = sessionStorage.getItem("token");
            if (token) {
              resolve();
            } else {
              setTimeout(checkToken, 100);
            }
          };
          checkToken();
        });
      };

      try {
        await waitForToken();
        const [orgsRes, usersRes, iterationsRes] = await Promise.all([
          organizationService.fetchAll(),
          userService.getAllUsers(),
          iteracionService.getAllIteraciones(),
        ]);

        setStatsData((prev) =>
          prev.map((stat, idx) => {
            const value =
              [orgsRes, usersRes, [], iterationsRes][idx]?.length || 0;
            return {
              ...stat,
              value,
              change: `+${value} desde el último mes`,
            };
          })
        );
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
    getAllAlerts();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Set on mount
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const chartData = statsData.map((stat) => ({
    subject: stat.label,
    A: stat.value,
  }));

  const fullHistorico = [
    {
      fecha: "13/06",
      usuarios: 1,
      iteraciones: 0,
      alertas: 0,
      organizaciones: 1,
    },
    {
      fecha: "14/06",
      usuarios: 2,
      iteraciones: 1,
      alertas: 0,
      organizaciones: 1,
    },
    {
      fecha: "15/06",
      usuarios: 2,
      iteraciones: 1,
      alertas: 0,
      organizaciones: 1,
    },
    {
      fecha: "16/06",
      usuarios: 3,
      iteraciones: 1,
      alertas: 0,
      organizaciones: 1,
    },
    {
      fecha: "17/06",
      usuarios: 5,
      iteraciones: 2,
      alertas: 0,
      organizaciones: 1,
    },
    {
      fecha: "18/06",
      usuarios: 7,
      iteraciones: 3,
      alertas: 1,
      organizaciones: 2,
    },
    {
      fecha: "19/06",
      usuarios: 9,
      iteraciones: 4,
      alertas: 1,
      organizaciones: 3,
    },
    {
      fecha: "20/06",
      usuarios: 12,
      iteraciones: 6,
      alertas: 2,
      organizaciones: 3,
    },
    {
      fecha: "21/06",
      usuarios: 14,
      iteraciones: 8,
      alertas: 3,
      organizaciones: 4,
    },
    {
      fecha: "22/06",
      usuarios: 15,
      iteraciones: 10,
      alertas: 3,
      organizaciones: 5,
    },
    {
      fecha: "23/06",
      usuarios: 16,
      iteraciones: 11,
      alertas: 4,
      organizaciones: 6,
    },
    {
      fecha: "24/06",
      usuarios: 18,
      iteraciones: 13,
      alertas: 4,
      organizaciones: 7,
    },
    {
      fecha: "25/06",
      usuarios: 19,
      iteraciones: 15,
      alertas: 4,
      organizaciones: 8,
    },
  ];

  // Extraer las últimas 10 fechas con datos
  const historicoData = fullHistorico.slice(-10);

  function formatearTiempoRelativo(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const segundos = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);
    const años = Math.floor(meses / 12);

    if (segundos < 60) return "Hace unos segundos";
    if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? "s" : ""}`;
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? "s" : ""}`;
    if (dias < 30) return `Hace ${dias} día${dias > 1 ? "s" : ""}`;
    if (meses < 12) return `Hace ${meses} mes${meses > 1 ? "es" : ""}`;
    return `Hace ${años} año${años > 1 ? "s" : ""}`;
  }

  // Mostrar loading mientras se verifica el token y el rol
  if (isLoading) {
    return <LoadingScreen message="Inicializando sistema..." />;
  }

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Dashboard del Administrador
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Resumen del estado del sistema y actividades recientes
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 shadow rounded-lg p-5 flex items-center gap-4"
          >
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
              {stat.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </h3>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Distribución Actual del Sistema
        </h2>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid className="stroke-gray-200 dark:stroke-gray-600" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  className: "fill-gray-700 dark:fill-gray-200 text-[13px] font-semibold",
                }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 30]} className="stroke-gray-400 dark:stroke-gray-500" />
              <Radar
                name="Distribución Actual"
                dataKey="A"
                stroke="#4f46e5"
                fill="#6366f1"
                fillOpacity={0.4}
              />
              <Tooltip
                contentStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "#fff" }}
                labelStyle={{ color: isDarkMode ? "#e5e7eb" : "#111827" }}
              />
              <Legend wrapperStyle={{ color: isDarkMode ? "#cbd5e1" : "#1f2937" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Histórico de Actividad
        </h2>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historicoData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis
                dataKey="fecha"
                tick={({ x, y, payload }) => (
                  <text
                    x={x}
                    y={y + 10}
                    textAnchor="middle"
                    className="fill-black dark:fill-white text-sm"
                  >
                    {payload.value}
                  </text>
                )}
              />
              <YAxis
                tick={({ x, y, payload }) => (
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-black dark:fill-white text-sm"
                  >
                    {payload.value}
                  </text>
                )}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#fff",
                }}
                labelStyle={{ color: isDarkMode ? "#e5e7eb" : "#111827" }}
              />
              <Legend
                wrapperStyle={{ color: isDarkMode ? "#cbd5e1" : "#1f2937" }}
              />
              <Line
                type="monotone"
                dataKey="usuarios"
                stroke="#22c55e"
                strokeWidth={2}
                name="Usuarios"
              />
              <Line
                type="monotone"
                dataKey="iteraciones"
                stroke="#eab308"
                strokeWidth={2}
                name="Iteraciones"
              />
              <Line
                type="monotone"
                dataKey="alertas"
                stroke="#ef4444"
                strokeWidth={2}
                name="Alertas"
              />
              <Line
                type="monotone"
                dataKey="organizaciones"
                stroke="#6366f1"
                strokeWidth={2}
                name="Organizaciones"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Actividad Reciente
        </h2>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {alerts.map((alert, index) => (
            <li
              key={index}
              className="flex items-start gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="text-xl mt-1">{alert.tipo}</div>
              <div className="flex flex-col w-full">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {alert.mensaje}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatearTiempoRelativo(alert.timestamp)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
