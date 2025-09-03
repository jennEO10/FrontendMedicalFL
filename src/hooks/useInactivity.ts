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

    console.log("🔄 Reseteando timers de inactividad");
    lastActivityRef.current = Date.now();
    console.log(
      `📅 Última actividad registrada: ${new Date(
        lastActivityRef.current
      ).toLocaleTimeString()}`
    );

    // Limpiar timers existentes
    if (warningTimeoutRef.current) {
      console.log("🧹 Limpiando timer de advertencia anterior");
      clearTimeout(warningTimeoutRef.current);
    }
    if (logoutTimeoutRef.current) {
      console.log("🧹 Limpiando timer de logout anterior");
      clearTimeout(logoutTimeoutRef.current);
    }

    // Configurar nuevo timer de advertencia
    console.log(
      `⏰ Configurando timer de advertencia para ${warningTime}ms (${
        warningTime / 1000
      } segundos)`
    );
    warningTimeoutRef.current = setTimeout(() => {
      console.log(
        `⏰ Timer de advertencia ejecutado después de ${warningTime}ms`
      );
      onWarning();

      // Después de mostrar la advertencia, configurar el timer de logout
      // que se ejecutará después de la diferencia entre logoutTime y warningTime
      const remainingTime = logoutTime - warningTime;
      console.log(
        `⏰ Configurando timer de logout para ${remainingTime}ms (${
          remainingTime / 1000
        } segundos)`
      );
      logoutTimeoutRef.current = setTimeout(() => {
        console.log(
          `⏰ Timer de logout ejecutado después de ${remainingTime}ms`
        );
        onLogout();
      }, remainingTime);
    }, warningTime);
  }, [warningTime, logoutTime, onWarning, onLogout, enabled]);

  // Función para manejar actividad del usuario
  const handleUserActivity = useCallback(
    (event: Event) => {
      if (!enabled) return; // No hacer nada si está deshabilitado

      console.log(
        `🎯 Actividad detectada: ${
          event.type
        } en ${new Date().toLocaleTimeString()}`
      );
      resetTimers();
    },
    [resetTimers, enabled]
  );

  // Función para extender la sesión (cuando el usuario hace clic en "OK" en el modal)
  const extendSession = useCallback(() => {
    if (!enabled) return; // No hacer nada si está deshabilitado

    console.log("🔄 Reseteando timers por extensión de sesión");
    resetTimers();
  }, [resetTimers, enabled]);

  useEffect(() => {
    if (!enabled) {
      console.log("🚫 Sistema de inactividad deshabilitado - limpiando timers");
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

    console.log("🚀 Hook de inactividad inicializado");
    console.log(
      `⏱️ Tiempos configurados: Warning=${warningTime}ms, Logout=${logoutTime}ms`
    );

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
      console.log(`📡 Event listener agregado para: ${event}`);
    });

    // Iniciar timers
    console.log("⏰ Iniciando timers de inactividad...");
    resetTimers();

    // Cleanup
    return () => {
      console.log("🧹 Limpiando hook de inactividad");
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
