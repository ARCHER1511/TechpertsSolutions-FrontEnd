import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

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

  createDelivery(delivery: Partial<Delivery>): Observable<SingleDeliveryResponse> {
    return this.http.post<SingleDeliveryResponse>(`${this.apiUrl}`, delivery);
  }

  updateDelivery(id: string, delivery: Partial<Delivery>): Observable<SingleDeliveryResponse> {
    return this.http.put<SingleDeliveryResponse>(`${this.apiUrl}/${id}`, delivery);
  }

  deleteDelivery(id: string): Observable<SingleDeliveryResponse> {
    return this.http.delete<SingleDeliveryResponse>(`${this.apiUrl}/${id}`);
  }

  getDeliveryDetails(id: string): Observable<SingleDeliveryResponse> {
    return this.http.get<SingleDeliveryResponse>(`${this.apiUrl}/details/${id}`);
  }

  getDeliveriesByDeliveryPerson(deliveryPersonId: string): Observable<DeliveryResponse> {
    return this.http.get<DeliveryResponse>(`${this.apiUrl}/deliveryperson/${deliveryPersonId}`);
  }

  getDeliveriesByStatus(status: string): Observable<DeliveryResponse> {
    return this.http.get<DeliveryResponse>(`${this.apiUrl}/status/${status}`);
  }
} 