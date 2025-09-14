// Configuración de tiempos de inactividad
export const INACTIVITY_CONFIG = {
  WARNING_TIME: 60000, // 1 minuto
  LOGOUT_TIME: 600000, // 10 minutos
};

// Función para obtener la configuración actual
export const getCurrentInactivityConfig = () => {
  return INACTIVITY_CONFIG;
};
