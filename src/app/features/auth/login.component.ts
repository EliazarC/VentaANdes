import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
  <main class="login-screen">
    <section class="login-art"><div class="login-brand"><span class="brand-mark">V</span><b>VetAndes</b></div><div class="art-copy"><span class="pill-light">CUIDAMOS DE QUIENES AMAS</span><h1>La salud de tu mascota, <em>en buenas manos.</em></h1><p>Una gestión más cercana, ordenada y segura para cada atención.</p></div><div class="art-foot">✦ &nbsp; Cuidamos con vocación, atendemos con corazón.</div></section>
    <section class="login-panel"><div class="login-box"><div class="mobile-brand"><span class="brand-mark">V</span><b>VetAndes</b></div><span class="eyebrow">BIENVENIDO DE NUEVO</span><h2>Iniciar sesión</h2><p class="muted">Ingresa tus credenciales para acceder al sistema.</p>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Usuario</label><input formControlName="username" placeholder="Ej. recepcion" autocomplete="username">
        @if (form.controls.username.touched && form.controls.username.invalid) {<small class="field-error">Ingresa tu usuario.</small>}
        <label>Contraseña</label><input type="password" formControlName="password" placeholder="Tu contraseña" autocomplete="current-password">
        @if (form.controls.password.touched && form.controls.password.invalid) {<small class="field-error">Ingresa tu contraseña.</small>}
        @if (error) {<div class="alert error">{{error}}</div>}
        <button class="btn btn-primary btn-full" [disabled]="form.invalid || loading">{{loading ? 'Ingresando…' : 'Ingresar al sistema'} <span>→</span></button>
      </form><div class="login-note"><span>▣</span> Acceso protegido con autenticación segura.</div></div><footer>© 2026 VetAndes · Clínica Veterinaria</footer></section>
  </main>`
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  form = this.fb.nonNullable.group({ username: ['', Validators.required], password: ['', Validators.required] });
  loading = false; error = '';
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password).subscribe({
      next: () => { this.loading = false; this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') || '/'); },
      error: (e: HttpErrorResponse) => { this.loading = false; this.error = e.error?.mensaje || 'Usuario o contraseña incorrectos.'; }
    });
  }
}
