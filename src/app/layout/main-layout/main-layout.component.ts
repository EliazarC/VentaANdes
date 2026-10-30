import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MENU_ITEMS } from '../../core/config/menu';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" routerLink="/"><span class="brand-mark">V</span><span><b>VetAndes</b><small>CLÍNICA VETERINARIA</small></span></a>
      <div class="side-label">MENÚ PRINCIPAL</div>
      <nav>
        @for (item of menu; track item.route) {
          @if (!item.permiso || auth.tienePermiso(item.permiso)) {
            <a class="nav-item" [routerLink]="item.route" routerLinkActive="active" [routerLinkActiveOptions]="{exact: item.route === '/'}">
              <span class="nav-icon">{{item.icon}}</span>{{item.label}}
            </a>
          }
        }
      </nav>
      <div class="sidebar-bottom"><div class="help-card"><span>✦</span><b>¿Necesitas ayuda?</b><small>Consulta con el administrador del sistema.</small></div><small class="version">VetAndes Web · v1.0</small></div>
    </aside>
    <main class="main-area">
      <header class="topbar">
        <div><span class="eyebrow">GESTIÓN VETERINARIA</span><strong>Panel de control</strong></div>
        <div class="user-area"><span class="online-dot"></span><div class="user-copy"><b>{{auth.usuario()?.nombreCompleto}}</b><small>{{auth.usuario()?.roles?.join(' · ')}}</small></div><button class="avatar" (click)="auth.logout()">↪</button></div>
      </header>
      <section class="page-content"><router-outlet /></section>
    </main>
  </div>`
})
export class MainLayoutComponent {
  menu = MENU_ITEMS;
  constructor(public auth: AuthService) {}
}
