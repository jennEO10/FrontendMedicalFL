import api from './axiosConfig'
import { Permisos, PermissionRole, Rule } from '../models/rules';

export const getRules = async () => {
  const response = await api.get<Rule[]>(`/api/listar-roles`);
  return response.data;
};

export const getRule = async (id: number) => {
  const response = await api.get<Rule>(`/api/obtener-rol/${id}`);
  return response.data;
};

export const getPermissionRole = async (id_role: number) => {
  const response = await api.get<PermissionRole[]>(`/api/ver-permisos-de-rol/${id_role}`);
  return response.data;
};

export const createRule = async (data: Rule) => {
  const response = await api.post(`/api/crear-rol`, data);
  return response;
};

export const updateRule = async (id: number, data: Rule) => {
  const response = await api.patch(`/api/actualizar-rol/${id}`, data);
  return response;
};

export const deleteRule = async (id: number) => {
  const response = await api.delete(`/api/eliminar-rol/${id}`);
  return response;
};

//PERMISOS
export const getPermisos = async () => {
  const response = await api.get<Permisos[]>(`/api/listar-permisos`);
  return response.data;
};

export const addPermisosRole = async (idRole: number, data: any[]) => {
  const response = await api.post(`/api/agregar-permisos-a-rol/${idRole}`, data);
  return response;
}

export const deletePermisosRole = async (idRole: number, data: any[]) => {
  const response = await api.post(`/api/quitar-permisos-a-rol/${idRole}`, data);
  return response;
}