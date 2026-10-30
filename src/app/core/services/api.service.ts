import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Atencion, Mascota, Prestacion, Propietario, ReporteEspecie } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  propietarios(): Observable<Propietario[]> { return this.http.get<Propietario[]>(`${this.base}/propietarios`); }
  prestaciones(especie?: string): Observable<Prestacion[]> {
    let params = new HttpParams();
    if (especie) params = params.set('especie', especie);
    return this.http.get<Prestacion[]>(`${this.base}/prestaciones`, { params });
  }
  prestacion(id: number): Observable<Prestacion> { return this.http.get<Prestacion>(`${this.base}/prestaciones/${id}`); }
  crearPrestacion(data: Partial<Prestacion>): Observable<Prestacion> { return this.http.post<Prestacion>(`${this.base}/prestaciones`, data); }
  actualizarPrestacion(id: number, data: Partial<Prestacion>): Observable<Prestacion> { return this.http.put<Prestacion>(`${this.base}/prestaciones/${id}`, data); }
  eliminarPrestacion(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/prestaciones/${id}`); }
  cambiarEstadoPrestacion(id: number, activo: boolean): Observable<Prestacion> {
    return this.http.patch<Prestacion>(`${this.base}/prestaciones/${id}/estado`, { activo });
  }

  mascotas(propietarioId?: number): Observable<Mascota[]> {
    let params = new HttpParams();
    if (propietarioId) params = params.set('propietarioId', propietarioId);
    return this.http.get<Mascota[]>(`${this.base}/mascotas`, { params });
  }
  mascota(id: number): Observable<Mascota> { return this.http.get<Mascota>(`${this.base}/mascotas/${id}`); }
  crearMascota(data: Partial<Mascota>): Observable<Mascota> { return this.http.post<Mascota>(`${this.base}/mascotas`, data); }
  actualizarMascota(id: number, data: Partial<Mascota>): Observable<Mascota> { return this.http.put<Mascota>(`${this.base}/mascotas/${id}`, data); }
  eliminarMascota(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/mascotas/${id}`); }

  atenciones(filters: Record<string, string>): Observable<Atencion[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => { if (value) params = params.set(key, value); });
    return this.http.get<Atencion[]>(`${this.base}/atenciones`, { params });
  }
  atencion(id: number): Observable<Atencion> { return this.http.get<Atencion>(`${this.base}/atenciones/${id}`); }
  crearAtencion(data: unknown): Observable<Atencion> { return this.http.post<Atencion>(`${this.base}/atenciones`, data); }
  anularAtencion(id: number, motivo: string): Observable<Atencion> {
    return this.http.patch<Atencion>(`${this.base}/atenciones/${id}/anular`, { motivo });
  }
  reporte(desde: string, hasta: string): Observable<ReporteEspecie[]> {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return this.http.get<ReporteEspecie[]>(`${this.base}/reportes/atenciones-por-especie`, { params });
  }
}
