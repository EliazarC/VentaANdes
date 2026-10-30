import { Routes } from '@angular/router';
import { authGuard, invitadoGuard, permisoGuard } from './core/guards/guards';

export const routes: Routes = [
  { path: 'login', canActivate: [invitadoGuard], loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  {
    path: '', canActivate: [authGuard], loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'prestaciones', canActivate: [permisoGuard], data: { permiso: 'PRESTACION_LEER' }, loadComponent: () => import('./features/prestaciones/prestaciones.component').then(m => m.PrestacionesComponent) },
      { path: 'prestaciones/nuevo', canActivate: [permisoGuard], data: { permiso: 'PRESTACION_ESCRIBIR' }, loadComponent: () => import('./features/prestaciones/prestacion-form.component').then(m => m.PrestacionFormComponent) },
      { path: 'prestaciones/:id/editar', canActivate: [permisoGuard], data: { permiso: 'PRESTACION_ESCRIBIR' }, loadComponent: () => import('./features/prestaciones/prestacion-form.component').then(m => m.PrestacionFormComponent) },
      { path: 'mascotas', canActivate: [permisoGuard], data: { permiso: 'MASCOTA_LEER' }, loadComponent: () => import('./features/mascotas/mascotas.component').then(m => m.MascotasComponent) },
      { path: 'mascotas/nueva', canActivate: [permisoGuard], data: { permiso: 'MASCOTA_ESCRIBIR' }, loadComponent: () => import('./features/mascotas/mascota-form.component').then(m => m.MascotaFormComponent) },
      { path: 'mascotas/:id/editar', canActivate: [permisoGuard], data: { permiso: 'MASCOTA_ESCRIBIR' }, loadComponent: () => import('./features/mascotas/mascota-form.component').then(m => m.MascotaFormComponent) },
      { path: 'atenciones', canActivate: [permisoGuard], data: { permiso: 'ATENCION_LEER' }, loadComponent: () => import('./features/atenciones/atenciones.component').then(m => m.AtencionesComponent) },
      { path: 'atenciones/nueva', canActivate: [permisoGuard], data: { permiso: 'ATENCION_REGISTRAR' }, loadComponent: () => import('./features/atenciones/atencion-form.component').then(m => m.AtencionFormComponent) },
      { path: 'atenciones/:id', canActivate: [permisoGuard], data: { permiso: 'ATENCION_LEER' }, loadComponent: () => import('./features/atenciones/atencion-detail.component').then(m => m.AtencionDetailComponent) },
      { path: 'reportes', canActivate: [permisoGuard], data: { permiso: 'REPORTE_VER' }, loadComponent: () => import('./features/reportes/reportes.component').then(m => m.ReportesComponent) },
      { path: 'acceso-denegado', loadComponent: () => import('./shared/pages/acceso-denegado.component').then(m => m.AccesoDenegadoComponent) },
      { path: '**', loadComponent: () => import('./shared/pages/no-encontrado.component').then(m => m.NoEncontradoComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
