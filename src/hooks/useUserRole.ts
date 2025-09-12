import { useState, useEffect } from "react";

interface UserRole {
  roleId: string | null;
  roleName: string | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useUserRole = (): UserRole => {
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
        // Si no están disponibles, esperar un poco y volver a intentar
        setTimeout(loadUserRole, 100);
      }
    };

    loadUserRole();
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
