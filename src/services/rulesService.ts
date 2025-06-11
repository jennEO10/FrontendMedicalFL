import * as ruleService from '../api/rulesApi';
import { Rule } from '../models/rules';

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
    newRule: async (data: Rule) => {
        try {
            const response = await ruleService.createRule(data);
            return response;
        } catch (error) {
            console.error('Error creating rule:', error);
            throw error;
        }
    },
    updRule: async (id: number, data: Rule) => {
        try {
            const response = await ruleService.updateRule(id, data);
            return response;
        } catch (error) {
            console.error('Error updating rule:', error);
            throw error;
        }
    },
    delRule: async (id: number) => {
        try {
            const response = await ruleService.deleteRule(id);
            return response;
        } catch (error) {
            console.error('Error deleting rule:', error);
            throw error;
        }
    },
    getPermissions: async (id_role: number) => {
        try {
            const response = await ruleService.getPermissionRole(id_role);
            return response;
        } catch (error) {
            console.error('Error fetching permissions:', error);
            throw error;
        }
    },
    allPermisos: async () => {
        try {
            const response = await ruleService.getPermisos();
            return response;
        } catch (error) {
            console.error('Error all permissions:', error);
            throw error;
        }
    },
    añadirPermisosRol: async (idRole: number, data: any[]) => {
        try {
            const response = await ruleService.addPermisosRole(idRole, data);
            return response;
        } catch (error) {
            console.error('Error al añadir permisos al rol', error);
            throw error;
        }
    },
    eliminarPermisosRol: async (idRole: number, data: any[]) => {
        try {
            const response = await ruleService.deletePermisosRole(idRole, data);
            return response;
        } catch (error) {
            console.error('Error al añadir permisos al rol', error);
            throw error;
        }
    },
}

export default rulesService;
