import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true, imports: [ReactiveFormsModule, RouterLink],
  template: `
  <div class="page-heading"><div><span class="eyebrow">CATÁLOGO / PRESTACIONES</span><h1>{{id ? 'Editar prestación' : 'Nueva prestación'}}</h1><p class="muted">Completa la información del servicio veterinario.</p></div><a routerLink="/prestaciones" class="btn btn-light">← Volver</a></div>
  <section class="panel form-panel"><form [formGroup]="form" (ngSubmit)="save()">
    <div class="form-section-title"><span>01</span><div><b>Información general</b><small>Datos principales de la prestación</small></div></div>
    <div class="form-grid"><div class="field"><label>Código *</label><input formControlName="codigo" placeholder="PRS-010" maxlength="7"><small class="hint">Formato: PRS-000</small><small class="field-error">{{fieldError('codigo')}}</small></div>
    <div class="field"><label>Nombre *</label><input formControlName="nombre" placeholder="Ej. Consulta general"><small class="field-error">{{fieldError('nombre')}}</small></div>
    <div class="field"><label>Precio (S/) *</label><input type="number" formControlName="precio" min="0.01" step="0.01" placeholder="0.00"><small class="field-error">{{fieldError('precio')}}</small></div>
    <div class="field"><label>Especie aplicable *</label><select formControlName="especieAplicable"><option value="">Selecciona una especie</option><option value="PERRO">Perro</option><option value="GATO">Gato</option><option value="TODAS">Todas las especies</option></select><small class="field-error">{{fieldError('especieAplicable')}}</small></div></div>
    @if (error) {<div class="alert error">{{error}}</div>}
    <div class="form-actions"><a routerLink="/prestaciones" class="btn btn-light">Cancelar</a><button class="btn btn-primary" [disabled]="form.invalid || saving">{{saving ? 'Guardando…' : 'Guardar prestación'}}</button></div>
  </form></section>`
})
export class PrestacionFormComponent implements OnInit {
  private fb=inject(FormBuilder); private api=inject(ApiService); private route=inject(ActivatedRoute); private router=inject(Router);
  id = Number(this.route.snapshot.paramMap.get('id')) || null; saving=false; error='';
  form=this.fb.nonNullable.group({codigo:['',[Validators.required,Validators.pattern(/^PRS-\d{3}$/)]],nombre:['',[Validators.required,Validators.minLength(3),Validators.maxLength(80)]],precio:[0,[Validators.required,Validators.min(0.01)]],especieAplicable:['',[Validators.required]]});
  ngOnInit(): void { if(this.id) this.api.prestacion(this.id).subscribe({next:p=>this.form.patchValue(p),error:e=>this.error=e.error?.mensaje||'No se encontró la prestación.'}); }
  fieldError(name:string):string { const c=this.form.get(name); if(!c?.touched||!c.errors)return ''; if(c.errors['required'])return 'Este campo es obligatorio.'; if(c.errors['pattern'])return 'Usa el formato PRS-000.'; if(c.errors['minlength'])return 'Ingresa al menos 3 caracteres.'; if(c.errors['maxlength'])return 'Máximo 80 caracteres.'; if(c.errors['min'])return 'El precio debe ser mayor que cero.'; return 'Revisa este campo.'; }
  save():void { if(this.form.invalid){this.form.markAllAsTouched();return;} this.saving=true;this.error='';const req=this.id?this.api.actualizarPrestacion(this.id,this.form.getRawValue()):this.api.crearPrestacion(this.form.getRawValue());req.subscribe({next:()=>this.router.navigate(['/prestaciones']),error:(e:HttpErrorResponse)=>{this.saving=false;this.error=e.error?.mensaje||'No se pudo guardar la prestación.';}}); }
}
