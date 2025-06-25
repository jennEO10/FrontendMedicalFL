import { useEffect, useRef, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { FaBell, FaUser, FaBuilding, FaCheck, FaFileAlt, FaSync, FaExclamationTriangle, FaDatabase, FaLock } from "react-icons/fa";
import { Link } from "react-router";
import { Alerta } from "../../models/aletas";
import alertaService from "../../services/alertaService";
import { alertaEmitter } from "../../utils/alertaEvents";

export default function NotificationDropdown() {
  const prevAlertCount = useRef<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  // const [alerts] = useState([
  //   { icon: <FaExclamationTriangle className="text-yellow-400" />, message: "Alerta de seguridad: Acceso inusual detectado", time: "Hace 30 minutos" },
  //   { icon: <FaUser className="text-purple-400" />, message: "Usuario nuevo creado: maria.lopez@hospital.org", time: "Hace 2 horas" },
  //   { icon: <FaBuilding className="text-pink-400" />, message: "Organización \"Hospital Norte\" agregada", time: "Hace 3 horas" },
  //   { icon: <FaCheck className="text-green-400" />, message: "Iteración #28 completada", time: "Hace 5 horas" },
  //   { icon: <FaFileAlt className="text-gray-300" />, message: "Nuevo documento subido al sistema", time: "Hace 10 horas" },
  //   { icon: <FaSync className="text-blue-400" />, message: "Actualización automática del sistema completada", time: "Hace 12 horas" },
  //   { icon: <FaBell className="text-yellow-300" />, message: "Notificación de revisión periódica activada", time: "Hace 1 día" },
  //   { icon: <FaDatabase className="text-pink-400" />, message: "Nuevo backup generado correctamente", time: "Hace 1 día" },
  //   { icon: <FaLock className="text-orange-400" />, message: "Cambio de contraseña exitoso para admin01", time: "Hace 1 día" },
  //   { icon: <FaDatabase className="text-purple-400" />, message: "Base de datos sincronizada con éxito", time: "Hace 2 días" },
  // ]);

  const [alerts, setAlerts] = useState<Alerta[]>([]);

  const getAllAlerts = async () => {
    try {
      const response = (await alertaService.getAllAlerts())
      .sort((a, b) => b.id - a.id)
      .slice(0, 10);

      setAlerts(response);

      if (response.length > 0 && response[0].id !== prevAlertCount.current) {
        setNotifying(true); // 👉 activa la luz naranja
        prevAlertCount.current = response[0].id;
      }
    } catch (error) {
      console.error("Error al obtener las alertas:",error)
    }
  }

  useEffect(() => {
    getAllAlerts()

    const handler = () => {
      getAllAlerts();
      setNotifying(true); // 🔥 Activa la campanita
    };

    alertaEmitter.on('alertaCreada', handler);

    return () => {
      alertaEmitter.off('alertaCreada', handler);
    };
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  function formatearTiempoRelativo(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const segundos = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);
    const años = Math.floor(meses / 12);

    if (segundos < 60) return "Hace unos segundos";
    if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? "s" : ""}`;
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? "s" : ""}`;
    if (dias < 30) return `Hace ${dias} día${dias > 1 ? "s" : ""}`;
    if (meses < 12) return `Hace ${meses} mes${meses > 1 ? "es" : ""}`;
    return `Hace ${años} año${años > 1 ? "s" : ""}`;
  }

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notificaciones
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {alerts.map((alert, index) => (
            <li
              key={index}
              className="flex items-start gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <div className="text-xl mt-1">
                {alert.tipo}
              </div>
              <div className="flex flex-col w-full">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {alert.mensaje}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatearTiempoRelativo(alert.timestamp)}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <Link
          to="/alerta-notificaciones"
          onClick={() => setIsOpen(false)}
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          Ver todas las notificaciones
        </Link>
      </Dropdown>
    </div>
  );
}
