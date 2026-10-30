import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ReporteEspecie } from '../../core/models/models';

@Component({
 standalone:true,imports:[FormsModule,DecimalPipe],
 template:`<div class="page-heading"><div><span class="eyebrow">ANÁLISIS</span><h1>Reporte por especie</h1><p class="muted">Conoce el volumen de atenciones y los ingresos por especie.</p></div></div>
 <section class="panel"><div class="filter-grid report-filters"><div class="field"><label>Desde</label><input type="date" [(ngModel)]="desde"></div><div class="field"><label>Hasta</label><input type="date" [(ngModel)]="hasta"></div><button class="btn btn-primary filter-button" (click)="load()">Generar reporte</button></div>
 @if(error){<div class="alert error">{{error}}</div>}@if(loading){<div class="loading-state">Generando reporte…</div>}@else if(!items.length){<div class="empty-state"><span>▥</span><b>No hay datos en este periodo</b><small>Selecciona otro rango de fechas.</small></div>}@else{<div class="report-cards">@for(r of items;track r.especie){<article class="report-card"><span class="eyebrow">{{r.especie}}</span><strong>{{r.cantidadAtenciones}}</strong><small>Atenciones realizadas</small><div class="report-amount">S/ {{r.importeTotal|number:'1.2-2'}}</div><small>Importe total</small></article>}</div><div class="table-wrap"><table><thead><tr><th>ESPECIE</th><th>ATENCIONES</th><th>IMPORTE TOTAL</th></tr></thead><tbody>@for(r of items;track r.especie){<tr><td><b>{{r.especie}}</b></td><td>{{r.cantidadAtenciones}}</td><td class="price">S/ {{r.importeTotal|number:'1.2-2'}}</td></tr>}</tbody></table></div>}</section>`
})
export class ReportesComponent{
 private api=inject(ApiService);items:ReporteEspecie[]=[];desde='';hasta='';loading=false;error='';
 load():void{if(this.desde&&this.hasta&&this.desde>this.hasta){this.error='La fecha inicial no puede ser posterior a la fecha final.';return;}this.loading=true;this.error='';this.api.reporte(this.desde,this.hasta).subscribe({next:x=>{this.items=x;this.loading=false;},error:e=>{this.error=e.error?.mensaje||'No se pudo generar el reporte.';this.loading=false;}});}
}
