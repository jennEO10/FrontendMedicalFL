import * as ite from '../api/iteracionesApi';
import { HyperParameter, Iteracion, VM } from '../models/iteracion';

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
  },
  creatHyper: async (data: HyperParameter) =>  {
    try {
      const hyper = await ite.createHyper(data);
      console.log("Crear Hyper:", hyper);
      return hyper;
    } catch (error) {
      console.error("Error al crear el hyper:", error);
      throw error;
    }
  },
  actualizarHyper: async (id: number, data: HyperParameter) =>  {
    try {
      const hyper = await ite.updateHyper(id, data);
      console.log("Actualizar Hyper:", hyper);
      return hyper;
    } catch (error) {
      console.error("Error al actualizar el hyper:", error);
      throw error;
    }
  },
  obtenerHyperIteracion: async (idIteracion: number) =>  {
    try {
      const hyper = await ite.getHyperIteracion(idIteracion);
      console.log("Obtener Hyper por Iteración:", hyper);
      return hyper;
    } catch (error) {
      console.error("Error al obtener Hyper por Iteración:", error);
      throw error;
    }
  },
  obtenerRondasIteracion: async (idIteracion: number) =>  {
    try {
      const rondas = await ite.getRondasIteration(idIteracion);
      console.log("Obtener Rondas por Iteración:", rondas);
      return rondas;
    } catch (error) {
      console.error("Error al obtener Rondas por Iteración:", error);
      throw error;
    }
  },
  exportarMetricasPorIteracion: async (idIteracion: number) =>  {
    try {
      const rondas = await ite.exportMetricsByIteration(idIteracion);
      console.log("Obtener Métricas por Iteración:", rondas);
      return rondas;
    } catch (error) {
      console.error("Error al obtener Métricas por Iteración:", error);
      throw error;
    }
  },
  obtenerUltimaMetricaPorIteracion: async (idIteracion: number) =>  {
    try {
      const rondas = await ite.getLastMetricByIteration(idIteracion);
      console.log("Obtener última Métrica por Iteración:", rondas);
      return rondas;
    } catch (error) {
      console.error("Error al obtener última Métrica por Iteración:", error);
      throw error;
    }
  },
  lanzarVM: async (vm: VM) =>  {
    try {
      const rondas = await ite.launchVM(vm);
      console.log("VM Lanzada:", rondas);
      return rondas;
    } catch (error) {
      console.error("Error al lanzar el VM:", error);
      throw error;
    }
  },
  obtenerUltimaIteracion: async () => {
    try {
      const response = await ite.getLastInteraction();
      console.log("Última iteracción:", response);
      return response;
    } catch (error) {
      console.error("Error al obtener la última interacion:", error);
      throw error;
    }
  },
  obtenerUltimaIteracionPorUsuario: async (userId: number) => {
    try {
      const response = await ite.getLastInteractionByUser(userId);
      console.log("Última iteración por usuario:", response);
      return response;
    } catch (error) {
      console.error("Error al obtener la última interacion por usuario:", error);
      throw error;
    }
  },
};

export default iteracionService;