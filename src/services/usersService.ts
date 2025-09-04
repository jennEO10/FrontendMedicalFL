import * as userApi from "../api/usersApi";
import { User } from "../models/user";

const userService = {
  getAllUsers: async () => {
    try {
      const users = await userApi.getUsers();
      console.log("Fetched users:", users);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
  newUser: async (data: User) => {
    try {
      const response = await userApi.createUser(data);
      console.log("User created:", response);
      return response;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
  updateUser: async (id: number, data: User) => {
    try {
      const response = await userApi.updateUser(id, data);
      console.log("User updated:", response);
      return response;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
  deleteUser: async (id: number) => {
    try {
      const response = await userApi.deleteUser(id);
      console.log("User deleted:", response);
      return response;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
  buscarNombre: async (name: string) => {
    try {
      const response = await userApi.searchName(name);
      console.log("User found by name:", response);
      return response;
    } catch (error) {
      console.error("Error searching user by name:", error);
      throw error;
    }
  },
  buscarEmail: async (email: string) => {
    try {
      const response = await userApi.searchMail(email);
      console.log("User found by email:", response);
      return response;
    } catch (error) {
      console.error("Error searching user by email:", error);
      throw error;
    }
  },
  seleccionarRol: async (rol: number) => {
    try {
      const response = await userApi.selectedRole(rol);
      console.log("Users found by role:", response);
      return response;
    } catch (error) {
      console.error("Error searching users by role:", error);
      throw error;
    }
  },
  seleccionarEstado: async (estado: boolean) => {
    try {
      const response = await userApi.selectedEstado(estado);
      console.log("Users found by status:", response);
      return response;
    } catch (error) {
      console.error("Error searching users by status:", error);
      throw error;
    }
  },
  buscarNombreRol: async (rolName: string) => {
    try {
      const response = await userApi.searchRoleName(rolName);
      console.log("Users found by role name:", response);
      return response;
    } catch (error) {
      console.error("Error searching users by role name:", error);
      throw error;
    }
  },
  getUser: async (id: number) => {
    try {
      const response = await userApi.getUser(id);
      console.log("Get user:", response);
      return response;
    } catch (error) {
      console.error("Error get User:", error);
      throw error;
    }
  },
  activarUsuario: async (id: number) => {
    try {
      const response = await userApi.activateUser(id);
      console.log("Activate user:", response);
      return response;
    } catch (error) {
      console.error("Error activating user:", error);
      throw error;
    }
  },
  desactivarUsuario: async (id: number) => {
    try {
      const response = await userApi.deactivateUser(id);
      console.log("Deactivate user:", response);
      return response;
    } catch (error) {
      console.error("Error deactivating user:", error);
      throw error;
    }
  },
  actualizarContraseña: async (id: number, newPassword: string) => {
    try {
      const response = await userApi.updatePassword(id, newPassword);
      console.log("Password updated:", response);
      return response;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },
};

export default userService;
