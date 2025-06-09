import axios from 'axios';
import { Rule } from '../models/rules';

const API_URL = 'https://graphic-brook-404722.uc.r.appspot.com';

export const getRules = async () => {
  const response = await axios.get<Rule[]>(`${API_URL}/api/listar-roles`);
  return response.data;
};

// export const fetchOrganization = async (name: string) => {
//   const response = await axios.get(`${API_URL}/api/obtener-organizacion-por-nombre/${name}`);
//   return [response.data];
// };

// export const createOrganization = async (data) => {
//   const response = await axios.post(`${API_URL}/api/crear-organizacion`, data);
//   return response;
// };

// export const updateOrganization = async (id: number, data) => {
//   const response = await axios.patch(`${API_URL}/api/actualizar-organizacion/${id}`, data);
//   return response;
// };

// export const deleteOrganization = async (id: number) => {
//   const response = await axios.delete(`${API_URL}/api/eliminar-organizacion/${id}`);
//   return response;
// };
