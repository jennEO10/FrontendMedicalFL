export interface User {
  id: number;
  username: string;
  password: string;
  enabled: boolean;
  mail: string;
  organizationId: number;
  rolesId: number[];
}

export interface ModalUsuarioProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  usuario: User;
  setUsuario: (val: any) => void;
  roles: { id: number; name: string }[];
  organizations: { id: number; name: string }[];
  modoEdicion?: boolean;
}

export interface EliminarUsuarioModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombreUsuario: string;
}