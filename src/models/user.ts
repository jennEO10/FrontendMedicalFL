export interface User {
  id: number;
  username: string;
  password?: string;
  enabled: boolean;
  mail: string;
  organizationId: number;
  rolesId: number[];
  nameOrganization?: string;
  roleName?: string;
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

interface Filtros {
  nombre: string;
  email: string;
  rolName: string;
  estado: number;
  rol: number;
}

export interface FiltroDinamicoProps {
  filtros: Filtros;
  setFiltros: (val: any) => void;
  onBuscar: () => void;
  rules: any[];
  setFiltroElegido: (val: any) => void;
  reiniciarCargaDatos: (val: string) => void;
}
