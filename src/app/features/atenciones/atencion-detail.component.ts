import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { Atencion } from '../../core/models/models';

@Component({
 standalone:true,imports:[DatePipe,DecimalPipe,RouterLink,FormsModule],
 template:`<div class="page-heading"><div><span class="eyebrow">HISTORIAL / DETALLE</span><h1>Detalle de atención</h1><p class="muted">Información completa del registro clínico.</p></div><a routerLink="/atenciones" class="btn btn-light">← Volver al historial</a></div>
 @if(error){<div class="alert error">{{error}}</div>}@if(a){<div class="detail-header panel"><div><span class="code-tag">{{a.numero}}</span><h2>{{a.mascotaNombre||'Atención veterinaria'}}</h2><p class="muted">{{a.fecha|date:'dd/MM/yyyy HH:mm'}} · {{a.especie||'Paciente'}}</p></div><span class="status" [class.success]="a.estado==='REGISTRADA'" [class.inactive]="a.estado==='ANULADA'">{{a.estado}}</span></div>
 <div class="detail-columns"><section class="panel"><h3>Prestaciones aplicadas</h3><div class="table-wrap"><table><thead><tr><th>PRESTACIÓN</th><th>CANTIDAD</th><th>PRECIO</th><th>SUBTOTAL</th></tr></thead><tbody>@for(d of a.detalles;track d.id||d.prestacionId){<tr><td>{{d.prestacionNombre||('Prestación #'+d.prestacionId)}}</td><td>{{d.cantidad}}</td><td>S/ {{d.precioUnitario|number:'1.2-2'}}</td><td>S/ {{d.subtotal|number:'1.2-2'}}</td></tr>}</tbody></table></div><div class="totals"><div>Subtotal <b>S/ {{a.subtotal|number:'1.2-2'}}</b></div><div>Descuento <b>− S/ {{a.descuento|number:'1.2-2'}}</b></div><div class="grand">Total <strong>S/ {{a.total|number:'1.2-2'}}</strong></div></div></section><aside class="panel"><h3>Datos clínicos</h3><div class="info-pair"><small>Peso</small><b>{{a.peso}} kg</b></div><div class="info-pair"><small>Diagnóstico</small><b>{{a.diagnostico||'Sin diagnóstico'}}</b></div>@if(a.estado==='ANULADA'){<div class="alert warning">Motivo de anulación: {{a.motivoAnulacion}}</div>}@if(a.estado==='REGISTRADA'&&auth.tienePermiso('ATENCION_ANULAR')){<hr><h3>Anular atención</h3><textarea [(ngModel)]="motivo" placeholder="Motivo (10 a 200 caracteres)" rows="3"></textarea><button class="btn btn-danger btn-full" [disabled]="motivo.trim().length<10||motivo.trim().length>200" (click)="cancel()">Anular atención</button>}</aside></div>}`
})
export class AtencionDetailComponent implements OnInit{
 private api=inject(ApiService);private route=inject(ActivatedRoute);auth=inject(AuthService);a:Atencion|null=null;error='';motivo='';
 ngOnInit():void{const id=Number(this.route.snapshot.paramMap.get('id'));this.api.atencion(id).subscribe({next:x=>this.a=x,error:e=>this.error=e.error?.mensaje||'No se encontró la atención.'});}
 cancel():void{if(!this.a||!confirm('¿Confirmas la anulación de esta atención?'))return;this.api.anularAtencion(this.a.id,this.motivo).subscribe({next:x=>{this.a=x;this.motivo='';},error:e=>this.error=e.error?.mensaje||'No se pudo anular la atención.'});}
}
