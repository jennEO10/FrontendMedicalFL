import { useState, useEffect } from "react";

interface UserRole {
  roleId: string | null;
  roleName: string | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useUserRole = (forceCheck?: number): UserRole => {
  const [roleId, setRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = () => {
      const storedRoleId = sessionStorage.getItem("roleID");
      const storedRoleName = sessionStorage.getItem("roleName");

      if (storedRoleId && storedRoleName) {
        setRoleId(storedRoleId);
        setRoleName(storedRoleName);
        setIsLoading(false);
      } else {
        // Verificar si hay un token válido para determinar si debe seguir cargando
        const hasToken = sessionStorage.getItem("token");
        const isCustomLogin = sessionStorage.getItem("customLogin") === "true";

        if (!hasToken || !isCustomLogin) {
          // No hay sesión activa, no es necesario seguir cargando
          setIsLoading(false);
        } else {
          // Hay sesión pero no se ha cargado el rol aún, reintentar
          setTimeout(loadUserRole, 50);
        }
      }
    };

    // Cargar inmediatamente
    loadUserRole();
  }, []);

  // Re-evaluar cuando se fuerza la verificación
  useEffect(() => {
    if (forceCheck !== undefined && forceCheck > 0) {
      const storedRoleId = sessionStorage.getItem("roleID");
      const storedRoleName = sessionStorage.getItem("roleName");

      if (storedRoleId && storedRoleName) {
        setRoleId(storedRoleId);
        setRoleName(storedRoleName);
        setIsLoading(false);
      }
    }
  }, [forceCheck]);

  // Escuchar cambios en sessionStorage para actualizar el rol en tiempo real
  useEffect(() => {
    const handleStorageChange = () => {
      const storedRoleId = sessionStorage.getItem("roleID");
      const storedRoleName = sessionStorage.getItem("roleName");

      if (storedRoleId && storedRoleName) {
        setRoleId(storedRoleId);
        setRoleName(storedRoleName);
        setIsLoading(false);
      }
    };

    // Escuchar cambios en sessionStorage
    window.addEventListener("storage", handleStorageChange);

    // También escuchar cambios programáticos en sessionStorage
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function (key, value) {
      originalSetItem.apply(this, [key, value]);
      if (key === "roleID" || key === "roleName") {
        handleStorageChange();
      }
    };

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      sessionStorage.setItem = originalSetItem;
    };
  }, []);

  const isAdmin =
    roleId === "2" || roleId === "0" || roleName?.toLowerCase() === "admin";

  return {
    roleId,
    roleName,
    isAdmin,
    isLoading,
  };
};
