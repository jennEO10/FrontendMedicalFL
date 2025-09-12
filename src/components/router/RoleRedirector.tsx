import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "../../hooks/useUserRole";

const RoleRedirector = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading) {
      const redirectPath = isAdmin ? "/dash-admin" : "/dashboard";
      navigate(redirectPath, { replace: true });
    }
  }, [isAdmin, isLoading, navigate]);

  return null; // No renderiza nada, solo redirige
};

export default RoleRedirector;
