export interface Organization {
  id: number;
  name: string;
  descripcion: string;
  contacto: string;
}

export interface OrganizacionModalProps {
  open: boolean;
  onClose: () => void;
  org: { name: string; descripcion: string; contacto: string };
  setNueva: (val: any) => void;
  onSubmit?: () => void;
  modoEdicion: boolean;
}

export interface EliminarOrganizacionModalProps {
  open: boolean;
  nombre: string;
  onClose: () => void;
  onConfirm: () => void;
}