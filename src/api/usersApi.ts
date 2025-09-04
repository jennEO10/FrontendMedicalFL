import api from "./axiosConfig";
import { User } from "../models/user";

export const getUsers = async () => {
  const response = await api.get<User[]>(`/api/listar-usuarios`);
  return response.data;
};

export const searchName = async (name: string) => {
  const response = await api.get<User[]>(
    `/api/obtener-usuario-por-nombre/${name}`
  );
  return response.data;
};

export const searchMail = async (mail: string) => {
  const response = await api.get<User>(
    `/api/obtener-usuario-por-correo/${mail}`
  );
  return response.data;
};

export const selectedRole = async (role: number) => {
  const response = await api.get<User[]>(
    `/api/filtrar-usuarios-por-rol-id/${role}`
  );
  return response.data;
};

export const selectedEstado = async (estado: boolean) => {
  const response = await api.get<User[]>(
    `/api/filtrar-usuarios-por-estado/${estado}`
  );
  return response.data;
};

export const searchRoleName = async (roleName: string) => {
  const response = await api.get<User[]>(
    `/api/filtrar-usuarios-por-nombre-rol/${roleName}`
  );
  return response.data;
};

export const createUser = async (data: User) => {
  const response = await api.post<User>(`/api/crear-usuario`, data);
  return response.data;
};

export const updateUser = async (id: number, data: User) => {
  const response = await api.patch<User>(`/api/actualizar-usuario/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/api/eliminar-usuario/${id}`);
  return response;
};

export const getUser = async (id: number) => {
  const response = await api.get<User>(`/api/obtener-usuario/${id}`);
  return response.data;
};

export const activateUser = async (id: number) => {
  const response = await api.patch<User>(`/api/activar-usuario/${id}`);
  return response.data;
};

export const deactivateUser = async (id: number) => {
  const response = await api.patch<User>(`/api/desactivar-usuario/${id}`);
  return response.data;
};

export const updatePassword = async (id: number, newPassword: string) => {
  const response = await api.patch(`/api/actualizar-contraseña/${id}`, {
    password: newPassword,
  });
  return response.data;
};
