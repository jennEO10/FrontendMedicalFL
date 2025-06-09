export interface Rule {
  id: number;
  name: string;
}

export interface ModalRolProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  rol: Rule;
  setRol: (val: any) => void;
  modoEdicion?: boolean;
}

export interface ModalEliminarRolProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombreRol: string;
}