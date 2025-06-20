import {
  FaUsers,
  FaBuilding,
  FaShieldAlt,
  FaSyncAlt,
} from "react-icons/fa";
import {
  Radar, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend
} from "recharts";
import { useEffect, useState, useRef } from "react";
import userService from "../../services/usersService";
import organizationService from "../../services/organizationService";
import iteracionService from "../../services/iteracionService";

export default function DashboardAdminView() {
  const initialized = useRef(false);

  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const [statsData, setStatsData] = useState([
    {
      label: "Organizaciones Activas",
      icon: <FaBuilding className="text-indigo-500 w-6 h-6" />,
      color: "#6366f1",
      value: 0,
      change: "+0 desde el último mes",
    },
    {
      label: "Usuarios Totales",
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
      label: "Iteraciones Activas",
      icon: <FaSyncAlt className="text-yellow-500 w-6 h-6" />,
      color: "#eab308",
      value: 0,
      change: "+0 desde el último mes",
    },
  ]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const fetchData = async () => {
      try {
        const [orgsRes, usersRes, iterationsRes] = await Promise.all([
          organizationService.fetchAll(),
          userService.getAllUsers(),
          iteracionService.getAllIteraciones(),
        ]);

        setStatsData((prev) =>
          prev.map((stat, idx) => {
            const value = [orgsRes, usersRes, [], iterationsRes][idx]?.length || 0;
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
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: any) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const chartData = statsData.map((stat) => ({
    subject: stat.label,
    A: stat.value,
  }));

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

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
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
              <PolarRadiusAxis angle={30} domain={[0, 20]} className="stroke-gray-400 dark:stroke-gray-500" />
              <Radar
                name="Distribución Actual"
                dataKey="A"
                stroke="#4f46e5" // Indigo-600 (borde)
                fill="#6366f1"   // Indigo-500 (relleno)
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
      </div>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Actividad Reciente
        </h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>⚠️ Alerta de seguridad: Acceso inusual detectado - Hace 30 minutos</li>
          <li>👤 Usuario nuevo creado: maria.lopez@hospital.org - Hace 2 horas</li>
          <li>📊 Organización "Hospital Norte" agregada - Hace 3 horas</li>
          <li>✅ Iteración #28 completada - Hace 5 horas</li>
          <li>📃 Nuevo reporte de auditoría disponible - Hace 1 día</li>
        </ul>
      </div>
    </div>
  );
}
