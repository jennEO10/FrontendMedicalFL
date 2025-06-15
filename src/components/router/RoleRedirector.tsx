import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoleRedirector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const roleId = sessionStorage.getItem("roleID");
    const roleName = sessionStorage.getItem("roleName")?.toLowerCase();
    const isAdmin = roleId === "2" || roleName === "admin";

    const redirectPath = isAdmin ? "/dash-admin" : "/dashboard";
    navigate(redirectPath, { replace: true });
  }, [navigate]);

  return null; // No renderiza nada, solo redirige
};

export default RoleRedirector;
