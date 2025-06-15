import { useState } from "react";
import { Sparkles, Activity } from "lucide-react";

export default function UsarModeloView() {
  const [form, setForm] = useState({
    feature1: "",
    feature2: "",
    feature3: "",
    feature4: "",
  });
  const [resultado, setResultado] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setResultado(
      "Se tiene un 90% de confiabilidad de que el paciente tiene un riesgo alto.\nFactores más influyentes: Edad, Tensión, Glucosa.\nRecomendación: Se sugiere revisar al paciente."
    );
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 text-gray-900 dark:text-white">
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
          <form className="space-y-4">
            {Object.entries(form).map(([name, value], i) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium mb-1">
                  Característica {i + 1}
                </label>
                <input
                  name={name}
                  value={value}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ingresa valor"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" /> Realizar predicción
            </button>
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

      <footer className="mt-10 text-sm text-gray-500 dark:text-gray-400">
        Los datos ingresados no se almacenan en la nube. Las predicciones se realizan localmente. El modelo de IA no
        reemplaza el criterio humano para evaluar pacientes.
      </footer>
    </main>
  );
}
