import { useUserRole } from "./useUserRole";
import { useTokenReady } from "./useTokenReady";

interface UseRoleGuardProps {
  requiredRole: "admin" | "operator";
}

interface RoleGuardResult {
  isLoading: boolean;
  hasAccess: boolean;
  isAdmin: boolean;
  isTokenReady: boolean;
}

export const useRoleGuard = ({
  requiredRole,
}: UseRoleGuardProps): RoleGuardResult => {
  const { isAdmin, roleName, isLoading: roleLoading } = useUserRole();
  const { isTokenReady, isLoading: tokenLoading } = useTokenReady();

  // El loading total es true si cualquiera de los dos está cargando
  const isLoading = roleLoading || tokenLoading;

  // Verificar permisos según el rol requerido
  let hasAccess = false;

  if (requiredRole === "admin") {
    hasAccess = isAdmin;
  } else if (requiredRole === "operator") {
    // Para operador: cualquier rol que NO sea admin
    hasAccess = !isAdmin;
  }

  return {
    isLoading,
    hasAccess,
    isAdmin,
    isTokenReady,
  };
};
