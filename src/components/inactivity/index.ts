// Exportaciones del sistema de inactividad
export { default as InactivityWarningModal } from "../modals/InactivityWarningModal";

// Hooks
export { useInactivity } from "../../hooks/useInactivity";
export { useInactivityContext } from "../../context/InactivityContext";

// Contexto
export { InactivityProvider } from "../../context/InactivityContext";

// Configuración
export {
  getCurrentInactivityConfig,
  INACTIVITY_CONFIG,
} from "../../config/inactivity";
