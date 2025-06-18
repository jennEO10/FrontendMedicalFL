import { Organization } from "./organization"
import { User } from "./user"

export interface Iteracion {
    id: number
    iterationName: string
    iterationNumber: string
    startDate: string
    finishDate: string
    duration: string
    metrics: string
    state: string
    participantsQuantity: string
    userIds: number[]
    organizacionId?: number
    idHyper: number
    minUsuarios: number
    rondas: number
    tiempoLocal: number
    idInvitation: number
    codeInvitation: string
    stateInvitation: string

}

export interface CrearEditarIteracionProps {
  open: boolean;
  onClose: () => void;
  iteracion: Iteracion;
  setIteracion: (val: any) => void;
  isEditMode: boolean;
  onSubmit: () => Promise<number | void>;
  organizaciones: Organization[]
  usuarios: User[];
  openConfirmacion: any;
  setOpenConfirmacion: (val: any) => void;
  ultimaIteracion: any
}

export interface EliminarIteracionModalProps {
  open: boolean;
  iterationName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export interface ConfirmarIteracionModalProps {
  isEditMode: boolean;
  idIteracion: number | void;
  onClose: () => void;
}

export interface HyperParameter {
  id: number,
  localEpochs: number,
  minAvailableClients: number,
  rounds: number,
  iterationId: number,
}

export interface RondasForIteracion {
  id: 0,
  roundNum: 0,
  auc: 0,
  accuracy: 0,
  precision: 0,
  recall: 0,
  f1Score: 0,
  iterationId: 0,
  userId: 0
}

export interface MetricasByIteracion {
  iterationId: 0,
  round: 0,
  accuracy: 0,
  precision: 0,
  recall: 0,
  f1Score: 0,
  auc: 0,
  loss: 0
}

export interface VM {
  rounds: string,
  fractionFit: string,
  fractionEval: string,
  minAvailableClients: string,
  localEpochs: string,
}