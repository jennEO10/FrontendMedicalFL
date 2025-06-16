import { Invitacion } from "../models/invitacion";
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

export const buildInvitationPayload = (isEditMode: boolean, iteracion: Iteracion, userId: number): Invitacion => {
    const id = isEditMode ? iteracion.idInvitation : 0
  return {
    id,
    code: iteracion.codeInvitation,
    state: iteracion.stateInvitation,
    iterationId: iteracion.id,
    userId,
  };
};
