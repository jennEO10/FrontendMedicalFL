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
}

export interface CrearEditarIteracionProps {
  open: boolean;
  onClose: () => void;
  iteracion: Iteracion;
  setIteracion: (val: any) => void;
  isEditMode: boolean;
  onSubmit: (val: any) => void;
}

export interface EliminarIteracionModalProps {
  open: boolean;
  iterationName: string;
  onClose: () => void;
  onConfirm: () => void;
}