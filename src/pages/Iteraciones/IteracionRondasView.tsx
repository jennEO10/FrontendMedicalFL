import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import iteracionService from '../../services/iteracionService';
import { MetricasByIteracion, RondasForIteracion } from '../../models/iteracion';
import { FaArrowLeft } from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

export default function IteracionForRondas() {
  const location = useLocation();
  const navigate = useNavigate();
  const iteracion = location.state?.iteracion;

  const [metrics, setMetrics] = useState<MetricasByIteracion[]>([]);
  const [viewMode, setViewMode] = useState<'tabla' | 'grafico'>('tabla');
  const [tab, setTab] = useState('accuracy');

  const metricas = [
    { key: 'auc', label: 'AUC' },
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'precision', label: 'Precision' },
    { key: 'recall', label: 'Recall' },
    { key: 'f1score', label: 'F1 Score' }
  ];

  useEffect(() => {
    if (!iteracion) return;
    const fetchMetrics = async () => {
      try {
        const data = await iteracionService.exportarMetricasPorIteracion(iteracion.id);
        const dataFormateada = data.map((item: any) => ({
          ...item,
          accuracy: (item.accuracy * 100).toFixed(2),
          precision: (item.precision * 100).toFixed(2),
          recall: (item.recall * 100).toFixed(2),
          f1score: (item.f1_score * 100).toFixed(2),
          auc: (item.auc * 100).toFixed(2),
          loss: (item.loss * 100).toFixed(2),
        }));
        setMetrics(dataFormateada);
      } catch (error) {
        console.error('Error al obtener métricas:', error);
      }
    };
    fetchMetrics();
  }, [iteracion]);

  if (!iteracion) return <div>Iteración no encontrada</div>;

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

      {/* Switch de vista */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setViewMode('tabla')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            viewMode === 'tabla'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
          }`}
        >
          Tabla
        </button>
        <button
          onClick={() => setViewMode('grafico')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            viewMode === 'grafico'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
          }`}
        >
          Gráfico
        </button>
      </div>

      {/* Contenido según vista */}
      {viewMode === 'tabla' ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-x-auto max-h-[400px] overflow-y-auto">
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
              {metrics.map((m) => (
                <tr key={m.round} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-3">#{m.round}</td>
                  {['auc', 'accuracy', 'precision', 'recall', 'f1score'].map((key) => (
                    <td className="px-4 py-3" key={key}>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${m[key as keyof typeof m]}%` }}></div>
                      </div>
                      <span className="text-xs">{m[key as keyof typeof m]}%</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* Tabs por métrica */}
          <div className="mb-4 flex gap-2 flex-wrap">
            {metricas.map((m) => (
              <button
                key={m.key}
                onClick={() => setTab(m.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  tab === m.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Gráfico */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">{metricas.find(m => m.key === tab)?.label} por Ronda</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="round" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey={tab} fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

