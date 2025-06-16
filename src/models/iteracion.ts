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