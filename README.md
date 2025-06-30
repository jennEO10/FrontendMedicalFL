# MedicalFL - Sistema de Aprendizaje Federado Médico

![MedicalFL Banner](./banner.png)

## 📋 Descripción

**MedicalFL** es una aplicación web frontend que implementa un sistema de **aprendizaje federado** (Federated Learning) diseñado específicamente para aplicaciones médicas. Esta plataforma permite a múltiples organizaciones médicas colaborar en el entrenamiento de modelos de machine learning sin compartir datos sensibles entre sí, preservando así la privacidad y confidencialidad de los datos de pacientes.

## 🎯 Características Principales

### 🔐 Sistema de Autenticación y Autorización
- **Autenticación múltiple**: Login con email/password y Google OAuth
- **Sistema de roles**: Administrador, Operador, y roles personalizables
- **Rutas protegidas**: Acceso controlado basado en permisos de usuario
- **Gestión de sesiones**: Persistencia de sesión con Firebase

### 🏥 Gestión de Organizaciones Médicas
- **CRUD completo** de organizaciones participantes
- **Configuración de parámetros** específicos por organización
- **Asignación de usuarios** a organizaciones
- **Control de acceso** por organización

### 👥 Administración de Usuarios
- **Gestión de usuarios** con roles y permisos
- **Filtros dinámicos** para búsqueda avanzada
- **Estados de usuario** (activo/inactivo)
- **Asignación de roles** y organizaciones

### 🤖 Sistema de Iteraciones Federadas
- **Creación y configuración** de iteraciones de entrenamiento
- **Hiperparámetros configurables**:
  - Épocas locales (`localEpochs`)
  - Número mínimo de clientes (`minAvailableClients`)
  - Número de rondas (`rounds`)
  - Tiempo local de entrenamiento
- **Estados de iteración**: Activa, Finalizada, Cancelada
- **Seguimiento de métricas** por ronda y usuario

### 📊 Dashboard de Operador
- **Entrenamiento de modelos**: Interfaz para iniciar entrenamientos federados
- **Uso de modelos**: Aplicación de modelos entrenados
- **Reportes y métricas**: Visualización de resultados
- **Histórico de iteraciones**: Seguimiento temporal de entrenamientos
- **Información adicional**: Configuraciones y parámetros del sistema

### 📈 Monitoreo y Analytics
- **Métricas en tiempo real**: Accuracy, Precision, Recall, F1-Score, AUC
- **Gráficos interactivos**: Visualización de progreso por ronda
- **Logs del sistema**: Registro detallado de actividades
- **Alertas y notificaciones**: Sistema de notificaciones en tiempo real

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19**: Framework principal con hooks modernos
- **TypeScript**: Tipado estático para mejor mantenibilidad
- **Vite**: Build tool rápido y moderno
- **React Router DOM**: Navegación y rutas protegidas

### UI/UX
- **Tailwind CSS**: Framework de estilos utility-first
- **TailAdmin Template**: Componentes UI predefinidos
- **Lucide React**: Iconografía moderna
- **Responsive Design**: Compatible con móviles y desktop

### Gráficos y Visualización
- **ApexCharts**: Gráficos interactivos avanzados
- **Chart.js**: Gráficos adicionales
- **Recharts**: Componentes de gráficos React

### Autenticación y Backend
- **Firebase Auth**: Sistema de autenticación
- **Axios**: Cliente HTTP para APIs
- **Session Storage**: Gestión de estado de sesión

### Utilidades
- **React Dropzone**: Subida de archivos
- **Flatpickr**: Selector de fechas
- **XLSX**: Manejo de archivos Excel
- **File Saver**: Descarga de archivos

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js**: Versión 18.x o superior (recomendado 20.x)
- **npm** o **yarn**: Gestor de paquetes

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd FrontendMedicalFL
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. **Abrir en navegador**
   ```
   http://localhost:5173
   ```
   
   > **Nota sobre el puerto**: Por defecto, Vite utiliza el puerto `5173`. Si necesitas cambiar el puerto, puedes:
   > - **Opción 1**: Modificar el archivo `vite.config.ts` agregando:
   >   ```typescript
   >   export default defineConfig({
   >     server: {
   >       port: 3000 // o el puerto que prefieras
   >     },
   >     // ... resto de la configuración
   >   })
   >   ```
   > - **Opción 2**: Usar el comando con flag:
   >   ```bash
   >   npx vite --port 3000
   >   ```
   > - **Opción 3**: Crear archivo `.env` con:
   >   ```
   >   VITE_PORT=3000
   >   ```

