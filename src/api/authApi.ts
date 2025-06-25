import axios from 'axios';
import { LoginSchema } from '../models/login';

const API_URL = 'https://graphic-brook-404722.uc.r.appspot.com';

export const login = async (login: LoginSchema) => {
  const response = await axios.post(`${API_URL}/auth/login`, login);
  return response.data;
};

export const loginFirebase = async (idToken: string) => {
  const response = await axios.post(`${API_URL}/auth/firebase-login`, {"idToken": idToken});
  return response.data;
};
