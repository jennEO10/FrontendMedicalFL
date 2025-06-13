import { useState } from "react";
import { HiDownload, HiEye } from "react-icons/hi";

const logsMock = Array.from({ length: 53 }, (_, i) => ({
  timestamp: `13/05/2025 0${Math.floor(8 + i % 3)}:${10 + (i % 50)}:33`,
  type: i % 3 === 0 ? "Info" : i % 3 === 1 ? "Warning" : "Error",
  module: ["Autenticación", "Iteración", "API"][i % 3],
  message: [
    "Inicio de sesión exitoso",
    "Tiempo de respuesta alto del nodo",
    "Error de conexión con el servidor",
  ][i % 3],
  user: i % 2 === 0 ? "jperez@hospital-universitario.org" : "sistema",
  ip: `10.0.0.${i % 10}`,
}));

const typeColor: Record<string, string> = {
  Info: "bg-blue-100 text-blue-800",
  Warning: "bg-yellow-100 text-yellow-800",
  Error: "bg-red-100 text-red-700",
};

export default function LogDelSistema() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const filteredLogs = logsMock.filter((log) => {
    const matchesType = typeFilter === "Todos" || log.type === typeFilter;
    const matchesSearch =
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.ip.includes(search);
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const visibleLogs = filteredLogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="px-6 pt-4 pb-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Logs del Sistema
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitoreo de la actividad del sistema federado
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-sm font-medium">
          <HiDownload className="w-5 h-5" /> Exportar Logs
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 space-y-4">
        <input
          type="text"
          placeholder="Buscar en logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mt-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              <option value="Todos">Todos</option>
              <option value="Info">Info</option>
              <option value="Warning">Warning</option>
              <option value="Error">Error</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Desde:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 px-3 py-2 appearance-none rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hasta:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 px-3 py-2 appearance-none rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setPage(1)}
              className="w-full px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-medium"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 max-h-[410px]">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Módulo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mensaje</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {visibleLogs.map((log, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{log.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded-full font-medium text-xs ${typeColor[log.type]}`}>{log.type}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">{log.module}</td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">{log.message}</td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">{log.user}</td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">{log.ip}</td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">
                  <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                    <HiEye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <div className="inline-flex -space-x-px rounded-md shadow-sm">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 border text-sm font-medium ${
                  page === i + 1
                    ? "bg-indigo-500 text-white border-indigo-600"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
