import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useInactivity } from "../hooks/useInactivity";
import { useAuth } from "./AuthContext";
import { InactivityWarningModal } from "../components/inactivity";
import { getCurrentInactivityConfig } from "../config/inactivity";

interface InactivityContextProps {
  showWarning: boolean;
  setShowWarning: (show: boolean) => void;
  extendSession: () => void;
}

const InactivityContext = createContext<InactivityContextProps | undefined>(
  undefined
);

export function InactivityProvider({ children }: { children: ReactNode }) {
  const [showWarning, setShowWarning] = useState(false);
  const { logout, isAuthenticated } = useAuth();

  const { WARNING_TIME, LOGOUT_TIME } = getCurrentInactivityConfig();

  const handleWarning = useCallback(() => {
    setShowWarning(true);
  }, []);

  const handleLogout = useCallback(() => {
    setShowWarning(false);
    logout();
  }, [logout]);

  const extendSession = useCallback(() => {
    setShowWarning(false);
  }, []);

  // Solo activar el sistema de inactividad si el usuario está autenticado
  useInactivity({
    warningTime: WARNING_TIME,
    logoutTime: LOGOUT_TIME,
    onWarning: handleWarning,
    onLogout: handleLogout,
    enabled: isAuthenticated, // Solo activar si está autenticado
  });

  return (
    <InactivityContext.Provider
      value={{ showWarning, setShowWarning, extendSession }}
    >
      {children}
      <InactivityWarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        onExtendSession={extendSession}
        warningTime={WARNING_TIME}
        logoutTime={LOGOUT_TIME}
      />
    </InactivityContext.Provider>
  );
}

export function useInactivityContext() {
  const context = useContext(InactivityContext);
  if (!context) {
    throw new Error(
      "useInactivityContext debe usarse dentro de InactivityProvider"
    );
  }
  return context;
}
