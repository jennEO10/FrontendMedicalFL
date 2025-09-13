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
import { Alerta } from "../../models/aletas";
import { getLocalDateTime } from "../../utils/dateUtils";
import alertaService from "../../services/alertaService";

const Login = () => {
  const {
    loginWithEmail,
    loginWithGoogle,
    isAuthenticated,
    setIsAuthenticated,
    logout,
    isAuthorized,
    setIsAuthorized,
  } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState<LoginSchema>({ email: "", password: "" });
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  // const allowedEmails = ["jennyespinoza618@gmail.com", "jorgefernando614@gmail.com", "sebyon69@gmail.com"];

  const authLogin = async (login: LoginSchema) => {
    try {
      const response = await loginService.authLogin(login);
      return response;
    } catch (error) {
      console.error("Error al loguearse: ", error);
    }
  };

  const authLoginOAuth = async (idToken: string) => {
    try {
      const response = await loginService.authLoginFirebase(idToken);
      return response;
    } catch (error) {
      console.error("Error al loguearse por firebase: ", error);
      throw error; // Re-lanzar el error para que se maneje en el catch del handleGoogleLogin
    }
  };

  const manejarErrorOAuth = () => {
    // Limpiar cualquier estado de autenticación
    setIsAuthenticated(false);
    setIsAuthorized(false);
    setIsProcessingOAuth(false);

    // Limpiar sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("roleID");
    sessionStorage.removeItem("roleName");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userOrganizationId");
    sessionStorage.removeItem("customLogin");

    // Cerrar sesión en Firebase
    logout();

    // Mostrar mensaje de error
    alert("El correo ingresado no está registrado");

    // Forzar que se quede en el login - usar replace para evitar historial
    window.location.replace("/");
  };

  const manejarIntentoFallido = async (tipoLogin: string) => {
    const nuevosIntentos = intentosFallidos + 1;
    setIntentosFallidos(nuevosIntentos);

    if (nuevosIntentos >= 3) {
      // Crear alerta de intentos fallidos
      const alerta: Alerta = {
        id: 0,
        tipo: "🚨",
        mensaje: `Usuario falló 3 intentos de acceso consecutivos (${tipoLogin})`,
        timestamp: getLocalDateTime(),
      };

      try {
        await alertaService.nuevaAlerta(alerta);
      } catch (error) {
        console.error("Error al registrar alerta de intentos fallidos:", error);
      }

      // Reiniciar contador después de 3 intentos
      setIntentosFallidos(0);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  useEffect(() => {
    const roleId = sessionStorage?.getItem("roleID") ?? "2";
    const roleName = sessionStorage.getItem("roleName")?.toLowerCase();

    // 🚨 NO navegar si se está procesando OAuth
    if (isAuthenticated && isAuthorized && !isProcessingOAuth) {
      const isAdmin = roleId === "2" || roleId === "0" || roleName === "admin";
      const redirectPath = isAdmin ? "/dash-admin" : "/dashboard";
      navigate(redirectPath); // Ya está logueado, redirige
    }
  }, [isAuthenticated, isAuthorized, navigate, isProcessingOAuth]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    const email = login.email;
    const password = login.password;
    e.preventDefault();
    try {
      const response = (await authLogin(login)) as any;

      sessionStorage.setItem("token", response.token);

      // Pequeño delay para asegurar que el token esté disponible
      await new Promise((resolve) => setTimeout(resolve, 100));

      const user = await userService.buscarEmail(email);

      if (!user) {
        alert("El correo ingresado no está registrado");
        return;
      }

      const isMatch = await comparePassword(password, user?.password ?? "");

      if (!user || !isMatch) {
        throw new Error("Credenciales inválidas");
      }

      if (!user.enabled) {
        alert("Usuario inactivo.");
        return;
      }

      const role = await rulesService.obtenerRole(user.rolesId[0]);

      const alerta: Alerta = {
        id: 0,
        tipo: "🔐",
        mensaje: `Usuario inició sesión: ${user.mail}`,
        timestamp: getLocalDateTime(),
      };
      const alertaResponse = await alertaService.nuevaAlerta(alerta);

      // Sesión local válida hasta que se cierre pestaña
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("userEmail", user.mail);
      sessionStorage.setItem("roleID", role.id.toString());
      sessionStorage.setItem("roleName", role.name);
      sessionStorage.setItem("userId", user.id.toString());
      sessionStorage.setItem(
        "userOrganizationId",
        user.organizationId.toString()
      );
      sessionStorage.setItem("customLogin", "true");

      setIsAuthenticated(true);
      setIsAuthorized(true);
      const isAdmin =
        user.rolesId[0] === 2 || role.name?.toLocaleLowerCase() === "admin";
      const redirectPath = isAdmin ? "/dash-admin" : "/dashboard";

      // Reiniciar contador en login exitoso
      setIntentosFallidos(0);

      // Pequeño delay para asegurar que los estados se establezcan en producción
      setTimeout(() => {
        navigate(redirectPath);
      }, 100);
    } catch (customError: any) {
      // Manejar intento fallido
      await manejarIntentoFallido("Email/Password");
      alert("Correo y/o contraseña incorrectos");
    }
  };

  const handleGoogleLogin = async () => {
    setIsProcessingOAuth(true);
    try {
      const idToken = await (await loginWithGoogle()).user.getIdToken();

      // 🚨 PRIMERO validar con el backend si el usuario está registrado
      const response: any = await authLoginOAuth(idToken);

      const user = auth.currentUser;

      // 🚨 Validación por correo
      if (!user?.email || !response) {
        alert("🚫 Correo no autorizado");
        logout(); // Cerrar sesión en Firebase
        return;
      }

      // 🚨 PRIMERO guardar el token para poder hacer las consultas
      sessionStorage.setItem("token", response.token);

      // Pequeño delay para asegurar que el token esté disponible
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 🚨 AHORA validar que el usuario existe en la base de datos
      let user1;
      try {
        user1 = await userService.buscarEmail(user.email);

        // Verificar si el usuario existe
        if (!user1) {
          manejarErrorOAuth();
          return;
        }

        // Verificar si el usuario está habilitado
        if (!user1.enabled) {
          alert("Usuario inactivo.");
          logout(); // Cerrar sesión en Firebase
          return;
        }
      } catch (error) {
        manejarErrorOAuth();
        return;
      }

      const role = await rulesService.obtenerRole(user1.rolesId[0]);

      const alerta: Alerta = {
        id: 0,
        tipo: "🔐",
        mensaje: `Usuario inició sesión: ${user1.mail}`,
        timestamp: getLocalDateTime(),
      };
      const alertaResponse = await alertaService.nuevaAlerta(alerta);

      // 🚨 ESTABLECER AUTENTICACIÓN SOLO DESPUÉS DE VALIDAR TODO
      setIsAuthenticated(true);
      setIsAuthorized(true);
      setIsProcessingOAuth(false);

      sessionStorage.setItem("username", user1.username);
      sessionStorage.setItem("userEmail", user1.mail);
      sessionStorage.setItem("roleID", role.id.toString());
      sessionStorage.setItem("roleName", role.name);
      sessionStorage.setItem("userId", user1.id.toString());
      sessionStorage.setItem(
        "userOrganizationId",
        user1.organizationId.toString()
      );
      sessionStorage.setItem("customLogin", "true");

      // Reiniciar contador en login exitoso
      setIntentosFallidos(0);

      // Pequeño delay para asegurar que los estados se establezcan en producción
      setTimeout(() => {
        navigate("/dash-admin");
      }, 100);
    } catch (error: any) {
      setIsProcessingOAuth(false);

      // No mostrar error si el usuario canceló el popup
      if (
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/popup-closed-by-user"
      ) {
        // El usuario canceló el popup, no es un error real
        return;
      }

      // Verificar si es un error 401 (usuario no registrado)
      if (
        error.response?.status === 401 ||
        error.message?.includes("401") ||
        error.code === "ERR_BAD_REQUEST" ||
        error.message?.includes("Request failed with status code 401")
      ) {
        manejarErrorOAuth();
        return;
      }

      // Manejar intento fallido solo para errores reales
      await manejarIntentoFallido("Google OAuth");
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
