import { useEffect, useState } from "react";
import { HiDownload, HiEye } from "react-icons/hi";
import { Log } from "../../models/log";
import logService from "../../services/logService";

const typeColor: Record<string, string> = {
  Info: "bg-blue-100 text-blue-800",
  Warning: "bg-yellow-100 text-yellow-800",
  Error: "bg-red-100 text-red-700",
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export default function LogDelSistema() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await logService.getAllLogs();
        const formattedLogs = response.map((log: any) => {
          const date = new Date(log.timestamp);
          const timestamp = date.toLocaleString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });

          return {
            id: log.id,
            message: log.message,
            type: log.type,
            module: log.module,
            userName: log.userName,
            timestamp,
            ipaddress: log.ipaddress,
          };
        }).sort((a, b) => b.id - a.id);
        setLogs(formattedLogs);
      } catch (err) {
        console.error("Error al obtener logs:", err);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log: any) => {
    const matchesType = typeFilter === "Todos" || log.type === typeFilter;
    const matchesSearch =
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.ipaddress.includes(search);
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const visibleLogs = filteredLogs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  function getResponsivePages(totalPages: number, currentPage: number): (number | string)[] {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage + 2 < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }


  return (
    <div className="px-6 pt-4 pb-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Logs del Sistema</h1>
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
                  <span className={`px-3 py-1 rounded-full font-medium text-xs ${typeColor[capitalize(log.type)]}`}>{log.type}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">{log.module}</td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">{log.message}</td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">{log.userName}</td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300">{log.ipaddress}</td>
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
    <div className="flex flex-wrap items-center gap-1">
      {getResponsivePages(totalPages, page).map((p, i) => (
        <button
          key={i}
          disabled={p === '...'}
          onClick={() => typeof p === "number" && setPage(p)}
          className={`px-3 py-1 text-sm rounded-md border ${
            page === p
              ? "bg-indigo-500 text-white border-indigo-600"
              : typeof p === "number"
              ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              : "bg-transparent border-none text-gray-500 cursor-default"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  </div>
)}

    </div>
  );
}
