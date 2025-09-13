import { Prediccion } from "../models/prediccion";
import api from "./axiosConfig";

export const getPredictions = async () => {
  const response = await api.get<Prediccion[]>(`/api/predictions`);
  return response.data;
};

export const getPredictionsByUser = async (userId: string) => {
  const response = await api.get<Prediccion[]>(
    `/api/predictions/user/${userId}`
  );
  return response.data;
};

export const createPredicction = async (data: any) => {
  const response = await api.post(`/api/inferencia/predict`, data);
  return response.data;
};
