import axios from 'axios';
import { Rule } from '../models/rules';

const API_URL = 'https://graphic-brook-404722.uc.r.appspot.com';

export const getRules = async () => {
  const response = await axios.get<Rule[]>(`${API_URL}/api/listar-roles`);
  return response.data;
};

export const createRule = async (data: Rule) => {
  const response = await axios.post(`${API_URL}/api/crear-rol`, data);
  return response;
};

export const updateRule = async (id: number, data: Rule) => {
  const response = await axios.patch(`${API_URL}/api/actualizar-rol/${id}`, data);
  return response;
};

export const deleteRule = async (id: number) => {
  const response = await axios.delete(`${API_URL}/api/eliminar-rol/${id}`);
  return response;
};
