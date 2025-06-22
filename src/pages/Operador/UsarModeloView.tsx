import { useState } from "react";
import { Sparkles, Activity } from "lucide-react";

const campos = [
  { label: "EDAD", type: "int" },
  { label: "ABORTOS", type: "int" },
  { label: "INFECCIONES DURANTE EL EMBARAZO", type: "select", options: ["ITU", "ITU SFV", "NO", "PIELONEFRITIS", "SFV", "SIFILIS URINARIA", "URINARIA", "URINARIA SFV"] },
  { label: "DIABETES", type: "select", options: ["SI", "NO"] },
  { label: "HIPERTENSION", type: "select", options: ["SI", "NO"] },
  { label: "EDAD GESTACIONAL", type: "string" },
  { label: "EMB MÚLTIPLES", type: "int" },
  { label: "PESO EN EL EMBARAZO", type: "float" },
  { label: "IMC PRE GESTACIONAL", type: "select", options: ["Bajo", "Elevado", "Normal"] },
  { label: "CPN", type: "int" },
  { label: "SANGRADO DEL I,II,III TRIMESTRE", type: "select", options: ["I T", "II T", "III T", "I,II T", "I,III T"] },
  { label: "TABAQUISMO", type: "select", options: ["SI", "NO"] },
  { label: "ALCOHOLISMO", type: "select", options: ["SI", "NO"] },
  {
    label: "NIV EDUCATIVO",
    type: "select",
    options: [
      "1 sec", "2 sec", "3sec", "4 sec", "5 sec", "6 prim", "inst comp",
      "inst incomp", "no", "prim comp", "sup comp", "sup univ",
      "univ comp", "univ imcomp", "univ incomp"
    ]
  },
  { label: "FORMULA OBSTETRICA", type: "string" }
];

const datosPrecargados: Record<string, string> = {
  "EDAD": "39",
  "ABORTOS": "0",
  "INFECCIONES DURANTE EL EMBARAZO": "URINARIA",
  "DIABETES": "NO",
  "HIPERTENSION": "NO",
  "EDAD GESTACIONAL": "39SMS",
  "EMB MÚLTIPLES": "0",
  "PESO EN EL EMBARAZO": "67",
  "IMC PRE GESTACIONAL": "Elevado",
  "CPN": "7",
  "SANGRADO DEL I,II,III TRIMESTRE": "II T",
  "TABAQUISMO": "NO",
  "ALCOHOLISMO": "NO",
  "NIV EDUCATIVO": "5 sec",
  "FORMULA OBSTETRICA": "G6P5015"
};

export default function UsarModeloView() {
  const [form, setForm] = useState<Record<string, string>>(() => {
    return campos.reduce((acc, { label }) => {
      acc[label] = "";
      return acc;
    }, {} as Record<string, string>);
  });

  const [resultado, setResultado] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-") {
      e.preventDefault();
    }
  };

  const handleSubmit = () => {
    const completado = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value || datosPrecargados[key] || ""])
    );

    setResultado(
      "Se tiene un 90% de confiabilidad de que el paciente tiene un riesgo alto.\nFactores más influyentes: Edad, Tensión, Glucosa.\nRecomendación: Se sugiere revisar al paciente."
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 text-gray-900 dark:text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="text-indigo-500" /> Usar Modelo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ingresa los valores de entrada para realizar una predicción segura y local.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campos.map(({ label, type, options }) => (
              <div key={label} className="flex flex-col">
                <label htmlFor={label} className="text-sm font-medium mb-1 truncate">
                  {label}
                </label>

                {type === "select" && options ? (
                  <select
                    name={label}
                    value={form[label]}
                    onChange={handleChange}
                    className="px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type === "int" || type === "float" ? "number" : "text"}
                    step={type === "float" ? "any" : undefined}
                    min={type === "int" || type === "float" ? "0" : undefined}
                    name={label}
                    value={form[label]}
                    onChange={handleChange}
                    onKeyDown={type === "int" || type === "float" ? handleKeyDown : undefined}
                    placeholder={`Ej. ${datosPrecargados[label] ?? "Ingresa valor"}`}
                    className="px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                )}
              </div>
            ))}

            <div className="col-span-1 sm:col-span-2 mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md flex items-center justify-center gap-2 transition"
              >
                <Activity className="w-4 h-4" /> Realizar predicción
              </button>
            </div>
          </form>
        </div>

        {resultado && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl border border-gray-300 dark:border-gray-700 shadow-md">
            <h2 className="font-semibold text-lg mb-2 text-indigo-600 dark:text-indigo-400">Resultado</h2>
            <p className="text-sm whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">
              {resultado}
            </p>
          </div>
        )}
      </div>

      <footer className="mt-10 text-sm text-gray-500 dark:text-gray-400 text-center">
        Los datos ingresados no se almacenan en la nube. Las predicciones se realizan localmente. El modelo de IA no
        reemplaza el criterio humano para evaluar pacientes.
      </footer>
    </main>
  );
}
