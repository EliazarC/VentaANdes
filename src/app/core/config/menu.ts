export interface MenuItem { label: string; icon: string; route: string; permiso?: string; }
export const MENU_ITEMS: MenuItem[] = [
  { label: 'Resumen', icon: '⌂', route: '/' },
  { label: 'Prestaciones', icon: '✚', route: '/prestaciones', permiso: 'PRESTACION_LEER' },
  { label: 'Mascotas', icon: '♡', route: '/mascotas', permiso: 'MASCOTA_LEER' },
  { label: 'Atenciones', icon: '▤', route: '/atenciones', permiso: 'ATENCION_LEER' },
  { label: 'Nueva atención', icon: '+', route: '/atenciones/nueva', permiso: 'ATENCION_REGISTRAR' },
  { label: 'Reportes', icon: '▥', route: '/reportes', permiso: 'REPORTE_VER' }
];
