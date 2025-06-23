import api from './axiosConfig'
import { Invitacion } from '../models/invitacion';

export const getInvitations = async () => {
  const response = await api.get<Invitacion[]>(`/api/listar-codigos-invitacion`);
  return response.data;
};

export const getInvitationForUser = async (id: number) => {
  const response = await api.get<Invitacion[]>(`/api/listar-codigos-invitacion-por-usuario/${id}`);
  return response.data;
};

export const createInvitation = async (data: Invitacion) => {
  const response = await api.post(`/api/crear-codigo-invitacion`, data);
  return response;
};

// export const updateUser = async (id: number, data: User) => {
//   const response = await axios.patch(`${API_URL}/api/actualizar-usuario/${id}`, data);
//   return response;
// };

// export const deleteUser = async (id: number) => {
//   const response = await axios.delete(`${API_URL}/api/eliminar-usuario/${id}`);
//   return response;
// };
