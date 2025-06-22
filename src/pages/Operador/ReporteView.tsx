import { useState } from "react";
import { Download } from "lucide-react";

export default function ReportesView() {
  const [reportes] = useState([
    { id: 1, fecha: "23/03/2025", resultado: "Riesgo Alto", confianza: "90%" },
    { id: 2, fecha: "24/03/2025", resultado: "Riesgo Bajo", confianza: "75%" },
    { id: 3, fecha: "25/03/2025", resultado: "Riesgo Medio", confianza: "82%" },
    { id: 4, fecha: "26/03/2025", resultado: "Riesgo Alto", confianza: "95%" },
    { id: 5, fecha: "27/03/2025", resultado: "Riesgo Medio", confianza: "88%" },
    { id: 6, fecha: "28/03/2025", resultado: "Riesgo Bajo", confianza: "70%" },
  ]);

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["ID,Fecha,Resultado,Confianza"].concat(
        reportes.map(r => `${r.id},${r.fecha},${r.resultado},${r.confianza}`)
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reportes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="p-6 md:p-10 max-w-6xl mx-auto text-gray-900 dark:text-white">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reporte de Predicciones</h1>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md"
        >
          <Download className="w-4 h-4" /> Descargar CSV
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
                <td className="px-6 py-3">{r.fecha}</td>
                <td className="px-6 py-3">{r.resultado}</td>
                <td className="px-6 py-3">{r.confianza}</td>
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
