import api from './axiosConfig'
import { HyperParameter, Iteracion, MetricasByIteracion, RondasForIteracion, VM } from '../models/iteracion';

export const getIteraciones = async () => {
  const response = await api.get<Iteracion[]>(`/api/listar-iteraciones`);
  return response.data;
};

export const createIteracion = async (data: Iteracion) => {
  const response = await api.post<Iteracion>(`/api/crear-iteracion`, data);
  return response.data;
};

export const updateIteracion = async (id: number, data: Iteracion) => {
  const response = await api.patch<Iteracion>(`/api/actualizar-iteracion/${id}`, data);
  return response;
};

export const deleteIteracion = async (id: number) => {
  const response = await api.delete(`/api/eliminar-iteracion/${id}`);
  return response;
};

export const getLastInteraction = async () => {
  const response = await api.get<Iteracion>(`/api/obtener-ultima-iteracion`);
  return response.data;
}

export const getLastInteractionByUser = async (userId: number) => {
  const response = await api.get<Iteracion[]>(`/api/listar-iteraciones-por-usuario/${userId}`);
  return response.data;
}

// Hyperparameters
export const getHyperIteracion = async (idIteracion: number) => {
  const response = await api.get<HyperParameter>(`/api/listar-hyperparametros-por-iteracion/${idIteracion}`);
  return response.data;
};

export const createHyper = async (data: HyperParameter) => {
  const response = await api.post(`/api/crear-hyperparametro`, data);
  return response;
};

export const updateHyper = async (id: number, data: HyperParameter) => {
  const response = await api.patch(`/api/actualizar-hyperparametro/${id}`, data);
  return response;
};

// Rondas
export const getRondasIteration = async (idIteracion: number) => {
  const response = await api.get<RondasForIteracion[]>(`/api/listar-rondas-por-iteracion/${idIteracion}`);
  return response.data;
};

export const exportMetricsByIteration = async (idIteracion: number) => {
  const response = await api.get<MetricasByIteracion[]>(`/api/metrics/iteration/${idIteracion}`);
  return response.data;
};

// Activar VM
export const launchVM = async (vm: VM) => {
  const response = await api.post(`/api/vm/launch`, null, { params: vm });
  return response;
};

//Métricas
export const getLastMetricByIteration = async (idIteracion: number) => {
  const response = await api.get<MetricasByIteracion[]>(`/api/metrics/latest/iteration/${idIteracion}`);
  return response.data;
};

export const getLastMetrics = async () => {
  const response = await api.get<MetricasByIteracion[]>(`/api/metrics/latest`);
  return response.data;
};

export const getMetricsByUser = async (userId: number, iterationId: number) => {
  const response = await api.get<MetricasByIteracion[]>(`/api/usermetrics/user/${userId}/iteration/${iterationId}`);
  return response.data;
};