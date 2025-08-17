import { Injectable } from '@angular/core';
import { DeliveryClusterDTO, DeliveryClusterTrackingDTO } from '../Interfaces/idelivery-cluster';
import { GeneralResponse } from './cart.service';
import { Observable } from 'rxjs';
import { DeliveryClusterCreateDTO } from '../Interfaces/idelivery';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryClusterService {

  private apiUrl = `${Environment.baseUrl}/DeliveryCluster`;

  constructor(private http: HttpClient) {}

  // --- CRUD ---
  getById(clusterId: string): Observable<GeneralResponse<DeliveryClusterDTO>> {
    return this.http.get<GeneralResponse<DeliveryClusterDTO>>(`${this.apiUrl}/${clusterId}`);
  }

  getByDeliveryId(deliveryId: string): Observable<GeneralResponse<DeliveryClusterDTO[]>> {
    return this.http.get<GeneralResponse<DeliveryClusterDTO[]>>(`${this.apiUrl}/delivery/${deliveryId}`);
  }

  create(deliveryId: string, dto: DeliveryClusterCreateDTO): Observable<GeneralResponse<DeliveryClusterDTO>> {
    return this.http.post<GeneralResponse<DeliveryClusterDTO>>(`${this.apiUrl}/${deliveryId}`, dto);
  }

  update(clusterId: string, dto: DeliveryClusterDTO): Observable<GeneralResponse<DeliveryClusterDTO>> {
    return this.http.put<GeneralResponse<DeliveryClusterDTO>>(`${this.apiUrl}/${clusterId}`, dto);
  }

  delete(clusterId: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.apiUrl}/${clusterId}`);
  }

  // --- Tracking ---
  getTracking(clusterId: string): Observable<GeneralResponse<DeliveryClusterTrackingDTO>> {
    return this.http.get<GeneralResponse<DeliveryClusterTrackingDTO>>(`${this.apiUrl}/${clusterId}/tracking`);
  }

  updateTracking(clusterId: string, dto: DeliveryClusterTrackingDTO): Observable<GeneralResponse<DeliveryClusterTrackingDTO>> {
    return this.http.patch<GeneralResponse<DeliveryClusterTrackingDTO>>(`${this.apiUrl}/${clusterId}/tracking`, dto);
  }

  // --- Driver ---
  assignDriver(clusterId: string, driverId: string): Observable<GeneralResponse<DeliveryClusterDTO>> {
    return this.http.post<GeneralResponse<DeliveryClusterDTO>>(`${this.apiUrl}/${clusterId}/assign-driver/${driverId}`, {});
  }

  // --- Special Queries ---
  getUnassignedClusters(): Observable<GeneralResponse<DeliveryClusterDTO[]>> {
    return this.http.get<GeneralResponse<DeliveryClusterDTO[]>>(`${this.apiUrl}/unassigned`);
  }
}
