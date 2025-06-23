import * as alerta from '../api/alertaApi';
import { Alerta } from '../models/aletas';

const alertaService = {
    getAllAlerts: async () => {
        try {
            const response = await alerta.getAlerts()
            return response;
        } catch (error) {
            console.error('Error get alerts:', error);
            throw error;
        }
    },
    nuevaAlerta: async (data: Alerta) => {
        try {
            const response = await alerta.createAlert(data)
            return response;
        } catch (error) {
            console.error('Error create alert:', error);
            throw error;
        }
    },
}

export default alertaService;
