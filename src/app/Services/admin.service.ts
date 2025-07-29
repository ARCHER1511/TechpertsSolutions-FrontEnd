import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingProducts: number;
  activeOrders: number;
  completedOrders: number;
}

export interface AdminResponse {
  success: boolean;
  message: string;
  data: Admin[];
}

export interface SingleAdminResponse {
  success: boolean;
  message: string;
  data: Admin;
}

export interface AdminStatsResponse {
  success: boolean;
  message: string;
  data: AdminStats;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${Environment.baseUrl}/Admins`;

  constructor(private http: HttpClient) {}

  // Get all admins
  getAllAdmins(): Observable<AdminResponse> {
    return this.http.get<AdminResponse>(`${this.apiUrl}/all`);
  }

  // Get admin by ID
  getAdminById(id: string): Observable<SingleAdminResponse> {
    return this.http.get<SingleAdminResponse>(`${this.apiUrl}/${id}`);
  }

  // Get pending products
  getPendingProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/pending`);
  }

  // Approve product
  approveProduct(productId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${productId}/approve`, {});
  }

  // Reject product
  rejectProduct(productId: string, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${productId}/reject`, { reason });
  }

  // Get all orders
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  // Get orders by status
  getOrdersByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/status/${status}`);
  }

  // Update order status
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/status`, { status });
  }

  // Mark order as in progress
  markOrderInProgress(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/mark-in-progress`, {});
  }

  // Mark order as delivered
  markOrderDelivered(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/mark-delivered`, {});
  }

  // Mark order as pending
  markOrderPending(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/mark-pending`, {});
  }

  // Get dashboard stats
  getDashboardStats(): Observable<AdminStatsResponse> {
    return this.http.get<AdminStatsResponse>(`${this.apiUrl}/dashboard/stats`);
  }
}
