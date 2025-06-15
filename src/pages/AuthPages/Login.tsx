/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import userService from "../../services/usersService";
import rulesService from "../../services/rulesService";

const Login = () => {
  const { loginWithEmail, loginWithGoogle, isAuthenticated, setIsAuthenticated  } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const roleId = sessionStorage.getItem("roleID");
    const roleName = sessionStorage.getItem("roleName")?.toLowerCase();

    if (isAuthenticated) {
      const isAdmin = roleId === "2" || roleName === "admin";
      const redirectPath = isAdmin ? "/dash-admin" : "/dashboard";
      navigate(redirectPath); // Ya está logueado, redirige
    }
  }, [isAuthenticated, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("roleID", "0");
      sessionStorage.setItem("roleName", "Admin");
      navigate("/dash-admin"); // Redirige a la home
    } catch (error: any) {
        // Si falla Firebase, intentamos contra el servicio propio
        try {
          const user = await userService.buscarEmail(email);

          if (!user || user.password !== password) {
            throw new Error("Credenciales inválidas");
          }

          if (!user.enabled) {
            throw new Error("Usuario deshabilitado");
          }

          const role = await rulesService.obtenerRole(user.rolesId[0])

          // Sesión local válida hasta que se cierre pestaña
          sessionStorage.setItem("username", user.username);
          sessionStorage.setItem("userEmail", user.mail);
          sessionStorage.setItem("roleID", role.id.toString());
          sessionStorage.setItem("roleName", role.name);
          sessionStorage.setItem("customLogin", "true");
          sessionStorage.setItem("userId", user.id.toString()); // opcional

          setIsAuthenticated(true)
          const isAdmin = user.rolesId[0]===2 || role.name?.toLocaleLowerCase() === "admin";
          const redirectPath = isAdmin ? "/dash-admin" : "/dashboard"
          navigate(redirectPath);
        } catch (customError: any) {
          alert("Correo y/o contraseña incorrectos");
        }
    };
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      const user = auth.currentUser;
      if (user?.email) {
        sessionStorage.setItem("userEmail", user.email);
        sessionStorage.setItem("roleID", "0");
        sessionStorage.setItem("rolName", "Admin"); 
      }
      navigate("/dash-admin");
    } catch (error: any) {
      alert("Error al iniciar sesión con Google: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-center">Iniciar sesión</h2>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="text-center text-gray-500">o</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-100"
        >
          <img src="/assets/google.svg" alt="Google" className="w-5 h-5" />
          Ingresar con Google
        </button>
      </div>
    </div>
  );
};

export default Login;
