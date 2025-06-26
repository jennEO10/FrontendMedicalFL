import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Prediccion } from "../../models/prediccion";
import prediccionService from "../../services/prediccionService";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function ReportesView() {
  // const [reportes] = useState([
  //   { id: 1, fecha: "23/03/2025", resultado: "Riesgo Alto", confianza: "90%" },
  //   { id: 2, fecha: "24/03/2025", resultado: "Riesgo Bajo", confianza: "75%" },
  //   { id: 3, fecha: "25/03/2025", resultado: "Riesgo Medio", confianza: "82%" },
  //   { id: 4, fecha: "26/03/2025", resultado: "Riesgo Alto", confianza: "95%" },
  //   { id: 5, fecha: "27/03/2025", resultado: "Riesgo Medio", confianza: "88%" },
  //   { id: 6, fecha: "28/03/2025", resultado: "Riesgo Bajo", confianza: "70%" },
  // ]);

  const [reportes, setReportes] = useState<Prediccion[]>([]);

  const getPrediccionsAll = async () => {
    try {
      const response = await prediccionService.getAllPredictions();

      const formatted = response
        .sort((a, b) => a.id - b.id) // orden descendente por id
        .map((r) => {
          const date = new Date(r.timestamp);
          const formattedDate = date.toLocaleString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });

          return {
            ...r,
            timestamp: formattedDate,
          };
        });

        console.log("Reporte formateado:", formatted)

      setReportes(formatted);
    } catch (error) {
      console.error("Error al obtener las predicciones:", error);
    }
  };


  useEffect(() => {
    getPrediccionsAll()
  }, [])

  const handleDownloadExcel = () => {
    const data = reportes.map((r) => ({
      ID: r.id,
      Fecha: r.timestamp,
      Resultado: r.riskResult,
      "Porcentaje de confiabilidad": `${(r.probability * 100).toFixed(2)}%`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    // 🧠 Autoajustar ancho de columnas
    const columnWidths = Object.keys(data[0]).map((key) => {
      const maxLength = data.reduce((max, item) => {
        const value = (item as any)[key] ? (item as any)[key].toString() : "";
        return Math.max(max, value.length);
      }, key.length);
      return { wch: maxLength + 2 }; // +2 para margen
    });

    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "reporte-predicciones.xlsx");
  };

  return (
    <main className="p-6 md:p-10 max-w-6xl mx-auto text-gray-900 dark:text-white">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reporte de Predicciones</h1>
        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md"
        >
          <Download className="w-4 h-4" /> Descargar Excel
        </button>
      </header>

      <div className="overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 max-h-[500px]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
            <tr className="text-left">
              <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">ID</th>
              <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Fecha</th>
              <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Resultado</th>
              <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Porcentaje de confiabilidad</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((r) => (
              <tr key={r.id} className="even:bg-gray-50 dark:even:bg-gray-900">
                <td className="px-6 py-3">{r.id}</td>
                <td className="px-6 py-3">{r.timestamp}</td>
                <td className="px-6 py-3">{r.riskResult}</td>
                <td className="px-6 py-3">{(r.probability * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="text-xs text-gray-500 dark:text-gray-400 mt-6">
        Los datos ingresados no se almacenan en la nube. Las predicciones se realizan utilizando modelos previamente entrenados. Toda acción realizada con información médica debe contar con el consentimiento de la persona. El modelo de inteligencia artificial no reemplaza las labores del personal médico.
      </footer>
    </main>
  );
}
