import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly baseUrl = `${Environment.baseUrl}/admins`;

  constructor(private http: HttpClient) { }

  // Admin Endpoints
  getAllAdmins(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getAdminById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Product Management
  getPendingProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/pending`);
  }

  approveProduct(productId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/products/${productId}/approve`, {});
  }

  rejectProduct(productId: string, reason: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/products/${productId}/reject`, JSON.stringify(reason), { headers });
  }

  // Order Management
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders`);
  }

  getOrdersByStatus(status: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/status/${status}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}/status?statusUpdate=${status}`, {});
  }

  markOrderInProgress(orderId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}/mark-in-progress`, {});
  }

  markOrderDelivered(orderId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}/mark-delivered`, {});
  }

  markOrderPending(orderId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}/mark-pending`, {});
  }

  // Dashboard Stats
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/stats`);
  }
}
