import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { Mascota, Propietario } from '../../core/models/models';

@Component({
  standalone:true,imports:[RouterLink,FormsModule],
  template:`<div class="page-heading"><div><span class="eyebrow">PACIENTES</span><h1>Mascotas</h1><p class="muted">Consulta y administra los pacientes de la clínica.</p></div>@if(auth.tienePermiso('MASCOTA_ESCRIBIR')){<a routerLink="/mascotas/nueva" class="btn btn-primary">＋ Registrar mascota</a>}</div>
  <section class="panel"><div class="toolbar"><div class="search-box"><span>⌕</span><input [(ngModel)]="search" placeholder="Buscar mascota o propietario…"></div><select class="filter-select" [(ngModel)]="ownerFilter" (change)="load()"><option value="">Todos los propietarios</option>@for(o of owners;track o.id){<option [value]="o.id">{{o.nombres}}</option>}</select><span class="result-count">{{filtered.length}} pacientes</span></div>
  @if(loading){<div class="loading-state">Cargando pacientes…</div>}@else if(error){<div class="alert error">{{error}} <button class="link-button" (click)="load()">Reintentar</button></div>}@else if(!filtered.length){<div class="empty-state"><span>♡</span><b>No se encontraron mascotas</b><small>Registra un paciente o cambia los filtros.</small></div>}@else{<div class="table-wrap"><table><thead><tr><th>MASCOTA</th><th>ESPECIE</th><th>RAZA</th><th>EDAD</th><th>PROPIETARIO</th><th>ACCIONES</th></tr></thead><tbody>@for(m of filtered;track m.id){<tr><td><div class="pet-cell"><span class="pet-avatar">{{m.especie==='GATO'?'🐱':'🐶'}}</span><b>{{m.nombre}}</b></div></td><td>{{m.especie}}</td><td>{{m.raza || '—'}}</td><td>{{age(m.fechaNacimiento)}}</td><td>{{m.propietarioNombre || ownerName(m.propietarioId)}}</td><td><div class="actions">@if(auth.tienePermiso('MASCOTA_ESCRIBIR')){<a [routerLink]="['/mascotas',m.id,'editar']" class="icon-btn">✎</a><button class="icon-btn danger-text" (click)="remove(m)">⌫</button>}</div></td></tr>}</tbody></table></div>}</section>`
})
export class MascotasComponent implements OnInit {
 private api=inject(ApiService);auth=inject(AuthService);items:Mascota[]=[];owners:Propietario[]=[];search='';ownerFilter='';loading=true;error='';
 get filtered():Mascota[]{const q=this.search.toLowerCase();return this.items.filter(m=>`${m.nombre} ${m.propietarioNombre||this.ownerName(m.propietarioId)}`.toLowerCase().includes(q));}
 ngOnInit():void{this.api.propietarios().subscribe({next:x=>this.owners=x,error:()=>{}});this.load();}
 load():void{this.loading=true;this.error='';this.api.mascotas(this.ownerFilter?Number(this.ownerFilter):undefined).subscribe({next:x=>{this.items=x;this.loading=false;},error:e=>{this.error=e.error?.mensaje||'No se pudieron cargar las mascotas.';this.loading=false;}});}
 ownerName(id:number):string{return this.owners.find(o=>o.id===id)?.nombres||'—';}
 age(date:string):string{if(!date)return '—';const d=new Date(date+'T00:00:00');const now=new Date();let years=now.getFullYear()-d.getFullYear();let months=now.getMonth()-d.getMonth();if(now.getDate()<d.getDate())months--;if(months<0){years--;months+=12;}return years>0?`${years} año(s)`: `${Math.max(months,0)} mes(es)`;}
 remove(m:Mascota):void{if(!confirm(`¿Eliminar a ${m.nombre}?`))return;this.api.eliminarMascota(m.id).subscribe({next:()=>this.load(),error:e=>this.error=e.error?.mensaje||'No se pudo eliminar la mascota.'});}
}
