import * as auth from '../api/authApi';
import { LoginSchema } from "../models/login";

const loginService = {
  authLogin: async (login: LoginSchema) => {
    try {
      const response = await auth.login(login);
      return response;
    } catch (error) {
      console.error("Error al loguearse:", error);
      throw error;
    }
  },
  authLoginFirebase: async (idToken: string) => {
    try {
      const response = await auth.loginFirebase(idToken);
      return response;
    } catch (error) {
      console.error("Error al loguearse por firebase:", error);
      throw error;
    }
  },
};

export default loginService;