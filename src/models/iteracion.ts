import { Organization } from "./organization"

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
}

export interface CrearEditarIteracionProps {
  open: boolean;
  onClose: () => void;
  iteracion: Iteracion;
  setIteracion: (val: any) => void;
  isEditMode: boolean;
  onSubmit: () => void;
  organizaciones: Organization[]
}

export interface EliminarIteracionModalProps {
  open: boolean;
  iterationName: string;
  onClose: () => void;
  onConfirm: () => void;
}