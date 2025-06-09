import * as ruleService from '../api/rulesApi';

const rulesService = {
    getAllRules: async () => {
        try {
            const response = await ruleService.getRules();
            return response;
        } catch (error) {
            console.error('Error fetching rules:', error);
            throw error;
        }
    },
}

export default rulesService;
