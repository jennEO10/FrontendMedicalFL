import { FaBell } from "react-icons/fa";
import { useState } from "react";

export default function AlertaNotificacionesView() {
  const [alerts] = useState([
    { type: "⚠️", message: "Alerta de seguridad: Acceso inusual detectado", time: "Hace 30 minutos" },
    { type: "👤", message: "Usuario nuevo creado: maria.lopez@hospital.org", time: "Hace 2 horas" },
    { type: "📊", message: "Organización \"Hospital Norte\" agregada", time: "Hace 3 horas" },
    { type: "✅", message: "Iteración #28 completada", time: "Hace 5 horas" },
    { type: "📄", message: "Nuevo documento subido al sistema", time: "Hace 10 horas" },
    { type: "🔄", message: "Actualización automática del sistema completada", time: "Hace 12 horas" },
    { type: "🔔", message: "Notificación de revisión periódica activada", time: "Hace 1 día" },
    { type: "📥", message: "Nuevo backup generado correctamente", time: "Hace 1 día" },
    { type: "🔐", message: "Cambio de contraseña exitoso para admin01", time: "Hace 1 día" },
    { type: "💾", message: "Base de datos sincronizada con éxito", time: "Hace 2 días" },
    { type: "🚨", message: "Intento fallido de acceso externo bloqueado", time: "Hace 2 días" },
    { type: "👨‍⚕️", message: "Perfil de usuario médico actualizado", time: "Hace 2 días" },
    { type: "📦", message: "Nuevo lote de vacunas registrado", time: "Hace 3 días" },
    { type: "🛠️", message: "Mantenimiento programado finalizado", time: "Hace 3 días" },
    { type: "🌐", message: "Configuración de red actualizada", time: "Hace 4 días" },
    { type: "📬", message: "Correo institucional configurado exitosamente", time: "Hace 4 días" },
    { type: "🗃️", message: "Archivo histórico movido a backup", time: "Hace 5 días" },
    { type: "🧪", message: "Nuevo análisis clínico agregado", time: "Hace 6 días" },
    { type: "👥", message: "Grupo de usuarios sincronizado", time: "Hace 6 días" },
    { type: "📊", message: "Reporte mensual generado automáticamente", time: "Hace 7 días" },
    { type: "🕵️", message: "Revisión de logs de seguridad completada", time: "Hace 7 días" },
    { type: "🧾", message: "Factura de proveedor cargada", time: "Hace 8 días" },
    { type: "🔍", message: "Auditoría interna iniciada", time: "Hace 8 días" },
    { type: "📋", message: "Nuevo protocolo de emergencia publicado", time: "Hace 9 días" },
    { type: "🏥", message: "Se agregó una nueva sede hospitalaria", time: "Hace 10 días" },
    { type: "🛎️", message: "Se notificó cambio de política de seguridad", time: "Hace 11 días" },
    { type: "📈", message: "Incremento de visitas registrado", time: "Hace 12 días" },
    { type: "⚙️", message: "Configuración avanzada aplicada", time: "Hace 13 días" },
    { type: "🧑‍💼", message: "Se asignó nuevo rol a usuario invitado", time: "Hace 14 días" },
    { type: "🔄", message: "Se reinició servicio de autenticación", time: "Hace 15 días" },
  ]);

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
              className="flex justify-between items-start py-4 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 rounded-md transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg md:text-xl">{alert.type}</span>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                  {alert.message}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap mt-1 md:mt-0">
                {alert.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