## 📁 Estructura del Proyecto

```
FrontendMedicalFL/
├── src/
│   ├── api/                 # Configuración de APIs y endpoints
│   ├── components/          # Componentes reutilizables
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── charts/         # Componentes de gráficos
│   │   ├── form/           # Componentes de formularios
│   │   ├── modals/         # Modales y diálogos
│   │   └── ui/             # Componentes UI básicos
│   ├── context/            # Contextos de React (Auth, Theme)
│   ├── firebase/           # Configuración de Firebase
│   ├── hooks/              # Custom hooks
│   ├── layout/             # Componentes de layout
│   ├── models/             # Interfaces TypeScript
│   ├── pages/              # Páginas de la aplicación
│   │   ├── AuthPages/      # Páginas de autenticación
│   │   ├── Dashboard/      # Dashboards principales
│   │   ├── Iteraciones/    # Gestión de iteraciones
│   │   ├── Operador/       # Dashboard de operador
│   │   └── Usuarios/       # Gestión de usuarios
│   ├── services/           # Servicios de negocio
│   └── utils/              # Utilidades y helpers
├── public/                 # Archivos estáticos
└── package.json           # Dependencias y scripts
```

## 🔄 Flujo de Trabajo del Sistema

### 1. Configuración Inicial (Administrador)
- Crear organizaciones médicas participantes
- Configurar usuarios y roles
- Definir permisos y accesos

### 2. Configuración de Iteración (Administrador)
- Crear nueva iteración federada
- Configurar hiperparámetros
- Definir participantes y organizaciones
- Establecer fechas y duración

### 3. Entrenamiento Federado (Operadores)
- Los operadores de cada organización inician entrenamiento local
- El sistema coordina la agregación de modelos
- Se ejecutan múltiples rondas de entrenamiento
- Se registran métricas y progreso

### 4. Monitoreo y Resultados
- Visualización de métricas en tiempo real
- Generación de reportes
- Análisis de rendimiento por organización
- Histórico de iteraciones

## 📊 Métricas y KPIs

### Métricas de Modelo
- **Accuracy**: Precisión general del modelo
- **Precision**: Precisión de predicciones positivas
- **Recall**: Sensibilidad del modelo
- **F1-Score**: Media armónica de precisión y recall
- **AUC**: Área bajo la curva ROC

### Métricas de Sistema
- **Tiempo de entrenamiento** por ronda
- **Participación** de organizaciones
- **Convergencia** del modelo federado
- **Rendimiento** por usuario

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de producción
npm run lint         # Ejecutar linter

# Producción
npm run build        # Construir aplicación
```

## 🌐 Despliegue

### Producción
```bash
npm run build
# Los archivos se generan en /dist
```

### Variables de Entorno de Producción
```bash
VITE_API_BASE_URL=https://api.medicalfl.com
VITE_FIREBASE_CONFIG=production_config
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE.md` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación técnica

## 🔮 Roadmap

### Próximas Características
- [ ] Integración con más algoritmos de ML
- [ ] Dashboard de métricas avanzadas
- [ ] API REST completa
- [ ] Soporte para múltiples tipos de datos médicos
- [ ] Sistema de notificaciones push
- [ ] Exportación de reportes en PDF
- [ ] Integración con sistemas hospitalarios

### Mejoras Técnicas
- [ ] Optimización de rendimiento
- [ ] Tests unitarios y de integración
- [ ] Documentación de API
- [ ] Dockerización
- [ ] CI/CD pipeline

---

**MedicalFL** - Transformando la colaboración médica a través del aprendizaje federado 🤖🏥
