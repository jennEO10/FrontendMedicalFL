import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import OrganizacionesView from "./pages/organizaciones/OrganizacionesView";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/router/ProtectedRoute";
import Login from "./pages/AuthPages/Login";
import UsuariosView from "./pages/Usuarios/UsuariosView";
import RolesView from "./pages/Roles/RolesView";
import IteracionesView from "./pages/Iteraciones/IteracionesView";
import PermisosView from "./pages/Roles/PermisosRolesView";
import LogSistemaView from "./pages/logSistema/LogSistemaView";
import DashboardAdminView from "./pages/Dashboard/DashAdmin";
import AlertaNotificacionesView from "./pages/AlertaNotificaciones/AlertaNotificacionesView";
import OperadorDashboard from "./pages/Operador/dashboard/dashboard";
import RoleRedirector from "./components/router/RoleRedirector";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
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
            <Route path="/organizaciones" element={<OrganizacionesView />} />
            <Route path="/usuarios" element={<UsuariosView />} />
            <Route path="/roles" element={<RolesView />} />
            <Route path="/roles/permisos/:id" element={<PermisosView />} />
            <Route path="/iteraciones" element={<IteracionesView />} />
            <Route path="/log-sistema" element={<LogSistemaView />} />
            <Route path="/alerta-notificaciones" element={<AlertaNotificacionesView />} />
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
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
