import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Atencion } from '../../core/models/models';
import { DecimalPipe } from '@angular/common';

@Component({
 standalone:true,imports: [DecimalPipe,RouterLink,FormsModule,DatePipe, DecimalPipe],
 template:`<div class="page-heading"><div><span class="eyebrow">HISTORIAL CLÍNICO</span><h1>Atenciones</h1><p class="muted">Consulta y revisa las atenciones de tus pacientes.</p></div><a routerLink="/atenciones/nueva" class="btn btn-primary">＋ Nueva atención</a></div>
 <section class="panel"><div class="filter-grid"><div class="field"><label>Mascota</label><input [(ngModel)]="f.mascota" placeholder="Nombre de mascota"></div><div class="field"><label>Especie</label><select [(ngModel)]="f.especie"><option value="">Todas</option><option>PERRO</option><option>GATO</option><option>OTRO</option></select></div><div class="field"><label>Estado</label><select [(ngModel)]="f.estado"><option value="">Todos</option><option>REGISTRADA</option><option>ANULADA</option></select></div><div class="field"><label>Desde</label><input type="date" [(ngModel)]="f.desde"></div><div class="field"><label>Hasta</label><input type="date" [(ngModel)]="f.hasta"></div><button class="btn btn-primary filter-button" (click)="load()">Buscar</button></div>
 @if(error){<div class="alert error">{{error}}</div>}@if(loading){<div class="loading-state">Consultando atenciones…</div>}@else if(!items.length){<div class="empty-state"><span>▤</span><b>No hay atenciones registradas</b><small>Modifica los filtros o registra una nueva atención.</small></div>}@else{<div class="table-wrap"><table><thead><tr><th>N.º ATENCIÓN</th><th>FECHA</th><th>MASCOTA</th><th>ESTADO</th><th>TOTAL</th><th>DETALLE</th></tr></thead><tbody>@for(a of items;track a.id){<tr><td><span class="code-tag">{{a.numero}}</span></td><td>{{a.fecha | date:'dd/MM/yyyy HH:mm'}}</td><td><b>{{a.mascotaNombre||('Mascota #'+a.mascotaId)}}</b></td><td><span class="status" [class.success]="a.estado==='REGISTRADA'" [class.inactive]="a.estado==='ANULADA'">{{a.estado}}</span></td><td class="price">S/ {{a.total | number:'1.2-2'}}</td><td><a [routerLink]="['/atenciones',a.id]" class="table-link">Ver atención →</a></td></tr>}</tbody></table></div>}</section>`
})
export class AtencionesComponent implements OnInit{
 private api=inject(ApiService);items:Atencion[]=[];loading=true;error='';
 f={mascota:'',especie:'',estado:'',desde:'',hasta:''};
 ngOnInit():void{this.load();}
 load():void{this.loading=true;this.error='';this.api.atenciones(this.f).subscribe({next:x=>{this.items=x;this.loading=false;},error:e=>{this.error=e.error?.mensaje||'No se pudieron consultar las atenciones.';this.loading=false;}});}
}
