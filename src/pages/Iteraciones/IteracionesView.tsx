import { useState, useEffect } from 'react';

const dataEjemplo = [
  {
    id: 1,
    organizacion: 'Hospital Universitario',
    estado: 'Procesando',
    progreso: 85,
    tiempo: '1h 23m',
    datos: 8450,
  },
  {
    id: 2,
    organizacion: 'Clínica San Rafael',
    estado: 'Procesando',
    progreso: 70,
    tiempo: '1h 23m',
    datos: 5220,
  },
  {
    id: 3,
    organizacion: 'Hospital Norte',
    estado: 'Procesando',
    progreso: 60,
    tiempo: '1h 23m',
    datos: 6780,
  },
  {
    id: 4,
    organizacion: 'Centro Médico Regional',
    estado: 'Inactivo',
    progreso: 0,
    tiempo: '-',
    datos: 0,
  },
  {
    id: 5,
    organizacion: 'Clínica Especializada',
    estado: 'Procesando',
    progreso: 75,
    tiempo: '1h 23m',
    datos: 4120,
  },
];

export default function IteracionesView() {
  const participantes = dataEjemplo;

//   useEffect(() => {
//     setParticipantes(dataEjemplo);
//   }, []);

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-2">Gestión de Iteraciones</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Administra las iteraciones del modelo de aprendizaje federado
      </p>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-3 text-left font-semibold">Organización</th>
              <th className="px-4 py-3 text-left font-semibold">Estado</th>
              <th className="px-4 py-3 text-left font-semibold">Progreso</th>
              <th className="px-4 py-3 text-left font-semibold">Tiempo Transcurrido</th>
              <th className="px-4 py-3 text-left font-semibold">Datos Procesados</th>
              <th className="px-4 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {participantes.map((p) => (
              <tr key={p.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3">{p.organizacion}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    p.estado === 'Procesando'
                      ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-100'
                  }`}>
                    {p.estado}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${p.progreso}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{p.progreso}%</span>
                </td>
                <td className="px-4 py-3">{p.tiempo}</td>
                <td className="px-4 py-3">{p.datos.toLocaleString()} registros</td>
                <td className="px-4 py-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Ver detalles"
                  >
                    🔍
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6 gap-4">
        <button className="px-4 py-2 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800">
          Crear Iteración
        </button>
        <button className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700">
          Ver Métricas
        </button>
      </div>
    </div>
  );
}