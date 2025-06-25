/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import userService from "../../services/usersService";
import rulesService from "../../services/rulesService";
import loginService from "../../services/loginService";
import { LoginSchema } from "../../models/login";
import { comparePassword } from "../../utils/hash";

const Login = () => {
  const { loginWithEmail, loginWithGoogle, isAuthenticated, setIsAuthenticated, logout, isAuthorized, setIsAuthorized  } = useAuth();
  const navigate = useNavigate();
  
  const [login, setLogin] = useState<LoginSchema>({email: "", password: ""})
  // const allowedEmails = ["jennyespinoza618@gmail.com", "jorgefernando614@gmail.com", "sebyon69@gmail.com"];

  const authLogin = async (login: LoginSchema) => {
    try {
      const response = await loginService.authLogin(login)
      return response
    } catch(error) {
      console.error("Error al loguearse: ", error)
    }
  }

  const authLoginOAuth = async (idToken: string) => {
    try {
      const response = await loginService.authLoginFirebase(idToken)
      return response
    } catch(error) {
      console.error("Error al loguearse por firebase: ", error)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  useEffect(() => {
    const roleId = sessionStorage?.getItem("roleID") ?? "2";
    const roleName = sessionStorage.getItem("roleName")?.toLowerCase();

    if (isAuthenticated && isAuthorized) {
      const isAdmin = roleId === "2" || roleId === "0" || roleName === "admin";
      const redirectPath = isAdmin ? "/dash-admin" : "/dashboard";
      navigate(redirectPath); // Ya está logueado, redirige
    }
  }, [isAuthenticated, isAuthorized, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    const email = login.email
    const password = login.password
    e.preventDefault();
    try {
      const response = await authLogin(login) as any
      console.log("Respuesta del logueo", response)

      sessionStorage.setItem("token", response.token);

      const user = await userService.buscarEmail(email);

      const isMatch = await comparePassword(password, user.password);

      console.log("isMatch:", isMatch)

      if (!user || !isMatch) {
        throw new Error("Credenciales inválidas");
      }

      if (!user.enabled) {
        alert("Usuario inactivo.");
        return;
      }
          
      const role = await rulesService.obtenerRole(user.rolesId[0])

      // Sesión local válida hasta que se cierre pestaña
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("userEmail", user.mail);
      sessionStorage.setItem("roleID", role.id.toString());
      sessionStorage.setItem("roleName", role.name);
      sessionStorage.setItem("userId", user.id.toString()); // opcional
      sessionStorage.setItem("customLogin", "true");

      setIsAuthenticated(true)
      const isAdmin = user.rolesId[0]===2 || role.name?.toLocaleLowerCase() === "admin";
      const redirectPath = isAdmin ? "/dash-admin" : "/dashboard"
      navigate(redirectPath);
    } catch (customError: any) {
      alert("Correo y/o contraseña incorrectos");
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const idToken = await (await loginWithGoogle()).user.getIdToken();
      const response = await authLoginOAuth(idToken) as any
      console.log("Respuesta del logueo", response)

      sessionStorage.setItem("token", response.token);

      const user = auth.currentUser;

       // 🚨 Validación por correo
      if (!user?.email || !response) {
        alert("🚫 Correo no autorizado");
        logout(); // Cerrar sesión en Firebase
        return;
      }

      const user1 = await userService.buscarEmail(user.email);
      const role = await rulesService.obtenerRole(user1.rolesId[0])

      setIsAuthorized(true)

      sessionStorage.setItem("username", user1.username);
      sessionStorage.setItem("userEmail", user1.mail);
      sessionStorage.setItem("roleID", role.id.toString());
      sessionStorage.setItem("roleName", role.name);
      sessionStorage.setItem("userId", user1.id.toString());
      sessionStorage.setItem("customLogin", "true");

      navigate("/dash-admin");
    } catch (error: any) {
      alert("Error al iniciar sesión con Google: " + error.message);
    }
  };

  return (
  <div
    className="min-h-screen w-full bg-no-repeat bg-[length:100%_100%] sm:bg-cover bg-center flex items-center justify-center"
  style={{ backgroundImage: "url('/assets/fondoLoginMedicalFL.png')" }}
  >
    <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full space-y-6">
      <div className="flex justify-center">
        <img
          src="/assets/logoLoginMedicalFL.svg"
          alt="Logo MedicalFL"
          className="h-10 sm:h-12 w-auto"
        />
      </div>
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring focus:ring-indigo-400"
          value={login.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring focus:ring-indigo-400"
          value={login.password}
          onChange={handleChange}
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
