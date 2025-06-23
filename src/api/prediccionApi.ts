import { Prediccion } from '../models/prediccion';
import api from './axiosConfig'

export const getPredictions = async () => {
    const response = await api.get<Prediccion[]>(`/api/predictions`);
    return response.data;
};

// export const getPredictionsByUser = async () => {
//     const response = await api.get<Prediccion[]>(`/api/predictions/`);
//     return response.data;
// };