import { useState } from "react";
import { FileDown, Clipboard, ClipboardCheck } from "lucide-react";

type ConsentKey = "datos" | "docker" | "consentimiento";

const consentLabels: Record<ConsentKey, string> = {
  datos: "Cuento con el consentimiento de uso activo de los datos.",
  docker: "Tengo Docker actualmente instalado en mi ordenador.",
  consentimiento:
    "Reconozco que el uso y entrenamiento del modelo de inteligencia artificial no reemplaza el criterio humano para evaluar pacientes.",
};

export default function EntrenarModeloView() {
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [checked, setChecked] = useState<Record<ConsentKey, boolean>>({
    datos: true,
    docker: true,
    consentimiento: true,
  });

  const allChecked = Object.values(checked).every(Boolean);

  const [copiedDocker, setCopiedDocker] = useState(false);

  const handleDockerCopy = async () => {
    const dockerCommand =
      "docker run -p 8000:8000 -p 3000:3000 us-central1-docker.pkg.dev/graphic-brook-404722/flwr-client/medical-fl-app:latest";
    try {
      await navigator.clipboard.writeText(dockerCommand);
      setCopiedDocker(true);
      setTimeout(() => setCopiedDocker(false), 1500);
    } catch (error) {
      console.error("Error al copiar docker run:", error);
    }
  };

  const handleCheckboxChange = (key: ConsentKey) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">Entrenar Modelo</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Configura tu entorno y entrena tu modelo de forma segura.
        </p>
      </header>

      <section className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Pasos para iniciar el entrenamiento</h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            Abril terminal CMD o PowerShell
          </li>
          <li>
            Ingrese su código de invitación:
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <input
                value={codigoGenerado}
                onChange={(e) => setCodigoGenerado(e.target.value)}
                placeholder="Ej: ABC-XX-2xjkL8"
                className="w-full sm:w-1/2 px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm"
              />
            </div>
          </li>
          <li>
            Contenedor de entrenamiento:
            <div className="relative mt-2">
              <pre className="bg-black text-white p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                docker run -p 8000:8000 -p 3000:3000 us-central1-docker.pkg.dev/graphic-brook-404722/flwr-client/medical-fl-app:latest
              </pre>
              <button
                onClick={handleDockerCopy}
                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 p-1 rounded"
                title="Copiar comando Docker"
              >
                {copiedDocker ? (
                  <ClipboardCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <Clipboard className="w-4 h-4" />
                )}
              </button>
            </div>
          </li>
          <li>
            Accede a:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              http://localhost:3000
            </span>
          </li>
          {/* <li>
            El modelo base se descargará automáticamente tras ingresar el código.
          </li>
          <li>
            Sube tu dataset (.csv/.xlsx) y haz clic en "Iniciar entrenamiento".
          </li> */}
        </ol>
      </section>

      <section className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mt-8">
        <h2 className="text-lg font-semibold mb-4">Consentimientos requeridos</h2>
        <div className="space-y-4">
          {(Object.entries(checked) as [ConsentKey, boolean][]).map(([key]) => (
            <label key={key} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={checked[key]}
                onChange={() => handleCheckboxChange(key)}
                className="accent-indigo-600 w-5 h-5"
              />
              <span>{consentLabels[key]}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex justify-end mt-6">
        <button
          disabled={!allChecked}
          className={`px-6 py-2 text-white rounded flex items-center gap-2 transition-colors ${
            allChecked
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <FileDown className="w-4 h-4" /> Descargar Docker
        </button>
      </div>
    </main>
  );
}
