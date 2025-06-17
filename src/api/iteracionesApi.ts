import axios from 'axios';
import { HyperParameter, Iteracion, RondasForIteracion, VM } from '../models/iteracion';

const API_URL = 'https://graphic-brook-404722.uc.r.appspot.com';

export const getIteraciones = async () => {
  const response = await axios.get<Iteracion[]>(`${API_URL}/api/listar-iteraciones`);
  return response.data;
};

export const createIteracion = async (data: Iteracion) => {
  const response = await axios.post<Iteracion>(`${API_URL}/api/crear-iteracion`, data);
  return response;
};

export const updateIteracion = async (id: number, data: Iteracion) => {
  const response = await axios.patch<Iteracion>(`${API_URL}/api/actualizar-iteracion/${id}`, data);
  return response;
};

export const deleteIteracion = async (id: number) => {
  const response = await axios.delete(`${API_URL}/api/eliminar-iteracion/${id}`);
  return response;
};

// Hyperparameters
export const getHyperIteracion = async (idIteracion: number) => {
  const response = await axios.get<HyperParameter>(`${API_URL}/api/listar-hyperparametros-por-iteracion/${idIteracion}`);
  return response.data;
};

export const createHyper = async (data: HyperParameter) => {
  const response = await axios.post(`${API_URL}/api/crear-hyperparametro`, data);
  return response;
};

export const updateHyper = async (id: number, data: HyperParameter) => {
  const response = await axios.patch(`${API_URL}/api/actualizar-hyperparametro/${id}`, data);
  return response;
};

// Rondas
export const getRondasIteration = async (idIteracion: number) => {
  const response = await axios.get<RondasForIteracion[]>(`${API_URL}/api/listar-rondas-por-iteracion/${idIteracion}`);
  return response.data;
};

// Activar VM
export const launchVM = async (vm: VM) => {
  const response = await axios.post(`${API_URL}/api/vm/launch`, null, { params: vm });
  return response;
};