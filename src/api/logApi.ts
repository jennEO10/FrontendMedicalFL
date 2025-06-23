import api from './axiosConfig'
import { Log } from '../models/log';

export const getLogs = async () => {
    const response = await api.get<Log[]>(`/api/logs/all`);
    return response.data;
};