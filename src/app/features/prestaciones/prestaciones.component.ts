import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { Prestacion } from '../../core/models/models';

@Component({
  standalone: true, imports: [RouterLink, FormsModule, DecimalPipe],
  template: `
  <div class="page-heading"><div><span class="eyebrow">CATÁLOGO</span><h1>Prestaciones</h1><p class="muted">Administra los servicios que ofrece la clínica.</p></div>
    @if (auth.tienePermiso('PRESTACION_ESCRIBIR')) {<a routerLink="/prestaciones/nuevo" class="btn btn-primary">＋ Nueva prestación</a>}
  </div>
  <section class="panel"><div class="toolbar"><div class="search-box"><span>⌕</span><input [(ngModel)]="search" placeholder="Buscar por código o nombre…"></div><span class="result-count">{{filtered.length}} prestaciones</span></div>
  @if (loading) {<div class="loading-state">Cargando prestaciones…</div>}
  @else if (error) {<div class="alert error">{{error}} <button class="link-button" (click)="load()">Reintentar</button></div>}
  @else if (!filtered.length) {<div class="empty-state"><span>✚</span><b>No hay prestaciones para mostrar</b><small>Prueba con otra búsqueda o registra una nueva.</small></div>}
  @else {<div class="table-wrap"><table><thead><tr><th>CÓDIGO</th><th>PRESTACIÓN</th><th>ESPECIE</th><th>PRECIO</th><th>ESTADO</th><th>ACCIONES</th></tr></thead><tbody>
  @for (p of filtered; track p.id) {<tr><td><span class="code-tag">{{p.codigo}}</span></td><td><b>{{p.nombre}}</b></td><td>{{p.especieAplicable}}</td><td class="price">S/ {{p.precio | number:'1.2-2'}}</td><td><span class="status" [class.success]="p.activo" [class.inactive]="!p.activo">{{p.activo ? 'Activa' : 'Inactiva'}}</span></td><td><div class="actions">@if (auth.tienePermiso('PRESTACION_ESCRIBIR')) {<a [routerLink]="['/prestaciones',p.id,'editar']" class="icon-btn" title="Editar">✎</a><button class="icon-btn" (click)="toggle(p)" [title]="p.activo ? 'Dar de baja' : 'Activar'">{{p.activo ? '⊘' : '↻'}}</button>}</div></td></tr>}
  </tbody></table></div>}
  </section>`
})
export class PrestacionesComponent implements OnInit {
  private api = inject(ApiService); auth = inject(AuthService);
  items: Prestacion[] = []; search = ''; loading = true; error = '';
  get filtered(): Prestacion[] { const q = this.search.toLowerCase(); return this.items.filter(p => `${p.codigo} ${p.nombre}`.toLowerCase().includes(q)); }
  ngOnInit(): void { this.load(); }
  load(): void { this.loading = true; this.error = ''; this.api.prestaciones().subscribe({next: x => {this.items=x;this.loading=false;}, error: e => {this.error=e.error?.mensaje || 'No se pudo cargar el catálogo.';this.loading=false;}}); }
  toggle(p: Prestacion): void {
    const action = p.activo ? 'dar de baja' : 'activar';
    if (!confirm(`¿Deseas ${action} la prestación ${p.nombre}?`)) return;
    this.api.cambiarEstadoPrestacion(p.id, !p.activo).subscribe({next: () => this.load(), error: e => this.error=e.error?.mensaje || 'No se pudo actualizar el estado.'});
  }
}
