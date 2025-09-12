/* eslint-disable @typescript-eslint/no-unused-vars */
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { InactivityProvider } from "./context/InactivityContext";
import ProtectedRoute from "./components/router/ProtectedRoute";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import RoleRedirector from "./components/router/RoleRedirector";

// Importaciones estáticas (componentes críticos que se cargan inmediatamente)
import Login from "./pages/AuthPages/Login";

// Lazy loading para páginas de autenticación
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));

// Lazy loading para páginas de administración
const OrganizacionesView = lazy(
  () => import("./pages/organizaciones/OrganizacionesView")
);
const UsuariosView = lazy(() => import("./pages/Usuarios/UsuariosView"));
const RolesView = lazy(() => import("./pages/Roles/RolesView"));
const DashboardAdminView = lazy(() => import("./pages/Dashboard/DashAdmin"));
const LogSistemaView = lazy(() => import("./pages/logSistema/LogSistemaView"));
const AlertaNotificacionesView = lazy(
  () => import("./pages/AlertaNotificaciones/AlertaNotificacionesView")
);

// Lazy loading para páginas de operador
const OperadorDashboard = lazy(
  () => import("./pages/Operador/dashboard/dashboard")
);
const EntrenarModeloView = lazy(
  () => import("./pages/Operador/EntrenarModeloView")
);
const UsarModeloView = lazy(() => import("./pages/Operador/UsarModeloView"));
const ReportesView = lazy(() => import("./pages/Operador/ReporteView"));
const InformacionAdicional = lazy(
  () => import("./pages/Operador/InformacionAdicionalView")
);
const HistoricoIteracion = lazy(
  () => import("./pages/Operador/HistoricoIteracion")
);

// Lazy loading para páginas de iteraciones
const IteracionesView = lazy(
  () => import("./pages/Iteraciones/IteracionesView")
);
const IteracionForRondas = lazy(
  () => import("./pages/Iteraciones/IteracionRondasView")
);
const MetricasPorUsuario = lazy(
  () => import("./pages/Iteraciones/MetricasPorUsuario")
);
const MetricasPorOrganizacion = lazy(
  () => import("./pages/Iteraciones/MetricasPorOrganizacion")
);

// Lazy loading para páginas de roles
const PermisosView = lazy(() => import("./pages/Roles/PermisosRolesView"));

// Lazy loading para páginas de UI (menos críticas)
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const Videos = lazy(() => import("./pages/UiElements/Videos"));
const Images = lazy(() => import("./pages/UiElements/Images"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Badges = lazy(() => import("./pages/UiElements/Badges"));
const Avatars = lazy(() => import("./pages/UiElements/Avatars"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const LineChart = lazy(() => import("./pages/Charts/LineChart"));
const BarChart = lazy(() => import("./pages/Charts/BarChart"));
const Calendar = lazy(() => import("./pages/Calendar"));
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"));
const FormElements = lazy(() => import("./pages/Forms/FormElements"));
const Blank = lazy(() => import("./pages/Blank"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));

// Componente de carga
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <InactivityProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Layout con rutas protegidas */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index path="/" element={<RoleRedirector />} />
                <Route path="/dash-admin" element={<DashboardAdminView />} />
                <Route
                  path="/organizaciones"
                  element={<OrganizacionesView />}
                />
                <Route path="/usuarios" element={<UsuariosView />} />
                <Route path="/roles" element={<RolesView />} />
                <Route path="/roles/permisos/:id" element={<PermisosView />} />
                <Route path="/iteraciones" element={<IteracionesView />} />
                <Route
                  path="/iteraciones/rondas/:id"
                  element={<IteracionForRondas />}
                />
                <Route
                  path="/metricas-usuario"
                  element={<MetricasPorUsuario />}
                />
                <Route
                  path="/metricas-organizacion"
                  element={<MetricasPorOrganizacion />}
                />
                <Route path="/log-sistema" element={<LogSistemaView />} />
                <Route
                  path="/alerta-notificaciones"
                  element={<AlertaNotificacionesView />}
                />
                <Route path="/profile" element={<UserProfiles />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/blank" element={<Blank />} />
                <Route path="/form-elements" element={<FormElements />} />
                <Route path="/basic-tables" element={<BasicTables />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/avatars" element={<Avatars />} />
                <Route path="/badge" element={<Badges />} />
                <Route path="/buttons" element={<Buttons />} />
                <Route path="/images" element={<Images />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/line-chart" element={<LineChart />} />
                <Route path="/bar-chart" element={<BarChart />} />

                {/* Operador */}
                <Route path="/dashboard" element={<OperadorDashboard />} />
                <Route path="/model-train" element={<EntrenarModeloView />} />
                <Route path="/use-model" element={<UsarModeloView />} />
                <Route path="/view-reports" element={<ReportesView />} />
                <Route
                  path="/additional-information"
                  element={<InformacionAdicional />}
                />
                <Route path="/historico" element={<HistoricoIteracion />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </InactivityProvider>
    </AuthProvider>
  );
}
