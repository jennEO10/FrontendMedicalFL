import {
  FaUsers,
  FaBuilding,
  FaShieldAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState, useRef } from "react";
import userService from "../../services/usersService";
import organizationService from "../../services/organizationService";
import iteracionService from "../../services/iteracionService";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function DashboardAdminView() {
  const initialized = useRef(false);
  const [statsData, setStatsData] = useState([
    {
      label: "Organizaciones Activas",
      icon: <FaBuilding className="text-indigo-500 w-6 h-6" />, 
      data: [10, 11, 12, 13, 15, 17, 18],
      color: "#6366f1",
      value: 0,
      change: "+0 desde el último mes",
    },
    {
      label: "Usuarios Totales",
      icon: <FaUsers className="text-green-500 w-6 h-6" />, 
      data: [10, 11, 13, 14, 15, 17, 18],
      color: "#22c55e",
      value: 0,
      change: "+0 desde el último mes",
    },
    {
      label: "Alertas de Seguridad",
      icon: <FaShieldAlt className="text-red-500 w-6 h-6" />, 
      data: [5, 5, 6, 7, 8, 10, 12],
      color: "#ef4444",
      value: 0,
      change: "+0 desde el último mes",
    },
    {
      label: "Iteraciones Activas",
      icon: <FaSyncAlt className="text-yellow-500 w-6 h-6" />, 
      data: [6, 7, 8, 9, 10, 11, 12],
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
          iteracionService.getAllIteraciones()
        ]);

        setStatsData((prev) => prev.map((stat, idx) => {
          const value = [
            orgsRes,
            usersRes,
            [],
            iterationsRes,
          ][idx]?.length || 0;

          return {
            ...stat,
            value,
            data: [...stat.data.slice(1), value],
          };
        }));

      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);
  
  const chartData = {
    labels: statsData[0].data.map((_, i) => `Semana ${i + 1}`),
    datasets: statsData.map((stat) => ({
      label: stat.label,
      data: stat.data,
      fill: false,
      borderColor: stat.color,
      tension: 0.4,
      pointRadius: 4,
    })),
  };

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
          Actividad del Sistema
        </h2>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  color: '#374151', // gris oscuro (modo claro)
                  // se sobreescribe dinámicamente con detectTheme opcionalmente
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#6b7280" },
                grid: { color: "#e5e7eb" },
              },
              y: {
                ticks: { color: "#6b7280" },
                grid: { color: "#e5e7eb" },
              },
            },
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Actividad Reciente
        </h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>
            ⚠️ Alerta de seguridad: Acceso inusual detectado - Hace 30 minutos
          </li>
          <li>
            👤 Usuario nuevo creado: maria.lopez@hospital.org - Hace 2 horas
          </li>
          <li>
            📊 Organización "Hospital Norte" agregada - Hace 3 horas
          </li>
          <li>
            ✅ Iteración #28 completada - Hace 5 horas
          </li>
          <li>
            📃 Nuevo reporte de auditoría disponible - Hace 1 día
          </li>
        </ul>
      </div>
    </div>
  );
}
