import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status === 401 && !req.url.endsWith('/auth/login')) {
      const returnUrl = router.url;
      auth.logout(false);
      router.navigate(['/login'], { queryParams: { returnUrl } });
    }
    return throwError(() => error);
  }));
};
