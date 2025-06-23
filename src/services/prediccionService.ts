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
}

export default prediccionService;
