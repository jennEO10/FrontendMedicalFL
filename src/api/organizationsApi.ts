import axios from 'axios';
import { Organization } from '../models/organization'

const API_URL = 'https://graphic-brook-404722.uc.r.appspot.com';

export const getOrganizations = async () => {
  const response = await axios.get<Organization[]>(`${API_URL}/api/listar-organizaciones`);
  return response.data;
};

export const fetchOrganization = async (name: string) => {
  const response = await axios.get(`${API_URL}/api/obtener-organizacion-por-nombre/${name}`);
  return [response.data];
};

export const createOrganization = async (data: Organization) => {
  const response = await axios.post(`${API_URL}/api/crear-organizacion`, data);
  return response;
};

export const updateOrganization = async (id: number, data: Organization) => {
  const response = await axios.patch(`${API_URL}/api/actualizar-organizacion/${id}`, data);
  return response;
};

export const deleteOrganization = async (id: number) => {
  const response = await axios.delete(`${API_URL}/api/eliminar-organizacion/${id}`);
  return response;
};