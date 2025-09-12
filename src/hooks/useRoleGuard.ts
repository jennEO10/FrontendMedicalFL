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
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { isTokenReady, isLoading: tokenLoading } = useTokenReady();

  // El loading total es true si cualquiera de los dos está cargando
  const isLoading = roleLoading || tokenLoading;

  // Verificar permisos según el rol requerido
  const hasAccess = requiredRole === "admin" ? isAdmin : !isAdmin;

  return {
    isLoading,
    hasAccess,
    isAdmin,
    isTokenReady,
  };
};
