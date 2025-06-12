import * as ite from '../api/iteracionesApi';
import { Iteracion } from '../models/iteracion';

const iteracionService = {
  getAllIteraciones: async () => {
    try {
      const iteraciones = await ite.getIteraciones();
      console.log("Obtener todas las iteraciones:", iteraciones);
      return iteraciones;
    } catch (error) {
      console.error("Error al obtener las iteraciones:", error);
      throw error;
    }
  },
  addIteracion: async (data: Iteracion) => {
    try {
      const iteraciones = await ite.createIteracion(data);
      console.log("Crear iteración:", iteraciones);
      return iteraciones;
    } catch (error) {
      console.error("Error al crear la iteración:", error);
      throw error;
    }
  },
  updIteracion: async (id: number, data: Iteracion) => {
    try {
      const iteraciones = await ite.updateIteracion(id, data);
      console.log("Actualizar iteración:", iteraciones);
      return iteraciones;
    } catch (error) {
      console.error("Error al actualizar la iteración:", error);
      throw error;
    }
  },
  delIteracion: async (id: number) => {
    try {
      const iteraciones = await ite.deleteIteracion(id);
      console.log("Eliminar iteración:", iteraciones);
      return iteraciones;
    } catch (error) {
      console.error("Error al eliminar la iteración:", error);
      throw error;
    }
  }
};

export default iteracionService;