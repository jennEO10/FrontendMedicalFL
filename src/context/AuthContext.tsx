import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  UserCredential,
} from "firebase/auth";
import { auth, provider } from "../firebase/firebase";

interface AuthContextProps {
  isAuthenticated: boolean;
  isAuthorized: boolean;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  logout: () => void;
  setIsAuthenticated: (auth: boolean) => void;
  setIsAuthorized: (auth: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isCustomLogin = sessionStorage.getItem("customLogin") === "true";
      const hasToken = sessionStorage.getItem("token");

      // Si hay login personalizado con token, mantener estados autenticados
      if (isCustomLogin && hasToken) {
        setIsAuthenticated(true);
        setIsAuthorized(true);
      } else if (user && !isCustomLogin) {
        // Solo manejar Firebase si no hay login personalizado
        setIsAuthenticated(true);
        setIsAuthorized(true);
      } else {
        // No hay usuario ni login personalizado
        setIsAuthenticated(false);
        setIsAuthorized(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Efecto adicional para verificar el estado de autenticación inmediatamente
  useEffect(() => {
    const checkInitialAuthState = () => {
      const isCustomLogin = sessionStorage.getItem("customLogin") === "true";
      const hasToken = sessionStorage.getItem("token");

      if (isCustomLogin && hasToken) {
        setIsAuthenticated(true);
        setIsAuthorized(true);
        setLoading(false);
      } else if (!isCustomLogin && !hasToken) {
        // No hay sesión personalizada, esperar a que Firebase se inicialice
        setLoading(true);
      }
    };

    // Verificar inmediatamente al cargar
    checkInitialAuthState();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    await setPersistence(auth, browserSessionPersistence);
    const response = await signInWithEmailAndPassword(auth, email, password);

    return response;
  };

  const loginWithGoogle = async () => {
    await setPersistence(auth, browserSessionPersistence);
    const response = await signInWithPopup(auth, provider);

    return response;
  };

  const logout = async () => {
    const isCustom = sessionStorage.getItem("customLogin") === "true";
    sessionStorage.clear();
    await signOut(auth);

    if (isCustom) {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthorized,
        loading,
        loginWithEmail,
        loginWithGoogle,
        logout,
        setIsAuthenticated,
        setIsAuthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
