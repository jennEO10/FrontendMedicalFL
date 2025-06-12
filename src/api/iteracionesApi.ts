import axios from 'axios';
import { Iteracion } from '../models/iteracion';

const API_URL = 'https://graphic-brook-404722.uc.r.appspot.com';

export const getIteraciones = async () => {
  const response = await axios.get<Iteracion[]>(`${API_URL}/api/listar-iteraciones`);
  return response.data;
};

// export const getPermissionRole = async (id_role: number) => {
//   const response = await axios.get<PermissionRole[]>(`${API_URL}/api/ver-permisos-de-rol/${id_role}`);
//   return response.data;
// };

export const createIteracion = async (data: Iteracion) => {
  const response = await axios.post(`${API_URL}/api/crear-iteracion`, data);
  return response;
};

export const updateIteracion = async (id: number, data: Iteracion) => {
  const response = await axios.patch(`${API_URL}/api/actualizar-iteracion/${id}`, data);
  return response;
};

export const deleteIteracion = async (id: number) => {
  const response = await axios.delete(`${API_URL}/api/eliminar-iteracion/${id}`);
  return response;
};