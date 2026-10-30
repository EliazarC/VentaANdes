import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, UsuarioSesion } from '../models/models';

interface StoredSession {
  token: string; expiraEn: number; usuario: UsuarioSesion;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'vetandes.session';
  private readonly stored = this.readSession();
  private readonly sessionSignal = signal<StoredSession | null>(this.isValid(this.stored) ? this.stored : null);
  readonly usuario = computed(() => this.sessionSignal()?.usuario ?? null);
  readonly autenticado = computed(() => !!this.sessionSignal());
  readonly permisos = computed(() => this.usuario()?.permisos ?? []);

  constructor(private http: HttpClient, private router: Router) {
    if (this.stored && !this.isValid(this.stored)) this.logout(false);
    const expiraEn = this.sessionSignal()?.expiraEn;
    if (expiraEn) window.setTimeout(() => {
      if (this.sessionSignal() && Date.now() >= expiraEn) this.logout();
    }, Math.max(0, expiraEn - Date.now()));
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap(response => {
        const session: StoredSession = {
          token: response.token,
          expiraEn: Date.now() + response.expiraEnSegundos * 1000,
          usuario: {
            username,
            nombreCompleto: response.nombreCompleto,
            roles: response.roles ?? [],
            permisos: response.permisos ?? []
          }
        };
        sessionStorage.setItem(this.key, JSON.stringify(session));
        this.sessionSignal.set(session);
      })
    );
  }

  token(): string | null { return this.sessionSignal()?.token ?? null; }
  tienePermiso(permiso: string): boolean { return this.permisos().includes(permiso); }

  logout(redirect = true): void {
    sessionStorage.removeItem(this.key);
    this.sessionSignal.set(null);
    if (redirect) this.router.navigate(['/login']);
  }

  private readSession(): StoredSession | null {
    try {
      const raw = sessionStorage.getItem(this.key);
      return raw ? JSON.parse(raw) as StoredSession : null;
    } catch { return null; }
  }
  private isValid(value: StoredSession | null): value is StoredSession {
    return !!value?.token && !!value.expiraEn && value.expiraEn > Date.now();
  }
}
