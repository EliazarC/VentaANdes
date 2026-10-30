import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Mascota, Prestacion, DetalleAtencion } from '../../core/models/models';
import { HttpErrorResponse } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

@Component({
 standalone:true,imports: [DecimalPipe,ReactiveFormsModule,RouterLink, DecimalPipe],
 template:`<div class="page-heading"><div><span class="eyebrow">ATENCIONES / REGISTRO</span><h1>Nueva atención</h1><p class="muted">Registra la consulta y las prestaciones realizadas.</p></div><a routerLink="/atenciones" class="btn btn-light">← Volver</a></div>
 <form [formGroup]="form" (ngSubmit)="save()" class="attention-layout"><section class="panel form-panel"><div class="form-section-title"><span>01</span><div><b>Información del paciente</b><small>Selecciona la mascota que recibirá atención</small></div></div>
 <div class="form-grid"><div class="field full"><label>Mascota *</label><select formControlName="mascotaId" (change)="onMascota()"><option value="">Selecciona una mascota</option>@for(m of mascotas;track m.id){<option [value]="m.id">{{m.nombre}} · {{m.propietarioNombre}} ({{m.especie}})</option>}</select></div><div class="field"><label>Peso (kg) *</label><input type="number" min="0.01" step="0.01" formControlName="peso" placeholder="Ej. 12.5"></div><div class="field"><label>Diagnóstico</label><input formControlName="diagnostico" placeholder="Descripción del diagnóstico"></div></div>
 <div class="form-section-title section-spaced"><span>02</span><div><b>Prestaciones realizadas</b><small>Agrega entre 1 y 8 prestaciones, sin repetir</small></div></div>
 <div formArrayName="detalles" class="detail-list">@for(line of detalles.controls;track $index;let i=$index){<div class="detail-row" [formGroupName]="i"><div class="detail-number">{{i+1}}</div><div class="field"><label>Prestación *</label><select formControlName="prestacionId" (change)="recalculate()"><option value="">Selecciona prestación</option>@for(p of availableFor(i);track p.id){<option [value]="p.id">{{p.nombre}} · S/ {{p.precio | number:'1.2-2'}}</option>}</select></div><div class="field qty-field"><label>Cantidad</label><input type="number" min="1" max="3" formControlName="cantidad" (input)="recalculate()"></div><div class="line-total">S/ {{lineTotal(i) | number:'1.2-2'}}</div><button type="button" class="remove-line" (click)="removeLine(i)" [disabled]="detalles.length===1">×</button></div>}</div>
 <button type="button" class="btn btn-outline add-line" (click)="addLine()" [disabled]="detalles.length>=8">＋ Agregar prestación</button>
 @if(error){<div class="alert error">{{error}}</div>}<div class="form-actions"><a routerLink="/atenciones" class="btn btn-light">Cancelar</a><button class="btn btn-primary" [disabled]="form.invalid||saving">{{saving?'Registrando…':'Registrar atención'}}</button></div></section>
 <aside class="panel summary-panel"><span class="eyebrow">RESUMEN DE ATENCIÓN</span><h3>Detalle de pago</h3><div class="summary-line"><span>Prestaciones</span><b>{{detalles.length}}</b></div><div class="summary-line"><span>Subtotal</span><b>S/ {{subtotal | number:'1.2-2'}}</b></div><div class="summary-line discount"><span>Descuento (10%)</span><b>− S/ {{descuento | number:'1.2-2'}}</b></div><div class="summary-total"><span>Total estimado</span><strong>S/ {{total | number:'1.2-2'}}</strong></div><small class="summary-note">El total definitivo y el descuento son calculados y validados por el backend.</small></aside></form>`
})
export class AtencionFormComponent implements OnInit{
 private fb=inject(FormBuilder);private api=inject(ApiService);private router=inject(Router);
 mascotas:Mascota[]=[];prestaciones:Prestacion[]=[];saving=false;error='';
 form=this.fb.nonNullable.group({mascotaId:['',[Validators.required]],peso:[0,[Validators.required,Validators.min(0.01)]],diagnostico:[''],detalles:this.fb.array([this.line()])});
 get detalles():FormArray{return this.form.controls.detalles as FormArray;}
 get selectedPet():Mascota|undefined{return this.mascotas.find(m=>m.id===Number(this.form.value.mascotaId));}
 get subtotal():number{return this.detalles.controls.reduce((s,_,i)=>s+this.lineTotal(i),0);}
 get descuento():number{return this.detalles.length>=3?this.subtotal*.1:0;}
 get total():number{return this.subtotal-this.descuento;}
 ngOnInit():void{this.api.mascotas().subscribe({next:x=>this.mascotas=x,error:e=>this.error=e.error?.mensaje||'No se pudieron cargar mascotas.'});this.api.prestaciones().subscribe({next:x=>this.prestaciones=x.filter(p=>p.activo),error:e=>this.error=e.error?.mensaje||'No se pudieron cargar prestaciones.'});}
 line(){return this.fb.nonNullable.group({prestacionId:['',[Validators.required]],cantidad:[1,[Validators.required,Validators.min(1),Validators.max(3)]]});}
 onMascota():void{this.recalculate();}
 availableFor(index:number):Prestacion[]{const species=this.selectedPet?.especie;const used=this.detalles.controls.map((c,i)=>i!==index?Number(c.value['prestacionId']):0);return this.prestaciones.filter(p=>(!used.includes(p.id))&&(p.especieAplicable==='TODAS'||p.especieAplicable===species));}
 addLine():void{if(this.detalles.length<8)this.detalles.push(this.line());}
 removeLine(i:number):void{if(this.detalles.length>1){this.detalles.removeAt(i);this.recalculate();}}
 lineTotal(i:number):number{const id=Number(this.detalles.at(i).value['prestacionId']);const p=this.prestaciones.find(x=>x.id===id);return (p?.precio||0)*Number(this.detalles.at(i).value['cantidad']||0);}
 recalculate():void{}
 save():void{if(this.form.invalid){this.form.markAllAsTouched();return;}this.saving=true;this.error='';const v=this.form.getRawValue();const payload={mascotaId:Number(v.mascotaId),peso:v.peso,diagnostico:v.diagnostico,detalles:v.detalles.map(d=>({prestacionId:Number(d.prestacionId),cantidad:d.cantidad}))};this.api.crearAtencion(payload).subscribe({next:a=>{this.saving=false;alert(`Atención ${a.numero} registrada correctamente.`);this.router.navigate(['/atenciones',a.id]);},error:(e:HttpErrorResponse)=>{this.saving=false;this.error=e.error?.mensaje||'No se pudo registrar la atención. Revisa los datos e intenta nuevamente.';}});}
}
