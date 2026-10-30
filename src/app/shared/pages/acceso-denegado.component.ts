import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({standalone:true,imports:[RouterLink],template:`<div class="center-state"><span class="big-symbol">⛔</span><span class="eyebrow">ERROR 403</span><h1>Acceso denegado</h1><p>No tienes permisos para acceder a esta sección. Si necesitas realizar esta acción, comunícate con el administrador.</p><a routerLink="/" class="btn btn-primary">Volver al inicio</a></div>`})
export class AccesoDenegadoComponent{}
