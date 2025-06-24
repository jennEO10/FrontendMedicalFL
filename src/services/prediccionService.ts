import * as prediccion from '../api/prediccionApi';

const prediccionService = {
    getAllPredictions: async () => {
        try {
            const response = await prediccion.getPredictions();
            return response;
        } catch (error) {
            console.error('Error get predictions:', error);
            throw error;
        }
    },
    crearInferencia: async (data: any) => {
        try {
            const response = await prediccion.createPredicction(data);
            return response;
        } catch (error) {
            console.error('Error create inference:', error);
            throw error;
        }
    },
}

export default prediccionService;
