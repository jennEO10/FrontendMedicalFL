import * as logs from '../api/logApi';

const logService = {
    getAllLogs: async () => {
        try {
            const response = await logs.getLogs()
            return response;
        } catch (error) {
            console.error('Error get logs:', error);
            throw error;
        }
    },
}

export default logService;
