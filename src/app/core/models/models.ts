export interface UsuarioSesion {
  username: string;
  nombreCompleto: string;
  roles: string[];
  permisos: string[];
}
export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEnSegundos: number;
  nombreCompleto: string;
  roles: string[];
  permisos: string[];
}
export interface Prestacion {
  id: number; codigo: string; nombre: string; precio: number;
  especieAplicable: string; activo: boolean;
}
export interface Propietario {
  id: number; dni: string; nombres: string; telefono?: string;
}
export interface Mascota {
  id: number; nombre: string; especie: string;
  raza?: string; fechaNacimiento: string; sexo: 'M' | 'H';
  propietarioId: number; propietarioNombre: string;
}
export interface DetalleAtencion {
  id?: number; prestacionId: number; prestacionNombre?: string;
  cantidad: number; precioUnitario?: number; subtotal?: number;
}
export interface Atencion {
  id: number; numero: string; fecha: string; mascotaId: number;
  mascotaNombre?: string; especie?: string; peso: number; diagnostico?: string;
  estado: 'REGISTRADA' | 'ANULADA'; subtotal: number; descuento: number;
  total: number; detalles: DetalleAtencion[]; motivoAnulacion?: string;
}
export interface ReporteEspecie {
  especie: string; cantidadAtenciones: number; importeTotal: number;
}
export interface ApiError {
  status: number; mensaje?: string; error?: string;
  campos?: Record<string, string>;
}
