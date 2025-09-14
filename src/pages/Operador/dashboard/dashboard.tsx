import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Iteracion, MetricasByIteracion } from "../../../models/iteracion";
import iteracionService from "../../../services/iteracionService";
import { Prediccion } from "../../../models/prediccion";
import prediccionService from "../../../services/prediccionService";
import { useRoleGuard } from "../../../hooks/useRoleGuard";
import LoadingScreen from "../../../components/common/LoadingScreen";
import { getLastMetrics } from "../../../api/iteracionesApi";

const OperadorDashboard = () => {
  const navigate = useNavigate();
  const { isLoading, hasAccess } = useRoleGuard({ requiredRole: "operator" });
  const [iteracion, setIteracion] = useState<Iteracion>({
    id: 0,
    iterationName: "",
    iterationNumber: "",
    startDate: "",
    finishDate: "",
    duration: "",
    metrics: "",
    state: "Procesando",
    participantsQuantity: "",
    userIds: [],
    organizacionId: 0,
    idHyper: 0,
    minUsuarios: 0,
    rondas: 0,
    tiempoLocal: 0,
    idInvitation: 0,
    codeInvitation: "",
    stateInvitation: "ACTIVE",
  });
  const [metrica, setMetrica] = useState<MetricasByIteracion>({
    iterationId: 0,
    round: 0,
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1score: 0,
    auc: 0,
    loss: 0,
  });

  const [reportes, setReportes] = useState<Prediccion[]>([]);
  const [hasMetrics, setHasMetrics] = useState<boolean>(true);

  const getPrediccionsAll = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        return;
      }

      const response = await prediccionService.getPredictionsByUser(userId);

      const formatted = response
        .sort((a, b) => b.id - a.id) // orden descendente por id
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

      setReportes(formatted.slice(0, 5));
    } catch (error) {
      // Error al obtener las predicciones
    }
  };

  const obtenerUltimaIteracion = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      const ultimaIteracion =
        await iteracionService.obtenerUltimaIteracionPorUsuario(
          parseInt(userId)
        );

      if (Array.isArray(ultimaIteracion) && ultimaIteracion.length > 0) {
        const ultima = ultimaIteracion.sort((a, b) => b.id - a.id)[0];
        setIteracion(ultima);
      }
    } catch (error) {
      // Error al obtener la última iteración
    }
  };

  const obtenerMetricasActuales = async () => {
    try {
      const metricas = await getLastMetrics();

      if (Array.isArray(metricas) && metricas.length > 0) {
        // Ordenar por iterationId descendente y luego por round descendente
        const metricasOrdenadas = metricas.sort((a, b) => {
          if (a.iterationId !== b.iterationId) {
            return b.iterationId - a.iterationId; // Iteración más reciente primero
          }
          return b.round - a.round; // Ronda más reciente primero
        });

        const ultimaMetrica = metricasOrdenadas[0];

        // Transforma para que coincida con tu interfaz
        const metricaTransformada = {
          iterationId: ultimaMetrica.iterationId,
          round: ultimaMetrica.round,
          accuracy: ultimaMetrica.accuracy,
          precision: ultimaMetrica.precision,
          recall: ultimaMetrica.recall,
          f1score: (ultimaMetrica as any).f1_score || ultimaMetrica.f1score,
          auc: ultimaMetrica.auc,
          loss: ultimaMetrica.loss,
          userId: ultimaMetrica.userId,
        };

        setMetrica(metricaTransformada);
        setHasMetrics(true);
      } else {
        setHasMetrics(false);
      }
    } catch (error) {
      console.error("Error al obtener métricas:", error);
      setHasMetrics(false);
    }
  };

  useEffect(() => {
    obtenerUltimaIteracion();
    obtenerMetricasActuales();
    getPrediccionsAll();
  }, []);

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
    localStorage.setItem(
      "iteracionSeleccionada",
      JSON.stringify(ultimaIteracion)
    );
    navigate("/historico");
  };

  const irAReporte = () => {
    navigate("/view-reports");
  };

  // Mostrar loading mientras se verifica el token y el rol
  if (isLoading) {
    return <LoadingScreen message="Inicializando sistema..." />;
  }

  // Si no tiene acceso, redirigir al dashboard del administrador
  if (!hasAccess) {
    window.location.href = "/dash-admin";
    return <LoadingScreen message="Redirigiendo..." />;
  }

  return (
    <div className="p-6 sm:p-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Panel de Usuario</h1>

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
            <span
              className={`inline-block mt-1 px-3 py-1 text-sm font-semibold text-white rounded-full ${getEstadoColor()}`}
            >
              {iteracion.state === "Procesando" ||
              iteracion.state === "Finalizado"
                ? iteracion.state
                : "Cargando..."}
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
          <h2 className="text-xl font-semibold">
            Métricas actuales del modelo
          </h2>
          <button
            onClick={irAHistorico}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md shadow transition"
          >
            Ver histórico
          </button>
        </div>

        {hasMetrics ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Precision
              </p>
              <p className="text-lg font-bold">
                {Math.round((metrica.precision ?? 0) * 10000) / 100}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recall</p>
              <p className="text-lg font-bold">
                {Math.round((metrica.recall ?? 0) * 10000) / 100}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                F1 Score
              </p>
              <p className="text-lg font-bold">
                {Math.round((metrica.f1score ?? 0) * 10000) / 100}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Accuracy
              </p>
              <p className="text-lg font-bold">
                {Math.round((metrica.accuracy ?? 0) * 10000) / 100}%
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No hay métricas disponibles
            </p>
          </div>
        )}
      </section>

      {/* Historial */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Historial de últimas predicciones
          </h2>
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
              {reportes.map((reporte) => (
                <tr key={reporte.id} className="border-t dark:border-gray-700">
                  <td className="px-4 py-3">{reporte.id}</td>
                  <td className="px-4 py-3">{reporte.timestamp}</td>
                  <td className="px-4 py-3">{reporte.riskResult}</td>
                  <td className="px-4 py-3">
                    {(reporte.probability * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default OperadorDashboard;
