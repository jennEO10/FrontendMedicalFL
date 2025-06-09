import axios from 'axios';
import { User } from '../models/user';

const API_URL = 'https://graphic-brook-404722.uc.r.appspot.com';

export const getUsers = async () => {
  const response = await axios.get<User[]>(`${API_URL}/api/listar-usuarios`);
  return response.data;
};

export const fetchOrganization = async (name: string) => {
  const response = await axios.get(`${API_URL}/api/obtener-organizacion-por-nombre/${name}`);
  return [response.data];
};

export const createUser = async (data: User) => {
  const response = await axios.post(`${API_URL}/api/crear-usuario`, data);
  return response;
};

export const updateUser = async (id: number, data: User) => {
  const response = await axios.patch(`${API_URL}/api/actualizar-usuario/${id}`, data);
  return response;
};

export const deleteUser = async (id: number) => {
  const response = await axios.delete(`${API_URL}/api/eliminar-usuario/${id}`);
  return response;
};
