import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React y React DOM
          "react-vendor": ["react", "react-dom", "react-router"],

          // Separar librerías de UI
          "ui-vendor": ["react-icons", "@headlessui/react"],

          // Separar librerías de gráficos
          "charts-vendor": ["recharts"],

          // Separar librerías de utilidades
          "utils-vendor": ["axios"],

          // Separar páginas de administración
          "admin-pages": [
            "./src/pages/organizaciones/OrganizacionesView",
            "./src/pages/Usuarios/UsuariosView",
            "./src/pages/Roles/RolesView",
            "./src/pages/Dashboard/DashAdmin",
          ],

          // Separar páginas de operador
          "operator-pages": [
            "./src/pages/Operador/dashboard/dashboard",
            "./src/pages/Operador/EntrenarModeloView",
            "./src/pages/Operador/UsarModeloView",
            "./src/pages/Operador/ReporteView",
          ],

          // Separar páginas de iteraciones
          "iteration-pages": [
            "./src/pages/Iteraciones/IteracionesView",
            "./src/pages/Iteraciones/IteracionRondasView",
            "./src/pages/Iteraciones/MetricasPorUsuario",
          ],
        },
      },
    },
    // Aumentar el límite de advertencia a 1MB
    chunkSizeWarningLimit: 1000,
  },
});
