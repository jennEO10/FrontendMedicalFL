import * as invitacion from '../api/invitacionApi';
import { Invitacion } from '../models/invitacion';

const invitacionService = {
    getAllInvitations: async () => {
        try {
            const response = await invitacion.getInvitations()
            return response;
        } catch (error) {
            console.error('Error fetching invitacions:', error);
            throw error;
        }
    },
    newInvitation: async (data: Invitacion) => {
        try {
            const response = await invitacion.createInvitation(data);
            return response;
        } catch (error) {
            console.error('Error creating invitation:', error);
            throw error;
        }
    },
    // updRule: async (id: number, data: Rule) => {
    //     try {
    //         const response = await ruleService.updateRule(id, data);
    //         return response;
    //     } catch (error) {
    //         console.error('Error updating rule:', error);
    //         throw error;
    //     }
    // },
    // delRule: async (id: number) => {
    //     try {
    //         const response = await ruleService.deleteRule(id);
    //         return response;
    //     } catch (error) {
    //         console.error('Error deleting rule:', error);
    //         throw error;
    //     }
    // },
    // getPermissions: async (id_role: number) => {
    //     try {
    //         const response = await ruleService.getPermissionRole(id_role);
    //         return response;
    //     } catch (error) {
    //         console.error('Error fetching permissions:', error);
    //         throw error;
    //     }
    // },
    // allPermisos: async () => {
    //     try {
    //         const response = await ruleService.getPermisos();
    //         return response;
    //     } catch (error) {
    //         console.error('Error all permissions:', error);
    //         throw error;
    //     }
    // },
    // añadirPermisosRol: async (idRole: number, data: any[]) => {
    //     try {
    //         const response = await ruleService.addPermisosRole(idRole, data);
    //         return response;
    //     } catch (error) {
    //         console.error('Error al añadir permisos al rol', error);
    //         throw error;
    //     }
    // },
    // eliminarPermisosRol: async (idRole: number, data: any[]) => {
    //     try {
    //         const response = await ruleService.deletePermisosRole(idRole, data);
    //         return response;
    //     } catch (error) {
    //         console.error('Error al añadir permisos al rol', error);
    //         throw error;
    //     }
    // },
    // obtenerRole: async (id: number) => {
    //     try {
    //         const response = await ruleService.getRule(id);
    //         return response;
    //     } catch (error) {
    //         console.error('Error al obtener el rol', error);
    //         throw error;
    //     }
    // }
}

export default invitacionService;
