import { HyperParameter, Iteracion } from "../models/iteracion";

export const buildHyperparameterPayload = (isEditMode: boolean, iteracion: Iteracion, iterationId: number): HyperParameter => {
    const id = isEditMode ? iteracion.idHyper : 0
  return {
    id,
    localEpochs: iteracion.tiempoLocal,
    minAvailableClients: iteracion.minUsuarios,
    rounds: iteracion.rondas,
    iterationId,
  };
};
