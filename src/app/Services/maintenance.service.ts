import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';
import { CompleteMaintenanceRequest, Maintenance, MaintenanceStatus, GeneralResponse, MaintenanceDetails, MaintenanceNearest } from '../Interfaces/imaintenance';
import { MaintenanceCreateDTO, MaintenanceUpdateDTO } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private baseUrl = `${Environment.baseUrl}/Maintenance`;


  constructor(private http: HttpClient) {}

  getAll(): Observable<GeneralResponse<Maintenance[]>> {
    return this.http.get<GeneralResponse<Maintenance[]>>(this.baseUrl);
  }

  getById(id: string): Observable<GeneralResponse<MaintenanceDetails>> {
    return this.http.get<GeneralResponse<MaintenanceDetails>>(`${this.baseUrl}/${id}`);
  }

  create(maintenance: any): Observable<GeneralResponse<any>> {
  return this.http.post<GeneralResponse<any>>(
    `${this.baseUrl}`,
    maintenance // no need to override status, your model has it
  );
}



  update(id: string, dto: MaintenanceUpdateDTO, status?: MaintenanceStatus): Observable<GeneralResponse<Maintenance>> {
    let params = new HttpParams();
    if (status !== undefined) {
      params = params.set('status', status);
    }
    return this.http.put<GeneralResponse<Maintenance>>(`${this.baseUrl}/${id}`, dto, { params });
  }

  delete(id: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.baseUrl}/${id}`);
  }

  getByTechCompanyId(techCompanyId: string): Observable<GeneralResponse<Maintenance[]>> {
    return this.http.get<GeneralResponse<Maintenance[]>>(`${this.baseUrl}/tech-company/${techCompanyId}`);
  }

  getAvailableRequests(): Observable<GeneralResponse<Maintenance[]>> {
    return this.http.get<GeneralResponse<Maintenance[]>>(`${this.baseUrl}/available-requests`);
  }

  acceptRequest(maintenanceId: string, techCompanyId: string): Observable<GeneralResponse<Maintenance>> {
    return this.http.post<GeneralResponse<Maintenance>>(`${this.baseUrl}/${maintenanceId}/accept`, {techCompanyId}, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  completeMaintenance(maintenanceId: string, request: CompleteMaintenanceRequest): Observable<GeneralResponse<Maintenance>> {
    return this.http.post<GeneralResponse<Maintenance>>(`${this.baseUrl}/${maintenanceId}/complete`, request);
  }

  updateStatus(maintenanceId: string, status: MaintenanceStatus, notes?: string): Observable<GeneralResponse<Maintenance>> {
    let params = new HttpParams().set('status', status);
    if (notes) params = params.set('notes', notes);
    return this.http.put<GeneralResponse<Maintenance>>(`${this.baseUrl}/${maintenanceId}/status`, {}, { params });
  }

  getNearest(customerId: string): Observable<GeneralResponse<MaintenanceNearest>> {
    const params = new HttpParams().set('customerId', customerId);
    return this.http.get<GeneralResponse<MaintenanceNearest>>(`${this.baseUrl}/nearest`, { params });
  }
} 