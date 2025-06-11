export interface Rule {
  id: number;
  name: string;
  permissions: PermissionRole[];
}

export interface PermissionRole {
  id: number;
  name: string;
  description: string;
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

// Permisos
export interface Permisos {
  id: number
  name: string
  description: string
  checked?: boolean
}

export interface ModuloPermisos {
  nombre: string
  permisos: Permisos[]
}