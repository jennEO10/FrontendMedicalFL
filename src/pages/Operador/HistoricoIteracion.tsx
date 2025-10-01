import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import iteracionService from "../../services/iteracionService";
import { MetricasByIteracion } from "../../models/iteracion";
import { FaArrowLeft } from "react-icons/fa";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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

export default function IteracionForRondas() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<MetricasByIteracion[]>([]);
  const [viewMode, setViewMode] = useState<"tabla" | "grafico">("tabla");
  const [tab, setTab] = useState("accuracy");

  const metricas = [
    { key: "auc", label: "AUC" },
    { key: "accuracy", label: "Accuracy" },
    { key: "precision", label: "Precision" },
    { key: "recall", label: "Recall" },
    { key: "f1score", label: "F1 Score" },
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await iteracionService.obtenerUltimasMetricas();
        const dataFormateada = data
          .map((item: any) => ({
            ...item,
            accuracy: (item.accuracy * 100).toFixed(2),
            precision: (item.precision * 100).toFixed(2),
            recall: (item.recall * 100).toFixed(2),
            f1score: (item.f1_score * 100).toFixed(2),
            auc: (item.auc * 100).toFixed(2),
            loss: (item.loss * 100).toFixed(2),
          }))
          .sort((a, b) => a.iterationId - b.iterationId);
        setMetrics(dataFormateada);
      } catch (error) {
        console.error("Error al obtener métricas:", error);
      }
    };
    fetchMetrics();
  }, []);

  const handleDownloadExcel = () => {
    const data = metrics.map((m) => ({
      Iteración: m.iterationId,
      "AUC (%)": m.auc,
      "Accuracy (%)": m.accuracy,
      "Precision (%)": m.precision,
      "Recall (%)": m.recall,
      "F1 Score (%)": m.f1score,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Autoajustar ancho de columnas
    const columnWidths = Object.keys(data[0]).map((key) => {
      const maxLength = data.reduce((max, item) => {
        const value = (item as any)[key] ? (item as any)[key].toString() : "";
        return Math.max(max, value.length);
      }, key.length);
      return { wch: maxLength + 2 }; // +2 para margen
    });

    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial Métricas");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "historial-metricas.xlsx");
  };

  if (!metrics) return <div>Iteración no encontrada</div>;

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2 sm:mb-0">
            Historial de Métricas
          </h1>
          {/* <p className="text-sm text-gray-600 dark:text-gray-400">
            Iteración <strong>#{iteracion.id}</strong>: {iteracion.iterationName}
          </p> */}
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
            title="Descargar Excel"
          >
            <Download className="w-4 h-4" /> Descargar Excel
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
          >
            <FaArrowLeft /> Volver
          </button>
        </div>
      </div>

      {/* Botones Tabla / Gráfico (estilo pill) */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setViewMode("tabla")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
            viewMode === "tabla"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
          }`}
        >
          Tabla
        </button>
        <button
          onClick={() => setViewMode("grafico")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
            viewMode === "grafico"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
          }`}
        >
          Gráfico
        </button>
      </div>

      {/* Contenido según vista */}
      {viewMode === "tabla" ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3">Iteración</th>
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
                  key={m.iterationId}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3">#{m.iterationId}</td>
                  {["auc", "accuracy", "precision", "recall", "f1score"].map(
                    (key) => (
                      <td className="px-4 py-3" key={key}>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${m[key as keyof typeof m]}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">
                          {m[key as keyof typeof m]}%
                        </span>
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="mb-4 flex gap-2 flex-wrap">
            {metricas.map((m) => (
              <button
                key={m.key}
                onClick={() => setTab(m.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  tab === m.key
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">
              {metricas.find((m) => m.key === tab)?.label} por Iteración
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="iterationId" />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={tab}
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
    </div>
  );
}
