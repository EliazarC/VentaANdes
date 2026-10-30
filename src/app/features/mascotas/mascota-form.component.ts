
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Propietario } from '../../core/models/models';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-heading">
      <div>
        <span class="eyebrow">PACIENTES / MASCOTAS</span>
        <h1>{{id ? 'Editar mascota' : 'Registrar mascota'}}</h1>
        <p class="muted">Registra los datos del paciente y su propietario.</p>
      </div>
      <a routerLink="/mascotas" class="btn btn-light">← Volver</a>
    </div>

    <section class="panel form-panel">
      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="form-section-title">
          <span>01</span>
          <div>
            <b>Datos de la mascota</b>
            <small>Información de identificación del paciente</small>
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Nombre *</label>
            <input formControlName="nombre" placeholder="Nombre de la mascota">
            <small class="field-error">{{err('nombre')}}</small>
          </div>

          <div class="field">
            <label>Especie *</label>
            <select formControlName="especie">
              <option value="">Selecciona</option>
              <option value="PERRO">Perro</option>
              <option value="GATO">Gato</option>
              <option value="OTRO">Otro</option>
            </select>
            <small class="field-error">{{err('especie')}}</small>
          </div>

          <div class="field">
            <label>Raza</label>
            <input formControlName="raza" placeholder="Ej. Mestizo">
          </div>

          <div class="field">
            <label>Fecha de nacimiento *</label>
            <input type="date" formControlName="fechaNacimiento" [max]="today">
            <small class="field-error">{{err('fechaNacimiento')}}</small>
          </div>

          <div class="field">
            <label>Sexo *</label>
            <select formControlName="sexo">
              <option value="">Selecciona</option>
              <option value="M">Macho</option>
              <option value="H">Hembra</option>
            </select>
            <small class="field-error">{{err('sexo')}}</small>
          </div>

          <div class="field">
            <label>Propietario *</label>
            <select formControlName="propietarioId">
              <option value="">Selecciona un propietario</option>
              @for(o of owners; track o.id) {
                <option [value]="o.id">{{o.nombres}} · {{o.dni}}</option>
              }
            </select>
            <small class="field-error">{{err('propietarioId')}}</small>
          </div>
        </div>

        @if(error) {
          <div class="alert error">{{error}}</div>
        }

        <div class="form-actions">
          <a routerLink="/mascotas" class="btn btn-light">Cancelar</a>
          <button
            class="btn btn-primary"
            [disabled]="form.invalid || saving || !owners.length">
            {{saving ? 'Guardando…' : 'Guardar mascota'}}
          </button>
        </div>
      </form>
    </section>
  `
})
export class MascotaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = Number(this.route.snapshot.paramMap.get('id')) || null;
  owners: Propietario[] = [];
  saving = false;
  error = '';
  today = new Date().toISOString().slice(0, 10);

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    especie: ['', [Validators.required]],
    raza: [''],
    fechaNacimiento: ['', [Validators.required]],
    sexo: ['', [Validators.required]],
    propietarioId: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.api.propietarios().subscribe({
      next: x => this.owners = x,
      error: e => this.error = e.error?.mensaje || 'No se pudieron cargar los propietarios.'
    });

    if (this.id) {
      this.api.mascota(this.id).subscribe({
        next: m => this.form.patchValue({
          ...m,
          propietarioId: String(m.propietarioId)
        }),
        error: e => this.error = e.error?.mensaje || 'No se encontró la mascota.'
      });
    }
  }

  err(n: string): string {
    const c = this.form.get(n);

    if (!c?.touched || !c.errors) return '';

    if (c.errors['required']) return 'Este campo es obligatorio.';
    if (c.errors['minlength']) return 'Ingresa al menos 2 caracteres.';
    if (c.errors['maxlength']) return 'Máximo 40 caracteres.';

    return 'Revisa este campo.';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.controls.fechaNacimiento.value > this.today) {
      this.error = 'La fecha de nacimiento no puede ser futura.';
      return;
    }

    this.saving = true;
    this.error = '';

    const raw = this.form.getRawValue();

    const value = {
      ...raw,
      especie: raw.especie as 'PERRO' | 'GATO' | 'OTRO',
      sexo: raw.sexo as 'M' | 'H',
      propietarioId: Number(raw.propietarioId)
    };

    const req = this.id
      ? this.api.actualizarMascota(this.id, value)
      : this.api.crearMascota(value);

    req.subscribe({
      next: () => this.router.navigate(['/mascotas']),
      error: e => {
        this.saving = false;
        this.error = e.error?.mensaje || 'No se pudo guardar la mascota.';
      }
    });
  }
}
