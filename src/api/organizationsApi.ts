import api from './axiosConfig'
import { Organization } from '../models/organization'
import { User } from '../models/user';

export const getOrganizations = async () => {
  const response = await api.get<Organization[]>(`/api/listar-organizaciones`);
  return response.data;
};

export const fetchOrganization = async (name: string) => {
  const response = await api.get<Organization>(`/api/obtener-organizacion-por-nombre/${name}`);
  return [response.data];
};

export const createOrganization = async (data: Organization) => {
  const response = await api.post(`/api/crear-organizacion`, data);
  return response;
};

export const updateOrganization = async (id: number, data: Organization) => {
  const response = await api.patch(`/api/actualizar-organizacion/${id}`, data);
  return response;
};

export const deleteOrganization = async (id: number) => {
  const response = await api.delete(`/api/eliminar-organizacion/${id}`);
  return response;
};

export const obtenerUsuariosPorOrganizacion = async (id: number) => {
  const response = await api.get<User[]>(`/api/${id}/usuarios-activos`);
  return response.data;
};

export const getOrganization = async (id: number) => {
  const response = await api.get<Organization>(`/api/obtener-organizacion/${id}`);
  return response.data;
};