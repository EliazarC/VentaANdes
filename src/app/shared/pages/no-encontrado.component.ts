import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({standalone:true,imports:[RouterLink],template:`<div class="center-state"><span class="big-symbol">🔎</span><span class="eyebrow">ERROR 404</span><h1>Página no encontrada</h1><p>La dirección que buscas no existe o fue movida.</p><a routerLink="/" class="btn btn-primary">Ir al inicio</a></div>`})
export class NoEncontradoComponent{}
