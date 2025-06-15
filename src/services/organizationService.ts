import * as org from '../api/organizationsApi';
import { Organization } from '../models/organization';

const organizationService = {
  fetchAll: async () => {
    try {
      const organizations = await org.getOrganizations();
      console.log("Fetched organizations:", organizations);
      return organizations;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  },
  saveOrganization: async (data: Organization) => {
    try {
      const response = await org.createOrganization(data);
      console.log("Organization created:", response);
      return response;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  },
  actualizarOrganization: async (index: number, data: Organization) =>{
    try {
      const response = await org.updateOrganization(index, data);
      console.log("Organization updated:", response);
      return response;
    } catch (error) {
      console.error("Error updating organization:", error);
      throw error;
    }
  },
  delOrganization: async (index: number) => {
    try {
      const response = await org.deleteOrganization(index);
      console.log("Organization deleted:", response);
      return response;
    } catch (error) {
      console.error("Error deleting organization:", error);
      throw error;
    }
  },
  searchOrganization: async (name: string) => {
    try {
      const organization = await org.fetchOrganization(name);
      console.log("Fetched organization:", organization);
      return organization;
    } catch (error) {
      console.error("Error fetching organization:", error);
      throw error;
    }
  },
  getUsersForOrganization: async (id: number) => {
    try {
      const organization = await org.obtenerUsuariosPorOrganizacion(id);
      console.log("Users for organization:", organization);
      return organization;
    } catch (error) {
      console.error("Error get users for organization:", error);
      throw error;
    }
  },
  getOrganization: async (id: number) => {
    try {
      const organization = await org.getOrganization(id);
      console.log("Get organization:", organization);
      return organization;
    } catch (error) {
      console.error("Error get organization:", error);
      throw error;
    }
  }
};

export default organizationService;