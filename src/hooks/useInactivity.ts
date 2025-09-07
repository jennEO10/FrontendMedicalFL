import { useEffect, useRef, useCallback } from "react";

interface UseInactivityOptions {
  warningTime: number; // Tiempo en ms para mostrar advertencia (1 min = 60000ms para pruebas)
  logoutTime: number; // Tiempo en ms para cerrar sesión (2 min = 120000ms para pruebas)
  // logoutTime: number; // Tiempo en ms para cerrar sesión (1 hora = 3600000ms para producción)
  onWarning: () => void;
  onLogout: () => void;
  enabled?: boolean; // Nueva propiedad para habilitar/deshabilitar el hook
}

export const useInactivity = ({
  warningTime,
  logoutTime,
  onWarning,
  onLogout,
  enabled = true, // Por defecto habilitado
}: UseInactivityOptions) => {
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Función para resetear los timers
  const resetTimers = useCallback(() => {
    if (!enabled) return; // No hacer nada si está deshabilitado

    lastActivityRef.current = Date.now();

    // Limpiar timers existentes
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }

    // Configurar nuevo timer de advertencia
    warningTimeoutRef.current = setTimeout(() => {
      onWarning();

      // Después de mostrar la advertencia, configurar el timer de logout
      // que se ejecutará después de la diferencia entre logoutTime y warningTime
      const remainingTime = logoutTime - warningTime;
      logoutTimeoutRef.current = setTimeout(() => {
        onLogout();
      }, remainingTime);
    }, warningTime);
  }, [warningTime, logoutTime, onWarning, onLogout, enabled]);

  // Función para manejar actividad del usuario
  const handleUserActivity = useCallback(() => {
    if (!enabled) return; // No hacer nada si está deshabilitado

    resetTimers();
  }, [resetTimers, enabled]);

  // Función para extender la sesión (cuando el usuario hace clic en "OK" en el modal)
  const extendSession = useCallback(() => {
    if (!enabled) return; // No hacer nada si está deshabilitado

    resetTimers();
  }, [resetTimers, enabled]);

  useEffect(() => {
    if (!enabled) {
      // Si está deshabilitado, limpiar timers existentes
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
        logoutTimeoutRef.current = null;
      }
      return;
    }

    // Eventos que indican actividad del usuario
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "keydown",
    ];

    // Agregar event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Iniciar timers
    resetTimers();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });

      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
    };
  }, [handleUserActivity, resetTimers, enabled]);

  return {
    extendSession,
    lastActivity: lastActivityRef.current,
  };
};
