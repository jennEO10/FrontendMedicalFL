import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithPopup, setPersistence, browserSessionPersistence } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isCustomLogin = sessionStorage.getItem("customLogin") === "true";

      if (user || isCustomLogin) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    await setPersistence(auth, browserSessionPersistence);
    await signInWithPopup(auth, provider);
  };

  const logout = () => {
    const isCustom = sessionStorage.getItem("customLogin") === "true";
    sessionStorage.clear();
    signOut(auth);

    if (isCustom) {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, loginWithEmail, loginWithGoogle, logout, setIsAuthenticated  }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
