import api from './axiosConfig'
import { Alerta } from '../models/aletas';

export const getAlerts = async () => {
    const response = await api.get<Alerta[]>(`/api/alerts/all`);
    return response.data;
};

export const createAlert = async (data: Alerta) => {
  const response = await api.post<Alerta>(`/api/alerts/create`, data);
  return response.data;
};