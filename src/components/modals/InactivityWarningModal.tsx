import { FC, useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

interface InactivityWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtendSession: () => void;
}

const InactivityWarningModal: FC<InactivityWarningModalProps> = ({
  isOpen,
  onClose,
  onExtendSession,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [autoCloseCountdown, setAutoCloseCountdown] = useState(10);

  // Función para pausar el modal cuando hay actividad
  const pauseModal = useCallback(() => {
    if (isOpen && !isPaused) {
      setIsPaused(true);
      setAutoCloseCountdown(10);
    }
  }, [isOpen, isPaused]);

  // Efecto separado para manejar el contador de cierre automático
  useEffect(() => {
    if (!isPaused || !isOpen) return;

    const autoCloseTimer = setInterval(() => {
      setAutoCloseCountdown((prev) => {
        if (prev <= 1) {
          onExtendSession(); // Resetear timers
          onClose(); // Cerrar modal
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(autoCloseTimer);
    };
  }, [isPaused, isOpen, onExtendSession, onClose]);

  // Detectar actividad del usuario mientras el modal está abierto
  useEffect(() => {
    if (!isOpen) return;

    const handleUserActivity = () => {
      if (isPaused) {
        // Si ya está pausado, resetear el contador de 10 segundos
        setAutoCloseCountdown(10);
      } else {
        // Pausar por primera vez
        pauseModal();
      }
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "keydown",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [isOpen, isPaused, pauseModal]);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(60);
      setIsPaused(false);
      setAutoCloseCountdown(10);
      return;
    }

    if (!isPaused) {
      setTimeLeft(60);

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onExtendSession();
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isOpen, isPaused, onExtendSession, onClose]);

  if (!isOpen) return null;

  const handleExtendSession = () => {
    onExtendSession();
    onClose();
  };

  const handleClose = () => {
    onExtendSession();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[1000001] flex items-center justify-center backdrop-blur-sm bg-black/60"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-100 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-amber-600 dark:text-amber-400">
            Advertencia de Inactividad
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          {isPaused ? (
            <>
              <p className="text-gray-800 dark:text-gray-200 text-center leading-relaxed mb-4">
                Actividad detectada. El modal se cerrará automáticamente en:
              </p>

              <div className="text-center">
                <div className="relative">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2 font-mono">
                    {autoCloseCountdown}s
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(autoCloseCountdown / 10) * 100}%` }}
                    ></div>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Cierre automático
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-800 dark:text-gray-200 text-center leading-relaxed mb-4">
                La sesión se cerrará en 10 minutos, realice algún movimiento
                para evitarlo.
              </p>

              <div className="text-center">
                <div className="relative">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2 font-mono">
                    {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(timeLeft / 60) * 100}%` }}
                    ></div>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Tiempo restante
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleExtendSession}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default InactivityWarningModal;
