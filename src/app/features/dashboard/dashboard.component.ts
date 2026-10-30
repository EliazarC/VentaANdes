import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { Atencion, Mascota, Prestacion } from '../../core/models/models';

@Component({
  standalone: true, imports: [RouterLink],
  template: `
  <div class="welcome-row"><div><span class="eyebrow">VISTA GENERAL</span><h1>¡Hola, {{firstName}}! <span class="wave">✦</span></h1><p class="muted">Aquí tienes el resumen de actividad de VetAndes.</p></div><div class="today-chip">◷ &nbsp; {{today}}</div></div>
  <div class="stat-grid">
    <article class="stat-card"><div class="stat-top"><span>Mascotas registradas</span><span class="stat-icon mint">♡</span></div><strong>{{mascotas.length}}</strong><small class="stat-foot">Pacientes en el sistema</small></article>
    <article class="stat-card"><div class="stat-top"><span>Prestaciones activas</span><span class="stat-icon peach">✚</span></div><strong>{{activeServices}}</strong><small class="stat-foot">Servicios disponibles</small></article>
    <article class="stat-card"><div class="stat-top"><span>Atenciones registradas</span><span class="stat-icon blue">▤</span></div><strong>{{atenciones.length}}</strong><small class="stat-foot">Registros encontrados</small></article>
  </div>
  <div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><h3>Accesos rápidos</h3><p>Continúa con tus tareas habituales.</p></div></div><div class="quick-grid">
    @if (auth.tienePermiso('ATENCION_REGISTRAR')) {<a routerLink="/atenciones/nueva" class="quick-card"><span class="quick-icon mint">＋</span><b>Nueva atención</b><small>Registrar una consulta</small><i>→</i></a>}
    @if (auth.tienePermiso('MASCOTA_ESCRIBIR')) {<a routerLink="/mascotas/nueva" class="quick-card"><span class="quick-icon peach">♡</span><b>Registrar mascota</b><small>Agregar un paciente</small><i>→</i></a>}
    @if (auth.tienePermiso('PRESTACION_ESCRIBIR')) {<a routerLink="/prestaciones/nuevo" class="quick-card"><span class="quick-icon blue">✚</span><b>Nueva prestación</b><small>Ampliar el catálogo</small><i>→</i></a>}
    <a routerLink="/atenciones" class="quick-card"><span class="quick-icon lilac">▤</span><b>Ver atenciones</b><small>Consultar registros</small><i>→</i></a>
  </div></section><section class="panel welcome-panel"><div class="welcome-illustration">🐾</div><span class="eyebrow">VETANDES</span><h3>Pequeños cuidados,<br>grandes momentos.</h3><p>Todo lo que necesitas para brindar una atención veterinaria organizada y de calidad.</p></section></div>`
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);
  mascotas: Mascota[] = []; atenciones: Atencion[] = []; activeServices = 0;
  today = new Intl.DateTimeFormat('es-PE', { dateStyle: 'long' }).format(new Date());
  get firstName(): string { return this.auth.usuario()?.nombreCompleto?.split(' ')[0] || 'bienvenido'; }
  ngOnInit(): void {
    if (this.auth.tienePermiso('MASCOTA_LEER')) this.api.mascotas().subscribe({next: x => this.mascotas = x, error: () => {}});
    if (this.auth.tienePermiso('ATENCION_LEER')) this.api.atenciones({}).subscribe({next: x => this.atenciones = x, error: () => {}});
    if (this.auth.tienePermiso('PRESTACION_LEER')) this.api.prestaciones().subscribe({next: x => this.activeServices = x.filter(p => p.activo).length, error: () => {}});
  }
}
