import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';
import { DeliveryClusterTracking, DeliveryCreateDTO } from '../Interfaces/idelivery';
import { GeneralResponse } from './cart.service';

export interface Delivery {
  id: string;
  orderId: string;
  deliveryPersonId: string;
  status: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  trackingNumber: string;
  deliveryAddress: string;
  customerPhone: string;
  notes?: string;
}

export interface DeliveryResponse {
  success: boolean;
  message: string;
  data: Delivery[];
}

export interface SingleDeliveryResponse {
  success: boolean;
  message: string;
  data: Delivery;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = Environment.baseUrl + '/Delivery';

  constructor(private http: HttpClient) {}
  
  getAllDeliveries(): Observable<DeliveryResponse> {
    return this.http.get<DeliveryResponse>(`${this.apiUrl}`);
  }
  
  getDeliveryById(id: string): Observable<SingleDeliveryResponse> {
    return this.http.get<SingleDeliveryResponse>(`${this.apiUrl}/${id}`);
  }
  
  getDeliveriesByDeliveryPerson(deliveryPersonId: string): Observable<DeliveryResponse> {
    return this.http.get<DeliveryResponse>(`${this.apiUrl}/deliveryperson/${deliveryPersonId}`);
  }
  create(dto: DeliveryCreateDTO): Observable<GeneralResponse<Delivery>> {
    return this.http.post<GeneralResponse<Delivery>>(this.apiUrl, dto);
  }

  delete(id: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.apiUrl}/${id}`);
  }

  // --- Driver / Cluster Assignments ---
  assignDriver(clusterId: string, driverId: string): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(
      `${this.apiUrl}/assign-driver?clusterId=${clusterId}&driverId=${driverId}`, {}
    );
  }

  acceptDelivery(clusterId: string, driverId: string): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(
      `${this.apiUrl}/accept?clusterId=${clusterId}&driverId=${driverId}`, {}
    );
  }

  declineDelivery(clusterId: string, driverId: string): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(
      `${this.apiUrl}/decline?clusterId=${clusterId}&driverId=${driverId}`, {}
    );
  }

  cancelDelivery(deliveryId: string): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(
      `${this.apiUrl}/cancel/${deliveryId}`, {}
    );
  }

  completeDelivery(deliveryId: string, driverId: string): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(
      `${this.apiUrl}/complete?deliveryId=${deliveryId}&driverId=${driverId}`, {}
    );
  }

  // --- Tracking & Special Queries ---
  getTracking(deliveryId: string): Observable<GeneralResponse<DeliveryClusterTracking>> {
    return this.http.get<GeneralResponse<DeliveryClusterTracking>>(
      `${this.apiUrl}/tracking/${deliveryId}`
    );
  }

  getExpiredOffers(): Observable<GeneralResponse<Delivery[]>> {
    return this.http.get<GeneralResponse<Delivery[]>>(`${this.apiUrl}/expired-offers`);
  }
} 