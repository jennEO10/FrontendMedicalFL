import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import iteracionService from '../../services/iteracionService';
import { RondasForIteracion } from '../../models/iteracion';
import { FaArrowLeft } from 'react-icons/fa';

export default function IteracionForRondas() {
  const location = useLocation();
  const navigate = useNavigate();
  const iteracion = location.state?.iteracion;

  const [metrics, setMetrics] = useState<RondasForIteracion[]>([]);

  useEffect(() => {
    if (!iteracion) return;
    const fetchMetrics = async () => {
      try {
        const data = await iteracionService.obtenerRondasIteracion(iteracion.id);
        setMetrics(data);
      } catch (error) {
        console.error('Error al obtener las métricas de la iteración:', error);
      }
    };
    fetchMetrics();
  }, [iteracion]);

  if (!iteracion) {
    return (
      <div className="p-6 text-gray-800 dark:text-white">
        <h1 className="text-xl font-bold">Iteración no encontrada</h1>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2 sm:mb-0">Detalles de Iteración</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Iteración <strong>#{iteracion.id}</strong>: {iteracion.iterationName}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3">Ronda</th>
              <th className="px-4 py-3"># Ronda</th>
              <th className="px-4 py-3">AUC</th>
              <th className="px-4 py-3">Accuracy</th>
              <th className="px-4 py-3">Precision</th>
              <th className="px-4 py-3">Recall</th>
              <th className="px-4 py-3">F1 Score</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr
                key={m.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3">#{m.id}</td>
                <td className="px-4 py-3">{m.roundNum}</td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${m.auc}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{m.auc}%</span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${m.accuracy}%` }}></div>
                  </div>
                  <span className="text-xs">{m.accuracy}%</span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${m.precision}%` }}></div>
                  </div>
                  <span className="text-xs">{m.precision}%</span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${m.recall}%` }}></div>
                  </div>
                  <span className="text-xs">{m.recall}%</span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${m.f1Score}%` }}></div>
                  </div>
                  <span className="text-xs">{m.f1Score}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
