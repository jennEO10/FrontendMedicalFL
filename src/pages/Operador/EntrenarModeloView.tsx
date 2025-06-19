import { useEffect, useState } from "react";
import { FileDown, Clipboard, ClipboardCheck } from "lucide-react";
import invitacionService from "../../services/invitacionService";
import { Invitacion } from "../../models/invitacion";

type ConsentKey = "datos" | "docker" | "consentimiento";

const consentLabels: Record<ConsentKey, string> = {
  datos: "Cuento con el consentimiento de uso activo de los datos.",
  docker: "Tengo Docker actualmente instalado en mi ordenador.",
  consentimiento:
    "Reconozco que el uso y entrenamiento del modelo de inteligencia artificial no reemplaza el criterio humano para evaluar pacientes.",
};

export default function EntrenarModeloView() {
  const [codigoInvitacion, setCodigoInvitacion] = useState<Invitacion>({
    id: 0,
    code: "",
    state: "",
    iterationId: 0,
    userId: 0
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [checked, setChecked] = useState<Record<ConsentKey, boolean>>({
    datos: true,
    docker: true,
    consentimiento: true,
  });

  const allChecked = Object.values(checked).every(Boolean);

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

  const handleCodeCopy = async () => {
    try {
      await navigator.clipboard.writeText(codigoInvitacion.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1500);
    } catch (error) {
      console.error("Error al copiar código:", error);
    }
  };

  const handleCheckboxChange = (key: ConsentKey) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const obtenerInvitacionUser = async () => {
    const id = parseInt(sessionStorage.getItem("userId") ?? "0");

    try {
      const response = await invitacionService.getInvitationForUser(id);
      console.log("Lista de invitaciones del usuario: ", response);

      if (Array.isArray(response) && response.length > 0) {
          // 1. Ordenar por id de forma ascendente
          const ordenado = [...response].sort((a, b) => a.id - b.id);

          // 2. Obtener el último (mayor id)
          const ultimoRegistro = ordenado.at(-1); // o ordenado[ordenado.length - 1]

          // 3. Verificar estadoxx
          if (ultimoRegistro?.state === "ACTIVE") {
            setCodigoInvitacion(ultimoRegistro);
          } else {
            setCodigoInvitacion({
              id: 0,
              code: "",
              state: "",
              iterationId: 0,
              userId: 0});
          }
      } else {
        setCodigoInvitacion({
          id: 0,
          code: "",
          state: "",
          iterationId: 0,
          userId: 0});
      }
    } catch (error) {
      console.error("Error al obtener la invitación por usuario: ", error);
      setCodigoInvitacion({
        id: 0,
        code: "",
        state: "",
        iterationId: 0,
        userId: 0});
    }
  };

  useEffect(() => {
    obtenerInvitacionUser();
  }, []);

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
          <li>Abrir terminal CMD o PowerShell</li>
          <li>
            Su código de invitación es:
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="relative w-full sm:w-1/2">
                <input
                  value={codigoInvitacion.code}
                  onChange={(e) => setCodigoGenerado(e.target.value)}
                  placeholder={!codigoInvitacion.code ? "No cuenta con código de invitación o está expirado" : undefined}
                  className="w-full px-3 py-2 pr-10 rounded border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm cursor-not-allowed"
                  disabled
                />
                {codigoInvitacion.code !== "" && (<button
                  onClick={handleCodeCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  title="Copiar código"
                >
                  {copiedCode ? (
                    <ClipboardCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clipboard className="w-4 h-4" />
                  )}
                </button>)}
              </div>
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
          <li>El modelo base se descargará automáticamente.</li>
          <li>Sube tu dataset (.csv/.xlsx) y haz clic en "Iniciar entrenamiento".</li>
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

      {/* <div className="flex justify-end mt-6">
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
      </div> */}
    </main>
  );
}
