import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface TechCompany {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  active: boolean;
  registrationDate?: string;
  services?: string[];
}

export interface TechCompanyResponse {
  success: boolean;
  message: string;
  data: TechCompany[];
}

export interface SingleTechCompanyResponse {
  success: boolean;
  message: string;
  data: TechCompany;
}

@Injectable({
  providedIn: 'root'
})
export class TechCompanyService {
  private apiUrl = `${Environment.baseUrl}/TechCompany`;

  constructor(private http: HttpClient) {}

  // Create new tech company
  createTechCompany(techCompany: Partial<TechCompany>): Observable<any> {
    return this.http.post(this.apiUrl, techCompany);
  }

  // Get all tech companies
  getAllTechCompanies(): Observable<TechCompanyResponse> {
    return this.http.get<TechCompanyResponse>(this.apiUrl);
  }

  // Get tech company by ID
  getTechCompanyById(id: string): Observable<SingleTechCompanyResponse> {
    return this.http.get<SingleTechCompanyResponse>(`${this.apiUrl}/${id}`);
  }

  // Update tech company
  updateTechCompany(id: string, techCompany: Partial<TechCompany>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, techCompany);
  }

  // Delete tech company
  deleteTechCompany(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 