import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface DeliveryPerson {
  city: string;
  country: string;
  id: string;
  isAvilable: boolean;
  phoneNumber: string;
  roleId: string;
  roleName: string;
  userFullName: string;
  userId: string;
  userName: string;
  vehicleNumber: string;
  vehicleType: string;
}

export interface DeliveryPersonResponse {
  success: boolean;
  message: string;
  data: DeliveryPerson[];
}

export interface SingleDeliveryPersonResponse {
  success: boolean;
  message: string;
  data: DeliveryPerson;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryPersonService {
  private apiUrl = `${Environment.baseUrl}/DeliveryPerson`;

  constructor(private http: HttpClient) {}

  // Create new delivery person
  createDeliveryPerson(deliveryPerson: Partial<DeliveryPerson>): Observable<any> {
    return this.http.post(this.apiUrl, deliveryPerson);
  }

  // Get all delivery persons
  getAllDeliveryPersons(): Observable<DeliveryPersonResponse> {
    return this.http.get<DeliveryPersonResponse>(this.apiUrl);
  }

  // Get delivery person by ID
  getDeliveryPersonById(id: string): Observable<SingleDeliveryPersonResponse> {
    return this.http.get<SingleDeliveryPersonResponse>(`${this.apiUrl}/${id}`);
  }

  // Update delivery person
  updateDeliveryPerson(id: string, deliveryPerson: Partial<DeliveryPerson>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, deliveryPerson);
  }

  // Delete delivery person
  deleteDeliveryPerson(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Get available delivery persons
  getAvailableDeliveryPersons(): Observable<DeliveryPersonResponse> {
    return this.http.get<DeliveryPersonResponse>(`${this.apiUrl}/available`);
  }
} 