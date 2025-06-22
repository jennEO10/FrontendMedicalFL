import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Iteracion, MetricasByIteracion } from '../../../models/iteracion';
import iteracionService from '../../../services/iteracionService';

const OperadorDashboard = () => {
  const navigate = useNavigate();
  const [iteracion, setIteracion] = useState<Iteracion>({
       id: 0,
       iterationName: '',
       iterationNumber: '',
       startDate: '',
       finishDate: '',
       duration: '',
       metrics: '',
       state: 'Procesando',
       participantsQuantity: '',
       userIds: [],
       organizacionId: 0,
       idHyper:0,
       minUsuarios: 0,
       rondas: 0,
       tiempoLocal: 0,
       idInvitation: 0,
       codeInvitation: '',
       stateInvitation: 'ACTIVE'
     });
  const [metrica, setMetrica] = useState<MetricasByIteracion>({
       iterationId: 0,
       round: 0,
       accuracy: 0,
       precision: 0,
       recall: 0,
       f1score: 0,
       auc: 0,
       loss: 0
     });
  
  const obtenerUltimaIteracion = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      const ultimaIteracion = await iteracionService.obtenerUltimaIteracionPorUsuario(parseInt(userId));

      if (Array.isArray(ultimaIteracion) && ultimaIteracion.length > 0) {
        const ultima = ultimaIteracion.sort((a, b) => b.id - a.id)[0]; // ordena por id desc y toma la primera
        const ultimaIteracionByMetrica = await iteracionService.obtenerUltimaMetricaPorIteracion(ultima.id);
        setIteracion(ultima)
        setMetrica(ultimaIteracionByMetrica)
      }      
    } catch (error) {
      console.error('Error al obtener la última ronda', error);
    }
  }

  useEffect(() => {
    obtenerUltimaIteracion();
  }, [])

  const getEstadoColor = () => {
    if (iteracion.state === "Procesando") return "bg-green-600";
    if (iteracion.state === "Finalizado") return "bg-red-600";
    return "bg-gray-500";
  };

  const irAHistorico = () => {
    const ultimaIteracion = {
      id: 28,
      iterationName: "Iteración #28",
    };
    localStorage.setItem("iteracionSeleccionada", JSON.stringify(ultimaIteracion));
    navigate("/historico");
  };
  
  const irAReporte = () => {
    navigate("/view-reports");
  };
     
  return (
    <div className="p-6 sm:p-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Panel del Operador</h1>

      {/* Estado actual */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 md:mb-0">Estado actual</h2>
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md shadow transition"
            onClick={() => navigate("/model-train")}
          >
            Entrenar modelo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md dark:border-gray-700">
            <p className="font-medium">Estado de última ronda:</p>
            <span className={`inline-block mt-1 px-3 py-1 text-sm font-semibold text-white rounded-full ${getEstadoColor()}`}>
              { iteracion.state === "Procesando" || iteracion.state === "Finalizado" ? iteracion.state : "Cargando..." }
            </span>
          </div>

          <div className="p-4 border rounded-md dark:border-gray-700">
            <p className="font-medium">Disponibilidad del modelo:</p>
            <span className="inline-block mt-1 px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-full">
              Habilitado
            </span>
          </div>

          <div className="p-4 border rounded-md dark:border-gray-700">
            <p className="font-medium">Versión del modelo publicado:</p>
            <span className="inline-block mt-1 px-3 py-1 text-sm font-semibold text-white bg-gray-500 rounded-full">
              1
            </span>
          </div>
        </div>
      </section>

      {/* Métricas actuales */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Métricas actuales del modelo</h2>
          <button 
            onClick={irAHistorico}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md shadow transition"
          >
            Ver histórico
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Precision</p>
            <p className="text-lg font-bold">{ metrica.precision ?? 0 }%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Recall</p>
            <p className="text-lg font-bold">{ metrica.recall ?? 0 }%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">F1 Score</p>
            <p className="text-lg font-bold">{ metrica.f1score ?? 0 }%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
            <p className="text-lg font-bold">{ metrica.accuracy ?? 0 }%</p>
          </div>
        </div>
      </section>

      {/* Historial */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Historial de últimas predicciones</h2>
          <button 
            onClick={irAReporte}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md shadow transition"
          >
            Ver más
          </button>
        </div>

        <div className="overflow-auto rounded-md border dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Resultado</th>
                <th className="px-4 py-3 font-semibold">% de Confiabilidad</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              <tr className="border-t dark:border-gray-700">
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">23/03/2025</td>
                <td className="px-4 py-3">Riesgo Alto</td>
                <td className="px-4 py-3">90%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default OperadorDashboard;
