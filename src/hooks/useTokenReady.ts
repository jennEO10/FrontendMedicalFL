import { useState, useEffect } from "react";

interface TokenReadyResult {
  isTokenReady: boolean;
  isLoading: boolean;
}

export const useTokenReady = (): TokenReadyResult => {
  const [isTokenReady, setIsTokenReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTokenReady = () => {
      const token = sessionStorage.getItem("token");
      const customLogin = sessionStorage.getItem("customLogin") === "true";
      const roleId = sessionStorage.getItem("roleID");
      const roleName = sessionStorage.getItem("roleName");

      // Verificar que todos los datos necesarios estén disponibles
      if (token && customLogin && roleId && roleName) {
        setIsTokenReady(true);
        setIsLoading(false);
      } else {
        // Si no están todos los datos, esperar un poco y reintentar
        setTimeout(checkTokenReady, 50);
      }
    };

    // Verificar inmediatamente
    checkTokenReady();
  }, []);

  return {
    isTokenReady,
    isLoading,
  };
};
