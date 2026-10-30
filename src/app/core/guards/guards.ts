import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.autenticado() || router.createUrlTree(['/login']);
};

export const invitadoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return !auth.autenticado() || router.createUrlTree(['/']);
};

export const permisoGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const permiso = route.data['permiso'] as string | undefined;
  return !permiso || auth.tienePermiso(permiso) || router.createUrlTree(['/acceso-denegado']);
};
