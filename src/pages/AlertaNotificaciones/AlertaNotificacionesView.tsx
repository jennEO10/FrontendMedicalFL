import { FaBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Alerta } from "../../models/aletas";
import alertaService from "../../services/alertaService";

export default function AlertaNotificacionesView() {
  // const [alerts] = useState([
  //   { tipo: "⚠️", mensaje: "Alerta de seguridad: Acceso inusual detectado", timestamp: "Hace 30 minutos" },
  //   { tipo: "👤", mensaje: "Usuario nuevo creado: maria.lopez@hospital.org", timestamp: "Hace 2 horas" },
  //   { tipo: "📊", mensaje: "Organización \"Hospital Norte\" agregada", timestamp: "Hace 3 horas" },
  //   { tipo: "✅", mensaje: "Iteración #28 completada", timestamp: "Hace 5 horas" },
  //   { tipo: "📄", mensaje: "Nuevo documento subido al sistema", timestamp: "Hace 10 horas" },
  //   { tipo: "🔄", mensaje: "Actualización automática del sistema completada", timestamp: "Hace 12 horas" },
  //   { tipo: "🔔", mensaje: "Notificación de revisión periódica activada", timestamp: "Hace 1 día" },
  //   { tipo: "📥", mensaje: "Nuevo backup generado correctamente", timestamp: "Hace 1 día" },
  //   { tipo: "🔐", mensaje: "Cambio de contraseña exitoso para admin01", timestamp: "Hace 1 día" },
  //   { tipo: "💾", mensaje: "Base de datos sincronizada con éxito", timestamp: "Hace 2 días" },
  //   { tipo: "🚨", mensaje: "Intento fallido de acceso externo bloqueado", timestamp: "Hace 2 días" },
  //   { tipo: "👨‍⚕️", mensaje: "Perfil de usuario médico actualizado", timestamp: "Hace 2 días" },
  //   { tipo: "📦", mensaje: "Nuevo lote de vacunas registrado", timestamp: "Hace 3 días" },
  //   { tipo: "🛠️", mensaje: "Mantenimiento programado finalizado", timestamp: "Hace 3 días" },
  //   { tipo: "🌐", mensaje: "Configuración de red actualizada", timestamp: "Hace 4 días" },
  //   { tipo: "📬", mensaje: "Correo institucional configurado exitosamente", timestamp: "Hace 4 días" },
  //   { tipo: "🗃️", mensaje: "Archivo histórico movido a backup", timestamp: "Hace 5 días" },
  //   { tipo: "🧪", mensaje: "Nuevo análisis clínico agregado", timestamp: "Hace 6 días" },
  //   { tipo: "👥", mensaje: "Grupo de usuarios sincronizado", timestamp: "Hace 6 días" },
  //   { tipo: "📊", mensaje: "Reporte mensual generado automáticamente", timestamp: "Hace 7 días" },
  //   { tipo: "🕵️", mensaje: "Revisión de logs de seguridad completada", timestamp: "Hace 7 días" },
  //   { tipo: "🧾", mensaje: "Factura de proveedor cargada", timestamp: "Hace 8 días" },
  //   { tipo: "🔍", mensaje: "Auditoría interna iniciada", timestamp: "Hace 8 días" },
  //   { tipo: "📋", mensaje: "Nuevo protocolo de emergencia publicado", timestamp: "Hace 9 días" },
  //   { tipo: "🏥", mensaje: "Se agregó una nueva sede hospitalaria", timestamp: "Hace 10 días" },
  //   { tipo: "🛎️", mensaje: "Se notificó cambio de política de seguridad", timestamp: "Hace 11 días" },
  //   { tipo: "📈", mensaje: "Incremento de visitas registrado", timestamp: "Hace 12 días" },
  //   { tipo: "⚙️", mensaje: "Configuración avanzada aplicada", timestamp: "Hace 13 días" },
  //   { tipo: "🧑‍💼", mensaje: "Se asignó nuevo rol a usuario invitado", timestamp: "Hace 14 días" },
  //   { tipo: "🔄", mensaje: "Se reinició servicio de autenticación", timestamp: "Hace 15 días" },
  // ]);

  const [alerts, setAlerts] = useState<Alerta[]>([]);

  const getAllAlerts = async () => {
    try {
      const response = (await alertaService.getAllAlerts()).sort((a, b) => b.id - a.id);
      setAlerts(response);
    } catch (error) {
      console.error("Error al obtener las alertas:",error)
    }
  }

  useEffect(() => {
    getAllAlerts()
  }, [])

  function formatearTiempoRelativo(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const segundos = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);
    const años = Math.floor(meses / 12);

    if (segundos < 60) return "Hace unos segundos";
    if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? "s" : ""}`;
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? "s" : ""}`;
    if (dias < 30) return `Hace ${dias} día${dias > 1 ? "s" : ""}`;
    if (meses < 12) return `Hace ${meses} mes${meses > 1 ? "es" : ""}`;
    return `Hace ${años} año${años > 1 ? "s" : ""}`;
  }

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <FaBell className="text-indigo-500" /> Alertas de Seguridad
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Muestra todas las notificaciones de cambios o movimientos en el sistema
        </p>
        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 rounded-md transition-colors"
            >
              <div className="flex flex-row md:flex-row items-start md:items-center gap-3 w-full">
                <span className="text-lg md:text-xl">{alert.tipo}</span>

                <div className="flex flex-col md:flex-row md:items-center md:gap-2 w-full">
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    {alert.mensaje}
                  </p>

                  {/* Solo visible en mobile */}
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 md:hidden">
                    {formatearTiempoRelativo(alert.timestamp)}
                  </span>
                </div>
              </div>

              {/* Solo visible en desktop */}
              <span className="hidden md:inline text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap mt-1 md:mt-0">
                {formatearTiempoRelativo(alert.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
