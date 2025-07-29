import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  active: boolean;
  registrationDate?: string;
  lastLoginDate?: string;
}

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer[];
}

export interface SingleCustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${Environment.baseUrl}/Customers`;

  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/All`);
  }

  getCustomerById(id: string): Observable<SingleCustomerResponse> {
    return this.http.get<SingleCustomerResponse>(`${this.apiUrl}/${id}`);
  }

  getActiveCustomers(): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/Active`);
  }

  searchCustomers(query: string): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/Search?query=${encodeURIComponent(query)}`);
  }
} 