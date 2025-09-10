import { useState } from "react";
import { Sparkles, Activity, Lock } from "lucide-react";
import prediccionService from "../../services/prediccionService";

// • Bajo (<20%): Riesgo bajo de parto prematuro. Seguimiento habitual.
// • Moderado (20–50%): Riesgo moderado. Considerar evaluación adicional.
// • Alto (>50%): Riesgo elevado. Requiere seguimiento clínico intensivo.

const campos = [
  { label: "EDAD", name: "edad", type: "int" },
  { label: "ABORTOS", name: "abortos", type: "int" },
  {
    label: "INFECCIONES DURANTE EL EMBARAZO",
    name: "infecciones_durante_el_embarazo",
    type: "select",
    options: [
      "ITU",
      "ITU SFV",
      "NO",
      "PIELONEFRITIS",
      "SFV",
      "SIFILIS URINARIA",
      "URINARIA",
      "URINARIA SFV",
    ],
  },
  {
    label: "DIABETES",
    name: "diabetes",
    type: "select",
    options: ["SI", "NO"],
  },
  {
    label: "HIPERTENSION",
    name: "hipertencion",
    type: "select",
    options: ["SI", "NO"],
  },
  { label: "EDAD GESTACIONAL", name: "eg", type: "string" },
  { label: "EMB MÚLTIPLES", name: "emb_multiples", type: "int" },
  { label: "PESO EN EL EMBARAZO", name: "peso_en_el_embarazo", type: "float" },
  {
    label: "IMC PRE GESTACIONAL",
    name: "imc_pre_gestacional",
    type: "select",
    options: ["Bajo", "Elevado", "Normal"],
  },
  { label: "CPN", name: "cpn", type: "int" },
  {
    label: "SANGRADO DEL I,II,III TRIMESTRE",
    name: "sangrado_del_i_ii_iii_trimestre",
    type: "select",
    options: ["I T", "II T", "III T", "I,II T", "I,III T"],
  },
  {
    label: "TABAQUISMO",
    name: "tabaquismo",
    type: "select",
    options: ["SI", "NO"],
  },
  {
    label: "ALCOHOLISMO",
    name: "alcoholismo",
    type: "select",
    options: ["SI", "NO"],
  },
  {
    label: "NIV EDUCATIVO",
    name: "niv_educativo",
    type: "select",
    options: [
      "1 sec",
      "2 sec",
      "3sec",
      "4 sec",
      "5 sec",
      "6 prim",
      "inst comp",
      "inst incomp",
      "no",
      "prim comp",
      "sup comp",
      "sup univ",
      "univ comp",
      "univ imcomp",
      "univ incomp",
    ],
  },
  { label: "FORMULA OBSTETRICA", name: "formula_obstetrica", type: "string" },
];

const datosPrecargados: Record<string, string> = {
  EDAD: "39",
  ABORTOS: "0",
  "INFECCIONES DURANTE EL EMBARAZO": "URINARIA",
  DIABETES: "NO",
  HIPERTENSION: "NO",
  "EDAD GESTACIONAL": "39SMS",
  "EMB MÚLTIPLES": "0",
  "PESO EN EL EMBARAZO": "67",
  "IMC PRE GESTACIONAL": "Elevado",
  CPN: "7",
  "SANGRADO DEL I,II,III TRIMESTRE": "II T",
  TABAQUISMO: "NO",
  ALCOHOLISMO: "NO",
  "NIV EDUCATIVO": "5 sec",
  "FORMULA OBSTETRICA": "G6P5015",
};

export default function UsarModeloView() {
  const [form, setForm] = useState<Record<string, string>>(() => {
    return campos.reduce((acc, { name }) => {
      acc[name] = "";
      return acc;
    }, {} as Record<string, string>);
  });

  const [resultado, setResultado] = useState<string | null>(null);

  const isFormValid = campos.every(({ name }) => form[name].trim() !== "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-") {
      e.preventDefault();
    }
  };

  const handleSubmit = async () => {
    const completado = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [
        key,
        value || datosPrecargados[key] || "",
      ])
    );

    // console.log("Predicción enviada:", completado);

    try {
      const response = await prediccionService.crearInferencia(completado);
      // console.log("Respuesta al crear la inferencia: ", response);

      const porcentaje = Math.round((response as number) * 10000) / 100; // ejemplo: 0.47277 => 47.28

      let mensaje = "";

      if (porcentaje < 20) {
        mensaje = `Riesgo bajo de parto prematuro (${porcentaje}%). Continuar con controles prenatales de rutina. No se requieren medidas adicionales por el momento.`;
      } else if (porcentaje >= 20 && porcentaje <= 50) {
        mensaje = `Riesgo moderado de parto prematuro (${porcentaje}%). Se sugiere control clínico más frecuente, vigilancia obstétrica y considerar pruebas complementarias.`;
      } else {
        mensaje = `Riesgo alto de parto prematuro (${porcentaje}%). Se recomienda intervención médica inmediata, seguimiento especializado y evaluación obstétrica detallada.`;
      }

      setResultado(mensaje);
    } catch (error) {
      console.error("Error al crear la inferencia: ", error);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 text-gray-900 dark:text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="text-indigo-500" /> Usar Modelo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ingresa los valores de entrada para realizar una predicción segura y
          local.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campos.map(({ label, name, type, options }) => (
              <div key={name} className="flex flex-col">
                <label
                  htmlFor={name}
                  className="text-sm font-medium mb-1 truncate"
                >
                  {label}
                </label>

                {type === "select" && options ? (
                  <select
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={
                      type === "int" || type === "float" ? "number" : "text"
                    }
                    step={type === "float" ? "any" : undefined}
                    min={type === "int" || type === "float" ? "0" : undefined}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    onKeyDown={
                      type === "int" || type === "float"
                        ? handleKeyDown
                        : undefined
                    }
                    placeholder={`Ej. ${
                      datosPrecargados[label] ?? "Ingresa valor"
                    }`}
                    className="px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                )}
              </div>
            ))}

            <div className="col-span-1 sm:col-span-2 mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid}
                title={
                  !isFormValid
                    ? "Completa todos los campos para habilitar el botón"
                    : ""
                }
                className={`w-full font-semibold py-2 rounded-md flex items-center justify-center gap-2 transition
                  ${
                    isFormValid
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-400 cursor-not-allowed text-gray-100"
                  }`}
              >
                {!isFormValid ? (
                  <>
                    <Lock className="w-4 h-4" /> Completa todos los campos
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4" /> Realizar predicción
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {resultado && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl border border-gray-300 dark:border-gray-700 shadow-md">
            <h2 className="font-semibold text-xl mb-2 text-indigo-600 dark:text-indigo-400">
              Resultado
            </h2>
            <p className="text-base whitespace-pre-line leading-relaxed text-justify text-gray-800 dark:text-gray-300">
              {resultado}
            </p>
          </div>
        )}
      </div>

      <footer className="mt-10 text-sm text-gray-500 dark:text-gray-400 text-center">
        Los datos ingresados no se almacenan en la nube. Las predicciones se
        realizan localmente. El modelo de IA no reemplaza el criterio humano
        para evaluar pacientes.
      </footer>
    </main>
  );
}
